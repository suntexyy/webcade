import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";

const COOKIE = "admin_session";
const secret = () => new TextEncoder().encode(process.env.SESSION_SECRET ?? "");

let cachedDummyHash: string | undefined;
const dummyHash = () =>
  (cachedDummyHash ??= bcrypt.hashSync("not-the-password", 12));

export async function checkCredentials(email: string, password: string) {
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (!adminEmail || !hash) return false;

  const emailOk = email.trim().toLowerCase() === adminEmail;
  // Always run a bcrypt comparison so a wrong email takes as long as a wrong password
  const passwordOk = await bcrypt.compare(
    password,
    emailOk ? hash : dummyHash(),
  );

  return emailOk && passwordOk;
}
export async function createSession() {
  const token = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(secret());

  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function destroySession() {
  (await cookies()).delete(COOKIE);
}

export async function isAdmin() {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token || !process.env.SESSION_SECRET) return false;
  try {
    await jwtVerify(token, secret());
    return true;
  } catch {
    return false;
  }
}

export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}
