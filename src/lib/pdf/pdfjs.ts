import type { PDFDocumentProxy } from "pdfjs-dist";

let workerInitialized = false;

export async function getPdfjs() {
  const pdfjs = await import("pdfjs-dist");

  if (!workerInitialized && typeof window !== "undefined") {
    pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
    workerInitialized = true;
  }

  return pdfjs;
}

export async function loadPdfDocument(file: File): Promise<PDFDocumentProxy> {
  const pdfjs = await getPdfjs();
  const buffer = await file.arrayBuffer();
  return pdfjs.getDocument({ data: new Uint8Array(buffer) }).promise;
}

export async function renderPageToCanvas(
  pdf: PDFDocumentProxy,
  pageNumber: number,
  scale = 1,
): Promise<HTMLCanvasElement> {
  const page = await pdf.getPage(pageNumber);
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Could not get canvas context");
  }

  canvas.width = viewport.width;
  canvas.height = viewport.height;

  await page.render({ canvasContext: context, viewport, canvas }).promise;
  return canvas;
}
