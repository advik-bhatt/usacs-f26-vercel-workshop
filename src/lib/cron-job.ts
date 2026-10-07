import { getRedis, hasRedis } from "@/lib/redis";


// The actual "job". Here it just records a heartbeat; in real life: send
// digest emails, clean up old rows, refresh a cache, sync an API…
export async function runJob(trigger: "cron" | "manual") {
  const entry = { at: new Date().toISOString(), trigger };
  console.log("[cron] job ran", entry);
  if (hasRedis()) {
    await getRedis().lpush("workshop:cron", JSON.stringify(entry));
    await getRedis().ltrim("workshop:cron", 0, 9);
  }
  return entry;
}

export async function recentRuns() {
  if (!hasRedis()) return null;
  // @upstash/redis auto-parses JSON strings back into objects.
  return getRedis().lrange<{ at: string; trigger: string }>("workshop:cron", 0, 9);
}
