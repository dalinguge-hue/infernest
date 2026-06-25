"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

export default function NavBar() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/me")
      .then(r => r.json())
      .then(d => { if (!d.error) setUser(d); })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setMenuOpen(false);
    window.location.href = "/";
  };

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
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-brand/20 text-brand-light flex items-center justify-center text-xs font-bold">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ transform: menuOpen ? "rotate(180deg)" : "rotate(0deg)" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#1e293b] border border-slate-700 rounded-lg shadow-xl py-1 z-50">
                  <div className="px-3 py-2 border-b border-slate-700">
                    <div className="text-xs text-white font-medium">{user.username}</div>
                    <div className="text-[10px] text-slate-500 truncate">{user.apiKey}</div>
                  </div>
                  <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">Dashboard</Link>
                  <Link href="/dashboard/keys" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">API Keys</Link>
                  <Link href="/dashboard/billing" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">Billing</Link>
                  <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-slate-800 transition-colors border-t border-slate-700">Log out</button>
                </div>
              )}
            </div>
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
