"use client";

import { Trash2 } from "lucide-react";

export default function DeleteButton() {
  return (
    <button
      type="submit"
      className="group inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium text-red-600 transition hover:bg-red-500/10 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white active:scale-95 dark:text-red-400 dark:hover:bg-red-500/15 dark:hover:text-red-300 dark:focus-visible:ring-offset-zinc-950"
      onClick={(e) => {
        if (!confirm("Delete this game permanently?")) e.preventDefault();
      }}
    >
      <Trash2
        aria-hidden="true"
        className="h-3.5 w-3.5 transition-transform group-hover:-rotate-6"
      />
      Delete
    </button>
  );
}
