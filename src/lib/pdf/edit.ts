import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export interface AddTextOptions {
  text: string;
  fontSize?: number;
  pageIndices?: number[];
  x?: number;
  y?: number;
}

export async function addTextToPdf(file: File, options: AddTextOptions): Promise<Uint8Array> {
  const pdf = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const { text, fontSize = 14, pageIndices, x = 50, y = 50 } = options;
  const allIndices = pdf.getPageIndices();
  const targetSet = new Set(pageIndices ?? allIndices);

  for (const index of allIndices) {
    if (!targetSet.has(index)) continue;
    const page = pdf.getPage(index);
    page.drawText(text, {
      x,
      y,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
      maxWidth: page.getSize().width - x * 2,
      lineHeight: fontSize * 1.3,
    });
  }

  return pdf.save();
}
