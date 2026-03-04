import { NextRequest, NextResponse } from "next/server";
import { createSessionToken, setSessionCookie } from "@/lib/auth";
import { SINGLE_USER, isSingleUserLogin } from "@/lib/single-user-auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = String(body.email || "").trim();
    const password = String(body.password || "");

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    if (!isSingleUserLogin(email, password)) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    const token = await createSessionToken({ userId: SINGLE_USER.id, email: SINGLE_USER.email });
    await setSessionCookie(token);

    return NextResponse.json({ ok: true, user: { id: SINGLE_USER.id, email: SINGLE_USER.email } });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Failed to login." }, { status: 500 });
  }
}
