import { extractPagePlainText, loadPdfFromFile } from "./text-extract";
import { textToPdf } from "./text-to-pdf";

export const TRANSLATE_LANGUAGES = [
  { code: "en", label: "English" },
  { code: "es", label: "Spanish" },
  { code: "fr", label: "French" },
  { code: "de", label: "German" },
  { code: "pt", label: "Portuguese" },
  { code: "it", label: "Italian" },
  { code: "ar", label: "Arabic" },
  { code: "zh", label: "Chinese" },
  { code: "ja", label: "Japanese" },
  { code: "hi", label: "Hindi" },
] as const;

export type TranslateLang = (typeof TRANSLATE_LANGUAGES)[number]["code"];

function chunkText(text: string, maxLen = 450): string[] {
  const chunks: string[] = [];
  let remaining = text;
  while (remaining.length > maxLen) {
    let splitAt = remaining.lastIndexOf(" ", maxLen);
    if (splitAt < maxLen * 0.5) splitAt = maxLen;
    chunks.push(remaining.slice(0, splitAt).trim());
    remaining = remaining.slice(splitAt).trim();
  }
  if (remaining) chunks.push(remaining);
  return chunks;
}

async function translateChunk(text: string, from: TranslateLang, to: TranslateLang): Promise<string> {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Translation service unavailable.");
  const data = (await res.json()) as {
    responseData?: { translatedText?: string };
    responseStatus?: number;
  };
  if (data.responseStatus && data.responseStatus !== 200) {
    throw new Error("Translation failed for a text segment.");
  }
  return data.responseData?.translatedText ?? text;
}

export async function translateText(
  text: string,
  from: TranslateLang,
  to: TranslateLang,
  onProgress?: (done: number, total: number) => void,
): Promise<string> {
  if (from === to) return text;
  const chunks = chunkText(text);
  const out: string[] = [];

  for (let i = 0; i < chunks.length; i++) {
    onProgress?.(i + 1, chunks.length);
    out.push(await translateChunk(chunks[i], from, to));
    if (i < chunks.length - 1) {
      await new Promise((r) => setTimeout(r, 350));
    }
  }

  return out.join(" ");
}

export async function translatePdfToText(
  file: File,
  pageIndices: number[],
  from: TranslateLang,
  to: TranslateLang,
  onProgress?: (phase: string) => void,
): Promise<string> {
  const pdf = await loadPdfFromFile(file);
  const parts: string[] = [];

  for (let i = 0; i < pageIndices.length; i++) {
    const pageIndex = pageIndices[i];
    onProgress?.(`Extracting page ${i + 1}/${pageIndices.length}`);
    const text = await extractPagePlainText(pdf, pageIndex + 1);
    if (!text.trim()) continue;
    onProgress?.(`Translating page ${i + 1}/${pageIndices.length}`);
    const translated = await translateText(text, from, to);
    parts.push(`--- Page ${pageIndex + 1} ---\n${translated.trim()}`);
  }

  return parts.join("\n\n");
}

export async function translatePdf(
  file: File,
  pageIndices: number[],
  from: TranslateLang,
  to: TranslateLang,
  onProgress?: (phase: string) => void,
): Promise<Uint8Array> {
  const text = await translatePdfToText(file, pageIndices, from, to, onProgress);
  const baseName = file.name.replace(/\.pdf$/i, "");
  return textToPdf(text || " ", `${baseName} (${to})`);
}
