import type { DashboardStats } from "@/lib/stats";

function formatEvent(event: string) {
  return event.replace(/_/g, " ");
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleString();
}

export function RecentEventsTable({ events }: { events: DashboardStats["recentEvents"] }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <h2 className="text-sm font-semibold text-white">Recent activity</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-800 text-xs uppercase tracking-wide text-zinc-500">
              <th className="pb-3 pr-4 font-medium">Event</th>
              <th className="pb-3 pr-4 font-medium">Tool</th>
              <th className="pb-3 pr-4 font-medium">User</th>
              <th className="pb-3 font-medium">Time</th>
            </tr>
          </thead>
          <tbody>
            {events.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-zinc-500">
                  No events recorded yet.
                </td>
              </tr>
            ) : (
              events.map((event) => (
                <tr key={event.id} className="border-b border-zinc-800/60 last:border-0">
                  <td className="py-2.5 pr-4 capitalize text-zinc-300">{formatEvent(event.event)}</td>
                  <td className="py-2.5 pr-4 text-zinc-400">{event.tool ?? "—"}</td>
                  <td className="py-2.5 pr-4 text-zinc-400">
                    {event.isAuthenticated ? "Logged in" : "Anonymous"}
                  </td>
                  <td className="py-2.5 text-zinc-500">{formatTime(event.createdAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
