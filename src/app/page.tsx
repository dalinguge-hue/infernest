"use client";
import Link from "next/link";
import { useState } from "react";

const models = [
  { name: "DeepSeek V4 Flash", input: 0.27, output: 1.10, context: "128K", speed: "~80 t/s", available: true },
  { name: "Qwen 3.6 27B", input: 0.20, output: 0.40, context: "128K", speed: "~120 t/s", available: false },
  { name: "GLM 5.2", input: 0.14, output: 0.14, context: "128K", speed: "~90 t/s", available: false },
  { name: "Doubao Pro 256K", input: 0.10, output: 0.30, context: "256K", speed: "~100 t/s", available: false },
];

const comparison = [
  { label: "GPT-4o", input: 2.50, output: 10.00 },
  { label: "Claude 3.5 Sonnet", input: 3.00, output: 15.00 },
  { label: "InferNest Avg", input: 0.18, output: 0.49, highlight: true },
];

const faq = [
  { q: "Where are the models hosted?", a: "Our inference runs on servers in Hong Kong and Singapore, optimized for low-latency access to Chinese frontier models." },
  { q: "Is this OpenAI API compatible?", a: "Yes. Change base_url to https://infernest.xyz/v1 and your existing OpenAI SDK code works unchanged." },
  { q: "What about data privacy?", a: "We do not store prompts or completions. Logs are retained for 7 days for billing only, then purged." },
  { q: "How reliable is this?", a: "We run multiple redundant upstream channels per model with automatic failover. Our uptime target is 99.5%+." },
];

const codeExamples = {
  python: `from openai import OpenAI

client = OpenAI(
    base_url="https://infernest.xyz/v1",
    api_key="YOUR_API_KEY"
)

response = client.chat.completions.create(
    model="deepseek-chat",
    messages=[{"role": "user", "content": "Hello!"}]
)
print(response.choices[0].message.content)`,
  node: `import OpenAI from "openai";

const client = new OpenAI({
    baseURL: "https://infernest.xyz/v1",
    apiKey: "YOUR_API_KEY"
});

const response = await client.chat.completions.create({
    model: "deepseek-chat",
    messages: [{ role: "user", content: "Hello!" }]
});
console.log(response.choices[0].message.content);`,
  curl: `curl https://infernest.xyz/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{"model":"deepseek-chat","messages":[{"role":"user","content":"Hello!"}]}'`
};

