import { getCache } from "@vercel/functions";

// The Runtime Cache is a key/value cache shared by all function instances in
// a region. Great for memoizing slow API or DB calls. Locally it falls back
// to an in-memory cache, so the demo still works with `npm run dev`.

async function slowComputation() {
  await new Promise((r) => setTimeout(r, 2000)); // pretend this is expensive
  return { answer: 42, computedAt: new Date().toISOString() };
}

export async function GET() {
  const cache = getCache({ namespace: "workshop" });
  const started = Date.now();

  let value = await cache.get("slow-answer");
  const hit = value !== null;

  if (!hit) {
    value = await slowComputation();
    await cache.set("slow-answer", value, { ttl: 60, tags: ["slow-answer"] });
  }

  return Response.json({ hit, tookMs: Date.now() - started, value });
}
