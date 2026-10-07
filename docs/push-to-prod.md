# Push to Prod: slide-by-slide guide

The companion to the **"Push to Prod: Every Vercel tool, run from your terminal"**
slides (USACS Tech, October 8). Each section matches one or more slides: the
commands to type, what you should see, and the file in this repo that makes it
work.

> Fell behind? Every section stands alone. Jump to the slide we're on, run
> its commands, and check you see the result described.

---

## Slide 2 · Install the CLI and sign in

```bash
npm i -g vercel
vercel login
vercel whoami        # prints your username → you're ready
```

You also need **Node.js 22+** (`node -v`) and **git**.

**Get the project.** On GitHub, **Fork** this repo to your account, then:

```bash
git clone https://github.com/<your-username>/usacs-f26-vercel-workshop
cd usacs-f26-vercel-workshop
npm install
```

Fork it rather than cloning the original: slide 5 connects *your* GitHub
repo to *your* Vercel project.

## Slides 3–4 · Put your project on the internet

```bash
vercel link            # answer the prompts; create a new project
vercel deploy --prod   # builds in the cloud, prints a .vercel.app URL
```

Open the URL on your phone. Every deploy is a new, finished deployment, and your
domain just points at one of them.

## Slide 5 · Connect GitHub once, then just push

```bash
vercel git connect
```

From now on `git push` to `main` deploys to production, and any other branch
gets a preview.

## Slide 6 · See every deployment

```bash
vercel list
vercel inspect <url> --logs     # the build log for one deployment
```

## Slides 7–8 · Previews and deployment protection

```bash
vercel deploy           # no --prod → a preview with its own URL
```

Open the preview in a private window and you'll hit a login page. That's
**Deployment Protection** (Vercel Authentication), on by default for previews.
`/demos/deploy` on any deployment shows whether it's `preview` or `production`.

## Slide 9 · Comments

Open your partner's preview → **Comment** in the toolbar at the bottom → pin a
note. Then:

```bash
vercel comments                  # list them (the default subcommand)
vercel comments resolve <id>
```

## Slide 10 · Test any deployment from the terminal

```bash
vercel curl /                    # short path → production
vercel curl <preview-url>        # full URL → gets past the login wall for you
```

## Slides 11–12 · A file in `app/api` becomes a URL

The file is **`src/app/api/hello/route.ts`** (all app code lives in `src/`):

```ts
export function GET() {
  return Response.json({ hello: "world" });
}
```

```bash
vercel dev                       # localhost:3000, the way Vercel runs it
vercel deploy --prod
vercel curl /api/hello           # {"hello":"world"}
```

## Slides 13–15 · Fluid compute, logs, traces

```bash
# terminal 1
vercel logs --follow
# terminal 2
vercel curl /api/hello           # run it a few times, watch terminal 1

vercel logs --status-code 5xx --since 1h     # dig into older requests
vercel curl --trace /api/hello               # prints a request ID
vercel traces get <request-id>               # where the time went
```

More function examples (geolocation, streaming, `waitUntil`): `/demos/functions`.

## Slides 16–19 · Environment variables

```bash
vercel env add GREETING          # asks for the value + which environments
vercel env pull                  # → .env.local
vercel env run -- npm run dev    # or run with them, no file written
```

Now make `/api/hello` use it. In `src/app/api/hello/route.ts`:

```ts
export function GET() {
  return Response.json({ hello: process.env.GREETING ?? "world" });
}
```

```bash
vercel deploy --prod
vercel curl /api/hello
```

**Changed the value?** `vercel env update GREETING`, then **redeploy**. A
finished deployment keeps the value it was built with.
Production and Preview values are **Sensitive** by default, so you can't read them
back later. `/demos/env` shows the current value.

✅ **Checkpoint:** `/api/hello` returns your GREETING, and the request shows up in
`vercel logs`.

## Slide 20 · Run code before every request with `proxy.ts`

The proxy lives at **`src/proxy.ts`** and is already on. It:

- redirects `/secret` home unless you have the `workshop-secret` cookie
  (visit `/unlock` to get it, `/lock` to drop it),
- shows `/maintenance` when the Global Config switch is on (slide 26),
- runs the A/B test at `/demos/routing/experiment`.

```bash
vercel curl /secret -I           # 307 redirect to / (no cookie)
```

The `matcher` at the bottom of `proxy.ts` decides which paths it runs on.

## Slides 21–23 · Cron jobs

The route already exists: `src/app/api/cron/route.ts`. It rejects any call
without `Authorization: Bearer $CRON_SECRET`.

```bash
vercel env add CRON_SECRET production          # any long random string
vercel crons add --path /api/cron --schedule "0 9 * * *"   # writes vercel.json
vercel deploy --prod
vercel crons run /api/cron
vercel logs                                    # look for "[cron] job ran"
```

`crons run` uses what's deployed, so deploy first. On Hobby, a cron runs at
most once a day, in UTC.

✅ **Checkpoint:** your cron ran, and the call shows up in `vercel logs`.

## Slide 25 · Blob: upload a file, get a link

