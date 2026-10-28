export const metadata = { title: "About Webcade" };

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl space-y-5 px-6 py-14 text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
      <h1 className="bg-gradient-to-b from-zinc-900 to-zinc-600 bg-clip-text pb-1 text-4xl font-bold tracking-tight text-transparent dark:from-white dark:to-zinc-400">
        About Webcade
      </h1>
      <p className="text-lg text-zinc-600 dark:text-zinc-400">
        Webcade is a collection of free browser games you can play instantly,
        with no download or sign-up.
      </p>
      <p>
        We pick games from developers and partner platforms, group them by
        category, and add short descriptions so you can find something to play
        quickly.
      </p>
      <p className="rounded-xl border border-zinc-200 bg-white/70 p-4 text-sm dark:border-white/10 dark:bg-white/[0.03]">
        If you are a game developer and want your game listed, or you want a
        game removed, please get in touch.
      </p>
    </main>
  );
}
