import { loadPdfDocument } from "./pdfjs";
import {
  createOcrWorker,
  ocrPdfPage,
  terminateOcrWorker,
  type OcrLanguage,
} from "./ocr";
import { extractPagePlainText } from "./text-extract";

export interface OcrExportOptions {
  pageIndices: number[];
  language: OcrLanguage;
  onProgress?: (page: number, total: number, phase: string) => void;
}

export async function ocrPdfToText(file: File, options: OcrExportOptions): Promise<string> {
  const pdf = await loadPdfDocument(file);
  const parts: string[] = [];
  let worker = null as Awaited<ReturnType<typeof createOcrWorker>> | null;

  try {
    for (let i = 0; i < options.pageIndices.length; i++) {
      const pageIndex = options.pageIndices[i];
      options.onProgress?.(i + 1, options.pageIndices.length, "Reading text");

      let text = await extractPagePlainText(pdf, pageIndex + 1);
      if (!text.trim()) {
        if (!worker) {
          options.onProgress?.(i + 1, options.pageIndices.length, "Loading OCR");
          worker = await createOcrWorker(options.language);
        }
        options.onProgress?.(i + 1, options.pageIndices.length, "OCR");
        text = await ocrPdfPage(worker, pdf, pageIndex);
      }

      parts.push(`--- Page ${pageIndex + 1} ---\n${text.trim()}\n`);
    }
  } finally {
    await terminateOcrWorker(worker);
  }

  return parts.join("\n");
}
