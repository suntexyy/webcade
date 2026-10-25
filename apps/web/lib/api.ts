export type Category = { id: number; name: string; slug: string };

export type Game = {
  id: number;
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  embedUrl: string;
  width: number;
  height: number;
  plays: number;
  category: Category | null;
};

const BASE = process.env.API_URL ?? "http://localhost:4000";

function url(path: string) {
  const base = BASE.endsWith("/") ? BASE : `${BASE}/`;
  return new URL(path.replace(/^\//, ""), base);
}

async function get<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(url(path), { cache: "no-store" });
    if (!res.ok) return null;
    const text = await res.text();
    return text ? (JSON.parse(text) as T) : null;
  } catch {
    return null;
  }
}

export async function getGames(): Promise<Game[]> {
  return (await get<Game[]>("/games")) ?? [];
}

export async function getGame(slug: string): Promise<Game | null> {
  return get<Game>(`/games/${slug}`);
}
