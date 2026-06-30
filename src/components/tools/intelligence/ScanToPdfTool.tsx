"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ToolButton } from "@/components/tools/ToolButton";
import { ToolError } from "@/components/tools/ToolError";
import { downloadBlob, toPdfBlob } from "@/lib/pdf/download";
import { imagesToPdf } from "@/lib/pdf/jpg-to-pdf";

export function ScanToPdfTool() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [captures, setCaptures] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    setError(null);
    try {
      const media = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      setStream(media);
      if (videoRef.current) {
        videoRef.current.srcObject = media;
      }
    } catch {
      setError("Camera access denied or unavailable.");
    }
  }, []);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
    return () => {
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [stream]);

  const capturePage = () => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], `scan_${captures.length + 1}.jpg`, { type: "image/jpeg" });
      setCaptures((prev) => [...prev, file]);
    }, "image/jpeg", 0.92);
  };

  const handleCreatePdf = async () => {
    if (captures.length === 0) return;
    setLoading(true);
    setError(null);
    try {
      const bytes = await imagesToPdf(captures);
      downloadBlob(toPdfBlob(bytes), "scan.pdf");
    } catch {
      setError("Failed to create PDF.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-500">Camera</h2>
        {!stream ? (
          <ToolButton onClick={startCamera}>Start camera</ToolButton>
        ) : (
          <div className="space-y-4">
            <video ref={videoRef} autoPlay playsInline className="max-h-80 w-full rounded-xl bg-black object-contain" />
            <div className="flex flex-wrap gap-3">
              <ToolButton onClick={capturePage}>Capture page</ToolButton>
              <ToolButton
                variant="secondary"
                onClick={() => {
                  stream.getTracks().forEach((t) => t.stop());
                  setStream(null);
                }}
              >
                Stop camera
              </ToolButton>
            </div>
          </div>
        )}
      </section>

      {captures.length > 0 && (
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Captured pages ({captures.length})
          </h2>
          <div className="flex flex-wrap gap-3">
            {captures.map((c, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={URL.createObjectURL(c)}
                alt={`Scan ${i + 1}`}
                className="h-24 w-20 rounded border object-cover"
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => setCaptures([])}
            className="mt-3 text-sm text-zinc-500 hover:underline"
          >
            Clear captures
          </button>
        </section>
      )}

      {error && <ToolError message={error} />}

      <div className="flex justify-end">
        <ToolButton onClick={handleCreatePdf} loading={loading} disabled={captures.length === 0} size="large">
          Create PDF ({captures.length} page{captures.length !== 1 ? "s" : ""})
        </ToolButton>
      </div>
    </div>
  );
}
