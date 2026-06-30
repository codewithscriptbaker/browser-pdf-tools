import { notFound } from "next/navigation";
import { ToolRenderer } from "@/components/tools/ToolRenderer";
import { ToolPageLayout } from "@/components/tools/ToolPageLayout";
import { createToolMetadata } from "@/lib/seo/metadata";
import { TOOLS, type ToolSlug, getTool } from "@/lib/tools";

interface ToolPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return TOOLS.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: ToolPageProps) {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) return {};
  return createToolMetadata(tool.slug as ToolSlug);
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params;
  const tool = getTool(slug);

  if (!tool) {
    notFound();
  }

  return (
    <ToolPageLayout slug={tool.slug as ToolSlug}>
      <ToolRenderer slug={tool.slug as ToolSlug} />
    </ToolPageLayout>
  );
}
