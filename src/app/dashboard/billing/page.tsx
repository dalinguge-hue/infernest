"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const USDT_ADDRESS = "TGoWP8x9QrVKFLSE1yPZRxB48jC3RvkEW9";

const bankInfo = {
  bank: "Citibank",
  address: "111 Wall Street, New York, NY 10043, USA",
  routing: "031100209",
  swift: "CITIUS33",
  account: "70584550002483457",
  type: "CHECKING",
  beneficiary: "Guanglin Jiang",
};

export default function BillingPage() {
  const [loading, setLoading] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [tab, setTab] = useState<"card" | "crypto" | "wire">("card");
  const [copied, setCopied] = useState("");
  const [txid, setTxid] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState(50);
  const [selectedWire, setSelectedWire] = useState(100);
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

  const handleStripePurchase = async (amount: number) => {
    setLoading(amount);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert(data.error || "Something went wrong");
    } catch {
      alert("Network error. Please try again.");
    }
    setLoading(null);
  };

  const copyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(""), 2000);
  };

  const handleCryptoSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/crypto/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: selectedCrypto, txid }),
      });
      const data = await res.json();
      setMessage(data.success ? data.message : (data.error || "Failed"));
      if (data.success) setTxid("");
    } catch {
      setMessage("Network error");
    }
    setSubmitting(false);
  };

  const handleWireSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/crypto/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: selectedWire, txid, method: "wire" }),
      });
      const data = await res.json();
      setMessage(data.success ? data.message : (data.error || "Failed"));
      if (data.success) setTxid("");
    } catch {
      setMessage("Network error");
    }
    setSubmitting(false);
  };

  const plans = [
    { amount: 10, tokens: "5M", popular: false },
    { amount: 50, tokens: "25M", popular: true },
    { amount: 100, tokens: "50M", popular: false },
    { amount: 500, tokens: "250M", popular: false },
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

      <div className="flex gap-1 bg-[#1e293b] rounded-lg p-1 mb-8 w-fit">
        {(["card", "crypto", "wire"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors capitalize ${tab === t ? "bg-brand text-white" : "text-slate-400 hover:text-white"}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === "card" ? (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
            {plans.map((plan) => (
              <div key={plan.amount} className={`bg-[#1e293b] border rounded-xl p-5 text-center flex flex-col ${plan.popular ? "border-brand/50 ring-1 ring-brand/20" : "border-slate-700/50"}`}>
                {plan.popular && <div className="text-xs text-brand-light mb-1 font-medium">Most Popular</div>}
                <div className="text-3xl font-bold text-white mb-1">${plan.amount}</div>
                <div className="text-xs text-slate-400 mb-3">~{plan.tokens} tokens</div>
                <button onClick={() => handleStripePurchase(plan.amount)} disabled={loading === plan.amount} className="mt-auto w-full bg-brand hover:bg-brand-dark disabled:opacity-50 text-white py-2 rounded-lg text-sm font-medium transition-colors">
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
        </div>
      ) : tab === "crypto" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-lg font-semibold mb-4">Select Amount</h2>
            <div className="grid grid-cols-2 gap-3">
              {plans.map((plan) => (
                <button key={plan.amount} onClick={() => setSelectedCrypto(plan.amount)} className={`text-left bg-[#1e293b] border rounded-xl p-4 w-full transition-all ${selectedCrypto === plan.amount ? "border-brand ring-2 ring-brand/30" : plan.popular ? "border-brand/50" : "border-slate-700/50 hover:border-slate-600"}`}>
                  <div className="text-xs text-slate-400 mb-1">{plan.tokens} tokens</div>
                  <div className="text-2xl font-bold text-white">{plan.amount} USDT</div>
                  <div className="text-xs text-slate-500 mt-1">≈ ${plan.amount} USD</div>
                </button>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-4">Send USDT</h2>
            <div className="bg-[#1e293b] border border-slate-700/50 rounded-xl p-6">
              <div className="text-xs text-slate-400 mb-2">Network: TRC-20</div>
              <div className="text-xs text-slate-400 mb-3">Send only USDT on Tron (TRC-20).</div>
              <div className="bg-[#0f172a] rounded-lg p-4 mb-4">
                <div className="text-xs text-slate-500 mb-1 font-mono break-all">{USDT_ADDRESS}</div>
              </div>
              <button onClick={() => copyText(USDT_ADDRESS, "addr")} className="w-full bg-brand hover:bg-brand-dark text-white py-2 rounded-lg text-sm font-medium transition-colors mb-6">
                {copied === "addr" ? "Copied!" : "Copy Address"}
              </button>
              <div className="border-t border-slate-700 pt-4">
                <div className="text-xs text-slate-400 mb-2">Paste your transaction ID (TXID):</div>
                <input type="text" placeholder="TRC-20 TXID / Hash" value={txid} onChange={(e) => setTxid(e.target.value)} className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-600 mb-3 focus:outline-none focus:border-brand" />
                <button onClick={handleCryptoSubmit} disabled={!selectedCrypto || !txid || submitting} className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-40 text-white py-2 rounded-lg text-sm font-medium transition-colors">
                  {submitting ? "Submitting..." : "I've Sent the Payment"}
                </button>
                <div className="text-[11px] text-slate-500 mt-3 text-center">Credits added after verification (usually within 1 hour).</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-lg font-semibold mb-4">Select Amount</h2>
            <div className="grid grid-cols-2 gap-3">
              {plans.map((plan) => (
                <button key={plan.amount} onClick={() => setSelectedWire(plan.amount)} className={`text-left bg-[#1e293b] border rounded-xl p-4 w-full transition-all ${selectedWire === plan.amount ? "border-brand ring-2 ring-brand/30" : plan.popular ? "border-brand/50" : "border-slate-700/50 hover:border-slate-600"}`}>
                  <div className="text-xs text-slate-400 mb-1">{plan.tokens} tokens</div>
                  <div className="text-2xl font-bold text-white">${plan.amount}</div>
                  <div className="text-xs text-slate-500 mt-1">{plan.tokens} tokens</div>
                </button>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-4">Bank Transfer (USD)</h2>
            <div className="bg-[#1e293b] border border-slate-700/50 rounded-xl p-6">
              <div className="space-y-3 mb-4 text-sm">
                {[
                  ["Bank", bankInfo.bank],
                  ["Address", bankInfo.address],
                  ["Routing (ABA)", bankInfo.routing],
                  ["SWIFT", bankInfo.swift],
                  ["Account", bankInfo.account],
                  ["Type", bankInfo.type],
                  ["Beneficiary", bankInfo.beneficiary],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between items-center gap-3">
                    <span className="text-slate-500 text-xs shrink-0">{label}</span>
                    <span className="text-slate-300 text-xs font-mono text-right truncate">{value}</span>
                    <button onClick={() => copyText(value, label)} className="text-brand-light text-xs hover:underline shrink-0">
                      {copied === label ? "Copied" : "Copy"}
                    </button>
                  </div>
                ))}
              </div>
              <div className="border-t border-slate-700 pt-4">
                <div className="text-xs text-slate-400 mb-2">Paste transfer reference or note:</div>
                <input type="text" placeholder="Transfer reference / note" value={txid} onChange={(e) => setTxid(e.target.value)} className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-600 mb-3 focus:outline-none focus:border-brand" />
                <button onClick={handleWireSubmit} disabled={!selectedWire || !txid || submitting} className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-40 text-white py-2 rounded-lg text-sm font-medium transition-colors">
                  {submitting ? "Submitting..." : "I've Sent the Payment"}
                </button>
                <div className="text-[11px] text-slate-500 mt-3 text-center">
                  Bank transfers take 1-3 business days. Credits added after funds clear.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <p className="text-center text-sm text-slate-500 mt-8">
        Back to <Link href="/dashboard" className="text-brand-light hover:underline">Dashboard</Link>
      </p>
    </div>
  );
}
