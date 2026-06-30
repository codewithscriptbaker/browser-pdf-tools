import { Document, Packer, Paragraph, PageBreak, TextRun, HeadingLevel } from "docx";
import { extractPagePlainText, loadPdfFromFile } from "./text-extract";
import {
  createOcrWorker,
  ocrPdfPage,
  terminateOcrWorker,
  type OcrLanguage,
  type OcrMode,
  type OcrProgressInfo,
} from "./ocr";

export interface PdfToWordOptions {
  ocrMode?: OcrMode;
  ocrLanguage?: OcrLanguage;
  onProgress?: (info: OcrProgressInfo) => void;
}

function shouldRunOcr(mode: OcrMode, hasEmbeddedText: boolean): boolean {
  if (mode === "always") return true;
  if (mode === "auto") return !hasEmbeddedText;
  return false;
}

export async function pdfToWord(
  file: File,
  pageIndices: number[],
  options: PdfToWordOptions = {},
): Promise<Blob> {
  const { ocrMode = "auto", ocrLanguage = "eng", onProgress } = options;
  const pdf = await loadPdfFromFile(file);
  const children: Paragraph[] = [];
  let ocrWorker = null;

  const needsAnyOcr =
    ocrMode !== "off" &&
    (ocrMode === "always" ||
      (await Promise.all(
        pageIndices.map(async (pageIndex) => {
          const text = await extractPagePlainText(pdf, pageIndex + 1);
          return !text.trim();
        }),
      )).some(Boolean));

  try {
    if (needsAnyOcr) {
      onProgress?.({
        page: 0,
        total: pageIndices.length,
        phase: "Loading OCR engine…",
        progress: 0,
      });
      ocrWorker = await createOcrWorker(ocrLanguage);
    }

    for (let i = 0; i < pageIndices.length; i++) {
      const pageIndex = pageIndices[i];
      let text = await extractPagePlainText(pdf, pageIndex + 1);
      const hasEmbeddedText = Boolean(text.trim());
      let usedOcr = false;

      if (shouldRunOcr(ocrMode, hasEmbeddedText) && ocrWorker) {
        onProgress?.({
          page: i + 1,
          total: pageIndices.length,
          phase: `OCR page ${pageIndex + 1}…`,
          progress: i / pageIndices.length,
        });

        text = await ocrPdfPage(ocrWorker, pdf, pageIndex);
        usedOcr = true;

        onProgress?.({
          page: i + 1,
          total: pageIndices.length,
          phase: `Finished page ${pageIndex + 1}`,
          progress: (i + 1) / pageIndices.length,
        });
      }

      children.push(
        new Paragraph({
          text: `Page ${pageIndex + 1}${usedOcr ? " (OCR)" : ""}`,
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 200 },
        }),
      );

      if (text.trim()) {
        const lines = text.split("\n").filter((line) => line.trim());
        for (const line of lines) {
          children.push(
            new Paragraph({
              children: [new TextRun(line)],
              spacing: { after: 120 },
            }),
          );
        }
      } else {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text:
                  ocrMode === "off"
                    ? "(No extractable text — enable Auto OCR for scanned pages.)"
                    : "(No text detected on this page.)",
                italics: true,
                color: "888888",
              }),
            ],
          }),
        );
      }

      if (i < pageIndices.length - 1) {
        children.push(new Paragraph({ children: [new PageBreak()] }));
      }
    }
  } finally {
    await terminateOcrWorker(ocrWorker);
  }

  onProgress?.({
    page: pageIndices.length,
    total: pageIndices.length,
    phase: "Building Word document…",
    progress: 1,
  });

  const doc = new Document({
    sections: [{ children }],
  });

  return Packer.toBlob(doc);
}
