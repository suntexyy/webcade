import Link from "next/link";
import type { Game } from "@/features/lib/api";

export default function GameGrid({ games }: { games: Game[] }) {
  if (games.length === 0)
    return <p className="text-gray-500">No games found.</p>;

  return (
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
  );
}
