"use client";

import { useActionState } from "react";
import { AlertCircle, Loader2, Save } from "lucide-react";
import type { Category } from "../lib/api";
import type { AdminGame } from "../lib/admin-api";

type Props = {
  action: (
    prev: string | undefined,
    fd: FormData,
  ) => Promise<string | undefined>;
  categories: Category[];
  game?: AdminGame;
};

const input =
  "mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm transition placeholder:text-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-indigo-400";
const label = "text-sm font-medium text-zinc-700 dark:text-zinc-300";

export default function GameForm({ action, categories, game }: Props) {
  const [error, formAction, pending] = useActionState(action, undefined);

  return (
    <form
      action={formAction}
      className="space-y-5 rounded-2xl border border-zinc-200 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/[0.03] dark:shadow-none"
    >
      <label className="block">
        <span className={label}>Title</span>
        <input
          name="title"
          required
          defaultValue={game?.title}
          className={input}
        />
      </label>
      <label className="block">
        <span className={label}>
          Slug{" "}
          <span className="font-normal text-zinc-500 dark:text-zinc-400">
            (optional, generated from the title)
          </span>
        </span>
        <input
          name="slug"
          defaultValue={game?.slug}
          className={`${input} font-mono`}
        />
      </label>
      <label className="block">
        <span className={label}>Description</span>
        <textarea
          name="description"
          required
          rows={5}
          defaultValue={game?.description}
          className={`${input} resize-y leading-relaxed`}
        />
      </label>
      <label className="block">
        <span className={label}>Thumbnail URL</span>
        <input
          name="thumbnail"
          type="url"
          required
          defaultValue={game?.thumbnail}
          className={input}
        />
      </label>
      <label className="block">
        <span className={label}>Embed URL</span>
        <input
          name="embedUrl"
          type="url"
          required
          defaultValue={game?.embedUrl}
          className={input}
        />
      </label>
      <div className="grid grid-cols-2 gap-4">
        <label className="block">
          <span className={label}>Width</span>
          <input
            name="width"
            type="number"
            defaultValue={game?.width ?? 800}
            className={`${input} tabular-nums`}
          />
        </label>
        <label className="block">
          <span className={label}>Height</span>
          <input
            name="height"
            type="number"
            defaultValue={game?.height ?? 600}
            className={`${input} tabular-nums`}
          />
        </label>
      </div>
      <label className="block">
        <span className={label}>Category</span>
        <select
          name="categoryId"
          defaultValue={game?.categoryId ?? ""}
          className={input}
        >
          <option value="">No category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </label>
      <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-zinc-200 px-3 py-2.5 transition hover:bg-zinc-50 dark:border-white/10 dark:hover:bg-white/[0.04]">
        <input
          name="published"
          type="checkbox"
          defaultChecked={game?.published ?? false}
          className="h-4 w-4 rounded border-zinc-300 accent-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:border-white/20 dark:focus-visible:ring-offset-zinc-950"
        />
        <span className="text-sm text-zinc-700 dark:text-zinc-300">
          Published
        </span>
      </label>

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
        className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 dark:focus-visible:ring-offset-zinc-950"
      >
        {pending ? (
          <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
        ) : (
          <Save aria-hidden="true" className="h-4 w-4" />
        )}
        {pending ? "Saving..." : "Save"}
      </button>
    </form>
  );
}
