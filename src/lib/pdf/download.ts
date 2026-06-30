export function toPdfBlob(bytes: Uint8Array): Blob {
  return new Blob([new Uint8Array(bytes)], { type: "application/pdf" });
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);

  if (typeof window !== "undefined") {
    void import("@/lib/analytics/active-tool").then(({ getActiveTool }) => {
      void import("@/lib/analytics/client").then(({ track }) => {
        track("tool_completed", {
          tool: getActiveTool() ?? undefined,
          meta: { sizeBytes: blob.size },
        });
      });
    });
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
