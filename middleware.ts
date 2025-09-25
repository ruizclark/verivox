// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = new URL(req.url);

  // Avoid redirect loops: if we're already on the callback route, do nothing
  if (url.pathname === "/auth/callback") {
    return NextResponse.next();
  }

  // If any Supabase auth code hits ANY route, funnel it to /auth/callback
  const code = url.searchParams.get("code");
  if (code) {
    url.pathname = "/auth/callback"; // keep the original query string intact
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Run on all app routes; skip API, Next internals, and static files
export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};

