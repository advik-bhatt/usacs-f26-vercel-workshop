"use client";

import { useState, useTransition } from "react";
import { runInSandbox } from "./actions";

const EXAMPLE = `const os = require("os");
console.log("Hello from", os.hostname());
console.log("Node", process.version, "on", os.platform(), os.arch());
console.log("2 ** 64 =", 2n ** 64n);`;

export function Editor() {
  const [code, setCode] = useState(EXAMPLE);
  const [output, setOutput] = useState("");
  const [pending, startTransition] = useTransition();

  return (
    <div className="space-y-3">
      <textarea
        className="input h-40 font-mono"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <button
        className="btn"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            setOutput(JSON.stringify(await runInSandbox(code), null, 2));
          })
        }
      >
        {pending ? "Booting microVM…" : "Run in Sandbox"}
      </button>
      {output && <pre className="pre">{output}</pre>}
    </div>
  );
}
