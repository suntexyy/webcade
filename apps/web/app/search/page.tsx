import { Suspense } from "react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import GameBrowser from "@/features/components/GameBrowser";
import SearchInput from "@/features/components/SearchInput";
import { getQueryClient } from "@/features/lib/get-query-client";
import { gamesQuery } from "@/features/lib/queries";

export const metadata = { title: "Search games", robots: { index: false } };

type Props = { searchParams: Promise<{ q?: string; page?: string }> };

export default async function SearchPage({ searchParams }: Props) {
  const { q: rawQ, page: rawPage } = await searchParams;
  const q = rawQ?.trim() || undefined;
  const page = Math.max(Number(rawPage) || 1, 1);

  const queryClient = getQueryClient();
  if (q) await queryClient.prefetchQuery(gamesQuery({ q, page }));

  return (
    <main className="relative mx-auto max-w-6xl px-6 pb-6 pt-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-24 -z-10 h-72 bg-[radial-gradient(ellipse_at_top,rgb(139_92_246/0.15),transparent_65%)]"
      />
      <h1 className="mb-6 bg-gradient-to-b from-zinc-900 to-zinc-600 bg-clip-text pb-1 text-4xl font-bold tracking-tight text-transparent dark:from-white dark:to-zinc-400">
        Search games
      </h1>
      <SearchInput initialQuery={q ?? ""} />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={null}>
          <GameBrowser basePath="/search" requireQuery />
        </Suspense>
      </HydrationBoundary>
    </main>
  );
}
