// Single source of truth for every workshop module.
// The home page, the nav, and each demo's "not configured" banner read from here.

export type WorkshopModule = {
  slug: string;
  number: string;
  title: string;
  blurb: string;
  doc: string; // file in /docs
  // Env vars that must be present for the live demo to work.
  // "A|B" means either name is fine. Empty = works with zero setup.
  env: string[];
  core: boolean; // true = we live-code it in the 2h session, false = show & tell
};

export const modules: WorkshopModule[] = [
  {
    slug: "deploy",
    number: "01",
    title: "Deploy, Previews & Rollbacks",
    blurb: "Git push → preview URL → production. Promote, roll back, inspect.",
    doc: "01-deploy.md",
    env: [],
    core: true,
  },
  {
    slug: "functions",
    number: "02",
    title: "Vercel Functions",
    blurb: "Route handlers, streaming, geolocation, waitUntil / after().",
    doc: "02-functions.md",
    env: [],
    core: true,
  },
  {
    slug: "caching",
    number: "03",
    title: "Caching, ISR & the CDN",
    blurb: "Time-based + on-demand revalidation and CDN cache headers.",
    doc: "03-caching.md",
    env: [],
    core: true,
  },
  {
    slug: "routing",
    number: "04",
    title: "Routing: Proxy, Redirects, Rewrites",
    blurb: "proxy.ts: /secret gate, maintenance mode, A/B test. vercel.json redirects.",
    doc: "04-routing.md",
    env: [],
    core: true,
  },
  {
    slug: "images",
    number: "05",
    title: "Image Optimization & OG Images",
    blurb: "next/image on the Vercel image CDN + dynamic social cards.",
    doc: "05-images-og.md",
    env: [],
    core: true,
  },
  {
    slug: "env",
    number: "06",
    title: "Environment Variables",
    blurb: "vercel env add GREETING, env pull, env run. Redeploy after changes!",
    doc: "06-env-vars.md",
    env: ["GREETING"],
    core: true,
  },
  {
    slug: "blob",
    number: "07a",
    title: "Vercel Blob",
    blurb: "File uploads straight to object storage.",
    doc: "07-storage.md",
    env: ["BLOB_READ_WRITE_TOKEN"],
    core: true,
  },
  {
    slug: "global-config",
    number: "07b",
    title: "Global Config (formerly Edge Config)",
    blurb: "A switch you flip without deploying: maintenance mode in proxy.ts.",
    doc: "07-storage.md",
    env: ["GLOBAL_CONFIG|EDGE_CONFIG"],
    core: false,
  },
  {
    slug: "postgres",
    number: "07c",
    title: "Postgres (Neon via Marketplace)",
    blurb: "A guestbook backed by serverless Postgres.",
    doc: "07-storage.md",
    env: ["DATABASE_URL|POSTGRES_URL"],
    core: true,
  },
  {
    slug: "redis",
    number: "07d",
    title: "Redis (Upstash via Marketplace)",
    blurb: "A global page-view counter.",
    doc: "07-storage.md",
    env: [
      "KV_REST_API_URL|UPSTASH_REDIS_REST_URL",
      "KV_REST_API_TOKEN|UPSTASH_REDIS_REST_TOKEN",
    ],
    core: false,
  },
  {
    slug: "ai",
    number: "08",
    title: "AI SDK + AI Gateway",
    blurb: "Streaming chat, tool calls, and structured output across providers.",
    doc: "08-ai.md",
    env: ["AI_GATEWAY_API_KEY|VERCEL_OIDC_TOKEN"],
    core: true,
  },
  {
    slug: "cron",
    number: "09",
    title: "Cron Jobs",
    blurb: "vercel crons add, then vercel crons run.",
    doc: "09-cron.md",
    env: ["CRON_SECRET"],
    core: true,
  },
  {
    slug: "analytics",
    number: "10",
    title: "Analytics, Speed Insights & Observability",
    blurb: "Web Analytics, custom events, Core Web Vitals, logs, drains.",
    doc: "10-observability.md",
    env: [],
    core: true,
  },
  {
    slug: "flags",
    number: "11",
    title: "Feature Flags + Toolbar",
    blurb: "Vercel Flags: vercel flags enable new-banner. Toolbar overrides.",
    doc: "11-flags.md",
    env: ["FLAGS_SECRET"],
    core: false,
  },
  {
    slug: "security",
    number: "12",
    title: "Firewall, Rate Limiting & BotID",
    blurb: "WAF rules, code-driven rate limits, invisible bot checks.",
    doc: "12-security.md",
    env: [],
    core: false,
  },
  {
    slug: "workflow",
    number: "13a",
    title: "Workflow (durable functions)",
    blurb: "Multi-step jobs that sleep, retry and survive deploys.",
    doc: "13-workflow-queues.md",
    env: [],
    core: false,
  },
  {
    slug: "queues",
    number: "13b",
    title: "Queues",
    blurb: "Fire-and-forget background messages with a consumer function.",
    doc: "13-workflow-queues.md",
    env: ["VERCEL_OIDC_TOKEN"],
    core: false,
  },
  {
    slug: "sandbox",
    number: "14",
    title: "Sandbox",
    blurb: "Run untrusted code in an isolated microVM.",
    doc: "14-sandbox.md",
    env: ["ENABLE_SANDBOX_DEMO", "VERCEL_OIDC_TOKEN"],
    core: false,
  },
];

export function getModule(slug: string) {
  const m = modules.find((m) => m.slug === slug);
  if (!m) throw new Error(`Unknown module: ${slug}`);
  return m;
}

// Server-only helper: which required env vars are missing?
export function missingEnv(m: WorkshopModule) {
  return m.env.filter(
    (entry) => !entry.split("|").some((name) => isSet(name)),
  );
}

function isSet(name: string) {
  // Deployed functions get their OIDC token from a request header rather
  // than process.env, so on Vercel we treat it as present. Locally it comes
  // from `vercel env pull` (and expires after ~12h — pull again if calls 401).
  if (name === "VERCEL_OIDC_TOKEN" && process.env.VERCEL === "1") return true;
  return !!process.env[name];
}

export const REPO_URL =
  "https://github.com/advik-bhatt/usacs-f26-vercel-workshop";
