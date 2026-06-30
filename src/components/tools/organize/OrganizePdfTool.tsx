"use client";

import { useEffect, useState } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { FileDropzone } from "@/components/tools/FileDropzone";
import { ToolButton } from "@/components/tools/ToolButton";
import { downloadBlob, toPdfBlob } from "@/lib/pdf/download";
import { organizePdf } from "@/lib/pdf/organize";

export function OrganizePdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [pageOrder, setPageOrder] = useState<number[]>([]);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!file) return;
    import("@/lib/pdf/text-extract").then(async ({ loadPdfFromFile }) => {
      const pdf = await loadPdfFromFile(file);
      const count = pdf.numPages;
      setPageCount(count);
      setPageOrder(Array.from({ length: count }, (_, i) => i));
    });
  }, [file]);

  const removePage = (orderIndex: number) => {
    setPageOrder((prev) => prev.filter((_, i) => i !== orderIndex));
  };

  const reorder = (from: number, to: number) => {
    if (from === to) return;
    setPageOrder((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  };

  const handleSave = async () => {
    if (!file || pageOrder.length === 0) return;
    setLoading(true);
    setError(null);
    try {
      const bytes = await organizePdf(file, pageOrder);
      downloadBlob(toPdfBlob(bytes), `${file.name.replace(/\.pdf$/i, "")}_organized.pdf`);
    } catch {
      setError("Failed to organize PDF.");
    } finally {
      setLoading(false);
    }
  };

  if (!file) {
    return (
      <FileDropzone
        onFiles={(f) => setFile(f[0])}
        label="Drop a PDF to organize"
        hint="Reorder and delete pages visually"
      />
    );
  }

  return (
    <div className="space-y-5">
      <ToolWorkspace
        file={file}
        pageCount={pageCount}
        showPageGrid={false}
        settingsTitle="Page order"
        onRemove={() => {
          setFile(null);
          setPageOrder([]);
        }}
        error={error}
        settings={
          <div>
            <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
              Drag thumbnails below to reorder. Click × to remove a page. {pageOrder.length} of{" "}
              {pageCount} pages kept.
            </p>
            <div className="flex flex-wrap gap-3">
              {pageOrder.map((pageIndex, orderIndex) => (
                <div
                  key={`${pageIndex}-${orderIndex}`}
                  draggable
                  onDragStart={() => setDragIndex(orderIndex)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => {
                    if (dragIndex !== null) reorder(dragIndex, orderIndex);
                    setDragIndex(null);
                  }}
                  className="group relative flex h-20 w-16 cursor-grab items-center justify-center rounded-lg border-2 border-zinc-200 bg-zinc-100 text-sm font-semibold dark:border-zinc-700 dark:bg-zinc-800"
                >
                  {pageIndex + 1}
                  <button
                    type="button"
                    onClick={() => removePage(orderIndex)}
                    className="absolute -right-2 -top-2 hidden h-5 w-5 rounded-full bg-red-500 text-xs text-white group-hover:block"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        }
        action={
          <ToolButton
            onClick={handleSave}
            loading={loading}
            disabled={pageOrder.length === 0}
            size="large"
          >
            Save organized PDF
          </ToolButton>
        }
      />
    </div>
  );
}
