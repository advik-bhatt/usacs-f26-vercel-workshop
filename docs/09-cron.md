# 09 · Cron Jobs ★

**Demo page:** `/demos/cron` · **Time:** ~5 min


A cron job is a normal route that Vercel calls on a schedule. It runs on the
**production** deployment only.

## 1. Add the job with the CLI

```bash
vercel env add CRON_SECRET production          # any long random string
vercel crons add --path /api/cron --schedule "0 9 * * *"
```

`crons add` writes the job into `vercel.json`:

```json
{
  "crons": [{ "path": "/api/cron", "schedule": "0 9 * * *" }]
}
```

`0 9 * * *` means every day at 09:00 **UTC** (standard 5-field cron syntax). On
Hobby a cron runs at most once a day; paid plans allow more frequent schedules.

## 2. Protect the route

Add an env var `CRON_SECRET` (any long random string). Vercel then sends it as
a bearer token on every cron invocation:

```ts
// src/app/api/cron/route.ts
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("Unauthorized", { status: 401 });
  }
  // … do the work: send digests, clean up rows, refresh caches …
  return Response.json({ ok: true });
}
```

Without the check, anyone who finds `/api/cron` can trigger your job.

## 3. Run it

```bash
vercel deploy --prod          # crons run uses what's deployed, so deploy first
vercel crons run /api/cron
vercel logs                   # look for "[cron] job ran"
```

You can also see the job under Project → **Settings → Cron Jobs**. The demo page also has a "Run now" Server Action and, if Redis
(07d) is connected, shows the last 10 runs.

## ✅ Check

- `curl https://<your-app>.vercel.app/api/cron` → `401`.
- `vercel crons run /api/cron` shows up in `vercel logs` (and on `/demos/cron` if Redis is connected).

Next: **[10 · Observability →](10-observability.md)**
