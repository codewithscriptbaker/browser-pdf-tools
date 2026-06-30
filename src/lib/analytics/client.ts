"use client";

import type { AnalyticsEventName } from "@/lib/analytics/types";

const ANON_ID_KEY = "pdf_tools_anon_id";

export function getAnonymousId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(ANON_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(ANON_ID_KEY, id);
  }
  return id;
}

export function track(
  event: AnalyticsEventName,
  options?: { tool?: string; meta?: Record<string, unknown> },
) {
  const anonymousId = getAnonymousId();
  if (!anonymousId) return;

  const body = JSON.stringify({
    event,
    tool: options?.tool,
    anonymousId,
    meta: options?.meta,
  });

  if (typeof navigator !== "undefined" && "sendBeacon" in navigator) {
    const blob = new Blob([body], { type: "application/json" });
    const sent = navigator.sendBeacon("/api/events", blob);
    if (sent) return;
  }

  fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {});
}
