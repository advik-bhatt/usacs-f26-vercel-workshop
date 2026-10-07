import { DemoShell, FileRef } from "@/components/demo-shell";
import { Runner } from "./runner";

export const metadata = { title: "Workflow" };

export default function WorkflowDemo() {
  return (
    <DemoShell slug="workflow">
      <section className="card space-y-3">
        <h2 className="font-medium">Onboarding workflow: create → email → sleep 10s → email</h2>
        <p className="text-sm text-muted">
          <FileRef path="src/workflows/onboarding.ts" /> is started by{" "}
          <FileRef path="src/app/api/workflow/start/route.ts" />. Watch the
          status go <code className="code">running</code> →{" "}
          <code className="code">completed</code>. Try an email without an
          “@” to see a <code className="code">FatalError</code>.
        </p>
        <Runner />
        <p className="text-sm text-muted">
          Inspect runs locally with <code className="code">npx workflow web</code>.
          Once deployed, runs show up in the Vercel dashboard on your project
          page (or <code className="code">npx workflow inspect runs --backend vercel</code>).
        </p>
      </section>
    </DemoShell>
  );
}
