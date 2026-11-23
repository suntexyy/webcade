import Link from "next/link";
import { redirect } from "next/navigation";
import {
  AlertTriangle,
  Eye,
  EyeOff,
  FolderPlus,
  Gamepad2,
  DownloadCloud,
  LogOut,
  Pencil,
  Plus,
  Search,
  X,
} from "lucide-react";
import { requireAdmin } from "@/features/lib/auth";
import {
  adminFetch,
  apiError,
  type AdminGamesPage,
} from "@/features/lib/admin-api";
import { pageHref } from "@/features/lib/pagination";
import { logout } from "./actions";
import {
  addCategory,
  deleteGame,
  deleteCategory,
  togglePublished,
} from "./game-actions";
import DeleteButton from "@/features/components/DeleteButton";
import AdminPagination from "@/features/components/AdminPagination";
import { getQueryClient } from "@/features/lib/get-query-client";
import { categoriesQuery } from "@/features/lib/queries";

export const metadata = { title: "Admin", robots: { index: false } };

type Props = {
  searchParams: Promise<{ page?: string; q?: string; status?: string }>;
};

const ring =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-zinc-950";
const btnOutline = `inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 shadow-sm transition hover:bg-zinc-50 active:scale-[0.98] dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-200 dark:hover:bg-white/10 ${ring}`;
const btnPrimary = `inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 active:scale-[0.98] dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 ${ring}`;
const ghost = `inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium text-zinc-600 transition hover:bg-zinc-900/5 hover:text-zinc-900 active:scale-95 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white ${ring}`;
const field =
  "rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm transition placeholder:text-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-indigo-400";

