import { redirect } from "next/navigation";
import { isAdmin } from "@/features/lib/auth";
import LoginForm from "@/features/components/LoginForm";

export const metadata = { title: "Admin login", robots: { index: false } };

// Logic-only page: all visual work for the login screen lives in LoginForm.
export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin");
  return <LoginForm />;
}
