# 04 · Routing: Proxy, Redirects, Rewrites & Headers ★

**Demo page:** `/demos/routing` · **Time:** ~8 min


Two tools:

- **`vercel.json`**: declarative rules evaluated by Vercel's CDN. No code runs.
- **`src/proxy.ts`**: code that runs before a request is handled (in Next.js 16,
  *Middleware* was renamed *Proxy*). Use it when the decision needs request data:
  cookies, geo, headers.

## 1. Redirects, rewrites & headers in `vercel.json`

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "redirects": [
    { "source": "/workshop", "destination": "/", "permanent": true },
    { "source": "/docs/:slug", "destination": "https://vercel.com/docs/:slug", "permanent": false }
  ],
  "headers": [
    {
      "source": "/demos/routing(.*)",
      "headers": [{ "key": "x-workshop-demo", "value": "set by vercel.json" }]
    }
  ]
}
```

- **Redirect**: the browser is told to go elsewhere, so the URL changes (308 permanent / 307 temporary).
- **Rewrite**: served from another path or URL; the address bar doesn't change
  (`proxy.ts` uses one for the A/B test below).

Push, then try `/workshop` and `/docs/functions` on your deployment. (`next dev` ignores `vercel.json`; use `npx vercel dev` to test
locally.)

> **Prefer TypeScript?** Vercel also reads a `vercel.ts` file (via the
> `@vercel/config` package) with typed helpers like `routes.redirect(…)`. This
> repo sticks with `vercel.json` because the Queues SDK's local-dev mode (module
> 13) reads `vercel.json` directly. You can't have both files at once.

## 2. `src/proxy.ts`: a cookie gate, a maintenance switch, and an A/B test

`src/proxy.ts` also redirects `/secret` home unless the `workshop-secret`
cookie is set (get it at `/unlock`), and rewrites every page to `/maintenance`
when the Global Config item `maintenance` is `true` (see [07](07-storage.md)).
Check the gate with `vercel curl /secret -I`. Here's the A/B part:

```ts
import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/demos/routing/experiment") {
    let bucket = request.cookies.get("workshop-bucket")?.value;
    if (bucket !== "a" && bucket !== "b") bucket = Math.random() < 0.5 ? "a" : "b";

    const url = request.nextUrl.clone();
    url.pathname = `/demos/routing/experiment/${bucket}`;
    const res = NextResponse.rewrite(url);                  // URL stays the same
    res.cookies.set("workshop-bucket", bucket, { path: "/" }); // sticky
    return res;
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|\\.well-known|favicon.ico).*)"],
};
```

The two variants are ordinary static pages in
`src/app/demos/routing/experiment/[bucket]/page.tsx`. Open
`/demos/routing/experiment` in a normal window and a private window: you may
land in different buckets, and the URL never changes.

> The matcher skips API routes, static files and `.well-known` endpoints. Proxy
> runs before the cache on every matching request, so keep it fast.

## ✅ Check

- `/workshop` redirects home (on a deployment).
- DevTools → Network shows `x-workshop-proxy` and `x-workshop-demo` headers on `/demos/routing`.

Next: **[05 · Images & OG →](05-images-og.md)**
