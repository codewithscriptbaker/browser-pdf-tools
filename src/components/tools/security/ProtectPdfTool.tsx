"use client";

import { useEffect, useState } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { FileDropzone } from "@/components/tools/FileDropzone";
import { ToolButton } from "@/components/tools/ToolButton";
import { downloadBlob, toPdfBlob } from "@/lib/pdf/download";
import { protectPdf } from "@/lib/pdf/protect";

export function ProtectPdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!file) return;
    import("@/lib/pdf/text-extract").then(async ({ loadPdfFromFile }) => {
      const pdf = await loadPdfFromFile(file);
      setPageCount(pdf.numPages);
    });
  }, [file]);

  const handleProtect = async () => {
    if (!file) return;
    if (password.length < 4) {
      setError("Password must be at least 4 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const bytes = await protectPdf(file, password);
      downloadBlob(toPdfBlob(bytes), `${file.name.replace(/\.pdf$/i, "")}_protected.pdf`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to protect PDF.");
    } finally {
      setLoading(false);
    }
  };

  if (!file) {
    return (
      <FileDropzone
        onFiles={(f) => setFile(f[0])}
        label="Drop a PDF to protect"
        hint="Add a password — processed locally in your browser"
      />
    );
  }

  return (
    <ToolWorkspace
      file={file}
      pageCount={pageCount}
      showPageGrid={false}
      settingsTitle="Password"
      onRemove={() => {
        setFile(null);
        setPassword("");
        setConfirm("");
      }}
      error={error}
      settings={
        <div className="grid max-w-md gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border-2 border-zinc-200 px-4 py-3 text-sm dark:border-zinc-600 dark:bg-zinc-800"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Confirm password</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full rounded-xl border-2 border-zinc-200 px-4 py-3 text-sm dark:border-zinc-600 dark:bg-zinc-800"
            />
          </div>
          <p className="text-xs text-zinc-500">Printing allowed; editing and copying are restricted.</p>
        </div>
      }
      action={
        <ToolButton onClick={handleProtect} loading={loading} disabled={!password} size="large">
          Protect PDF
        </ToolButton>
      }
    />
  );
}
