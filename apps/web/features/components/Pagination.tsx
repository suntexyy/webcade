"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  page: number;
  totalPages: number;
  basePath: string;
  query?: Record<string, string | undefined>;
};

function href(basePath: string, query: Props["query"], page: number) {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(query ?? {})) if (v) p.set(k, v);
  if (page > 1) p.set("page", String(page));
  const qs = p.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

function pageList(page: number, total: number) {
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

function go(e: React.MouseEvent<HTMLAnchorElement>, target: string) {
  // let ctrl/cmd/middle clicks open a new tab as usual
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0)
    return;
  e.preventDefault();
  window.history.pushState(null, "", target);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export default function Pagination({
  page,
  totalPages,
  basePath,
  query,
}: Props) {
  if (totalPages <= 1) return null;

  const base =
    "inline-flex h-9 min-w-9 items-center justify-center gap-1 rounded-lg border px-3 text-sm font-medium tabular-nums transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white active:scale-95 dark:focus-visible:ring-offset-zinc-950";
  const idle =
    "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-300 dark:hover:bg-white/10";
  const active =
    "border-transparent bg-gradient-to-b from-zinc-800 to-zinc-950 text-white shadow-md dark:from-white dark:to-zinc-200 dark:text-zinc-900";

  return (
    <nav
      aria-label="Pagination"
      className="mt-10 flex flex-wrap items-center justify-center gap-2"
    >
      {page > 1 && (
        <a
          href={href(basePath, query, page - 1)}
          onClick={(e) => go(e, href(basePath, query, page - 1))}
          className={`${base} ${idle}`}
        >
          <ChevronLeft aria-hidden="true" className="h-4 w-4" />
          Previous
        </a>
      )}

      {pageList(page, totalPages).map((n, i) =>
        n === "gap" ? (
          <span
            key={`gap-${i}`}
            aria-hidden="true"
            className="px-1 text-zinc-400 dark:text-zinc-600"
          >
            …
          </span>
        ) : (
          <a
            key={n}
            href={href(basePath, query, n)}
            onClick={(e) => go(e, href(basePath, query, n))}
            aria-current={n === page ? "page" : undefined}
            className={`${base} ${n === page ? active : idle}`}
          >
            {n}
          </a>
        ),
      )}

      {page < totalPages && (
        <a
          href={href(basePath, query, page + 1)}
          onClick={(e) => go(e, href(basePath, query, page + 1))}
          className={`${base} ${idle}`}
        >
          Next
          <ChevronRight aria-hidden="true" className="h-4 w-4" />
        </a>
      )}
    </nav>
  );
}
