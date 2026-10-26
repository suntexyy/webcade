import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/features/lib/auth";
import { getCategories } from "@/features/lib/api";
import { adminFetch, type AdminGame } from "@/features/lib/admin-api";
import GameForm from "@/features/components/GameForm";
import { updateGame } from "../../game-actions";

export const metadata = { title: "Edit game", robots: { index: false } };

type Props = { params: Promise<{ id: string }> };

export default async function EditGamePage({ params }: Props) {
  await requireAdmin();
  const { id } = await params;

  const res = await adminFetch("/admin/games");
  const games: AdminGame[] = res.ok ? await res.json() : [];
  const game = games.find((g) => g.id === Number(id));
  if (!game) notFound();

  const categories = await getCategories();

  return (
    <main className="mx-auto max-w-2xl p-6">
      <Link href="/admin" className="text-sm text-gray-500 hover:underline">
        Back to admin
      </Link>
      <h1 className="mb-6 mt-2 text-2xl font-bold">Edit {game.title}</h1>
      <GameForm
        action={updateGame.bind(null, game.id)}
        categories={categories}
        game={game}
      />
    </main>
  );
}
