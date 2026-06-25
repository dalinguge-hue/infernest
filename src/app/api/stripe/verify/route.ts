import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "infernest-secret-change-me-2026"
);

export async function GET(req: NextRequest) {
  const token = req.cookies.get("infernest_token")?.value;
  if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  let userId: number;
  try {
    const { payload } = await jose.jwtVerify(token, JWT_SECRET);
    userId = payload.userId as number;
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const sessionId = req.nextUrl.searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
  }

  const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY;
  if (!STRIPE_SECRET) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
  }

  try {
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(STRIPE_SECRET);
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return NextResponse.json({ error: "Payment not completed" }, { status: 400 });
    }

    const tokensFromMeta = Number(session.metadata?.tokens || 0);
    const amountTotal = session.amount_total || 0;
    const tokensToAdd = tokensFromMeta || Math.floor(amountTotal / 100) * 500000;

    const ONEAPI_URL = process.env.ONEAPI_URL || "http://38.47.102.235";
    const ONEAPI_ROOT_PASS = process.env.ONEAPI_ROOT_PASSWORD || "";

    const loginRes = await fetch(ONEAPI_URL + "/api/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "root", password: ONEAPI_ROOT_PASS }),
      signal: AbortSignal.timeout(8000),
    });
    const setCookie = loginRes.headers.get("set-cookie") || "";
    const match = setCookie.match(/session=([^;]+)/);
    if (!match) throw new Error("Admin login failed");
    const adminSession = match[1];

    const userRes = await fetch(ONEAPI_URL + "/api/user/?id=" + userId, {
      headers: { Cookie: "session=" + adminSession },
      signal: AbortSignal.timeout(8000),
    });
    const userData = await userRes.json();
    const users = Array.isArray(userData.data) ? userData.data : [userData.data];
    const user = users.find((u: any) => u.id === userId);
    const currentQuota = user?.quota || 0;
    const newQuota = currentQuota + tokensToAdd;

    await fetch(ONEAPI_URL + "/api/user/", {
      method: "PUT",
      headers: { "Content-Type": "application/json", Cookie: "session=" + adminSession },
      body: JSON.stringify({ id: userId, quota: newQuota }),
      signal: AbortSignal.timeout(8000),
    });

        // Referral bonus: give 10% to referrer
    const inviterId = user?.inviter_id;
    if (inviterId && inviterId > 0) {
      const bonus = Math.floor(tokensToAdd * 0.1);
      const refRes = await fetch(ONEAPI_URL + "/api/user/?id=" + inviterId, {
        headers: { Cookie: "session=" + adminSession },
        signal: AbortSignal.timeout(8000),
      });
      const refData = await refRes.json();
      const refUsers = Array.isArray(refData.data) ? refData.data : [refData.data];
      const refUser = refUsers.find((u: any) => u.id === inviterId);
      const refQuota = refUser?.quota || 0;
      await fetch(ONEAPI_URL + "/api/user/", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Cookie: "session=" + adminSession },
        body: JSON.stringify({ id: inviterId, quota: refQuota + bonus }),
        signal: AbortSignal.timeout(8000),
      });
      console.log("[verify] Referral bonus: " + bonus + " tokens to user " + inviterId);
    }

    return NextResponse.json({ success: true, quota: newQuota });
  } catch (e: any) {
    console.error("[verify] Failed:", e.message);
    return NextResponse.json({ error: "Failed to verify payment" }, { status: 500 });
  }
}
