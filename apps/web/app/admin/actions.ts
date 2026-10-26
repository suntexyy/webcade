"use server";

import { redirect } from "next/navigation";
import {
  checkCredentials,
  createSession,
  destroySession,
} from "@/features/lib/auth";

export async function login(_prev: string | undefined, formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!(await checkCredentials(email, password)))
    return "Wrong email or password";

  await createSession();
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}
