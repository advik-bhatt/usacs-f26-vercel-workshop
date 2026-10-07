# 05 · Image Optimization & OG Images ★

**Demo page:** `/demos/images` · **Time:** ~7 min


## 1. `next/image`

```tsx
import Image from "next/image";
import hero from "./hero.jpg"; // a 2400×1600 JPEG, ~130 KB

<Image
  src={hero}
  alt="Gradient with the Vercel triangle"
  placeholder="blur"                       // automatic blur-up for static imports
  sizes="(max-width: 1024px) 100vw, 1024px"
  priority                                 // above the fold → preload it
/>
```

On Vercel, `/_next/image?url=…&w=…&q=…` is served by
[Vercel Image Optimization](https://vercel.com/docs/image-optimization). It
resizes per device width, converts to WebP/AVIF, and caches on the CDN. Open
DevTools → Network → Img and compare the transferred size with the original.

Remote images must be allow-listed in `next.config.ts`:

```ts
images: {
  remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }],
},
```

(That's what lets the Blob gallery in module 07 use `next/image`.)

## 2. Dynamic Open Graph images

Social previews (Slack, Discord, iMessage, X, LinkedIn) come from
`<meta property="og:image">`. Generate them from JSX with `ImageResponse`.

**File convention:** `src/app/opengraph-image.tsx`

```tsx
import { ImageResponse } from "next/og";

export const alt = "USACS × Vercel Workshop";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex",
                  alignItems: "center", justifyContent: "center",
                  background: "#000", color: "#fff", fontSize: 80 }}>
      ▲ USACS × Vercel
    </div>,
    size,
  );
}
```

Next.js adds the meta tags for you. `layout.tsx` sets `metadataBase` so the
URL is absolute.

**As an API:** `src/app/api/og/route.tsx` accepts `?title=`, so you can make
cards for anything: `/api/og?title=Hello%20USACS!`.

`ImageResponse` supports flexbox and a subset of CSS; every `<div>` with more
than one child needs `display: "flex"`.

## ✅ Check

- Paste your production URL into a Discord/Slack message and see the card.
- `/api/og?title=<your name>` renders your name.

Next: **[06 · Environment Variables →](06-env-vars.md)**
