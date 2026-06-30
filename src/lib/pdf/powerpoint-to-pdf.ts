import JSZip from "jszip";
import { textToPdf } from "./text-to-pdf";

async function extractPptxSlideTexts(arrayBuffer: ArrayBuffer): Promise<string[]> {
  const zip = await JSZip.loadAsync(arrayBuffer);
  const slidePaths = Object.keys(zip.files)
    .filter((p) => /^ppt\/slides\/slide\d+\.xml$/i.test(p))
    .sort((a, b) => {
      const na = parseInt(a.match(/(\d+)/)?.[1] ?? "0", 10);
      const nb = parseInt(b.match(/(\d+)/)?.[1] ?? "0", 10);
      return na - nb;
    });

  const slides: string[] = [];
  for (const path of slidePaths) {
    const xml = await zip.file(path)!.async("text");
    const texts: string[] = [];
    const regex = /<a:t[^>]*>([^<]*)<\/a:t>/g;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(xml)) !== null) {
      if (match[1]) texts.push(match[1]);
    }
    slides.push(texts.join("\n"));
  }
  return slides;
}

export async function powerpointToPdf(file: File): Promise<Uint8Array> {
  const slides = await extractPptxSlideTexts(await file.arrayBuffer());
  const body =
    slides.length === 0
      ? " "
      : slides.map((text, i) => `--- Slide ${i + 1} ---\n${text || "(no text)"}`).join("\n\n");
  const baseName = file.name.replace(/\.pptx?$/i, "");
  return textToPdf(body, baseName);
}
