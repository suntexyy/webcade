"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export default function SearchBox() {
  const router = useRouter();
  const [value, setValue] = useState("");

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        const q = value.trim();
        if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
      }}
      className="ml-auto flex rounded-lg shadow-sm transition focus-within:ring-2 focus-within:ring-indigo-500/40"
    >
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search games..."
        aria-label="Search games"
        className="w-40 rounded-l-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-500 focus:outline-none sm:w-64 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-indigo-400"
      />
      <button className="inline-flex items-center gap-1.5 rounded-r-lg border border-l-0 border-zinc-300 bg-zinc-50 px-3 py-1.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500 active:scale-95 dark:border-white/10 dark:bg-white/[0.06] dark:text-zinc-200 dark:hover:bg-white/10">
        <Search aria-hidden="true" className="h-4 w-4" />
        <span className="sr-only sm:not-sr-only">Search</span>
      </button>
    </form>
  );
}
