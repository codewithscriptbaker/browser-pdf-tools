import { PDFDocument } from "pdf-lib";

/** Copy pages in custom order; omitted indices are deleted. */
export async function organizePdf(file: File, pageOrder: number[]): Promise<Uint8Array> {
  const bytes = await file.arrayBuffer();
  const source = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const output = await PDFDocument.create();

  if (pageOrder.length === 0) {
    throw new Error("At least one page is required.");
  }

  const copied = await output.copyPages(source, pageOrder);
  copied.forEach((page) => output.addPage(page));

  return output.save();
}
