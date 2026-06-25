"use client";
import { useState } from "react";

const sections = [
  { id: "quickstart", title: "Quick Start" },
  { id: "auth", title: "Authentication" },
  { id: "chat", title: "Chat Completions" },
  { id: "models", title: "List Models" },
  { id: "pricing", title: "Pricing" },
  { id: "limits", title: "Rate Limits" },
  { id: "errors", title: "Errors" },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="text-xs text-slate-500 hover:text-white transition-colors"
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

function CodeBlock({ lang, code }: { lang: string; code: string }) {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between bg-[#0f172a] px-4 py-2 rounded-t-lg border border-b-0 border-slate-700">
        <span className="text-xs text-slate-500">{lang}</span>
        <CopyButton text={code} />
      </div>
      <pre className="bg-[#1e293b] border border-slate-700 rounded-b-lg p-4 text-sm overflow-x-auto">
        <code className="text-slate-300 text-xs leading-relaxed">{code}</code>
      </pre>
    </div>
  );
}

export default function DocsPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="flex gap-10">
        {/* Sidebar */}
        <nav className="hidden lg:block w-48 shrink-0">
          <div className="sticky top-20 space-y-1">
            <p className="text-xs text-slate-500 mb-3 font-medium uppercase tracking-wider">On this page</p>
            {sections.map((s) => (
              <a key={s.id} href={`#${s.id}`} className="block text-sm text-slate-400 hover:text-white transition-colors py-1">
                {s.title}
              </a>
            ))}
          </div>
        </nav>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <h1 className="text-3xl font-bold mb-2">API Documentation</h1>
          <p className="text-slate-400 mb-10">InferNest is fully compatible with the OpenAI SDK. Change one line, keep your code.</p>

          {/* Quick Start */}
          <section id="quickstart" className="mb-14">
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-slate-800">Quick Start</h2>
            <p className="text-slate-400 mb-4 text-sm">Replace <code className="bg-[#1e293b] px-1.5 py-0.5 rounded text-xs text-brand-light">base_url</code> with ours:</p>
            <CodeBlock lang="Python" code={`from openai import OpenAI

client = OpenAI(
    base_url="https://infernest.xyz/v1",
    api_key="YOUR_API_KEY"
)

response = client.chat.completions.create(
    model="deepseek-chat",
    messages=[{"role": "user", "content": "Hello!"}]
)
print(response.choices[0].message.content)`} />
            <CodeBlock lang="Node.js" code={`import OpenAI from "openai";

const client = new OpenAI({
    baseURL: "https://infernest.xyz/v1",
    apiKey: "YOUR_API_KEY"
});

const response = await client.chat.completions.create({
    model: "deepseek-chat",
    messages: [{ role: "user", content: "Hello!" }]
});
console.log(response.choices[0].message.content);`} />
            <CodeBlock lang="curl" code={`curl https://infernest.xyz/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{"model":"deepseek-chat","messages":[{"role":"user","content":"Hello!"}]}'`} />
          </section>

          {/* Auth */}
          <section id="auth" className="mb-14">
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-slate-800">Authentication</h2>
            <p className="text-slate-400 text-sm mb-3">All requests require an API key. Pass it in the Authorization header:</p>
            <div className="bg-[#1e293b] border border-slate-700 rounded-lg p-4 font-mono text-sm text-slate-300">
              Authorization: Bearer YOUR_API_KEY
            </div>
            <p className="text-slate-500 text-xs mt-3">
              Find your key in the <a href="/dashboard" className="text-brand-light hover:underline">Dashboard</a>. Keep it secret — treat it like a password.
            </p>
          </section>

          {/* Chat Completions */}
          <section id="chat" className="mb-14">
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-slate-800">Chat Completions</h2>
            <p className="text-slate-400 text-sm mb-1"><code className="bg-[#1e293b] px-1.5 py-0.5 rounded text-xs text-brand-light">POST /v1/chat/completions</code></p>
            <p className="text-slate-500 text-xs mb-4">OpenAI-compatible chat completions endpoint.</p>

            <p className="text-xs text-slate-500 mb-2 font-medium">Request Body</p>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-xs">
                    <th className="text-left py-2 font-medium">Field</th>
                    <th className="text-left py-2 font-medium">Type</th>
                    <th className="text-left py-2 font-medium">Description</th>
                  </tr>
                </thead>
                <tbody className="text-slate-300 text-xs">
                  <tr className="border-b border-slate-800/50"><td className="py-2 font-mono text-brand-light">model</td><td className="py-2">string</td><td className="py-2 text-slate-400">Model ID (e.g. deepseek-chat)</td></tr>
                  <tr className="border-b border-slate-800/50"><td className="py-2 font-mono text-brand-light">messages</td><td className="py-2">array</td><td className="py-2 text-slate-400">Array of message objects with role and content</td></tr>
                  <tr className="border-b border-slate-800/50"><td className="py-2 font-mono text-brand-light">max_tokens</td><td className="py-2">integer</td><td className="py-2 text-slate-400">Maximum tokens to generate (optional)</td></tr>
                  <tr className="border-b border-slate-800/50"><td className="py-2 font-mono text-brand-light">temperature</td><td className="py-2">number</td><td className="py-2 text-slate-400">Sampling temperature 0-2 (optional)</td></tr>
                  <tr><td className="py-2 font-mono text-brand-light">stream</td><td className="py-2">boolean</td><td className="py-2 text-slate-400">Enable streaming (optional)</td></tr>
                </tbody>
              </table>
            </div>

            <p className="text-xs text-slate-500 mb-2 font-medium">Example Response</p>
            <pre className="bg-[#1e293b] border border-slate-700 rounded-lg p-4 text-xs overflow-x-auto">
              <code className="text-slate-300">{`{
  "id": "chatcmpl-xxx",
  "object": "chat.completion",
  "model": "deepseek-v4-flash",
  "choices": [{
    "index": 0,
    "message": {
      "role": "assistant",
      "content": "Hello! How can I help you today?"
    },
    "finish_reason": "stop"
  }],
  "usage": {
    "prompt_tokens": 10,
    "completion_tokens": 8,
    "total_tokens": 18
  }
}`}</code>
            </pre>
          </section>

          {/* List Models */}
          <section id="models" className="mb-14">
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-slate-800">List Models</h2>
            <p className="text-slate-400 text-sm mb-1"><code className="bg-[#1e293b] px-1.5 py-0.5 rounded text-xs text-brand-light">GET /v1/models</code></p>
            <p className="text-slate-500 text-xs mb-4">Returns all available models and their capabilities.</p>
            <CodeBlock lang="curl" code={`curl https://infernest.xyz/v1/models \\
  -H "Authorization: Bearer YOUR_API_KEY"`} />
          </section>

          {/* Pricing */}
          <section id="pricing" className="mb-14">
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-slate-800">Pricing</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-xs">
                    <th className="text-left py-2 font-medium">Model</th>
                    <th className="text-right py-2 font-medium">Input /1M</th>
                    <th className="text-right py-2 font-medium">Output /1M</th>
                  </tr>
                </thead>
                <tbody className="text-slate-300 text-xs">
                  {[
                    ["DeepSeek V4 Flash", "$0.27", "$1.10", true],
                    ["Qwen 3.6 27B", "$0.20", "$0.40", false],
                    ["GLM 5.2", "$0.14", "$0.14", false],
                    ["Doubao Pro 256K", "$0.10", "$0.30", false],
                  ].map(([name, input, output, live]) => (
                    <tr key={name as string} className="border-b border-slate-800/50">
                      <td className="py-2">{name}{" "}{!live && <span className="text-[10px] bg-slate-700 text-slate-400 px-1.5 py-0.5 rounded-full">Soon</span>}</td>
                      <td className="py-2 text-right font-mono">{input as string}</td>
                      <td className="py-2 text-right font-mono">{output as string}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-slate-600 mt-3">vs GPT-4o at $2.50/$10.00 per 1M tokens</p>
          </section>

          {/* Rate Limits */}
          <section id="limits" className="mb-14">
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-slate-800">Rate Limits</h2>
            <ul className="space-y-1 text-sm text-slate-300">
              <li>• 60 requests per minute</li>
              <li>• 100,000 tokens per minute</li>
            </ul>
            <p className="text-slate-500 text-xs mt-3">Need higher limits? Contact support after signing up.</p>
          </section>

          {/* Errors */}
          <section id="errors" className="mb-14">
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-slate-800">Errors</h2>
            <p className="text-slate-400 text-sm mb-3">Standard HTTP status codes:</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-xs">
                    <th className="text-left py-2 font-medium">Code</th>
                    <th className="text-left py-2 font-medium">Meaning</th>
                  </tr>
                </thead>
                <tbody className="text-slate-300 text-xs">
                  <tr className="border-b border-slate-800/50"><td className="py-2 font-mono">400</td><td className="py-2 text-slate-400">Bad request — invalid parameters</td></tr>
                  <tr className="border-b border-slate-800/50"><td className="py-2 font-mono">401</td><td className="py-2 text-slate-400">Invalid or missing API key</td></tr>
                  <tr className="border-b border-slate-800/50"><td className="py-2 font-mono">429</td><td className="py-2 text-slate-400">Rate limit exceeded</td></tr>
                  <tr><td className="py-2 font-mono">500</td><td className="py-2 text-slate-400">Server error — try again or contact support</td></tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
