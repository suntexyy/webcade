import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { pageHref, pageList } from "@/features/lib/pagination";

type Props = {
  page: number;
  totalPages: number;
  query: Record<string, string | undefined>;
};

export default function AdminPagination({ page, totalPages, query }: Props) {
  if (totalPages <= 1) return null;

  const base =
    "inline-flex h-9 min-w-9 items-center justify-center gap-1 rounded-lg border px-3 text-sm font-medium tabular-nums transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white active:scale-95 dark:focus-visible:ring-offset-zinc-950";
  const idle =
    "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-300 dark:hover:bg-white/10";
  const active =
    "border-transparent bg-gradient-to-b from-zinc-800 to-zinc-950 text-white shadow-md dark:from-white dark:to-zinc-200 dark:text-zinc-900";

  const to = (n: number) => pageHref("/admin", query, n);

  return (
    <nav
      aria-label="Pagination"
      className="mt-8 flex flex-wrap items-center justify-center gap-2"
    >
      {page > 1 && (
        <Link href={to(page - 1)} className={`${base} ${idle}`}>
          <ChevronLeft aria-hidden="true" className="h-4 w-4" />
          Previous
        </Link>
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
          <Link
            key={n}
            href={to(n)}
            aria-current={n === page ? "page" : undefined}
            className={`${base} ${n === page ? active : idle}`}
          >
            {n}
          </Link>
        ),
      )}
      {page < totalPages && (
        <Link href={to(page + 1)} className={`${base} ${idle}`}>
          Next
          <ChevronRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      )}
    </nav>
  );
}
