import Link from "next/link";
import { getGames } from "@/features/lib/api";

export default async function Home() {
  const games = await getGames();

  return (
    <main className="mx-auto max-w-6xl p-6">
      <h1 className="mb-6 text-3xl font-bold">Play free games online</h1>

      {games.length === 0 ? (
        <p className="text-gray-500">No games yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {games.map((g) => (
            <Link
              key={g.id}
              href={`/game/${g.slug}`}
              className="overflow-hidden rounded-lg border transition hover:shadow-md"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={g.thumbnail}
                alt={g.title}
                className="aspect-video w-full object-cover"
              />
              <div className="p-2">
                <div className="text-sm font-medium">{g.title}</div>
                {g.category && (
                  <div className="text-xs text-gray-500">{g.category.name}</div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
