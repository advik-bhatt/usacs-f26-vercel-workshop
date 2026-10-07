"use server";

import { put, del } from "@vercel/blob";
import { revalidatePath } from "next/cache";

// Server Action upload: simplest possible flow. The file goes
// browser → your function → Blob. Vercel Functions accept request bodies up
// to 4.5 MB, so use the client-upload flow (see client-upload.tsx) for big files.
export async function uploadImage(formData: FormData) {
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return;
  if (!file.type.startsWith("image/")) throw new Error("Images only, please");

  await put(`workshop/${file.name}`, file, {
    access: "public",
    addRandomSuffix: true, // avoids "blob already exists" errors
  });

  revalidatePath("/demos/blob");
}

export async function deleteImage(url: string) {
  await del(url);
  revalidatePath("/demos/blob");
}
