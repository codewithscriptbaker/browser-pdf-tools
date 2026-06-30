"use client";

import { useEffect, useState } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { FileDropzone } from "@/components/tools/FileDropzone";
import { ToolButton } from "@/components/tools/ToolButton";
import { downloadBlob, toPdfBlob } from "@/lib/pdf/download";
import { redactPdf } from "@/lib/pdf/redact";

export function RedactPdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [terms, setTerms] = useState("");
  const [scope, setScope] = useState<"all" | "selected">("all");
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!file) return;
    import("@/lib/pdf/text-extract").then(async ({ loadPdfFromFile }) => {
      const pdf = await loadPdfFromFile(file);
      setPageCount(pdf.numPages);
    });
  }, [file]);

  const handleRedact = async () => {
    if (!file) return;
    const searchTerms = terms.split(",").map((t) => t.trim()).filter(Boolean);
    if (searchTerms.length === 0) {
      setError("Enter words or phrases separated by commas.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const pageIndices =
        scope === "selected" ? [...selectedPages].sort((a, b) => a - b) : undefined;
      if (scope === "selected" && (!pageIndices || pageIndices.length === 0)) {
        setError("Select at least one page.");
        setLoading(false);
        return;
      }
      const bytes = await redactPdf(file, searchTerms, pageIndices);
      downloadBlob(toPdfBlob(bytes), `${file.name.replace(/\.pdf$/i, "")}_redacted.pdf`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Redaction failed.");
    } finally {
      setLoading(false);
    }
  };

  if (!file) {
    return (
      <FileDropzone
        onFiles={(f) => setFile(f[0])}
        label="Drop a PDF to redact"
        hint="Black out matching text on your pages"
      />
    );
  }

  return (
    <ToolWorkspace
      file={file}
      pageCount={pageCount}
      settingsTitle="Redaction"
      selectedPages={scope === "selected" ? selectedPages : undefined}
      onTogglePage={
        scope === "selected"
          ? (i) =>
              setSelectedPages((prev) => {
                const next = new Set(prev);
                if (next.has(i)) next.delete(i);
                else next.add(i);
                return next;
              })
          : undefined
      }
      onSelectAll={
        scope === "selected"
          ? () => setSelectedPages(new Set(Array.from({ length: pageCount }, (_, i) => i)))
          : undefined
      }
      onClearSelection={scope === "selected" ? () => setSelectedPages(new Set()) : undefined}
      onRemove={() => setFile(null)}
      error={error}
      settings={
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">Words or phrases to redact</label>
            <input
              type="text"
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
              placeholder="e.g. John Smith, 555-1234, CONFIDENTIAL"
              className="w-full max-w-lg rounded-xl border-2 border-zinc-200 px-4 py-3 text-sm dark:border-zinc-600 dark:bg-zinc-800"
            />
            <p className="mt-2 text-xs text-zinc-500">Separate multiple terms with commas. Case-insensitive match.</p>
          </div>
          <div className="flex gap-2">
            {(["all", "selected"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setScope(s)}
                className={`rounded-xl border-2 px-4 py-2 text-sm font-medium ${
                  scope === s ? "border-teal-500 bg-teal-600 text-white" : "border-zinc-200 dark:border-zinc-600"
                }`}
              >
                {s === "all" ? "All pages" : "Selected pages"}
              </button>
            ))}
          </div>
        </div>
      }
      action={
        <ToolButton onClick={handleRedact} loading={loading} size="large">
          Redact PDF
        </ToolButton>
      }
    />
  );
}
