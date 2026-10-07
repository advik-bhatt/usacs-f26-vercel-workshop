import { DemoShell, FileRef } from "@/components/demo-shell";
import { TrackButtons } from "./track-buttons";

export const metadata = { title: "Analytics" };

export default function AnalyticsDemo() {
  return (
    <DemoShell slug="analytics">
      <section className="card space-y-2 text-sm text-muted">
        <h2 className="font-medium text-foreground">Already on every page</h2>
        <p>
          <FileRef path="src/app/layout.tsx" /> renders{" "}
          <code className="code">&lt;Analytics /&gt;</code> (page views, referrers,
          countries, devices) and <code className="code">&lt;SpeedInsights /&gt;</code>{" "}
          (real-user Core Web Vitals: LCP, INP, CLS…). Turn both on in the
          dashboard: Project → Analytics → Enable, and Project → Speed Insights →
          Enable.
        </p>
      </section>

      <section className="card space-y-3">
        <h2 className="font-medium">Custom events</h2>
        <TrackButtons />
      </section>

      <section className="card space-y-2 text-sm text-muted">
        <h2 className="font-medium text-foreground">Beyond analytics</h2>
        <ul className="list-inside list-disc space-y-1">
          <li>
            <b>Logs</b>: Project → Logs, or <code className="code">vercel logs --follow</code>.
          </li>
          <li>
            <b>Observability</b>: per-route function invocations, duration,
            errors, cache hit rate, external API calls.
          </li>
          <li>
            <b>Drains</b>: stream logs / traces / analytics to Datadog, Axiom,
            your own endpoint…
          </li>
          <li>
            <b>OpenTelemetry</b>: <code className="code">@vercel/otel</code> in{" "}
            <code className="code">instrumentation.ts</code> for custom traces.
          </li>
        </ul>
      </section>
    </DemoShell>
  );
}
