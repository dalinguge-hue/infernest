"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export default function DashboardPage() {
  const [keyVisible, setKeyVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const [refCopied, setRefCopied] = useState(false);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/me")
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="max-w-6xl mx-auto px-6 py-24 text-center text-slate-400">Loading...</div>;
  }

  if (!data || data.error) {
    return (
      <div className="max-w-md mx-auto px-6 py-24 text-center">
        <h1 className="text-2xl font-bold mb-4">Sign in to view dashboard</h1>
        <Link href="/auth/login" className="text-brand-light hover:underline">Sign In</Link>
        <span className="text-slate-500 mx-2">or</span>
        <Link href="/auth/signup" className="text-brand-light hover:underline">Create Account</Link>
      </div>
    );
  }

    const copyRef = () => {
    navigator.clipboard.writeText('https://infernest.xyz/auth/signup?ref=' + (data?.affCode || ''));
    setRefCopied(true);
    setTimeout(() => setRefCopied(false), 2000);
  };

  const copyKey = () => {
    navigator.clipboard.writeText(data?.apiKey || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const balanceTokens = data.balance || 0;
  const usedTokens = data.usedQuota || 0;
  const totalQuota = data.quota || 0;

const usageData = data.dailyUsage && data.dailyUsage.length > 0 ? data.dailyUsage : Array.from({ length: 30 }, (_, i) => ({ day: new Date(Date.now() - (29 - i) * 86400000).toLocaleDateString("en", { month: "short", day: "numeric" }), tokens: 0 }));

  const modelData = [
    { name: "DeepSeek V4 Flash", value: 100, color: "#3b82f6" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">Welcome back, {data.username}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#1e293b] border border-slate-700/50 rounded-xl p-5">
          <div className="text-xs text-slate-500 mb-1">Balance</div>
          <div className="text-lg font-bold font-mono text-white">{balanceTokens.toLocaleString()}</div>
          <div className="text-xs text-slate-500 mt-0.5">tokens available</div>
        </div>
        <div className="bg-[#1e293b] border border-slate-700/50 rounded-xl p-5">
          <div className="text-xs text-slate-500 mb-1">Used</div>
          <div className="text-lg font-bold font-mono text-white">{usedTokens.toLocaleString()}</div>
          <div className="text-xs text-slate-500 mt-0.5">tokens consumed</div>
        </div>
        <div className="bg-[#1e293b] border border-slate-700/50 rounded-xl p-5">
          <div className="text-xs text-slate-500 mb-1">Total Quota</div>
          <div className="text-lg font-bold font-mono text-white">{totalQuota.toLocaleString()}</div>
          <div className="text-xs text-slate-500 mt-0.5">lifetime tokens</div>
        </div>
        <div className="bg-[#1e293b] border border-slate-700/50 rounded-xl p-5">
          <div className="text-xs text-slate-500 mb-1">API Key</div>
          <div className="text-lg font-bold font-mono text-white truncate">
            {keyVisible ? data.apiKey : "sk-••••••••••••••••"}
          </div>
          <div className="flex gap-2 mt-1">
            <button onClick={() => setKeyVisible(!keyVisible)} className="text-xs text-brand-light hover:underline">
              {keyVisible ? "Hide" : "Show"}
            </button>
            <button onClick={copyKey} className="text-xs bg-brand hover:bg-brand-dark text-white px-2 py-0.5 rounded transition-colors">
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-[#1e293b] border border-slate-700/50 rounded-xl p-6">
          <h3 className="font-semibold mb-4 text-sm">Token Usage (30 days)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={usageData}>
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} interval={6} />
              <YAxis tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} tickFormatter={v => (v / 1000000).toFixed(1) + "M"} />
              <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "8px", fontSize: "12px" }} labelStyle={{ color: "#94a3b8" }} />
              <Line type="monotone" dataKey="tokens" stroke="#3b82f6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-[#1e293b] border border-slate-700/50 rounded-xl p-6">
          <h3 className="font-semibold mb-4 text-sm">By Model</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={modelData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={50}>
                {modelData.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "8px", fontSize: "12px" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {modelData.map((d) => (
              <div key={d.name} className="flex items-center gap-2 text-xs">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                <span className="text-slate-400">{d.name}</span>
                <span className="text-slate-500 ml-auto">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

            {data.affCode && (
        <div className="mb-8 bg-[#1e293b] border border-brand/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-sm">Referral Program</h3>
            <span className="text-xs text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full">Earn 10%</span>
          </div>
          <p className="text-xs text-slate-400 mb-3">Share your link. When friends sign up and buy credits, you get 10% of their payment in free tokens.</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-xs text-slate-300 bg-[#0f172a] rounded-lg px-3 py-2 font-mono truncate">
              https://infernest.xyz/auth/signup?ref={data.affCode}
            </code>
            <button onClick={copyRef} className="bg-brand hover:bg-brand-dark text-white px-3 py-2 rounded-lg text-xs font-medium transition-colors shrink-0">
              {refCopied ? "Copied!" : "Copy Link"}
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/dashboard/keys" className="bg-[#1e293b] border border-slate-700/50 rounded-xl p-5 hover:border-slate-600 transition-colors">
          <div className="text-sm font-medium text-white mb-1">API Keys</div>
          <div className="text-xs text-slate-400">Manage your keys</div>
        </Link>
        <Link href="/dashboard/billing" className="bg-[#1e293b] border border-slate-700/50 rounded-xl p-5 hover:border-slate-600 transition-colors">
          <div className="text-sm font-medium text-white mb-1">Billing</div>
          <div className="text-xs text-slate-400">Add credits</div>
        </Link>
        <Link href="/docs" className="bg-[#1e293b] border border-slate-700/50 rounded-xl p-5 hover:border-slate-600 transition-colors">
          <div className="text-sm font-medium text-white mb-1">API Docs</div>
          <div className="text-xs text-slate-400">Quick start guide</div>
        </Link>
      </div>
    </div>
  );
}
