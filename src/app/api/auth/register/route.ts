import { NextRequest, NextResponse } from "next/server";
import { createUser, createToken } from "@/lib/oneapi";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    
    // Step 1: Create user in One-API
    const userResult = await createUser(email, password);
    if (!userResult.success) {
      return NextResponse.json({ error: userResult.message || "Failed to create user" }, { status: 400 });
    }
    
    const userId = userResult.data?.id;
    if (!userId) {
      return NextResponse.json({ error: "User created but no ID returned" }, { status: 500 });
    }

    // Step 2: Generate API key
    const tokenResult = await createToken(userId, "default", 1000000);
    const apiKey = tokenResult.data?.key || tokenResult.data || "";
    
    return NextResponse.json({
      success: true,
      userId,
      apiKey: typeof apiKey === "string" ? apiKey : "",
    });
  } catch (e: any) {
    console.error("Registration error:", e);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
