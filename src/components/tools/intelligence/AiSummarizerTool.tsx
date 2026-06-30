"use client";

import { useEffect, useState } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { FileDropzone } from "@/components/tools/FileDropzone";
import { ToolButton } from "@/components/tools/ToolButton";
import { downloadBlob } from "@/lib/pdf/download";
import { summarizePdf } from "@/lib/pdf/summarize";

export function AiSummarizerTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
  const [summary, setSummary] = useState<string | null>(null);
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

  const handleSummarize = async () => {
    if (!file || selectedPages.size === 0) return;
    setLoading(true);
    setError(null);
    setSummary(null);
    try {
      const indices = [...selectedPages].sort((a, b) => a - b);
      const text = await summarizePdf(file, indices);
      setSummary(text);
    } catch {
      setError("Could not summarize — the PDF may have no extractable text.");
    } finally {
      setLoading(false);
    }
  };

  if (!file) {
    return (
      <FileDropzone
        onFiles={(f) => setFile(f[0])}
        label="Drop a PDF to summarize"
        hint="Extractive summary — runs locally, no AI API"
      />
    );
  }

  return (
    <div className="space-y-5">
      <ToolWorkspace
        file={file}
        pageCount={pageCount}
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
          setSummary(null);
        }}
        error={error}
        settingsTitle="Summarization"
        settings={
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Picks the most important sentences using on-device text analysis — no data sent to external AI.
          </p>
        }
        action={
          <ToolButton onClick={handleSummarize} loading={loading} disabled={selectedPages.size === 0} size="large">
            Generate summary
          </ToolButton>
        }
      />
      {summary && (
        <section className="rounded-2xl border border-teal-200 bg-teal-50 p-6 dark:border-teal-800 dark:bg-teal-950/30">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-teal-800 dark:text-teal-200">
            Summary
          </h2>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-teal-900 dark:text-teal-100">{summary}</p>
          <ToolButton
            variant="secondary"
            onClick={() =>
              downloadBlob(new Blob([summary], { type: "text/plain" }), "summary.txt")
            }
          >
            Download .txt
          </ToolButton>
        </section>
      )}
    </div>
  );
}
