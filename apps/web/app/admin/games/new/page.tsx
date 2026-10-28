import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireAdmin } from "@/features/lib/auth";
import GameForm from "@/features/components/GameForm";
import { createGame } from "../../game-actions";
import { getQueryClient } from "@/features/lib/get-query-client";
import { categoriesQuery } from "@/features/lib/queries";

export const metadata = { title: "Add game", robots: { index: false } };

export default async function NewGamePage() {
  await requireAdmin();
  const categories = await getQueryClient().fetchQuery(categoriesQuery());

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
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
        Add game
      </h1>
      <GameForm action={createGame} categories={categories} />
    </main>
  );
}
