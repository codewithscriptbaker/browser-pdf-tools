"use client";

import type { Session } from "next-auth";
import Link from "next/link";
import { logoutAction } from "@/lib/auth/actions";

interface AuthNavProps {
  session: Session | null;
}

export function AuthNav({ session }: AuthNavProps) {
  if (session?.user) {
    const initials = getInitials(session.user.name ?? session.user.email ?? "?");

    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 rounded-xl border border-zinc-200 px-2 py-1 dark:border-zinc-700">
          {session.user.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={session.user.image}
              alt=""
              className="h-7 w-7 rounded-full object-cover"
            />
          ) : (
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-600 text-xs font-semibold text-white dark:bg-teal-500">
              {initials}
            </span>
          )}
          <span className="hidden max-w-[120px] truncate text-sm font-medium text-zinc-700 sm:block dark:text-zinc-300">
            {session.user.name ?? session.user.email}
          </span>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="rounded-xl px-3 py-1.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
          >
            Sign out
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/login"
        className="rounded-xl px-3 py-1.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
      >
        Log in
      </Link>
      <Link
        href="/signup"
        className="rounded-xl bg-teal-600 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600"
      >
        Sign up
      </Link>
    </div>
  );
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0]}${parts[1]![0]}`.toUpperCase();
}
