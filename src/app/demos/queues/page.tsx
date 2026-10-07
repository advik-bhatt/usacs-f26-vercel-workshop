import { send } from "@vercel/queue";
import { revalidatePath } from "next/cache";
import { DemoShell, FileRef } from "@/components/demo-shell";
import { getModule, missingEnv } from "@/lib/modules";
import { getRedis, hasRedis } from "@/lib/redis";

export const metadata = { title: "Queues" };
export const dynamic = "force-dynamic";


async function placeOrder(formData: FormData) {
  "use server";
  const item = String(formData.get("item") ?? "🍕 pizza");
  // Producer: returns as soon as the message is safely queued.
  await send("orders", { item, placedAt: new Date().toISOString() });
  revalidatePath("/demos/queues");
}

export default async function QueuesDemo() {
  const ready = missingEnv(getModule("queues")).length === 0;
  const processed = hasRedis() ? await getRedis().lrange<string>("workshop:orders", 0, 9) : null;

  return (
    <DemoShell slug="queues">
      {ready && (
        <section className="card space-y-3">
          <h2 className="font-medium">Place an order → processed in the background</h2>
          <p className="text-sm text-muted">
            Producer: <code className="code">send()</code> in{" "}
            <FileRef path="src/app/demos/queues/page.tsx" />. Consumer:{" "}
            <FileRef path="src/app/api/queues/consumer/route.ts" />.
          </p>
          <form action={placeOrder} className="flex gap-2">
            <select name="item" className="input">
              <option>🍕 pizza</option>
              <option>🌮 tacos</option>
              <option>🍜 ramen</option>
            </select>
            <button className="btn">Queue it</button>
          </form>
          <h3 className="pt-2 text-sm font-medium">Processed (refresh after ~2s)</h3>
          {processed === null ? (
            <p className="text-sm text-muted">
              Connect Redis (module 07d) to see results here; otherwise check the logs.
            </p>
          ) : (
            <ul className="font-mono text-xs">
              {processed.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          )}
        </section>
      )}
    </DemoShell>
  );
}
