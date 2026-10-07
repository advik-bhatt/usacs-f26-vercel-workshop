import { revalidatePath } from "next/cache";
import { DemoShell, FileRef } from "@/components/demo-shell";
import { recentRuns, runJob } from "@/lib/cron-job";

export const metadata = { title: "Cron" };
export const dynamic = "force-dynamic";

async function runNow() {
  "use server";
  await runJob("manual");
  revalidatePath("/demos/cron");
}

export default async function CronDemo() {
  const runs = await recentRuns();

  return (
    <DemoShell slug="cron">
      <section className="card space-y-3 text-sm">
        <h2 className="font-medium">How it&apos;s wired</h2>
        <pre className="pre">{`vercel env add CRON_SECRET production
vercel crons add --path /api/cron --schedule "0 9 * * *"
vercel deploy --prod
vercel crons run /api/cron`}</pre>
        <p className="text-muted">
          <code className="code">crons add</code> writes the job into{" "}
          <code className="code">vercel.json</code>. On schedule (9:00 UTC daily,
          the most Hobby allows), Vercel sends{" "}
          <code className="code">GET /api/cron</code> to your production
          deployment with <code className="code">Authorization: Bearer $CRON_SECRET</code>.
          Handler: <FileRef path="src/app/api/cron/route.ts" />. See runs under
          Project → Settings → Cron Jobs, or fire it now with{" "}
          <code className="code">vercel crons run /api/cron</code> and watch{" "}
          <code className="code">vercel logs</code>.
        </p>
        <form action={runNow}>
          <button className="btn">Run the job now (Server Action)</button>
        </form>
      </section>

      <section className="card space-y-2">
        <h2 className="font-medium">Last 10 runs</h2>
        {runs === null ? (
          <p className="text-sm text-muted">
            Connect Redis (module 07d) to persist run history. Until then, runs
            only show up in your function logs.
          </p>
        ) : runs.length === 0 ? (
          <p className="text-sm text-muted">No runs yet.</p>
        ) : (
          <ul className="font-mono text-sm">
            {runs.map((r, i) => (
              <li key={i}>
                {r.at} — {r.trigger}
              </li>
            ))}
          </ul>
        )}
      </section>
    </DemoShell>
  );
}
