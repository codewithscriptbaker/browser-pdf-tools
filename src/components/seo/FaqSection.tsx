import type { FaqItem } from "@/lib/seo/faqs";

interface FaqSectionProps {
  faqs: FaqItem[];
}

export function FaqSection({ faqs }: FaqSectionProps) {
  return (
    <section className="mt-12">
      <h2 className="mb-6 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
        Frequently asked questions
      </h2>
      <div className="divide-y divide-zinc-200 rounded-xl border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
        {faqs.map((faq) => (
          <details key={faq.question} className="group px-5 py-4">
            <summary className="cursor-pointer list-none font-medium text-zinc-900 marker:content-none dark:text-zinc-100">
              <span className="flex items-center justify-between gap-4">
                {faq.question}
                <span className="text-zinc-400 transition-transform group-open:rotate-180">▼</span>
              </span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {faq.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
