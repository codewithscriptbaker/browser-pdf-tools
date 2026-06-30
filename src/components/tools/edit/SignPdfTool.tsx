"use client";

import { useEffect, useState } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { FileDropzone } from "@/components/tools/FileDropzone";
import { ToolButton } from "@/components/tools/ToolButton";
import { downloadBlob, toPdfBlob } from "@/lib/pdf/download";
import { signPdf } from "@/lib/pdf/sign";

export function SignPdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [signature, setSignature] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [scope, setScope] = useState<"all" | "selected">("all");
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!file) return;
    import("@/lib/pdf/text-extract").then(async ({ loadPdfFromFile }) => {
      const pdf = await loadPdfFromFile(file);
      setPageCount(pdf.numPages);
    });
  }, [file]);

  const handleSign = async () => {
    if (!file || !signature) {
      setError("Upload a PDF and a signature image (PNG or JPG).");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const pageIndices =
        scope === "selected" ? [...selectedPages].sort((a, b) => a - b) : undefined;
      if (scope === "selected" && (!pageIndices || pageIndices.length === 0)) {
        setError("Select at least one page.");
        setLoading(false);
        return;
      }
      const bytes = await signPdf(file, { signatureFile: signature, pageIndices });
      downloadBlob(toPdfBlob(bytes), `${file.name.replace(/\.pdf$/i, "")}_signed.pdf`);
    } catch {
      setError("Failed to sign PDF.");
    } finally {
      setLoading(false);
    }
  };

  if (!file) {
    return (
      <FileDropzone onFiles={(f) => setFile(f[0])} label="Drop a PDF to sign" hint="You'll add your signature image next" />
    );
  }

  return (
    <ToolWorkspace
      file={file}
      pageCount={pageCount}
      settingsTitle="Signature"
      selectedPages={scope === "selected" ? selectedPages : undefined}
      onTogglePage={
        scope === "selected"
          ? (i) =>
              setSelectedPages((prev) => {
                const next = new Set(prev);
                if (next.has(i)) next.delete(i);
                else next.add(i);
                return next;
              })
          : undefined
      }
      onSelectAll={
        scope === "selected"
          ? () => setSelectedPages(new Set(Array.from({ length: pageCount }, (_, i) => i)))
          : undefined
      }
      onClearSelection={scope === "selected" ? () => setSelectedPages(new Set()) : undefined}
      onRemove={() => {
        setFile(null);
        setSignature(null);
      }}
      error={error}
      settings={
        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium">Signature image</label>
            <input
              type="file"
              accept="image/png,image/jpeg"
              onChange={(e) => setSignature(e.target.files?.[0] ?? null)}
              className="text-sm"
            />
            {signature && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={URL.createObjectURL(signature)}
                alt="Signature preview"
                className="mt-3 max-h-24 rounded border border-zinc-200 dark:border-zinc-700"
              />
            )}
          </div>
          <div className="flex gap-2">
            {(["all", "selected"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setScope(s)}
                className={`rounded-xl border-2 px-4 py-2 text-sm font-medium ${
                  scope === s
                    ? "border-teal-500 bg-teal-600 text-white"
                    : "border-zinc-200 dark:border-zinc-600"
                }`}
              >
                {s === "all" ? "All pages" : "Selected pages"}
              </button>
            ))}
          </div>
          <p className="text-xs text-zinc-500">Signature is placed at the bottom-right of each page.</p>
        </div>
      }
      action={
        <ToolButton onClick={handleSign} loading={loading} disabled={!signature} size="large">
          Sign PDF
        </ToolButton>
      }
    />
  );
}
