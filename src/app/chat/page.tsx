import { DemoShell, FileRef } from "@/components/demo-shell";
import { getModule, missingEnv } from "@/lib/modules";
import { Chat } from "./chat";

export const metadata = { title: "Chat" };

// Slide 30: open /chat, then change the model string in
// src/app/api/chat/route.ts, deploy, and ask again.
export default function ChatPage() {
  const ready = missingEnv(getModule("ai")).length === 0;
  return (
    <DemoShell slug="ai">
      {ready && (
        <section className="card space-y-3">
          <p className="text-sm text-muted">
            <FileRef path="src/app/api/chat/route.ts" /> streams through the AI
            Gateway. Try “what time is it in Tokyo?” to see a tool call.
          </p>
          <Chat />
        </section>
      )}
    </DemoShell>
  );
}
