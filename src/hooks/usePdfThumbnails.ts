"use client";

import { useEffect, useState } from "react";
import { loadPdfDocument } from "@/lib/pdf/pdfjs";
import { renderPageToDataUrl } from "@/lib/pdf/thumbnails";

interface UsePdfThumbnailsResult {
  thumbnails: (string | null)[];
  pageCount: number;
  loading: boolean;
  error: string | null;
}

export function usePdfThumbnails(file: File | null): UsePdfThumbnailsResult {
  const [thumbnails, setThumbnails] = useState<(string | null)[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setThumbnails([]);
      setPageCount(0);
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;
    const currentFile = file;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const pdf = await loadPdfDocument(currentFile);
        const count = pdf.numPages;

        if (cancelled) return;

        setPageCount(count);
        setThumbnails(Array.from({ length: count }, () => null));

        for (let i = 1; i <= count; i++) {
          if (cancelled) return;

          const dataUrl = await renderPageToDataUrl(pdf, i, 140);
          if (cancelled) return;

          setThumbnails((prev) => {
            const next = [...prev];
            next[i - 1] = dataUrl;
            return next;
          });
        }
      } catch (err) {
        if (!cancelled) {
          console.error("PDF thumbnail error:", err);
          setError("Could not generate page previews. Try refreshing or use a different PDF.");
          setThumbnails([]);
          setPageCount(0);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [file]);

  return { thumbnails, pageCount, loading, error };
}
