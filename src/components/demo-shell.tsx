import Link from "next/link";
import { getModule, missingEnv, REPO_URL } from "@/lib/modules";

// Wraps every demo page: title, link to the matching doc, and a
// "not configured yet" banner listing any env vars that are missing.
export function DemoShell({
  slug,
  children,
}: {
  slug: string;
  children: React.ReactNode;
}) {
  const m = getModule(slug);
  const missing = missingEnv(m);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Link href="/" className="text-sm text-muted hover:text-foreground">
          ← All modules
        </Link>
        <p className="font-mono text-sm text-muted">Module {m.number}</p>
        <h1 className="text-3xl font-semibold tracking-tight">{m.title}</h1>
        <p className="text-muted">{m.blurb}</p>
        <a
          className="inline-block text-sm text-accent hover:underline"
          href={`${REPO_URL}/blob/main/docs/${m.doc}`}
          target="_blank"
          rel="noreferrer"
        >
          Step-by-step guide: docs/{m.doc} ↗
        </a>
      </div>

      {missing.length > 0 && <NotConfigured missing={missing} doc={m.doc} />}

      {children}
    </div>
  );
}

export function NotConfigured({
  missing,
  doc,
}: {
  missing: string[];
  doc: string;
}) {
  return (
    <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-5 text-sm">
      <p className="font-medium">Not configured yet</p>
      <p className="mt-1 text-muted">
        This demo needs{" "}
        {missing.map((name, i) => (
          <span key={name}>
            <code className="code">{name.replaceAll("|", " or ")}</code>
            {i < missing.length - 1 ? ", " : ""}
          </span>
        ))}
        . Follow <code className="code">docs/{doc}</code>, then run{" "}
        <code className="code">vercel env pull</code> and restart{" "}
        <code className="code">npm run dev</code>.
      </p>
    </div>
  );
}

// Tiny helper for "here's the code that powers this" callouts.
export function FileRef({ path }: { path: string }) {
  return (
    <a
      href={`${REPO_URL}/blob/main/${path}`}
      target="_blank"
      rel="noreferrer"
      className="code hover:text-accent"
    >
      {path}
    </a>
  );
}
