import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode(
  process.env.AUTH_SECRET || "cfx_super_secure_random_jwt_secret_key_32_bytes_min!"
);

const COOKIE_NAME = "cfx_session";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect all /admin routes except /admin/login
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") {
      // If already logged in as admin, redirect to admin dashboard
      const token = req.cookies.get(COOKIE_NAME)?.value;
      if (token) {
        try {
          const { payload } = await jwtVerify(token, SECRET_KEY);
          if (payload && payload.role === "admin") {
            return NextResponse.redirect(new URL("/admin/automation", req.url));
          }
        } catch {
          // Token invalid, allow login page
        }
      }
      return NextResponse.next();
    }

    // Check token for all protected /admin routes
    const token = req.cookies.get(COOKIE_NAME)?.value;
    if (!token) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const { payload } = await jwtVerify(token, SECRET_KEY);
      if (!payload || payload.role !== "admin") {
        const loginUrl = new URL("/admin/login", req.url);
        loginUrl.searchParams.set("error", "unauthorized");
        return NextResponse.redirect(loginUrl);
      }
      return NextResponse.next();
    } catch {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("from", pathname);
      const res = NextResponse.redirect(loginUrl);
      res.cookies.delete(COOKIE_NAME);
      return res;
    }
  }

  // Protect /api/admin/* endpoints
  if (pathname.startsWith("/api/admin")) {
    const token =
      req.cookies.get(COOKIE_NAME)?.value ||
      req.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized. Admin credentials required." },
        { status: 401 }
      );
    }

    try {
      const { payload } = await jwtVerify(token, SECRET_KEY);
      if (!payload || payload.role !== "admin") {
        return NextResponse.json(
          { error: "Forbidden. Admin role required." },
          { status: 403 }
        );
      }
      return NextResponse.next();
    } catch {
      return NextResponse.json(
        { error: "Unauthorized. Invalid or expired token." },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
