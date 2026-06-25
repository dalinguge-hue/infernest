import Link from "next/link";

const allModels = [
  { name: "DeepSeek V4 Flash", provider: "DeepSeek", input: 0.27, output: 1.10, context: "128K", benchmark: "87.2", speed: "80 t/s", discount: 89 },
  { name: "Qwen 3.6 27B", provider: "Alibaba", input: 0.20, output: 0.40, context: "128K", benchmark: "85.0", speed: "120 t/s", discount: 92 },
  { name: "GLM 5.2", provider: "Zhipu", input: 0.14, output: 0.14, context: "128K", benchmark: "80.1", speed: "90 t/s", discount: 94 },
  { name: "Doubao Pro 256K", provider: "ByteDance", input: 0.10, output: 0.30, context: "256K", benchmark: "82.5", speed: "100 t/s", discount: 96 },
];

export default function ModelsPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-2">Models</h1>
      <p className="text-slate-400 mb-10">All models accessible through one API key. OpenAI-compatible endpoint.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {allModels.map((m) => (
          <div key={m.name} className="bg-[#1e293b] border border-slate-700/50 rounded-xl p-6 hover:border-slate-600 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-lg text-white">{m.name}</h3>
                <p className="text-xs text-slate-500">{m.provider}</p>
              </div>
              <span className="bg-green-500/10 text-green-400 text-xs font-medium px-2.5 py-1 rounded-full">
                {m.discount}% cheaper
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm mb-4">
              <div className="bg-[#0f172a] rounded-lg p-3">
                <div className="text-slate-500 text-xs mb-0.5">Input</div>
                <div className="font-mono text-white">${m.input}<span className="text-slate-500 text-xs">/1M tokens</span></div>
              </div>
              <div className="bg-[#0f172a] rounded-lg p-3">
                <div className="text-slate-500 text-xs mb-0.5">Output</div>
                <div className="font-mono text-white">${m.output}<span className="text-slate-500 text-xs">/1M tokens</span></div>
              </div>
              <div className="bg-[#0f172a] rounded-lg p-3">
                <div className="text-slate-500 text-xs mb-0.5">Context</div>
                <div className="font-mono text-white">{m.context}</div>
              </div>
              <div className="bg-[#0f172a] rounded-lg p-3">
                <div className="text-slate-500 text-xs mb-0.5">Speed</div>
                <div className="font-mono text-white">{m.speed}</div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-700/50 pt-3">
              <span>MMLU-Pro: {m.benchmark}</span>
              <span>vs GPT-4o $2.50/$10.00</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link href="/auth/signup" className="bg-brand hover:bg-brand-dark text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-block">
          Get API Access
        </Link>
      </div>
    </div>
  );
}
