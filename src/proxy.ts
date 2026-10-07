import { NextResponse, type NextRequest } from "next/server";
import { get } from "@vercel/global-config";

// proxy.ts (called middleware.ts before Next.js 16) runs BEFORE the cache,
// on every request that matches `config.matcher` below. On Vercel it's
// deployed as Routing Middleware. It does three things here:
//
//   1. /secret      → no `workshop-secret` cookie? Redirect home.   (slide 20)
//   2. maintenance  → Global Config item `maintenance: true`?
//                     Show /maintenance instead of the site.        (slide 26)
//   3. /demos/routing/experiment → 50/50 A/B test with a sticky cookie
//                     (a rewrite: the URL in the browser never changes).

const BUCKET_COOKIE = "workshop-bucket";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Gate /secret behind a cookie (get it by visiting /unlock).
  if (pathname.startsWith("/secret") && !request.cookies.has("workshop-secret")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 2. Maintenance switch, read from Global Config in about a millisecond.
  //    Skipped until a Global Config store is connected (GLOBAL_CONFIG env var).
  if (
    (process.env.GLOBAL_CONFIG || process.env.EDGE_CONFIG) &&
    pathname !== "/maintenance"
  ) {
    try {
      if ((await get<boolean>("maintenance")) === true) {
        return NextResponse.rewrite(new URL("/maintenance", request.url));
      }
    } catch (err) {
      console.error("[proxy] Global Config read failed", err);
    }
  }

  // 3. A/B test.
  if (pathname === "/demos/routing/experiment") {
    let bucket = request.cookies.get(BUCKET_COOKIE)?.value;
    if (bucket !== "a" && bucket !== "b") {
      bucket = Math.random() < 0.5 ? "a" : "b";
    }
    const url = request.nextUrl.clone();
    url.pathname = `/demos/routing/experiment/${bucket}`;
    const res = NextResponse.rewrite(url);
    res.cookies.set(BUCKET_COOKIE, bucket, { path: "/", maxAge: 60 * 60 * 24 });
    res.headers.set("x-workshop-bucket", bucket);
    return res;
  }

  const res = NextResponse.next();
  res.headers.set("x-workshop-proxy", "hello from proxy.ts");
  return res;
}

// Run on pages, but skip static files, image optimization, API routes and
// the .well-known endpoints used by Workflow and the Flags Explorer.
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|\\.well-known|favicon.ico).*)"],
};
