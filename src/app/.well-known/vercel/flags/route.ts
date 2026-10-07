import { createFlagsDiscoveryEndpoint, getProviderData } from "flags/next";
import * as flags from "@/flags";

// The Vercel Toolbar calls this endpoint to discover your flags so it can
// show them in its Flags Explorer. Requests are verified with FLAGS_SECRET.
export const GET = createFlagsDiscoveryEndpoint(() => getProviderData(flags));
