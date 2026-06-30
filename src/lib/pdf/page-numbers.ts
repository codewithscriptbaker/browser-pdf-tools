import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export type PageNumberPosition = "bottom-center" | "bottom-right" | "top-center" | "top-right";

export interface PageNumberOptions {
  position: PageNumberPosition;
  format: "number" | "page-n" | "n-of-t";
  startAt?: number;
  fontSize?: number;
}

export async function addPageNumbers(file: File, options: PageNumberOptions): Promise<Uint8Array> {
  const pdf = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const pages = pdf.getPages();
  const total = pages.length;
  const { position, format, startAt = 1, fontSize = 11 } = options;

  pages.forEach((page, index) => {
    const num = index + startAt;
    const label =
      format === "number"
        ? `${num}`
        : format === "page-n"
          ? `Page ${num}`
          : `${num} of ${startAt + total - 1}`;

    const { width, height } = page.getSize();
    const textWidth = font.widthOfTextAtSize(label, fontSize);
    const margin = 36;

    let x = width / 2 - textWidth / 2;
    let y = margin;

    if (position === "bottom-right") {
      x = width - margin - textWidth;
      y = margin;
    } else if (position === "top-center") {
      x = width / 2 - textWidth / 2;
      y = height - margin - fontSize;
    } else if (position === "top-right") {
      x = width - margin - textWidth;
      y = height - margin - fontSize;
    }

    page.drawText(label, {
      x,
      y,
      size: fontSize,
      font,
      color: rgb(0.2, 0.2, 0.2),
    });
  });

  return pdf.save();
}
