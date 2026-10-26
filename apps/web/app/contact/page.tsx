export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-3xl space-y-4 p-6">
      <h1 className="text-3xl font-bold">Contact</h1>
      <p>
        For questions, game submissions, or takedown requests, email us at
        <a className="underline" href="mailto:YOUR_EMAIL_HERE">
          critstoggle@gmail.com
        </a>
        .
      </p>
    </main>
  );
}
