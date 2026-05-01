import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // PUBLIC ROUTES CHECK
  const isProtectedRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/wishlist") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/orders") ||
    pathname.startsWith("/settings");

  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token) {
    try {
      const secretKey = process.env.JWT_SECRET;

      if (!secretKey) {
        console.error(
          "CRITICAL: JWT_SECRET is not defined in environment variables.",
        );
        return NextResponse.redirect(new URL("/login", request.url));
      }

      const secret = new TextEncoder().encode(secretKey);
      const { payload } = await jwtVerify(token, secret);

      // Handle array or string roles safely
      const role = Array.isArray(payload.role) ? payload.role[0] : payload.role;

      // ADMIN PROTECTION
      // If trying to access dashboard but NOT an admin
      if (pathname.startsWith("/dashboard") && role !== "admin") {
        return NextResponse.redirect(new URL("/", request.url));
      }

      // AUTH PAGE PROTECTION
      // If logged in, don't allow access to login/register
      if (pathname === "/login" || pathname === "/register") {
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch (error) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.set("token", "", { expires: new Date(0) });
      return response;
    }
  }

  return NextResponse.next();
}

// Ensure the matcher includes all routes we want to protect
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/wishlist/:path*",
    "/profile/:path*",
    "/orders/:path*",
    "/settings/:path*",
    "/login",
    "/register",
  ],
};
