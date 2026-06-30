"use client";

import { useEffect, useState } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { FileDropzone } from "@/components/tools/FileDropzone";
import { ToolButton } from "@/components/tools/ToolButton";
import { downloadBlob, toPdfBlob } from "@/lib/pdf/download";
import { pdfToPdfa } from "@/lib/pdf/pdf-to-pdfa";

export function PdfToPdfaTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!file) return;
    import("@/lib/pdf/text-extract").then(async ({ loadPdfFromFile }) => {
      const pdf = await loadPdfFromFile(file);
      setPageCount(pdf.numPages);
    });
  }, [file]);

  const handleConvert = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const bytes = await pdfToPdfa(file);
      downloadBlob(toPdfBlob(bytes), `${file.name.replace(/\.pdf$/i, "")}_pdfa.pdf`);
    } catch {
      setError("Conversion failed.");
    } finally {
      setLoading(false);
    }
  };

  if (!file) {
    return (
      <FileDropzone
        onFiles={(f) => setFile(f[0])}
        label="Drop a PDF for archival conversion"
        hint="Best-effort PDF/A with embedded metadata"
      />
    );
  }

  return (
    <ToolWorkspace
      file={file}
      pageCount={pageCount}
      showPageGrid={false}
      settingsTitle="PDF/A"
      onRemove={() => setFile(null)}
      error={error}
      settings={
        <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          Rebuilds your PDF with archival metadata. Full ISO PDF/A validation is not performed in the
          browser — use for documents that need consistent structure and metadata for long-term storage.
        </p>
      }
      action={
        <ToolButton onClick={handleConvert} loading={loading} size="large">
          Convert to PDF/A
        </ToolButton>
      }
    />
  );
}
