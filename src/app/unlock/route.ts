import { NextResponse } from "next/server";

// Visit /unlock to get the cookie that proxy.ts looks for, then land on /secret.
export function GET(request: Request) {
  const res = NextResponse.redirect(new URL("/secret", request.url));
  res.cookies.set("workshop-secret", "1", { path: "/", httpOnly: true, maxAge: 60 * 60 });
  return res;
}
