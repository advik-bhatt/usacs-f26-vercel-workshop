import { ImageResponse } from "next/og";

// File convention: app/opengraph-image.tsx becomes the og:image for "/"
// (and every route below it that doesn't define its own). Slide 29: paste
// your link in the Discord thread to see this card.
export const alt = "Push to Prod · USACS × Vercel";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  const host = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? "your-app.vercel.app";
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "#000",
          color: "#fff",
        }}
      >
        <div style={{ fontSize: 88, fontWeight: 700 }}>▲ Push to Prod</div>
        <div style={{ fontSize: 40, opacity: 0.7, marginTop: 24 }}>{host}</div>
      </div>
    ),
    size,
  );
}
