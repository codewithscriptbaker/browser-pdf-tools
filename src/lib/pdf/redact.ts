import { PDFDocument, rgb } from "pdf-lib";
import { extractPageTextItems } from "./text-extract";
import { loadPdfDocument } from "./pdfjs";

export async function redactPdf(
  file: File,
  searchTerms: string[],
  pageIndices?: number[],
): Promise<Uint8Array> {
  const terms = searchTerms.map((t) => t.trim().toLowerCase()).filter(Boolean);
  if (terms.length === 0) {
    throw new Error("Enter at least one word or phrase to redact.");
  }

  const pdfJs = await loadPdfDocument(file);
  const bytes = await file.arrayBuffer();
  const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const pages = pdf.getPages();
  const targets = new Set(pageIndices ?? pages.map((_, i) => i));

  for (let pageIndex = 0; pageIndex < pages.length; pageIndex++) {
    if (!targets.has(pageIndex)) continue;

    const items = await extractPageTextItems(pdfJs, pageIndex + 1);
    const page = pages[pageIndex];
    const { height } = page.getSize();

    for (const item of items) {
      const lower = item.str.toLowerCase();
      if (!terms.some((term) => lower.includes(term))) continue;

      const approxWidth = Math.max(item.str.length * 6, 20);
      page.drawRectangle({
        x: item.x - 1,
        y: height - item.y - 14,
        width: approxWidth,
        height: 16,
        color: rgb(0, 0, 0),
        borderWidth: 0,
      });
    }
  }

  return pdf.save();
}
