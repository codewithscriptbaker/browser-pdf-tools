import JSZip from "jszip";
import { loadPdfDocument } from "./pdfjs";

export type JpgQuality = "high" | "medium" | "low";
export type ImageFormat = "jpeg" | "png";

const SETTINGS: Record<JpgQuality, { scale: number; quality: number }> = {
  high: { scale: 2.5, quality: 0.92 },
  medium: { scale: 1.75, quality: 0.85 },
  low: { scale: 1.25, quality: 0.75 },
};

export interface PdfToJpgOptions {
  quality: JpgQuality;
  format: ImageFormat;
  pageIndices: number[];
}

export interface ConvertedImage {
  filename: string;
  blob: Blob;
}

export async function pdfToImages(
  file: File,
  options: PdfToJpgOptions,
): Promise<ConvertedImage[]> {
  const pdf = await loadPdfDocument(file);
  const { scale, quality } = SETTINGS[options.quality];
  const mime = options.format === "png" ? "image/png" : "image/jpeg";
  const ext = options.format === "png" ? "png" : "jpg";
  const baseName = file.name.replace(/\.pdf$/i, "");
  const results: ConvertedImage[] = [];

  for (const pageIndex of options.pageIndices) {
    const page = await pdf.getPage(pageIndex + 1);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) throw new Error("Could not get canvas context");

    canvas.width = viewport.width;
    canvas.height = viewport.height;
    await page.render({ canvasContext: context, viewport, canvas }).promise;

    const dataUrl =
      options.format === "png"
        ? canvas.toDataURL("image/png")
        : canvas.toDataURL("image/jpeg", quality);

    const blob = dataUrlToBlob(dataUrl);
    results.push({
      filename: `${baseName}_page_${pageIndex + 1}.${ext}`,
      blob,
    });
  }

  return results;
}

export async function pdfToImagesZip(file: File, options: PdfToJpgOptions): Promise<Blob> {
  const images = await pdfToImages(file, options);
  const zip = new JSZip();
  images.forEach((img) => zip.file(img.filename, img.blob));
  return zip.generateAsync({ type: "blob" });
}

function dataUrlToBlob(dataUrl: string): Blob {
  const [header, base64] = dataUrl.split(",");
  const mime = header.match(/:(.*?);/)?.[1] ?? "image/jpeg";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}
