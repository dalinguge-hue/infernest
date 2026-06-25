import { NextRequest, NextResponse } from "next/server";
import { createUser, createToken } from "@/lib/oneapi";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    console.log("[register] Creating user:", email);
    
    const userResult = await createUser(email, password);
    console.log("[register] User result:", JSON.stringify(userResult).slice(0, 200));
    
    if (!userResult.success) {
      return NextResponse.json({ error: userResult.message || "Failed to create user" }, { status: 400 });
    }
    
    const userId = userResult.data?.id;
    if (!userId) {
      return NextResponse.json({ error: "User created but no ID returned" }, { status: 500 });
    }

    const tokenResult = await createToken(userId, "default", 1000000);
    console.log("[register] Token result:", JSON.stringify(tokenResult).slice(0, 200));
    
    const apiKey = tokenResult.data?.key || tokenResult.data || "";
    
    return NextResponse.json({
      success: true,
      userId,
      apiKey: typeof apiKey === "string" ? apiKey : "",
    });
  } catch (e: any) {
    console.error("[register] Error:", e.message, e.stack);
    return NextResponse.json({ error: "Registration failed: " + e.message }, { status: 500 });
  }
}
