"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        router.push("/dashboard");
      } else {
        setErrorMsg(data.error || "Login failed");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-24">
      <h1 className="text-2xl font-bold mb-2">Sign In</h1>
      <p className="text-slate-400 mb-8 text-sm">Welcome back to InferNest.</p>
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
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand" placeholder="Your password" />
        </div>
        <button type="submit" disabled={status === "loading"} className="w-full bg-brand hover:bg-brand-dark disabled:opacity-50 text-white py-2.5 rounded-lg font-medium transition-colors">
          {status === "loading" ? "Signing in..." : "Sign In"}
        </button>
      </form>
      <p className="text-center text-sm text-slate-500 mt-6">
        Don't have an account? <Link href="/auth/signup" className="text-brand-light hover:underline">Create one</Link>
      </p>
    </div>
  );
}
