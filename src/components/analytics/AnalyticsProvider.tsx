"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics/client";

export function AnalyticsProvider() {
  useEffect(() => {
    track("page_view", { meta: { path: window.location.pathname } });

    const interval = setInterval(() => {
      track("heartbeat");
    }, 60_000);

    return () => clearInterval(interval);
  }, []);

  return null;
}
