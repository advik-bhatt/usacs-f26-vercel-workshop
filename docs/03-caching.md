# 03 · Caching, ISR & the CDN ★

**Demo page:** `/demos/caching` · **Time:** ~12 min


> ⚠️ `next dev` never caches pages. To see caching, test on a **deployment** or
> run `npm run build && npm start`.

Four layers, from coarse to fine:

| Layer | API | Where it lives |
|---|---|---|
| Whole page (ISR) | `export const revalidate = 30` | Vercel CDN + ISR cache |
| A piece of data | `unstable_cache(fn, keys, { tags })` / `fetch(url, { next: { tags } })` | Data cache |
| Any response | `Vercel-CDN-Cache-Control` header | Vercel CDN |
| Any value, from code | `getCache()` from `@vercel/functions` | Runtime Cache (per region) |

This repo uses the classic Next.js caching model. Next.js 16 also has an opt-in
**Cache Components** mode (`cacheComponents: true` + `"use cache"`); see
`node_modules/next/dist/docs/01-app/01-getting-started/08-caching.md`.

## 1. ISR: static pages that update themselves

At the top of `src/app/demos/caching/page.tsx`:

```ts
export const revalidate = 30; // seconds
```

The page is prerendered once, served from the CDN to everyone, and rebuilt in
the background at most every 30 seconds. Refresh repeatedly: the "rendered at"
timestamp only changes after 30s.

## 2. On-demand revalidation with Server Actions

```tsx
import { revalidatePath, unstable_cache, updateTag } from "next/cache";

const getLuckyNumber = unstable_cache(
  async () => ({ value: Math.floor(Math.random() * 1000) }),
  ["lucky-number"],
  { tags: ["lucky-number"], revalidate: 3600 },
);

async function purgePage() {
  "use server";
  revalidatePath("/demos/caching");   // rebuild the whole page
}

async function purgeTag() {
  "use server";
  updateTag("lucky-number");          // only this data, fresh on the next read
}

// in JSX:
<form action={purgeTag}><button>updateTag</button></form>
```

- `updateTag(tag)`: **Server Actions only**, and the next read waits for fresh data ("read-your-own-writes").
- `revalidateTag(tag, "max")`: works in Route Handlers too (e.g. a CMS webhook). It serves stale content while it refreshes.
- `revalidateTag(tag, { expire: 0 })`: expire immediately, from anywhere.

## 3. CDN cache headers on any response

`src/app/api/caching/cdn/route.ts`:

```ts
export async function GET() {
  return Response.json(
    { generatedAt: new Date().toISOString() },
    {
      headers: {
        "Cache-Control": "public, max-age=0, must-revalidate",               // browser
        "Vercel-CDN-Cache-Control": "s-maxage=10, stale-while-revalidate=60", // Vercel CDN only
      },
    },
  );
}
```

On your deployment run:

```bash
curl -sI https://<your-app>.vercel.app/api/caching/cdn | grep -i x-vercel-cache
```

The first request is a `MISS`; repeat within 10s and it's a `HIT`.

## 4. Runtime Cache

`src/app/api/caching/runtime/route.ts` memoizes a slow computation:

```ts
import { getCache } from "@vercel/functions";

const cache = getCache({ namespace: "workshop" });
let value = await cache.get("slow-answer");
if (value === null) {
  value = await slowComputation();
  await cache.set("slow-answer", value, { ttl: 60, tags: ["slow-answer"] });
}
```

The first call takes about 2s; later calls take about 0ms (`"hit": true`).

## ✅ Check

- On a deployment, `/demos/caching` keeps the same timestamp for 30s.
- Both purge buttons change what you see.
- `x-vercel-cache: HIT` on the second `curl`.

**Going further:** [CDN](https://vercel.com/docs/cdn) ·
`npx vercel cache --help` (purge the CDN / data cache from the CLI)

Next: **[04 · Routing →](04-routing.md)**
