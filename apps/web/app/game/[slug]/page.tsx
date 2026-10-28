import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import PlayTracker from "@/features/components/PlayTracker";
import RelatedGames from "@/features/components/RelatedGames";
import { getQueryClient } from "@/features/lib/get-query-client";
import { gameQuery, gamesQuery } from "@/features/lib/queries";

const SITE = process.env.SITE_URL ?? "http://localhost:3000";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const game = await getQueryClient().fetchQuery(gameQuery(slug));
  if (!game) return { title: "Game not found" };

  const description = game.description.slice(0, 160);
  return {
    title: `${game.title} - Play Free Online`,
    description,
    alternates: { canonical: `${SITE}/game/${game.slug}` },
    openGraph: {
      title: game.title,
      description,
      images: [game.thumbnail],
    },
  };
}

export default async function GamePage({ params }: Props) {
  const { slug } = await params;
  const queryClient = getQueryClient();

  const game = await queryClient.fetchQuery(gameQuery(slug));
  if (!game) notFound();

  if (game.category) {
    await queryClient.prefetchQuery(
      gamesQuery({ category: game.category.slug, limit: 9 }),
    );
  }

  // size the player to the game's own proportions, but never taller than 80% of the screen
  const ratio =
    game.width > 0 && game.height > 0 ? game.width / game.height : 4 / 3;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    name: game.title,
    description: game.description,
    image: game.thumbnail,
    url: `${SITE}/game/${game.slug}`,
    applicationCategory: "Game",
    genre: game.category?.name,
    playMode: "SinglePlayer",
    operatingSystem: "Any",
  };

  return (
    <main className="relative mx-auto max-w-6xl px-6 pb-6 pt-12">
      <PlayTracker slug={game.slug} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-24 -z-10 h-80 bg-[radial-gradient(ellipse_at_top,rgb(99_102_241/0.18),transparent_65%)]"
      />

      <header className="mb-8 max-w-3xl">
        {game.category && (
          <span className="mb-3 inline-flex items-center rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-xs font-medium text-indigo-700 dark:text-indigo-300">
            {game.category.name}
          </span>
        )}
        <h1 className="bg-gradient-to-b from-zinc-900 to-zinc-600 bg-clip-text pb-1 text-4xl font-bold tracking-tight text-transparent dark:from-white dark:to-zinc-400">
          {game.title}
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          {game.plays.toLocaleString()} plays
        </p>
      </header>

      <div
        className="mx-auto mb-8 w-full overflow-hidden rounded-xl border bg-black shadow-lg"
        style={{
          aspectRatio: ratio,
          maxWidth: `min(100%, calc(80vh * ${ratio}))`,
        }}
      >
        <iframe
          src={game.embedUrl}
          title={game.title}
          className="h-full w-full"
          allow="autoplay; fullscreen; gamepad"
          allowFullScreen
          sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms allow-modals allow-pointer-lock allow-top-navigation-by-user-activation"
        />
      </div>

      <section className="max-w-3xl">
        <h2 className="mb-2 text-lg font-semibold">About {game.title}</h2>
        <p className="leading-relaxed text-zinc-600 dark:text-zinc-400">
          {game.description}
        </p>
      </section>

      {game.category && (
        <HydrationBoundary state={dehydrate(queryClient)}>
          <RelatedGames
            categorySlug={game.category.slug}
            categoryName={game.category.name}
            currentId={game.id}
          />
        </HydrationBoundary>
      )}
    </main>
  );
}
