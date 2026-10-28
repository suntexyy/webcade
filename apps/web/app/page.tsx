import { Suspense } from "react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import GameBrowser from "@/features/components/GameBrowser";
import { getQueryClient } from "@/features/lib/get-query-client";
import { gamesQuery } from "@/features/lib/queries";

type Props = { searchParams: Promise<{ page?: string }> };

export default async function Home({ searchParams }: Props) {
  const { page: rawPage } = await searchParams;
  const page = Math.max(Number(rawPage) || 1, 1);

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(gamesQuery({ page }));

  return (
    <main className="relative mx-auto max-w-6xl px-6 pb-6 pt-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-24 -z-10 h-80 bg-[radial-gradient(ellipse_at_top,rgb(99_102_241/0.18),transparent_65%)]"
      />
      <h1 className="mb-2 bg-gradient-to-b from-zinc-900 to-zinc-600 bg-clip-text pb-1 text-4xl font-bold tracking-tight text-transparent sm:text-5xl dark:from-white dark:to-zinc-400">
        Play free games online
      </h1>
      <p className="mb-10 max-w-xl text-zinc-600 dark:text-zinc-400">
        Instant browser games. No downloads, no sign-up.
      </p>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={null}>
          <GameBrowser basePath="/" />
        </Suspense>
      </HydrationBoundary>
    </main>
  );
}
