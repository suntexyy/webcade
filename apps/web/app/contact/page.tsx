import { Mail } from "lucide-react";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-3xl space-y-5 px-6 py-14 text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
      <h1 className="bg-gradient-to-b from-zinc-900 to-zinc-600 bg-clip-text pb-1 text-4xl font-bold tracking-tight text-transparent dark:from-white dark:to-zinc-400">
        Contact
      </h1>
      <div className="flex items-start gap-4 rounded-2xl border border-zinc-200 bg-white/70 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/[0.03] dark:shadow-none">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-300">
          <Mail aria-hidden="true" className="h-5 w-5" />
        </span>
        <p>
          For questions, game submissions, or takedown requests, email us at{" "}
          <a
            className="rounded-sm font-medium text-indigo-600 underline decoration-indigo-500/40 underline-offset-4 transition hover:decoration-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-indigo-300"
            href="mailto:critstoggle@gmail.com"
          >
            critstoggle@gmail.com
          </a>
          .
        </p>
      </div>
    </main>
  );
}
