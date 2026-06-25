import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "infernest-secret-change-me-2026"
);

export async function POST(req: NextRequest) {
  const token = req.cookies.get("infernest_token")?.value;
  if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  let username: string;
  try {
    const { payload } = await jose.jwtVerify(token, JWT_SECRET);
    username = payload.username as string;
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const { amount, txid } = await req.json();
  if (!amount || !txid) {
    return NextResponse.json({ error: "Missing amount or txid" }, { status: 400 });
  }

  console.log("[crypto] Payment submitted:", { username, amount, txid, time: new Date().toISOString() });

  return NextResponse.json({
    success: true,
    message: "Payment submitted. We will verify and add credits within 1 hour.",
  });
}
