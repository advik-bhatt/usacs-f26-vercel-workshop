import { start } from "workflow/api";
import { welcome } from "@/workflows/onboarding";

export async function POST(request: Request) {
  const { email } = (await request.json()) as { email: string };
  // start() enqueues the run and returns immediately.
  const run = await start(welcome, [email]);
  return Response.json({ runId: run.runId });
}
