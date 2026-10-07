import { getRun } from "workflow/api";

export async function GET(request: Request) {
  const runId = new URL(request.url).searchParams.get("runId");
  if (!runId) return Response.json({ error: "runId required" }, { status: 400 });

  const run = getRun(runId);
  if (!(await run.exists)) {
    return Response.json({ error: "not found" }, { status: 404 });
  }

  const status = await run.status; // pending | running | completed | failed | cancelled
  const result = status === "completed" ? await run.returnValue : null;
  return Response.json({ runId, status, result });
}
