import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-3">Simple, Transparent Pricing</h1>
        <p className="text-slate-400 max-w-xl mx-auto">Pay only for what you use. 1 credit equals 500,000 tokens.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        <div className="bg-[#1e293b] border border-slate-700/50 rounded-xl p-6 text-center">
          <div className="text-sm text-slate-400 mb-2">Starter</div>
          <div className="text-3xl font-bold text-white mb-2"></div>
          <div className="text-xs text-slate-500 mb-4">~5M tokens</div>
          <Link href="/auth/signup" className="block w-full bg-brand hover:bg-brand-dark text-white py-2 rounded-lg text-sm font-medium transition-colors">Get Started</Link>
        </div>
        <div className="bg-[#1e293b] border border-brand/50 ring-1 ring-brand/20 rounded-xl p-6 text-center">
          <div className="text-xs text-brand-light mb-2 font-semibold">MOST POPULAR</div>
          <div className="text-sm text-slate-400 mb-2">Builder</div>
          <div className="text-3xl font-bold text-white mb-2"></div>
          <div className="text-xs text-slate-500 mb-4">~25M tokens</div>
          <Link href="/auth/signup" className="block w-full bg-brand hover:bg-brand-dark text-white py-2 rounded-lg text-sm font-medium transition-colors">Get Started</Link>
        </div>
        <div className="bg-[#1e293b] border border-slate-700/50 rounded-xl p-6 text-center">
          <div className="text-sm text-slate-400 mb-2">Growth</div>
          <div className="text-3xl font-bold text-white mb-2"></div>
          <div className="text-xs text-slate-500 mb-4">~50M tokens</div>
          <Link href="/auth/signup" className="block w-full bg-brand hover:bg-brand-dark text-white py-2 rounded-lg text-sm font-medium transition-colors">Get Started</Link>
        </div>
        <div className="bg-[#1e293b] border border-slate-700/50 rounded-xl p-6 text-center">
          <div className="text-sm text-slate-400 mb-2">Scale</div>
          <div className="text-3xl font-bold text-white mb-2"></div>
          <div className="text-xs text-slate-500 mb-4">~250M tokens</div>
          <Link href="/auth/signup" className="block w-full bg-brand hover:bg-brand-dark text-white py-2 rounded-lg text-sm font-medium transition-colors">Get Started</Link>
        </div>
      </div>
      <div className="max-w-2xl mx-auto bg-[#1e293b] border border-slate-700/50 rounded-xl p-6">
        <h2 className="font-semibold mb-4">Model Pricing (per 1M tokens)</h2>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between py-2 border-b border-slate-800">
            <span className="text-slate-300">DeepSeek V4 Flash</span>
            <span className="text-slate-400 text-xs">Input .15 | Output .28</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-slate-800">
            <div><span className="text-slate-300">DeepSeek V4 Pro</span><span className="ml-2 text-[10px] bg-brand/20 text-brand-light px-1.5 py-0.5 rounded">Soon</span></div>
            <span className="text-slate-400 text-xs">Input .55 | Output .10</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-slate-800">
            <div><span className="text-slate-300">Qwen 3.6</span><span className="ml-2 text-[10px] bg-brand/20 text-brand-light px-1.5 py-0.5 rounded">Soon</span></div>
            <span className="text-slate-400 text-xs">Input .20 | Output .35</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <div><span className="text-slate-300">GLM 5.2</span><span className="ml-2 text-[10px] bg-brand/20 text-brand-light px-1.5 py-0.5 rounded">Soon</span></div>
            <span className="text-slate-400 text-xs">Input .18 | Output .30</span>
          </div>
        </div>
      </div>
    </div>
  );
}
