import { headers } from "next/headers";
import { geolocation } from "@vercel/functions";
import { DemoShell, FileRef } from "@/components/demo-shell";
import { getModule, missingEnv } from "@/lib/modules";
import { getRedis } from "@/lib/redis";

export const metadata = { title: "Redis" };
export const dynamic = "force-dynamic";

export default async function RedisDemo() {
  const ready = missingEnv(getModule("redis")).length === 0;
  let views = 0;
  let recent: string[] = [];

  if (ready) {
    const { city, country } = geolocation({ headers: await headers() });
    const where = city ? `${decodeURIComponent(city)}, ${country}` : "localhost";

    const redis = getRedis();
    // Atomic counter + a capped list of the last 10 visitor locations.
    views = await redis.incr("workshop:views");
    await redis.lpush("workshop:recent", `${where} @ ${new Date().toISOString()}`);
    await redis.ltrim("workshop:recent", 0, 9);
    recent = await redis.lrange<string>("workshop:recent", 0, 9);
  }

  return (
    <DemoShell slug="redis">
      {ready && (
        <>
          <section className="card text-center">
            <p className="text-sm text-muted">This page has been viewed</p>
            <p className="font-mono text-6xl font-semibold">{views}</p>
            <p className="text-sm text-muted">times (refresh me!)</p>
          </section>
          <section className="card space-y-2">
            <h2 className="font-medium">Last 10 visitors</h2>
            <p className="text-sm text-muted">
              <FileRef path="src/app/demos/redis/page.tsx" /> —{" "}
              <code className="code">incr</code>,{" "}
              <code className="code">lpush</code>,{" "}
              <code className="code">ltrim</code>,{" "}
              <code className="code">lrange</code>.
            </p>
            <ul className="font-mono text-sm">
              {recent.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </section>
        </>
      )}
    </DemoShell>
  );
}
