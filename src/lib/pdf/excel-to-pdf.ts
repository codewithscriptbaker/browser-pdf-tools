import * as XLSX from "xlsx";
import { PDFDocument, StandardFonts } from "pdf-lib";

export async function excelToPdf(file: File): Promise<Uint8Array> {
  const wb = XLSX.read(await file.arrayBuffer(), { type: "array" });
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const fontSize = 9;
  const lineHeight = 13;
  const pageW = 842;
  const pageH = 595;
  const margin = 40;
  const maxLinesPerPage = Math.floor((pageH - margin * 2) / lineHeight) - 2;

  for (const sheetName of wb.SheetNames) {
    const sheet = wb.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json<(string | number)[]>(sheet, {
      header: 1,
      defval: "",
    });

    let lineIndex = 0;
    let page = pdf.addPage([pageW, pageH]);
    let y = pageH - margin;

    page.drawText(sheetName, { x: margin, y, size: 14, font });
    y -= lineHeight * 2;

    for (const row of rows) {
      const line = row.map(String).join("  |  ").slice(0, 140);
      if (lineIndex > 0 && lineIndex % maxLinesPerPage === 0) {
        page = pdf.addPage([pageW, pageH]);
        y = pageH - margin;
        page.drawText(`${sheetName} (cont.)`, { x: margin, y, size: 11, font });
        y -= lineHeight * 2;
      }
      page.drawText(line || " ", {
        x: margin,
        y,
        size: fontSize,
        font,
        maxWidth: pageW - margin * 2,
      });
      y -= lineHeight;
      lineIndex++;
    }
  }

  if (pdf.getPageCount() === 0) {
    const page = pdf.addPage([pageW, pageH]);
    page.drawText("Empty workbook", { x: margin, y: pageH - margin, size: 14, font });
  }

  pdf.setTitle(file.name.replace(/\.xlsx?$/i, ""));
  return pdf.save();
}
