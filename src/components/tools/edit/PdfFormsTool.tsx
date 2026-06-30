"use client";

import { useEffect, useState } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { FileDropzone } from "@/components/tools/FileDropzone";
import { ToolButton } from "@/components/tools/ToolButton";
import { downloadBlob, toPdfBlob } from "@/lib/pdf/download";
import { addFormFieldToPdf } from "@/lib/pdf/pdf-forms";

export function PdfFormsTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [fieldName, setFieldName] = useState("full_name");
  const [defaultValue, setDefaultValue] = useState("");
  const [scope, setScope] = useState<"all" | "first">("first");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!file) return;
    import("@/lib/pdf/text-extract").then(async ({ loadPdfFromFile }) => {
      const pdf = await loadPdfFromFile(file);
      setPageCount(pdf.numPages);
    });
  }, [file]);

  const handleAdd = async () => {
    if (!file || !fieldName.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const pageIndices = scope === "first" ? [0] : undefined;
      const bytes = await addFormFieldToPdf(file, {
        fieldName: fieldName.trim(),
        defaultValue,
        pageIndices,
      });
      downloadBlob(toPdfBlob(bytes), `${file.name.replace(/\.pdf$/i, "")}_form.pdf`);
    } catch {
      setError("Failed to add form field.");
    } finally {
      setLoading(false);
    }
  };

  if (!file) {
    return (
      <FileDropzone
        onFiles={(f) => setFile(f[0])}
        label="Drop a PDF to add a form field"
        hint="Creates a fillable text field"
      />
    );
  }

  return (
    <ToolWorkspace
      file={file}
      pageCount={pageCount}
      showPageGrid={false}
      settingsTitle="Form field"
      onRemove={() => setFile(null)}
      error={error}
      settings={
        <div className="grid max-w-md gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium">Field name</label>
            <input
              type="text"
              value={fieldName}
              onChange={(e) => setFieldName(e.target.value)}
              className="w-full rounded-xl border-2 border-zinc-200 px-4 py-3 text-sm dark:border-zinc-600 dark:bg-zinc-800"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Default value (optional)</label>
            <input
              type="text"
              value={defaultValue}
              onChange={(e) => setDefaultValue(e.target.value)}
              className="w-full rounded-xl border-2 border-zinc-200 px-4 py-3 text-sm dark:border-zinc-600 dark:bg-zinc-800"
            />
          </div>
          <div className="flex gap-2">
            {(["first", "all"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setScope(s)}
                className={`rounded-xl border-2 px-4 py-2 text-sm font-medium ${
                  scope === s ? "border-teal-500 bg-teal-600 text-white" : "border-zinc-200 dark:border-zinc-600"
                }`}
              >
                {s === "first" ? "First page only" : "Every page"}
              </button>
            ))}
          </div>
        </div>
      }
      action={
        <ToolButton onClick={handleAdd} loading={loading} size="large">
          Add form field
        </ToolButton>
      }
    />
  );
}
