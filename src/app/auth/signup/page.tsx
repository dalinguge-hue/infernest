"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function SignupPage() {
  const searchParams = useSearchParams();
  const refCode = searchParams.get("ref") || "";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [apiKey, setApiKey] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [affCode, setAffCode] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, refCode }),
      });
      const data = await res.json();
      
      if (data.success && data.apiKey) {
        setApiKey(data.apiKey);
        if (data.affCode) setAffCode(data.affCode);
        setStatus("done");
      } else {
        setErrorMsg(data.error || "Registration failed");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  };

  if (status === "done") {
    return (
      <div className="max-w-md mx-auto px-6 py-24 text-center">
        <div className="w-12 h-12 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4 text-xl">&#10003;</div>
        <h1 className="text-2xl font-bold mb-2">Your API Key is Ready</h1>
        <p className="text-slate-400 mb-4 text-sm">Save this key — it won&apos;t be shown again.</p>
        <div className="bg-[#1e293b] border border-slate-700 rounded-lg p-4 mb-6">
          <code className="text-brand-light text-sm break-all font-mono">{apiKey}</code>
        </div>
        <button
          onClick={() => navigator.clipboard.writeText(apiKey)}
          className="bg-[#1e293b] border border-slate-600 hover:border-slate-400 text-slate-300 px-6 py-2 rounded-lg text-sm mb-4 transition-colors"
        >
          Copy to Clipboard
        </button>
        {affCode && (
          <div className="mt-4 bg-brand/5 border border-brand/20 rounded-lg p-4 text-left">
            <div className="text-xs text-brand-light font-medium mb-1">Your Referral Code</div>
            <div className="text-xs text-slate-400 mb-2">Share this link to earn 10% of your friends' payments:</div>
            <code className="text-brand-light text-xs break-all font-mono">https://infernest.xyz/auth/signup?ref={affCode}</code>
          </div>
        )}
        <br />
        <Link href="/dashboard" className="text-brand-light hover:underline text-sm">Go to Dashboard &rarr;</Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-6 py-24">
      <h1 className="text-2xl font-bold mb-2">Create Account</h1>
      <p className="text-slate-400 mb-8 text-sm">Get your API key in 30 seconds.</p>
      {refCode && (
        <div className="bg-brand/5 border border-brand/20 rounded-lg p-3 mb-4 text-xs text-brand-light">
          You've been referred! You'll get bonus credits on your first purchase.
        </div>
      )}
      {status === "error" && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4 text-sm text-red-400">{errorMsg}</div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-slate-300 block mb-1.5">Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand" placeholder="you@example.com" />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-300 block mb-1.5">Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand" placeholder="Min 8 characters" />
        </div>
        <button type="submit" disabled={status === "loading"} className="w-full bg-brand hover:bg-brand-dark disabled:opacity-50 text-white py-2.5 rounded-lg font-medium transition-colors">
          {status === "loading" ? "Creating..." : "Create Account"}
        </button>
      </form>
      <p className="text-center text-sm text-slate-500 mt-6">
        Already have an account? <Link href="/auth/login" className="text-brand-light hover:underline">Sign in</Link>
      </p>
    </div>
  );
}
