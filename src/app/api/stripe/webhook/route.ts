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
        const { addUserQuota, getUserQuota } = await import("@/lib/oneapi");
        const user = await getUserQuota(Number(userId));
        const currentQuota = user.data?.quota || 0;
        await addUserQuota(Number(userId), currentQuota + tokensToAdd);
      } catch (e) {
        console.error("Failed to update quota:", e);
      }
    }
  }

  return NextResponse.json({ received: true });
}
