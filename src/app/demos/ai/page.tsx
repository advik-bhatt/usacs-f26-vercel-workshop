import Link from "next/link";
import { DemoShell, FileRef } from "@/components/demo-shell";
import { getModule, missingEnv } from "@/lib/modules";
import { Planner } from "./planner";

export const metadata = { title: "AI" };

export default function AIDemo() {
  const ready = missingEnv(getModule("ai")).length === 0;

  return (
    <DemoShell slug="ai">
      {ready && (
        <>
          <section className="card space-y-3">
            <h2 className="font-medium">1. Streaming chat with a tool</h2>
            <p className="text-sm text-muted">
              <FileRef path="src/app/api/chat/route.ts" /> +{" "}
              <code className="code">useChat()</code> in{" "}
              <FileRef path="src/app/chat/chat.tsx" />
            </p>
            <Link href="/chat" className="btn">
              Open /chat →
            </Link>
          </section>
          <section className="card space-y-3">
            <h2 className="font-medium">2. Structured output (typed JSON)</h2>
            <p className="text-sm text-muted">
              <FileRef path="src/app/api/ai/plan/route.ts" /> —{" "}
              <code className="code">generateText</code> +{" "}
              <code className="code">Output.object(zodSchema)</code>
            </p>
            <Planner />
          </section>
        </>
      )}
    </DemoShell>
  );
}
