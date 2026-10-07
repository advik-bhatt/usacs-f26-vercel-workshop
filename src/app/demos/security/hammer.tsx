"use client";

import { useState } from "react";

export function Hammer() {
  const [results, setResults] = useState<string[]>([]);

  async function hit(times: number) {
    setResults([]);
    for (let i = 0; i < times; i++) {
      const res = await fetch("/api/security/protected", { method: "POST" });
      const body = await res.json();
      setResults((r) => [...r, `#${i + 1} ${res.status} ${body.message ?? body.error}`]);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <button className="btn" onClick={() => hit(1)}>Call once</button>
        <button className="btn-secondary" onClick={() => hit(15)}>Call 15× fast</button>
      </div>
      {results.length > 0 && <pre className="pre">{results.join("\n")}</pre>}
    </div>
  );
}
