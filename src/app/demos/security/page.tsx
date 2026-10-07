import { DemoShell, FileRef } from "@/components/demo-shell";
import { Hammer } from "./hammer";

export const metadata = { title: "Security" };

export default function SecurityDemo() {
  return (
    <DemoShell slug="security">
      <section className="card space-y-3">
        <h2 className="font-medium">A protected endpoint</h2>
        <p className="text-sm text-muted">
          <FileRef path="src/app/api/security/protected/route.ts" /> runs{" "}
          <code className="code">checkBotId()</code> then{" "}
          <code className="code">checkRateLimit()</code>. The browser side is{" "}
          <FileRef path="src/instrumentation-client.ts" />. Try it with{" "}
          <code className="code">curl -X POST</code> on your deployment — curl
          fails the bot check.
        </p>
        <Hammer />
      </section>

      <section className="card space-y-2 text-sm text-muted">
        <h2 className="font-medium text-foreground">Configured in the dashboard (no code)</h2>
        <ul className="list-inside list-disc space-y-1">
          <li><b>Firewall → Custom rules</b>: block a country, a path, a user agent…</li>
          <li><b>Managed rulesets</b>: OWASP core rules, bot protection, AI bot blocking.</li>
          <li><b>Attack Challenge Mode</b>: one switch when you&apos;re under attack.</li>
          <li><b>Deployment Protection</b>: Vercel Authentication / password on previews.</li>
          <li><b>DDoS mitigation</b>: always on, nothing to configure.</li>
        </ul>
      </section>
    </DemoShell>
  );
}
