# 11 · Feature Flags + Vercel Toolbar

**Demo page:** `/demos/flags` · **Time:** ~6 min (demo)

The **Flags SDK** (`flags` package) defines flags as code, evaluated on the
server, so there's no layout shift and no flicker. The **Vercel Toolbar** lets
you override any flag for **your own browser only**.

## 1. Create `FLAGS_SECRET` (for the Toolbar's Flags Explorer)

```bash
node -e "console.log(crypto.randomBytes(32).toString('base64url'))"
```

Add the output as `FLAGS_SECRET`, using a different value per environment.
The toolbar uses it to encrypt overrides and to authenticate the discovery
endpoint.

## 2. Define flags (`src/flags.ts`)

```ts
import { flag } from "flags/next";

export const heroVariant = flag<string>({
  key: "hero-variant",
  description: "Which headline to show",
  defaultValue: "classic",
  options: [
    { label: "Classic", value: "classic" },
    { label: "Bold", value: "bold" },
    { label: "Scarlet Knights", value: "rutgers" },
  ],
  decide() {
    return "classic"; // real life: by user, country, % rollout…
  },
});
```

Use it in any Server Component: `const variant = await heroVariant();`

## 3. Let the toolbar discover your flags

`src/app/.well-known/vercel/flags/route.ts`:

```ts
import { createFlagsDiscoveryEndpoint, getProviderData } from "flags/next";
import * as flags from "@/flags";

export const GET = createFlagsDiscoveryEndpoint(() => getProviderData(flags));
```

## 4. The toolbar

- **Preview deployments:** the toolbar appears at the bottom automatically
  (you must be logged in to Vercel).
- **Locally:** already wired up in `next.config.ts` (`withVercelToolbar()`) and
  `layout.tsx` (`<VercelToolbar />` in development). You need `vercel link`.

Open the toolbar → **Flags Explorer** → change `hero-variant` → refresh.

Besides flags, the toolbar gives you **Comments** on previews, layout-shift and
accessibility audits, and quick links to the deployment.

## Vercel Flags: values that live on Vercel (slide 27)

`new-banner` in `src/flags.ts` gets its value from **Vercel Flags** through the
`@flags-sdk/vercel` adapter:

```ts
import { flag } from "flags/next";
import { vercelAdapter } from "@flags-sdk/vercel";

export const newBanner = flag<boolean>({
  key: "new-banner",
  defaultValue: false,
  adapter: vercelAdapter(),
});
```

```bash
vercel flags create new-banner                  # boolean by default
vercel flags enable new-banner -e production
vercel flags list
```

The home page shows a 🎉 banner when it's on, with no rebuild. The adapter
authenticates with the project's OIDC token (automatic on Vercel; locally,
`vercel env pull`). If it can't reach Vercel Flags, the flag uses
`defaultValue`. Targeting, splits and rollouts: `vercel flags --help`.
[Docs](https://vercel.com/docs/flags/vercel-flags)

Next: **[12 · Security →](12-security.md)**
