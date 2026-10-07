import { DemoShell, FileRef } from "@/components/demo-shell";
import { Greeting } from "./greeting";

export const metadata = { title: "Env Vars" };
export const dynamic = "force-dynamic";

export default function EnvDemo() {
  // Server Components (and Route Handlers, Server Actions) can read any env var.
  const greeting = process.env.GREETING;

  return (
    <DemoShell slug="env">
      <section className="card space-y-3">
        <h2 className="font-medium">process.env.GREETING</h2>
        <p className="text-sm text-muted">
          Read on the server. Same line of code, a different value in
          Development, Preview and Production (slide 16). Server code can read
          real secrets the same way, and they never reach the browser.
        </p>
        <p className="font-mono text-lg">GREETING = {greeting ?? "(not set)"}</p>
      </section>

      <section className="card space-y-3">
        <h2 className="font-medium">Public variable in a Client Component</h2>
        <p className="text-sm text-muted">
          <FileRef path="src/app/demos/env/greeting.tsx" /> reads{" "}
          <code className="code">NEXT_PUBLIC_WORKSHOP_GREETING</code>. Set a
          different value for Preview vs Production and compare the two URLs.
        </p>
        <Greeting />
      </section>

      <section className="card space-y-2 text-sm text-muted">
        <h2 className="font-medium text-foreground">Which environment am I in?</h2>
        <p>
          <code className="code">VERCEL_ENV</code> ={" "}
          <code className="code">{process.env.VERCEL_ENV ?? "(local)"}</code> ·{" "}
          <code className="code">NODE_ENV</code> ={" "}
          <code className="code">{process.env.NODE_ENV}</code>
        </p>
        <p>
          Changing an env var does <b>not</b> update existing deployments.
          Run <code className="code">vercel env update GREETING</code>, then{" "}
          <code className="code">vercel deploy --prod</code>.
        </p>
      </section>
    </DemoShell>
  );
}
