import type { Metadata } from "next";
import { notFound } from "next/navigation";
import GameGrid from "@/features/components/GameGrid";
import PlayTracker from "@/features/components/PlayTracker";
import { getGame, getGames } from "@/features/lib/api";

const SITE = process.env.SITE_URL ?? "http://localhost:3000";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const game = await getGame(slug);
  if (!game) return { title: "Game not found" };
  return {
    title: `${game.title} - Play Free Online`,
    description: game.description,
    alternates: { canonical: `${SITE}/game/${game.slug}` },
    openGraph: {
      title: game.title,
      description: game.description,
      images: [game.thumbnail],
    },
  };
}

export default async function GamePage({ params }: Props) {
  const { slug } = await params;
  const game = await getGame(slug);
  if (!game) notFound();

  const related = game.category
    ? (await getGames({ category: game.category.slug }))
        .filter((g) => g.id !== game.id)
        .slice(0, 8)
    : [];

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
    <main className="mx-auto max-w-4xl p-6">
      <PlayTracker slug={game.slug} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <h1 className="mb-1 text-2xl font-bold">{game.title}</h1>
      <p className="mb-4 text-sm text-gray-500">
        {game.category?.name ?? "Game"} · {game.plays.toLocaleString()} plays
      </p>

      <div className="aspect-video w-full overflow-hidden rounded-lg border bg-black">
        <iframe
          src={game.embedUrl}
          title={game.title}
          className="h-full w-full"
          allowFullScreen
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        />
      </div>

      <p className="mt-4 text-gray-700">{game.description}</p>

      {related.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-xl font-semibold">
            More {game.category?.name} games
          </h2>
          <GameGrid games={related} />
        </section>
      )}
    </main>
  );
}
