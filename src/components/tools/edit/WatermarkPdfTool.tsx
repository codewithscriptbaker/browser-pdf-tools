"use client";

import { useEffect, useState } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { FileDropzone } from "@/components/tools/FileDropzone";
import { ToolButton } from "@/components/tools/ToolButton";
import { downloadBlob, toPdfBlob } from "@/lib/pdf/download";
import { watermarkPdf } from "@/lib/pdf/watermark";

export function WatermarkPdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [text, setText] = useState("CONFIDENTIAL");
  const [opacity, setOpacity] = useState(25);
  const [angle, setAngle] = useState(-45);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!file) return;
    import("@/lib/pdf/text-extract").then(async ({ loadPdfFromFile }) => {
      const pdf = await loadPdfFromFile(file);
      setPageCount(pdf.numPages);
    });
  }, [file]);

  const handleApply = async () => {
    if (!file || !text.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const bytes = await watermarkPdf(file, {
        text: text.trim(),
        opacity: opacity / 100,
        angle,
      });
      downloadBlob(toPdfBlob(bytes), `${file.name.replace(/\.pdf$/i, "")}_watermarked.pdf`);
    } catch {
      setError("Failed to add watermark.");
    } finally {
      setLoading(false);
    }
  };

  if (!file) {
    return (
      <FileDropzone onFiles={(f) => setFile(f[0])} label="Drop a PDF to watermark" hint="Add text stamp to every page" />
    );
  }

  return (
    <ToolWorkspace
      file={file}
      pageCount={pageCount}
      showPageGrid={false}
      settingsTitle="Watermark"
      onRemove={() => setFile(null)}
      error={error}
      settings={
        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-800 dark:text-zinc-200">
              Watermark text
            </label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full max-w-md rounded-xl border-2 border-zinc-200 px-4 py-3 text-sm dark:border-zinc-600 dark:bg-zinc-800"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-800 dark:text-zinc-200">
              Opacity ({opacity}%)
            </label>
            <input
              type="range"
              min={10}
              max={80}
              value={opacity}
              onChange={(e) => setOpacity(Number(e.target.value))}
              className="w-full max-w-md accent-teal-600"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-800 dark:text-zinc-200">
              Angle ({angle}°)
            </label>
            <input
              type="range"
              min={-90}
              max={90}
              value={angle}
              onChange={(e) => setAngle(Number(e.target.value))}
              className="w-full max-w-md accent-teal-600"
            />
          </div>
        </div>
      }
      action={
        <ToolButton onClick={handleApply} loading={loading} disabled={!text.trim()} size="large">
          Apply watermark
        </ToolButton>
      }
    />
  );
}
