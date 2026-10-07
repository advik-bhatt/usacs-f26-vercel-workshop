import { DemoShell, FileRef } from "@/components/demo-shell";
import { getModule, missingEnv } from "@/lib/modules";
import { Editor } from "./editor";

export const metadata = { title: "Sandbox" };

export default function SandboxDemo() {
  const ready = missingEnv(getModule("sandbox")).length === 0;
  return (
    <DemoShell slug="sandbox">
      {ready && (
        <section className="card space-y-3">
          <p className="text-sm text-muted">
            <FileRef path="src/app/demos/sandbox/actions.ts" /> —{" "}
            <code className="code">Sandbox.create()</code> →{" "}
            <code className="code">runCommand(&quot;node&quot;, [&quot;-e&quot;, code])</code> →{" "}
            <code className="code">stop()</code>.
          </p>
          <Editor />
        </section>
      )}
    </DemoShell>
  );
}
