"use client";

import { useActionState } from "react";
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

const input = "w-full rounded border px-3 py-2";

export default function GameForm({ action, categories, game }: Props) {
  const [error, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="space-y-4">
      <label className="block">
        <span className="text-sm font-medium">Title</span>
        <input
          name="title"
          required
          defaultValue={game?.title}
          className={input}
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium">
          Slug (optional, generated from the title)
        </span>
        <input name="slug" defaultValue={game?.slug} className={input} />
      </label>
      <label className="block">
        <span className="text-sm font-medium">Description</span>
        <textarea
          name="description"
          required
          rows={5}
          defaultValue={game?.description}
          className={input}
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium">Thumbnail URL</span>
        <input
          name="thumbnail"
          type="url"
          required
          defaultValue={game?.thumbnail}
          className={input}
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium">Embed URL</span>
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
          <span className="text-sm font-medium">Width</span>
          <input
            name="width"
            type="number"
            defaultValue={game?.width ?? 800}
            className={input}
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Height</span>
          <input
            name="height"
            type="number"
            defaultValue={game?.height ?? 600}
            className={input}
          />
        </label>
      </div>
      <label className="block">
        <span className="text-sm font-medium">Category</span>
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
      <label className="flex items-center gap-2">
        <input
          name="published"
          type="checkbox"
          defaultChecked={game?.published ?? false}
        />
        <span className="text-sm">Published</span>
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        {pending ? "Saving..." : "Save"}
      </button>
    </form>
  );
}
