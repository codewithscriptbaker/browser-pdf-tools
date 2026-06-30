"use client";

import { useEffect, useState } from "react";
import { OptionCards } from "@/components/tools/OptionCards";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { FileDropzone } from "@/components/tools/FileDropzone";
import { ToolButton } from "@/components/tools/ToolButton";
import { downloadBlob, formatFileSize, toPdfBlob } from "@/lib/pdf/download";
import { compressPdf, type CompressionLevel } from "@/lib/pdf/compress";

export function CompressPdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [level, setLevel] = useState<CompressionLevel>("medium");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ original: number; compressed: number } | null>(null);

  useEffect(() => {
    if (!file) return;
    import("@/lib/pdf/text-extract").then(async ({ loadPdfFromFile }) => {
      const pdf = await loadPdfFromFile(file);
      setPageCount(pdf.numPages);
    });
  }, [file]);

  const handleCompress = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const bytes = await compressPdf(file, level);
      setResult({ original: file.size, compressed: bytes.length });
      downloadBlob(toPdfBlob(bytes), `${file.name.replace(/\.pdf$/i, "")}_compressed.pdf`);
    } catch {
      setError("Failed to compress. Try Light compression for complex documents.");
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
          setResult(null);
        }}
        multiple={false}
        label="Drop a PDF to compress"
        hint="Choose a compression level and download a smaller file"
      />
    );
  }

  const savings =
    result && result.original > 0
      ? Math.round((1 - result.compressed / result.original) * 100)
      : null;

  return (
    <ToolWorkspace
      file={file}
      pageCount={pageCount}
      settingsTitle="Compression"
      onRemove={() => {
        setFile(null);
        setResult(null);
        setError(null);
      }}
      error={error}
      showPageGrid={false}
      settings={
        <div className="space-y-6">
          <OptionCards
            label="Compression level"
            description="Higher compression reduces file size more but may soften images."
            value={level}
            onChange={setLevel}
            columns={3}
            options={[
              { value: "light", label: "Light", hint: "Best quality, modest size reduction" },
              { value: "medium", label: "Medium", hint: "Balanced quality and file size" },
              { value: "high", label: "High", hint: "Smallest file, softer images" },
            ]}
          />
          {result && (
            <div className="rounded-xl border border-teal-200 bg-teal-50 px-5 py-4 dark:border-teal-800 dark:bg-teal-950/30">
              <p className="text-sm font-medium text-teal-900 dark:text-teal-200">
                Last result: {formatFileSize(result.original)} → {formatFileSize(result.compressed)}
                {savings !== null && savings > 0 && (
                  <span className="ml-1 text-teal-700 dark:text-teal-300">
                    ({savings}% smaller)
                  </span>
                )}
              </p>
            </div>
          )}
        </div>
      }
      action={
        <ToolButton onClick={handleCompress} loading={loading} size="large">
          Compress PDF
        </ToolButton>
      }
    />
  );
}
