"use client";

import { upload } from "@vercel/blob/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function ClientUpload() {
  const router = useRouter();
  const [status, setStatus] = useState("");

  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setStatus("Uploading…");
    try {
      const blob = await upload(`workshop/${file.name}`, file, {
        access: "public",
        handleUploadUrl: "/api/blob/upload",
        onUploadProgress: ({ percentage }) =>
          setStatus(`Uploading… ${Math.round(percentage)}%`),
      });
      setStatus(`Done → ${blob.url}`);
      router.refresh(); // re-render the server-side gallery
    } catch (err) {
      setStatus(`Error: ${(err as Error).message}`);
    }
  }

  return (
    <div className="space-y-2">
      <input type="file" accept="image/*" className="input" onChange={onChange} />
      {status && <p className="break-all text-xs text-muted">{status}</p>}
    </div>
  );
}
