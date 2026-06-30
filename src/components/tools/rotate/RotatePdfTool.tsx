"use client";

import { useEffect, useState } from "react";
import { OptionChips } from "@/components/tools/OptionChips";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { RotationControl } from "@/components/tools/rotate/RotationControl";
import { FileDropzone } from "@/components/tools/FileDropzone";
import { ToolButton } from "@/components/tools/ToolButton";
import { usePdfThumbnails } from "@/hooks/usePdfThumbnails";
import { downloadBlob, toPdfBlob } from "@/lib/pdf/download";
import { rotatePdf } from "@/lib/pdf/rotate";

export function RotatePdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [angle, setAngle] = useState(0);
  const [scope, setScope] = useState<"all" | "selected">("all");
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
  const [previewPage, setPreviewPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { thumbnails, loading: thumbLoading } = usePdfThumbnails(file);

  useEffect(() => {
    if (!file) return;
    import("@/lib/pdf/text-extract").then(async ({ loadPdfFromFile }) => {
      const pdf = await loadPdfFromFile(file);
      setPageCount(pdf.numPages);
      setPreviewPage(0);
    });
  }, [file]);

  const handleRotate = async () => {
    if (!file || angle === 0) {
      setError("Set a rotation angle other than 0°.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      let pageIndices: number[] | undefined;
      if (scope === "selected") {
        if (selectedPages.size === 0) {
          setError("Select pages or choose All pages.");
          setLoading(false);
          return;
        }
        pageIndices = [...selectedPages].sort((a, b) => a - b);
      }
      const bytes = await rotatePdf(file, angle, pageIndices);
      downloadBlob(toPdfBlob(bytes), `${file.name.replace(/\.pdf$/i, "")}_rotated.pdf`);
    } catch (err) {
      console.error("Rotate failed:", err);
      setError(
        err instanceof Error ? err.message : "Failed to rotate PDF. Try a right angle (90°, 180°).",
      );
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
          setAngle(0);
          setSelectedPages(new Set());
          setScope("all");
        }}
        multiple={false}
        label="Drop a PDF to rotate"
        hint="Any angle from -180° to 180° — drag the preview or use the slider"
      />
    );
  }

  return (
    <ToolWorkspace
      file={file}
      pageCount={pageCount}
      settingsTitle="Rotation"
      selectedPages={scope === "selected" ? selectedPages : undefined}
      onTogglePage={
        scope === "selected"
          ? (i) => {
              setPreviewPage(i);
              setSelectedPages((prev) => {
                const next = new Set(prev);
                if (next.has(i)) next.delete(i);
                else next.add(i);
                return next;
              });
            }
          : (i) => setPreviewPage(i)
      }
      onSelectAll={
        scope === "selected"
          ? () => setSelectedPages(new Set(Array.from({ length: pageCount }, (_, i) => i)))
          : undefined
      }
      onClearSelection={scope === "selected" ? () => setSelectedPages(new Set()) : undefined}
      onRemove={() => {
        setFile(null);
        setSelectedPages(new Set());
        setError(null);
      }}
      error={error}
      gridProps={{
        rotationPreview: angle,
        rotateOnlySelected: scope === "selected",
      }}
      settings={
        <div className="space-y-8">
          <RotationControl
            angle={angle}
            onChange={setAngle}
            previewSrc={thumbnails[previewPage] ?? null}
            previewLoading={thumbLoading}
            pageLabel={`Page ${previewPage + 1}`}
          />
          <OptionChips
            label="Apply rotation to"
            description="Choose whether every page rotates or only the pages you select below."
            value={scope}
            onChange={setScope}
            options={[
              { value: "all", label: "All pages" },
              { value: "selected", label: "Selected pages only" },
            ]}
          />
        </div>
      }
      action={
        <ToolButton onClick={handleRotate} loading={loading} disabled={angle === 0} size="large">
          Rotate {angle}°
        </ToolButton>
      }
      actionHint={`Rotating ${scope === "all" ? `all ${pageCount} pages` : `${selectedPages.size || "no"} selected page(s)`} by ${angle}°.`}
    />
  );
}
