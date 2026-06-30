"use client";

import { useEffect, useState } from "react";
import { OptionCards } from "@/components/tools/OptionCards";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { FileDropzone } from "@/components/tools/FileDropzone";
import { ToolButton } from "@/components/tools/ToolButton";
import { downloadBlob } from "@/lib/pdf/download";
import {
  pdfToImages,
  pdfToImagesZip,
  type ImageFormat,
  type JpgQuality,
} from "@/lib/pdf/pdf-to-jpg";

export function PdfToJpgTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
  const [quality, setQuality] = useState<JpgQuality>("high");
  const [format, setFormat] = useState<ImageFormat>("jpeg");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!file) return;
    import("@/lib/pdf/text-extract").then(async ({ loadPdfFromFile }) => {
      const pdf = await loadPdfFromFile(file);
      const count = pdf.numPages;
      setPageCount(count);
      setSelectedPages(new Set(Array.from({ length: count }, (_, i) => i)));
    });
  }, [file]);

  const handleConvert = async () => {
    if (!file || selectedPages.size === 0) return;
    setLoading(true);
    setError(null);
    try {
      const indices = [...selectedPages].sort((a, b) => a - b);
      const options = { quality, format, pageIndices: indices };
      const baseName = file.name.replace(/\.pdf$/i, "");
      if (indices.length === 1) {
        const [image] = await pdfToImages(file, options);
        downloadBlob(image.blob, image.filename);
      } else {
        downloadBlob(await pdfToImagesZip(file, options), `${baseName}_images.zip`);
      }
    } catch {
      setError("Conversion failed. Try a different PDF or lower quality.");
    } finally {
      setLoading(false);
    }
  };

  if (!file) {
    return (
      <FileDropzone
        onFiles={(files) => {
          setFile(files[0]);
          setError(null);
        }}
        multiple={false}
        label="Drop a PDF to convert to images"
        hint="JPG or PNG — select pages and download"
      />
    );
  }

  return (
    <ToolWorkspace
      file={file}
      pageCount={pageCount}
      settingsTitle="Export settings"
      selectedPages={selectedPages}
      onTogglePage={(i) =>
        setSelectedPages((prev) => {
          const next = new Set(prev);
          if (next.has(i)) next.delete(i);
          else next.add(i);
          return next;
        })
      }
      onSelectAll={() =>
        setSelectedPages(new Set(Array.from({ length: pageCount }, (_, i) => i)))
      }
      onClearSelection={() => setSelectedPages(new Set())}
      onRemove={() => {
        setFile(null);
        setSelectedPages(new Set());
        setPageCount(0);
      }}
      error={error}
      settings={
        <div className="grid gap-8 lg:grid-cols-2">
          <OptionCards
            label="Image quality"
            value={quality}
            onChange={setQuality}
            columns={3}
            options={[
              { value: "high", label: "High", hint: "Sharpest output, larger files" },
              { value: "medium", label: "Medium", hint: "Good balance" },
              { value: "low", label: "Low", hint: "Smallest files" },
            ]}
          />
          <OptionCards
            label="File format"
            value={format}
            onChange={setFormat}
            columns={2}
            options={[
              { value: "jpeg", label: "JPG", hint: "Smaller photos, no transparency" },
              { value: "png", label: "PNG", hint: "Lossless, supports transparency" },
            ]}
          />
        </div>
      }
      action={
        <ToolButton
          onClick={handleConvert}
          loading={loading}
          disabled={selectedPages.size === 0}
          size="large"
        >
          Convert {selectedPages.size} page{selectedPages.size !== 1 ? "s" : ""} to{" "}
          {format === "jpeg" ? "JPG" : "PNG"}
        </ToolButton>
      }
      actionHint={
        selectedPages.size > 1
          ? "Multiple pages will be packaged in a ZIP file."
          : "A single image file will download."
      }
    />
  );
}
