import { NextRequest, NextResponse } from "next/server";
import { resetUserPassword } from "@/lib/oneapi";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Please enter a valid email" }, { status: 400 });
    }

    const result = await resetUserPassword(email);
    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, tempPassword: result.tempPassword });
  } catch (e: any) {
    console.error("[forgot-password] Error:", e.message);
    return NextResponse.json({ error: "Something went wrong. Try again later." }, { status: 500 });
  }
}
