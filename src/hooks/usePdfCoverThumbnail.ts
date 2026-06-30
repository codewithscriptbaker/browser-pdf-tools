"use client";

import { useEffect, useState } from "react";
import { getPdfPageCount, renderFilePageThumbnail } from "@/lib/pdf/thumbnails";

interface UsePdfCoverThumbnailResult {
  thumbnail: string | null;
  pageCount: number;
  loading: boolean;
  error: string | null;
}

export function usePdfCoverThumbnail(file: File | null): UsePdfCoverThumbnailResult {
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setThumbnail(null);
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
        const [cover, count] = await Promise.all([
          renderFilePageThumbnail(currentFile, 1, 200),
          getPdfPageCount(currentFile),
        ]);
        if (!cancelled) {
          setThumbnail(cover);
          setPageCount(count);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("PDF cover thumbnail error:", err);
          setError("Preview unavailable");
          setThumbnail(null);
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

  return { thumbnail, pageCount, loading, error };
}
