"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function BillingPage() {
  const [loading, setLoading] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const verified = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");
    if (sessionId && !verified.current) {
      verified.current = true;
      setMessage("Verifying payment...");
      fetch("/api/stripe/verify?session_id=" + sessionId)
        .then(r => r.json())
        .then(d => {
          if (d.success) {
            setMessage("Payment confirmed! " + d.quota.toLocaleString() + " tokens available.");
            window.history.replaceState({}, "", "/dashboard/billing");
          } else {
            setMessage(d.error || "Verification failed");
          }
        })
        .catch(() => setMessage("Network error"));
    }
    if (params.get("cancelled") === "1") {
      setMessage("Payment cancelled.");
      window.history.replaceState({}, "", "/dashboard/billing");
    }
  }, []);

  const handlePurchase = async (amount: number) => {
    setLoading(amount);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch {
      alert("Network error. Please try again.");
    }
    setLoading(null);
  };

  const plans = [
    { amount: 10, price: "$10", tokens: "5M", popular: false },
    { amount: 50, price: "$50", tokens: "25M", popular: true },
    { amount: 100, price: "$100", tokens: "50M", popular: false },
    { amount: 500, price: "$500", tokens: "250M", popular: false },
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-2">Billing</h1>
      <p className="text-slate-400 text-sm mb-8">Add credits to your account. 1 credit = 500,000 tokens.</p>

      {message && (
        <div className="mb-6 p-3 bg-brand/10 border border-brand/30 rounded-lg text-sm text-brand-light">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        {plans.map((plan) => (
          <div key={plan.amount} className={`bg-[#1e293b] border rounded-xl p-5 text-center ${plan.popular ? "border-brand/50 ring-1 ring-brand/20" : "border-slate-700/50"}`}>
            {plan.popular && <div className="text-xs text-brand-light mb-1 font-medium">Most Popular</div>}
            <div className="text-3xl font-bold text-white mb-1">{plan.price}</div>
            <div className="text-xs text-slate-400 mb-3">~{plan.tokens} tokens</div>
            <button
              onClick={() => handlePurchase(plan.amount)}
              disabled={loading === plan.amount}
              className="w-full bg-brand hover:bg-brand-dark disabled:opacity-50 text-white py-2 rounded-lg text-sm font-medium transition-colors"
            >
              {loading === plan.amount ? "Redirecting..." : "Purchase"}
            </button>
          </div>
        ))}
      </div>

      <div className="bg-[#1e293b] border border-slate-700/50 rounded-xl p-6">
        <h3 className="font-semibold mb-4 text-sm">Payment Info</h3>
        <ul className="text-sm text-slate-400 space-y-2">
          <li>Powered by <span className="text-white">Stripe</span> — secure payments, globally trusted</li>
          <li>Credits are added automatically after successful payment</li>
          <li>For custom amounts or invoicing, contact support</li>
        </ul>
      </div>

      <p className="text-center text-sm text-slate-500 mt-8">
        Back to <Link href="/dashboard" className="text-brand-light hover:underline">Dashboard</Link>
      </p>
    </div>
  );
}
