import { PDFDocument, StandardFonts, degrees, rgb } from "pdf-lib";

export interface WatermarkOptions {
  text: string;
  opacity?: number;
  fontSize?: number;
  angle?: number;
}

export async function watermarkPdf(file: File, options: WatermarkOptions): Promise<Uint8Array> {
  const pdf = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
  const font = await pdf.embedFont(StandardFonts.HelveticaBold);
  const { text, opacity = 0.25, fontSize = 48, angle = -45 } = options;

  for (const page of pdf.getPages()) {
    const { width, height } = page.getSize();
    const textWidth = font.widthOfTextAtSize(text, fontSize);
    page.drawText(text, {
      x: width / 2 - textWidth / 2,
      y: height / 2 - fontSize / 2,
      size: fontSize,
      font,
      color: rgb(0.45, 0.45, 0.45),
      opacity,
      rotate: degrees(angle),
    });
  }

  return pdf.save();
}
