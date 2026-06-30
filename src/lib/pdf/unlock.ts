import { PDFDocument } from "pdf-lib";

/** Rebuild PDF without encryption metadata (best-effort unlock). */
export async function unlockPdf(file: File): Promise<Uint8Array> {
  const bytes = await file.arrayBuffer();
  const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
  return pdf.save({ useObjectStreams: false });
}
