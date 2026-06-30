"use client";

import { useEffect, useState } from "react";
import { OptionCards } from "@/components/tools/OptionCards";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { FileDropzone } from "@/components/tools/FileDropzone";
import { ToolButton } from "@/components/tools/ToolButton";
import { downloadBlob, toPdfBlob } from "@/lib/pdf/download";
import { addPageNumbers, type PageNumberPosition } from "@/lib/pdf/page-numbers";

export function PageNumbersTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [position, setPosition] = useState<PageNumberPosition>("bottom-center");
  const [format, setFormat] = useState<"number" | "page-n" | "n-of-t">("page-n");
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
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const bytes = await addPageNumbers(file, { position, format });
      downloadBlob(toPdfBlob(bytes), `${file.name.replace(/\.pdf$/i, "")}_numbered.pdf`);
    } catch {
      setError("Failed to add page numbers.");
    } finally {
      setLoading(false);
    }
  };

  if (!file) {
    return (
      <FileDropzone onFiles={(f) => setFile(f[0])} label="Drop a PDF" hint="Add page numbers to every page" />
    );
  }

  return (
    <ToolWorkspace
      file={file}
      pageCount={pageCount}
      showPageGrid={false}
      settingsTitle="Page numbers"
      onRemove={() => setFile(null)}
      error={error}
      settings={
        <div className="grid gap-8 lg:grid-cols-2">
          <OptionCards
            label="Position"
            value={position}
            onChange={setPosition}
            columns={2}
            options={[
              { value: "bottom-center", label: "Bottom center" },
              { value: "bottom-right", label: "Bottom right" },
              { value: "top-center", label: "Top center" },
              { value: "top-right", label: "Top right" },
            ]}
          />
          <OptionCards
            label="Format"
            value={format}
            onChange={setFormat}
            columns={3}
            options={[
              { value: "number", label: "1, 2, 3" },
              { value: "page-n", label: "Page 1" },
              { value: "n-of-t", label: "1 of 10" },
            ]}
          />
        </div>
      }
      action={
        <ToolButton onClick={handleApply} loading={loading} size="large">
          Add page numbers
        </ToolButton>
      }
    />
  );
}