export default async function AdminPage({ searchParams }: Props) {
  await requireAdmin();

  const sp = await searchParams;
  const page = Math.max(Number(sp.page) || 1, 1);
  const q = sp.q?.trim() || undefined;
  const status =
    sp.status === "published" || sp.status === "draft" ? sp.status : undefined;

  const qs = new URLSearchParams({ page: String(page) });
  if (q) qs.set("q", q);
  if (status) qs.set("status", status);

  const res = await adminFetch(`/admin/games?${qs}`);
  const data: AdminGamesPage | null = res.ok ? await res.json() : null;
  const error = res.ok ? null : await apiError(res);
  const games = data?.items ?? [];
  const categories = await getQueryClient().fetchQuery(categoriesQuery());

  // a page that no longer exists, for example after deleting the last game on it
  if (data && games.length === 0 && page > 1) {
    redirect(pageHref("/admin", { q, status }, data.totalPages));
  }

  return (
    <main className="relative mx-auto max-w-5xl animate-fade-up px-6 py-10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-16 -z-10 h-64 bg-[radial-gradient(ellipse_at_top,rgb(99_102_241/0.14),transparent_65%)]"
      />
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="bg-gradient-to-b from-zinc-900 to-zinc-600 bg-clip-text pb-1 text-3xl font-bold tracking-tight text-transparent dark:from-white dark:to-zinc-400">
          Admin
        </h1>
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/admin/import" className={btnOutline}>
            <DownloadCloud aria-hidden="true" className="h-4 w-4" />
            Import games
          </Link>
          <Link href="/admin/games/new" className={btnPrimary}>
            <Plus aria-hidden="true" className="h-4 w-4" />
            Add game
          </Link>
          <form action={logout}>
            <button className={btnOutline}>
              <LogOut aria-hidden="true" className="h-4 w-4" />
              Log out
            </button>
          </form>
        </div>
      </div>
      <form action="/admin" className="mb-5 flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
          />
          <input
            name="q"
            defaultValue={q}
            placeholder="Search by title..."
            aria-label="Search by title"
            className={`${field} w-64 pl-9`}
          />
        </div>
        <select
          name="status"
          defaultValue={status ?? ""}
          aria-label="Filter by status"
          className={field}
        >
          <option value="">All</option>
          <option value="published">Published</option>
          <option value="draft">Drafts</option>
        </select>
        <button className={btnOutline}>Filter</button>
        {(q || status) && (
          <Link
            href="/admin"
            className="inline-flex items-center gap-1 rounded-md px-2 py-2 text-sm text-zinc-500 transition hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-zinc-400 dark:hover:text-white"
          >
            <X aria-hidden="true" className="h-3.5 w-3.5" />
            Clear
          </Link>
        )}
      </form>
      {error && (
        <p
          role="alert"
          className="mb-4 flex items-start gap-2 rounded-xl border border-red-300/70 bg-red-50 p-3 text-sm text-red-800 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200"
        >
          <AlertTriangle
            aria-hidden="true"
            className="mt-0.5 h-4 w-4 shrink-0 text-red-600 dark:text-red-400"
          />
          API error: {error}
        </p>
      )}
      {data && (
        <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/60 px-3 py-1 text-sm text-zinc-600 backdrop-blur dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-400">
          <span className="font-semibold tabular-nums text-zinc-900 dark:text-white">
            {data.total}
          </span>
          games
        </p>
      )}
      <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white/70 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/[0.03] dark:shadow-none">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50/80 text-xs uppercase tracking-wider text-zinc-500 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-400">
            <tr>
              <th scope="col" className="px-4 py-3 font-medium">
                Title
              </th>
              <th
                scope="col"
                className="hidden px-4 py-3 font-medium md:table-cell"
              >
                Category
              </th>
              <th
                scope="col"
                className="hidden px-4 py-3 font-medium md:table-cell"
              >
                Plays
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Status
              </th>
              <th scope="col" className="px-4 py-3 text-right font-medium">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-white/10">
            {games.map((g) => (
              <tr
                key={g.id}
                className="transition-colors hover:bg-zinc-50/80 dark:hover:bg-white/[0.04]"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={g.thumbnail}
                      alt=""
                      loading="lazy"
                      className="h-9 w-14 shrink-0 rounded-md bg-zinc-100 object-cover ring-1 ring-black/5 dark:bg-white/5 dark:ring-white/10"
                    />
                    <div className="min-w-0">
                      <div className="truncate font-medium text-zinc-900 dark:text-zinc-100">
                        {g.title}
                      </div>
                      <div className="truncate font-mono text-xs text-zinc-500 dark:text-zinc-500">
                        {g.slug}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="hidden px-4 py-3 text-zinc-600 md:table-cell dark:text-zinc-400">
                  {g.category?.name ?? "None"}
                </td>
                <td className="hidden px-4 py-3 tabular-nums text-zinc-600 md:table-cell dark:text-zinc-400">
                  {g.plays}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${
                      g.published
                        ? "bg-emerald-500/10 text-emerald-700 ring-emerald-500/25 dark:text-emerald-300"
                        : "bg-amber-500/10 text-amber-700 ring-amber-500/25 dark:text-amber-300"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`h-1.5 w-1.5 rounded-full ${
                        g.published ? "bg-emerald-500" : "bg-amber-500"
                      }`}
                    />
                    {g.published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/admin/games/${g.id}`} className={ghost}>
                      <Pencil aria-hidden="true" className="h-3.5 w-3.5" />
                      Edit
                    </Link>
                    <form
                      action={togglePublished.bind(null, g.id, !g.published)}
                    >
                      <button className={ghost}>
                        {g.published ? (
                          <EyeOff aria-hidden="true" className="h-3.5 w-3.5" />
                        ) : (
                          <Eye aria-hidden="true" className="h-3.5 w-3.5" />
                        )}
                        {g.published ? "Unpublish" : "Publish"}
                      </button>
                    </form>
                    <form action={deleteGame.bind(null, g.id)}>
                      <DeleteButton />
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {games.length === 0 && !error && (
              <tr>
                <td colSpan={5} className="px-4 py-16">
                  <div className="flex flex-col items-center gap-3 text-center">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 dark:bg-white/5 dark:text-zinc-400">
                      <Gamepad2 aria-hidden="true" className="h-5 w-5" />
                    </span>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      No games found.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {data && (
        <AdminPagination
          page={data.page}
          totalPages={data.totalPages}
          query={{ q, status }}
        />
      )}

      <section
        aria-labelledby="categories-heading"
        className="mt-10 max-w-2xl rounded-2xl border border-zinc-200 bg-white/70 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/[0.03] dark:shadow-none"
      >
        <h2
          id="categories-heading"
          className="mb-4 text-lg font-semibold tracking-tight text-zinc-900 dark:text-white"
        >
          Categories
        </h2>

        <ul className="mb-5 flex flex-wrap gap-2">
          {categories.map((c) => (
            <li
              key={c.id}
              className="flex items-center gap-1 rounded-full border border-zinc-200 bg-white py-0.5 pl-3 pr-1 text-sm dark:border-white/10 dark:bg-white/[0.04]"
            >
              <span className="text-zinc-700 dark:text-zinc-300">{c.name}</span>
              <form action={deleteCategory.bind(null, c.id)}>
                <DeleteButton
                  iconOnly
                  label={`Delete category ${c.name}`}
                  message={`Delete the category "${c.name}"? Its games stay on the site but lose their category.`}
                />
              </form>
            </li>
          ))}
          {categories.length === 0 && (
            <li className="text-sm text-zinc-500 dark:text-zinc-400">
              No categories yet.
            </li>
          )}
        </ul>

        <form
          action={addCategory}
          className="flex flex-wrap items-center gap-2"
        >
          <input
            name="name"
            placeholder="New category name"
            aria-label="New category name"
            required
            className={`${field} min-w-0 flex-1`}
          />
          <button className={btnOutline}>Add category</button>
        </form>
      </section>
    </main>
  );
}
