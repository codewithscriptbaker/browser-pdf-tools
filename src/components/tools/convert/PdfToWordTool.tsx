"use client";

import { useEffect, useState } from "react";
import { OptionCards } from "@/components/tools/OptionCards";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { FileDropzone } from "@/components/tools/FileDropzone";
import { ToolButton } from "@/components/tools/ToolButton";
import { downloadBlob } from "@/lib/pdf/download";
import { OCR_LANGUAGES, type OcrLanguage, type OcrMode } from "@/lib/pdf/ocr";
import { pdfToWord } from "@/lib/pdf/pdf-to-word";

export function PdfToWordTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
  const [ocrMode, setOcrMode] = useState<OcrMode>("auto");
  const [ocrLanguage, setOcrLanguage] = useState<OcrLanguage>("eng");
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

  const handleConvert = async () => {
    if (!file || selectedPages.size === 0) return;
    setLoading(true);
    setError(null);
    setProgress(ocrMode !== "off" ? "Preparing…" : null);

    try {
      const indices = [...selectedPages].sort((a, b) => a - b);
      const blob = await pdfToWord(file, indices, {
        ocrMode,
        ocrLanguage,
        onProgress: (info) => {
          setProgress(`${info.phase} (${info.page}/${info.total})`);
        },
      });
      downloadBlob(blob, `${file.name.replace(/\.pdf$/i, "")}.docx`);
      setProgress(null);
    } catch {
      setError("Conversion failed. Try a different language or fewer pages.");
      setProgress(null);
    } finally {
      setLoading(false);
    }
  };

  if (!file) {
    return (
      <FileDropzone
        onFiles={(files) => {
          setFile(files[0]);
          setError(null);
        }}
        multiple={false}
        label="Drop a PDF to convert to Word"
        hint="Text PDFs and scanned pages via browser OCR"
      />
    );
  }

  return (
    <ToolWorkspace
      file={file}
      pageCount={pageCount}
      settingsTitle="Conversion settings"
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
        setSelectedPages(new Set());
        setPageCount(0);
        setProgress(null);
      }}
      error={error}
      settings={
        <div className="space-y-6">
          <OptionCards
            label="OCR (scanned pages)"
            description="OCR reads text from images inside your PDF. Language models download once on first use (~10–15 MB)."
            value={ocrMode}
            onChange={setOcrMode}
            columns={3}
            options={[
              {
                value: "auto",
                label: "Auto",
                hint: "OCR only when a page has no embedded text",
              },
              {
                value: "always",
                label: "Always",
                hint: "Run OCR on every page — slower but thorough",
              },
              { value: "off", label: "Off", hint: "Extract embedded text only" },
            ]}
          />
          {ocrMode !== "off" && (
            <div>
              <label
                htmlFor="ocr-language"
                className="mb-2 block text-sm font-medium text-zinc-800 dark:text-zinc-200"
              >
                Document language
              </label>
              <select
                id="ocr-language"
                value={ocrLanguage}
                onChange={(e) => setOcrLanguage(e.target.value as OcrLanguage)}
                className="w-full max-w-sm rounded-xl border-2 border-zinc-200 bg-white px-4 py-3 text-sm dark:border-zinc-600 dark:bg-zinc-800"
              >
                {OCR_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>
          )}
          {progress && (
            <div className="rounded-xl border border-teal-200 bg-teal-50 px-5 py-3 text-sm text-teal-800 dark:border-teal-800 dark:bg-teal-950/30 dark:text-teal-200">
              {progress}
            </div>
          )}
        </div>
      }
      action={
        <ToolButton onClick={handleConvert} loading={loading} disabled={selectedPages.size === 0} size="large">
          Download Word (.docx)
        </ToolButton>
      }
    />
  );
}
