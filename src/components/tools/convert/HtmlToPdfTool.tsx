"use client";

import { useState } from "react";
import { ToolButton } from "@/components/tools/ToolButton";
import { ToolError } from "@/components/tools/ToolError";
import { downloadBlob } from "@/lib/pdf/download";
import { htmlToPdf } from "@/lib/pdf/html-to-pdf";

const SAMPLE = `<h1>Hello PDF</h1>
<p>Paste any HTML below — headings, lists, and paragraphs are rendered as a PDF image.</p>
<ul><li>Runs in your browser</li><li>No upload required</li></ul>`;

export function HtmlToPdfTool() {
  const [html, setHtml] = useState(SAMPLE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConvert = async () => {
    if (!html.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const blob = await htmlToPdf(html);
      downloadBlob(blob, "page.pdf");
    } catch {
      setError("Could not render HTML to PDF.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">HTML source</h2>
        <textarea
          value={html}
          onChange={(e) => setHtml(e.target.value)}
          rows={14}
          className="w-full rounded-xl border-2 border-zinc-200 bg-zinc-50 p-4 font-mono text-sm dark:border-zinc-600 dark:bg-zinc-800"
          spellCheck={false}
        />
        <p className="mt-2 text-xs text-zinc-500">
          Or upload an .html file:{" "}
          <input
            type="file"
            accept=".html,.htm,text/html"
            className="text-teal-600"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (f) setHtml(await f.text());
            }}
          />
        </p>
      </section>
      {error && <ToolError message={error} />}
      <div className="flex justify-end">
        <ToolButton onClick={handleConvert} loading={loading} size="large">
          Convert to PDF
        </ToolButton>
      </div>
    </div>
  );
}
