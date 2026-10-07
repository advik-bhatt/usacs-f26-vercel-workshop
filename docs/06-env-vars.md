# 06 · Environment Variables ★

**Demo page:** `/demos/env` · **Time:** ~7 min

## Three environments

Every variable can be set separately for **Production**, **Preview** (optionally
per branch) and **Development** (what `vercel env pull` downloads).

## 1. Add two variables

**Dashboard:** Project → **Settings → Environment Variables**:

| Key | Value | Environments |
|---|---|---|
| `GREETING` | `hi from prod` | Production |
| `GREETING` | `hi from a preview` | Preview |
| `GREETING` | `hi from my laptop` | Development |
| `NEXT_PUBLIC_WORKSHOP_GREETING` | anything (optional, for the client-side demo) | all |

**Or the CLI:**

```bash
npx vercel env add GREETING                   # prompts for value + environments
npx vercel env list
```

## 2. Use them

```bash
npx vercel env pull      # refresh .env.local
npm run dev
```

- **Server code** (Server Components, Route Handlers, Server Actions) can read any
  variable: `process.env.GREETING`. `src/app/api/hello/route.ts` is the place to
  try it: `Response.json({ hello: process.env.GREETING ?? "world" })`.
- **Client Components** only see variables prefixed with `NEXT_PUBLIC_`. They're
  **inlined into the JS bundle at build time**, so never put a secret in one.

```tsx
"use client";
export function Greeting() {
  return <p>{process.env.NEXT_PUBLIC_WORKSHOP_GREETING}</p>;
}
```

## 3. Redeploy!

Changing a variable (`vercel env update GREETING`) does **not** affect existing
deployments. Trigger a new one (`vercel deploy --prod`, push a commit, or
`npx vercel redeploy <url>`). Production and Preview values are **Sensitive**
by default, so you can't read them back. Keep your own copy.
Then compare `/demos/env` on production vs a preview.

## System variables & OIDC

Vercel also injects `VERCEL_ENV`, `VERCEL_URL`, `VERCEL_GIT_COMMIT_SHA`… (module
01 shows them all) and, with
[OIDC federation](https://vercel.com/docs/oidc), a short-lived
`VERCEL_OIDC_TOKEN`. Vercel services (AI Gateway, Blob, Sandbox, Queues) and
cloud providers (AWS, GCP, Azure) can trust that token instead of a long-lived
API key.

Bonus: `npx vercel env run -- <command>` runs any command with the project's
env vars without writing a file.

## ✅ Check

- `/demos/env` and `/api/hello` show a GREETING that differs between production and preview.

Next: **[07 · Storage →](07-storage.md)**
