import {
  streamText,
  convertToModelMessages,
  createUIMessageStreamResponse,
  toUIMessageStream,
  tool,
  isStepCount,
  type UIMessage,
} from "ai";
import { z } from "zod";

export const maxDuration = 60;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    // Slide 30: change this string to another provider's model, deploy, ask again.
    // Any "provider/model" id from the AI Gateway model list works.
    model: "openai/gpt-5-mini",
    instructions:
      "You are a friendly TA for a Rutgers USACS workshop about Vercel. Keep answers short.",
    messages: await convertToModelMessages(messages),
    // Tools let the model call your code. Try: "what time is it in Tokyo?"
    tools: {
      getTime: tool({
        description: "Get the current time in an IANA timezone",
        inputSchema: z.object({
          timeZone: z.string().describe("e.g. America/New_York, Asia/Tokyo"),
        }),
        execute: async ({ timeZone }) => {
          try {
            return {
              timeZone,
              time: new Date().toLocaleString("en-US", { timeZone }),
            };
          } catch {
            return { error: `Unknown time zone: ${timeZone}` };
          }
        },
      }),
    },
    // Let the model call a tool, read the result, then answer (up to 5 steps).
    stopWhen: isStepCount(5),
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  });
}
