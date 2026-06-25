"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function NavBar() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/me")
      .then(r => r.json())
      .then(d => { if (!d.error) setUser(d); })
      .finally(() => setLoading(false));
  }, []);

  return (
    <nav className="border-b border-slate-800 bg-[#0f172a]/80 backdrop-blur sticky top-0 z-50" translate="no">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg tracking-tight">
          <span className="text-white">Infer</span><span className="text-brand">Nest</span>
        </Link>
        <div className="flex items-center gap-6 text-sm text-slate-400">
          <Link href="/models" className="hover:text-white transition-colors">Models</Link>
          <Link href="/docs" className="hover:text-white transition-colors">Docs</Link>
          <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
          {!loading && user ? (
            <>
              <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
              <span className="text-slate-600">|</span>
              <span className="text-slate-500 text-xs truncate max-w-[140px]" title={user.apiKey}>{user.username}</span>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="text-brand-light hover:text-white transition-colors">Sign In</Link>
              <Link href="/auth/signup" className="bg-brand hover:bg-brand-dark text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
