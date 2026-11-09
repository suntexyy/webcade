import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
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
    <main className="mx-auto max-w-2xl animate-fade-up px-6 py-10">
      <Link
        href="/admin"
        className="group inline-flex items-center gap-1.5 rounded-sm text-sm text-zinc-500 transition-colors hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-zinc-400 dark:hover:text-white"
      >
        <ArrowLeft
          aria-hidden="true"
          className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5"
        />
        Back to admin
      </Link>
      <h1 className="mb-6 mt-3 text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
        Edit {game.title}
      </h1>
      <GameForm
        action={updateGame.bind(null, game.id)}
        categories={categories}
        game={game}
      />
    </main>
  );
}