export default function HomePage() {
  const [codeLang, setCodeLang] = useState<"python" | "node" | "curl">("python");
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(codeExamples[codeLang]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-24 pb-16 text-center">
        <h1 className="text-5xl font-bold tracking-tight mb-4">
          Stable Inference,<br /><span className="text-brand">Fraction of the Cost</span>
        </h1>
        <p className="text-lg text-slate-400 max-w-xl mx-auto mb-8">
          Access DeepSeek, Qwen, GLM, and Doubao through one API key. OpenAI-compatible. Up to 90% cheaper than GPT-4o.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/auth/signup" className="bg-brand hover:bg-brand-dark text-white px-8 py-3 rounded-lg font-semibold transition-colors">
            Start Free — Get API Key
          </Link>
          <Link href="/models" className="border border-slate-700 hover:border-slate-500 text-slate-300 px-8 py-3 rounded-lg font-semibold transition-colors">
            View Models
          </Link>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mt-12">
          {[
            { value: "1", label: "Models Live", sub: "3 more coming" },
            { value: "99.5%", label: "Uptime", sub: "30-day average" },
            { value: "< 500ms", label: "Latency", sub: "p50 response time" },
          ].map((stat) => (
            <div key={stat.label} className="bg-[#1e293b]/50 border border-slate-700/30 rounded-xl p-4">
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-slate-400 mt-0.5">{stat.label}</div>
              <div className="text-[10px] text-slate-600 mt-1">{stat.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Code Quick Start */}
      <section className="max-w-3xl mx-auto px-6 pb-20">
        <h2 className="text-2xl font-bold text-center mb-6">Start in 3 lines</h2>
        <div className="bg-[#1e293b] border border-slate-700/50 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-[#0f172a] border-b border-slate-700/50">
            <div className="flex gap-1">
              {(["python", "node", "curl"] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setCodeLang(lang)}
                  className={`px-3 py-1 text-xs rounded-md transition-colors ${
                    codeLang === lang ? "bg-brand/20 text-brand-light" : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  {lang === "python" ? "Python" : lang === "node" ? "Node.js" : "cURL"}
                </button>
              ))}
            </div>
            <button onClick={copyCode} className="text-xs text-slate-500 hover:text-white transition-colors">
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <pre className="p-5 text-sm overflow-x-auto">
            <code className="text-slate-300 font-mono text-xs leading-relaxed">{codeExamples[codeLang]}</code>
          </pre>
        </div>
        <p className="text-center text-xs text-slate-600 mt-3">
          Replace YOUR_API_KEY with the key from your dashboard after signing up.
        </p>
      </section>

      {/* Price Comparison */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <h2 className="text-2xl font-bold text-center mb-2">Price Comparison</h2>
        <p className="text-slate-500 text-sm text-center mb-8">per 1M tokens</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="text-left py-3 font-medium">Provider</th>
                <th className="text-right py-3 font-medium">Input</th>
                <th className="text-right py-3 font-medium">Output</th>
              </tr>
            </thead>
            <tbody>
              {comparison.map((c, i) => (
                <tr key={i} className={`border-b border-slate-800/50 ${c.highlight ? "bg-brand/5" : ""}`}>
                  <td className={`py-3 ${c.highlight ? "text-brand-light font-semibold" : ""}`}>{c.label}</td>
                  <td className="text-right py-3 font-mono">${c.input.toFixed(2)}</td>
                  <td className="text-right py-3 font-mono">${c.output.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-center text-slate-500 text-xs mt-3">
          InferNest average based on DeepSeek V4 Flash, Qwen 3.6, GLM 5.2, Doubao Pro.
        </p>
      </section>

      {/* Models Grid */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Available Models</h2>
          <Link href="/models" className="text-sm text-brand-light hover:underline">View all &rarr;</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {models.map((m) => (
            <div key={m.name} className={`bg-[#1e293b] border rounded-lg p-5 transition-colors relative ${m.available ? "border-slate-700/50 hover:border-slate-600" : "border-slate-700/20 opacity-60"}`}>
              {!m.available && (
                <span className="absolute top-3 right-3 bg-slate-700 text-slate-400 text-[10px] font-medium px-2 py-0.5 rounded-full">Soon</span>
              )}
              <h3 className="font-semibold text-white mb-3">{m.name}</h3>
              <div className="space-y-1.5 text-sm text-slate-400">
                <div className="flex justify-between"><span>Input</span><span className="font-mono text-slate-300">${m.input}/1M</span></div>
                <div className="flex justify-between"><span>Output</span><span className="font-mono text-slate-300">${m.output}/1M</span></div>
                <div className="flex justify-between"><span>Context</span><span className="text-slate-300">{m.context}</span></div>
                <div className="flex justify-between"><span>Speed</span><span className="text-slate-300">{m.speed}</span></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <h2 className="text-2xl font-bold text-center mb-10">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { step: "1", title: "Sign Up", desc: "Create an account and get your API key instantly. Free credit to start." },
            { step: "2", title: "Pick a Model", desc: "Choose from DeepSeek, Qwen, GLM, Doubao — all via the same endpoint." },
            { step: "3", title: "Call the API", desc: "Drop our base_url into your OpenAI SDK. Your existing code works unchanged." },
          ].map((s) => (
            <div key={s.step} className="text-center p-6">
              <div className="w-10 h-10 bg-brand/20 text-brand-light rounded-full flex items-center justify-center font-bold mx-auto mb-4">{s.step}</div>
              <h3 className="font-semibold mb-2">{s.title}</h3>
              <p className="text-sm text-slate-400">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-6 pb-24">
        <h2 className="text-2xl font-bold text-center mb-8">FAQ</h2>
        <div className="space-y-4">
          {faq.map((item, i) => (
            <details key={i} className="bg-[#1e293b] border border-slate-700/50 rounded-lg p-5 group cursor-pointer">
              <summary className="font-medium list-none text-slate-200">{item.q}</summary>
              <p className="mt-3 text-sm text-slate-400 leading-relaxed">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="border-t border-slate-800 py-12 text-center">
        <h2 className="text-xl font-bold mb-3">Ready to cut your LLM costs?</h2>
        <p className="text-slate-400 mb-6 text-sm">Start building with the same models at 90% less.</p>
        <Link href="/auth/signup" className="bg-brand hover:bg-brand-dark text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-block">
          Get Started Free
        </Link>
        <p className="text-xs text-slate-600 mt-8">&copy; 2026 InferNest. Built for developers who care about cost.</p>
      </section>
    </div>
  );
}
