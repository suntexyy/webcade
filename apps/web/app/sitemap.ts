import type { MetadataRoute } from "next";
import { QueryClient } from "@tanstack/react-query";
import { categoriesQuery, slugsQuery } from "@/features/lib/queries";

export const dynamic = "force-dynamic";

const SITE = process.env.SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const queryClient = new QueryClient();
  const [slugs, categories] = await Promise.all([
    queryClient.fetchQuery(slugsQuery()),
    queryClient.fetchQuery(categoriesQuery()),
  ]);

  return [
    { url: SITE, changeFrequency: "daily", priority: 1 },
    ...categories.map((c) => ({
      url: `${SITE}/category/${c.slug}`,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
    ...slugs.map((g) => ({
      url: `${SITE}/game/${g.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
