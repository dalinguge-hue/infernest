import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getUsage } from "@/lib/oneapi";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  // Get 30-day usage
  const now = Math.floor(Date.now() / 1000);
  const thirtyDaysAgo = now - 30 * 86400;
  let usageData: any[] = [];
  try {
    const usage = await getUsage(session.apiKey, thirtyDaysAgo, now);
    if (usage.success && usage.data) {
      usageData = usage.data;
    }
  } catch {}

  // Total tokens
  const totalTokens = usageData.reduce((sum: number, r: any) => sum + (r.token_count || r.quota || 0), 0);
  const todayTokens = usageData
    .filter((r: any) => {
      const ts = r.timestamp || r.created_at || 0;
      const d = new Date(ts * 1000).toDateString();
      return d === new Date().toDateString();
    })
    .reduce((sum: number, r: any) => sum + (r.token_count || r.quota || 0), 0);

  return NextResponse.json({
    userId: session.userId,
    username: session.username,
    apiKey: session.apiKey,
    todayTokens,
    monthTokens: totalTokens,
  });
}
