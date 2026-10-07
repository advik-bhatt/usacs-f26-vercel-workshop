import { DemoShell, FileRef } from "@/components/demo-shell";
import { HelloButton, StreamButton } from "./client";

export const metadata = { title: "Functions" };

export default function FunctionsDemo() {
  return (
    <DemoShell slug="functions">
      <section className="card space-y-3">
        <h2 className="font-medium">1. A JSON API with geolocation</h2>
        <p className="text-sm text-muted">
          <FileRef path="src/app/api/functions/hello/route.ts" /> — reads the
          visitor&apos;s city/country/IP from Vercel&apos;s request headers and
          uses <code className="code">waitUntil</code> +{" "}
          <code className="code">after()</code> for background work. Check the
          function logs in the dashboard to see them fire.
        </p>
        <HelloButton />
      </section>

      <section className="card space-y-3">
        <h2 className="font-medium">2. A streaming response</h2>
        <p className="text-sm text-muted">
          <FileRef path="src/app/api/functions/stream/route.ts" /> — returns a{" "}
          <code className="code">ReadableStream</code>; the browser renders
          words as they arrive.
        </p>
        <StreamButton />
      </section>
    </DemoShell>
  );
}
