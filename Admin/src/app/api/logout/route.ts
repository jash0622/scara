import { NextResponse } from "next/server";

const COOKIE_NAME = "scara_admin_token";

export async function POST() {
  const response = NextResponse.json({ success: true });

  // Clear both cookies set at login
  response.cookies.set({
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
    path: "/",
  });

  response.cookies.set({
    name: `${COOKIE_NAME}_js`,
    value: "",
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
    path: "/",
  });

  return response;
}
