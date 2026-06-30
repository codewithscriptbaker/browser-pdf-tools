import Link from "next/link";
import { auth } from "@/auth";
import { LogoWithWordmark } from "@/components/brand/Logo";
import { AuthNav } from "@/components/auth/AuthNav";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { TOOLS } from "@/lib/tools";

const NAV_TOOLS = TOOLS.filter((t) =>
  ["merge-pdf", "split-pdf", "pdf-to-word", "pdf-to-jpg"].includes(t.slug),
);

export async function Header() {
  const session = await auth();

  return (
    <header className="border-b border-zinc-200 bg-white/80 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="shrink-0 rounded-lg outline-offset-4 focus-visible:outline-2 focus-visible:outline-teal-500">
          <LogoWithWordmark />
        </Link>

        <div className="flex items-center gap-3 sm:gap-5">
          <nav className="hidden items-center gap-5 text-sm font-medium text-zinc-600 lg:flex dark:text-zinc-400">
            {NAV_TOOLS.map((tool) => (
              <Link
                key={tool.slug}
                href={tool.href}
                className="hover:text-teal-600 dark:hover:text-teal-400"
              >
                {tool.name.replace(" PDF", "").replace("PDF to ", "")}
              </Link>
            ))}
            <Link href="/#tools" className="hover:text-teal-600 dark:hover:text-teal-400">
              All tools
            </Link>
          </nav>
          <AuthNav session={session} />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
