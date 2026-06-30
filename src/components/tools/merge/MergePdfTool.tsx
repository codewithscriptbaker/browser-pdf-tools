"use client";

import { useState } from "react";
import { CompactFileDropzone } from "@/components/tools/CompactFileDropzone";
import { FileDropzone } from "@/components/tools/FileDropzone";
import { MergeFileCard } from "@/components/tools/preview/MergeFileCard";
import { MergePageCard } from "@/components/tools/preview/MergePageCard";
import { PageViewerModal } from "@/components/tools/preview/PageViewerModal";
import { ToolButton } from "@/components/tools/ToolButton";
import { ToolError } from "@/components/tools/ToolError";
import { useMergePages } from "@/hooks/useMergePages";
import { downloadBlob, toPdfBlob } from "@/lib/pdf/download";
import { mergePdfPages, mergePdfs } from "@/lib/pdf/merge";

type ViewMode = "files" | "pages";

export function MergePdfTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("files");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dropTarget, setDropTarget] = useState<number | null>(null);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  const { pages, loading: pagesLoading, error: pagesError, reorderPage, removePage } =
    useMergePages(files);

  const addFiles = (incoming: File[]) => {
    setError(null);
    setFiles((prev) => [...prev, ...incoming]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const reorderFiles = (from: number, to: number) => {
    if (from === to) return;
    setFiles((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(from, 1);
      updated.splice(to, 0, moved);
      return updated;
    });
  };

  const handleMerge = async () => {
    setLoading(true);
    setError(null);

    try {
      if (viewMode === "pages") {
        if (pages.length < 2) {
          setError("Add at least 2 pages to merge (use Page view or add more PDFs).");
          return;
        }
        const order = pages.map((p) => ({ fileIndex: p.fileIndex, pageIndex: p.pageIndex }));
        const result = await mergePdfPages(files, order);
        downloadBlob(toPdfBlob(result), "merged.pdf");
      } else {
        if (files.length < 2) {
          setError("Add at least 2 PDF files to merge.");
          return;
        }
        const result = await mergePdfs(files);
        downloadBlob(toPdfBlob(result), "merged.pdf");
      }
    } catch {
      setError("Failed to merge PDFs. Make sure all files are valid PDFs.");
    } finally {
      setLoading(false);
    }
  };

  const pageThumbnails = pages.map((p) => p.thumbnail);
  const totalPages = pages.length;

  if (files.length === 0) {
    return (
      <FileDropzone
        onFiles={addFiles}
        multiple
        label="Drop PDF files to merge"
        hint="Add 2 or more files — preview and reorder in the workspace below"
      />
    );
  }

  return (
    <div className="space-y-5">
      {/* View mode */}
      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
              View mode
            </h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Reorder whole files or individual pages across all documents.
            </p>
          </div>
          <div className="flex rounded-xl border-2 border-zinc-200 p-1 dark:border-zinc-700">
            <button
              type="button"
              onClick={() => setViewMode("files")}
              className={`rounded-lg px-5 py-2.5 text-sm font-medium transition-colors ${
                viewMode === "files"
                  ? "bg-teal-600 text-white shadow-sm"
                  : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400"
              }`}
            >
              File view
            </button>
            <button
              type="button"
              onClick={() => setViewMode("pages")}
              className={`rounded-lg px-5 py-2.5 text-sm font-medium transition-colors ${
                viewMode === "pages"
                  ? "bg-teal-600 text-white shadow-sm"
                  : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400"
              }`}
            >
              Page view
            </button>
          </div>
        </div>
        <p className="mt-4 text-sm text-zinc-500">
          {files.length} file{files.length !== 1 ? "s" : ""}
          {viewMode === "pages" && ` · ${totalPages} pages`}
        </p>
      </section>

      {/* Content area */}
      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-zinc-500">
          {viewMode === "files" ? "Merge order" : "Page order"}
        </h2>
        <p className="mb-5 text-sm text-zinc-600 dark:text-zinc-400">
          {viewMode === "files"
            ? "Drag file cards to rearrange the merge order."
            : "Drag individual pages to rearrange across all files. Double-click for fullscreen."}
        </p>

        {viewMode === "files" ? (
          <div className="flex flex-wrap gap-4">
            {files.map((file, index) => (
              <MergeFileCard
                key={`${file.name}-${file.size}-${index}`}
                file={file}
                index={index}
                onRemove={() => removeFile(index)}
                onDragStart={() => setDragIndex(index)}
                onDragOver={() => setDropTarget(index)}
                onDrop={() => {
                  if (dragIndex !== null) reorderFiles(dragIndex, index);
                  setDragIndex(null);
                  setDropTarget(null);
                }}
                isDragTarget={dropTarget === index && dragIndex !== index}
              />
            ))}
            <CompactFileDropzone onFiles={addFiles} label="Add PDFs" />
          </div>
        ) : (
          <>
            {pagesError && (
              <p className="mb-4 text-sm text-amber-700 dark:text-amber-300">{pagesError}</p>
            )}
            <div className="flex flex-wrap gap-4">
              {pages.map((page, index) => (
                <MergePageCard
                  key={page.id}
                  thumbnail={page.thumbnail}
                  pageNumber={page.pageIndex + 1}
                  fileName={page.fileName}
                  orderIndex={index}
                  loading={pagesLoading && !page.thumbnail}
                  onRemove={() => removePage(index)}
                  onPreview={() => setViewerIndex(index)}
                  onDragStart={() => setDragIndex(index)}
                  onDragOver={() => setDropTarget(index)}
                  onDrop={() => {
                    if (dragIndex !== null) reorderPage(dragIndex, index);
                    setDragIndex(null);
                    setDropTarget(null);
                  }}
                  isDragTarget={dropTarget === index && dragIndex !== index}
                />
              ))}
              <CompactFileDropzone onFiles={addFiles} label="Add PDFs" />
            </div>
          </>
        )}
      </section>

      {/* Summary */}
      <section className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-700 dark:bg-zinc-900/60">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-zinc-500">
          Output preview
        </h2>
        <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          {viewMode === "pages" ? (
            <>
              Merging <strong>{totalPages} pages</strong> in the order shown above.
            </>
          ) : (
            <>
              Merging <strong>{files.length} documents</strong> in file order. Switch to{" "}
              <strong>Page view</strong> to reorder individual pages.
            </>
          )}
        </p>
      </section>

      {error && <ToolError message={error} />}

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-teal-200 bg-gradient-to-r from-teal-50 to-emerald-50 px-6 py-5 dark:border-teal-800 dark:from-teal-950/40 dark:to-emerald-950/30">
        <p className="text-sm text-teal-900 dark:text-teal-200">
          Your files stay on your device — nothing is uploaded.
        </p>
        <div className="flex gap-3">
          <ToolButton
            onClick={handleMerge}
            disabled={viewMode === "files" ? files.length < 2 : pages.length < 2}
            loading={loading}
            size="large"
          >
            Merge PDF
          </ToolButton>
          <ToolButton variant="secondary" onClick={() => setFiles([])}>
            Clear all
          </ToolButton>
        </div>
      </div>

      {viewerIndex !== null && (
        <PageViewerModal
          thumbnails={pageThumbnails}
          pageIndex={viewerIndex}
          title="Merge page preview"
          onClose={() => setViewerIndex(null)}
          onPageChange={setViewerIndex}
        />
      )}
    </div>
  );
}
