import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/features/lib/auth";
import {
  adminFetch,
  apiError,
  type AdminGamesPage,
} from "@/features/lib/admin-api";
import { pageHref } from "@/features/lib/pagination";
import { logout } from "./actions";
import { addCategory, deleteGame, togglePublished } from "./game-actions";
import DeleteButton from "@/features/components/DeleteButton";
import AdminPagination from "@/features/components/AdminPagination";

export const metadata = { title: "Admin", robots: { index: false } };

type Props = {
  searchParams: Promise<{ page?: string; q?: string; status?: string }>;
};

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

  // a page that no longer exists, for example after deleting the last game on it
  if (data && games.length === 0 && page > 1) {
    redirect(pageHref("/admin", { q, status }, data.totalPages));
  }

  return (
    <main className="mx-auto max-w-5xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin</h1>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/import"
            className="rounded border px-3 py-1 text-sm"
          >
            Import games
          </Link>
          <Link
            href="/admin/games/new"
            className="rounded bg-black px-3 py-1 text-sm text-white"
          >
            Add game
          </Link>
          <form action={logout}>
            <button className="rounded border px-3 py-1 text-sm">
              Log out
            </button>
          </form>
        </div>
      </div>

      <form action="/admin" className="mb-4 flex flex-wrap gap-2">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search by title..."
          className="w-64 rounded border px-3 py-2 text-sm"
        />
        <select
          name="status"
          defaultValue={status ?? ""}
          className="rounded border px-3 py-2 text-sm"
        >
          <option value="">All</option>
          <option value="published">Published</option>
          <option value="draft">Drafts</option>
        </select>
        <button className="rounded border px-3 py-2 text-sm">Filter</button>
        {(q || status) && (
          <Link
            href="/admin"
            className="px-2 py-2 text-sm text-gray-500 hover:underline"
          >
            Clear
          </Link>
        )}
      </form>

      {error && (
        <p className="mb-4 rounded border border-red-300 p-3 text-sm text-red-700">
          API error: {error}
        </p>
      )}
      {data && <p className="mb-3 text-sm text-gray-500">{data.total} games</p>}

      <div className="overflow-x-auto rounded border">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50 text-gray-600">
            <tr>
              <th className="p-3">Title</th>
              <th className="p-3">Category</th>
              <th className="p-3">Plays</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {games.map((g) => (
              <tr key={g.id} className="border-b last:border-0">
                <td className="p-3 font-medium">{g.title}</td>
                <td className="p-3">{g.category?.name ?? "None"}</td>
                <td className="p-3">{g.plays}</td>
                <td className="p-3">{g.published ? "Published" : "Draft"}</td>
                <td className="flex items-center gap-4 p-3">
                  <Link
                    href={`/admin/games/${g.id}`}
                    className="hover:underline"
                  >
                    Edit
                  </Link>
                  <form action={togglePublished.bind(null, g.id, !g.published)}>
                    <button className="hover:underline">
                      {g.published ? "Unpublish" : "Publish"}
                    </button>
                  </form>
                  <form action={deleteGame.bind(null, g.id)}>
                    <DeleteButton />
                  </form>
                </td>
              </tr>
            ))}
            {games.length === 0 && !error && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-500">
                  No games found.
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

      <form action={addCategory} className="mt-8 flex max-w-sm gap-2">
        <input
          name="name"
          placeholder="New category name"
          required
          className="flex-1 rounded border px-3 py-2"
        />
        <button className="rounded border px-3 py-2 text-sm">
          Add category
        </button>
      </form>
    </main>
  );
}
