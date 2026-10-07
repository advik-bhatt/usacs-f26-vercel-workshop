// Slide 11: a file in app/api becomes a URL → /api/hello
// Slide 19 checkpoint: make this return your GREETING env var, e.g.
//   return Response.json({ hello: process.env.GREETING ?? "world" })
export function GET() {
  return Response.json({ hello: "world" });
}
