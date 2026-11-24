import type { NextRequest } from "next/server";

const BASE = (process.env.API_URL ?? "http://localhost:4000").replace(
  /\/$/,
  "",
);

// only these public, read-only API paths can be reached through the proxy
const ALLOWED = [/^games$/, /^games\/[a-z0-9-]+$/i, /^categories$/];
const PARAMS = ["category", "q", "page", "limit"];

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> },
) {
  const { path } = await ctx.params;
  const joined = path.join("/");

  if (!ALLOWED.some((re) => re.test(joined))) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const target = new URL(`${BASE}/${joined}`);
  for (const key of PARAMS) {
    const value = req.nextUrl.searchParams.get(key);
    if (value) target.searchParams.set(key, value);
  }

  try {
    const res = await fetch(target, { cache: "no-store" });
    const body = await res.text();
    return new Response(body, {
      status: res.status,
      headers: {
        "content-type": "application/json",
        ...(res.ok && {
          "cache-control": "public, s-maxage=60, stale-while-revalidate=300",
        }),
      },
    });
  } catch {
    return Response.json({ error: "API unavailable" }, { status: 502 });
  }
}
