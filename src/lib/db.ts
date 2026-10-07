import { neon } from "@neondatabase/serverless";

// Neon's HTTP driver: one fetch per query, perfect for serverless functions.
// The Marketplace integration injects the connection string for you.
export function getSql() {
  const url = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  return neon(url);
}
