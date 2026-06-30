"use client";

import { useState } from "react";
import { PageViewerModal } from "./PageViewerModal";
import { PdfThumbnail } from "./PdfThumbnail";

interface PdfPreviewPanelProps {
  thumbnails: (string | null)[];
  activePage: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
  title?: string;
  viewerTitle?: string;
}

export function PdfPreviewPanel({
  thumbnails,
  activePage,
  onPageChange,
  loading = false,
  title = "Document preview",
  viewerTitle = "Page preview",
}: PdfPreviewPanelProps) {
  const [showViewer, setShowViewer] = useState(false);
  const activeThumb = thumbnails[activePage] ?? null;

  return (
    <>
      <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-900/50">
        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-zinc-500">{title}</p>

        <div className="mx-auto max-w-xs">
          <PdfThumbnail
            src={activeThumb}
            pageNumber={activePage + 1}
            loading={loading && !activeThumb}
            onPreview={activeThumb ? () => setShowViewer(true) : undefined}
            className="w-full"
          />
        </div>

        {thumbnails.length > 1 && (
          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
            {thumbnails.map((thumb, index) => (
              <button
                key={index}
                type="button"
                onClick={() => onPageChange(index)}
                className={`shrink-0 overflow-hidden rounded-md border-2 transition-colors ${
                  activePage === index
                    ? "border-teal-500"
                    : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                {thumb ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={thumb}
                    alt={`Page ${index + 1}`}
                    className="h-16 w-12 object-cover"
                    draggable={false}
                  />
                ) : (
                  <div className="flex h-16 w-12 items-center justify-center bg-zinc-200 dark:bg-zinc-700">
                    <span className="h-3 w-3 animate-spin rounded-full border border-zinc-400 border-t-teal-600" />
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {showViewer && (
        <PageViewerModal
          thumbnails={thumbnails}
          pageIndex={activePage}
          title={viewerTitle}
          onClose={() => setShowViewer(false)}
          onPageChange={onPageChange}
        />
      )}
    </>
  );
}
