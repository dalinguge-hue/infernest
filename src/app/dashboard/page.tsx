"use client";
import Link from "next/link";
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const usageData = Array.from({ length: 30 }, (_, i) => ({
  day: `Jun ${i + 1}`,
  tokens: Math.floor(Math.random() * 500000 + 200000),
}));

const modelData = [
  { name: "DeepSeek V4 Flash", value: 45, color: "#3b82f6" },
  { name: "Qwen 3.6", value: 28, color: "#8b5cf6" },
  { name: "GLM 5.2", value: 17, color: "#06b6d4" },
  { name: "Doubao Pro", value: 10, color: "#f59e0b" },
];

export default function DashboardPage() {
  const [keyVisible, setKeyVisible] = useState(false);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">Welcome back</p>
        </div>
        <Link href="/auth/signup" className="text-sm text-brand-light hover:underline">+ New API Key</Link>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Today", value: "1.2M", sub: "tokens" },
          { label: "This Month", value: "28.4M", sub: "tokens" },
          { label: "Balance", value: "$8.42", sub: "remaining" },
          { label: "API Key", value: keyVisible ? "sk-infr-xxxx" : "sk-infr-••••", sub: "", action: () => setKeyVisible(!keyVisible), actionLabel: keyVisible ? "Hide" : "Show" },
        ].map((card) => (
          <div key={card.label} className="bg-[#1e293b] border border-slate-700/50 rounded-xl p-5">
            <div className="text-xs text-slate-500 mb-1">{card.label}</div>
            <div className="text-2xl font-bold font-mono text-white">{card.value}</div>
            <div className="text-xs text-slate-500 mt-0.5">
              {card.sub}
              {card.action && (
                <button onClick={card.action} className="ml-2 text-brand-light hover:underline">{card.actionLabel}</button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-[#1e293b] border border-slate-700/50 rounded-xl p-6">
          <h3 className="font-semibold mb-4 text-sm">Token Usage (30 days)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={usageData}>
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} interval={6} />
              <YAxis tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000000).toFixed(1)}M`} />
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

      {/* Quick actions */}
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
