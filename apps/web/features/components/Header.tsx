"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Gamepad2 } from "lucide-react";
import SearchBox from "./Footer";
import { categoriesQuery } from "../lib/queries";

export default function Header() {
  const { data: categories = [] } = useQuery(categoriesQuery());

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/70 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 dark:border-white/10 dark:bg-zinc-950/70 dark:supports-[backdrop-filter]:bg-zinc-950/60">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent"
      />
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3">
        <Link
          href="/"
          className="group flex items-center gap-2 rounded-md text-xl font-bold tracking-tight text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-white dark:focus-visible:ring-offset-zinc-950"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-white shadow-lg shadow-indigo-500/30 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-105">
            <Gamepad2 aria-hidden="true" className="h-4 w-4" />
          </span>
          Webcade
        </Link>
        <nav
          aria-label="Categories"
          className="order-last -mx-1 flex w-full gap-1 overflow-x-auto px-1 pb-1 text-sm md:order-none md:w-auto md:flex-wrap md:overflow-visible md:pb-0"
        >
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/category/${c.slug}`}
              className="shrink-0 rounded-full px-3 py-1.5 font-medium text-zinc-600 transition-colors hover:bg-zinc-900/5 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white"
            >
              {c.name}
            </Link>
          ))}
        </nav>
        <SearchBox />
      </div>
    </header>
  );
}
