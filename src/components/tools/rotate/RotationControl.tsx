"use client";

import { useCallback, useRef, useState } from "react";

interface RotationControlProps {
  angle: number;
  onChange: (angle: number) => void;
  previewSrc: string | null;
  previewLoading?: boolean;
  pageLabel?: string;
  previewAngle?: number;
}

const PRESETS = [-90, -45, 0, 45, 90, 180];

export function RotationControl({
  angle,
  onChange,
  previewSrc,
  previewLoading,
  pageLabel = "Page 1",
  previewAngle,
}: RotationControlProps) {
  const displayAngle = previewAngle ?? angle;
  const previewRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const clampAngle = (value: number) => {
    if (value > 180) return 180;
    if (value < -180) return -180;
    return Math.round(value);
  };

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!previewRef.current) return;
      dragging.current = true;
      previewRef.current.setPointerCapture(e.pointerId);
    },
    [],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging.current || !previewRef.current) return;
      const rect = previewRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const radians = Math.atan2(e.clientY - cy, e.clientX - cx);
      const deg = clampAngle(Math.round((radians * 180) / Math.PI + 90));
      onChange(deg);
    },
    [onChange],
  );

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    dragging.current = false;
    previewRef.current?.releasePointerCapture(e.pointerId);
  }, []);

  return (
    <div>
      <p className="mb-5 text-sm text-zinc-600 dark:text-zinc-400">
        Drag the preview to rotate, or use the slider and presets below.
      </p>

      <div className="grid gap-8 lg:grid-cols-2">
        <div
          ref={previewRef}
          className="relative mx-auto flex aspect-[3/4] w-full max-w-sm cursor-grab items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-zinc-300 bg-white shadow-inner active:cursor-grabbing dark:border-zinc-600 dark:bg-zinc-800"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          {previewLoading || !previewSrc ? (
            <div className="flex flex-col items-center gap-2">
              <span className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-teal-600" />
              <span className="text-xs text-zinc-400">Loading preview…</span>
            </div>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewSrc}
              alt={pageLabel}
              className="max-h-full max-w-full object-contain transition-transform duration-75 select-none"
              style={{ transform: `rotate(${displayAngle}deg)` }}
              draggable={false}
            />
          )}
          <span className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-2.5 py-0.5 text-xs text-white">
            {displayAngle}°
          </span>
        </div>

        <div className="flex flex-col justify-center gap-5">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label htmlFor="rotate-slider" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Angle
              </label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min={-180}
                  max={180}
                  value={angle}
                  onChange={(e) => onChange(clampAngle(Number(e.target.value) || 0))}
                  className="w-16 rounded-lg border border-zinc-300 px-2 py-1 text-center text-sm dark:border-zinc-600 dark:bg-zinc-800"
                />
                <span className="text-sm text-zinc-500">°</span>
              </div>
            </div>
            <input
              id="rotate-slider"
              type="range"
              min={-180}
              max={180}
              step={1}
              value={angle}
              onChange={(e) => onChange(Number(e.target.value))}
              className="h-2 w-full cursor-pointer accent-teal-600"
            />
            <div className="mt-1 flex justify-between text-[10px] text-zinc-400">
              <span>-180°</span>
              <span>0°</span>
              <span>180°</span>
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-medium text-zinc-500">Quick presets</p>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => onChange(preset)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                    angle === preset
                      ? "border-teal-600 bg-teal-50 text-teal-800 dark:border-teal-500 dark:bg-teal-950/40 dark:text-teal-200"
                      : "border-zinc-200 text-zinc-600 hover:border-zinc-300 dark:border-zinc-700 dark:text-zinc-400"
                  }`}
                >
                  {preset}°
                </button>
              ))}
            </div>
          </div>

          <p className="text-xs leading-relaxed text-zinc-500">
            Any angle from -180° to 180°. Right angles (90°, 180°…) keep vector quality; other
            angles are rendered precisely to match your preview.
          </p>
        </div>
      </div>
    </div>
  );
}
