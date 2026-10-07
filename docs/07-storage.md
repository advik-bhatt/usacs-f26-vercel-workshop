# 07 · Storage ★

**Demo pages:** `/demos/blob`, `/demos/global-config`, `/demos/postgres`, `/demos/redis` · **Time:** ~20 min


| Need | Product | Package |
|---|---|---|
| Files (images, video, uploads) | **Vercel Blob** | `@vercel/blob` |
| Tiny, read-heavy global config | **Global Config** (formerly Edge Config) | `@vercel/global-config` |
| Relational data | **Postgres** from the Marketplace (we use **Neon**) | `@neondatabase/serverless` |
| Key/value, counters, queues, sessions | **Redis** from the Marketplace (we use **Upstash**) | `@upstash/redis` |

Creating a store and **connecting** it to your project adds its env vars
automatically. After each one, run `npx vercel env pull` and restart `npm run dev`.

---

## 07a · Vercel Blob

**Create:** Project → **Storage** → **Create** → **Blob**, choose **public**
access, and connect it to the project. Or from the CLI:

```bash
npx vercel blob create-store workshop-blob --access public
```

This adds `BLOB_READ_WRITE_TOKEN`.

**Server Action upload** (`src/app/demos/blob/actions.ts`):

```ts
"use server";
import { put, del } from "@vercel/blob";
import { revalidatePath } from "next/cache";

export async function uploadImage(formData: FormData) {
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return;
  await put(`workshop/${file.name}`, file, {
    access: "public",
    addRandomSuffix: true,  // otherwise uploading the same name twice throws
  });
  revalidatePath("/demos/blob");
}
```

```tsx
<form action={uploadImage}>
  <input type="file" name="file" accept="image/*" />
  <button>Upload</button>
</form>
```

**List & delete:** `const { blobs } = await list({ prefix: "workshop/" })` and `await del(url)`.

**Big files → client uploads.** Function request bodies are capped at 4.5 MB,
so for larger files the browser uploads **directly** to Blob using a token from
your route (`src/app/api/blob/upload/route.ts` + `upload()` from
`@vercel/blob/client`). See
[client uploads](https://vercel.com/docs/vercel-blob/client-upload).

CLI goodies: `npx vercel blob list`, `npx vercel blob put ./file.png`.

---

## 07b · Global Config (formerly Edge Config)

A global, read-optimized JSON store for switches, redirects, allow/block lists
and banners. Reads are extremely fast, and you **change values without
redeploying**. Edge Config was renamed Global Config, and
`@vercel/global-config` is the drop-in replacement for `@vercel/edge-config`.

**Create:**

```bash
vercel global-config add site --items '{"maintenance":false}'
vercel global-config items site
```

Then connect it to your project: in the dashboard, open **Storage →** the
`site` store → **Connect Project**. That adds
the connection-string env var (`@vercel/global-config` reads `GLOBAL_CONFIG`,
falling back to `EDGE_CONFIG`). Then `vercel env pull` and redeploy.

**Read it.** `src/proxy.ts` checks `maintenance` on every page request:

```ts
import { get } from "@vercel/global-config";

if ((await get<boolean>("maintenance")) === true) {
  return NextResponse.rewrite(new URL("/maintenance", request.url));
}
```

and `src/app/demos/global-config/page.tsx` shows everything with `getAll()`.
Set `maintenance` to `true` in the dashboard, refresh, and the whole site shows
🚧. No deploy. Changes can take up to ~10s to reach every region.
(In `next dev` there's a short dev cache, so you might need two refreshes.)

---

## 07c · Postgres (Neon via Vercel Marketplace)

**Create:** Project → **Storage** → **Create** → pick **Neon** (Postgres) →
accept the free plan → connect to the project. Or from the CLI:

```bash
npx vercel integration add postgres   # search by keyword, then pick Neon
```

This adds a connection string. The demo reads `DATABASE_URL` (falling back to
`POSTGRES_URL`), so check which name you got under Settings → Environment
Variables.

**Query** (`src/lib/db.ts` + `src/app/demos/postgres/page.tsx`):

```ts
import { neon } from "@neondatabase/serverless";
const sql = neon(process.env.DATABASE_URL!);

await sql`CREATE TABLE IF NOT EXISTS guestbook (
  id SERIAL PRIMARY KEY, name TEXT NOT NULL, message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now())`;

// ${} values become query parameters, which is safe from SQL injection
await sql`INSERT INTO guestbook (name, message) VALUES (${name}, ${message})`;
const rows = await sql`SELECT * FROM guestbook ORDER BY created_at DESC LIMIT 20`;
```

> `sql` must be used as a tagged template. For dynamic SQL strings use
> `sql.query("SELECT … WHERE id = $1", [id])`.

Neon also gives you **database branching**, so each preview deployment can get
its own copy of the database. Look for it in the integration's settings.

---

## 07d · Redis (Upstash via Vercel Marketplace)

**Create:** Project → **Storage** → **Create** → **Upstash** (Redis) → free
plan → connect. Or `npx vercel integration add redis`.

This adds `KV_REST_API_URL` / `KV_REST_API_TOKEN` (and/or
`UPSTASH_REDIS_REST_*`). `Redis.fromEnv()` understands both.

```ts
import { Redis } from "@upstash/redis";
const redis = Redis.fromEnv();

const views = await redis.incr("workshop:views");       // atomic counter
await redis.lpush("workshop:recent", "New Brunswick");  // push to a list
await redis.ltrim("workshop:recent", 0, 9);             // keep the last 10
const recent = await redis.lrange("workshop:recent", 0, 9);
await redis.set("session:abc", { user: "scarlet" }, { ex: 60 }); // TTL in seconds
```

Modules 09 (cron) and 13 (queues) also use Redis to show their results, if it's
connected.

## ✅ Check

- Upload an image → it appears in the gallery (and in Storage → Blob → Browser).
- Sign the guestbook → your message persists across refreshes and deployments.
- The Redis counter goes up on every refresh.

**Docs:** [Blob](https://vercel.com/docs/vercel-blob) · [Redis](https://vercel.com/docs/redis)

Next: **[08 · AI →](08-ai.md)**
