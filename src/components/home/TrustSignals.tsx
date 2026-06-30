const STATS = [
  { value: "0", label: "Files uploaded to servers" },
  { value: "50 MB", label: "Max file size (free)" },
  { value: "7", label: "Tools available" },
  { value: "100%", label: "Browser-based processing" },
];

export function TrustSignals() {
  return (
    <section className="rounded-xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
        {STATS.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">{stat.value}</p>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
