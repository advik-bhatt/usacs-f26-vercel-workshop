import { DemoShell } from "@/components/demo-shell";

export const metadata = { title: "Deploy" };
// Render on every request so the values reflect *this* deployment.
export const dynamic = "force-dynamic";

// Vercel injects these "system environment variables" into every build and
// function. Nothing to configure — they're just there.
const SYSTEM_VARS = [
  ["VERCEL", "\"1\" whenever the code runs on Vercel"],
  ["VERCEL_ENV", "production | preview | development"],
  ["VERCEL_URL", "Unique URL of this exact deployment"],
  ["VERCEL_BRANCH_URL", "Stable URL for the Git branch"],
  ["VERCEL_PROJECT_PRODUCTION_URL", "Your production domain"],
  ["VERCEL_REGION", "Region the function is running in"],
  ["VERCEL_DEPLOYMENT_ID", "ID of this deployment"],
  ["VERCEL_GIT_COMMIT_REF", "Branch that was deployed"],
  ["VERCEL_GIT_COMMIT_SHA", "Commit that was deployed"],
  ["VERCEL_GIT_COMMIT_MESSAGE", "Commit message"],
  ["VERCEL_GIT_COMMIT_AUTHOR_LOGIN", "Who pushed it"],
] as const;

export default function DeployDemo() {
  const env = process.env.VERCEL_ENV ?? "local (next dev)";

  return (
    <DemoShell slug="deploy">
      <div className="card flex flex-wrap items-center gap-4">
        <span className="text-sm text-muted">You are looking at</span>
        <span
          className={`rounded-full px-3 py-1 font-mono text-sm ${
            env === "production"
              ? "bg-green-500/15 text-green-600 dark:text-green-400"
              : env === "preview"
                ? "bg-blue-500/15 text-blue-600 dark:text-blue-400"
                : "bg-neutral-500/15"
          }`}
        >
          {env}
        </span>
        <span className="text-sm text-muted">
          Push a branch → you get a <b>preview</b>. Merge to main → it becomes{" "}
          <b>production</b>.
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-muted">
            <tr>
              <th className="py-2 pr-4 font-normal">System env var</th>
              <th className="py-2 pr-4 font-normal">Value right now</th>
              <th className="py-2 font-normal">Meaning</th>
            </tr>
          </thead>
          <tbody className="font-mono">
            {SYSTEM_VARS.map(([name, meaning]) => (
              <tr key={name} className="border-t border-border">
                <td className="py-2 pr-4">{name}</td>
                <td className="max-w-[16rem] truncate py-2 pr-4">
                  {process.env[name] ?? <span className="text-muted">—</span>}
                </td>
                <td className="py-2 font-sans text-muted">{meaning}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DemoShell>
  );
}
