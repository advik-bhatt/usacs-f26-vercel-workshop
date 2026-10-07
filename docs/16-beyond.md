# 16 · Beyond: the rest of the platform

**Time:** ~5 min (speed round). These don't have demo pages; each is a
one-liner so you know it exists.

## Shipping safely

- **Rolling Releases**: send a new production deployment to 5% → 25% → 100% of
  traffic, watching metrics between stages. [Docs](https://vercel.com/docs/rolling-releases)
- **Skew Protection**: users with an old tab open keep talking to the
  deployment they loaded, so an API change doesn't break them mid-session.
  [Docs](https://vercel.com/docs/skew-protection)
- **Custom Environments**: add `staging`, `qa`… alongside Preview and
  Production, each with its own env vars and domain.
  [Docs](https://vercel.com/docs/deployments/environments)
- **Deployment Checks**: block promotion to production until checks (e.g. E2E
  tests) pass.

## Scaling the codebase

- **Monorepos + Turborepo**: many apps in one repo, only rebuild what changed,
  and share a remote build cache. [Docs](https://vercel.com/docs/monorepos/turborepo)
- **Microfrontends**: split one domain across several independently deployed
  apps (e.g. `/docs` owned by another team). `npx vercel microfrontends`.
  [Docs](https://vercel.com/docs/microfrontends)
- **Other frameworks & languages**: Vercel isn't only Next.js. SvelteKit,
  Nuxt, Astro, Remix/React Router, Vite SPAs; Python, Go and Ruby functions.
  [Build Output API](https://vercel.com/docs/build-output-api/v3) for anything else.

## Teams & integrations

- **Webhooks**: get notified on deployment events.
  [Docs](https://vercel.com/docs/webhooks/webhooks-api)
- **Marketplace**: beyond Neon/Upstash: auth, CMS, payments, email, logging,
  AI providers. Browse with `npx vercel integration discover`.
- **Audit log**, SSO, access groups (Enterprise). [Docs](https://vercel.com/docs/audit-log)

## AI-native workflow

- **v0** ([v0.app](https://v0.app)): describe a UI or app in English, get a Next.js
  project, and deploy it to Vercel in one click.
- **Vercel MCP server**: let AI coding agents (Claude, Cursor…) read your
  deployments, logs and projects. Set it up with `npx vercel mcp`.
- **AI Gateway + AI SDK + Sandbox + Workflow** together are the building
  blocks for agents that write and run code (modules 08, 13, 14).

## Where to go next

- Deploy your own side project: `npx vercel` in any folder.
- Read your project's **Observability** tab after a week of traffic.
- Docs: [vercel.com/docs](https://vercel.com/docs) · CLI reference:
  [vercel.com/docs/cli](https://vercel.com/docs/cli)
