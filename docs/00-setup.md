# 00 · Setup (before the workshop, ~10 min)

**Goal:** your own copy of this app, deployed on Vercel and linked to your
laptop.

## You need

- A **GitHub** account
- A **Vercel** account: sign up at [vercel.com/signup](https://vercel.com/signup) with GitHub (Hobby plan is free)
- **Node.js 22+** (`node -v`); the AI SDK v7 requires it
- **Git** and a code editor

## 1. Fork & clone

1. On GitHub, click **Fork** on this repo.
2. Clone **your fork**:

```bash
git clone https://github.com/<your-username>/usacs-f26-vercel-workshop
cd usacs-f26-vercel-workshop
npm install
npm run dev
```

Open http://localhost:3000. You should see the module list.

## 2. Install the CLI, deploy, connect GitHub

```bash
npm i -g vercel        # or use the pinned copy: npx vercel …
vercel login
vercel whoami          # prints your username → ready

vercel link            # create a new project for this folder
vercel deploy --prod   # prints your production .vercel.app URL
vercel git connect     # from now on, git push deploys
vercel env pull        # writes .env.local (incl. a short-lived VERCEL_OIDC_TOKEN)
```

`vercel link` creates a `.vercel/` folder (git-ignored) that remembers which
project this folder belongs to. The `VERCEL_OIDC_TOKEN` from `vercel env pull`
lets your laptop call AI Gateway, Sandbox, Queues and Vercel Flags as your
project. It lasts about 12 hours, so pull again when it expires.

## ✅ Check

- `npm run dev` works locally
- `vercel whoami` prints your username
- Your `.vercel.app` URL loads
- `.env.local` exists

Next: follow **[push-to-prod.md](push-to-prod.md)** during the session, or **[01 · Deploy →](01-deploy.md)** for the deep dive.
