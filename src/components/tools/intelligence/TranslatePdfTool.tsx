"use client";

import { useEffect, useState } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { FileDropzone } from "@/components/tools/FileDropzone";
import { ToolButton } from "@/components/tools/ToolButton";
import { downloadBlob, toPdfBlob } from "@/lib/pdf/download";
import { TRANSLATE_LANGUAGES, translatePdf, type TranslateLang } from "@/lib/pdf/translate";

export function TranslatePdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
  const [from, setFrom] = useState<TranslateLang>("en");
  const [to, setTo] = useState<TranslateLang>("es");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<string | null>(null);

  useEffect(() => {
    if (!file) return;
    import("@/lib/pdf/text-extract").then(async ({ loadPdfFromFile }) => {
      const pdf = await loadPdfFromFile(file);
      const count = pdf.numPages;
      setPageCount(count);
      setSelectedPages(new Set(Array.from({ length: count }, (_, i) => i)));
    });
  }, [file]);

  const handleTranslate = async () => {
    if (!file || selectedPages.size === 0) return;
    setLoading(true);
    setError(null);
    setProgress("Starting…");
    try {
      const indices = [...selectedPages].sort((a, b) => a - b);
      const bytes = await translatePdf(file, indices, from, to, setProgress);
      downloadBlob(toPdfBlob(bytes), `${file.name.replace(/\.pdf$/i, "")}_${to}.pdf`);
      setProgress(null);
    } catch {
      setError("Translation failed. Try fewer pages or check your connection.");
      setProgress(null);
    } finally {
      setLoading(false);
    }
  };

  if (!file) {
    return (
      <FileDropzone
        onFiles={(f) => setFile(f[0])}
        label="Drop a PDF to translate"
        hint="Text is sent to a free translation API — see privacy note below"
      />
    );
  }

  return (
    <ToolWorkspace
      file={file}
      pageCount={pageCount}
      settingsTitle="Languages"
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
        setProgress(null);
      }}
      error={error}
      settings={
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">From</label>
              <select
                value={from}
                onChange={(e) => setFrom(e.target.value as TranslateLang)}
                className="w-full rounded-xl border-2 border-zinc-200 px-4 py-3 text-sm dark:border-zinc-600 dark:bg-zinc-800"
              >
                {TRANSLATE_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>{l.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">To</label>
              <select
                value={to}
                onChange={(e) => setTo(e.target.value as TranslateLang)}
                className="w-full rounded-xl border-2 border-zinc-200 px-4 py-3 text-sm dark:border-zinc-600 dark:bg-zinc-800"
              >
                {TRANSLATE_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>{l.label}</option>
                ))}
              </select>
            </div>
          </div>
          {progress && <p className="text-sm text-teal-600 dark:text-teal-400">{progress}</p>}
          <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
            Extracted text is sent to MyMemory Translation API to translate. For maximum privacy, use
            OCR PDF or PDF to Word locally first, then translate offline.
          </p>
        </div>
      }
      action={
        <ToolButton onClick={handleTranslate} loading={loading} disabled={selectedPages.size === 0} size="large">
          Translate & download PDF
        </ToolButton>
      }
    />
  );
}
