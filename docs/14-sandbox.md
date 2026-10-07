# 14 · Vercel Sandbox

**Demo page:** `/demos/sandbox` · **Time:** ~4 min (demo)

An **ephemeral, isolated Linux microVM** you can create from code in seconds.
It's built for running code you don't trust: code an AI just wrote,
user-submitted snippets, or builds of arbitrary repos.

## Enable the demo

The demo is off by default so nobody burns your credits. Add
`ENABLE_SANDBOX_DEMO=true` to your env vars, then `npx vercel env pull`
(Sandbox authenticates with your project's OIDC token).

## The code (`src/app/demos/sandbox/actions.ts`)

```ts
"use server";
import { Sandbox } from "@vercel/sandbox";

export async function runInSandbox(code: string) {
  const sandbox = await Sandbox.create({ timeout: 60_000 }); // default image has Node, Python, Bun
  try {
    const result = await sandbox.runCommand("node", ["-e", code]);
    return {
      exitCode: result.exitCode,
      stdout: await result.stdout(),
      stderr: await result.stderr(),
    };
  } finally {
    await sandbox.stop();
  }
}
```

Other things it can do:

- Clone a repo: `source: { type: "git", url: "https://github.com/…" }`
- Expose a port and get a public URL: `ports: [3000]` + `sandbox.domain(3000)`
- Snapshots, network policies, more vCPUs, long-running (hours on paid plans)

[SDK reference](https://vercel.com/docs/vercel-sandbox/sdk-reference)

Next: **[15 · Domains →](15-domains.md)**
