import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.API_BASE_URL ?? "http://localhost:4000";
const COOKIE_NAME = "scara_admin_token";

/**
 * Proxy a username change to the backend. Because the backend re-issues a JWT
 * (the token embeds the username), we must re-set both auth cookies here.
 */
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();

    // Forward the caller's bearer token so the backend can authenticate.
    const token = req.cookies.get(`${COOKIE_NAME}_js`)?.value ?? req.cookies.get(COOKIE_NAME)?.value;

    const backendRes = await fetch(`${API_BASE}/api/auth/username`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    });

    const data = await backendRes.json();

    if (!backendRes.ok || !data.success) {
      return NextResponse.json(
        { success: false, error: data.error ?? { message: "Failed", code: "FAILED" } },
        { status: backendRes.status }
      );
    }

    const { token: newToken, expiresIn } = data.data as { token: string; expiresIn: string };
    const maxAge = parseExpiresIn(expiresIn);

    const response = NextResponse.json({ success: true, data: { admin: data.data.admin } });

    response.cookies.set({
      name: COOKIE_NAME,
      value: newToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge,
      path: "/",
    });
    response.cookies.set({
      name: `${COOKIE_NAME}_js`,
      value: newToken,
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge,
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("[/api/account/username] Error:", err);
    return NextResponse.json(
      { success: false, error: { message: "Internal error", code: "INTERNAL_ERROR" } },
      { status: 500 }
    );
  }
}

function parseExpiresIn(expiresIn: string): number {
  const match = expiresIn.match(/^(\d+)([dhms])$/);
  if (!match) return 7 * 24 * 3600;
  const [, num, unit] = match;
  const n = parseInt(num, 10);
  const multipliers: Record<string, number> = { d: 86400, h: 3600, m: 60, s: 1 };
  return n * (multipliers[unit] ?? 86400);
}
