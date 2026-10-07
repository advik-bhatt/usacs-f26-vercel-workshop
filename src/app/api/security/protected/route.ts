import { checkBotId } from "botid/server";
import { checkRateLimit } from "@vercel/firewall";

// Two layers of protection you control from code:
//  1. BotID — is this a real browser, or a script/headless bot?
//  2. Rate limiting — a Firewall rule you create in the dashboard with the
//     ID "workshop-rate-limit" (see docs/12-security.md).
export async function POST(request: Request) {
  let bot;
  try {
    // In `next dev` this is bypassed (always human). On Vercel it's real.
    bot = await checkBotId();
  } catch (err) {
    // e.g. `npm start` on your laptop: no Vercel OIDC header → can't verify.
    return Response.json(
      { error: `BotID needs a Vercel deployment or next dev: ${(err as Error).message}` },
      { status: 500 },
    );
  }
  if (bot.isBot) {
    return Response.json({ error: "Bots not allowed 🤖" }, { status: 403 });
  }

  const { rateLimited, error } = await checkRateLimit("workshop-rate-limit", {
    request,
  });
  if (rateLimited) {
    return Response.json({ error: "Slow down! 🐢 (429)" }, { status: 429 });
  }

  return Response.json({
    ok: true,
    message: "You're a human and under the rate limit ✅",
    botid: bot,
    rateLimitRule: error === "not-found" ? "not configured yet" : "active",
  });
}
