import { PDFDocument, StandardFonts } from "pdf-lib";

const PAGE_WIDTH = 595;
const PAGE_HEIGHT = 842;
const MARGIN = 50;
const FONT_SIZE = 11;
const LINE_HEIGHT = FONT_SIZE * 1.45;

export async function textToPdf(text: string, title?: string): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);

  if (title) {
    pdf.setTitle(title);
  }

  let page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let y = PAGE_HEIGHT - MARGIN;
  const maxWidth = PAGE_WIDTH - MARGIN * 2;

  const wrapLine = (raw: string): string[] => {
    const words = raw.split(/\s+/).filter(Boolean);
    if (words.length === 0) return [""];
    const lines: string[] = [];
    let line = "";
    for (const word of words) {
      const test = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(test, FONT_SIZE) > maxWidth && line) {
        lines.push(line);
        line = word;
      } else {
        line = test;
      }
    }
    if (line) lines.push(line);
    return lines;
  };

  const paragraphs = text.split(/\n/);

  for (const para of paragraphs) {
    const lines = wrapLine(para);
    for (const line of lines) {
      if (y < MARGIN + LINE_HEIGHT) {
        page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
        y = PAGE_HEIGHT - MARGIN;
      }
      if (line) {
        page.drawText(line, { x: MARGIN, y, size: FONT_SIZE, font });
      }
      y -= LINE_HEIGHT;
    }
    y -= LINE_HEIGHT * 0.35;
  }

  return pdf.save();
}
