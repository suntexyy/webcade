import Link from "next/link";
import { requireAdmin } from "@/features/lib/auth";
import { adminFetch, apiError, type AdminGame } from "@/features/lib/admin-api";
import { logout } from "./actions";
import { addCategory, deleteGame, togglePublished } from "./game-actions";
import DeleteButton from "@/features/components/DeleteButton";

export const metadata = { title: "Admin", robots: { index: false } };

export default async function AdminPage() {
  await requireAdmin();

  const res = await adminFetch("/admin/games");
  const games: AdminGame[] = res.ok ? await res.json() : [];
  const error = res.ok ? null : await apiError(res);

  return (
    <main className="mx-auto max-w-5xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin</h1>
        <div className="flex items-center gap-3">
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

      {error && (
        <p className="mb-4 rounded border border-red-300 p-3 text-sm text-red-700">
          API error: {error}
        </p>
      )}

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
                  No games yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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
