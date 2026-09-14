import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.API_BASE_URL ?? "http://localhost:4000";
const COOKIE_NAME = "scara_admin_token";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Proxy to backend
    const backendRes = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await backendRes.json();

    if (!backendRes.ok || !data.success) {
      return NextResponse.json(
        { success: false, error: data.error ?? { message: "Login failed", code: "LOGIN_FAILED" } },
        { status: backendRes.status }
      );
    }

    const { token, expiresIn } = data.data as { token: string; expiresIn: string };

    // Parse expiresIn (e.g. "7d") to seconds
    const maxAge = parseExpiresIn(expiresIn);

    const response = NextResponse.json({ success: true, data: { admin: data.data.admin } });

    // 1. httpOnly cookie — used by Next.js middleware to guard /dashboard routes
    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge,
      path: "/",
    });

    // 2. JS-readable cookie — used by api-client.ts to attach Authorization header
    //    Not httpOnly so browser JS can read it for API calls
    response.cookies.set({
      name: `${COOKIE_NAME}_js`,
      value: token,
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge,
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("[/api/login] Error:", err);
    return NextResponse.json(
      { success: false, error: { message: "Internal error", code: "INTERNAL_ERROR" } },
      { status: 500 }
    );
  }
}

function parseExpiresIn(expiresIn: string): number {
  const match = expiresIn.match(/^(\d+)([dhms])$/);
  if (!match) return 7 * 24 * 3600; // default 7d
  const [, num, unit] = match;
  const n = parseInt(num, 10);
  const multipliers: Record<string, number> = { d: 86400, h: 3600, m: 60, s: 1 };
  return n * (multipliers[unit] ?? 86400);
}
