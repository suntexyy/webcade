import { redirect } from "next/navigation";
import { isAdmin } from "@/features/lib/auth";
import LoginForm from "@/features/components/LoginForm";

export const metadata = { title: "Admin login", robots: { index: false } };

export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin");
  return <LoginForm />;
}
