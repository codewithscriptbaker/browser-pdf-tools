import type { PDFDocumentProxy } from "pdfjs-dist";
import { loadPdfDocument } from "./pdfjs";

export async function renderPageToDataUrl(
  pdf: PDFDocumentProxy,
  pageNumber: number,
  maxWidth = 160,
): Promise<string> {
  const page = await pdf.getPage(pageNumber);
  const baseViewport = page.getViewport({ scale: 1 });
  const scale = maxWidth / baseViewport.width;
  const viewport = page.getViewport({ scale });

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Could not get canvas context");
  }

  canvas.width = viewport.width;
  canvas.height = viewport.height;

  await page.render({ canvasContext: context, viewport, canvas }).promise;
  return canvas.toDataURL("image/jpeg", 0.82);
}

export async function renderFilePageThumbnail(
  file: File,
  pageNumber: number,
  maxWidth = 160,
): Promise<string> {
  const pdf = await loadPdfDocument(file);
  return renderPageToDataUrl(pdf, pageNumber, maxWidth);
}

export async function getPdfPageCount(file: File): Promise<number> {
  const pdf = await loadPdfDocument(file);
  return pdf.numPages;
}
