// Streaming response: bytes go to the browser as soon as they're produced.
// Fluid compute keeps the function alive while it streams.

export const maxDuration = 30; // seconds; optional — raise for long jobs

export async function GET() {
  const encoder = new TextEncoder();
  const words =
    "Vercel Functions can stream responses chunk by chunk, which is exactly how AI chat UIs feel so fast.".split(
      " ",
    );

  const stream = new ReadableStream({
    async start(controller) {
      for (const word of words) {
        controller.enqueue(encoder.encode(word + " "));
        await new Promise((r) => setTimeout(r, 150));
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
