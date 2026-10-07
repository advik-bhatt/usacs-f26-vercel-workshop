# 10 · Analytics, Speed Insights & Observability ★

**Demo page:** `/demos/analytics` · **Time:** ~8 min


## 1. Web Analytics (privacy-friendly, no cookies)

Already in `src/app/layout.tsx`:

```tsx
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

<body>
  {children}
  <Analytics />
  <SpeedInsights />
</body>
```

Turn them on: Project → **Analytics** → **Enable**, and Project → **Speed
Insights** → **Enable**. Then redeploy. Data only comes from deployments, never
`localhost`.

- **Analytics**: visitors, page views, top pages, referrers, countries, devices.
- **Speed Insights**: real-user Core Web Vitals (LCP, INP, CLS, FCP, TTFB) per route.

## 2. Custom events

```tsx
// Client Component
import { track } from "@vercel/analytics";
track("Vote", { food: "Pizza 🍕" });
```

```ts
// Server (Route Handler / Server Action)
import { track } from "@vercel/analytics/server";
await track("Server Ping", { source: "workshop" }, { request });
```

They appear under Analytics → **Events**. (Custom events may require a paid
plan; see [limits & pricing](https://vercel.com/docs/analytics/limits-and-pricing).)

## 3. Logs

- Dashboard → **Logs**: every request, function `console.log`, status, duration, region.
- CLI: `npx vercel logs --follow` streams live logs, and `--level error` filters them.

## 4. Observability

Dashboard → **Observability**: function invocations, durations, error rates,
external API calls, ISR/cache hit rates, and middleware/proxy invocations, per
route. It's the first place to look when something is slow or expensive.
[Docs](https://vercel.com/docs/observability)

## 5. Drains & tracing

- **Drains** (Team settings): stream logs, traces, analytics and Speed Insights
  to Datadog, Axiom, Better Stack… or any HTTPS endpoint.
- **OpenTelemetry**: add an `instrumentation.ts` for custom spans. See the
  Next.js guide in `node_modules/next/dist/docs/01-app/02-guides/open-telemetry.md`
  and [Vercel tracing](https://vercel.com/docs/tracing/instrumentation).

## ✅ Check

- After a few visits to your deployment, Analytics shows page views.
- Clicking the vote buttons produces `Vote` events.

Next: **[11 · Flags →](11-flags.md)**
