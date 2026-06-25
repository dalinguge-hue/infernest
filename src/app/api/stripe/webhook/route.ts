import { NextRequest, NextResponse } from "next/server";

let stripeInstance: any = null;
function getStripe() {
  if (!stripeInstance && process.env.STRIPE_SECRET_KEY) {
    const Stripe = require("stripe");
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return stripeInstance;
}

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
  }

  const body = await req.text();
  const sig = req.headers.get("stripe-signature") || "";

  let event: any;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET || "");
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata?.userId;
    const amount = session.amount_total || 0;
    const tokensToAdd = Math.floor(amount / 100) * 500000;

    if (userId) {
      try {
        // Fetch current quota, then add to it (not overwrite)
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

        // Get current user info
        const userRes = await fetch(ONEAPI_URL + "/api/user/?id=" + userId, {
          headers: { Cookie: "session=" + adminSession },
          signal: AbortSignal.timeout(8000),
        });
        const userData = await userRes.json();
        const currentQuota = userData?.data?.quota || 0;

        // Set new quota = current + purchased
        await fetch(ONEAPI_URL + "/api/user/", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Cookie: "session=" + adminSession,
          },
          body: JSON.stringify({ id: Number(userId), quota: currentQuota + tokensToAdd }),
          signal: AbortSignal.timeout(8000),
        });

        console.log(`[webhook] User ${userId}: quota ${currentQuota} -> ${currentQuota + tokensToAdd}`);
      } catch (e) {
        console.error("[webhook] Failed to update quota:", e);
      }
    }
  }

  return NextResponse.json({ received: true });
}
