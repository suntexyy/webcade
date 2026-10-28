export function pageHref(
  basePath: string,
  query: Record<string, string | undefined>,
  page: number,
) {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(query)) if (v) p.set(k, v);
  if (page > 1) p.set("page", String(page));
  const qs = p.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

export function pageList(page: number, total: number) {
  const nums = [
    ...new Set([1, total, page - 2, page - 1, page, page + 1, page + 2]),
  ]
    .filter((n) => n >= 1 && n <= total)
    .sort((a, b) => a - b);

  const out: (number | "gap")[] = [];
  nums.forEach((n, i) => {
    if (i > 0 && n - nums[i - 1] > 1) out.push("gap");
    out.push(n);
  });
  return out;
}
