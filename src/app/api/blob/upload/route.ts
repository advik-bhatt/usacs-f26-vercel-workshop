import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

// Client uploads: the browser asks this route for a short-lived token, then
// uploads DIRECTLY to Blob storage (no 4.5 MB function body limit).
export async function POST(request: Request) {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const json = await handleUpload({
      body,
      request,
      // Runs BEFORE the upload: authorize the user & restrict what they send.
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
        maximumSizeInBytes: 20 * 1024 * 1024,
        addRandomSuffix: true,
      }),
      // Runs AFTER the upload (Vercel calls back to this route).
      // Note: doesn't fire on localhost unless VERCEL_BLOB_CALLBACK_URL is set.
      onUploadCompleted: async ({ blob }) => {
        console.log("Client upload finished:", blob.url);
      },
    });
    return NextResponse.json(json);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 },
    );
  }
}
