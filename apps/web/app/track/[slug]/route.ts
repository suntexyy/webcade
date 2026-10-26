const BASE = process.env.API_URL ?? "http://localhost:4000";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const base = BASE.endsWith("/") ? BASE : `${BASE}/`;

  try {
    await fetch(new URL(`games/${slug}/play`, base), {
      method: "POST",
      cache: "no-store",
    });
  } catch {
    // counting plays is best effort
  }
  return new Response(null, { status: 204 });
}
