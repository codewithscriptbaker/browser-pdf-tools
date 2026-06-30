import { formatFileSize } from "@/lib/pdf/download";

interface PdfDocumentHeaderProps {
  file: File;
  pageCount?: number;
  onRemove: () => void;
  extra?: React.ReactNode;
}

export function PdfDocumentHeader({ file, pageCount, onRemove, extra }: PdfDocumentHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-700 dark:bg-zinc-900">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-zinc-800 dark:text-zinc-200">{file.name}</p>
        <p className="text-xs text-zinc-500">
          {formatFileSize(file.size)}
          {pageCount !== undefined && (
            <>
              {" "}
              · {pageCount} page{pageCount !== 1 ? "s" : ""}
            </>
          )}
        </p>
      </div>
      <div className="flex items-center gap-2">
        {extra}
        <button
          type="button"
          onClick={onRemove}
          className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-600 hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-zinc-600 dark:text-zinc-400 dark:hover:border-red-800 dark:hover:bg-red-950/30 dark:hover:text-red-400"
        >
          Remove file
        </button>
      </div>
    </div>
  );
}
