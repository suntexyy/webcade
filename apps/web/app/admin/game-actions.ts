"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/features/lib/auth";
import { adminFetch, apiError } from "@/features/lib/admin-api";

function payload(fd: FormData) {
  const str = (k: string) => String(fd.get(k) ?? "").trim();
  const slug = str("slug");
  const category = str("categoryId");
  return {
    title: str("title"),
    ...(slug && { slug }),
    description: str("description"),
    thumbnail: str("thumbnail"),
    embedUrl: str("embedUrl"),
    width: Number(str("width") || 800),
    height: Number(str("height") || 600),
    categoryId: category ? Number(category) : null,
    published: fd.get("published") === "on",
  };
}

export async function createGame(_prev: string | undefined, fd: FormData) {
  await requireAdmin();
  const res = await adminFetch("/admin/games", {
    method: "POST",
    body: JSON.stringify(payload(fd)),
  });
  if (!res.ok) return apiError(res);
  revalidatePath("/admin");
  redirect("/admin");
}

export async function updateGame(
  id: number,
  _prev: string | undefined,
  fd: FormData,
) {
  await requireAdmin();
  const res = await adminFetch(`/admin/games/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload(fd)),
  });
  if (!res.ok) return apiError(res);
  revalidatePath("/admin");
  redirect("/admin");
}

export async function togglePublished(id: number, next: boolean) {
  await requireAdmin();
  await adminFetch(`/admin/games/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ published: next }),
  });
  revalidatePath("/admin");
}

export async function deleteGame(id: number) {
  await requireAdmin();
  await adminFetch(`/admin/games/${id}`, { method: "DELETE" });
  revalidatePath("/admin");
}

export async function addCategory(fd: FormData) {
  await requireAdmin();
  const name = String(fd.get("name") ?? "").trim();
  if (!name) return;
  await adminFetch("/admin/categories", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
  revalidatePath("/admin");
}
