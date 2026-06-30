import { PDFDocument } from "pdf-lib";

/** Best-effort archival PDF — embeds metadata and rebuilds structure. */
export async function pdfToPdfa(file: File): Promise<Uint8Array> {
  const bytes = await file.arrayBuffer();
  const source = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const output = await PDFDocument.create();

  const indices = source.getPageIndices();
  const pages = await output.copyPages(source, indices);
  pages.forEach((p) => output.addPage(p));

  const baseName = file.name.replace(/\.pdf$/i, "");
  output.setTitle(baseName);
  output.setProducer("PDF Tools PDF/A Converter");
  output.setCreator("PDF Tools");
  output.setSubject("Converted for long-term archiving (PDF/A best effort)");
  output.setKeywords(["PDF/A", "archive", "PDF Tools"]);

  return output.save({ useObjectStreams: false });
}
