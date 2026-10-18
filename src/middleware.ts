import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");
  const isLoginPage = pathname === "/admin/login";
  const isApiRoute = pathname.startsWith("/api/");
  const isSignOutPage = pathname === "/auth/signout";

  // Check for NextAuth session token
  let token: any = null;
  try {
    token = await getToken({
      req: request,
      secret: process.env.AUTH_SECRET || "nexusd-prod-secret-key-australia-brazil-2026-production-ready",
    });
  } catch (err) {
    console.error("[Middleware Token Verification Error]:", err);
  }

  // 1. Enforce admin protection on /admin/* (except /admin/login)
  if (isAdminRoute && !isLoginPage) {
    if (!token || token.role !== "admin") {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Quarantine Administrator sessions: Admin cannot browse candidate/student portal
  if (token && token.role === "admin") {
    // If admin is visiting /admin/login while already authenticated as admin, redirect to /admin
    if (isLoginPage) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    // Admin is strictly confined to /admin/*, /auth/signout, and API routes
    if (!isAdminRoute && !isSignOutPage && !isApiRoute) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, icons, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
