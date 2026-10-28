export const metadata = { title: "Terms of Use" };

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl space-y-5 px-6 py-14 text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
      <h1 className="bg-gradient-to-b from-zinc-900 to-zinc-600 bg-clip-text pb-1 text-4xl font-bold tracking-tight text-transparent dark:from-white dark:to-zinc-400">
        Terms of Use
      </h1>
      <p>
        Webcade is provided as is, without warranties. Games belong to their
        respective owners.
      </p>
      <p>
        If you believe content on this site infringes your rights, contact us
        and we will review and remove it where appropriate.
      </p>
    </main>
  );
}
