"use server";

import { Sandbox } from "@vercel/sandbox";

// Runs arbitrary JavaScript inside a Vercel Sandbox: an isolated, ephemeral
// Linux microVM. Your function stays safe even if the code is malicious —
// that's how AI coding agents run code they just generated.
export async function runInSandbox(code: string) {
  // Guard so a public deployment can't be used to burn your compute.
  if (process.env.ENABLE_SANDBOX_DEMO !== "true") {
    return { error: "Set ENABLE_SANDBOX_DEMO=true to enable this demo." };
  }

  const started = Date.now();
  const sandbox = await Sandbox.create({ timeout: 60_000 }); // auth: OIDC
  try {
    const result = await sandbox.runCommand("node", ["-e", code.slice(0, 5000)]);
    return {
      exitCode: result.exitCode,
      stdout: await result.stdout(),
      stderr: await result.stderr(),
      tookMs: Date.now() - started,
    };
  } finally {
    await sandbox.stop();
  }
}
