import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getUserInfo } from "@/lib/oneapi";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  // Get user info from One-API (includes quota)
  let quota = 0;
  let usedQuota = 0;
  try {
    const info = await getUserInfo(session.userId);
    if (info.success && info.data) {
      quota = info.data.quota || 0;
      usedQuota = info.data.used_quota || 0;
    }
  } catch (e) {
    console.error("Failed to get user info:", e);
  }

  return NextResponse.json({
    userId: session.userId,
    username: session.username,
    apiKey: session.apiKey,
    quota,
    usedQuota,
    balance: quota - usedQuota,
  });
}
