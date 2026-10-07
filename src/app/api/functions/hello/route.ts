import { geolocation, ipAddress, getEnv, waitUntil } from "@vercel/functions";
import { after } from "next/server";

// A Route Handler = a Vercel Function. Every file named route.ts under /app
// becomes its own HTTP endpoint. This one lives at GET /api/functions/hello.

export async function GET(request: Request) {
  const started = Date.now();

  // Vercel adds geo + IP headers to every request; these helpers parse them.
  // Locally they're empty — deploy to see real values.
  const geo = geolocation(request);
  const ip = ipAddress(request);
  const { VERCEL_REGION, VERCEL_ENV } = getEnv();

  // waitUntil: keep the function alive for background work AFTER the
  // response is sent. The user doesn't wait for this.
  waitUntil(
    new Promise((resolve) => setTimeout(resolve, 1000)).then(() =>
      console.log("[waitUntil] finished 1s of background work"),
    ),
  );

  // after(): Next.js' built-in equivalent — runs once the response finishes.
  after(() => {
    console.log(`[after] responded in ${Date.now() - started}ms`);
  });

  return Response.json({
    message: "Hello from a Vercel Function 👋",
    geo,
    ip: ip ?? null,
    region: VERCEL_REGION ?? "local",
    env: VERCEL_ENV ?? "development",
    node: process.version,
    time: new Date().toISOString(),
  });
}
