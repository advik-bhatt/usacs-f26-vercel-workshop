import { sleep, FatalError } from "workflow";

// A durable workflow. "use workflow" marks the orchestrator; every
// "use step" function is persisted, retried on failure, and never re-run
// once it succeeded — even if the deployment restarts mid-way.

export async function welcome(email: string) {
  "use workflow";

  const user = await createAccount(email);
  await sendEmail(user.email, "Welcome to USACS! 🎉");

  // Sleeping costs nothing: no function is running while we wait.
  // The slides use sleep("1d"); the demo uses 10s so you can watch it finish.
  await sleep("10s");

  await sendEmail(user.email, "Here are some tips to get started…");
  return { userId: user.id, status: "onboarded" as const };
}

async function createAccount(email: string) {
  "use step";
  if (!email.includes("@")) {
    // FatalError = don't retry, fail the run.
    throw new FatalError(`Invalid email: ${email}`);
  }
  return { id: crypto.randomUUID(), email };
}

async function sendEmail(to: string, subject: string) {
  "use step";
  // Any normal thrown Error here would be retried automatically.
  console.log(`[workflow] email to ${to}: ${subject}`);
  return { sentAt: new Date().toISOString() };
}
