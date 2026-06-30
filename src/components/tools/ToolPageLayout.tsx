import Link from "next/link";
import { FaqSection } from "@/components/seo/FaqSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { getToolFaqs } from "@/lib/seo/faqs";
import { TOOLS, type ToolSlug } from "@/lib/tools";

interface ToolPageLayoutProps {
  slug: ToolSlug;
  children: React.ReactNode;
}

export function ToolPageLayout({ slug, children }: ToolPageLayoutProps) {
  const tool = TOOLS.find((t) => t.slug === slug)!;
  const faqs = getToolFaqs(slug);

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to ${tool.name.toLowerCase()}`,
    description: tool.description,
    step: [
      {
        "@type": "HowToStep",
        name: "Upload your PDF",
        text: "Drag and drop your PDF file or click to browse.",
      },
      {
        "@type": "HowToStep",
        name: "Configure options",
        text: `Adjust settings for ${tool.name.toLowerCase()} as needed.`,
      },
      {
        "@type": "HowToStep",
        name: "Download result",
        text: "Click the action button and save your processed PDF.",
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <JsonLd data={howToSchema} />
      <JsonLd data={faqSchema} />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <nav className="mb-3 text-xs text-zinc-500">
          <Link href="/" className="hover:text-teal-600 dark:hover:text-teal-400">
            Home
          </Link>
          <span className="mx-1.5">/</span>
          <span className="text-zinc-700 dark:text-zinc-300">{tool.name}</span>
        </nav>

        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              {tool.name}
            </h1>
            <p className="mt-2 max-w-2xl text-base text-zinc-600 dark:text-zinc-400">
              {tool.description}
            </p>
          </div>
          <p className="flex items-center gap-1.5 text-xs text-teal-700 dark:text-teal-300">
            <span aria-hidden="true">🔒</span>
            Runs in your browser — never uploaded
          </p>
        </div>

        <div className="mt-6">{children}</div>

        <FaqSection faqs={faqs} />

        <section className="mt-8 rounded-lg bg-zinc-50 p-4 dark:bg-zinc-900">
          <h2 className="text-xs font-medium uppercase tracking-wide text-zinc-500">Other tools</h2>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {TOOLS.filter((t) => t.slug !== slug).map((t) => (
              <li key={t.slug}>
                <Link
                  href={t.href}
                  className="inline-block rounded-md border border-zinc-200 bg-white px-2.5 py-1 text-xs text-zinc-700 hover:border-teal-300 hover:text-teal-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                >
                  {t.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
