"use client";

interface ToolButtonProps {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  size?: "default" | "large";
}

export function ToolButton({
  onClick,
  disabled,
  loading,
  children,
  variant = "primary",
  size = "default",
}: ToolButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-50";
  const sizes =
    size === "large" ? "px-8 py-3.5 text-base shadow-lg" : "px-5 py-2.5 text-sm";
  const styles =
    variant === "primary"
      ? "bg-teal-600 text-white hover:bg-teal-700 hover:shadow-md dark:bg-teal-500 dark:hover:bg-teal-600"
      : "border-2 border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${sizes} ${styles}`}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
      )}
      {children}
    </button>
  );
}
