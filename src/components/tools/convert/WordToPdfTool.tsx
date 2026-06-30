"use client";

import { useState } from "react";
import { FileDropzone } from "@/components/tools/FileDropzone";
import { ToolButton } from "@/components/tools/ToolButton";
import { ToolError } from "@/components/tools/ToolError";
import { downloadBlob, toPdfBlob } from "@/lib/pdf/download";
import { wordToPdf } from "@/lib/pdf/word-to-pdf";

export function WordToPdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConvert = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const bytes = await wordToPdf(file);
      downloadBlob(toPdfBlob(bytes), `${file.name.replace(/\.docx?$/i, "")}.pdf`);
    } catch {
      setError("Conversion failed. Use a valid .docx file.");
    } finally {
      setLoading(false);
    }
  };

  if (!file) {
    return (
      <FileDropzone
        onFiles={(f) => setFile(f[0])}
        accept={{
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
          "application/msword": [".doc"],
        }}
        label="Drop a Word document"
        hint=".docx recommended — converted locally in your browser"
      />
    );
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900">
        <p className="font-semibold text-zinc-900 dark:text-zinc-50">{file.name}</p>
        <p className="mt-1 text-sm text-zinc-500">Text is extracted and laid out into PDF pages.</p>
        <button type="button" onClick={() => setFile(null)} className="mt-3 text-sm text-teal-600 hover:underline">
          Choose another file
        </button>
      </div>
      {error && <ToolError message={error} />}
      <div className="flex justify-end">
        <ToolButton onClick={handleConvert} loading={loading} size="large">
          Convert to PDF
        </ToolButton>
      </div>
    </div>
  );
}
