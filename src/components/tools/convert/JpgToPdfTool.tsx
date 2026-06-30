"use client";

import { useState } from "react";
import { FileDropzone } from "@/components/tools/FileDropzone";
import { ToolButton } from "@/components/tools/ToolButton";
import { ToolError } from "@/components/tools/ToolError";
import { downloadBlob, toPdfBlob } from "@/lib/pdf/download";
import { imagesToPdf } from "@/lib/pdf/jpg-to-pdf";

export function JpgToPdfTool() {
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const reorder = (from: number, to: number) => {
    if (from === to) return;
    setImages((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  };

  const handleConvert = async () => {
    if (images.length === 0) return;
    setLoading(true);
    setError(null);
    try {
      const bytes = await imagesToPdf(images);
      downloadBlob(toPdfBlob(bytes), "images.pdf");
    } catch {
      setError("Conversion failed. Use JPG or PNG images.");
    } finally {
      setLoading(false);
    }
  };

  if (images.length === 0) {
    return (
      <FileDropzone
        onFiles={(files) => setImages(files.filter((f) => f.type.startsWith("image/")))}
        accept={{ "image/jpeg": [".jpg", ".jpeg"], "image/png": [".png"] }}
        multiple
        label="Drop JPG or PNG images"
        hint="Add one or more images — they become pages in your PDF"
      />
    );
  }

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-500">
          Image order
        </h2>
        <div className="flex flex-wrap gap-4">
          {images.map((img, index) => (
            <div
              key={`${img.name}-${index}`}
              draggable
              onDragStart={() => setDragIndex(index)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (dragIndex !== null) reorder(dragIndex, index);
                setDragIndex(null);
              }}
              className="group relative w-28 cursor-grab"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={URL.createObjectURL(img)}
                alt={img.name}
                className="aspect-[3/4] w-full rounded-lg border-2 border-zinc-200 object-cover dark:border-zinc-700"
              />
              <p className="mt-1 truncate text-center text-xs text-zinc-500">Page {index + 1}</p>
              <button
                type="button"
                onClick={() => setImages((prev) => prev.filter((_, i) => i !== index))}
                className="absolute -right-2 -top-2 hidden h-6 w-6 rounded-full bg-red-500 text-xs text-white group-hover:block"
              >
                ×
              </button>
            </div>
          ))}
          <label className="flex h-36 w-28 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-zinc-300 text-xs text-zinc-500 hover:border-teal-400 dark:border-zinc-600">
            + Add
            <input
              type="file"
              accept="image/jpeg,image/png"
              multiple
              className="hidden"
              onChange={(e) => {
                const files = [...(e.target.files ?? [])];
                if (files.length) setImages((prev) => [...prev, ...files]);
              }}
            />
          </label>
        </div>
      </section>

      {error && <ToolError message={error} />}

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-teal-200 bg-gradient-to-r from-teal-50 to-emerald-50 px-6 py-5 dark:border-teal-800 dark:from-teal-950/40 dark:to-emerald-950/30">
        <p className="text-sm text-teal-900 dark:text-teal-200">
          {images.length} image{images.length !== 1 ? "s" : ""} → one PDF
        </p>
        <div className="flex gap-3">
          <ToolButton onClick={handleConvert} loading={loading} size="large">
            Create PDF
          </ToolButton>
          <ToolButton variant="secondary" onClick={() => setImages([])}>
            Clear
          </ToolButton>
        </div>
      </div>
    </div>
  );
}
