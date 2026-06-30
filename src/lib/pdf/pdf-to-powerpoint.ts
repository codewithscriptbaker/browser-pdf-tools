import PptxGenJS from "pptxgenjs";
import { pdfToImages, type PdfToJpgOptions } from "./pdf-to-jpg";

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export async function pdfToPowerpoint(
  file: File,
  pageIndices: number[],
  quality: PdfToJpgOptions["quality"] = "medium",
): Promise<Blob> {
  const images = await pdfToImages(file, {
    quality,
    format: "jpeg",
    pageIndices,
  });

  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_16x9";
  pptx.author = "PDF Tools";

  for (const img of images) {
    const dataUrl = await blobToDataUrl(img.blob);
    const slide = pptx.addSlide();
    slide.addImage({ data: dataUrl, x: 0, y: 0, w: "100%", h: "100%", sizing: { type: "contain", w: "100%", h: "100%" } });
  }

  const result = await pptx.write({ outputType: "blob" });
  return result as Blob;
}
