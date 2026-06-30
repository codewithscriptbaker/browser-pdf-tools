"use client";

import { useState } from "react";
import { FileDropzone } from "@/components/tools/FileDropzone";
import { ToolButton } from "@/components/tools/ToolButton";
import { ToolError } from "@/components/tools/ToolError";
import { downloadBlob, toPdfBlob } from "@/lib/pdf/download";
import { powerpointToPdf } from "@/lib/pdf/powerpoint-to-pdf";

export function PowerpointToPdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConvert = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const bytes = await powerpointToPdf(file);
      downloadBlob(toPdfBlob(bytes), `${file.name.replace(/\.pptx?$/i, "")}.pdf`);
    } catch {
      setError("Conversion failed. Use a valid .pptx file.");
    } finally {
      setLoading(false);
    }
  };

  if (!file) {
    return (
      <FileDropzone
        onFiles={(f) => setFile(f[0])}
        accept={{
          "application/vnd.openxmlformats-officedocument.presentationml.presentation": [".pptx"],
        }}
        label="Drop a PowerPoint file"
        hint=".pptx — slide text is extracted into a PDF"
      />
    );
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900">
        <p className="font-semibold">{file.name}</p>
        <p className="mt-1 text-sm text-zinc-500">Each slide becomes a section in the PDF.</p>
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
