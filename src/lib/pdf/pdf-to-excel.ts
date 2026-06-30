import * as XLSX from "xlsx";
import { extractPageTable, loadPdfFromFile } from "./text-extract";

export async function pdfToExcel(file: File, pageIndices: number[]): Promise<Blob> {
  const pdf = await loadPdfFromFile(file);
  const workbook = XLSX.utils.book_new();

  for (const pageIndex of pageIndices) {
    const table = await extractPageTable(pdf, pageIndex + 1);
    const sheet = XLSX.utils.aoa_to_sheet(table);
    const sheetName = `Page ${pageIndex + 1}`.slice(0, 31);
    XLSX.utils.book_append_sheet(workbook, sheet, sheetName);
  }

  const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  return new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
}
