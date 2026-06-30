"use client";

import { PdfThumbnail } from "./PdfThumbnail";

interface MergePageCardProps {
  thumbnail: string | null;
  pageNumber: number;
  fileName: string;
  orderIndex: number;
  loading?: boolean;
  onRemove: () => void;
  onPreview: () => void;
  onDragStart: () => void;
  onDragOver: () => void;
  onDrop: () => void;
  isDragTarget?: boolean;
}

export function MergePageCard({
  thumbnail,
  pageNumber,
  fileName,
  orderIndex,
  loading,
  onRemove,
  onPreview,
  onDragStart,
  onDragOver,
  onDrop,
  isDragTarget,
}: MergePageCardProps) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={(e) => {
        e.preventDefault();
        onDragOver();
      }}
      onDrop={(e) => {
        e.preventDefault();
        onDrop();
      }}
      className={`relative w-28 shrink-0 rounded-xl border-2 bg-white p-1.5 transition-all dark:bg-zinc-900 ${
        isDragTarget ? "border-teal-500 shadow-md" : "border-zinc-200 dark:border-zinc-700"
      }`}
    >
      <span className="absolute -left-1.5 -top-1.5 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-teal-600 text-[10px] font-bold text-white">
        {orderIndex + 1}
      </span>
      <button
        type="button"
        onClick={onRemove}
        className="absolute -right-1.5 -top-1.5 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-zinc-700 text-[10px] text-white hover:bg-red-600"
        aria-label="Remove page"
      >
        ✕
      </button>
      <PdfThumbnail
        src={thumbnail}
        loading={loading}
        onPreview={onPreview}
        className="w-full"
      />
      <p className="mt-1 truncate text-[10px] font-medium text-zinc-700 dark:text-zinc-300">
        Pg {pageNumber}
      </p>
      <p className="truncate text-[9px] text-zinc-400">{fileName}</p>
    </div>
  );
}
