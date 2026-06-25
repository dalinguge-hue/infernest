"use client";
import { useState } from "react";

const mockKeys = [
  { id: "sk-infr-a1b2c3", label: "Default", created: "2026-06-20", tokens: "12.4M", status: "active" },
  { id: "sk-infr-d4e5f6", label: "Dev testing", created: "2026-06-22", tokens: "890K", status: "active" },
];

export default function KeysPage() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">API Keys</h1>
          <p className="text-slate-400 text-sm mt-1">Manage your API keys and monitor usage per key.</p>
        </div>
        <button className="bg-brand hover:bg-brand-dark text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">+ New Key</button>
      </div>

      <div className="space-y-3">
        {mockKeys.map((k) => (
          <div key={k.id} className="bg-[#1e293b] border border-slate-700/50 rounded-xl p-5 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="font-medium text-white text-sm">{k.label}</span>
                <span className="bg-green-500/10 text-green-400 text-[10px] px-2 py-0.5 rounded-full font-medium uppercase">{k.status}</span>
              </div>
              <div className="font-mono text-xs text-slate-500">{k.id}</div>
              <div className="text-xs text-slate-500 mt-1">Created {k.created} · {k.tokens} tokens used</div>
            </div>
            <button onClick={() => copyToClipboard(k.id)} className="text-xs border border-slate-700 hover:border-slate-500 text-slate-300 px-3 py-1.5 rounded-lg transition-colors">
              {copied === k.id ? "Copied!" : "Copy"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
