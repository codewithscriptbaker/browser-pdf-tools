interface StatCardProps {
  label: string;
  value: string | number;
  hint?: string;
  accent?: "violet" | "teal" | "amber" | "rose";
}

const ACCENTS = {
  violet: "border-violet-500/30 bg-violet-500/10 text-violet-300",
  teal: "border-teal-500/30 bg-teal-500/10 text-teal-300",
  amber: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  rose: "border-rose-500/30 bg-rose-500/10 text-rose-300",
};

export function StatCard({ label, value, hint, accent = "violet" }: StatCardProps) {
  return (
    <div className={`rounded-xl border p-5 ${ACCENTS[accent]}`}>
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">{label}</p>
      <p className="mt-2 text-3xl font-bold text-white">{value}</p>
      {hint && <p className="mt-1 text-xs text-zinc-500">{hint}</p>}
    </div>
  );
}
