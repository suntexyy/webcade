import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireAdmin } from "@/features/lib/auth";
import ImportForm from "@/features/components/SearchBox";

export const metadata = { title: "Import games", robots: { index: false } };

export default async function ImportPage() {
  await requireAdmin();

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
      <h1 className="mb-2 mt-3 text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
        Import games
      </h1>
      <p className="mb-6 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        Games are added as drafts. Review each one, rewrite its description,
        then publish it.
      </p>
      <ImportForm />
    </main>
  );
}
