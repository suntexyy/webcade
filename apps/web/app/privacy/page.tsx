export const metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl space-y-4 p-6">
      <h1 className="text-3xl font-bold">Privacy Policy</h1>
      <p>Last updated: {new Date().toISOString().slice(0, 10)}</p>
      <h2 className="text-xl font-semibold">What we collect</h2>
      <p>
        Webcade does not require an account to play. We count how many times
        each game is played, and our hosting providers keep standard server logs
        such as IP address and browser type.
      </p>
      <h2 className="text-xl font-semibold">Third-party content</h2>
      <p>
        Games are provided by third-party platforms and developers and run
        inside embedded frames. These providers may use cookies or similar
        technologies under their own privacy policies.
      </p>
      <h2 className="text-xl font-semibold">Advertising and analytics</h2>
      <p>
        If we show ads or use analytics in the future, the providers may use
        cookies to serve and measure ads. This page will be updated to list
        them.
      </p>
      <h2 className="text-xl font-semibold">Contact</h2>
      <p>
        Questions about this policy can be sent to the email address on our
        Contact page.
      </p>
    </main>
  );
}
