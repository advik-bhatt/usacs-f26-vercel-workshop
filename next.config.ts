import type { NextConfig } from "next";
import { withWorkflow } from "workflow/next"; // module 13a
import { withBotId } from "botid/next/config"; // module 12
import { withVercelToolbar } from "@vercel/toolbar/plugins/next"; // module 11

const nextConfig: NextConfig = {
  images: {
    // Allow next/image to optimize files stored in Vercel Blob (module 07a).
    remotePatterns: [
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
};

const withToolbar = withVercelToolbar();

export default withWorkflow(withBotId(withToolbar(nextConfig)));
