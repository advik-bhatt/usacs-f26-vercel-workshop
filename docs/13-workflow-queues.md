# 13 · Workflow & Queues

**Demo pages:** `/demos/workflow`, `/demos/queues` · **Time:** ~8 min (demo)

Both move work **out of the request/response cycle**.

| | **Workflow** (`workflow`) | **Queues** (`@vercel/queue`) |
|---|---|---|
| Shape | Multi-step program: `await` steps, `sleep` for days, retries | One message → one handler call |
| State | Durable: survives crashes and deploys; steps never re-run once done | Message is retried until your handler succeeds |
| Use for | Onboarding sequences, AI agents, order pipelines, human-in-the-loop | Webhook fan-out, image processing, sending emails |

---

## 13a · Workflow (Workflow DevKit)

**Setup (already done):**

```ts
// next.config.ts
import { withWorkflow } from "workflow/next";
export default withWorkflow(nextConfig);
```

**Write a workflow** (`src/workflows/onboarding.ts`):

```ts
import { sleep, FatalError } from "workflow";

export async function welcome(email: string) {
  "use workflow";
  const user = await createAccount(email);
  await sendEmail(user.email, "Welcome!");
  await sleep("10s");             // the slides use "1d": nothing runs (or bills) while sleeping
  await sendEmail(user.email, "Tips to get started");
  return { userId: user.id, status: "onboarded" };
}

async function createAccount(email: string) {
  "use step";                      // persisted + retried automatically
  if (!email.includes("@")) throw new FatalError("Invalid email"); // don't retry
  return { id: crypto.randomUUID(), email };
}

async function sendEmail(to: string, subject: string) {
  "use step";
  console.log(`email to ${to}: ${subject}`);
}
```

**Start it and check on it:**

```ts
import { start, getRun } from "workflow/api";

const run = await start(welcome, [email]);  // returns immediately
const status = await getRun(run.runId).status;  // pending | running | completed | failed | cancelled
```

This works locally with no setup (runs are stored on disk). Inspect them:

```bash
npx workflow web                               # local run viewer
npx workflow inspect runs --backend vercel     # runs on your deployment
```

On Vercel, runs also show up in the dashboard on your project.
[Docs](https://vercel.com/docs/workflow)

---

## 13b · Queues

**1. Consumer:** a route wrapped in `handleCallback`
(`src/app/api/queues/consumer/route.ts`):

```ts
import { handleCallback } from "@vercel/queue";

export const POST = handleCallback<{ item: string }>(async (order, metadata) => {
  console.log("processing", order.item, "attempt", metadata.deliveryCount);
  // throw → the message is retried
});
```

**2. Subscribe it to a topic in `vercel.json`:**

```json
"functions": {
  "src/app/api/queues/consumer/route.ts": {
    "experimentalTriggers": [{ "type": "queue/v2beta", "topic": "orders" }]
  }
}
```

**3. Producer:** anywhere on the server:

```ts
import { send } from "@vercel/queue";
await send("orders", { item: "🍕 pizza" });
```

Queues authenticate with OIDC, so run `npx vercel env pull` before trying
locally. With `next dev` the SDK sends to the real queue service and runs your
handler in-process; `npx vercel dev` runs a local broker instead.
[Docs](https://vercel.com/docs/queues)

Next: **[14 · Sandbox →](14-sandbox.md)**
