"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function KeysPage() {
  const [data, setData] = useState<any>(null);
  const [keyVisible, setKeyVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/me").then(r => r.json()).then(setData).catch(() => {});
  }, []);

  const apiKey = data?.apiKey || "Loading...";

  const copyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-6">API Keys</h1>
      <div className="bg-[#1e293b] border border-slate-700/50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm font-medium text-white">Default Key</div>
            <div className="text-xs text-slate-400 mt-1">Created at signup</div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setKeyVisible(!keyVisible)} className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 px-3 py-1.5 rounded-md transition-colors">
              {keyVisible ? "Hide" : "Show"}
            </button>
            <button onClick={copyKey} className="text-xs bg-brand hover:bg-brand-dark text-white px-3 py-1.5 rounded-md transition-colors">
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
        <code className="text-sm font-mono text-brand-light block bg-[#0f172a] rounded-lg p-4 break-all">
          {keyVisible ? apiKey : apiKey.slice(0, 12) + "••••••••••••••••••••"}
        </code>
        <div className="mt-4 text-xs text-slate-500">
          Use this key with any OpenAI-compatible client. Set <code className="text-slate-400">base_url</code> to{" "}
          <code className="text-slate-400">https://infernest.xyz/v1</code>
        </div>
      </div>
      <p className="text-center text-sm text-slate-500 mt-8">
        Back to <Link href="/dashboard" className="text-brand-light hover:underline">Dashboard</Link>
      </p>
    </div>
  );
}
