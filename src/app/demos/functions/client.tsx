"use client";

import { useState } from "react";

export function HelloButton() {
  const [data, setData] = useState<string>("");
  const [loading, setLoading] = useState(false);

  return (
    <div className="space-y-3">
      <button
        className="btn"
        disabled={loading}
        onClick={async () => {
          setLoading(true);
          const res = await fetch("/api/functions/hello");
          setData(JSON.stringify(await res.json(), null, 2));
          setLoading(false);
        }}
      >
        {loading ? "Calling…" : "GET /api/functions/hello"}
      </button>
      {data && <pre className="pre">{data}</pre>}
    </div>
  );
}

export function StreamButton() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <div className="space-y-3">
      <button
        className="btn"
        disabled={loading}
        onClick={async () => {
          setText("");
          setLoading(true);
          const res = await fetch("/api/functions/stream");
          const reader = res.body!.getReader();
          const decoder = new TextDecoder();
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            setText((t) => t + decoder.decode(value));
          }
          setLoading(false);
        }}
      >
        {loading ? "Streaming…" : "GET /api/functions/stream"}
      </button>
      {text && <p className="pre whitespace-pre-wrap">{text}</p>}
    </div>
  );
}
