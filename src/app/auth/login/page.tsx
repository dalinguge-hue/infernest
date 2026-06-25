"use client";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="max-w-md mx-auto px-6 py-24">
      <h1 className="text-2xl font-bold mb-2">Sign In</h1>
      <p className="text-slate-400 mb-8 text-sm">Welcome back to InferNest.</p>
      <form onSubmit={e => e.preventDefault()} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-slate-300 block mb-1.5">Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand" placeholder="you@example.com" />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-300 block mb-1.5">Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand" />
        </div>
        <button type="submit" className="w-full bg-brand hover:bg-brand-dark text-white py-2.5 rounded-lg font-medium transition-colors">Sign In</button>
      </form>
      <p className="text-center text-sm text-slate-500 mt-6">
        Don&apos;t have an account? <Link href="/auth/signup" className="text-brand-light hover:underline">Create one</Link>
      </p>
    </div>
  );
}
