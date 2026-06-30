"use client";

import { useState } from "react";
import { FileDropzone } from "@/components/tools/FileDropzone";
import { PdfPageGrid } from "@/components/tools/preview/PdfPageGrid";
import { usePdfThumbnails } from "@/hooks/usePdfThumbnails";

export function ComparePdfTool() {
  const [fileA, setFileA] = useState<File | null>(null);
  const [fileB, setFileB] = useState<File | null>(null);
  const [pageA, setPageA] = useState(0);
  const [pageB, setPageB] = useState(0);

  const thumbsA = usePdfThumbnails(fileA);
  const thumbsB = usePdfThumbnails(fileB);

  if (!fileA || !fileB) {
    return (
      <div className="grid gap-5 lg:grid-cols-2">
        <div>
          <p className="mb-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">Document A</p>
          {fileA ? (
            <p className="rounded-xl border border-zinc-200 p-4 text-sm dark:border-zinc-700">
              {fileA.name}
              <button
                type="button"
                onClick={() => setFileA(null)}
                className="ml-2 text-teal-600 hover:underline"
              >
                Change
              </button>
            </p>
          ) : (
            <FileDropzone onFiles={(f) => setFileA(f[0])} label="Drop first PDF" />
          )}
        </div>
        <div>
          <p className="mb-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">Document B</p>
          {fileB ? (
            <p className="rounded-xl border border-zinc-200 p-4 text-sm dark:border-zinc-700">
              {fileB.name}
              <button
                type="button"
                onClick={() => setFileB(null)}
                className="ml-2 text-teal-600 hover:underline"
              >
                Change
              </button>
            </p>
          ) : (
            <FileDropzone onFiles={(f) => setFileB(f[0])} label="Drop second PDF" />
          )}
        </div>
      </div>
    );
  }

  const maxPages = Math.max(thumbsA.pageCount, thumbsB.pageCount, 1);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-700 dark:bg-zinc-900/60">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          <strong className="text-zinc-900 dark:text-zinc-100">{fileA.name}</strong> vs{" "}
          <strong className="text-zinc-900 dark:text-zinc-100">{fileB.name}</strong>
        </p>
        <div className="flex items-center gap-2">
          <label className="text-xs text-zinc-500">Page</label>
          <input
            type="number"
            min={1}
            max={maxPages}
            value={pageA + 1}
            onChange={(e) => {
              const n = Math.max(0, Number(e.target.value) - 1);
              setPageA(n);
              setPageB(n);
            }}
            className="w-16 rounded border border-zinc-200 px-2 py-1 text-sm dark:border-zinc-600 dark:bg-zinc-800"
          />
          <span className="text-xs text-zinc-500">/ {maxPages}</span>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Document A
          </h2>
          <PdfPageGrid
            thumbnails={thumbsA.thumbnails}
            loading={thumbsA.loading}
            viewerTitle={fileA.name}
            emptyMessage="Loading…"
          />
        </section>
        <section className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Document B
          </h2>
          <PdfPageGrid
            thumbnails={thumbsB.thumbnails}
            loading={thumbsB.loading}
            viewerTitle={fileB.name}
            emptyMessage="Loading…"
          />
        </section>
      </div>
    </div>
  );
}
