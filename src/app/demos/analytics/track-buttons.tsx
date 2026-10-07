"use client";

import { track } from "@vercel/analytics";
import { useState } from "react";

// Custom events show up in the dashboard under Analytics → Events.
// (Nothing is sent in development — deploy to see them.)
export function TrackButtons() {
  const [log, setLog] = useState<string[]>([]);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {["Pizza 🍕", "Tacos 🌮", "Ramen 🍜"].map((food) => (
          <button
            key={food}
            className="btn-secondary"
            onClick={() => {
              track("Vote", { food }); // client-side event
              setLog((l) => [`track("Vote", { food: "${food}" })`, ...l]);
            }}
          >
            {food}
          </button>
        ))}
        <button
          className="btn"
          onClick={async () => {
            await fetch("/api/analytics", { method: "POST" }); // server-side event
            setLog((l) => ['server: track("Server Ping")', ...l]);
          }}
        >
          Server-side event
        </button>
      </div>
      {log.length > 0 && <pre className="pre">{log.join("\n")}</pre>}
    </div>
  );
}
