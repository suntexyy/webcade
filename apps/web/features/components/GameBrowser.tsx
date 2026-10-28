"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { AlertTriangle, RotateCw, Search } from "lucide-react";
import GameGrid from "./GameGrid";
import Pagination from "./Pagination";
import { gamesQuery } from "../lib/queries";

type Props = { basePath: string; category?: string; requireQuery?: boolean };

export default function GameBrowser({
  basePath,
  category,
  requireQuery,
}: Props) {
  const params = useSearchParams();
  const page = Math.max(Number(params.get("page")) || 1, 1);
  const q = params.get("q")?.trim() || undefined;
  const queryClient = useQueryClient();

  const enabled = !requireQuery || !!q;

  const { data, isPending, isError, isPlaceholderData, refetch } = useQuery({
    ...gamesQuery({ category, q, page }),
    placeholderData: keepPreviousData,
    enabled,
  });

  // warm the cache with the next page so clicking "Next" feels instant
  useEffect(() => {
    if (enabled && data && page < data.totalPages) {
      queryClient.prefetchQuery(gamesQuery({ category, q, page: page + 1 }));
    }
  }, [data, page, q, category, enabled, queryClient]);

  if (!enabled)
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-zinc-300 px-6 py-16 text-center dark:border-white/15">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 dark:bg-white/5 dark:text-zinc-400">
          <Search aria-hidden="true" className="h-5 w-5" />
        </span>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Type a game name to search.
        </p>
      </div>
    );

  if (isPending) {
    return (
      <div
        role="status"
        aria-label="Loading games"
        className="grid grid-cols-2 gap-4 md:grid-cols-4"
      >
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100/60 dark:border-white/10 dark:bg-white/[0.03]"
          >
            <div className="aspect-video w-full bg-zinc-200 dark:bg-white/[0.06]" />
            <div className="space-y-2 p-3">
              <div className="h-3 w-3/4 rounded bg-zinc-200 dark:bg-white/10" />
              <div className="h-2.5 w-1/3 rounded bg-zinc-200/70 dark:bg-white/5" />
            </div>
          </div>
        ))}
        <span className="sr-only">Loading games…</span>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div
        role="alert"
        className="flex items-start gap-3 rounded-xl border border-red-300/70 bg-red-50 p-4 text-sm text-red-800 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200"
      >
        <AlertTriangle
          aria-hidden="true"
          className="mt-0.5 h-4 w-4 shrink-0 text-red-600 dark:text-red-400"
        />
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <span>Could not load games.</span>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-1.5 rounded-md border border-red-300 bg-white px-2.5 py-1 text-xs font-medium text-red-700 transition hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 active:scale-95 dark:border-red-500/40 dark:bg-transparent dark:text-red-200 dark:hover:bg-red-500/20"
          >
            <RotateCw aria-hidden="true" className="h-3 w-3" />
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/60 px-3 py-1 text-sm text-zinc-600 backdrop-blur dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-400">
        <span className="font-semibold tabular-nums text-zinc-900 dark:text-white">
          {data.total}
        </span>
        games{q ? ` found for "${q}"` : ""}
      </p>
      <div
        aria-busy={isPlaceholderData}
        className={
          isPlaceholderData
            ? "opacity-60 transition-opacity duration-200"
            : "opacity-100 transition-opacity duration-200"
        }
      >
        <GameGrid games={data.items} />
      </div>
      <Pagination
        page={page}
        totalPages={data.totalPages}
        basePath={basePath}
        query={{ q }}
      />
    </>
  );
}
