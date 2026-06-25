import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "infernest-secret-change-me-2026"
);

const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY;

export async function POST(req: NextRequest) {
  if (!STRIPE_SECRET) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
  }

  const token = req.cookies.get("infernest_token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  let userId: number;
  try {
    const { payload } = await jose.jwtVerify(token, JWT_SECRET);
    userId = payload.userId as number;
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const { amount } = await req.json();
  const amountInCents = Math.round(amount * 100);

  const Stripe = (await import("stripe")).default;
  const stripe = new Stripe(STRIPE_SECRET);

  const origin = req.nextUrl.origin;
  const successUrl = origin + "/dashboard/billing?session_id={CHECKOUT_SESSION_ID}";
  const cancelUrl = origin + "/dashboard/billing?cancelled=1";

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "InferNest API Credits",
            description: (amount * 500000).toLocaleString() + " tokens",
          },
          unit_amount: amountInCents,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: successUrl,
    cancel_url: cancelUrl,
    client_reference_id: "user_" + userId + "_" + amount,
    metadata: {
      user_id: String(userId),
      tokens: String(amount * 500000),
    },
  });

  return NextResponse.json({ url: session.url });
}