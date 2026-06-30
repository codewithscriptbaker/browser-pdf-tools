export type ToolSlug =
  | "merge-pdf"
  | "split-pdf"
  | "compress-pdf"
  | "pdf-to-word"
  | "pdf-to-powerpoint"
  | "pdf-to-excel"
  | "word-to-pdf"
  | "powerpoint-to-pdf"
  | "excel-to-pdf"
  | "edit-pdf"
  | "pdf-to-jpg"
  | "jpg-to-pdf"
  | "sign-pdf"
  | "watermark-pdf"
  | "rotate-pdf"
  | "html-to-pdf"
  | "unlock-pdf"
  | "protect-pdf"
  | "organize-pdf"
  | "pdf-to-pdfa"
  | "repair-pdf"
  | "page-numbers"
  | "scan-to-pdf"
  | "ocr-pdf"
  | "compare-pdf"
  | "redact-pdf"
  | "crop-pdf"
  | "pdf-forms"
  | "ai-summarizer"
  | "translate-pdf";

export type ToolCategory =
  | "organize"
  | "optimize"
  | "convert"
  | "convert-to"
  | "edit"
  | "security"
  | "intelligence";

export type ToolStatus = "live" | "coming-soon";

export interface Tool {
  slug: ToolSlug;
  name: string;
  shortDescription: string;
  description: string;
  href: string;
  category: ToolCategory;
  status: ToolStatus;
  badge?: "new";
}

export const TOOL_CATEGORIES: { id: ToolCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "organize", label: "Organize PDF" },
  { id: "optimize", label: "Optimize PDF" },
  { id: "convert", label: "Convert PDF" },
  { id: "convert-to", label: "Convert to PDF" },
  { id: "edit", label: "Edit PDF" },
  { id: "security", label: "PDF Security" },
  { id: "intelligence", label: "PDF Intelligence" },
];

