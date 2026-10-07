import { flag } from "flags/next";
import { vercelAdapter } from "@flags-sdk/vercel";

// Slide 27: the `if` stays in your code, Vercel holds the answer.
//   vercel flags create new-banner
//   vercel flags enable new-banner -e production
// The value comes from Vercel Flags (authenticated with the project's OIDC
// token). Until the flag exists, or locally without `vercel env pull`, it
// falls back to defaultValue.
export const newBanner = flag<boolean>({
  key: "new-banner",
  description: "Show the announcement banner on the home page",
  defaultValue: false,
  adapter: vercelAdapter(),
});

// Flags decided in code. The Vercel Toolbar's Flags Explorer can override
// any flag for just YOUR browser (needs FLAGS_SECRET).

export const showConfetti = flag<boolean>({
  key: "show-confetti",
  description: "Celebrate on the flags demo page",
  defaultValue: false,
  options: [
    { label: "Off", value: false },
    { label: "On", value: true },
  ],
  decide() {
    return false;
  },
});

export const heroVariant = flag<string>({
  key: "hero-variant",
  description: "Which headline to show on the flags demo page",
  defaultValue: "classic",
  options: [
    { label: "Classic", value: "classic" },
    { label: "Bold", value: "bold" },
    { label: "Scarlet Knights", value: "rutgers" },
  ],
  decide() {
    // Real-world: bucket by user id, country, time of day…
    return "classic";
  },
});
