"use client";

import { useActionState } from "react";
import { login } from "@/app/admin/actions";

export default function LoginForm() {
  const [error, action, pending] = useActionState(login, undefined);

  return (
    <form
      action={action}
      className="mx-auto mt-24 max-w-sm space-y-4 rounded-lg border p-6"
    >
      <h1 className="text-xl font-bold">Admin login</h1>
      <input
        type="email"
        name="email"
        placeholder="Email"
        autoComplete="username"
        required
        className="w-full rounded border px-3 py-2"
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        autoComplete="current-password"
        required
        className="w-full rounded border px-3 py-2"
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded bg-black px-3 py-2 text-white disabled:opacity-50"
      >
        {pending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
