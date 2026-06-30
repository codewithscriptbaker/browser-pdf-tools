import type { Metadata } from "next";
import { TOOLS, SITE_NAME, SITE_URL, type ToolSlug } from "@/lib/tools";

export function createToolMetadata(slug: ToolSlug): Metadata {
  const tool = TOOLS.find((t) => t.slug === slug)!;

  return {
    title: `${tool.name} — Free & Private | ${SITE_NAME}`,
    description: tool.description,
    openGraph: {
      title: `${tool.name} — Free & Private`,
      description: tool.description,
      url: `${SITE_URL}${tool.href}`,
      siteName: SITE_NAME,
      type: "website",
    },
    alternates: {
      canonical: `${SITE_URL}${tool.href}`,
    },
  };
}

export const homeMetadata: Metadata = {
  title: `${SITE_NAME} — Free PDF Tools That Run in Your Browser`,
  description:
    "30+ free PDF tools — merge, split, compress, convert, edit, OCR, and more. 100% private — files never leave your device.",
  icons: {
    icon: [{ url: "/logo.svg", type: "image/svg+xml" }],
    apple: [{ url: "/logo.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    title: `${SITE_NAME} — Privacy-First PDF Tools`,
    description:
      "Free online PDF tools processed entirely in your browser. No uploads, no storage, no tracking of your files.",
    url: SITE_URL,
    siteName: SITE_NAME,
    type: "website",
  },
};
