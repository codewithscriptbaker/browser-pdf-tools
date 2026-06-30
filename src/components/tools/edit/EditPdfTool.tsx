"use client";

import { useEffect, useState } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { FileDropzone } from "@/components/tools/FileDropzone";
import { ToolButton } from "@/components/tools/ToolButton";
import { downloadBlob, toPdfBlob } from "@/lib/pdf/download";
import { addTextToPdf } from "@/lib/pdf/edit";

export function EditPdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [text, setText] = useState("");
  const [fontSize, setFontSize] = useState(14);
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

  const handleApply = async () => {
    if (!file || !text.trim()) return;
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
      const bytes = await addTextToPdf(file, { text: text.trim(), fontSize, pageIndices });
      downloadBlob(toPdfBlob(bytes), `${file.name.replace(/\.pdf$/i, "")}_edited.pdf`);
    } catch {
      setError("Failed to add text.");
    } finally {
      setLoading(false);
    }
  };

  if (!file) {
    return (
      <FileDropzone onFiles={(f) => setFile(f[0])} label="Drop a PDF to edit" hint="Add text to pages — processed locally" />
    );
  }

  return (
    <ToolWorkspace
      file={file}
      pageCount={pageCount}
      settingsTitle="Add text"
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
        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium">Text to add</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              placeholder="Enter text to place on pages (bottom-left area)…"
              className="w-full rounded-xl border-2 border-zinc-200 px-4 py-3 text-sm dark:border-zinc-600 dark:bg-zinc-800"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Font size ({fontSize}px)</label>
            <input
              type="range"
              min={8}
              max={36}
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-full max-w-md accent-teal-600"
            />
          </div>
          <div className="flex gap-2">
            {(["all", "selected"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setScope(s)}
                className={`rounded-xl border-2 px-4 py-2 text-sm font-medium ${
                  scope === s
                    ? "border-teal-500 bg-teal-600 text-white"
                    : "border-zinc-200 dark:border-zinc-600"
                }`}
              >
                {s === "all" ? "All pages" : "Selected pages"}
              </button>
            ))}
          </div>
        </div>
      }
      action={
        <ToolButton onClick={handleApply} loading={loading} disabled={!text.trim()} size="large">
          Add text to PDF
        </ToolButton>
      }
    />
  );
}
