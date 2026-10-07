import { revalidatePath, unstable_cache, updateTag } from "next/cache";
import { DemoShell, FileRef } from "@/components/demo-shell";

export const metadata = { title: "Caching" };

// ── ISR (Incremental Static Regeneration) ──────────────────────────────
// This page is rendered once, cached on Vercel's CDN, and regenerated in
// the background at most every 30 seconds. Every visitor gets a static page.
export const revalidate = 30;

// ── Data cache with a tag ──────────────────────────────────────────────
// Cache the result of any async function and give it a tag so we can
// invalidate just this piece of data on demand.
const getLuckyNumber = unstable_cache(
  async () => ({
    value: Math.floor(Math.random() * 1000),
    at: new Date().toISOString(),
  }),
  ["lucky-number"],
  { tags: ["lucky-number"], revalidate: 3600 },
);

// ── Server Actions that purge the cache ────────────────────────────────
async function purgePage() {
  "use server";
  revalidatePath("/demos/caching"); // regenerate the whole page
}

async function purgeTag() {
  "use server";
  updateTag("lucky-number"); // only the tagged data, fresh on next read
}

export default async function CachingDemo() {
  const renderedAt = new Date().toISOString();
  const lucky = await getLuckyNumber();

  return (
    <DemoShell slug="caching">
      <section className="card space-y-3">
        <h2 className="font-medium">1. ISR — time-based revalidation</h2>
        <p className="text-sm text-muted">
          <code className="code">export const revalidate = 30</code> in{" "}
          <FileRef path="src/app/demos/caching/page.tsx" />. Refresh: the
          timestamp stays the same until 30s pass. (In{" "}
          <code className="code">next dev</code> pages are never cached — test
          on a deployment or with <code className="code">npm run build && npm start</code>.)
        </p>
        <p className="font-mono text-lg">Page rendered at: {renderedAt}</p>
        <form action={purgePage}>
          <button className="btn">revalidatePath() — rebuild now</button>
        </form>
      </section>

      <section className="card space-y-3">
        <h2 className="font-medium">2. Tagged data + on-demand purge</h2>
        <p className="text-sm text-muted">
          <code className="code">unstable_cache(fn, keys, {"{ tags }"})</code>{" "}
          caches for an hour. <code className="code">updateTag()</code> in a
          Server Action throws away just that entry.
        </p>
        <p className="font-mono text-lg">
          Lucky number: {lucky.value}{" "}
          <span className="text-sm text-muted">(computed {lucky.at})</span>
        </p>
        <form action={purgeTag}>
          <button className="btn">updateTag(&quot;lucky-number&quot;)</button>
        </form>
      </section>

      <section className="card space-y-3">
        <h2 className="font-medium">3. CDN cache headers on an API</h2>
        <p className="text-sm text-muted">
          <FileRef path="src/app/api/caching/cdn/route.ts" /> sets{" "}
          <code className="code">Vercel-CDN-Cache-Control</code>. Open it twice
          and compare the time + the{" "}
          <code className="code">x-vercel-cache</code> response header (MISS →
          HIT).
        </p>
        <a className="btn-secondary" href="/api/caching/cdn" target="_blank">
          Open /api/caching/cdn ↗
        </a>
      </section>

      <section className="card space-y-3">
        <h2 className="font-medium">4. Runtime Cache (per-region key/value)</h2>
        <p className="text-sm text-muted">
          <FileRef path="src/app/api/caching/runtime/route.ts" /> uses{" "}
          <code className="code">getCache()</code> from{" "}
          <code className="code">@vercel/functions</code> to memoize an
          expensive call across function invocations.
        </p>
        <a className="btn-secondary" href="/api/caching/runtime" target="_blank">
          Open /api/caching/runtime ↗
        </a>
      </section>
    </DemoShell>
  );
}
