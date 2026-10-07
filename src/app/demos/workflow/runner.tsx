"use client";

import { useEffect, useState } from "react";

type Status = { status: string; result: unknown };

export function Runner() {
  const [email, setEmail] = useState("scarlet@rutgers.edu");
  const [runId, setRunId] = useState<string | null>(null);
  const [status, setStatus] = useState<Status | null>(null);

  // Poll the status endpoint every second until the run finishes.
  useEffect(() => {
    if (!runId) return;
    const id = setInterval(async () => {
      const res = await fetch(`/api/workflow/status?runId=${runId}`);
      const s = (await res.json()) as Status;
      setStatus(s);
      if (["completed", "failed", "cancelled"].includes(s.status)) clearInterval(id);
    }, 1000);
    return () => clearInterval(id);
  }, [runId]);

  return (
    <div className="space-y-3">
      <form
        className="flex gap-2"
        onSubmit={async (e) => {
          e.preventDefault();
          setStatus(null);
          const res = await fetch("/api/workflow/start", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          });
          setRunId(((await res.json()) as { runId: string }).runId);
        }}
      >
        <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
        <button className="btn">Start workflow</button>
      </form>
      {runId && (
        <pre className="pre">
          {JSON.stringify({ runId, ...(status ?? { status: "starting…" }) }, null, 2)}
        </pre>
      )}
    </div>
  );
}
