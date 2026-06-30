"use client";

import { useEffect, useState } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { FileDropzone } from "@/components/tools/FileDropzone";
import { ToolButton } from "@/components/tools/ToolButton";
import { downloadBlob, toPdfBlob } from "@/lib/pdf/download";
import { unlockPdf } from "@/lib/pdf/unlock";

export function UnlockPdfTool() {
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

  const handleUnlock = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const bytes = await unlockPdf(file);
      downloadBlob(toPdfBlob(bytes), `${file.name.replace(/\.pdf$/i, "")}_unlocked.pdf`);
    } catch {
      setError("Could not unlock PDF. The file may be severely protected or corrupted.");
    } finally {
      setLoading(false);
    }
  };

  if (!file) {
    return (
      <FileDropzone
        onFiles={(f) => setFile(f[0])}
        label="Drop a protected PDF"
        hint="Creates an unrestricted copy when possible — processed locally"
      />
    );
  }

  return (
    <ToolWorkspace
      file={file}
      pageCount={pageCount}
      showPageGrid={false}
      settingsTitle="Unlock"
      onRemove={() => setFile(null)}
      error={error}
      settings={
        <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          This rebuilds your PDF without encryption flags. It works on many password-protected files.
          Strong DRM or certificate-based locks may not be removable in the browser.
        </p>
      }
      action={
        <ToolButton onClick={handleUnlock} loading={loading} size="large">
          Unlock PDF
        </ToolButton>
      }
    />
  );
}
