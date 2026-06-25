export default function DocsPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-8">API Documentation</h1>

      {/* Quick Start */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Quick Start</h2>
        <p className="text-slate-400 mb-4">InferNest is fully compatible with the OpenAI SDK. Change one line:</p>
        
        <div className="space-y-4">
          <div>
            <p className="text-xs text-slate-500 mb-2 font-medium">Python</p>
            <pre className="bg-[#1e293b] border border-slate-700 rounded-lg p-4 text-sm overflow-x-auto">
              <code className="text-slate-300">{`from openai import OpenAI

client = OpenAI(
    base_url="https://api.infernest.io/v1",
    api_key="sk-your-key-here"
)

response = client.chat.completions.create(
    model="deepseek-v4-flash",
    messages=[{"role": "user", "content": "Hello!"}]
)`}</code>
            </pre>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-2 font-medium">Node.js</p>
            <pre className="bg-[#1e293b] border border-slate-700 rounded-lg p-4 text-sm overflow-x-auto">
              <code className="text-slate-300">{`import OpenAI from "openai";

const client = new OpenAI({
    baseURL: "https://api.infernest.io/v1",
    apiKey: "sk-your-key-here"
});

const response = await client.chat.completions.create({
    model: "deepseek-v4-flash",
    messages: [{ role: "user", content: "Hello!" }]
});`}</code>
            </pre>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-2 font-medium">curl</p>
            <pre className="bg-[#1e293b] border border-slate-700 rounded-lg p-4 text-sm overflow-x-auto">
              <code className="text-slate-300">{`curl https://api.infernest.io/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer sk-your-key-here" \\
  -d '{"model":"deepseek-v4-flash","messages":[{"role":"user","content":"Hello!"}]}'`}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* Authentication */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Authentication</h2>
        <p className="text-slate-400 mb-2">Include your API key in the <code className="bg-[#1e293b] px-1.5 py-0.5 rounded text-sm text-brand-light">Authorization</code> header:</p>
        <pre className="bg-[#1e293b] border border-slate-700 rounded-lg p-4 text-sm">
          <code className="text-slate-300">Authorization: Bearer sk-your-key-here</code>
        </pre>
        <p className="text-slate-500 text-xs mt-3">Find your API key in the <a href="/dashboard" className="text-brand-light hover:underline">Dashboard</a>.</p>
      </section>

      {/* Endpoints */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Endpoints</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="text-left py-2 font-medium">Endpoint</th>
                <th className="text-left py-2 font-medium">Description</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-800/50"><td className="py-2 font-mono text-xs">POST /v1/chat/completions</td><td className="py-2">Chat completions</td></tr>
              <tr className="border-b border-slate-800/50"><td className="py-2 font-mono text-xs">POST /v1/embeddings</td><td className="py-2">Text embeddings</td></tr>
              <tr className="border-b border-slate-800/50"><td className="py-2 font-mono text-xs">GET /v1/models</td><td className="py-2">List available models</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Available Models */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Model IDs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {["deepseek-v4-flash", "qwen-3.6-27b", "glm-5.2", "doubao-pro-256k"].map((m) => (
            <code key={m} className="bg-[#1e293b] border border-slate-700 rounded px-3 py-2 text-sm text-slate-300">{m}</code>
          ))}
        </div>
      </section>

      {/* Rate Limits */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Rate Limits</h2>
        <p className="text-slate-400">Default limits per API key:</p>
        <ul className="mt-2 space-y-1 text-sm text-slate-300">
          <li>• 60 requests per minute</li>
          <li>• 100,000 tokens per minute</li>
        </ul>
        <p className="text-slate-500 text-xs mt-3">Need higher limits? Contact us after signing up.</p>
      </section>
    </div>
  );
}
