import Link from "next/link";

const packages = [
  { name: "Starter", price: 10, tokens: "5M", popular: false },
  { name: "Builder", price: 50, tokens: "25M", popular: true },
  { name: "Growth", price: 100, tokens: "50M", popular: false },
  { name: "Scale", price: 500, tokens: "250M", popular: false },
];

const modelPrices = [
  { name: "DeepSeek V4 Flash", input: "0.27", output: "1.10", status: "live" },
  { name: "DeepSeek V4 Pro", input: "0.55", output: "2.19", status: "soon" },
  { name: "Qwen 3.6 27B", input: "0.20", output: "0.40", status: "soon" },
  { name: "GLM 5.2", input: "0.14", output: "0.14", status: "soon" },
  { name: "Doubao Pro 256K", input: "0.10", output: "0.30", status: "soon" },
];

export default function PricingPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-3">Simple, Transparent Pricing</h1>
        <p className="text-slate-400 max-w-xl mx-auto">Pay only for what you use. No subscriptions. 1 credit = 500,000 tokens.</p>
      </div>

      {/* Prepaid packages */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
        {packages.map((pkg) => (
          <div key={pkg.name} className={`bg-[#1e293b] border rounded-xl p-6 text-center ${pkg.popular ? "border-brand/50 ring-1 ring-brand/20" : "border-slate-700/50"}`}>
            {pkg.popular && <div className="text-xs text-brand-light mb-2 font-semibold">MOST POPULAR</div>}
            <div className="text-sm text-slate-400 mb-2">{pkg.name}</div>
            <div className="text-3xl font-bold text-white mb-2">${pkg.price}</div>
            <div className="text-xs text-slate-500 mb-4">~{pkg.tokens} tokens</div>
            <Link href="/dashboard/billing" className="block w-full bg-brand hover:bg-brand-dark text-white py-2 rounded-lg text-sm font-medium transition-colors">
              Add Credits
            </Link>
          </div>
        ))}
      </div>

      {/* Model pricing table */}
      <div className="max-w-2xl mx-auto">
        <h2 className="font-semibold mb-4 text-center">Model Pricing (per 1M tokens)</h2>
        <div className="bg-[#1e293b] border border-slate-700/50 rounded-xl overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-3 px-5 py-3 bg-[#0f172a] border-b border-slate-700/50 text-xs text-slate-500 font-medium">
            <span>Model</span>
            <span className="text-right">Input</span>
            <span className="text-right">Output</span>
          </div>
          {/* Table body */}
          {modelPrices.map((m) => (
            <div key={m.name} className="grid grid-cols-3 px-5 py-3 border-b border-slate-800 last:border-b-0 text-sm items-center">
              <div className="flex items-center gap-2">
                <span className={m.status === "live" ? "text-slate-200" : "text-slate-500"}>{m.name}</span>
                {m.status === "soon" && (
                  <span className="text-[10px] bg-slate-700 text-slate-400 px-1.5 py-0.5 rounded-full">Soon</span>
                )}
                {m.status === "live" && (
                  <span className="text-[10px] bg-green-500/15 text-green-400 px-1.5 py-0.5 rounded-full">Live</span>
                )}
              </div>
              <span className="text-right font-mono text-slate-300">${m.input}</span>
              <span className="text-right font-mono text-slate-300">${m.output}</span>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-slate-600 mt-4">
          Compare to GPT-4o at $2.50/$10.00 per 1M tokens. Prices in USD.
        </p>
      </div>
    </div>
  );
}
