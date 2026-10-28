import { queryOptions } from "@tanstack/react-query";
import {
  apiFetch,
  type Category,
  type Game,
  type GameCard,
  type Paginated,
} from "./api";

export type GamesParams = {
  category?: string;
  q?: string;
  page?: number;
  limit?: number;
};

export const gamesQuery = ({ category, q, page, limit }: GamesParams = {}) =>
  queryOptions({
    queryKey: [
      "games",
      "list",
      {
        category: category ?? null,
        q: q ?? null,
        page: page ?? 1,
        limit: limit ?? 30,
      },
    ] as const,
    queryFn: async () =>
      (await apiFetch<Paginated<GameCard>>("games", {
        category,
        q,
        page: page && page > 1 ? page : undefined,
        limit: limit && limit !== 30 ? limit : undefined,
      })) ?? {
        items: [],
        total: 0,
        page: page ?? 1,
        pageSize: limit ?? 30,
        totalPages: 1,
      },
  });

export const gameQuery = (slug: string) =>
  queryOptions({
    queryKey: ["games", "detail", slug] as const,
    queryFn: () => apiFetch<Game>(`games/${encodeURIComponent(slug)}`), // null when not found
  });

export const categoriesQuery = () =>
  queryOptions({
    queryKey: ["categories"] as const,
    queryFn: async () => (await apiFetch<Category[]>("categories")) ?? [],
    staleTime: 5 * 60_000,
  });

export const slugsQuery = () =>
  queryOptions({
    queryKey: ["games", "slugs"] as const,
    queryFn: async () =>
      (await apiFetch<{ slug: string }[]>("games/slugs")) ?? [],
  });
