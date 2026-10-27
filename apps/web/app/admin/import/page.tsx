import Link from "next/link";
import { requireAdmin } from "@/features/lib/auth";
import ImportForm from "@/features/components/ImportForm";

export const metadata = { title: "Import games", robots: { index: false } };

export default async function ImportPage() {
  await requireAdmin();

  return (
    <main className="mx-auto max-w-2xl p-6">
      <Link href="/admin" className="text-sm text-gray-500 hover:underline">
        Back to admin
      </Link>
      <h1 className="mb-2 mt-2 text-2xl font-bold">Import games</h1>
      <p className="mb-6 text-sm text-gray-600">
        Games are added as drafts. Review each one, rewrite its description,
        then publish it.
      </p>
      <ImportForm />
    </main>
  );
}
