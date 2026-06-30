import { TOOLS, type ToolSlug, getTool } from "@/lib/tools";

export interface FaqItem {
  question: string;
  answer: string;
}

const CUSTOM_FAQS: Partial<Record<ToolSlug, FaqItem[]>> = {
  "merge-pdf": [
    {
      question: "How do I merge PDF files for free?",
      answer:
        "Upload two or more PDF files using the merge tool, drag to reorder them if needed, then click Merge PDF. Your combined file downloads instantly — no account or upload to a server required.",
    },
    {
      question: "Is it safe to merge PDFs online?",
      answer:
        "Yes. This tool processes files entirely in your browser. Your PDFs never leave your device, are not stored on any server, and are not logged.",
    },
    {
      question: "How many PDFs can I merge at once?",
      answer:
        "You can merge as many PDF files as your browser memory allows. Files up to 50 MB each are supported on the free tier.",
    },
    {
      question: "Can I change the order of PDFs before merging?",
      answer:
        "Yes. After uploading, drag file or page cards to reorder. The final PDF will follow the order shown.",
    },
    {
      question: "Does merging PDFs reduce quality?",
      answer:
        "No. Merging combines the original pages without re-encoding them, so text and images stay at their original quality.",
    },
  ],
  "split-pdf": [
    {
      question: "How do I split a PDF into separate pages?",
      answer:
        "Upload your PDF, choose a split mode, and click the action button. Each page or range can be saved as its own file or ZIP.",
    },
    {
      question: "Can I extract a specific page range from a PDF?",
      answer:
        "Yes. Use Range or Multi-range mode and enter values like 3-7 or 1-3, 5, 7-9.",
    },
    {
      question: "Are my files uploaded to a server when splitting?",
      answer: "No. Splitting happens 100% in your browser.",
    },
    {
      question: "What is the maximum PDF size for splitting?",
      answer: "Free users can split PDFs up to 50 MB per file.",
    },
    {
      question: "Will split PDFs keep the same formatting?",
      answer: "Yes. Pages are extracted as-is from the original file.",
    },
  ],
  "compress-pdf": [
    {
      question: "How can I compress a PDF without losing quality?",
      answer: "Start with Light compression for modest size reduction with best quality.",
    },
    {
      question: "Why is my PDF still large after compressing?",
      answer: "Already-optimized or vector-only PDFs may not shrink much with light compression.",
    },
    {
      question: "Is PDF compression done on your servers?",
      answer: "No. Compression runs locally in your browser.",
    },
    {
      question: "How much can I reduce PDF file size?",
      answer: "Image-heavy PDFs often shrink 40–70% with medium compression.",
    },
    {
      question: "Can I compress a PDF for email attachment?",
      answer: "Yes. Use Medium or High compression to get under common email limits.",
    },
  ],
  "rotate-pdf": [
    {
      question: "How do I rotate PDF pages permanently?",
      answer:
        "Upload your PDF, set any angle from -180° to 180°, choose which pages to rotate, then download.",
    },
    {
      question: "Can I rotate only some pages in a PDF?",
      answer: "Yes. Choose Selected pages only and click the pages you want to rotate.",
    },
    {
      question: "Does rotating a PDF affect quality?",
      answer:
        "Right angles (90°, 180°) keep vector quality. Other angles are rendered to match your preview.",
    },
    {
      question: "Is this PDF rotator free and private?",
      answer: "Yes. Completely free with no login — all processing happens in your browser.",
    },
    {
      question: "How do I fix a sideways scanned PDF?",
      answer: "Upload the scan, rotate 90° or 270°, apply to all pages, and download.",
    },
  ],
  "pdf-to-jpg": [
    {
      question: "How do I convert a PDF to JPG for free?",
      answer: "Upload your PDF, select pages, choose quality and format, then click Convert.",
    },
    {
      question: "What image quality should I choose?",
      answer: "High for printing, Medium for email, Low for smallest files.",
    },
    {
      question: "Are my PDFs uploaded when converting to JPG?",
      answer: "No. Conversion happens entirely in your browser.",
    },
    {
      question: "Can I convert only some pages to images?",
      answer: "Yes. Click page thumbnails to select which pages to export.",
    },
    {
      question: "JPG or PNG — which should I use?",
      answer: "JPG for smaller photos; PNG for lossless text-heavy pages.",
    },
  ],
  "pdf-to-word": [
    {
      question: "How do I convert PDF to Word online?",
      answer: "Upload your PDF, select pages, and click Download Word.",
    },
    {
      question: "Will the Word file match my PDF layout exactly?",
      answer: "Text PDFs convert well. Scanned pages use browser OCR when enabled.",
    },
    {
      question: "Is PDF to Word conversion private?",
      answer: "Yes. Extraction runs 100% in your browser.",
    },
    {
      question: "Can I convert a password-protected PDF?",
      answer: "Unlock the PDF first using our Unlock PDF tool.",
    },
    {
      question: "How does OCR work for scanned PDFs?",
      answer: "Tesseract.js runs in your browser when Auto OCR is enabled.",
    },
  ],
  "pdf-to-excel": [
    {
      question: "How do I convert a PDF table to Excel?",
      answer: "Upload your PDF, select pages with tabular data, and click Download Excel.",
    },
    {
      question: "How accurate is PDF to Excel conversion?",
      answer: "Best on PDFs with clear rows and columns.",
    },
    {
      question: "Are my files safe during conversion?",
      answer: "Yes. All processing is local in your browser.",
    },
    {
      question: "Can I convert multiple pages to one Excel file?",
      answer: "Yes. Each page becomes a separate worksheet.",
    },
    {
      question: "Does this work on scanned PDFs?",
      answer: "Use OCR PDF to extract text from scans first.",
    },
  ],
};

function genericFaqs(slug: ToolSlug): FaqItem[] {
  const tool = getTool(slug)!;
  return [
    {
      question: `How do I use ${tool.name}?`,
      answer: `Open ${tool.name}, upload your file, adjust options, and click the action button. Everything runs in your browser.`,
    },
    {
      question: `Is ${tool.name} free?`,
      answer: "Yes. All tools are free with no account required.",
    },
    {
      question: "Are my files uploaded to a server?",
      answer: "No. Files are processed locally on your device and never uploaded.",
    },
    {
      question: `What file size does ${tool.name} support?`,
      answer: "Files up to 50 MB are supported. Larger files may work depending on your device.",
    },
  ];
}

export function getToolFaqs(slug: ToolSlug): FaqItem[] {
  return CUSTOM_FAQS[slug] ?? genericFaqs(slug);
}

/** @deprecated Use getToolFaqs */
export const TOOL_FAQS: Record<ToolSlug, FaqItem[]> = Object.fromEntries(
  TOOLS.map((t) => [t.slug, getToolFaqs(t.slug)]),
) as Record<ToolSlug, FaqItem[]>;
