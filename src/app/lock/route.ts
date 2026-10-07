import { NextResponse } from "next/server";

// Removes the cookie again, so /secret redirects home.
export function GET(request: Request) {
  const res = NextResponse.redirect(new URL("/", request.url));
  res.cookies.delete("workshop-secret");
  return res;
}
