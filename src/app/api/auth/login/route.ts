import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose";

const ONEAPI_URL = process.env.ONEAPI_URL || "http://localhost:3000";
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "infernest-secret-change-me-2026"
);

async function loginOneAPI(username: string, password: string) {
  const res = await fetch(ONEAPI_URL + "/api/user/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
    signal: AbortSignal.timeout(8000),
  });
  const setCookie = res.headers.get("set-cookie") || "";
  const match = setCookie.match(/session=([^;]+)/);
  const data = await res.json();
  if (data.success && data.data) {
    return { success: true, userId: data.data.id, username: data.data.username, session: match ? match[1] : null };
  }
  return { success: false, message: data.message || "Invalid credentials" };
}

async function getUserTokens(session: string, userId: number) {
  const res = await fetch(ONEAPI_URL + "/api/token/?p=0&page_size=10&user_id=" + userId, {
    headers: { Cookie: "session=" + session },
    signal: AbortSignal.timeout(8000),
  });
  return res.json();
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    const username = email.split("@")[0];
    const loginResult = await loginOneAPI(username, password);
    if (!loginResult.success) {
      return NextResponse.json({ error: loginResult.message || "Login failed" }, { status: 401 });
    }
    let apiKey = "";
    if (loginResult.session) {
      const tokenResult = await getUserTokens(loginResult.session, loginResult.userId);
      if (tokenResult.success && tokenResult.data && tokenResult.data.length > 0) {
        apiKey = tokenResult.data[0].key;
      }
    }
    const token = await new jose.SignJWT({ userId: loginResult.userId, username: loginResult.username, apiKey })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(JWT_SECRET);
    const response = NextResponse.json({ success: true, userId: loginResult.userId, apiKey });
    response.cookies.set("infernest_token", token, {
      httpOnly: true, secure: true, sameSite: "lax", maxAge: 60 * 60 * 24 * 7, path: "/",
    });
    return response;
  } catch (e: any) {
    console.error("[login] Error:", e.message);
    return NextResponse.json({ error: "Login failed: " + e.message }, { status: 500 });
  }
}
