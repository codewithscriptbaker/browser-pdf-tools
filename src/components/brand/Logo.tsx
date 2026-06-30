interface LogoProps {
  size?: number;
  className?: string;
  showBackground?: boolean;
}

/** PDF Tools brand mark — stacked pages on teal gradient. */
export function Logo({ size = 32, className = "", showBackground = true }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      {showBackground && (
        <>
          <defs>
            <linearGradient id="logo-bg" x1="4" y1="2" x2="28" y2="30" gradientUnits="userSpaceOnUse">
              <stop stopColor="#14b8a6" />
              <stop offset="1" stopColor="#0f766e" />
            </linearGradient>
            <linearGradient id="logo-shine" x1="16" y1="4" x2="16" y2="20" gradientUnits="userSpaceOnUse">
              <stop stopColor="#ffffff" stopOpacity="0.35" />
              <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
          </defs>
          <rect width="32" height="32" rx="8" fill="url(#logo-bg)" />
          <rect width="32" height="32" rx="8" fill="url(#logo-shine)" />
        </>
      )}

      {/* back page */}
      <rect
        x="7"
        y="5"
        width="15"
        height="19"
        rx="2"
        fill="white"
        fillOpacity={showBackground ? 0.22 : 0.15}
        transform="rotate(-6 14.5 14.5)"
      />
      {/* front page */}
      <rect x="10" y="7" width="15" height="19" rx="2" fill="white" />
      {/* folded corner */}
      <path d="M22 7h3v3l-3-3z" fill="#ccfbf1" />
      <path d="M22 7l3 3H22V7z" fill="#99f6e4" />
      {/* text lines */}
      <rect x="13" y="12" width="9" height="1.75" rx="0.875" fill="#0d9488" />
      <rect x="13" y="15.5" width="7" height="1.5" rx="0.75" fill="#14b8a6" fillOpacity="0.75" />
      <rect x="13" y="18.5" width="8" height="1.5" rx="0.75" fill="#14b8a6" fillOpacity="0.5" />
      {/* tool dot — merge/split hint */}
      <circle cx="21" cy="21" r="2.25" fill="#0d9488" />
      <path
        d="M20.2 21h1.6M21 20.2v1.6"
        stroke="white"
        strokeWidth="0.9"
        strokeLinecap="round"
      />
    </svg>
  );
}

interface LogoWithWordmarkProps {
  className?: string;
}

export function LogoWithWordmark({ className = "" }: LogoWithWordmarkProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Logo size={36} className="shrink-0 drop-shadow-sm" />
      <span className="flex flex-col leading-none">
        <span className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          PDF Tools
        </span>
        <span className="mt-0.5 hidden text-[10px] font-medium uppercase tracking-wider text-teal-600 sm:block dark:text-teal-400">
          Private · In-browser
        </span>
      </span>
    </span>
  );
}
