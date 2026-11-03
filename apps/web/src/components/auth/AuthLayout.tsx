"use client";

import Link from "next/link";
import { ArrowLeft, Sparkles, ShieldCheck } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  badge?: string;
}

export function AuthLayout({
  children,
  title,
  subtitle,
  badge = "ContextNode ID",
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full relative flex flex-col justify-between p-4 sm:p-6 md:p-8 overflow-x-hidden bg-[#05060A] text-white">
      {/* Background Decorative Gradients & Grid */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Ambient Top Glow */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#FE7F2D]/10 rounded-full blur-[140px]" />
        {/* Ambient Bottom Slate Glow */}
        <div className="absolute -bottom-40 right-1/4 w-[500px] h-[350px] bg-[#25343F]/50 rounded-full blur-[120px]" />

        {/* Subtle Tech Grid */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
            backgroundSize: `32px 32px`,
          }}
        />
      </div>

      {/* Top Header Bar */}
      <header className="relative z-10 w-full max-w-6xl mx-auto flex items-center justify-between py-2">
        <Link
          href="/"
          className="flex items-center gap-2.5 group transition-transform hover:scale-[1.02]"
        >
          <img
            src="/contextnode-logo.png"
            alt="ContextNode"
            className="w-8 h-8 object-contain"
          />
          <div className="flex flex-col">
            <span className="font-bold text-white text-base tracking-tight leading-none">
              ContextNode
            </span>
            <span className="text-[10px] text-slate-400 font-mono tracking-wider">
              AI PROMPT OS
            </span>
          </div>
        </Link>

        <Link
          href="/"
          className="flex items-center gap-2 text-xs font-medium text-slate-300 hover:text-white bg-[#25343F]/60 hover:bg-[#25343F] border border-[#25343F] px-3.5 py-1.5 rounded-full transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Workspace</span>
        </Link>
      </header>

      {/* Center Auth Card */}
      <main className="relative z-10 w-full max-w-md mx-auto my-8">
        <div className="relative rounded-2xl bg-[#090D14]/90 backdrop-blur-2xl border border-[#25343F] shadow-[0_20px_60px_rgba(0,0,0,0.85)] p-6 sm:p-8 overflow-hidden">
          {/* Top Edge Ambient Highlight */}
          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#FE7F2D] to-transparent opacity-80" />

          {/* Badge & Title */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase bg-[#FE7F2D]/10 text-[#FE7F2D] border border-[#FE7F2D]/25 mb-3.5">
              <Sparkles className="w-3 h-3" />
              <span>{badge}</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight sm:text-3xl">
              {title}
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
              {subtitle}
            </p>
          </div>

          {/* Form Content */}
          {children}
        </div>

        {/* Security Trust Indicator */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-[#FE7F2D]" />
          <span>Encrypted with 256-bit secure sessions</span>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 py-3 text-xs text-slate-400 border-t border-[#25343F]/50">
        <div>
          © {new Date().getFullYear()} ContextNode AI Platform. All rights reserved.
        </div>
        <div className="flex items-center gap-5">
          <Link href="/privacy" className="hover:text-slate-300 transition-colors">
            Privacy Policy
          </Link>
          <span className="text-slate-700">•</span>
          <Link href="/terms" className="hover:text-slate-300 transition-colors">
            Terms of Service
          </Link>
          <span className="text-slate-700">•</span>
          <Link href="/" className="hover:text-slate-300 transition-colors">
            Documentation
          </Link>
        </div>
      </footer>
    </div>
  );
}
