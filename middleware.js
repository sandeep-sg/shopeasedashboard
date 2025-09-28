import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key");

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

  // --- ✅ Improved CORS for API routes ---
  if (pathname.startsWith("/api/")) {
    // Handle preflight OPTIONS request
    if (req.method === "OPTIONS") {
      return new NextResponse(null, {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    // For actual API requests, add CORS headers
    const response = NextResponse.next();
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
    
    return response;
  }

  // --- ✅ JWT Authentication (for non-API routes) ---
  if (!token) {
    if (pathname === "/login") return NextResponse.next();
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    await jwtVerify(token, SECRET_KEY);
    if (pathname === "/login") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  } catch {
    const response = NextResponse.redirect(new URL("/login", req.url));
    response.cookies.set("token", "", { maxAge: -1 });
    return response;
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|gif|webp)$).*)",
  ],
};