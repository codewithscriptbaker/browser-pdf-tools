import { PDFDocument } from "pdf-lib";

export type SplitMode = "all" | "range";

export interface PageRange {
  start: number;
  end: number;
}

export async function splitPdfAllPages(file: File): Promise<Uint8Array[]> {
  const bytes = await file.arrayBuffer();
  const source = await PDFDocument.load(bytes);
  const pageCount = source.getPageCount();
  const results: Uint8Array[] = [];

  for (let i = 0; i < pageCount; i++) {
    const doc = await PDFDocument.create();
    const [page] = await doc.copyPages(source, [i]);
    doc.addPage(page);
    results.push(await doc.save({ useObjectStreams: true }));
  }

  return results;
}

export async function splitPdfByRange(
  file: File,
  startPage: number,
  endPage: number,
): Promise<Uint8Array> {
  const bytes = await file.arrayBuffer();
  const source = await PDFDocument.load(bytes);
  const pageCount = source.getPageCount();

  const start = Math.max(1, Math.min(startPage, pageCount));
  const end = Math.max(start, Math.min(endPage, pageCount));
  const indices = Array.from({ length: end - start + 1 }, (_, i) => start - 1 + i);

  const doc = await PDFDocument.create();
  const pages = await doc.copyPages(source, indices);
  pages.forEach((page) => doc.addPage(page));

  return doc.save({ useObjectStreams: true });
}

export async function splitPdfByPageIndices(
  file: File,
  pageIndices: number[],
): Promise<Uint8Array> {
  if (pageIndices.length === 0) {
    throw new Error("No pages selected");
  }

  const bytes = await file.arrayBuffer();
  const source = await PDFDocument.load(bytes);
  const sorted = [...new Set(pageIndices)].sort((a, b) => a - b);

  const doc = await PDFDocument.create();
  const pages = await doc.copyPages(source, sorted);
  pages.forEach((page) => doc.addPage(page));

  return doc.save({ useObjectStreams: true });
}

export async function splitPdfByMultipleRanges(
  file: File,
  ranges: PageRange[],
): Promise<Uint8Array[]> {
  const results: Uint8Array[] = [];
  for (const range of ranges) {
    results.push(await splitPdfByRange(file, range.start, range.end));
  }
  return results;
}

export function parsePageRange(
  input: string,
  pageCount: number,
): { valid: boolean; start: number; end: number; error?: string } {
  const trimmed = input.trim();
  const match = trimmed.match(/^(\d+)\s*-\s*(\d+)$/);

  if (!match) {
    return { valid: false, start: 1, end: 1, error: "Use format: 1-5" };
  }

  const start = parseInt(match[1], 10);
  const end = parseInt(match[2], 10);

  if (start < 1 || end < 1 || start > pageCount || end > pageCount) {
    return {
      valid: false,
      start,
      end,
      error: `Pages must be between 1 and ${pageCount}`,
    };
  }

  if (start > end) {
    return { valid: false, start, end, error: "Start page must be ≤ end page" };
  }

  return { valid: true, start, end };
}

export function parseMultiplePageRanges(
  input: string,
  pageCount: number,
): { valid: boolean; ranges: PageRange[]; error?: string } {
  const parts = input
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);

  if (parts.length === 0) {
    return { valid: false, ranges: [], error: "Enter at least one range" };
  }

  const ranges: PageRange[] = [];

  for (const part of parts) {
    if (part.includes("-")) {
      const parsed = parsePageRange(part, pageCount);
      if (!parsed.valid) {
        return { valid: false, ranges: [], error: parsed.error };
      }
      ranges.push({ start: parsed.start, end: parsed.end });
    } else {
      const num = parseInt(part, 10);
      if (isNaN(num) || num < 1 || num > pageCount) {
        return {
          valid: false,
          ranges: [],
          error: `Page ${part} must be between 1 and ${pageCount}`,
        };
      }
      ranges.push({ start: num, end: num });
    }
  }

  return { valid: true, ranges };
}

export function pageIndicesToRange(indices: number[]): PageRange | null {
  if (indices.length === 0) return null;
  const sorted = [...indices].sort((a, b) => a - b);
  return { start: sorted[0] + 1, end: sorted[sorted.length - 1] + 1 };
}

export function rangeToPageSet(range: PageRange): Set<number> {
  const set = new Set<number>();
  for (let p = range.start; p <= range.end; p++) set.add(p - 1);
  return set;
}
