import { Suspense } from "react";
import type { Metadata } from "next";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import GameBrowser from "@/features/components/GameBrowser";
import { getQueryClient } from "@/features/lib/get-query-client";
import { categoriesQuery, gamesQuery } from "@/features/lib/queries";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const categories = await getQueryClient().fetchQuery(categoriesQuery());
  const name = categories.find((c) => c.slug === slug)?.name ?? "Games";
  return {
    title: `${name} Games - Play Free Online`,
    description: `Play free ${name.toLowerCase()} games online.`,
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page: rawPage } = await searchParams;
  const page = Math.max(Number(rawPage) || 1, 1);

  const queryClient = getQueryClient();
  const [categories] = await Promise.all([
    queryClient.fetchQuery(categoriesQuery()),
    queryClient.prefetchQuery(gamesQuery({ category: slug, page })),
  ]);
  const name = categories.find((c) => c.slug === slug)?.name ?? slug;

  return (
    <main className="relative mx-auto max-w-6xl px-6 pb-6 pt-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-24 -z-10 h-72 bg-[radial-gradient(ellipse_at_top,rgb(217_70_239/0.14),transparent_65%)]"
      />
      <h1 className="mb-8 bg-gradient-to-b from-zinc-900 to-zinc-600 bg-clip-text pb-1 text-4xl font-bold tracking-tight text-transparent dark:from-white dark:to-zinc-400">
        {name} games
      </h1>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={null}>
          <GameBrowser basePath={`/category/${slug}`} category={slug} />
        </Suspense>
      </HydrationBoundary>
    </main>
  );
}
