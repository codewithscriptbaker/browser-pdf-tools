let activeTool: string | null = null;

export function setActiveTool(slug: string | null) {
  activeTool = slug;
}

export function getActiveTool(): string | null {
  return activeTool;
}
