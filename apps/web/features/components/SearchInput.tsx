"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";

export default function SearchInput({
  initialQuery,
}: {
  initialQuery: string;
}) {
  const [value, setValue] = useState(initialQuery);

  useEffect(() => {
    const q = value.trim();
    if (q === initialQuery.trim()) return;
    const timer = setTimeout(() => {
      window.history.replaceState(
        null,
        "",
        q ? `/search?q=${encodeURIComponent(q)}` : "/search",
      );
    }, 300);
    return () => clearTimeout(timer);
  }, [value, initialQuery]);

  return (
    <div className="relative mb-8">
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400 dark:text-zinc-500"
      />
      <input
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Type a game name..."
        aria-label="Search games"
        className="w-full rounded-xl border border-zinc-300 bg-white py-3 pl-12 pr-4 text-base text-zinc-900 shadow-sm transition placeholder:text-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/15 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-indigo-400"
      />
    </div>
  );
}
