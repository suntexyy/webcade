import Link from "next/link";
import { Gamepad2, Play } from "lucide-react";
import type { GameCard } from "../lib/api";

export default function GameGrid({ games }: { games: GameCard[] }) {
  if (games.length === 0)
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-zinc-300 px-6 py-16 text-center dark:border-white/15">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 dark:bg-white/5 dark:text-zinc-400">
          <Gamepad2 aria-hidden="true" className="h-5 w-5" />
        </span>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          No games found.
        </p>
      </div>
    );

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {games.map((g) => (
        <Link
          key={g.id}
          href={`/game/${g.slug}`}
          className="group relative overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-indigo-400/60 hover:shadow-xl hover:shadow-indigo-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-white/10 dark:bg-white/[0.03] dark:shadow-none dark:hover:border-indigo-400/40 dark:hover:shadow-indigo-500/20 dark:focus-visible:ring-offset-zinc-950"
        >
          <div className="relative overflow-hidden">
            <img
              src={g.thumbnail}
              alt={g.title}
              loading="lazy"
              className="aspect-video w-full bg-zinc-100 object-cover transition duration-500 group-hover:scale-105 dark:bg-white/5"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-zinc-900 shadow-lg backdrop-blur">
                <Play className="ml-0.5 h-4 w-4 fill-current" />
              </span>
            </div>
          </div>
          <div className="p-3">
            <div className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              {g.title}
            </div>
            {g.category && (
              <div className="mt-1 inline-flex items-center rounded-full bg-indigo-500/10 px-2 py-0.5 text-[11px] font-medium text-indigo-700 dark:text-indigo-300">
                {g.category.name}
              </div>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
