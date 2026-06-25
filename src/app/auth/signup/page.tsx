"use client";
import Link from "next/link";
import { useState } from "react";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    // Placeholder - actual auth will call One-API
    await new Promise(r => setTimeout(r, 800));
    setStatus("done");
  };

  if (status === "done") {
    return (
      <div className="max-w-md mx-auto px-6 py-24 text-center">
        <div className="w-12 h-12 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4 text-xl">&#10003;</div>
        <h1 className="text-2xl font-bold mb-2">Account Created</h1>
        <p className="text-slate-400 mb-6 text-sm">Check your email for your API key, or go to your dashboard.</p>
        <Link href="/dashboard" className="bg-brand hover:bg-brand-dark text-white px-6 py-2.5 rounded-lg font-medium transition-colors inline-block">Go to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-6 py-24">
      <h1 className="text-2xl font-bold mb-2">Create Account</h1>
      <p className="text-slate-400 mb-8 text-sm">Get your API key in 30 seconds.</p>
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
