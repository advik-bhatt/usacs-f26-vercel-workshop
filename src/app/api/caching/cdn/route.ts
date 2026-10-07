// GET route handlers are dynamic by default. We opt this response into
// Vercel's CDN cache purely with headers:
//
//   Cache-Control            → the browser (don't cache here)
//   CDN-Cache-Control        → any CDN in front of Vercel
//   Vercel-CDN-Cache-Control → only Vercel's CDN (most specific wins)
//
// s-maxage=10                   fresh for 10s at the edge
// stale-while-revalidate=60     then serve stale for 60s while refreshing

export async function GET() {
  return Response.json(
    { generatedAt: new Date().toISOString() },
    {
      headers: {
        "Cache-Control": "public, max-age=0, must-revalidate",
        "Vercel-CDN-Cache-Control": "s-maxage=10, stale-while-revalidate=60",
      },
    },
  );
}
