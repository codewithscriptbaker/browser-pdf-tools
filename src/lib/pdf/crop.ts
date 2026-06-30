import { PDFDocument } from "pdf-lib";
import { loadPdfDocument } from "./pdfjs";

export interface CropMargins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

async function canvasToPngBytes(canvas: HTMLCanvasElement): Promise<Uint8Array> {
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Canvas export failed"))), "image/png");
  });
  return new Uint8Array(await blob.arrayBuffer());
}

export async function cropPdf(file: File, margins: CropMargins, scale = 2): Promise<Uint8Array> {
  const pdfJs = await loadPdfDocument(file);
  const output = await PDFDocument.create();
  const pageCount = pdfJs.numPages;

  for (let i = 0; i < pageCount; i++) {
    const page = await pdfJs.getPage(i + 1);
    const viewport = page.getViewport({ scale });
    const cropLeft = (margins.left / 100) * viewport.width;
    const cropTop = (margins.top / 100) * viewport.height;
    const cropRight = (margins.right / 100) * viewport.width;
    const cropBottom = (margins.bottom / 100) * viewport.height;

    const outW = Math.max(1, Math.floor(viewport.width - cropLeft - cropRight));
    const outH = Math.max(1, Math.floor(viewport.height - cropTop - cropBottom));

    const fullCanvas = document.createElement("canvas");
    fullCanvas.width = viewport.width;
    fullCanvas.height = viewport.height;
    const fullCtx = fullCanvas.getContext("2d")!;
    await page.render({ canvasContext: fullCtx, viewport, canvas: fullCanvas }).promise;

    const cropped = document.createElement("canvas");
    cropped.width = outW;
    cropped.height = outH;
    const ctx = cropped.getContext("2d")!;
    ctx.drawImage(fullCanvas, cropLeft, cropTop, outW, outH, 0, 0, outW, outH);

    const png = await canvasToPngBytes(cropped);
    const widthPt = outW / scale;
    const heightPt = outH / scale;
    const image = await output.embedPng(png);
    const newPage = output.addPage([widthPt, heightPt]);
    newPage.drawImage(image, { x: 0, y: 0, width: widthPt, height: heightPt });
  }

  return output.save({ useObjectStreams: false });
}
