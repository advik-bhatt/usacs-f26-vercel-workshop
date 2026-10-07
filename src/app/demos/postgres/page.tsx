import { revalidatePath } from "next/cache";
import { DemoShell, FileRef } from "@/components/demo-shell";
import { getModule, missingEnv } from "@/lib/modules";
import { getSql } from "@/lib/db";

export const metadata = { title: "Postgres" };
export const dynamic = "force-dynamic";

type Entry = { id: number; name: string; message: string; created_at: string };

async function ensureTable() {
  const sql = getSql();
  await sql`
    CREATE TABLE IF NOT EXISTS guestbook (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )`;
}

async function sign(formData: FormData) {
  "use server";
  const name = String(formData.get("name") ?? "").trim().slice(0, 40);
  const message = String(formData.get("message") ?? "").trim().slice(0, 280);
  if (!name || !message) return;

  const sql = getSql();
  // ${...} values are sent as query parameters — safe from SQL injection.
  await sql`INSERT INTO guestbook (name, message) VALUES (${name}, ${message})`;
  revalidatePath("/demos/postgres");
}

export default async function PostgresDemo() {
  const ready = missingEnv(getModule("postgres")).length === 0;
  let entries: Entry[] = [];

  if (ready) {
    await ensureTable();
    const sql = getSql();
    entries = (await sql`
      SELECT id, name, message, created_at
      FROM guestbook ORDER BY created_at DESC LIMIT 20`) as Entry[];
  }

  return (
    <DemoShell slug="postgres">
      {ready && (
        <>
          <section className="card space-y-3">
            <h2 className="font-medium">Sign the USACS guestbook</h2>
            <p className="text-sm text-muted">
              Server Action + <code className="code">neon()</code> from{" "}
              <FileRef path="src/lib/db.ts" />.
            </p>
            <form action={sign} className="grid gap-2 sm:grid-cols-[1fr_2fr_auto]">
              <input name="name" placeholder="Your name" className="input" required />
              <input name="message" placeholder="Say hi 👋" className="input" required />
              <button className="btn">Sign</button>
            </form>
          </section>
          <ul className="space-y-2">
            {entries.map((e) => (
              <li key={e.id} className="card py-3">
                <span className="font-medium">{e.name}</span>{" "}
                <span className="text-muted">— {e.message}</span>
                <span className="float-right font-mono text-xs text-muted">
                  {new Date(e.created_at).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </DemoShell>
  );
}
