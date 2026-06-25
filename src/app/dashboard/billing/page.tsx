"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function BillingPage() {
  const [data, setData] = useState<any>(null);
  useEffect(() => { fetch("/api/me").then(r => r.json()).then(setData).catch(() => {}); }, []);

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-2">Billing</h1>
      <p className="text-slate-400 text-sm mb-8">Add credits to your account. 1 credit = 500,000 tokens.</p>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        {[
          { amount: 10, price: "$10", tokens: "5M" },
          { amount: 50, price: "$50", tokens: "25M", popular: true },
          { amount: 100, price: "$100", tokens: "50M" },
          { amount: 500, price: "$500", tokens: "250M" },
        ].map((plan) => (
          <div key={plan.amount} className={`bg-[#1e293b] border rounded-xl p-5 text-center ${plan.popular ? "border-brand/50 ring-1 ring-brand/20" : "border-slate-700/50"}`}>
            {plan.popular && <div className="text-xs text-brand-light mb-1 font-medium">Most Popular</div>}
            <div className="text-3xl font-bold text-white mb-1">{plan.price}</div>
            <div className="text-xs text-slate-400 mb-3">~{plan.tokens} tokens</div>
            <button className="w-full bg-brand hover:bg-brand-dark text-white py-2 rounded-lg text-sm font-medium transition-colors">
              Purchase
            </button>
          </div>
        ))}
      </div>

      <div className="bg-[#1e293b] border border-slate-700/50 rounded-xl p-6">
        <h3 className="font-semibold mb-4 text-sm">Transaction History</h3>
        <div className="text-sm text-slate-500 text-center py-8">Stripe integration coming soon. For now, credits are added manually.</div>
      </div>

      <p className="text-center text-sm text-slate-500 mt-8">
        Back to <Link href="/dashboard" className="text-brand-light hover:underline">Dashboard</Link>
      </p>
    </div>
  );
}

