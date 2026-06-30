interface ToolErrorProps {
  message: string;
}

export function ToolError({ message }: ToolErrorProps) {
  return (
    <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300">
      {message}
    </p>
  );
}
