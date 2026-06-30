"use client";

import { useCallback } from "react";
import { useDropzone, type Accept } from "react-dropzone";
import { getActiveTool } from "@/lib/analytics/active-tool";
import { track } from "@/lib/analytics/client";

interface FileDropzoneProps {
  onFiles: (files: File[]) => void;
  accept?: Accept;
  multiple?: boolean;
  label?: string;
  hint?: string;
}

export function FileDropzone({
  onFiles,
  accept = { "application/pdf": [".pdf"] },
  multiple = false,
  label = "Drop PDF files here",
  hint = "or click to browse — up to 50 MB per file",
}: FileDropzoneProps) {
  const onDrop = useCallback(
    (accepted: File[]) => {
      if (accepted.length > 0) {
        const totalBytes = accepted.reduce((sum, file) => sum + file.size, 0);
        track("file_selected", {
          tool: getActiveTool() ?? undefined,
          meta: {
            fileCount: accepted.length,
            totalBytes,
          },
        });
        onFiles(accepted);
      }
    },
    [onFiles],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple,
    maxSize: 50 * 1024 * 1024,
  });

  return (
    <div
      {...getRootProps()}
      className={`cursor-pointer rounded-2xl border-2 border-dashed px-8 py-16 text-center transition-all ${
        isDragActive
          ? "border-teal-500 bg-teal-50 shadow-lg dark:bg-teal-950/30"
          : "border-zinc-300 bg-zinc-50 hover:border-teal-400 hover:bg-teal-50/50 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-teal-600"
      }`}
    >
      <input {...getInputProps()} />
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 text-3xl text-white shadow-md">
        📄
      </div>
      <p className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">{label}</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-zinc-500 dark:text-zinc-400">{hint}</p>
    </div>
  );
}