```bash
vercel blob create-store workshop --access public --yes   # --yes connects it to this project
vercel blob put cat.jpg --access public                   # prints a URL
vercel blob list
```

Then `vercel env pull` and open `/demos/blob` to upload from the browser.

## Slide 26 · Global Config: a switch you flip without deploying

Global Config is the new name for Edge Config. This repo uses
`@vercel/global-config`.

```bash
vercel global-config add site --items '{"maintenance":false}'
vercel global-config items site
```

Connect the store to your project: in the dashboard, open **Storage →** the
`site` store → **Connect Project** and pick this project. That adds the connection-string env
var `proxy.ts` reads. Then `vercel deploy --prod`.

Flip `maintenance` to `true` in the dashboard, refresh, and every page shows
🚧. Flip it back. A change can take up to ~10s to reach everywhere.

## Slide 27 · Vercel Flags: a feature without a redeploy

The `if` is already in the code (`src/app/page.tsx`, flag defined in
`src/flags.ts`):

```ts
export const newBanner = flag<boolean>({
  key: "new-banner",
  defaultValue: false,
  adapter: vercelAdapter(),     // from @flags-sdk/vercel
});
```

```bash
vercel flags create new-banner              # boolean by default
vercel flags enable new-banner -e production
vercel flags list
```

Refresh your production URL: the 🎉 banner appears on the home page, and nothing
was rebuilt. Locally it stays off unless `vercel env pull` has given you a fresh
OIDC token.

## Slide 28 · Saved pages refresh in the background

`/posts` is cached for an hour and its data is tagged `posts`
(`src/app/posts/page.tsx`). Refresh: the "Built at" time doesn't move. Then:

```bash
vercel cache invalidate --tag posts          # stale now, rebuilt in the background
vercel cache dangerously-delete --tag posts  # gone, next visitor waits for a build
```

After `invalidate`, the first refresh still shows the old time (served stale)
and the next one shows the new time.

## Slide 29 · Smaller images and a card for your link

```bash
vercel env pull
vercel blob put-image photo.png --pathname photo.webp \
  --width 800 --format webp --access public
```

`src/app/opengraph-image.tsx` draws the card people see when you paste your
link. Post it in the Discord thread. More: `/demos/images`.

## Slides 30–31 · AI SDK + AI Gateway

Open `/chat` on your deployment. The model is one string in
**`src/app/api/chat/route.ts`**:

```ts
model: "openai/gpt-5-mini",   // change to another provider's model, deploy, ask again
```

On Vercel the deployment signs in to the AI Gateway with its own OIDC token,
so there's no key. Locally, `vercel env pull` saves a token that works for a
few hours. For a long-lived key, run `vercel ai-gateway api-keys create`, save
it as `AI_GATEWAY_API_KEY`, and never commit it.

## Slide 32 · Analytics & Speed Insights

`<Analytics />` and `<SpeedInsights />` are already in `src/app/layout.tsx`.
Enable both in the dashboard, share your link, then:

```bash
vercel metrics vercel.analytics.page_view.count --group-by country --since 1d
vercel metrics vercel.speed_insights.lcp_ms --aggregation p75 --group-by route --since 1d
```

## Slides 33–34 · Firewall

```bash
vercel firewall rules add "Challenge API" \
  --condition '{"type":"path","op":"pre","value":"/api"}' \
  --action challenge --yes
vercel firewall publish --yes
vercel firewall attack-mode enable --yes
vercel firewall attack-mode disable --yes      # ← run this before you leave!
```

BotID's `checkBotId()` lives in `src/app/api/security/protected/route.ts`. See
`/demos/security`.

## Slide 35 · Queues and Workflows (demo)

- Queue: `send("orders", order)` in `src/app/demos/queues/page.tsx`, consumed by
  `src/app/api/queues/consumer/route.ts` (subscribed in `vercel.json`).
- Workflow: `welcome()` in `src/workflows/onboarding.ts` (`"use workflow"`,
  steps, `sleep`). It sleeps 10s in the demo instead of `"1d"`. Run it at
  `/demos/workflow`.

## Slide 36 · Sandbox and MCP

```bash
vercel sandbox create --connect   # a fresh isolated machine + a shell in it
vercel mcp                        # wire Vercel into Claude Code / Cursor / VS Code
```

## Slides 37–38 · Break production, then roll back

1. Make the home page throw: in `src/app/page.tsx`, add
   `throw new Error("oops")` as the first line of `Home()`.
2. `vercel deploy --prod` and see the error page.
3. Roll back to the last good deployment:

   ```bash
   vercel list                          # copy the URL of the last good one
   vercel rollback <good-deployment-url>
   ```

4. Remove the `throw`, then undo the rollback so new pushes go live again:

   ```bash
   vercel promote <deployment-url>
   vercel bisect        # step through deployments to find the one that broke
   vercel security      # check your account for risky settings
   ```

On Hobby, rollback only reaches the deployment right before the current one.

## Slide 39 · Post your URL in the thread 🎉

Next builder night: Supabase, November 19. Bring this project.
