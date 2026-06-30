import Link from "next/link";
import { LIVE_TOOLS, type ToolSlug, getTool } from "@/lib/tools";

interface ComingSoonToolProps {
  slug: ToolSlug;
}

export function ComingSoonTool({ slug }: ComingSoonToolProps) {
  const tool = getTool(slug)!;

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-10 text-center shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
      <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-800 dark:bg-amber-950/50 dark:text-amber-300">
        Coming soon
      </span>
      <h2 className="mt-4 text-xl font-semibold text-zinc-900 dark:text-zinc-50">{tool.name}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        {tool.name} is on our roadmap. All tools run in your browser with no uploads — this one is
        next in line.
      </p>
      <div className="mt-8">
        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-zinc-500">
          Available now
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {LIVE_TOOLS.slice(0, 8).map((t) => (
            <Link
              key={t.slug}
              href={t.href}
              className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:border-teal-300 hover:text-teal-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
            >
              {t.name}
            </Link>
          ))}
        </div>
        <Link
          href="/#tools"
          className="mt-6 inline-block text-sm font-medium text-teal-600 hover:underline dark:text-teal-400"
        >
          View all tools →
        </Link>
      </div>
    </div>
  );
}
