import Link from "next/link";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return [{ bucket: "a" }, { bucket: "b" }];
}

export default async function Variant({
  params,
}: PageProps<"/demos/routing/experiment/[bucket]">) {
  const { bucket } = await params;
  if (bucket !== "a" && bucket !== "b") notFound();

  const variant =
    bucket === "a"
      ? { name: "Variant A", color: "bg-blue-500", cta: "Start building" }
      : { name: "Variant B", color: "bg-fuchsia-500", cta: "Ship it now 🚀" };

  return (
    <div className="space-y-6">
      <Link href="/demos/routing" className="text-sm text-muted">
        ← Routing demo
      </Link>
      <div className={`rounded-2xl p-10 text-white ${variant.color}`}>
        <p className="font-mono text-sm opacity-80">
          proxy.ts put you in bucket “{bucket}”
        </p>
        <h1 className="mt-2 text-4xl font-semibold">{variant.name}</h1>
        <button className="mt-6 rounded-lg bg-white px-4 py-2 font-medium text-black">
          {variant.cta}
        </button>
      </div>
      <p className="text-sm text-muted">
        The address bar still says <code className="code">/demos/routing/experiment</code>.
        Clear the <code className="code">workshop-bucket</code> cookie (or open
        a private window) to get re-rolled.
      </p>
    </div>
  );
}
