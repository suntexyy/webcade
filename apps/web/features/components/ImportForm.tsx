"use client";

import { useActionState } from "react";
import { DownloadCloud, Info, Loader2 } from "lucide-react";
import { importFeed } from "@/app/admin/import/actions";

export default function ImportForm() {
  const [message, action, pending] = useActionState(importFeed, undefined);

  return (
    <form
      action={action}
      className="space-y-5 rounded-2xl border border-zinc-200 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/[0.03] dark:shadow-none"
    >
      <label className="block">
        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          GameMonetize feed URL (JSON)
        </span>
        <input
          name="feedUrl"
          required
          defaultValue="https://gamemonetize.com/feed.php?format=0&num=20&page=1"
          className="mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-xs text-zinc-900 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-100 dark:focus:border-indigo-400"
        />
      </label>
      {message && (
        <p
          role="status"
          className="flex items-start gap-2 rounded-lg border border-indigo-300/60 bg-indigo-50 p-3 text-sm text-indigo-900 dark:border-indigo-400/30 dark:bg-indigo-500/10 dark:text-indigo-200"
        >
          <Info aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
          {message}
        </p>
      )}
      <button
        disabled={pending}
        className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 dark:focus-visible:ring-offset-zinc-950"
      >
        {pending ? (
          <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
        ) : (
          <DownloadCloud aria-hidden="true" className="h-4 w-4" />
        )}
        {pending ? "Importing..." : "Import as drafts"}
      </button>
    </form>
  );
}
