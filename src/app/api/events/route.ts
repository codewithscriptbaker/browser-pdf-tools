import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { AnalyticsEventName } from "@/lib/analytics/types";

const ALLOWED_EVENTS = new Set<AnalyticsEventName>([
  "page_view",
  "heartbeat",
  "file_selected",
  "tool_completed",
  "tool_failed",
  "signup",
  "login",
]);

export async function POST(request: Request) {
  let body: unknown;
  try {
    const text = await request.text();
    body = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { event, tool, anonymousId, meta } = body as Record<string, unknown>;

  if (typeof event !== "string" || !ALLOWED_EVENTS.has(event as AnalyticsEventName)) {
    return NextResponse.json({ error: "Invalid event" }, { status: 400 });
  }

  if (typeof anonymousId !== "string" || anonymousId.length < 8 || anonymousId.length > 64) {
    return NextResponse.json({ error: "Invalid anonymousId" }, { status: 400 });
  }

  const session = await auth();
  let userId: string | null = null;
  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true },
    });
    userId = user?.id ?? null;
  }

  let metaJson: string | null = null;
  if (meta && typeof meta === "object" && !Array.isArray(meta)) {
    metaJson = JSON.stringify(meta);
  }

  await prisma.analyticsEvent.create({
    data: {
      event,
      tool: typeof tool === "string" ? tool.slice(0, 64) : null,
      anonymousId,
      userId,
      meta: metaJson,
    },
  });

  return NextResponse.json({ ok: true });
}
