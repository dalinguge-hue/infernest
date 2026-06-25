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

  // Get user from JWT cookie
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

  // Dynamic import to avoid build-time issues
  const Stripe = (await import("stripe")).default;
  const stripe = new Stripe(STRIPE_SECRET);

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "InferNest API Credits",
            description: `${(amount * 500000).toLocaleString()} tokens (~${amount * 500}K)`,
          },
          unit_amount: amountInCents,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${req.nextUrl.origin}/dashboard?payment=success`,
    cancel_url: `${req.nextUrl.origin}/dashboard/billing?payment=cancelled`,
    metadata: {
      userId: String(userId),
      amount: String(amount),
    },
  });

  return NextResponse.json({ url: session.url });
}
