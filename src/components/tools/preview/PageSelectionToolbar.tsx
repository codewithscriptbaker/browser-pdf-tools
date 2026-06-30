interface PageSelectionToolbarProps {
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onClearSelection: () => void;
}

export function PageSelectionToolbar({
  selectedCount,
  totalCount,
  onSelectAll,
  onClearSelection,
}: PageSelectionToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-zinc-100 px-3 py-2 dark:bg-zinc-800">
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        <span className="font-medium text-zinc-900 dark:text-zinc-100">{selectedCount}</span> of{" "}
        {totalCount} pages selected
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onSelectAll}
          className="rounded-md px-2.5 py-1 text-xs font-medium text-teal-700 hover:bg-teal-50 dark:text-teal-400 dark:hover:bg-teal-950/40"
        >
          Select all
        </button>
        <button
          type="button"
          onClick={onClearSelection}
          disabled={selectedCount === 0}
          className="rounded-md px-2.5 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-200 disabled:opacity-40 dark:text-zinc-400 dark:hover:bg-zinc-700"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
