# 12 · Firewall, Rate Limiting & BotID

**Demo page:** `/demos/security` · **Time:** ~6 min (demo)

## Always on, zero config

- **DDoS mitigation** at the edge.
- **HTTPS/TLS** certificates for every domain and deployment.

## 1. Vercel Firewall / WAF (dashboard, no code)

Project → **Firewall**:

- **Custom rules**: e.g. *if path starts with `/admin` and country ≠ US → Deny*,
  or *if user agent contains `curl` → Challenge*. Changes go live globally in
  seconds, with no deploy.
- **Managed rulesets**: prebuilt protections (such as OWASP core rules and bot
  categories), toggled per project.
- **IP blocking**.
- **Attack Challenge Mode**: one switch when you're under attack.

[Firewall docs](https://vercel.com/docs/security/vercel-firewall)

## 2. Rate limiting from code (`@vercel/firewall`)

1. Firewall → **New rule** → set the condition to the **@vercel/firewall**
   rate-limit ID `workshop-rate-limit` → choose a limit (e.g. 5 requests / 60s)
   → action **Rate limit**. [Docs](https://vercel.com/docs/vercel-waf/rate-limiting-sdk)
2. In your route:

```ts
import { checkRateLimit } from "@vercel/firewall";

const { rateLimited } = await checkRateLimit("workshop-rate-limit", { request });
if (rateLimited) return new Response("Slow down", { status: 429 });
```

It keys on the caller's IP by default; pass `rateLimitKey: userId` to limit per
user instead. Locally it always returns `rateLimited: false` (with a warning).

## 3. BotID: invisible bot detection

Stops scripted abuse (sign-up spam, checkout bots, scraping expensive AI
endpoints) without CAPTCHAs.

```ts
// next.config.ts
import { withBotId } from "botid/next/config";
export default withBotId(nextConfig);
```

```ts
// src/instrumentation-client.ts: which requests the browser should "sign"
import { initBotId } from "botid/client/core";
initBotId({ protect: [{ path: "/api/security/protected", method: "POST" }] });
```

```ts
// the route
import { checkBotId } from "botid/server";
const { isBot } = await checkBotId();
if (isBot) return Response.json({ error: "Access denied" }, { status: 403 });
```

Try it on your deployment. The button works, but
`curl -X POST https://<app>/api/security/protected` gets a 403. In `next dev`,
`checkBotId()` always says "human". You can optionally enable **BotID Deep
Analysis** under Firewall settings. [Docs](https://vercel.com/docs/botid)

## 4. Deployment Protection

Settings → **Deployment Protection**: require a Vercel login (**Vercel
Authentication**) to view preview deployments. It's on by default for new
projects. Paid plans add options such as password protection. Use
`npx vercel curl <path>` to hit a protected deployment from the terminal.

Next: **[13 · Workflow & Queues →](13-workflow-queues.md)**
