import { extractPagePlainText, loadPdfFromFile } from "./text-extract";

const STOP_WORDS = new Set(
  "a an the and or but in on at to for of is are was were be been being with this that it as by from".split(
    " ",
  ),
);

function scoreSentence(sentence: string, wordFreq: Map<string, number>): number {
  const words = sentence.toLowerCase().match(/\b[a-z]{3,}\b/g) ?? [];
  if (words.length === 0) return 0;
  let score = 0;
  for (const w of words) {
    if (!STOP_WORDS.has(w)) score += wordFreq.get(w) ?? 0;
  }
  return score / words.length;
}

export function extractiveSummary(text: string, maxSentences = 6): string {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (!cleaned) return "No text found to summarize.";

  const sentences = cleaned.match(/[^.!?]+[.!?]+|[^.!?]+$/g) ?? [cleaned];
  if (sentences.length <= maxSentences) {
    return sentences.map((s) => s.trim()).join(" ");
  }

  const words = cleaned.toLowerCase().match(/\b[a-z]{3,}\b/g) ?? [];
  const freq = new Map<string, number>();
  for (const w of words) {
    if (STOP_WORDS.has(w)) continue;
    freq.set(w, (freq.get(w) ?? 0) + 1);
  }

  const ranked = sentences
    .map((sentence, index) => ({
      index,
      sentence: sentence.trim(),
      score: scoreSentence(sentence, freq),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, maxSentences)
    .sort((a, b) => a.index - b.index);

  return ranked.map((r) => r.sentence).join(" ");
}

export async function summarizePdf(file: File, pageIndices: number[]): Promise<string> {
  const pdf = await loadPdfFromFile(file);
  const parts: string[] = [];

  for (const pageIndex of pageIndices) {
    const text = await extractPagePlainText(pdf, pageIndex + 1);
    if (text.trim()) parts.push(text.trim());
  }

  return extractiveSummary(parts.join("\n\n"));
}
