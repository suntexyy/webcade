import Link from "next/link";
import { pageHref, pageList } from "@/features/lib/pagination";

type Props = {
  page: number;
  totalPages: number;
  query: Record<string, string | undefined>;
};

export default function AdminPagination({ page, totalPages, query }: Props) {
  if (totalPages <= 1) return null;
  const base = "rounded border px-3 py-1 text-sm";
  const to = (n: number) => pageHref("/admin", query, n);

  return (
    <nav
      aria-label="Pagination"
      className="mt-6 flex flex-wrap items-center justify-center gap-2"
    >
      {page > 1 && (
        <Link href={to(page - 1)} className={`${base} hover:bg-gray-100`}>
          Previous
        </Link>
      )}
      {pageList(page, totalPages).map((n, i) =>
        n === "gap" ? (
          <span key={`gap-${i}`} className="px-1 text-gray-400">
            …
          </span>
        ) : (
          <Link
            key={n}
            href={to(n)}
            aria-current={n === page ? "page" : undefined}
            className={`${base} ${n === page ? "bg-black text-white" : "hover:bg-gray-100"}`}
          >
            {n}
          </Link>
        ),
      )}
      {page < totalPages && (
        <Link href={to(page + 1)} className={`${base} hover:bg-gray-100`}>
          Next
        </Link>
      )}
    </nav>
  );
}
