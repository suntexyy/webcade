import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getGame } from "@/lib/api";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const game = await getGame(slug);
  if (!game) return { title: "Game not found" };
  return {
    title: `${game.title} - Play Free Online`,
    description: game.description,
  };
}

export default async function GamePage({ params }: Props) {
  const { slug } = await params;
  const game = await getGame(slug);
  if (!game) notFound();

  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="mb-4 text-2xl font-bold">{game.title}</h1>

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
    </main>
  );
}
