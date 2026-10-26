import type { MetadataRoute } from "next";
import { getCategories, getGames } from "@/lib/api";

export const dynamic = "force-dynamic";

const SITE = process.env.SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [games, categories] = await Promise.all([getGames(), getCategories()]);

  return [
    { url: SITE, changeFrequency: "daily", priority: 1 },
    ...categories.map((c) => ({
      url: `${SITE}/category/${c.slug}`,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
    ...games.map((g) => ({
      url: `${SITE}/game/${g.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
