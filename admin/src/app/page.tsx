import { auth } from "@/auth";
import { ActivityChart } from "@/components/ActivityChart";
import { RecentEventsTable } from "@/components/RecentEventsTable";
import { StatCard } from "@/components/StatCard";
import { ToolUsageTable } from "@/components/ToolUsageTable";
import { logoutAction } from "@/lib/actions";
import { getDashboardStats } from "@/lib/stats";

export default async function AdminDashboardPage() {
  const session = await auth();
  const stats = await getDashboardStats();

  return (
    <div className="min-h-screen bg-zinc-950">
      <header className="border-b border-zinc-800 bg-zinc-900/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-violet-400">
              PDF Tools
            </p>
            <h1 className="text-xl font-bold text-white">Owner Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-zinc-400 sm:block">{session?.user?.email}</span>
            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded-lg border border-zinc-700 px-3 py-1.5 text-sm text-zinc-300 hover:bg-zinc-800"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-8 px-6 py-8">
        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Live &amp; users
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Active now" value={stats.activeUsers15m} hint="Last 15 minutes" accent="teal" />
            <StatCard label="Active today" value={stats.activeUsers24h} hint="Last 24 hours" accent="teal" />
            <StatCard label="Registered users" value={stats.totalUsers} hint={`+${stats.newUsers7d} this week`} accent="violet" />
            <StatCard label="New users (30d)" value={stats.newUsers30d} accent="violet" />
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Operations
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Total completions" value={stats.totalOperations} hint="All time" accent="amber" />
            <StatCard label="Files processed (24h)" value={stats.filesProcessed24h} hint="Local browser ops" accent="amber" />
            <StatCard label="Files processed (7d)" value={stats.filesProcessed7d} accent="amber" />
            <StatCard
              label="Auth (7d)"
              value={`${stats.authStats.signups7d} / ${stats.authStats.logins7d}`}
              hint="Signups / logins"
              accent="rose"
            />
          </div>
        </section>

        <ActivityChart data={stats.dailyActivity} />

        <div className="grid gap-8 lg:grid-cols-2">
          <ToolUsageTable tools={stats.toolUsage} />
          <RecentEventsTable events={stats.recentEvents} />
        </div>

        <p className="text-center text-xs text-zinc-600">
          Analytics track metadata only — no file content or filenames are stored.
        </p>
      </main>
    </div>
  );
}
