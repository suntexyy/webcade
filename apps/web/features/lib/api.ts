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

export async function getGames(
  params: { category?: string; q?: string } = {},
): Promise<Game[]> {
  const qs = new URLSearchParams();
  if (params.category) qs.set("category", params.category);
  if (params.q) qs.set("q", params.q);
  const query = qs.toString();
  return (await get<Game[]>(`/games${query ? `?${query}` : ""}`)) ?? [];
}

export async function getGame(slug: string): Promise<Game | null> {
  return get<Game>(`/games/${slug}`);
}

export async function getCategories(): Promise<Category[]> {
  return (await get<Category[]>("/categories")) ?? [];
}
