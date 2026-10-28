export const metadata = { title: "Privacy Policy" };

const h2 =
  "mt-10 border-t border-zinc-200 pt-6 text-xl font-semibold tracking-tight text-zinc-900 dark:border-white/10 dark:text-white";

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl space-y-4 px-6 py-14 text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
      <h1 className="bg-gradient-to-b from-zinc-900 to-zinc-600 bg-clip-text pb-1 text-4xl font-bold tracking-tight text-transparent dark:from-white dark:to-zinc-400">
        Privacy Policy
      </h1>
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        Last updated: {new Date().toISOString().slice(0, 10)}
      </p>
      <h2 className={h2}>What we collect</h2>
      <p>
        Webcade does not require an account to play. We count how many times
        each game is played, and our hosting providers keep standard server logs
        such as IP address and browser type.
      </p>
      <h2 className={h2}>Third-party content</h2>
      <p>
        Games are provided by third-party platforms and developers and run
        inside embedded frames. These providers may use cookies or similar
        technologies under their own privacy policies.
      </p>
      <h2 className={h2}>Advertising and analytics</h2>
      <p>
        If we show ads or use analytics in the future, the providers may use
        cookies to serve and measure ads. This page will be updated to list
        them.
      </p>
      <h2 className={h2}>Contact</h2>
      <p>
        Questions about this policy can be sent to the email address on our
        Contact page.
      </p>
    </main>
  );
}
