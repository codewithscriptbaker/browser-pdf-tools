"use client";

import { useEffect, useState } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { FileDropzone } from "@/components/tools/FileDropzone";
import { ToolButton } from "@/components/tools/ToolButton";
import { downloadBlob } from "@/lib/pdf/download";
import { OCR_LANGUAGES, type OcrLanguage } from "@/lib/pdf/ocr";
import { ocrPdfToText } from "@/lib/pdf/ocr-export";

export function OcrPdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
  const [language, setLanguage] = useState<OcrLanguage>("eng");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<string | null>(null);

  useEffect(() => {
    if (!file) return;
    import("@/lib/pdf/text-extract").then(async ({ loadPdfFromFile }) => {
      const pdf = await loadPdfFromFile(file);
      const count = pdf.numPages;
      setPageCount(count);
      setSelectedPages(new Set(Array.from({ length: count }, (_, i) => i)));
    });
  }, [file]);

  const handleOcr = async () => {
    if (!file || selectedPages.size === 0) return;
    setLoading(true);
    setError(null);
    setProgress("Starting…");
    try {
      const indices = [...selectedPages].sort((a, b) => a - b);
      const text = await ocrPdfToText(file, {
        pageIndices: indices,
        language,
        onProgress: (page, total, phase) => setProgress(`${phase} — page ${page}/${total}`),
      });
      downloadBlob(
        new Blob([text], { type: "text/plain" }),
        `${file.name.replace(/\.pdf$/i, "")}_ocr.txt`,
      );
      setProgress(null);
    } catch {
      setError("OCR failed. Try fewer pages or a different language.");
      setProgress(null);
    } finally {
      setLoading(false);
    }
  };

  if (!file) {
    return (
      <FileDropzone
        onFiles={(f) => setFile(f[0])}
        label="Drop a scanned PDF"
        hint="Extract text with Tesseract OCR in your browser"
      />
    );
  }

  return (
    <ToolWorkspace
      file={file}
      pageCount={pageCount}
      settingsTitle="OCR settings"
      selectedPages={selectedPages}
      onTogglePage={(i) =>
        setSelectedPages((prev) => {
          const next = new Set(prev);
          if (next.has(i)) next.delete(i);
          else next.add(i);
          return next;
        })
      }
      onSelectAll={() =>
        setSelectedPages(new Set(Array.from({ length: pageCount }, (_, i) => i)))
      }
      onClearSelection={() => setSelectedPages(new Set())}
      onRemove={() => {
        setFile(null);
        setProgress(null);
      }}
      error={error}
      settings={
        <div className="space-y-4">
          <div>
            <label htmlFor="ocr-lang" className="mb-2 block text-sm font-medium">
              Document language
            </label>
            <select
              id="ocr-lang"
              value={language}
              onChange={(e) => setLanguage(e.target.value as OcrLanguage)}
              className="w-full max-w-sm rounded-xl border-2 border-zinc-200 px-4 py-3 text-sm dark:border-zinc-600 dark:bg-zinc-800"
            >
              {OCR_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>
          {progress && (
            <p className="text-sm text-teal-600 dark:text-teal-400">{progress}</p>
          )}
          <p className="text-xs text-zinc-500">
            Downloads a .txt file with extracted text. Embedded text is used when available; OCR runs
            on image-only pages.
          </p>
        </div>
      }
      action={
        <ToolButton onClick={handleOcr} loading={loading} disabled={selectedPages.size === 0} size="large">
          Run OCR & download text
        </ToolButton>
      }
    />
  );
}
