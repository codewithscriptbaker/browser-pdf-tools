"use client";

import { formatFileSize } from "@/lib/pdf/download";
import { PdfPageGrid } from "@/components/tools/preview/PdfPageGrid";
import { usePdfThumbnails } from "@/hooks/usePdfThumbnails";
import { ToolError } from "@/components/tools/ToolError";

interface ToolWorkspaceProps {
  file: File;
  pageCount: number;
  selectedPages?: Set<number>;
  onTogglePage?: (pageIndex: number) => void;
  onSelectAll?: () => void;
  onClearSelection?: () => void;
  onRemove: () => void;
  settings?: React.ReactNode;
  settingsTitle?: string;
  action: React.ReactNode;
  actionHint?: string;
  error?: string | null;
  previewError?: string | null;
  note?: React.ReactNode;
  showPageGrid?: boolean;
  pageGridTitle?: string;
  gridProps?: {
    rotationPreview?: number;
    rotateOnlySelected?: boolean;
    rangeGroups?: { label: string; pages: Set<number> }[];
  };
}

export function ToolWorkspace({
  file,
  pageCount,
  selectedPages,
  onTogglePage,
  onSelectAll,
  onClearSelection,
  onRemove,
  settings,
  settingsTitle = "Options",
  action,
  actionHint = "Your file stays on your device — nothing is uploaded.",
  error,
  previewError,
  note,
  showPageGrid = true,
  pageGridTitle = "Pages",
  gridProps,
}: ToolWorkspaceProps) {
  const { thumbnails, loading, error: thumbError } = usePdfThumbnails(file);
  const showSelection = Boolean(onTogglePage && onSelectAll && onClearSelection);
  const selectedCount = selectedPages?.size ?? 0;

  return (
    <div className="space-y-5">
      {/* File card */}
      <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 text-lg font-bold text-white shadow-md">
          PDF
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-semibold text-zinc-900 dark:text-zinc-50">
            {file.name}
          </p>
          <p className="mt-0.5 text-sm text-zinc-500">
            {formatFileSize(file.size)} · {pageCount} page{pageCount !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-zinc-600 dark:text-zinc-400 dark:hover:border-red-800 dark:hover:bg-red-950/30 dark:hover:text-red-400"
        >
          Remove file
        </button>
      </div>

      {/* Settings panel */}
      {settings && (
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
          <h2 className="mb-5 text-sm font-semibold uppercase tracking-wide text-zinc-500">
            {settingsTitle}
          </h2>
          {settings}
        </section>
      )}

      {note && (
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-700 dark:bg-zinc-900/60">
          {note}
        </div>
      )}

      {(error || previewError || thumbError) && (
        <ToolError message={error ?? previewError ?? thumbError ?? ""} />
      )}

      {/* Page grid */}
      {showPageGrid && (
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
              {pageGridTitle}
            </h2>
            {showSelection && (
              <div className="flex items-center gap-3 text-sm">
                <span className="text-zinc-600 dark:text-zinc-400">
                  <span className="font-semibold text-teal-600 dark:text-teal-400">
                    {selectedCount}
                  </span>{" "}
                  of {pageCount} selected
                </span>
                <button
                  type="button"
                  onClick={onSelectAll}
                  className="rounded-lg bg-teal-50 px-3 py-1.5 text-xs font-medium text-teal-700 hover:bg-teal-100 dark:bg-teal-950/40 dark:text-teal-300"
                >
                  Select all
                </button>
                <button
                  type="button"
                  onClick={onClearSelection}
                  disabled={selectedCount === 0}
                  className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-50 disabled:opacity-40 dark:border-zinc-600 dark:text-zinc-400"
                >
                  Clear
                </button>
              </div>
            )}
          </div>
          <p className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
            Click a page to select · double-click or use ⛶ for fullscreen preview
          </p>
          <PdfPageGrid
            thumbnails={thumbnails}
            loading={loading}
            selectedPages={selectedPages}
            onTogglePage={onTogglePage}
            viewerTitle={file.name}
            {...gridProps}
          />
        </section>
      )}

      {/* Action footer */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-teal-200 bg-gradient-to-r from-teal-50 to-emerald-50 px-6 py-5 dark:border-teal-800 dark:from-teal-950/40 dark:to-emerald-950/30">
        <p className="max-w-md text-sm text-teal-900 dark:text-teal-200">{actionHint}</p>
        <div className="shrink-0">{action}</div>
      </div>
    </div>
  );
}
