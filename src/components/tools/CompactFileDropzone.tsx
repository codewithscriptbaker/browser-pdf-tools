"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { getActiveTool } from "@/lib/analytics/active-tool";
import { track } from "@/lib/analytics/client";

interface CompactFileDropzoneProps {
  onFiles: (files: File[]) => void;
  multiple?: boolean;
  label?: string;
}

export function CompactFileDropzone({
  onFiles,
  multiple = true,
  label = "Add more",
}: CompactFileDropzoneProps) {
  const onDrop = useCallback(
    (accepted: File[]) => {
      if (accepted.length > 0) {
        const totalBytes = accepted.reduce((sum, file) => sum + file.size, 0);
        track("file_selected", {
          tool: getActiveTool() ?? undefined,
          meta: { fileCount: accepted.length, totalBytes },
        });
        onFiles(accepted);
      }
    },
    [onFiles],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    multiple,
    maxSize: 50 * 1024 * 1024,
  });

  return (
    <div
      {...getRootProps()}
      className={`flex h-full min-h-[180px] w-36 shrink-0 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-3 text-center transition-colors ${
        isDragActive
          ? "border-teal-500 bg-teal-50 dark:bg-teal-950/30"
          : "border-zinc-300 bg-zinc-50 hover:border-teal-400 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:border-teal-600"
      }`}
    >
      <input {...getInputProps()} />
      <span className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-xl text-teal-700 dark:bg-teal-900/50 dark:text-teal-300">
        +
      </span>
      <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">{label}</p>
    </div>
  );
}
