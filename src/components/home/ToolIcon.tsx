import type { ToolSlug } from "@/lib/tools";
import { getToolIconStyle } from "@/components/home/tool-icon-svgs";

interface ToolIconProps {
  slug: ToolSlug;
}

export function ToolIcon({ slug }: ToolIconProps) {
  const { bg, icon } = getToolIconStyle(slug);

  return (
    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${bg}`}>
      {icon}
    </span>
  );
}
