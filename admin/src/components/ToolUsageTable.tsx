import type { DashboardStats } from "@/lib/stats";

function formatTool(slug: string) {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function ToolUsageTable({ tools }: { tools: DashboardStats["toolUsage"] }) {
  const maxViews = Math.max(...tools.map((t) => t.views), 1);

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <h2 className="text-sm font-semibold text-white">Tool usage (7 days)</h2>
      <p className="mt-1 text-xs text-zinc-500">Page views, completions, and local file operations</p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-800 text-xs uppercase tracking-wide text-zinc-500">
              <th className="pb-3 pr-4 font-medium">Tool</th>
              <th className="pb-3 pr-4 font-medium">Views</th>
              <th className="pb-3 pr-4 font-medium">Completions</th>
              <th className="pb-3 font-medium">Files processed</th>
            </tr>
          </thead>
          <tbody>
            {tools.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-zinc-500">
                  No tool activity yet. Use the main app to generate data.
                </td>
              </tr>
            ) : (
              tools.map((tool) => (
                <tr key={tool.tool} className="border-b border-zinc-800/60 last:border-0">
                  <td className="py-3 pr-4">
                    <div className="font-medium text-zinc-200">{formatTool(tool.tool)}</div>
                    <div className="mt-1 h-1.5 w-full max-w-[140px] overflow-hidden rounded-full bg-zinc-800">
                      <div
                        className="h-full rounded-full bg-violet-500"
                        style={{ width: `${(tool.views / maxViews) * 100}%` }}
                      />
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-zinc-300">{tool.views}</td>
                  <td className="py-3 pr-4 text-zinc-300">{tool.completions}</td>
                  <td className="py-3 text-zinc-300">{tool.files}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
