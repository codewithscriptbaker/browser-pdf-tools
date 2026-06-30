interface OptionCardsProps<T extends string> {
  label: string;
  description?: string;
  options: { value: T; label: string; hint?: string }[];
  value: T;
  onChange: (value: T) => void;
  columns?: 2 | 3 | 4;
}

export function OptionCards<T extends string>({
  label,
  description,
  options,
  value,
  onChange,
  columns = 3,
}: OptionCardsProps<T>) {
  const gridCols =
    columns === 2
      ? "sm:grid-cols-2"
      : columns === 4
        ? "sm:grid-cols-2 lg:grid-cols-4"
        : "sm:grid-cols-3";

  return (
    <fieldset>
      <legend className="mb-1 text-sm font-medium text-zinc-800 dark:text-zinc-200">
        {label}
      </legend>
      {description && (
        <p className="mb-3 text-xs text-zinc-500 dark:text-zinc-400">{description}</p>
      )}
      <div className={`grid gap-3 ${gridCols}`}>
        {options.map((opt) => (
          <label
            key={opt.value}
            className={`flex cursor-pointer flex-col rounded-xl border-2 px-4 py-3 transition-all ${
              value === opt.value
                ? "border-teal-500 bg-teal-50 shadow-sm dark:border-teal-500 dark:bg-teal-950/30"
                : "border-zinc-200 bg-zinc-50 hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800/50 dark:hover:border-zinc-600"
            }`}
          >
            <input
              type="radio"
              name={label}
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
              className="sr-only"
            />
            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {opt.label}
            </span>
            {opt.hint && (
              <span className="mt-1 text-xs leading-snug text-zinc-500 dark:text-zinc-400">
                {opt.hint}
              </span>
            )}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