export const TOOLS: Tool[] = [
  {
    slug: "merge-pdf",
    name: "Merge PDF",
    shortDescription: "Combine PDFs in the order you want",
    description:
      "Merge PDF files online for free. Combine multiple documents into a single PDF — entirely in your browser, with no uploads.",
    href: "/merge-pdf",
    category: "organize",
    status: "live",
  },
  {
    slug: "split-pdf",
    name: "Split PDF",
    shortDescription: "Separate pages into independent PDF files",
    description:
      "Split PDF files by page range or into individual pages. Fast, free, and private — your files never leave your device.",
    href: "/split-pdf",
    category: "organize",
    status: "live",
  },
  {
    slug: "compress-pdf",
    name: "Compress PDF",
    shortDescription: "Reduce file size while keeping quality",
    description:
      "Compress PDF files to reduce file size for email and sharing. 100% browser-based processing — no server uploads.",
    href: "/compress-pdf",
    category: "optimize",
    status: "live",
  },
  {
    slug: "pdf-to-word",
    name: "PDF to Word",
    shortDescription: "Convert PDF to editable DOCX",
    description:
      "Convert PDF to Word (.docx) in your browser. Extract text into an editable document — files never leave your device.",
    href: "/pdf-to-word",
    category: "convert",
    status: "live",
  },
  {
    slug: "pdf-to-powerpoint",
    name: "PDF to PowerPoint",
    shortDescription: "Turn PDF pages into PPT slides",
    description:
      "Convert PDF to PowerPoint presentations. Each page becomes a slide — processed privately in your browser.",
    href: "/pdf-to-powerpoint",
    category: "convert",
    status: "live",
  },
  {
    slug: "pdf-to-excel",
    name: "PDF to Excel",
    shortDescription: "Pull PDF data into spreadsheets",
    description:
      "Convert PDF to Excel (.xlsx) online. Detect rows and columns from your PDF layout — processed entirely in your browser.",
    href: "/pdf-to-excel",
    category: "convert",
    status: "live",
  },
  {
    slug: "word-to-pdf",
    name: "Word to PDF",
    shortDescription: "Convert DOCX files to PDF",
    description:
      "Convert Word documents to PDF online for free. Keep formatting readable — no uploads required.",
    href: "/word-to-pdf",
    category: "convert-to",
    status: "live",
  },
  {
    slug: "powerpoint-to-pdf",
    name: "PowerPoint to PDF",
    shortDescription: "Convert PPT slideshows to PDF",
    description:
      "Convert PowerPoint presentations to PDF for easy sharing and printing.",
    href: "/powerpoint-to-pdf",
    category: "convert-to",
    status: "live",
  },
  {
    slug: "excel-to-pdf",
    name: "Excel to PDF",
    shortDescription: "Convert spreadsheets to PDF",
    description:
      "Convert Excel workbooks to PDF documents for sharing and archiving.",
    href: "/excel-to-pdf",
    category: "convert-to",
    status: "live",
  },
  {
    slug: "edit-pdf",
    name: "Edit PDF",
    shortDescription: "Add text annotations to a PDF",
    description:
      "Add text to your PDF pages. Type a message and place it on every page or selected pages — all in your browser.",
    href: "/edit-pdf",
    category: "edit",
    status: "live",
  },
  {
    slug: "pdf-to-jpg",
    name: "PDF to JPG",
    shortDescription: "Convert PDF pages to JPG or PNG",
    description:
      "Convert PDF to JPG or PNG online for free. Export each page as a high-quality image — no uploads, fully private.",
    href: "/pdf-to-jpg",
    category: "convert",
    status: "live",
  },
  {
    slug: "jpg-to-pdf",
    name: "JPG to PDF",
    shortDescription: "Convert images to a PDF in seconds",
    description:
      "Convert JPG and PNG images to a single PDF. Drag multiple images, reorder, and download — processed locally.",
    href: "/jpg-to-pdf",
    category: "convert-to",
    status: "live",
  },
  {
    slug: "sign-pdf",
    name: "Sign PDF",
    shortDescription: "Add your signature image to a PDF",
    description:
      "Sign PDF documents by placing your signature image on every page or selected pages. Private and free.",
    href: "/sign-pdf",
    category: "edit",
    status: "live",
  },
  {
    slug: "watermark-pdf",
    name: "Watermark",
    shortDescription: "Stamp text over your PDF",
    description:
      "Add a text watermark to your PDF. Customize text, opacity, and angle — processed entirely in your browser.",
    href: "/watermark-pdf",
    category: "edit",
    status: "live",
  },
  {
    slug: "rotate-pdf",
    name: "Rotate PDF",
    shortDescription: "Rotate pages to any angle",
    description:
      "Rotate PDF pages to any angle from -180° to 180°. Drag the preview or use the slider — processed locally in your browser.",
    href: "/rotate-pdf",
    category: "organize",
    status: "live",
  },
  {
    slug: "html-to-pdf",
    name: "HTML to PDF",
    shortDescription: "Save web pages as PDF",
    description:
      "Convert HTML pages to PDF documents using your browser print engine.",
    href: "/html-to-pdf",
    category: "convert-to",
    status: "live",
  },
  {
    slug: "unlock-pdf",
    name: "Unlock PDF",
    shortDescription: "Remove PDF password protection",
    description:
      "Unlock password-protected PDFs when you know the password. Creates an unrestricted copy in your browser.",
    href: "/unlock-pdf",
    category: "security",
    status: "live",
  },
  {
    slug: "protect-pdf",
    name: "Protect PDF",
    shortDescription: "Password-protect your PDF",
    description:
      "Add password protection to your PDF files to control who can open or edit them.",
    href: "/protect-pdf",
    category: "security",
    status: "live",
  },
  {
    slug: "organize-pdf",
    name: "Organize PDF",
    shortDescription: "Sort, delete, and reorder pages",
    description:
      "Organize PDF pages — drag to reorder, remove unwanted pages, and download a new document.",
    href: "/organize-pdf",
    category: "organize",
    status: "live",
  },
  {
    slug: "pdf-to-pdfa",
    name: "PDF to PDF/A",
    shortDescription: "Archive-ready PDF/A format",
    description:
      "Convert PDF to PDF/A for long-term archiving and compliance with ISO standards.",
    href: "/pdf-to-pdfa",
    category: "convert",
    status: "live",
  },
  {
    slug: "repair-pdf",
    name: "Repair PDF",
    shortDescription: "Fix damaged or corrupt PDFs",
    description:
      "Attempt to repair corrupted PDF files by rebuilding the document structure in your browser.",
    href: "/repair-pdf",
    category: "optimize",
    status: "live",
  },
  {
    slug: "page-numbers",
    name: "Page numbers",
    shortDescription: "Add page numbers to your PDF",
    description:
      "Add page numbers to the bottom or top of every page. Choose format and position — free and private.",
    href: "/page-numbers",
    category: "edit",
    status: "live",
  },
  {
    slug: "scan-to-pdf",
    name: "Scan to PDF",
    shortDescription: "Capture scans from your camera",
    description:
      "Use your device camera to scan documents and save them as a PDF.",
    href: "/scan-to-pdf",
    category: "intelligence",
    status: "live",
    badge: "new",
  },
  {
    slug: "ocr-pdf",
    name: "OCR PDF",
    shortDescription: "Extract text from scanned PDFs",
    description:
      "Run OCR on scanned PDF pages using Tesseract in your browser. Export extracted text as a .txt file.",
    href: "/ocr-pdf",
    category: "intelligence",
    status: "live",
    badge: "new",
  },
  {
    slug: "compare-pdf",
    name: "Compare PDF",
    shortDescription: "View two PDFs side by side",
    description:
      "Compare two PDF documents side by side with synchronized page navigation.",
    href: "/compare-pdf",
    category: "intelligence",
    status: "live",
  },
  {
    slug: "redact-pdf",
    name: "Redact PDF",
    shortDescription: "Permanently remove sensitive content",
    description:
      "Redact text and graphics to permanently remove sensitive information from PDFs.",
    href: "/redact-pdf",
    category: "edit",
    status: "live",
  },
  {
    slug: "crop-pdf",
    name: "Crop PDF",
    shortDescription: "Crop margins from PDF pages",
    description:
      "Crop white margins or trim edges from PDF pages. Adjust margins and download a trimmed document.",
    href: "/crop-pdf",
    category: "edit",
    status: "live",
  },
  {
    slug: "pdf-forms",
    name: "PDF Forms",
    shortDescription: "Create fillable PDF forms",
    description:
      "Detect form fields and create interactive fillable PDF forms.",
    href: "/pdf-forms",
    category: "edit",
    status: "live",
    badge: "new",
  },
  {
    slug: "ai-summarizer",
    name: "AI Summarizer",
    shortDescription: "Summarize PDF content with AI",
    description:
      "Generate concise summaries from PDF articles and documents using AI.",
    href: "/ai-summarizer",
    category: "intelligence",
    status: "live",
    badge: "new",
  },
  {
    slug: "translate-pdf",
    name: "Translate PDF",
    shortDescription: "Translate PDF content with AI",
    description:
      "Translate PDF documents into other languages while preserving layout.",
    href: "/translate-pdf",
    category: "intelligence",
    status: "live",
    badge: "new",
  },
];

export const LIVE_TOOLS = TOOLS.filter((t) => t.status === "live");

export function getTool(slug: string): Tool | undefined {
  return TOOLS.find((t) => t.slug === slug);
}

export const SITE_NAME = "PDF Tools";
export const SITE_TAGLINE = "Privacy-first PDF tools that run in your browser";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://pdftools.example.com";
