import Image from "next/image";
import { DemoShell, FileRef } from "@/components/demo-shell";
import hero from "./hero.jpg";

export const metadata = {
  title: "Images & OG",
  description: "next/image + dynamic Open Graph images on Vercel.",
};

export default function ImagesDemo() {
  return (
    <DemoShell slug="images">
      <section className="card space-y-3">
        <h2 className="font-medium">1. next/image → Vercel Image Optimization</h2>
        <p className="text-sm text-muted">
          The source file is a 2400×1600 JPEG. Vercel resizes it per device and
          serves WebP/AVIF from the CDN. Right-click → “Open image in new tab”
          and look at the <code className="code">/_next/image?url=…&amp;w=…</code>{" "}
          URL.
        </p>
        <Image
          src={hero}
          alt="Gradient with the Vercel triangle"
          placeholder="blur" // blurDataURL is generated automatically for static imports
          sizes="(max-width: 1024px) 100vw, 1024px"
          className="h-auto w-full rounded-lg"
          priority
        />
      </section>

      <section className="card space-y-3">
        <h2 className="font-medium">2. Dynamic Open Graph images</h2>
        <p className="text-sm text-muted">
          <FileRef path="src/app/api/og/route.tsx" /> turns JSX into a PNG with{" "}
          <code className="code">ImageResponse</code> from{" "}
          <code className="code">next/og</code>. Change the{" "}
          <code className="code">?title=</code> query string.
        </p>
        {/* Plain <img>: the OG route already returns a finished PNG. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/api/og?title=Hello%20USACS!"
          alt="Generated social card"
          className="w-full rounded-lg border border-border"
        />
        <p className="text-sm text-muted">
          And <FileRef path="src/app/opengraph-image.tsx" /> is the file
          convention version: Next.js wires it into{" "}
          <code className="code">&lt;meta property=&quot;og:image&quot;&gt;</code>{" "}
          automatically. Paste your deployment URL into a Slack/Discord/iMessage
          chat to see it.
        </p>
      </section>
    </DemoShell>
  );
}
