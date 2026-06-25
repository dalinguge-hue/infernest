"use client";
import { useState } from "react";

const plans = [
  { amount: 10, tokens: "~5M", label: "Starter" },
  { amount: 50, tokens: "~30M", label: "Popular", highlight: true },
  { amount: 100, tokens: "~65M", label: "Pro" },
];

const history = [
  { date: "2026-06-20", amount: "$10.00", status: "Completed" },
  { date: "2026-06-15", amount: "$50.00", status: "Completed" },
];

export default function BillingPage() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-2">Billing</h1>
      <p className="text-slate-400 text-sm mb-8">Add credits to your account. Pay as you go, no subscriptions.</p>

      {/* Balance */}
      <div className="bg-[#1e293b] border border-slate-700/50 rounded-xl p-6 mb-8">
        <div className="text-xs text-slate-500 mb-1">Current Balance</div>
        <div className="text-3xl font-bold font-mono text-white">$8.42</div>
      </div>

      {/* Top-up plans */}
      <h2 className="font-semibold mb-4">Add Credits</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {plans.map((p) => (
          <button
            key={p.amount}
            onClick={() => setSelected(p.amount)}
            className={`border rounded-xl p-5 text-left transition-all ${
              selected === p.amount
                ? "border-brand bg-brand/5"
                : p.highlight
                ? "border-slate-600 bg-[#1e293b]"
                : "border-slate-700/50 bg-[#1e293b] hover:border-slate-600"
            }`}
          >
            {p.highlight && <span className="text-[10px] bg-brand/20 text-brand-light px-2 py-0.5 rounded-full font-medium uppercase mb-2 inline-block">Most Popular</span>}
            <div className="text-2xl font-bold text-white">${p.amount}</div>
            <div className="text-xs text-slate-400 mt-1">{p.tokens} tokens</div>
            <div className="text-xs text-slate-500 mt-0.5">{p.label}</div>
          </button>
        ))}
      </div>

      {selected && (
        <button className="w-full sm:w-auto bg-brand hover:bg-brand-dark text-white px-8 py-3 rounded-lg font-semibold transition-colors">
          Pay ${selected}.00 with Stripe
        </button>
      )}

      {/* History */}
      <h2 className="font-semibold mt-12 mb-4">Payment History</h2>
      <div className="bg-[#1e293b] border border-slate-700/50 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 text-xs">
              <th className="text-left py-3 px-5 font-medium">Date</th>
              <th className="text-left py-3 font-medium">Amount</th>
              <th className="text-left py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {history.map((h, i) => (
              <tr key={i} className="border-b border-slate-800/50">
                <td className="py-3 px-5 text-slate-300">{h.date}</td>
                <td className="py-3 font-mono text-slate-300">{h.amount}</td>
                <td className="py-3"><span className="bg-green-500/10 text-green-400 text-[10px] px-2 py-0.5 rounded-full">{h.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
