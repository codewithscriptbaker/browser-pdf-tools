"use client";

import Link from "next/link";
import { useState } from "react";
import { ToolIcon } from "@/components/home/ToolIcon";
import { TOOL_CATEGORIES, TOOLS, type ToolCategory } from "@/lib/tools";

export function ToolGrid() {
  const [filter, setFilter] = useState<ToolCategory | "all">("all");

  const filtered =
    filter === "all" ? TOOLS : TOOLS.filter((tool) => tool.category === filter);

  return (
    <section id="tools">
      <div className="mb-5 flex flex-wrap gap-2">
        {TOOL_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setFilter(cat.id)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              filter === cat.id
                ? "bg-teal-600 text-white shadow-sm"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {filtered.map((tool) => (
          <Link
            key={tool.slug}
            href={tool.href}
            className="group flex flex-col rounded-xl border border-zinc-200 bg-white p-4 transition-all hover:border-teal-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-teal-700"
          >
            <div className="mb-3 flex items-start justify-between gap-2">
              <ToolIcon slug={tool.slug} />
              {tool.badge === "new" && (
                <span className="shrink-0 rounded bg-teal-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                  New
                </span>
              )}
            </div>
            <h3 className="text-sm font-semibold text-zinc-900 group-hover:text-teal-700 dark:text-zinc-50 dark:group-hover:text-teal-400">
              {tool.name}
            </h3>
            <p className="mt-1 line-clamp-2 text-xs leading-snug text-zinc-500 dark:text-zinc-400">
              {tool.shortDescription}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
