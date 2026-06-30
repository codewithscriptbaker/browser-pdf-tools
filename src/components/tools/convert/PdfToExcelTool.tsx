"use client";

import { useEffect, useState } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { FileDropzone } from "@/components/tools/FileDropzone";
import { ToolButton } from "@/components/tools/ToolButton";
import { downloadBlob } from "@/lib/pdf/download";
import { pdfToExcel } from "@/lib/pdf/pdf-to-excel";

export function PdfToExcelTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
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
      const blob = await pdfToExcel(file, indices);
      downloadBlob(blob, `${file.name.replace(/\.pdf$/i, "")}.xlsx`);
    } catch {
      setError("Conversion failed. Try a PDF with clear table layout.");
    } finally {
      setLoading(false);
    }
  };

  if (!file) {
    return (
      <FileDropzone
        onFiles={(files) => {
          setFile(files[0]);
          setError(null);
        }}
        multiple={false}
        label="Drop a PDF to convert to Excel"
        hint="Each selected page becomes one worksheet"
      />
    );
  }

  return (
    <ToolWorkspace
      file={file}
      pageCount={pageCount}
      settingsTitle="How it works"
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
      onRemove={() => {
        setFile(null);
        setSelectedPages(new Set());
        setPageCount(0);
      }}
      error={error}
      settings={
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 dark:border-amber-800 dark:bg-amber-950/20">
          <p className="text-sm leading-relaxed text-amber-900 dark:text-amber-200">
            Text is extracted from each page and arranged into rows and columns using layout
            heuristics. Works best on PDFs with tables or clearly aligned columns. Each selected
            page becomes a separate worksheet in the downloaded .xlsx file.
          </p>
        </div>
      }
      action={
        <ToolButton onClick={handleConvert} loading={loading} disabled={selectedPages.size === 0} size="large">
          Download Excel (.xlsx)
        </ToolButton>
      }
    />
  );
}
