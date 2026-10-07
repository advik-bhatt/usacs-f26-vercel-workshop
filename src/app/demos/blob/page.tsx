import Image from "next/image";
import { list } from "@vercel/blob";
import { DemoShell, FileRef } from "@/components/demo-shell";
import { getModule, missingEnv } from "@/lib/modules";
import { uploadImage, deleteImage } from "./actions";
import { ClientUpload } from "./client-upload";

export const metadata = { title: "Blob" };
export const dynamic = "force-dynamic";

export default async function BlobDemo() {
  const ready = missingEnv(getModule("blob")).length === 0;
  const { blobs } = ready
    ? await list({ prefix: "workshop/", limit: 24 })
    : { blobs: [] };

  return (
    <DemoShell slug="blob">
      {ready && (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <section className="card space-y-3">
              <h2 className="font-medium">Server Action upload (≤ 4.5 MB)</h2>
              <p className="text-sm text-muted">
                <FileRef path="src/app/demos/blob/actions.ts" />
              </p>
              <form action={uploadImage} className="space-y-2">
                <input type="file" name="file" accept="image/*" className="input" required />
                <button className="btn">Upload</button>
              </form>
            </section>
            <section className="card space-y-3">
              <h2 className="font-medium">Client upload (big files)</h2>
              <p className="text-sm text-muted">
                <FileRef path="src/app/api/blob/upload/route.ts" />
              </p>
              <ClientUpload />
            </section>
          </div>

          <section className="space-y-3">
            <h2 className="font-medium">Gallery ({blobs.length})</h2>
            {blobs.length === 0 && (
              <p className="text-sm text-muted">Nothing yet — upload a picture!</p>
            )}
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {blobs.map((b) => (
                <li key={b.url} className="card space-y-2 p-2">
                  {/* Blob URLs are allowed in next.config.ts images.remotePatterns */}
                  <Image
                    src={b.url}
                    alt={b.pathname}
                    width={300}
                    height={300}
                    className="aspect-square w-full rounded object-cover"
                  />
                  <form action={deleteImage.bind(null, b.url)}>
                    <button className="btn-secondary w-full text-xs">Delete</button>
                  </form>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </DemoShell>
  );
}
