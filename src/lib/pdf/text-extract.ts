import type { PDFDocumentProxy } from "pdfjs-dist";
import { loadPdfDocument } from "./pdfjs";

export interface TextItem {
  str: string;
  x: number;
  y: number;
}

export async function extractPageTextItems(
  pdf: PDFDocumentProxy,
  pageNumber: number,
): Promise<TextItem[]> {
  const page = await pdf.getPage(pageNumber);
  const content = await page.getTextContent();
  const items: TextItem[] = [];

  for (const item of content.items) {
    if (!("str" in item) || !item.str.trim()) continue;
    items.push({
      str: item.str,
      x: item.transform[4],
      y: item.transform[5],
    });
  }

  return items;
}

export async function extractPagePlainText(
  pdf: PDFDocumentProxy,
  pageNumber: number,
): Promise<string> {
  const items = await extractPageTextItems(pdf, pageNumber);
  if (items.length === 0) return "";

  const rows = groupTextIntoRows(items);
  return rows.map((row) => row.map((cell) => cell.str).join(" ")).join("\n");
}

export function groupTextIntoRows(items: TextItem[], yTolerance = 4): TextItem[][] {
  if (items.length === 0) return [];

  const sorted = [...items].sort((a, b) => b.y - a.y || a.x - b.x);
  const rows: TextItem[][] = [];
  let currentRow: TextItem[] = [sorted[0]];
  let currentY = sorted[0].y;

  for (let i = 1; i < sorted.length; i++) {
    const item = sorted[i];
    if (Math.abs(item.y - currentY) <= yTolerance) {
      currentRow.push(item);
    } else {
      currentRow.sort((a, b) => a.x - b.x);
      rows.push(currentRow);
      currentRow = [item];
      currentY = item.y;
    }
  }

  currentRow.sort((a, b) => a.x - b.x);
  rows.push(currentRow);
  return rows;
}

export function rowsToTable(rows: TextItem[][]): string[][] {
  if (rows.length === 0) return [];

  const table: string[][] = [];

  for (const row of rows) {
    if (row.length === 0) continue;

    const cells: string[] = [];
    let current = row[0].str;
    let lastX = row[0].x;

    for (let i = 1; i < row.length; i++) {
      const gap = row[i].x - lastX;
      if (gap > 25) {
        cells.push(current.trim());
        current = row[i].str;
      } else {
        current += ` ${row[i].str}`;
      }
      lastX = row[i].x;
    }
    cells.push(current.trim());
    table.push(cells);
  }

  const maxCols = Math.max(...table.map((r) => r.length), 1);
  return table.map((row) => {
    while (row.length < maxCols) row.push("");
    return row;
  });
}

export async function extractPageTable(
  pdf: PDFDocumentProxy,
  pageNumber: number,
): Promise<string[][]> {
  const items = await extractPageTextItems(pdf, pageNumber);
  const rows = groupTextIntoRows(items);
  const table = rowsToTable(rows);
  return table.length > 0 ? table : [["(No extractable text on this page)"]];
}

export async function loadPdfFromFile(file: File) {
  return loadPdfDocument(file);
}
