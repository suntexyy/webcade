import Link from "next/link";
import { requireAdmin } from "@/features/lib/auth";
import { getCategories } from "@/features/lib/api";
import GameForm from "@/features/components/GameForm";
import { createGame } from "../../game-actions";

export const metadata = { title: "Add game", robots: { index: false } };

export default async function NewGamePage() {
  await requireAdmin();
  const categories = await getCategories();

  return (
    <main className="mx-auto max-w-2xl p-6">
      <Link href="/admin" className="text-sm text-gray-500 hover:underline">
        Back to admin
      </Link>
      <h1 className="mb-6 mt-2 text-2xl font-bold">Add game</h1>
      <GameForm action={createGame} categories={categories} />
    </main>
  );
}
