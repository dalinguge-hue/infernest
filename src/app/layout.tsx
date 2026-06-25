import type { Metadata } from "next";
import "./globals.css";
import NavBar from "@/components/NavBar";

export const metadata: Metadata = {
  title: "InferNest — Stable & Affordable LLM Inference",
  description: "Access DeepSeek, Qwen, GLM, Doubao and more Chinese frontier models at a fraction of OpenAI pricing. One API key, all models.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans bg-[#0f172a] text-slate-100 min-h-screen antialiased">
        <NavBar />
        <main>{children}</main>
      </body>
    </html>
  );
}
