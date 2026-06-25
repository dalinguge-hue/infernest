import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "InferNest — Stable & Affordable LLM Inference",
  description: "Access DeepSeek, Qwen, GLM, Doubao and more Chinese frontier models at a fraction of OpenAI pricing. One API key, all models.",
};

const navLinks = [
  { href: "/models", label: "Models" },
  { href: "/docs", label: "Docs" },
  { href: "/dashboard", label: "Dashboard" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#0f172a] text-slate-100 min-h-screen antialiased`}>
        <nav className="border-b border-slate-800 bg-[#0f172a]/80 backdrop-blur sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
            <Link href="/" className="font-bold text-lg tracking-tight">
              <span className="text-white">Infer</span><span className="text-brand">Nest</span>
            </Link>
            <div className="flex items-center gap-6 text-sm text-slate-400">
              {navLinks.map(l => (
                <Link key={l.href} href={l.href} className="hover:text-white transition-colors">{l.label}</Link>
              ))}
              <Link href="/auth/login" className="text-brand-light hover:text-white transition-colors">Sign In</Link>
              <Link href="/auth/signup" className="bg-brand hover:bg-brand-dark text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors">
                Get Started
              </Link>
            </div>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
