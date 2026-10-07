import { handleCallback } from "@vercel/queue";
import { getRedis, hasRedis } from "@/lib/redis";

type Order = { item: string; placedAt: string };


// Consumer: Vercel invokes this function for every message on the
// "orders" topic (wired up in vercel.json → functions →
// experimentalTriggers). Throw an error and the message is retried.
export const POST = handleCallback<Order>(async (order, metadata) => {
  await new Promise((r) => setTimeout(r, 2000)); // pretend to do slow work
  const line = `${order.item} — placed ${order.placedAt}, processed ${new Date().toISOString()} (attempt ${metadata.deliveryCount})`;
  console.log("[queue]", line);
  if (hasRedis()) {
    await getRedis().lpush("workshop:orders", line);
    await getRedis().ltrim("workshop:orders", 0, 9);
  }
});
