interface OptionChipsProps<T extends string> {
  label: string;
  description?: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}

export function OptionChips<T extends string>({
  label,
  description,
  options,
  value,
  onChange,
}: OptionChipsProps<T>) {
  return (
    <fieldset>
      <legend className="mb-1 text-sm font-medium text-zinc-800 dark:text-zinc-200">
        {label}
      </legend>
      {description && (
        <p className="mb-3 text-xs text-zinc-500 dark:text-zinc-400">{description}</p>
      )}
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`rounded-xl border-2 px-4 py-2.5 text-sm font-medium transition-all ${
              value === opt.value
                ? "border-teal-500 bg-teal-600 text-white shadow-sm"
                : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
