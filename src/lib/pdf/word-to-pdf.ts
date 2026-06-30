import mammoth from "mammoth";
import { textToPdf } from "./text-to-pdf";

export async function wordToPdf(file: File): Promise<Uint8Array> {
  const buffer = await file.arrayBuffer();
  const { value } = await mammoth.extractRawText({ arrayBuffer: buffer });
  const baseName = file.name.replace(/\.docx?$/i, "");
  return textToPdf(value || " ", baseName);
}
