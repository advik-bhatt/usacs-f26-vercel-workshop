import { DemoShell, FileRef } from "@/components/demo-shell";

export const metadata = { title: "Routing" };

const links = [
  {
    href: "/demos/routing/experiment",
    label: "/demos/routing/experiment",
    how: "proxy.ts rewrite (A/B test with a cookie)",
  },
  {
    href: "/workshop",
    label: "/workshop",
    how: "vercel.json redirect → /  (308 permanent)",
  },
  {
    href: "/docs/functions",
    label: "/docs/functions",
    how: "vercel.json redirect with a path param → vercel.com/docs/functions",
  },
  {
    href: "/secret",
    label: "/secret",
    how: "proxy.ts redirect home unless you have the cookie (get it at /unlock)",
  },
];

export default function RoutingDemo() {
  return (
    <DemoShell slug="routing">
      <section className="card space-y-3">
        <h2 className="font-medium">Try these URLs</h2>
        <ul className="space-y-2 text-sm">
          {links.map((l) => (
            <li key={l.href} className="flex flex-wrap items-baseline gap-2">
              <a className="code text-accent hover:underline" href={l.href}>
                {l.label}
              </a>
              <span className="text-muted">— {l.how}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="card space-y-2 text-sm text-muted">
        <h2 className="font-medium text-foreground">Where the rules live</h2>
        <p>
          <FileRef path="src/proxy.ts" /> — code that runs before every
          matching request (A/B tests, auth checks, geo routing).
        </p>
        <p>
          <code className="code">vercel.json</code> rules are applied by
          Vercel itself, so the two redirects only work on a deployment (or
          with <code className="code">vercel dev</code>), not with{" "}
          <code className="code">next dev</code>.
        </p>
        <p>
          <FileRef path="vercel.json" /> — declarative redirects, rewrites and
          headers applied by Vercel&apos;s CDN. No function invocation needed.
        </p>
        <p>
          Open DevTools → Network and look for the{" "}
          <code className="code">x-workshop-proxy</code> and{" "}
          <code className="code">x-workshop-demo</code> response headers.
        </p>
      </section>
    </DemoShell>
  );
}
