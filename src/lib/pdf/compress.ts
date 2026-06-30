import { PDFDocument } from "pdf-lib";
import { loadPdfDocument, renderPageToCanvas } from "./pdfjs";

export type CompressionLevel = "light" | "medium" | "high";

const QUALITY_MAP: Record<CompressionLevel, { scale: number; quality: number }> = {
  light: { scale: 1.5, quality: 0.85 },
  medium: { scale: 1.2, quality: 0.7 },
  high: { scale: 1.0, quality: 0.55 },
};

export async function compressPdfLight(file: File): Promise<Uint8Array> {
  const bytes = await file.arrayBuffer();
  const pdf = await PDFDocument.load(bytes);
  return pdf.save({ useObjectStreams: true });
}

export async function compressPdf(
  file: File,
  level: CompressionLevel,
): Promise<Uint8Array> {
  if (level === "light") {
    return compressPdfLight(file);
  }

  const { scale, quality } = QUALITY_MAP[level];
  const source = await loadPdfDocument(file);
  const output = await PDFDocument.create();
  const pageCount = source.numPages;

  for (let i = 1; i <= pageCount; i++) {
    const canvas = await renderPageToCanvas(source, i, scale);
    const jpegDataUrl = canvas.toDataURL("image/jpeg", quality);
    const imageBytes = dataUrlToUint8Array(jpegDataUrl);
    const image = await output.embedJpg(imageBytes);
    const page = output.addPage([image.width, image.height]);
    page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
  }

  return output.save({ useObjectStreams: true });
}

function dataUrlToUint8Array(dataUrl: string): Uint8Array {
  const base64 = dataUrl.split(",")[1];
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}
