import type { PDFDocumentProxy } from "pdfjs-dist";
import { createWorker, type Worker } from "tesseract.js";
import { renderPageToCanvas } from "./pdfjs";

export type OcrLanguage = "eng" | "spa" | "fra" | "deu" | "por" | "ita";

export const OCR_LANGUAGES: { code: OcrLanguage; label: string }[] = [
  { code: "eng", label: "English" },
  { code: "spa", label: "Spanish" },
  { code: "fra", label: "French" },
  { code: "deu", label: "German" },
  { code: "por", label: "Portuguese" },
  { code: "ita", label: "Italian" },
];

export type OcrMode = "off" | "auto" | "always";

export interface OcrProgressInfo {
  page: number;
  total: number;
  phase: string;
  progress: number;
}

function preprocessCanvas(canvas: HTMLCanvasElement): HTMLCanvasElement {
  const processed = document.createElement("canvas");
  processed.width = canvas.width;
  processed.height = canvas.height;
  const ctx = processed.getContext("2d");
  if (!ctx) return canvas;

  ctx.drawImage(canvas, 0, 0);
  const imageData = ctx.getImageData(0, 0, processed.width, processed.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    const enhanced = gray < 128 ? gray * 0.85 : Math.min(255, gray * 1.05);
    data[i] = enhanced;
    data[i + 1] = enhanced;
    data[i + 2] = enhanced;
  }

  ctx.putImageData(imageData, 0, 0);
  return processed;
}

export async function createOcrWorker(
  language: OcrLanguage,
  onLog?: (phase: string, progress: number) => void,
): Promise<Worker> {
  return createWorker(language, 1, {
    logger: (m) => {
      if (onLog && (m.status === "recognizing text" || m.status === "loading language traineddata")) {
        onLog(m.status, m.progress ?? 0);
      }
    },
  });
}

export async function ocrPdfPage(
  worker: Worker,
  pdf: PDFDocumentProxy,
  pageIndex: number,
  scale = 2,
): Promise<string> {
  const canvas = await renderPageToCanvas(pdf, pageIndex + 1, scale);
  const processed = preprocessCanvas(canvas);
  const { data } = await worker.recognize(processed);
  return data.text?.trim() ?? "";
}

export async function terminateOcrWorker(worker: Worker | null) {
  if (worker) {
    await worker.terminate();
  }
}
