import { NextRequest, NextResponse } from "next/server";
import { createUser, createToken } from "@/lib/oneapi";
import * as jose from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "infernest-secret-change-me-2026"
);

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    console.log("[register] Creating user:", email);

    const userResult = await createUser(email, password);
    if (!userResult.success) {
      return NextResponse.json({ error: userResult.message || "Failed to create user" }, { status: 400 });
    }

    const userId = userResult.data?.id;
    if (!userId) {
      return NextResponse.json({ error: "User created but no ID returned" }, { status: 500 });
    }

    // Create token using user's own session (fixes token ownership bug)
    const tokenResult = await createToken(email, password);
    const key = tokenResult.data?.key || "";

    // Create JWT for auto-login
    const jwt = await new jose.SignJWT({
      userId,
      username: email.split("@")[0],
      apiKey: key,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(JWT_SECRET);

    const response = NextResponse.json({
      success: true,
      userId,
      apiKey: key,
    });

    response.cookies.set("infernest_token", jwt, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (e: any) {
    console.error("[register] Error:", e.message);
    return NextResponse.json({ error: "Registration failed: " + e.message }, { status: 500 });
  }
}