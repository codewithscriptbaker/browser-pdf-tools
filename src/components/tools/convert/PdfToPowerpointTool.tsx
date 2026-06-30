"use client";

import { useEffect, useState } from "react";
import { OptionCards } from "@/components/tools/OptionCards";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { FileDropzone } from "@/components/tools/FileDropzone";
import { ToolButton } from "@/components/tools/ToolButton";
import { downloadBlob } from "@/lib/pdf/download";
import { pdfToPowerpoint } from "@/lib/pdf/pdf-to-powerpoint";
import type { JpgQuality } from "@/lib/pdf/pdf-to-jpg";

export function PdfToPowerpointTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
  const [quality, setQuality] = useState<JpgQuality>("medium");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!file) return;
    import("@/lib/pdf/text-extract").then(async ({ loadPdfFromFile }) => {
      const pdf = await loadPdfFromFile(file);
      const count = pdf.numPages;
      setPageCount(count);
      setSelectedPages(new Set(Array.from({ length: count }, (_, i) => i)));
    });
  }, [file]);

  const handleConvert = async () => {
    if (!file || selectedPages.size === 0) return;
    setLoading(true);
    setError(null);
    try {
      const indices = [...selectedPages].sort((a, b) => a - b);
      const blob = await pdfToPowerpoint(file, indices, quality);
      downloadBlob(blob, `${file.name.replace(/\.pdf$/i, "")}.pptx`);
    } catch {
      setError("Conversion failed. Try fewer pages or lower quality.");
    } finally {
      setLoading(false);
    }
  };

  if (!file) {
    return (
      <FileDropzone
        onFiles={(f) => setFile(f[0])}
        label="Drop a PDF to convert to PowerPoint"
        hint="Each page becomes a slide image"
      />
    );
  }

  return (
    <ToolWorkspace
      file={file}
      pageCount={pageCount}
      settingsTitle="Export settings"
      selectedPages={selectedPages}
      onTogglePage={(i) =>
        setSelectedPages((prev) => {
          const next = new Set(prev);
          if (next.has(i)) next.delete(i);
          else next.add(i);
          return next;
        })
      }
      onSelectAll={() =>
        setSelectedPages(new Set(Array.from({ length: pageCount }, (_, i) => i)))
      }
      onClearSelection={() => setSelectedPages(new Set())}
      onRemove={() => setFile(null)}
      error={error}
      settings={
        <OptionCards
          label="Slide image quality"
          value={quality}
          onChange={setQuality}
          columns={3}
          options={[
            { value: "high", label: "High", hint: "Sharpest slides" },
            { value: "medium", label: "Medium", hint: "Balanced" },
            { value: "low", label: "Low", hint: "Smaller file" },
          ]}
        />
      }
      action={
        <ToolButton onClick={handleConvert} loading={loading} disabled={selectedPages.size === 0} size="large">
          Download PowerPoint
        </ToolButton>
      }
    />
  );
}
