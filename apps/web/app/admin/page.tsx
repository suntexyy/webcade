import { logout } from "./actions";
import { requireAdmin } from "@/features/lib/auth";

export const metadata = { title: "Admin", robots: { index: false } };

export default async function AdminPage() {
  await requireAdmin();

  return (
    <main className="mx-auto max-w-4xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin</h1>
        <form action={logout}>
          <button className="rounded border px-3 py-1 text-sm">Log out</button>
        </form>
      </div>
      <p>You are logged in. The game manager comes next.</p>
    </main>
  );
}
