import { PDFDocument } from "pdf-lib";

export interface SignOptions {
  signatureFile: File;
  pageIndices?: number[];
  width?: number;
  margin?: number;
}

export async function signPdf(file: File, options: SignOptions): Promise<Uint8Array> {
  const pdf = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
  const sigBytes = new Uint8Array(await options.signatureFile.arrayBuffer());
  const isPng =
    options.signatureFile.type === "image/png" ||
    options.signatureFile.name.toLowerCase().endsWith(".png");
  const signature = isPng ? await pdf.embedPng(sigBytes) : await pdf.embedJpg(sigBytes);

  const sigWidth = options.width ?? 120;
  const sigHeight = (signature.height / signature.width) * sigWidth;
  const margin = options.margin ?? 40;
  const allIndices = pdf.getPageIndices();
  const targetSet = new Set(options.pageIndices ?? allIndices);

  for (const index of allIndices) {
    if (!targetSet.has(index)) continue;
    const page = pdf.getPage(index);
    const { width } = page.getSize();
    page.drawImage(signature, {
      x: width - sigWidth - margin,
      y: margin,
      width: sigWidth,
      height: sigHeight,
    });
  }

  return pdf.save();
}
