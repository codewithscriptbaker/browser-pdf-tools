import { PDFDocument } from "pdf-lib";

/** Rebuild PDF structure — may fix minor corruption. */
export async function repairPdf(file: File): Promise<Uint8Array> {
  const bytes = await file.arrayBuffer();
  const source = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const output = await PDFDocument.create();
  const indices = source.getPageIndices();
  const pages = await output.copyPages(source, indices);
  pages.forEach((p) => output.addPage(p));
  return output.save({ useObjectStreams: false });
}
