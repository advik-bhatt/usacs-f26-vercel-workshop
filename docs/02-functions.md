# 02 · Vercel Functions ★

**Demo page:** `/demos/functions` · **Time:** ~10 min


Every `route.ts` inside `src/app` is a **Route Handler**, and on Vercel each
one runs as a **Vercel Function** (Node.js, with
[Fluid compute](https://vercel.com/docs/fluid-compute): instances are reused
across concurrent requests, so cold starts are rare and you pay for active CPU).
Server Components and Server Actions run on Functions too.

## 1. A JSON endpoint with geolocation

Create `src/app/api/functions/hello/route.ts`:

```ts
import { geolocation, ipAddress, getEnv, waitUntil } from "@vercel/functions";
import { after } from "next/server";

export async function GET(request: Request) {
  const geo = geolocation(request);     // { city, country, region, latitude, … }
  const ip = ipAddress(request);
  const { VERCEL_REGION } = getEnv();

  // Background work that runs AFTER the response is sent
  waitUntil(new Promise((r) => setTimeout(r, 1000)).then(() => console.log("done")));
  after(() => console.log("response finished"));   // Next.js built-in equivalent

  return Response.json({ geo, ip, region: VERCEL_REGION ?? "local" });
}
```

Visit `/api/functions/hello`. Locally `geo` is mostly empty. **Push and try it
on your deployment** to see your real city. Then check the dashboard →
**Logs** to see the `waitUntil` / `after` lines appear after the request.

## 2. A streaming response

`src/app/api/functions/stream/route.ts`:

```ts
export const maxDuration = 30; // optional: max seconds this function may run

export async function GET() {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      for (const word of "hello from a streaming function".split(" ")) {
        controller.enqueue(encoder.encode(word + " "));
        await new Promise((r) => setTimeout(r, 150));
      }
      controller.close();
    },
  });
  return new Response(stream, { headers: { "Content-Type": "text/plain" } });
}
```

`curl -N localhost:3000/api/functions/stream` prints the words one by one.
This is the same mechanism AI chat uses in module 08.

## Config knobs (per route file)

```ts
export const maxDuration = 60;         // seconds (see plan limits)
export const dynamic = "force-dynamic"; // never cache
```

Project-wide settings (default region, memory/CPU, Fluid compute) live in the
dashboard → **Settings → Functions**. See
[duration](https://vercel.com/docs/functions/configuring-functions/duration) and
[memory](https://vercel.com/docs/functions/configuring-functions/memory).

## ✅ Check

- `/api/functions/hello` on your deployment shows your city and a region like `iad1`.
- The stream button on `/demos/functions` prints words progressively.

Next: **[03 · Caching →](03-caching.md)**
