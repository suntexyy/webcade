export type Category = { id: number; name: string; slug: string; items: [] };

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

export type GameCard = Pick<
  Game,
  "id" | "slug" | "title" | "thumbnail" | "category"
>;

export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

type Params = Record<string, string | number | undefined>;

// Server: calls the NestJS API directly. Browser: goes through our own /api proxy.
export async function apiFetch<T>(
  path: string,
  params: Params = {},
): Promise<T | null> {
  const isServer = typeof window === "undefined";
  const clean = path.replace(/^\//, "");

  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params))
    if (v !== undefined && v !== "") qs.set(k, String(v));
  const query = qs.toString();

  const base = isServer
    ? (process.env.API_URL ?? "http://localhost:4000").replace(/\/$/, "")
    : "/api";
  const res = await fetch(
    `${base}/${clean}${query ? `?${query}` : ""}`,
    isServer ? { cache: "no-store" } : undefined,
  );

  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Request failed (${res.status})`);

  const text = await res.text(); // NestJS answers with an empty body when a game does not exist
  return text ? (JSON.parse(text) as T) : null;
}
