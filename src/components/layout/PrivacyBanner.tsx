export function PrivacyBanner() {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-teal-50 px-4 py-3 dark:bg-teal-950/40">
      <span className="text-xl" aria-hidden="true">
        🔒
      </span>
      <p className="text-sm leading-relaxed text-teal-900 dark:text-teal-200">
        <strong className="font-medium">100% private.</strong> Every tool runs entirely in your
        browser. Files are never uploaded, stored, or logged.
      </p>
    </div>
  );
}
