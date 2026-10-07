"use client";

import { useChat } from "@ai-sdk/react";
import { useState } from "react";

export function Chat() {
  const [input, setInput] = useState("");
  // POSTs to /api/chat by default (src/app/api/chat/route.ts).
  const { messages, sendMessage, status, stop, error } = useChat();
  const busy = status === "submitted" || status === "streaming";

  return (
    <div className="space-y-3">
      <div className="max-h-96 space-y-3 overflow-y-auto">
        {messages.map((m) => (
          <div key={m.id} className={m.role === "user" ? "text-right" : ""}>
            {m.parts.map((part, i) => {
              if (part.type === "text") {
                return (
                  <p
                    key={i}
                    className={`inline-block max-w-[85%] whitespace-pre-wrap rounded-lg px-3 py-2 text-left text-sm ${
                      m.role === "user" ? "bg-foreground text-background" : "bg-card"
                    }`}
                  >
                    {part.text}
                  </p>
                );
              }
              if (part.type === "tool-getTime") {
                return (
                  <p key={i} className="font-mono text-xs text-muted">
                    🔧 getTime({JSON.stringify(part.input)}) → {part.state}
                  </p>
                );
              }
              return null;
            })}
          </div>
        ))}
      </div>
      {error && <p className="text-sm text-red-500">{error.message}</p>}
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (!input.trim()) return;
          sendMessage({ text: input });
          setInput("");
        }}
      >
        <input
          className="input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything… try “what time is it in Tokyo?”"
        />
        {busy ? (
          <button type="button" className="btn-secondary" onClick={() => stop()}>
            Stop
          </button>
        ) : (
          <button className="btn">Send</button>
        )}
      </form>
    </div>
  );
}
