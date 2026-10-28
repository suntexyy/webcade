"use client";

import { useQuery } from "@tanstack/react-query";
import GameGrid from "./GameGrid";
import { gamesQuery } from "../lib/queries";

type Props = { categorySlug: string; categoryName: string; currentId: number };

export default function RelatedGames({
  categorySlug,
  categoryName,
  currentId,
}: Props) {
  const { data } = useQuery(gamesQuery({ category: categorySlug, limit: 9 }));
  const related = (data?.items ?? [])
    .filter((g) => g.id !== currentId)
    .slice(0, 8);

  if (related.length === 0) return null;

  return (
    <section className="mt-14" aria-labelledby="related-games-heading">
      <div className="mb-5 flex items-center gap-3">
        <span
          aria-hidden="true"
          className="h-6 w-1 rounded-full bg-gradient-to-b from-indigo-500 to-fuchsia-500"
        />
        <h2
          id="related-games-heading"
          className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-white"
        >
          More {categoryName} games
        </h2>
      </div>
      <GameGrid games={related} />
    </section>
  );
}
