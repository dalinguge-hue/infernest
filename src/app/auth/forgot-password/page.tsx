"use client";
import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [tempPassword, setTempPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success && data.tempPassword) {
        setTempPassword(data.tempPassword);
        setStatus("done");
      } else {
        setErrorMsg(data.error || "Failed to reset password");
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
        <h1 className="text-2xl font-bold mb-2">Password Reset</h1>
        <p className="text-slate-400 mb-4 text-sm">Use this temporary password to sign in, then change it in your dashboard.</p>
        <div className="bg-[#1e293b] border border-slate-700 rounded-lg p-4 mb-6">
          <code className="text-brand-light text-lg font-mono tracking-wider">{tempPassword}</code>
        </div>
        <button
          onClick={() => { navigator.clipboard.writeText(tempPassword); }}
          className="bg-[#1e293b] border border-slate-600 hover:border-slate-400 text-slate-300 px-6 py-2 rounded-lg text-sm mb-4 transition-colors"
        >
          Copy to Clipboard
        </button>
        <br />
        <Link href="/auth/login" className="text-brand-light hover:underline text-sm">Back to Sign In &rarr;</Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-6 py-24">
      <h1 className="text-2xl font-bold mb-2">Forgot Password</h1>
      <p className="text-slate-400 mb-8 text-sm">Enter your email and we&apos;ll generate a temporary password.</p>
      {status === "error" && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4 text-sm text-red-400">{errorMsg}</div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-slate-300 block mb-1.5">Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand" placeholder="you@example.com" />
        </div>
        <button type="submit" disabled={status === "loading"} className="w-full bg-brand hover:bg-brand-dark disabled:opacity-50 text-white py-2.5 rounded-lg font-medium transition-colors">
          {status === "loading" ? "Resetting..." : "Reset Password"}
        </button>
      </form>
      <p className="text-center text-sm text-slate-500 mt-6">
        <Link href="/auth/login" className="text-brand-light hover:underline">Back to Sign In</Link>
      </p>
    </div>
  );
}
