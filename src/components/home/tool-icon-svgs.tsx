import type { ReactNode } from "react";
import type { ToolSlug } from "@/lib/tools";

type IconStyle = { bg: string; icon: ReactNode };

const ICON_STYLES: Record<ToolSlug, IconStyle> = {
  "merge-pdf": {
    bg: "bg-blue-100 dark:bg-blue-950/60",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="7" height="16" rx="1.5" className="fill-blue-200/60 dark:fill-blue-900/40" />
        <rect x="14" y="4" width="7" height="16" rx="1.5" className="fill-blue-500/20" />
        <path d="M10 12h4M11 10l2 2-2 2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  "split-pdf": {
    bg: "bg-orange-100 dark:bg-orange-950/60",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="4" y="4" width="7" height="16" rx="1.5" className="fill-orange-200/50 dark:fill-orange-900/40" />
        <rect x="13" y="4" width="7" height="16" rx="1.5" className="fill-orange-200/50 dark:fill-orange-900/40" />
        <path d="M12 6v12M10 8l2-2 2 2M10 16l2 2 2-2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  "compress-pdf": {
    bg: "bg-violet-100 dark:bg-violet-950/60",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-violet-600 dark:text-violet-400" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 4v12M8 12l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6 20h12" strokeLinecap="round" />
        <rect x="7" y="2" width="10" height="6" rx="1" className="fill-violet-300/50 dark:fill-violet-800/40" />
      </svg>
    ),
  },
  "pdf-to-word": {
    bg: "bg-sky-100 dark:bg-sky-950/60",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
        <rect x="4" y="2" width="16" height="20" rx="2" className="fill-sky-500/20 stroke-sky-600 dark:stroke-sky-400" strokeWidth="2" />
        <path d="M8 8h8M8 12h6M8 16h4" className="stroke-sky-600 dark:stroke-sky-400" strokeWidth="1.5" strokeLinecap="round" />
        <text x="12" y="7" textAnchor="middle" className="fill-sky-700 dark:fill-sky-300" style={{ fontSize: 6, fontWeight: 700 }}>W</text>
      </svg>
    ),
  },
  "pdf-to-powerpoint": {
    bg: "bg-rose-100 dark:bg-rose-950/60",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
        <rect x="3" y="5" width="18" height="12" rx="2" className="fill-rose-500/20 stroke-rose-600 dark:stroke-rose-400" strokeWidth="2" />
        <rect x="6" y="8" width="12" height="6" rx="1" className="fill-rose-400/30 stroke-rose-500 dark:stroke-rose-400" strokeWidth="1" />
        <circle cx="8" cy="11" r="1" className="fill-rose-600 dark:fill-rose-400" />
        <path d="M10 10.5h5M10 12h4" className="stroke-rose-600 dark:stroke-rose-400" strokeWidth="1" strokeLinecap="round" />
      </svg>
    ),
  },
  "pdf-to-excel": {
    bg: "bg-emerald-100 dark:bg-emerald-950/60",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="2" className="fill-emerald-500/20 stroke-emerald-600 dark:stroke-emerald-400" strokeWidth="2" />
        <path d="M3 9h18M3 15h18M9 3v18M15 3v18" className="stroke-emerald-500/60" strokeWidth="1" />
        <text x="6.5" y="13" className="fill-emerald-700 dark:fill-emerald-300" style={{ fontSize: 7, fontWeight: 700 }}>X</text>
      </svg>
    ),
  },
  "word-to-pdf": {
    bg: "bg-amber-100 dark:bg-amber-950/60",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="5" width="8" height="14" rx="1.5" className="fill-sky-500/20 stroke-sky-600 dark:stroke-sky-400" />
        <text x="6" y="14" textAnchor="middle" className="fill-sky-700 dark:fill-sky-300 stroke-none" style={{ fontSize: 6, fontWeight: 700 }}>W</text>
        <path d="M11 12h3" className="stroke-amber-600 dark:stroke-amber-400" strokeLinecap="round" />
        <path d="M13 10l2 2-2 2" className="stroke-amber-600 dark:stroke-amber-400" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="16" y="5" width="6" height="14" rx="1.5" className="fill-red-500/20 stroke-red-600 dark:stroke-red-400" />
        <text x="19" y="14" textAnchor="middle" className="fill-red-700 dark:fill-red-300 stroke-none" style={{ fontSize: 5, fontWeight: 700 }}>PDF</text>
      </svg>
    ),
  },
  "powerpoint-to-pdf": {
    bg: "bg-amber-100 dark:bg-amber-950/60",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="6" width="8" height="10" rx="1.5" className="fill-rose-500/20 stroke-rose-600 dark:stroke-rose-400" />
        <circle cx="5" cy="10" r="1" className="fill-rose-600 dark:fill-rose-400 stroke-none" />
        <path d="M6.5 10h3" className="stroke-rose-600 dark:stroke-rose-400" strokeWidth="1" strokeLinecap="round" />
        <path d="M11 11h3M13 9l2 2-2 2" className="stroke-amber-600 dark:stroke-amber-400" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="16" y="5" width="6" height="14" rx="1.5" className="fill-red-500/20 stroke-red-600 dark:stroke-red-400" />
        <text x="19" y="14" textAnchor="middle" className="fill-red-700 dark:fill-red-300 stroke-none" style={{ fontSize: 5, fontWeight: 700 }}>PDF</text>
      </svg>
    ),
  },
  "excel-to-pdf": {
    bg: "bg-amber-100 dark:bg-amber-950/60",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="4" width="8" height="16" rx="1.5" className="fill-emerald-500/20 stroke-emerald-600 dark:stroke-emerald-400" />
        <path d="M2 9h8M2 14h8M6 4v16" className="stroke-emerald-500/60" strokeWidth="1" />
        <path d="M11 12h3M13 10l2 2-2 2" className="stroke-amber-600 dark:stroke-amber-400" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="16" y="5" width="6" height="14" rx="1.5" className="fill-red-500/20 stroke-red-600 dark:stroke-red-400" />
        <text x="19" y="14" textAnchor="middle" className="fill-red-700 dark:fill-red-300 stroke-none" style={{ fontSize: 5, fontWeight: 700 }}>PDF</text>
      </svg>
    ),
  },
  "edit-pdf": {
    bg: "bg-cyan-100 dark:bg-cyan-950/60",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-cyan-600 dark:text-cyan-400" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="5" y="3" width="14" height="18" rx="2" className="fill-cyan-200/50 dark:fill-cyan-900/40" />
        <path d="M8 9h8M8 13h5" strokeLinecap="round" />
        <path d="M14 15l4-4 1.5 1.5-4 4L13 20l-1-3 2-2z" className="fill-cyan-500/30" strokeLinejoin="round" />
      </svg>
    ),
  },
  "pdf-to-jpg": {
    bg: "bg-rose-100 dark:bg-rose-950/60",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-rose-600 dark:text-rose-400" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="5" width="18" height="14" rx="2" className="fill-rose-200/50 dark:fill-rose-900/40" />
        <circle cx="8.5" cy="10" r="1.5" className="fill-amber-400 stroke-amber-500" />
        <path d="M3 16l4.5-4 3 3 2.5-2.5L21 17" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  "jpg-to-pdf": {
    bg: "bg-amber-100 dark:bg-amber-950/60",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="6" width="8" height="10" rx="1.5" className="fill-amber-400/30 stroke-amber-600 dark:stroke-amber-400" />
        <circle cx="5" cy="9.5" r="1" className="fill-amber-500 stroke-none" />
        <path d="M2 14l2.5-2 2 1.5L8 12" className="stroke-amber-600 dark:stroke-amber-400" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M11 11h3M13 9l2 2-2 2" className="stroke-amber-600 dark:stroke-amber-400" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="16" y="5" width="6" height="14" rx="1.5" className="fill-red-500/20 stroke-red-600 dark:stroke-red-400" />
        <text x="19" y="14" textAnchor="middle" className="fill-red-700 dark:fill-red-300 stroke-none" style={{ fontSize: 5, fontWeight: 700 }}>PDF</text>
      </svg>
    ),
  },
  "sign-pdf": {
    bg: "bg-cyan-100 dark:bg-cyan-950/60",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-cyan-600 dark:text-cyan-400" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="4" y="3" width="16" height="18" rx="2" className="fill-cyan-200/50 dark:fill-cyan-900/40" />
        <path d="M7 16c2-3 4-3 6 0s4 3 6 0" strokeLinecap="round" fill="none" />
        <path d="M16 7l2 2-5 5-3 1 1-3 5-5z" className="fill-cyan-500/30" strokeLinejoin="round" />
      </svg>
    ),
  },
  "watermark-pdf": {
    bg: "bg-cyan-100 dark:bg-cyan-950/60",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-cyan-600 dark:text-cyan-400" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="4" y="3" width="16" height="18" rx="2" className="fill-cyan-200/50 dark:fill-cyan-900/40" />
        <text x="12" y="14" textAnchor="middle" transform="rotate(-25 12 12)" className="fill-cyan-500/40 stroke-none" style={{ fontSize: 7, fontWeight: 700 }}>WM</text>
        <path d="M8 18h8" strokeLinecap="round" opacity="0.5" />
      </svg>
    ),
  },
  "rotate-pdf": {
    bg: "bg-cyan-100 dark:bg-cyan-950/60",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-cyan-600 dark:text-cyan-400" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 12a8 8 0 0 1 13.5-5.7L20 8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M20 4v4h-4" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="8" y="8" width="8" height="10" rx="1" className="fill-cyan-200/50 dark:fill-cyan-900/40" />
      </svg>
    ),
  },
  "html-to-pdf": {
    bg: "bg-amber-100 dark:bg-amber-950/60",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="4" width="9" height="12" rx="1.5" className="fill-amber-400/20 stroke-amber-600 dark:stroke-amber-400" />
        <path d="M4 7h5M4 10h4" className="stroke-amber-600 dark:stroke-amber-400" strokeLinecap="round" />
        <text x="5.5" y="14" className="fill-orange-600 dark:fill-orange-400 stroke-none" style={{ fontSize: 5, fontWeight: 700 }}>&lt;/&gt;</text>
        <path d="M12 10h3M14 8l2 2-2 2" className="stroke-amber-600 dark:stroke-amber-400" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="16" y="5" width="6" height="14" rx="1.5" className="fill-red-500/20 stroke-red-600 dark:stroke-red-400" />
        <text x="19" y="14" textAnchor="middle" className="fill-red-700 dark:fill-red-300 stroke-none" style={{ fontSize: 5, fontWeight: 700 }}>PDF</text>
      </svg>
    ),
  },
  "unlock-pdf": {
    bg: "bg-red-100 dark:bg-red-950/60",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="5" y="10" width="14" height="10" rx="2" className="fill-red-200/50 dark:fill-red-900/40" />
        <path d="M8 10V8a4 4 0 0 1 7.5-2" strokeLinecap="round" />
        <circle cx="12" cy="15" r="1.5" className="fill-red-600 dark:fill-red-400" />
        <path d="M12 16.5v2" strokeLinecap="round" />
      </svg>
    ),
  },
  "protect-pdf": {
    bg: "bg-red-100 dark:bg-red-950/60",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="5" y="10" width="14" height="10" rx="2" className="fill-red-200/50 dark:fill-red-900/40" />
        <rect x="9" y="5" width="6" height="6" rx="1" className="fill-red-300/50 dark:fill-red-800/40" />
        <path d="M12 8v4" strokeLinecap="round" />
        <circle cx="12" cy="15" r="1.5" className="fill-red-600 dark:fill-red-400" />
      </svg>
    ),
  },
  "organize-pdf": {
    bg: "bg-blue-100 dark:bg-blue-950/60",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="4" y="3" width="5" height="7" rx="1" className="fill-blue-200/50 dark:fill-blue-900/40" />
        <rect x="10" y="3" width="5" height="7" rx="1" className="fill-blue-300/50 dark:fill-blue-800/40" />
        <rect x="16" y="3" width="5" height="7" rx="1" className="fill-blue-200/50 dark:fill-blue-900/40" />
        <path d="M6.5 14v3M12 11v6M17.5 13v4" strokeLinecap="round" />
        <path d="M4 20h16" strokeLinecap="round" />
      </svg>
    ),
  },
  "pdf-to-pdfa": {
    bg: "bg-rose-100 dark:bg-rose-950/60",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
        <rect x="4" y="2" width="16" height="20" rx="2" className="fill-rose-500/20 stroke-rose-600 dark:stroke-rose-400" strokeWidth="2" />
        <text x="12" y="13" textAnchor="middle" className="fill-rose-700 dark:fill-rose-300" style={{ fontSize: 6, fontWeight: 700 }}>PDF</text>
        <circle cx="18" cy="6" r="3" className="fill-amber-400 stroke-amber-600 dark:stroke-amber-400" strokeWidth="1" />
        <text x="18" y="7.5" textAnchor="middle" className="fill-amber-900 stroke-none" style={{ fontSize: 5, fontWeight: 700 }}>A</text>
      </svg>
    ),
  },
  "repair-pdf": {
    bg: "bg-violet-100 dark:bg-violet-950/60",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-violet-600 dark:text-violet-400" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="5" y="4" width="14" height="16" rx="2" className="fill-violet-200/50 dark:fill-violet-900/40" />
        <path d="M9 9h6M9 13h4" strokeLinecap="round" strokeDasharray="2 2" />
        <path d="M15 16l3-3-1.5-1.5-1 1-1-1L13 13" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="17" cy="7" r="2.5" className="fill-violet-300/50 dark:fill-violet-800/40" />
      </svg>
    ),
  },
  "page-numbers": {
    bg: "bg-cyan-100 dark:bg-cyan-950/60",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-cyan-600 dark:text-cyan-400" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="5" y="3" width="14" height="18" rx="2" className="fill-cyan-200/50 dark:fill-cyan-900/40" />
        <path d="M8 9h8M8 13h6" strokeLinecap="round" />
        <text x="12" y="20" textAnchor="middle" className="fill-cyan-700 dark:fill-cyan-300 stroke-none" style={{ fontSize: 6, fontWeight: 700 }}>1</text>
      </svg>
    ),
  },
  "scan-to-pdf": {
    bg: "bg-emerald-100 dark:bg-emerald-950/60",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="5" width="18" height="14" rx="2" className="fill-emerald-200/50 dark:fill-emerald-900/40" />
        <circle cx="12" cy="12" r="3" />
        <circle cx="12" cy="12" r="1" className="fill-emerald-600 dark:fill-emerald-400" />
        <path d="M7 5V3M17 5V3M7 19v2M17 19v2" strokeLinecap="round" />
      </svg>
    ),
  },
  "ocr-pdf": {
    bg: "bg-emerald-100 dark:bg-emerald-950/60",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="4" y="3" width="16" height="18" rx="2" className="fill-emerald-200/50 dark:fill-emerald-900/40" />
        <path d="M8 8h8M8 12h6" strokeLinecap="round" strokeDasharray="1 2" />
        <text x="12" y="18" textAnchor="middle" className="fill-emerald-700 dark:fill-emerald-300 stroke-none" style={{ fontSize: 6, fontWeight: 700 }}>Aa</text>
      </svg>
    ),
  },
  "compare-pdf": {
    bg: "bg-emerald-100 dark:bg-emerald-950/60",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="4" width="9" height="16" rx="1.5" className="fill-emerald-200/50 dark:fill-emerald-900/40" />
        <rect x="13" y="4" width="9" height="16" rx="1.5" className="fill-emerald-300/50 dark:fill-emerald-800/40" />
        <path d="M5 8h3M5 12h4M16 8h3M16 12h4" strokeLinecap="round" />
        <path d="M12 8v8" strokeDasharray="2 2" />
      </svg>
    ),
  },
  "redact-pdf": {
    bg: "bg-cyan-100 dark:bg-cyan-950/60",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-cyan-600 dark:text-cyan-400" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="4" y="3" width="16" height="18" rx="2" className="fill-cyan-200/50 dark:fill-cyan-900/40" />
        <path d="M8 9h8M8 13h6" strokeLinecap="round" />
        <rect x="7" y="11" width="10" height="3" rx="0.5" className="fill-zinc-800 dark:fill-zinc-900 stroke-none" />
      </svg>
    ),
  },
  "crop-pdf": {
    bg: "bg-cyan-100 dark:bg-cyan-950/60",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-cyan-600 dark:text-cyan-400" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="6" y="6" width="12" height="12" rx="1" className="fill-cyan-200/50 dark:fill-cyan-900/40" />
        <path d="M4 4v5h5M20 20v-5h-5M20 4v5h-5M4 20v-5h5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  "pdf-forms": {
    bg: "bg-cyan-100 dark:bg-cyan-950/60",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-cyan-600 dark:text-cyan-400" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="4" y="3" width="16" height="18" rx="2" className="fill-cyan-200/50 dark:fill-cyan-900/40" />
        <rect x="7" y="7" width="3" height="3" rx="0.5" />
        <path d="M12 8.5h5M7 14h3M12 14h5M7 18h5" strokeLinecap="round" />
      </svg>
    ),
  },
  "ai-summarizer": {
    bg: "bg-emerald-100 dark:bg-emerald-950/60",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="4" y="3" width="16" height="18" rx="2" className="fill-emerald-200/50 dark:fill-emerald-900/40" />
        <path d="M8 8h8M8 12h6M8 16h4" strokeLinecap="round" />
        <path d="M17 4l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2z" className="fill-amber-400 stroke-amber-500" strokeWidth="1" />
      </svg>
    ),
  },
  "translate-pdf": {
    bg: "bg-emerald-100 dark:bg-emerald-950/60",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="4" y="3" width="16" height="18" rx="2" className="fill-emerald-200/50 dark:fill-emerald-900/40" />
        <circle cx="12" cy="12" r="5" />
        <path d="M12 7v10M9 9.5h6M9 14.5h6" strokeLinecap="round" />
        <path d="M7 12h10" strokeLinecap="round" />
      </svg>
    ),
  },
};

export function getToolIconStyle(slug: ToolSlug): IconStyle {
  return ICON_STYLES[slug];
}
