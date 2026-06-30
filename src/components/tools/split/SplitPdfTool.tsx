"use client";

import { useEffect, useMemo, useState } from "react";
import JSZip from "jszip";
import { OptionCards } from "@/components/tools/OptionCards";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { FileDropzone } from "@/components/tools/FileDropzone";
import { ToolButton } from "@/components/tools/ToolButton";
import { downloadBlob, toPdfBlob } from "@/lib/pdf/download";
import {
  type PageRange,
  parseMultiplePageRanges,
  parsePageRange,
  pageIndicesToRange,
  rangeToPageSet,
  splitPdfAllPages,
  splitPdfByMultipleRanges,
  splitPdfByPageIndices,
  splitPdfByRange,
} from "@/lib/pdf/split";

type SplitMode = "all" | "selected" | "range" | "custom";

export function SplitPdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [mode, setMode] = useState<SplitMode>("selected");
  const [range, setRange] = useState("1-1");
  const [customRangesInput, setCustomRangesInput] = useState("");
  const [savedRanges, setSavedRanges] = useState<PageRange[]>([]);
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!file) return;
    import("@/lib/pdf/text-extract").then(async ({ loadPdfFromFile }) => {
      const pdf = await loadPdfFromFile(file);
      const count = pdf.numPages;
      setPageCount(count);
      setRange(`1-${count}`);
      setCustomRangesInput(`1-${count}`);
      setSelectedPages(new Set());
    });
  }, [file]);

  const rangeHighlight = useMemo(() => {
    if (mode === "range") {
      const parsed = parsePageRange(range, pageCount || 1);
      if (!parsed.valid) return new Set<number>();
      return rangeToPageSet({ start: parsed.start, end: parsed.end });
    }
    if (mode === "custom") {
      const combined = new Set<number>();
      for (const r of savedRanges) rangeToPageSet(r).forEach((p) => combined.add(p));
      const parsed = parseMultiplePageRanges(customRangesInput, pageCount || 1);
      if (parsed.valid) {
        for (const r of parsed.ranges) rangeToPageSet(r).forEach((p) => combined.add(p));
      }
      return combined;
    }
    return new Set<number>();
  }, [mode, range, pageCount, savedRanges, customRangesInput]);

  const rangeGroups = useMemo(() => {
    if (mode !== "custom") return undefined;
    const groups: { label: string; pages: Set<number> }[] = [];
    savedRanges.forEach((r) => {
      groups.push({
        label: r.start === r.end ? `${r.start}` : `${r.start}-${r.end}`,
        pages: rangeToPageSet(r),
      });
    });
    const parsed = parseMultiplePageRanges(customRangesInput, pageCount || 1);
    if (parsed.valid) {
      parsed.ranges.forEach((r) => {
        const label = r.start === r.end ? `${r.start}` : `${r.start}-${r.end}`;
        if (!groups.some((g) => g.label === label)) {
          groups.push({ label, pages: rangeToPageSet(r) });
        }
      });
    }
    return groups;
  }, [mode, savedRanges, customRangesInput, pageCount]);

  const displaySelection = mode === "range" || mode === "custom" ? rangeHighlight : selectedPages;

  const getCustomRanges = (): PageRange[] => {
    const fromInput = parseMultiplePageRanges(customRangesInput, pageCount);
    const inputRanges = fromInput.valid ? fromInput.ranges : [];
    const merged = [...savedRanges];
    for (const r of inputRanges) {
      if (!merged.some((x) => x.start === r.start && x.end === r.end)) merged.push(r);
    }
    return merged;
  };

  const addRangeFromSelection = () => {
    if (selectedPages.size === 0) return;
    const r = pageIndicesToRange([...selectedPages]);
    if (!r) return;
    setMode("custom");
    setSavedRanges((prev) => {
      if (prev.some((x) => x.start === r.start && x.end === r.end)) return prev;
      return [...prev, r];
    });
    setSelectedPages(new Set());
  };

  const handleSplit = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const baseName = file.name.replace(/\.pdf$/i, "");
      if (mode === "all") {
        const pages = await splitPdfAllPages(file);
        const zip = new JSZip();
        pages.forEach((bytes, i) => zip.file(`${baseName}_page_${i + 1}.pdf`, bytes));
        downloadBlob(await zip.generateAsync({ type: "blob" }), `${baseName}_pages.zip`);
      } else if (mode === "selected") {
        if (selectedPages.size === 0) {
          setError("Select at least one page.");
          return;
        }
        const bytes = await splitPdfByPageIndices(file, [...selectedPages].sort((a, b) => a - b));
        downloadBlob(toPdfBlob(bytes), `${baseName}_extracted.pdf`);
      } else if (mode === "range") {
        const parsed = parsePageRange(range, pageCount);
        if (!parsed.valid) {
          setError(parsed.error ?? "Invalid range");
          return;
        }
        const bytes = await splitPdfByRange(file, parsed.start, parsed.end);
        downloadBlob(toPdfBlob(bytes), `${baseName}_pages_${parsed.start}-${parsed.end}.pdf`);
      } else {
        const ranges = getCustomRanges();
        if (ranges.length === 0) {
          setError("Add ranges — select pages + Add, or type e.g. 1-3, 5");
          return;
        }
        if (ranges.length === 1) {
          const r = ranges[0];
          const bytes = await splitPdfByRange(file, r.start, r.end);
          const suffix = r.start === r.end ? `${r.start}` : `${r.start}-${r.end}`;
          downloadBlob(toPdfBlob(bytes), `${baseName}_pages_${suffix}.pdf`);
        } else {
          const results = await splitPdfByMultipleRanges(file, ranges);
          const zip = new JSZip();
          results.forEach((bytes, i) => {
            const r = ranges[i];
            const suffix = r.start === r.end ? `${r.start}` : `${r.start}-${r.end}`;
            zip.file(`${baseName}_range_${suffix}.pdf`, bytes);
          });
          downloadBlob(await zip.generateAsync({ type: "blob" }), `${baseName}_ranges.zip`);
        }
      }
    } catch {
      setError("Failed to split PDF.");
    } finally {
      setLoading(false);
    }
  };

  const actionLabel =
    mode === "all"
      ? "Split all pages"
      : mode === "selected"
        ? "Extract selected pages"
        : mode === "range"
          ? "Extract page range"
          : "Extract all ranges";

  if (!file) {
    return (
      <FileDropzone
        onFiles={(f) => {
          setFile(f[0]);
          setError(null);
          setMode("selected");
        }}
        multiple={false}
        label="Drop a PDF to split"
        hint="Click pages to select, or use range modes below"
      />
    );
  }

  return (
    <ToolWorkspace
      file={file}
      pageCount={pageCount}
      settingsTitle="Split mode"
      selectedPages={mode === "all" ? undefined : displaySelection}
      onTogglePage={
        mode === "all"
          ? undefined
          : (i) => {
              if (mode !== "selected" && mode !== "custom") setMode("selected");
              setSelectedPages((prev) => {
                const next = new Set(prev);
                if (next.has(i)) next.delete(i);
                else next.add(i);
                return next;
              });
            }
      }
      onSelectAll={() => {
        setMode("selected");
        setSelectedPages(new Set(Array.from({ length: pageCount }, (_, i) => i)));
      }}
      onClearSelection={() => setSelectedPages(new Set())}
      onRemove={() => {
        setFile(null);
        setSelectedPages(new Set());
        setSavedRanges([]);
        setError(null);
      }}
      error={error}
      gridProps={{ rangeGroups }}
      settings={
        <div className="space-y-6">
          <OptionCards
            label="How do you want to split?"
            value={mode}
            onChange={setMode}
            columns={4}
            options={[
              { value: "selected", label: "Selected pages", hint: "Click pages below to pick" },
              { value: "all", label: "Every page", hint: "One PDF per page, zipped" },
              { value: "range", label: "Single range", hint: "e.g. pages 2–5" },
              { value: "custom", label: "Multiple ranges", hint: "e.g. 1-3, 5, 7-9" },
            ]}
          />

          {mode === "range" && (
            <div>
              <label htmlFor="split-range" className="mb-2 block text-sm font-medium text-zinc-800 dark:text-zinc-200">
                Page range
              </label>
              <input
                id="split-range"
                type="text"
                value={range}
                onChange={(e) => setRange(e.target.value)}
                placeholder="2-5"
                className="w-full max-w-xs rounded-xl border-2 border-zinc-200 px-4 py-3 text-sm dark:border-zinc-600 dark:bg-zinc-800"
              />
              <p className="mt-2 text-xs text-zinc-500">Enter start and end page numbers, e.g. 2-5</p>
            </div>
          )}

          {mode === "custom" && (
            <div className="space-y-4">
              <div>
                <label htmlFor="split-ranges" className="mb-2 block text-sm font-medium text-zinc-800 dark:text-zinc-200">
                  Page ranges
                </label>
                <input
                  id="split-ranges"
                  type="text"
                  value={customRangesInput}
                  onChange={(e) => setCustomRangesInput(e.target.value)}
                  placeholder="1-3, 5, 7-9"
                  className="w-full max-w-md rounded-xl border-2 border-zinc-200 px-4 py-3 text-sm dark:border-zinc-600 dark:bg-zinc-800"
                />
                <p className="mt-2 text-xs text-zinc-500">
                  Separate ranges with commas. Each range becomes its own PDF.
                </p>
              </div>
              <button
                type="button"
                onClick={addRangeFromSelection}
                disabled={selectedPages.size === 0}
                className="rounded-xl border-2 border-teal-500 bg-teal-50 px-4 py-2.5 text-sm font-medium text-teal-800 transition-colors hover:bg-teal-100 disabled:opacity-40 dark:border-teal-600 dark:bg-teal-950/30 dark:text-teal-200"
              >
                + Add current selection as a range
              </button>
              {savedRanges.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {savedRanges.map((r) => (
                    <span
                      key={`${r.start}-${r.end}`}
                      className="rounded-lg bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                    >
                      {r.start === r.end ? `Page ${r.start}` : `Pages ${r.start}–${r.end}`}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      }
      action={
        <ToolButton
          onClick={handleSplit}
          loading={loading}
          disabled={mode === "selected" && selectedPages.size === 0}
          size="large"
        >
          {actionLabel}
        </ToolButton>
      }
    />
  );
}
