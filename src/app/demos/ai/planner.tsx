"use client";

import { useState } from "react";

export function Planner() {
  const [topic, setTopic] = useState("Next.js on Vercel");
  const [plan, setPlan] = useState<string>("");
  const [loading, setLoading] = useState(false);

  return (
    <div className="space-y-3">
      <form
        className="flex gap-2"
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);
          const res = await fetch("/api/ai/plan", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ topic }),
          });
          setPlan(JSON.stringify(await res.json(), null, 2));
          setLoading(false);
        }}
      >
        <input className="input" value={topic} onChange={(e) => setTopic(e.target.value)} />
        <button className="btn" disabled={loading}>
          {loading ? "Thinking…" : "Generate"}
        </button>
      </form>
      {plan && <pre className="pre">{plan}</pre>}
    </div>
  );
}
