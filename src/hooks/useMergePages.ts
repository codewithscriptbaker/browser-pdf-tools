"use client";

import { useEffect, useState } from "react";
import { loadPdfDocument } from "@/lib/pdf/pdfjs";
import { renderPageToDataUrl } from "@/lib/pdf/thumbnails";

export interface MergePageItem {
  id: string;
  fileIndex: number;
  pageIndex: number;
  fileName: string;
  thumbnail: string | null;
}

export function useMergePages(files: File[]) {
  const [pages, setPages] = useState<MergePageItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (files.length === 0) {
      setPages([]);
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const items: MergePageItem[] = [];

        for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
          const file = files[fileIndex];
          const pdf = await loadPdfDocument(file);

          for (let pageIndex = 0; pageIndex < pdf.numPages; pageIndex++) {
            items.push({
              id: `${fileIndex}-${pageIndex}-${file.name}-${file.size}`,
              fileIndex,
              pageIndex,
              fileName: file.name,
              thumbnail: null,
            });
          }
        }

        if (cancelled) return;
        setPages(items);

        for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
          if (cancelled) return;

          const file = files[fileIndex];
          const pdf = await loadPdfDocument(file);

          for (let pageIndex = 0; pageIndex < pdf.numPages; pageIndex++) {
            if (cancelled) return;

            const id = `${fileIndex}-${pageIndex}-${file.name}-${file.size}`;
            const dataUrl = await renderPageToDataUrl(pdf, pageIndex + 1, 120);

            if (cancelled) return;

            setPages((prev) =>
              prev.map((p) => (p.id === id ? { ...p, thumbnail: dataUrl } : p)),
            );
          }
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Merge page preview error:", err);
          setError("Could not load page previews. You can still merge files.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [files]);

  const reorderPage = (from: number, to: number) => {
    setPages((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  };

  const removePage = (index: number) => {
    setPages((prev) => prev.filter((_, i) => i !== index));
  };

  return { pages, loading, error, reorderPage, removePage, setPages };
}
