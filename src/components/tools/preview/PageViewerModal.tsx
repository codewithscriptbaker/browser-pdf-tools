"use client";

import { useCallback, useEffect } from "react";

interface PageViewerModalProps {
  thumbnails: (string | null)[];
  pageIndex: number;
  title?: string;
  onClose: () => void;
  onPageChange: (index: number) => void;
}

export function PageViewerModal({
  thumbnails,
  pageIndex,
  title = "Page preview",
  onClose,
  onPageChange,
}: PageViewerModalProps) {
  const total = thumbnails.length;
  const src = thumbnails[pageIndex];

  const goPrev = useCallback(() => {
    if (pageIndex > 0) onPageChange(pageIndex - 1);
  }, [pageIndex, onPageChange]);

  const goNext = useCallback(() => {
    if (pageIndex < total - 1) onPageChange(pageIndex + 1);
  }, [pageIndex, total, onPageChange]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, goPrev, goNext]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="relative flex max-h-[92vh] w-full max-w-4xl flex-col rounded-2xl bg-white shadow-2xl dark:bg-zinc-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-3 dark:border-zinc-700">
          <div>
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{title}</p>
            <p className="text-xs text-zinc-500">
              Page {pageIndex + 1} of {total}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-1.5 text-sm text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            Close
          </button>
        </div>

        <div className="flex flex-1 items-center justify-center overflow-auto p-6">
          {src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src}
              alt={`Page ${pageIndex + 1}`}
              className="max-h-[70vh] max-w-full rounded-lg object-contain shadow-lg"
            />
          ) : (
            <div className="flex flex-col items-center gap-3 py-20">
              <span className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-teal-600" />
              <p className="text-sm text-zinc-500">Loading page…</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-zinc-200 px-5 py-3 dark:border-zinc-700">
          <button
            type="button"
            onClick={goPrev}
            disabled={pageIndex === 0}
            className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium disabled:opacity-40 dark:border-zinc-600"
          >
            ← Previous
          </button>
          <div className="hidden gap-1 overflow-x-auto sm:flex">
            {thumbnails.map((thumb, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onPageChange(i)}
                className={`shrink-0 overflow-hidden rounded border-2 ${
                  i === pageIndex ? "border-teal-500" : "border-transparent opacity-60"
                }`}
              >
                {thumb ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={thumb} alt="" className="h-12 w-9 object-cover" />
                ) : (
                  <div className="h-12 w-9 bg-zinc-200 dark:bg-zinc-700" />
                )}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={goNext}
            disabled={pageIndex >= total - 1}
            className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium disabled:opacity-40 dark:border-zinc-600"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
