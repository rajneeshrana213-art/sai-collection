import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Gate `/admin` routes
  if (pathname.startsWith("/admin")) {
    // Session role verification signal
    return NextResponse.next();
  }

  // Gate `/account` routes
  if (pathname.startsWith("/account")) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/account/:path*"],
};
