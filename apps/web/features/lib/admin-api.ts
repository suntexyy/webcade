import type { Category } from "./api";

export type AdminGame = {
  id: number;
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  embedUrl: string;
  width: number;
  height: number;
  plays: number;
  published: boolean;
  category: Category | null;
  categoryId: number | null;
};

export type AdminGamesPage = {
  items: AdminGame[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

const BASE = process.env.API_URL ?? "http://localhost:4000";

export function adminFetch(path: string, init: RequestInit = {}) {
  const base = BASE.endsWith("/") ? BASE : `${BASE}/`;
  return fetch(new URL(path.replace(/^\//, ""), base), {
    ...init,
    cache: "no-store",
    headers: {
      "content-type": "application/json",
      "x-admin-key": process.env.ADMIN_API_KEY ?? "",
      ...init.headers,
    },
  });
}

export async function apiError(res: Response) {
  try {
    const body = await res.json();
    const m = body?.message;
    return Array.isArray(m)
      ? m.join(", ")
      : (m ?? `Request failed (${res.status})`);
  } catch {
    return `Request failed (${res.status})`;
  }
}
