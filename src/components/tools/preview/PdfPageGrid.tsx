"use client";

import { useState } from "react";
import { PageViewerModal } from "./PageViewerModal";
import { PdfThumbnail } from "./PdfThumbnail";

interface PdfPageGridProps {
  thumbnails: (string | null)[];
  loading?: boolean;
  selectedPages?: Set<number>;
  onTogglePage?: (pageIndex: number) => void;
  rotationPreview?: number;
  rotateOnlySelected?: boolean;
  rangeGroups?: { label: string; pages: Set<number> }[];
  emptyMessage?: string;
  viewerTitle?: string;
  compact?: boolean;
}

export function PdfPageGrid({
  thumbnails,
  loading = false,
  selectedPages,
  onTogglePage,
  rotationPreview = 0,
  rotateOnlySelected = false,
  rangeGroups,
  emptyMessage = "Page previews will appear here",
  viewerTitle = "Page preview",
  compact = false,
}: PdfPageGridProps) {
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const selectable = Boolean(onTogglePage);

  const getRangeColor = (pageIndex: number): string | undefined => {
    if (!rangeGroups?.length) return undefined;
    const groupIndex = rangeGroups.findIndex((g) => g.pages.has(pageIndex));
    if (groupIndex < 0) return undefined;
    const colors = [
      "ring-2 ring-amber-400",
      "ring-2 ring-violet-400",
      "ring-2 ring-rose-400",
      "ring-2 ring-sky-400",
    ];
    return colors[groupIndex % colors.length];
  };

  if (!loading && thumbnails.length === 0) {
    return (
      <div className="flex min-h-[200px] items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900/50">
        <p className="text-sm text-zinc-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <>
      <div
        className={
          compact
            ? "grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8"
            : "grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
        }
      >
        {thumbnails.map((thumb, index) => {
          const selected = selectedPages?.has(index) ?? false;
          const showRotation =
            rotationPreview !== 0 && (!rotateOnlySelected || selected);
          const rangeRing = getRangeColor(index);

          return (
            <div key={index} className={rangeRing}>
              <PdfThumbnail
                src={thumb}
                pageNumber={index + 1}
                selected={selectable ? selected : undefined}
                onClick={selectable ? () => onTogglePage?.(index) : undefined}
                onPreview={() => setViewerIndex(index)}
                rotation={showRotation ? rotationPreview : 0}
                loading={loading && !thumb}
                compact={compact}
              />
            </div>
          );
        })}
      </div>

      {viewerIndex !== null && (
        <PageViewerModal
          thumbnails={thumbnails}
          pageIndex={viewerIndex}
          title={viewerTitle}
          onClose={() => setViewerIndex(null)}
          onPageChange={setViewerIndex}
        />
      )}
    </>
  );
}
