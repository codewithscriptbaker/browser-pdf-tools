import { SITE_TAGLINE } from "@/lib/tools";

export function Hero() {
  return (
    <section className="text-center">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
        Every tool you need to work with PDFs{" "}
        <span className="text-teal-600 dark:text-teal-400">in one place</span>
      </h1>
      <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
        {SITE_TAGLINE}. Merge, split, compress, convert, edit, and secure PDFs — 100% free, no
        uploads, no accounts.
      </p>
    </section>
  );
}
