"use client";

import { useActionState } from "react";
import { importFeed } from "@/app/admin/import/actions";

export default function ImportForm() {
  const [message, action, pending] = useActionState(importFeed, undefined);

  return (
    <form action={action} className="space-y-4">
      <label className="block">
        <span className="text-sm font-medium">
          GameMonetize feed URL (JSON)
        </span>
        <input
          name="feedUrl"
          required
          defaultValue="https://gamemonetize.com/feed.php?format=0&num=20&page=1"
          className="w-full rounded border px-3 py-2"
        />
      </label>
      {message && <p className="rounded border p-3 text-sm">{message}</p>}
      <button
        disabled={pending}
        className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        {pending ? "Importing..." : "Import as drafts"}
      </button>
    </form>
  );
}
