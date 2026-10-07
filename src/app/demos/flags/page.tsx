import { DemoShell, FileRef } from "@/components/demo-shell";
import { getModule, missingEnv } from "@/lib/modules";
import { heroVariant, showConfetti } from "@/flags";

export const metadata = { title: "Flags" };
export const dynamic = "force-dynamic";

const HEADLINES: Record<string, string> = {
  classic: "Ship features safely.",
  bold: "SHIP. IT. NOW.",
  rutgers: "Scarlet Knights ship on Fridays 🛡️",
};

export default async function FlagsDemo() {
  const ready = missingEnv(getModule("flags")).length === 0;
  const variant = ready ? await heroVariant() : "classic";
  const confetti = ready ? await showConfetti() : false;

  return (
    <DemoShell slug="flags">
      <section className="card space-y-2 text-center">
        <p className="font-mono text-xs text-muted">hero-variant = {variant}</p>
        <h2 className="text-3xl font-semibold">{HEADLINES[variant] ?? variant}</h2>
        {confetti && <p className="text-4xl">🎉🎊🎉🎊🎉</p>}
        <p className="font-mono text-xs text-muted">show-confetti = {String(confetti)}</p>
      </section>

      <section className="card space-y-2 text-sm text-muted">
        <h2 className="font-medium text-foreground">Flip them</h2>
        <ol className="list-inside list-decimal space-y-1">
          <li>
            Flags are defined in <FileRef path="src/flags.ts" />.
          </li>
          <li>
            Open the Vercel Toolbar (bottom of the page on preview deployments,
            or locally after <code className="code">vercel link</code>) → Flags
            Explorer.
          </li>
          <li>Override a value and refresh — only your browser sees it.</li>
        </ol>
      </section>
    </DemoShell>
  );
}
