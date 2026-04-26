import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose"; // Use jose for edge-compatible JWT decoding

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // 1. If no token and trying to access protected routes
  // if (
  //   !token &&
  //   (pathname.startsWith("/dashboard") || pathname.startsWith("/wishlist"))
  // ) {
  //   return NextResponse.redirect(new URL("/login", request.url));
  // }

  if (token) {
    try {
      // Decode the JWT (make sure your secret matches the backend)
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);
      const role = payload.role as string;

      // 2. Admin Route Protection
      if (pathname.startsWith("/dashboard")) {
        return NextResponse.redirect(new URL("/", request.url));
      }
      // if (pathname.startsWith("/dashboard") && role !== "admin") {
      //   return NextResponse.redirect(new URL("/", request.url));
      // }

      // 3. Prevent logged-in users from hitting login/register
      // if (pathname === "/login" || pathname === "/register") {
      //   return NextResponse.redirect(new URL("/", request.url));
      // }
    } catch (error) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
