import type { DashboardStats } from "@/lib/stats";

export function ActivityChart({ data }: { data: DashboardStats["dailyActivity"] }) {
  const max = Math.max(...data.map((d) => d.events), 1);

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <h2 className="text-sm font-semibold text-white">Activity (7 days)</h2>
      <p className="mt-1 text-xs text-zinc-500">Events and unique visitors per day</p>
      <div className="mt-6 flex items-end justify-between gap-2">
        {data.map((day) => (
          <div key={day.date} className="flex flex-1 flex-col items-center gap-2">
            <div className="flex w-full flex-col items-center gap-1">
              <div
                className="w-full max-w-8 rounded-t bg-violet-500/80"
                style={{ height: `${Math.max(8, (day.events / max) * 120)}px` }}
                title={`${day.events} events`}
              />
              <div
                className="w-full max-w-8 rounded-t bg-teal-500/60"
                style={{ height: `${Math.max(4, (day.users / max) * 80)}px` }}
                title={`${day.users} users`}
              />
            </div>
            <span className="text-[10px] text-zinc-500">
              {new Date(day.date).toLocaleDateString("en", { weekday: "short" })}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-4 text-xs text-zinc-500">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-sm bg-violet-500" /> Events
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-sm bg-teal-500" /> Unique visitors
        </span>
      </div>
    </div>
  );
}
