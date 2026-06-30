import { PDFDocument, degrees } from "pdf-lib";
import { loadPdfDocument } from "./pdfjs";

function normalizeAngle(angle: number): number {
  return ((Math.round(angle) % 360) + 360) % 360;
}

function isRightAngle(angle: number): boolean {
  const n = normalizeAngle(angle);
  return n === 90 || n === 180 || n === 270;
}

async function canvasToPngBytes(canvas: HTMLCanvasElement): Promise<Uint8Array> {
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((b) => {
      if (b) resolve(b);
      else reject(new Error("Could not export rotated page as PNG"));
    }, "image/png");
  });
  return new Uint8Array(await blob.arrayBuffer());
}

/**
 * Renders a page and applies an extra rotation (degrees, signed) via canvas 2D —
 * matches the CSS preview in the UI.
 */
async function renderRotatedPageToPng(
  file: File,
  pageIndex: number,
  angleDeg: number,
  scale = 2,
): Promise<{ png: Uint8Array; widthPt: number; heightPt: number }> {
  const pdf = await loadPdfDocument(file);
  const page = await pdf.getPage(pageIndex + 1);
  const viewport = page.getViewport({ scale });

  const srcCanvas = document.createElement("canvas");
  srcCanvas.width = viewport.width;
  srcCanvas.height = viewport.height;
  const srcCtx = srcCanvas.getContext("2d");
  if (!srcCtx) throw new Error("Could not get canvas context");

  await page.render({ canvasContext: srcCtx, viewport, canvas: srcCanvas }).promise;

  const rad = (angleDeg * Math.PI) / 180;
  const absCos = Math.abs(Math.cos(rad));
  const absSin = Math.abs(Math.sin(rad));
  const outW = Math.ceil(viewport.width * absCos + viewport.height * absSin);
  const outH = Math.ceil(viewport.width * absSin + viewport.height * absCos);

  const canvas = document.createElement("canvas");
  canvas.width = outW;
  canvas.height = outH;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, outW, outH);
  ctx.translate(outW / 2, outH / 2);
  ctx.rotate(rad);
  ctx.drawImage(srcCanvas, -viewport.width / 2, -viewport.height / 2, viewport.width, viewport.height);

  const png = await canvasToPngBytes(canvas);
  return {
    png,
    widthPt: outW / scale,
    heightPt: outH / scale,
  };
}

export async function rotatePdf(
  file: File,
  angle: number,
  pageIndices?: number[],
): Promise<Uint8Array> {
  if (Math.round(angle) === 0 || normalizeAngle(angle) === 0) {
    return new Uint8Array(await file.arrayBuffer());
  }

  const bytes = await file.arrayBuffer();
  const source = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const output = await PDFDocument.create();
  const allIndices = source.getPageIndices();
  const rotateSet = new Set(pageIndices ?? allIndices);
  const normalized = normalizeAngle(angle);
  const useVectorRotation = isRightAngle(angle);

  for (const index of allIndices) {
    if (!rotateSet.has(index)) {
      const [page] = await output.copyPages(source, [index]);
      output.addPage(page);
      continue;
    }

    if (useVectorRotation) {
      const [page] = await output.copyPages(source, [index]);
      const current = page.getRotation().angle;
      page.setRotation(degrees((current + normalized) % 360));
      output.addPage(page);
    } else {
      const { png, widthPt, heightPt } = await renderRotatedPageToPng(file, index, angle);
      const image = await output.embedPng(png);
      const page = output.addPage([widthPt, heightPt]);
      page.drawImage(image, { x: 0, y: 0, width: widthPt, height: heightPt });
    }
  }

  return output.save({ useObjectStreams: false });
}
