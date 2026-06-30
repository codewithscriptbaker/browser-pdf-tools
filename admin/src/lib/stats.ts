import { prisma } from "@/lib/prisma";

type ToolGroupRow = {
  tool: string | null;
  _count: { _all: number };
};

type AnonGroupRow = {
  anonymousId: string;
};

type RecentEventRow = {
  id: string;
  event: string;
  tool: string | null;
  createdAt: Date;
  userId: string | null;
};

type ActivityRow = {
  createdAt: Date;
  anonymousId: string;
};

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(0, 0, 0, 0);
  return d;
}

function minutesAgo(n: number) {
  return new Date(Date.now() - n * 60_000);
}

export type DashboardStats = {
  activeUsers15m: number;
  activeUsers24h: number;
  totalUsers: number;
  newUsers7d: number;
  newUsers30d: number;
  totalOperations: number;
  filesProcessed24h: number;
  filesProcessed7d: number;
  toolUsage: { tool: string; views: number; completions: number; files: number }[];
  dailyActivity: { date: string; events: number; users: number }[];
  recentEvents: {
    id: string;
    event: string;
    tool: string | null;
    createdAt: string;
    isAuthenticated: boolean;
  }[];
  authStats: { signups7d: number; logins7d: number };
};

export async function getDashboardStats(): Promise<DashboardStats> {
  const since24h = minutesAgo(24 * 60);
  const since15m = minutesAgo(15);
  const since7d = daysAgo(7);
  const since30d = daysAgo(30);

  const [
    activeUsers15m,
    activeUsers24h,
    totalUsers,
    newUsers7d,
    newUsers30d,
    totalOperations,
    filesProcessed24h,
    filesProcessed7d,
    signups7d,
    logins7d,
    toolViewEvents,
    toolCompletionEvents,
    fileEvents,
    recentEvents,
    eventsLast7d,
  ] = await Promise.all([
    prisma.analyticsEvent.groupBy({
      by: ["anonymousId"],
      where: { createdAt: { gte: since15m } },
    }),
    prisma.analyticsEvent.groupBy({
      by: ["anonymousId"],
      where: { createdAt: { gte: since24h } },
    }),
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: since7d } } }),
    prisma.user.count({ where: { createdAt: { gte: since30d } } }),
    prisma.analyticsEvent.count({ where: { event: "tool_completed" } }),
    prisma.analyticsEvent.count({
      where: { event: "file_selected", createdAt: { gte: since24h } },
    }),
    prisma.analyticsEvent.count({
      where: { event: "file_selected", createdAt: { gte: since7d } },
    }),
    prisma.analyticsEvent.count({ where: { event: "signup", createdAt: { gte: since7d } } }),
    prisma.analyticsEvent.count({ where: { event: "login", createdAt: { gte: since7d } } }),
    prisma.analyticsEvent.groupBy({
      by: ["tool"],
      where: { event: "page_view", tool: { not: null }, createdAt: { gte: since7d } },
      _count: { _all: true },
    }),
    prisma.analyticsEvent.groupBy({
      by: ["tool"],
      where: { event: "tool_completed", tool: { not: null }, createdAt: { gte: since7d } },
      _count: { _all: true },
    }),
    prisma.analyticsEvent.groupBy({
      by: ["tool"],
      where: { event: "file_selected", tool: { not: null }, createdAt: { gte: since7d } },
      _count: { _all: true },
    }),
    prisma.analyticsEvent.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      select: {
        id: true,
        event: true,
        tool: true,
        createdAt: true,
        userId: true,
      },
    }),
    prisma.analyticsEvent.findMany({
      where: { createdAt: { gte: since7d } },
      select: { createdAt: true, anonymousId: true },
    }),
  ]);

  const viewsMap = new Map(
    (toolViewEvents as ToolGroupRow[]).map((r) => [r.tool!, r._count._all]),
  );
  const completionsMap = new Map(
    (toolCompletionEvents as ToolGroupRow[]).map((r) => [r.tool!, r._count._all]),
  );
  const filesMap = new Map(
    (fileEvents as ToolGroupRow[]).map((r) => [r.tool!, r._count._all]),
  );

  const allTools = new Set([...viewsMap.keys(), ...completionsMap.keys(), ...filesMap.keys()]);

  const toolUsage = [...allTools]
    .map((tool) => ({
      tool,
      views: viewsMap.get(tool) ?? 0,
      completions: completionsMap.get(tool) ?? 0,
      files: filesMap.get(tool) ?? 0,
    }))
    .sort((a, b) => b.views - a.views);

  const dailyMap = new Map<string, { events: number; users: Set<string> }>();
  for (let i = 6; i >= 0; i--) {
    const d = daysAgo(i);
    const key = d.toISOString().slice(0, 10);
    dailyMap.set(key, { events: 0, users: new Set() });
  }

  for (const event of eventsLast7d as ActivityRow[]) {
    const key = event.createdAt.toISOString().slice(0, 10);
    const bucket = dailyMap.get(key);
    if (bucket) {
      bucket.events += 1;
      bucket.users.add(event.anonymousId);
    }
  }

  const dailyActivity = [...dailyMap.entries()].map(([date, data]) => ({
    date,
    events: data.events,
    users: data.users.size,
  }));

  return {
    activeUsers15m: (activeUsers15m as AnonGroupRow[]).length,
    activeUsers24h: (activeUsers24h as AnonGroupRow[]).length,
    totalUsers,
    newUsers7d,
    newUsers30d,
    totalOperations,
    filesProcessed24h,
    filesProcessed7d,
    toolUsage,
    dailyActivity,
    recentEvents: (recentEvents as RecentEventRow[]).map((e) => ({
      id: e.id,
      event: e.event,
      tool: e.tool,
      createdAt: e.createdAt.toISOString(),
      isAuthenticated: Boolean(e.userId),
    })),
    authStats: { signups7d, logins7d },
  };
}
