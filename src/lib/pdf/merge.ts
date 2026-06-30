import { PDFDocument } from "pdf-lib";

export interface PageRef {
  fileIndex: number;
  pageIndex: number;
}

async function loadAllPdfs(files: File[]) {
  return Promise.all(
    files.map(async (file) => PDFDocument.load(await file.arrayBuffer())),
  );
}

export async function mergePdfs(files: File[]): Promise<Uint8Array> {
  const loaded = await loadAllPdfs(files);
  const merged = await PDFDocument.create();

  for (const pdf of loaded) {
    const pages = await merged.copyPages(pdf, pdf.getPageIndices());
    pages.forEach((page) => merged.addPage(page));
  }

  return merged.save({ useObjectStreams: true });
}

export async function mergePdfPages(
  files: File[],
  pageOrder: PageRef[],
): Promise<Uint8Array> {
  if (pageOrder.length === 0) {
    throw new Error("No pages to merge");
  }

  const loaded = await loadAllPdfs(files);
  const merged = await PDFDocument.create();

  for (const { fileIndex, pageIndex } of pageOrder) {
    const source = loaded[fileIndex];
    const [page] = await merged.copyPages(source, [pageIndex]);
    merged.addPage(page);
  }

  return merged.save({ useObjectStreams: true });
}
