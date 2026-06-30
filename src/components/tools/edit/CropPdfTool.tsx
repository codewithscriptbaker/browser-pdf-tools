"use client";

import { useEffect, useState } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { FileDropzone } from "@/components/tools/FileDropzone";
import { ToolButton } from "@/components/tools/ToolButton";
import { downloadBlob, toPdfBlob } from "@/lib/pdf/download";
import { cropPdf } from "@/lib/pdf/crop";

export function CropPdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [margin, setMargin] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!file) return;
    import("@/lib/pdf/text-extract").then(async ({ loadPdfFromFile }) => {
      const pdf = await loadPdfFromFile(file);
      setPageCount(pdf.numPages);
    });
  }, [file]);

  const handleCrop = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const m = margin;
      const bytes = await cropPdf(file, { top: m, right: m, bottom: m, left: m });
      downloadBlob(toPdfBlob(bytes), `${file.name.replace(/\.pdf$/i, "")}_cropped.pdf`);
    } catch {
      setError("Failed to crop PDF.");
    } finally {
      setLoading(false);
    }
  };

  if (!file) {
    return (
      <FileDropzone onFiles={(f) => setFile(f[0])} label="Drop a PDF to crop" hint="Trim margins from every page" />
    );
  }

  return (
    <ToolWorkspace
      file={file}
      pageCount={pageCount}
      showPageGrid={false}
      settingsTitle="Crop margins"
      onRemove={() => setFile(null)}
      error={error}
      settings={
        <div>
          <label className="mb-2 block text-sm font-medium">
            Trim from each edge ({margin}%)
          </label>
          <input
            type="range"
            min={1}
            max={25}
            value={margin}
            onChange={(e) => setMargin(Number(e.target.value))}
            className="w-full max-w-md accent-teal-600"
          />
          <p className="mt-2 text-xs text-zinc-500">
            Crops the same percentage from top, right, bottom, and left on every page.
          </p>
        </div>
      }
      action={
        <ToolButton onClick={handleCrop} loading={loading} size="large">
          Crop PDF
        </ToolButton>
      }
    />
  );
}
