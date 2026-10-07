import { track } from "@vercel/analytics/server";

// Server-side custom event — useful for things that happen on the backend
// (a purchase completed, a signup verified…).
export async function POST(request: Request) {
  await track("Server Ping", { source: "workshop" }, { request });
  return Response.json({ ok: true });
}
