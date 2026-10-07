# ▲ Push to Prod: Every Vercel tool, run from your terminal

The project for **USACS Tech's "Push to Prod" builder night (Rutgers, October 8)**.
You deploy this Next.js app to your own Vercel account in the first 10 minutes,
then light up one Vercel feature after another, almost entirely with the
`vercel` CLI.

**👉 Follow along in [`docs/push-to-prod.md`](docs/push-to-prod.md)**, a
slide-by-slide guide with every command and what you should see.

> **Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 ·
> AI SDK 7 · Vercel CLI 62.4. Packages are pinned in `package.json`.

## Quick start

```bash
npm i -g vercel && vercel login && vercel whoami
# Fork this repo on GitHub first, then:
git clone https://github.com/<your-username>/usacs-f26-vercel-workshop
cd usacs-f26-vercel-workshop
npm install
vercel link
vercel deploy --prod
```

> All app code lives in `src/`: for example `src/app/api/hello/route.ts` and
> `src/proxy.ts`.

## Where each slide lives in the code

| Slides | Feature | File / page |
|---|---|---|
| 11–19 | Function + env var | `src/app/api/hello/route.ts` → `/api/hello` |
| 20 | Proxy | `src/proxy.ts` → `/secret` (cookie from `/unlock`) |
| 21–23 | Cron | `src/app/api/cron/route.ts` (added with `vercel crons add`) |
| 25 | Blob | `/demos/blob` |
| 26 | Global Config | `src/proxy.ts` reads `maintenance` → `/maintenance` |
| 27 | Vercel Flags | `new-banner` in `src/flags.ts`, used in `src/app/page.tsx` |
| 28 | Cache tags | `/posts`, tagged `posts` |
| 29 | OG image | `src/app/opengraph-image.tsx` |
| 30–31 | AI SDK + Gateway | `/chat`, model string in `src/app/api/chat/route.ts` |
| 32 | Analytics | `<Analytics />` + `<SpeedInsights />` in `src/app/layout.tsx` |
| 34 | BotID | `src/app/api/security/protected/route.ts` |
| 35 | Queues + Workflow | `src/app/api/queues/consumer/route.ts`, `src/workflows/onboarding.ts` |

## Deep dives (one per feature)

The `docs/NN-*.md` guides go deeper than the slides, with more code and more
dashboard features. Use them after the session. Each demo page shows
**⚙️ Not configured yet** with the exact env vars it's missing.

### All modules

| # | Module | What you learn | Setup needed |
|---|--------|----------------|--------------|
| 00 | [Setup](docs/00-setup.md) | Fork, `vercel link`, `vercel deploy --prod`, `vercel env pull` | Vercel + GitHub account |
| 01 ★ | [Deploy, Previews & Rollbacks](docs/01-deploy.md) | Git deploys, preview URLs, promote, instant rollback, CLI deploys | — |
| 02 ★ | [Vercel Functions](docs/02-functions.md) | Route handlers, streaming, geolocation, `waitUntil` / `after()` | — |
| 03 ★ | [Caching, ISR & the CDN](docs/03-caching.md) | ISR, `revalidatePath`, `updateTag`, CDN cache headers, Runtime Cache | — |
| 04 ★ | [Routing](docs/04-routing.md) | `proxy.ts` A/B test, redirects, rewrites, headers in `vercel.json` | — |
| 05 ★ | [Images & OG](docs/05-images-og.md) | `next/image` optimization, dynamic social cards | — |
| 06 ★ | [Environment Variables](docs/06-env-vars.md) | `GREETING` per environment, `NEXT_PUBLIC_`, OIDC | `GREETING` |
| 07 ★ | [Storage](docs/07-storage.md) | Blob, Global Config, Postgres (Neon) & Redis (Upstash) via Marketplace | 1–4 stores |
| 08 ★ | [AI SDK + AI Gateway](docs/08-ai.md) | Streaming chat, tool calling, structured output, any model | AI Gateway |
| 09 ★ | [Cron Jobs](docs/09-cron.md) | Scheduled functions + securing them | `CRON_SECRET` |
| 10 ★ | [Observability](docs/10-observability.md) | Web Analytics, custom events, Speed Insights, logs, drains | 2 toggles |
| 11 | [Feature Flags + Toolbar](docs/11-flags.md) | Vercel Flags, Flags SDK, Flags Explorer, Toolbar | — |
| 12 | [Security](docs/12-security.md) | Firewall/WAF, rate limiting from code, BotID, Deployment Protection | Firewall rule |
| 13 | [Workflow & Queues](docs/13-workflow-queues.md) | Durable multi-step functions, background messaging | — |
| 14 | [Sandbox](docs/14-sandbox.md) | Run untrusted code in an isolated microVM | opt-in flag |
| 15 | [Domains](docs/15-domains.md) | Custom domains, DNS, SSL | a domain (optional) |
| 16 | [Beyond](docs/16-beyond.md) | Rolling releases, skew protection, microfrontends, monorepos, v0, MCP… | — |

★ = core features.

---

## How the repo is organized

```
docs/                     ← step-by-step guides (one per module) — start here
src/
  app/
    page.tsx              ← home: list of modules + config status
    demos/<module>/       ← one page per Vercel feature
    api/                  ← route handlers (= Vercel Functions)
    opengraph-image.tsx   ← dynamic OG image (module 05)
    .well-known/vercel/flags/route.ts  ← Flags Explorer endpoint (module 11)
  lib/
    modules.ts            ← list of modules + which env vars each needs
    db.ts, redis.ts, ai.ts, cron-job.ts
  workflows/              ← durable workflows (module 13)
  proxy.ts                ← runs before requests (module 04)
  instrumentation-client.ts ← BotID client (module 12)
  flags.ts                ← feature flag definitions (module 11)
vercel.json               ← redirects, rewrites, headers, crons, queue triggers
next.config.ts            ← Workflow + BotID + Toolbar plugins, image domains
.env.example              ← every env var, documented
```

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Local dev server on :3000 |
| `npm run build` / `npm start` | Production build / serve it locally |
| `npm run lint` | ESLint |
| `npm run typecheck` | Generate route types + `tsc --noEmit` |
| `npx vercel …` | The pinned Vercel CLI (or install globally with `npm i -g vercel`, as the slides do) |

## Costs

Everything here fits in the **Hobby (free)** plan or the free tiers of the
Marketplace providers, except where a guide says otherwise. AI Gateway, Sandbox
and Workflow are usage-based, so check your included credits in the
dashboard before a big demo. Limits change, so treat
[vercel.com/docs/limits](https://vercel.com/docs/limits) and
[vercel.com/docs/plans/hobby](https://vercel.com/docs/plans/hobby) as the
source of truth.

## Troubleshooting

- **A demo says "Not configured yet"**: add the listed env vars (or connect the
  store), run `npx vercel env pull`, restart `npm run dev`. On Vercel, **redeploy**
  after changing env vars.
- **401 / "OIDC token" errors locally**: the `VERCEL_OIDC_TOKEN` in `.env.local`
  expires after about 12 hours. Run `npx vercel env pull` again.
- **`vercel.json` redirects don't work locally**: they're applied by Vercel, not by
  `next dev`. Test on a deployment, or run `npx vercel dev`.
- **Analytics shows nothing locally**: by design. Analytics and Speed Insights
  only collect data on deployments.
