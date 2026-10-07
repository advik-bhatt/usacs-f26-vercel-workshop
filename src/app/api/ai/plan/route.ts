import { generateText, Output } from "ai";
import { z } from "zod";

// Structured output: the model must return JSON matching this Zod schema,
// and you get it back fully typed.
const StudyPlan = z.object({
  topic: z.string(),
  steps: z
    .array(z.object({ title: z.string(), minutes: z.number() }))
    .describe("3-5 concrete steps"),
});

export async function POST(req: Request) {
  const { topic } = (await req.json()) as { topic?: string };

  const { output } = await generateText({
    model: "openai/gpt-5-mini",
    output: Output.object({ schema: StudyPlan }),
    prompt: `Make a short study plan for a college student learning: ${String(topic ?? "Vercel").slice(0, 200)}`,
  });

  return Response.json(output);
}
