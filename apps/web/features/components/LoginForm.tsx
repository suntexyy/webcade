"use client";

import { useActionState } from "react";
import { AlertCircle, Loader2, Lock } from "lucide-react";
import { login } from "@/app/admin/actions";

const input =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 shadow-sm transition placeholder:text-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-indigo-400";

export default function LoginForm() {
  const [error, action, pending] = useActionState(login, undefined);

  return (
    <form
      action={action}
      className="relative mx-auto mt-24 max-w-sm space-y-4 rounded-2xl border border-zinc-200 bg-white/80 p-7 shadow-xl shadow-zinc-900/5 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04] dark:shadow-black/40"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-px -z-10 rounded-2xl bg-gradient-to-b from-indigo-500/20 via-transparent to-fuchsia-500/10 blur-xl"
      />
      <div className="flex flex-col items-center gap-3 pb-2 text-center">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-white shadow-lg shadow-indigo-500/30">
          <Lock aria-hidden="true" className="h-5 w-5" />
        </span>
        <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Admin login
        </h1>
      </div>
      <input
        type="email"
        name="email"
        placeholder="Email"
        aria-label="Email"
        autoComplete="username"
        required
        className={input}
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        aria-label="Password"
        autoComplete="current-password"
        required
        className={input}
      />
      {error && (
        <p
          role="alert"
          className="flex items-start gap-2 rounded-lg border border-red-300/70 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300"
        >
          <AlertCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-900 px-3 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 dark:focus-visible:ring-offset-zinc-950"
      >
        {pending && (
          <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
        )}
        {pending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
