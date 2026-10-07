import Link from "next/link";

export const metadata = { title: "Secret" };

// Slide 20: proxy.ts checks for the `workshop-secret` cookie before this page
// renders. No cookie → redirected home. Get the cookie by visiting /unlock.
export default function SecretPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold">🔓 You found the secret page</h1>
      <p className="text-muted">
        proxy.ts saw your <code className="code">workshop-secret</code> cookie
        and let you through. Try <code className="code">vercel curl /secret -I</code>{" "}
        from the terminal: no cookie, so you get a redirect instead.
      </p>
      <Link className="btn-secondary" href="/lock">
        Lock it again
      </Link>
    </div>
  );
}
