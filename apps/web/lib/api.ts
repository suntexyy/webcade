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
