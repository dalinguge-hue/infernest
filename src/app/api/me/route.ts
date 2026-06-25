import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getUserInfo } from "@/lib/oneapi";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  let quota = 0;
  let usedQuota = 0;
  let affCode = "";
  const dailyUsage: { day: string; tokens: number }[] = [];

  try {
    const info = await getUserInfo(session.userId);
    if (info.success && info.data) {
      quota = info.data.quota || 0;
      usedQuota = info.data.used_quota || 0;
      affCode = info.data.aff_code || "";
    }

    // Real usage logs for chart
    const ONEAPI_URL = process.env.ONEAPI_URL || "http://38.47.102.235";
    const now = Math.floor(Date.now() / 1000);
    const thirtyDaysAgo = now - 30 * 86400;
    const logsRes = await fetch(
      ONEAPI_URL + "/api/log/?p=0&page_size=1000&token_name=" + encodeURIComponent(session.apiKey) + "&start_timestamp=" + thirtyDaysAgo + "&end_timestamp=" + now,
      { headers: { Authorization: "Bearer " + session.apiKey }, signal: AbortSignal.timeout(8000) }
    );
    const logsData = await logsRes.json();
    if (logsData.success && logsData.data) {
      const dayMap: Record<string, number> = {};
      for (let i = 29; i >= 0; i--) {
        const d = new Date(Date.now() - i * 86400000);
        dayMap[d.toLocaleDateString("en", { month: "short", day: "numeric" })] = 0;
      }
      for (const log of logsData.data) {
        const ts = log.created_at || log.timestamp || 0;
        const d = new Date(ts * 1000);
        const key = d.toLocaleDateString("en", { month: "short", day: "numeric" });
        if (dayMap[key] !== undefined) dayMap[key] += log.quota || log.token_count || 0;
      }
      for (const [day, tokens] of Object.entries(dayMap)) {
        dailyUsage.push({ day, tokens });
      }
    }
  } catch (e) {
    console.error("Failed to get user info:", e);
  }

  return NextResponse.json({
    userId: session.userId,
    username: session.username,
    apiKey: session.apiKey,
    affCode,
    quota,
    usedQuota,
    balance: quota - usedQuota,
    dailyUsage,
  });
}
