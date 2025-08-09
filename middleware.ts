import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  const { pathname } = request.nextUrl;

  // Protect /dashboard: redirect to / if not authenticated
  if (pathname.startsWith("/dashboard") && !sessionCookie) {
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }

  // Prevent authenticated users from accessing /auth* routes: redirect to /dashboard
  if (pathname.startsWith("/auth") && sessionCookie) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/auth/:path*"], // Apply to /dashboard and /auth* routes
};