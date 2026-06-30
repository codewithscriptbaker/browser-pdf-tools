"use client";

import { useEffect, useState } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { FileDropzone } from "@/components/tools/FileDropzone";
import { ToolButton } from "@/components/tools/ToolButton";
import { downloadBlob, toPdfBlob } from "@/lib/pdf/download";
import { repairPdf } from "@/lib/pdf/repair";

export function RepairPdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!file) return;
    import("@/lib/pdf/text-extract").then(async ({ loadPdfFromFile }) => {
      try {
        const pdf = await loadPdfFromFile(file);
        setPageCount(pdf.numPages);
      } catch {
        setPageCount(0);
      }
    });
  }, [file]);

  const handleRepair = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const bytes = await repairPdf(file);
      downloadBlob(toPdfBlob(bytes), `${file.name.replace(/\.pdf$/i, "")}_repaired.pdf`);
    } catch {
      setError("Could not repair this PDF. The file may be too damaged.");
    } finally {
      setLoading(false);
    }
  };

  if (!file) {
    return (
      <FileDropzone
        onFiles={(f) => setFile(f[0])}
        label="Drop a damaged PDF"
        hint="We rebuild the document structure — best for minor corruption"
      />
    );
  }

  return (
    <ToolWorkspace
      file={file}
      pageCount={pageCount}
      showPageGrid={pageCount > 0}
      settingsTitle="Repair"
      onRemove={() => setFile(null)}
      error={error}
      settings={
        <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          Repair reloads every page into a fresh PDF. This fixes many structural issues but cannot
          recover lost data from severely corrupted files.
        </p>
      }
      action={
        <ToolButton onClick={handleRepair} loading={loading} size="large">
          Repair PDF
        </ToolButton>
      }
    />
  );
}
