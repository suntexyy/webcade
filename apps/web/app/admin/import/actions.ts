"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/features/lib/auth";
import { adminFetch, apiError } from "@/features/lib/admin-api";

export async function importFeed(_prev: string | undefined, fd: FormData) {
  await requireAdmin();
  const feedUrl = String(fd.get("feedUrl") ?? "").trim();

  const res = await adminFetch("/admin/import/gamemonetize", {
    method: "POST",
    body: JSON.stringify({ feedUrl }),
  });
  if (!res.ok) return `Error: ${await apiError(res)}`;

  const r = (await res.json()) as {
    fetched: number;
    created: number;
    skipped: number;
  };
  revalidatePath("/admin");
  return `Fetched ${r.fetched}, added ${r.created} drafts, skipped ${r.skipped} (already imported or invalid).`;
}
