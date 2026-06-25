import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY;
  const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

  if (!STRIPE_SECRET || !WEBHOOK_SECRET) {
    console.error("[webhook] Missing Stripe env vars");
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
  }

  const body = await req.text();
  const sig = req.headers.get("stripe-signature") || "";

  let event: any;
  try {
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(STRIPE_SECRET);
    event = stripe.webhooks.constructEvent(body, sig, WEBHOOK_SECRET);
  } catch (e: any) {
    console.error("[webhook] Signature verification failed:", e.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata?.userId;
    const amountTotal = session.amount_total || 0;
    const tokensToAdd = Math.floor(amountTotal / 100) * 500000;

    console.log(`[webhook] Payment received: userId=${userId}, amount=${amountTotal}, tokens=${tokensToAdd}`);

    if (userId) {
      try {
        const ONEAPI_URL = process.env.ONEAPI_URL || "http://38.47.102.235";
        const ONEAPI_ROOT_PASS = process.env.ONEAPI_ROOT_PASSWORD || "";

        // Login as admin
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

        // Get current quota
        const userRes = await fetch(ONEAPI_URL + "/api/user/?id=" + userId, {
          headers: { Cookie: "session=" + adminSession },
          signal: AbortSignal.timeout(8000),
        });
        const userData = await userRes.json();
        const currentQuota = userData?.data?.quota || 0;

        // Add to quota
        const newQuota = currentQuota + tokensToAdd;
        await fetch(ONEAPI_URL + "/api/user/", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Cookie: "session=" + adminSession,
          },
          body: JSON.stringify({ id: Number(userId), quota: newQuota }),
          signal: AbortSignal.timeout(8000),
        });

        console.log(`[webhook] User ${userId}: quota ${currentQuota} -> ${newQuota}`);
      } catch (e: any) {
        console.error("[webhook] Quota update failed:", e.message);
        return NextResponse.json({ error: "Failed to update quota" }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}
