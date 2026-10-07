# 01 · Deploy, Previews & Rollbacks ★

**Demo page:** `/demos/deploy` · **Time:** ~10 min

## Concepts

| Term | Meaning |
|---|---|
| **Deployment** | An immutable snapshot of your app with its own unique URL. Never changes. |
| **Production** | The deployment your production domain currently points to. |
| **Preview** | A deployment from any non-production branch or PR. Gets its own URL. |
| **Promote / Rollback** | Repoint production at a different, already-built deployment. Instant, no rebuild. |

## 1. Preview deployments from a branch

```bash
git checkout -b my-first-preview
```

Edit `src/app/page.tsx` and change the headline:

```tsx
<h1 className="text-4xl font-semibold tracking-tight">
  Everything you can do with Vercel (by <your name>)
</h1>
```

```bash
git commit -am "my first preview"
git push -u origin my-first-preview
```

In the Vercel dashboard → **Deployments**, a new **Preview** build appears.
Open it. Production is untouched.

> Open a **Pull Request** on GitHub and the Vercel bot comments with the preview
> URL. Teammates can leave **Comments** directly on the preview page through the
> Vercel Toolbar at the bottom of the screen.

Visit `/demos/deploy` on the preview: `VERCEL_ENV` says **preview** and you
can see the branch and commit that produced it. That's all read from
[system environment variables](https://vercel.com/docs/deployments/environments)
in `src/app/demos/deploy/page.tsx`.

## 2. Ship to production

Merge the PR (or `git checkout main && git merge my-first-preview && git push`).
A **Production** deployment builds and your domain switches to it when it's
ready. There's no downtime: the old deployment keeps serving until the new one
is live.

## 3. Instant rollback

Oops, production is broken! In the dashboard → **Deployments**, find the
previous production deployment → **⋯** → **Instant Rollback**. Or from the
terminal:

```bash
npx vercel ls                    # list deployments (grab a URL)
npx vercel rollback <url|id>     # point production back at an older deployment
npx vercel promote <url|id>      # promote any deployment (e.g. a preview) to production
```

## 4. Deploy from the CLI (no Git needed)

```bash
npx vercel            # preview deployment of your local folder
npx vercel --prod     # production deployment
npx vercel inspect <url>   # build info
npx vercel logs <url>      # request logs (add --follow to stream)
npx vercel open            # open the project in the dashboard
```

## ✅ Check

- You have one Preview and at least two Production deployments.
- `/demos/deploy` shows different values on the preview vs production URL.

**Going further:** [Git integration](https://vercel.com/docs/git) ·
Custom Environments (e.g. a `staging` environment, see [docs/16](16-beyond.md))

Next: **[02 · Functions →](02-functions.md)**
