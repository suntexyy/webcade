import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/features/lib/auth";
import { adminFetch, type AdminGame } from "@/features/lib/admin-api";
import { getQueryClient } from "@/features/lib/get-query-client";
import { categoriesQuery } from "@/features/lib/queries";
import GameForm from "@/features/components/GameForm";
import { updateGame } from "../../game-actions";

export const metadata = { title: "Edit game", robots: { index: false } };

type Props = { params: Promise<{ id: string }> };

export default async function EditGamePage({ params }: Props) {
  await requireAdmin();
  const { id } = await params;

  const numericId = Number(id);
  if (!Number.isInteger(numericId)) notFound();

  const res = await adminFetch(`/admin/games/${numericId}`);
  const text = res.ok ? await res.text() : "";
  const game: AdminGame | null = text ? JSON.parse(text) : null;
  if (!game) notFound();

  const categories = await getQueryClient().fetchQuery(categoriesQuery());

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
