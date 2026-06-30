"use client";

import { useEffect } from "react";
import type { ToolSlug } from "@/lib/tools";
import { setActiveTool } from "@/lib/analytics/active-tool";
import { track } from "@/lib/analytics/client";

interface ToolTrackerProps {
  slug: ToolSlug;
  children: React.ReactNode;
}

export function ToolTracker({ slug, children }: ToolTrackerProps) {
  useEffect(() => {
    setActiveTool(slug);
    track("page_view", { tool: slug });

    return () => setActiveTool(null);
  }, [slug]);

  return <>{children}</>;
}
