import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-violet-400">Owner only</p>
        <h1 className="mt-2 text-2xl font-bold text-white">PDF Tools Admin</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Sign in with your admin credentials to view analytics.
        </p>

        <div className="mt-8">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
