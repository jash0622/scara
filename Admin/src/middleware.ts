import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "scara_admin_token";
const LOGIN_PATH = "/login";
const DASHBOARD_PATH = "/dashboard";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only guard /dashboard/* routes
  if (!pathname.startsWith(DASHBOARD_PATH)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;

  if (!token) {
    const loginUrl = new URL(LOGIN_PATH, request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Token presence check only — full JWT verification happens on the backend.
  // Any expired/invalid token will result in a 401 from the backend, which
  // the dashboard layout handles by clearing the cookie and redirecting to /login.
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
