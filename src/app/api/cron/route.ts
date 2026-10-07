import { runJob } from "@/lib/cron-job";

// Vercel calls this path on the schedule in vercel.json ("crons").
// If a CRON_SECRET env var exists, Vercel sends it as a Bearer token —
// reject everyone else so strangers can't trigger your job.
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");
  if (!secret || auth !== `Bearer ${secret}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const entry = await runJob("cron");
  return Response.json({ ok: true, ...entry });
}
