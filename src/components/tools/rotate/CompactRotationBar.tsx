"use client";

interface CompactRotationBarProps {
  angle: number;
  onChange: (angle: number) => void;
}

const PRESETS = [-90, -45, 0, 45, 90, 180];

export function CompactRotationBar({ angle, onChange }: CompactRotationBarProps) {
  const clamp = (v: number) => Math.max(-180, Math.min(180, Math.round(v)));

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium text-zinc-500">Angle</span>
      <input
        type="range"
        min={-180}
        max={180}
        step={1}
        value={angle}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1.5 w-24 accent-teal-600 sm:w-32"
      />
      <input
        type="number"
        min={-180}
        max={180}
        value={angle}
        onChange={(e) => onChange(clamp(Number(e.target.value) || 0))}
        className="w-12 rounded border border-zinc-200 px-1 py-0.5 text-center text-xs dark:border-zinc-600 dark:bg-zinc-800"
      />
      <span className="text-xs text-zinc-400">°</span>
      <div className="flex gap-1">
        {PRESETS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${
              angle === p
                ? "bg-teal-600 text-white"
                : "bg-zinc-200 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300"
            }`}
          >
            {p}°
          </button>
        ))}
      </div>
    </div>
  );
}
