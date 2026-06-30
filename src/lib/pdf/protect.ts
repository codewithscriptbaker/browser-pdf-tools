import { PDFDocument } from "@cantoo/pdf-lib";

export async function protectPdf(file: File, password: string): Promise<Uint8Array> {
  if (!password.trim()) {
    throw new Error("Password is required.");
  }

  const bytes = await file.arrayBuffer();
  const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
  pdf.encrypt({
    userPassword: password,
    ownerPassword: password,
    permissions: {
      printing: "highResolution",
      modifying: false,
      copying: false,
      annotating: false,
    },
  });

  return pdf.save();
}
