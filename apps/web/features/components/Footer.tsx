import Link from "next/link";

const link =
  "rounded-sm text-zinc-500 transition-colors hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-zinc-400 dark:hover:text-white";

export default function Footer() {
  return (
    <footer className="relative mt-24 border-t border-zinc-200 dark:border-white/10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"
      />
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-6 py-8 text-sm text-zinc-500 dark:text-zinc-400">
        <span className="font-medium text-zinc-700 dark:text-zinc-300">
          © {new Date().getFullYear()} Webcade
        </span>
        <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-5 gap-y-2 sm:ml-auto">
          <Link href="/about" className={link}>
            About
          </Link>
          <Link href="/contact" className={link}>
            Contact
          </Link>
          <Link href="/privacy" className={link}>
            Privacy Policy
          </Link>
          <Link href="/terms" className={link}>
            Terms
          </Link>
        </nav>
      </div>
    </footer>
  );
}
