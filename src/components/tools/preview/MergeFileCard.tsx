"use client";

import { useState } from "react";
import { usePdfCoverThumbnail } from "@/hooks/usePdfCoverThumbnail";
import { formatFileSize } from "@/lib/pdf/download";
import { PageViewerModal } from "./PageViewerModal";
import { PdfThumbnail } from "./PdfThumbnail";

interface MergeFileCardProps {
  file: File;
  index: number;
  onRemove: () => void;
  draggable?: boolean;
  onDragStart?: () => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: () => void;
  isDragTarget?: boolean;
}

export function MergeFileCard({
  file,
  index,
  onRemove,
  draggable = true,
  onDragStart,
  onDragOver,
  onDrop,
  isDragTarget = false,
}: MergeFileCardProps) {
  const { thumbnail, pageCount, loading, error } = usePdfCoverThumbnail(file);
  const [showViewer, setShowViewer] = useState(false);

  return (
    <>
      <div
        draggable={draggable}
        onDragStart={(e) => {
          e.dataTransfer.effectAllowed = "move";
          onDragStart?.();
        }}
        onDragOver={(e) => {
          e.preventDefault();
          onDragOver?.(e);
        }}
        onDrop={(e) => {
          e.preventDefault();
          onDrop?.();
        }}
        className={`relative w-36 shrink-0 rounded-xl border-2 bg-white p-2 transition-all dark:bg-zinc-900 ${
          isDragTarget
            ? "border-teal-500 shadow-md"
            : "border-zinc-200 dark:border-zinc-700"
        }`}
      >
        <span className="absolute -left-2 -top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-teal-600 text-xs font-bold text-white shadow">
          {index + 1}
        </span>

        <button
          type="button"
          onClick={onRemove}
          className="absolute -right-2 -top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-zinc-800 text-xs text-white shadow hover:bg-red-600"
          aria-label={`Remove ${file.name}`}
        >
          ✕
        </button>

        <PdfThumbnail
          src={thumbnail}
          loading={loading}
          onPreview={thumbnail ? () => setShowViewer(true) : undefined}
          className="w-full"
        />

        <p className="mt-2 truncate text-xs font-medium text-zinc-800 dark:text-zinc-200">
          {file.name}
        </p>
        <p className="truncate text-[10px] text-zinc-500">
          {formatFileSize(file.size)}
          {pageCount > 0 && ` · ${pageCount} pg`}
          {error && " · preview failed"}
        </p>
        <p className="mt-1 text-center text-[10px] text-zinc-400">Drag to reorder</p>
      </div>

      {showViewer && thumbnail && (
        <PageViewerModal
          thumbnails={[thumbnail]}
          pageIndex={0}
          title={file.name}
          onClose={() => setShowViewer(false)}
          onPageChange={() => {}}
        />
      )}
    </>
  );
}
