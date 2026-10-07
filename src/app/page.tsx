import Link from "next/link";
import { modules, missingEnv } from "@/lib/modules";
import { newBanner } from "@/flags";

// Reads process.env at request time so the ✅ / ⚙️ badges are always current.
export const dynamic = "force-dynamic";

export default async function Home() {
  return (
    <div className="space-y-10">
      {(await newBanner()) && (
        <div className="rounded-xl bg-accent p-4 text-center font-medium text-white">
          🎉 The new-banner flag is on. Nothing was redeployed.
        </div>
      )}
      <section className="space-y-3">
        <h1 className="text-4xl font-semibold tracking-tight">
          Push to Prod
        </h1>
        <p className="max-w-2xl text-muted">
          Every Vercel tool, run from your terminal. Follow the slides, or the
          slide-by-slide guide in <code className="code">docs/push-to-prod.md</code>.
        </p>
        <p className="flex flex-wrap gap-2 text-sm">
          {["/api/hello", "/secret", "/chat", "/posts"].map((href) => (
            <a key={href} href={href} className="code hover:text-accent">
              {href}
            </a>
          ))}
        </p>
        <p className="text-sm text-muted">
          <span className="mr-4">★ = live-coded in the session</span>
          <span className="mr-4">✅ configured</span>
          <span>⚙️ needs env vars</span>
        </p>
      </section>

      <ul className="grid gap-4 sm:grid-cols-2">
        {modules.map((m) => {
          const ready = missingEnv(m).length === 0;
          return (
            <li key={m.slug}>
              <Link
                href={`/demos/${m.slug}`}
                className="card block h-full transition-colors hover:border-accent"
              >
                <div className="flex items-center justify-between font-mono text-xs text-muted">
                  <span>
                    {m.number} {m.core ? "★" : ""}
                  </span>
                  <span>{ready ? "✅" : "⚙️"}</span>
                </div>
                <h2 className="mt-2 font-medium">{m.title}</h2>
                <p className="mt-1 text-sm text-muted">{m.blurb}</p>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
