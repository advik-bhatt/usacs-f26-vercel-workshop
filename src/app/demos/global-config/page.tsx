import { getAll } from "@vercel/global-config";
import { DemoShell } from "@/components/demo-shell";
import { getModule, missingEnv } from "@/lib/modules";

export const metadata = { title: "Global Config" };
export const dynamic = "force-dynamic";

// get("key") reads one value; getAll() reads everything.
// Reads are served from Vercel's edge in ~single-digit ms.
async function readConfig() {
  const started = performance.now();
  const items = await getAll();
  return { items, took: Math.round(performance.now() - started) };
}

export default async function GlobalConfigDemo() {
  const ready = missingEnv(getModule("global-config")).length === 0;
  const { items, took } = ready ? await readConfig() : { items: {}, took: 0 };

  const banner = items["banner"];

  return (
    <DemoShell slug="global-config">
      {ready && (
        <>
          {typeof banner === "string" && (
            <div className="rounded-xl bg-accent p-4 text-center font-medium text-white">
              {banner}
            </div>
          )}
          <section className="card space-y-3">
            <h2 className="font-medium">
              Current Global Config{" "}
              <span className="text-sm font-normal text-muted">(read in {took}ms)</span>
            </h2>
            <pre className="pre">{JSON.stringify(items, null, 2)}</pre>
            <p className="text-sm text-muted">
              Flip <code className="code">maintenance</code> to{" "}
              <code className="code">true</code> and the whole site shows the
              maintenance page (proxy.ts reads it). Add a{" "}
              <code className="code">banner</code> string to show it here. No
              redeploy needed.
            </p>
          </section>
        </>
      )}
    </DemoShell>
  );
}
