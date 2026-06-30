interface PdfThumbnailProps {
  src: string | null;
  pageNumber?: number;
  selected?: boolean;
  onClick?: () => void;
  onPreview?: () => void;
  rotation?: number;
  loading?: boolean;
  label?: string;
  className?: string;
  compact?: boolean;
}

export function PdfThumbnail({
  src,
  pageNumber,
  selected = false,
  onClick,
  onPreview,
  rotation = 0,
  loading = false,
  label,
  className = "",
  compact = false,
}: PdfThumbnailProps) {
  const interactive = Boolean(onClick);
  const canPreview = Boolean(onPreview && src);

  return (
    <div className={`group relative flex flex-col ${className}`}>
      <div
        role={interactive ? "button" : undefined}
        tabIndex={interactive ? 0 : undefined}
        onClick={onClick}
        onDoubleClick={(e) => {
          if (onPreview) {
            e.preventDefault();
            onPreview();
          }
        }}
        onKeyDown={
          interactive
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") onClick?.();
              }
            : undefined
        }
        className={`relative overflow-hidden rounded-lg border-2 bg-zinc-100 shadow-sm transition-all dark:bg-zinc-800 ${
          interactive ? "cursor-pointer" : ""
        } ${
          selected
            ? "border-teal-500 ring-2 ring-teal-500/30"
            : "border-zinc-200 group-hover:border-teal-300 dark:border-zinc-700 dark:group-hover:border-teal-600"
        }`}
      >
        <div className={`flex items-center justify-center ${compact ? "aspect-[3/4] max-h-28" : "aspect-[3/4]"}`}>
          {loading || !src ? (
            <div className="flex flex-col items-center gap-1">
              <span className={`animate-spin rounded-full border-2 border-zinc-300 border-t-teal-600 ${compact ? "h-4 w-4" : "h-6 w-6"}`} />
              {!compact && <span className="text-xs text-zinc-400">Loading…</span>}
            </div>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src}
              alt={pageNumber ? `Page ${pageNumber}` : "PDF preview"}
              className="h-full w-full object-contain transition-transform duration-200"
              style={{ transform: `rotate(${rotation}deg)` }}
              draggable={false}
            />
          )}
        </div>

        {selected && (
          <span className={`absolute right-1 top-1 flex items-center justify-center rounded-full bg-teal-600 text-white ${compact ? "h-4 w-4 text-[10px]" : "right-2 top-2 h-5 w-5 text-xs"}`}>
            ✓
          </span>
        )}

        {canPreview && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPreview?.();
            }}
            className={`absolute flex items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100 ${compact ? "bottom-1 right-1 h-5 w-5 text-[10px]" : "bottom-2 right-2 h-7 w-7"}`}
            aria-label="View fullscreen"
            title="View fullscreen"
          >
            ⛶
          </button>
        )}
      </div>

      {(pageNumber !== undefined || label) && !compact && (
        <p className="mt-1.5 truncate text-center text-xs text-zinc-500 dark:text-zinc-400">
          {label ?? `Page ${pageNumber}`}
        </p>
      )}
    </div>
  );
}
