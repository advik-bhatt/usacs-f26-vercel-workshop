import { unstable_cache } from "next/cache";
import { DemoShell } from "@/components/demo-shell";

export const metadata = { title: "Posts" };

// Slide 28: a saved page that refreshes in the background.
// ISR keeps this page for 1 hour. The data is tagged "posts", so you can
// expire it early from the terminal:
//   vercel cache invalidate --tag posts          → stale now, rebuilt in background
//   vercel cache dangerously-delete --tag posts  → gone, next visitor waits for a build
export const revalidate = 3600;

const getPosts = unstable_cache(
  async () => ({
    builtAt: new Date().toISOString(),
    posts: [
      { id: 1, title: "Every push is a new deployment" },
      { id: 2, title: "Your domain is just a pointer" },
      { id: 3, title: "Rollbacks don't rebuild anything" },
    ],
  }),
  ["posts"],
  { tags: ["posts"], revalidate: 3600 },
);

export default async function PostsPage() {
  const { builtAt, posts } = await getPosts();
  return (
    <DemoShell slug="caching">
      <section className="card space-y-3">
        <h2 className="font-medium">Posts (cached with the tag “posts”)</h2>
        <p className="font-mono text-sm">Built at: {builtAt}</p>
        <ul className="list-inside list-disc text-sm">
          {posts.map((p) => (
            <li key={p.id}>{p.title}</li>
          ))}
        </ul>
        <p className="text-sm text-muted">
          Refresh: the time stays put. Run{" "}
          <code className="code">vercel cache invalidate --tag posts</code>,
          refresh twice, and it moves.
        </p>
      </section>
    </DemoShell>
  );
}
