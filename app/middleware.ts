import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth/lucia";

export async function middleware(request: NextRequest) {
  // 1. Get the session ID from the request cookies manually
  const sessionId = request.cookies.get(auth.sessionCookieName)?.value ?? null;

  if (!sessionId) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 2. Validate the session
  const { session } = await auth.validateSession(sessionId);

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/board/:path*"],
};
