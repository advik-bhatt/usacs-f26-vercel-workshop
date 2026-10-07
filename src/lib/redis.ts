import { Redis } from "@upstash/redis";

// Reads UPSTASH_REDIS_REST_URL/TOKEN, or KV_REST_API_URL/TOKEN if those
// aren't set — whichever names the Marketplace integration gave you.
export function hasRedis() {
  return !!(process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL);
}

let client: Redis | undefined;
export function getRedis() {
  client ??= Redis.fromEnv();
  return client;
}
