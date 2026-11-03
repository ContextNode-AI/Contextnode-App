"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { SocialButtons } from "@/components/auth/SocialButtons";
import { Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!email || !password) {
      setMessage({ type: "error", text: "Please enter both your email address and password." });
      return;
    }

    setLoading(true);

    // Simulated client-side submission (UI only)
    setTimeout(() => {
      setLoading(false);
      setMessage({
        type: "success",
        text: `Welcome back! Authentication verified for ${email}.`,
      });
    }, 1000);
  };

  const fillDemoCredentials = (role: "admin" | "creator") => {
    if (role === "admin") {
      setEmail("427rohitkumar@gmail.com");
      setPassword("427rohit@");
    } else {
      setEmail("creator@contextnode.ai");
      setPassword("CreatorPass2026!");
    }
    setMessage(null);
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to manage your AI prompt assets, context packs, and workflows."
      badge="Sign In"
    >
      {/* Demo Credentials Quick-Fill Badges */}
      <div className="mb-5 p-2.5 rounded-xl bg-[#25343F]/30 border border-[#25343F] flex flex-col gap-1.5">
        <div className="text-[11px] font-medium text-slate-300 flex items-center justify-between">
          <span>Quick Demo Fill:</span>
          <span className="text-[10px] text-[#FE7F2D] font-mono">Development mode</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fillDemoCredentials("admin")}
            className="flex-1 text-[11px] font-semibold py-1 px-2.5 rounded-lg bg-[#25343F]/80 hover:bg-[#25343F] text-slate-200 hover:text-white transition-colors border border-white/5"
          >
            Admin Account
          </button>
          <button
            type="button"
            onClick={() => fillDemoCredentials("creator")}
            className="flex-1 text-[11px] font-semibold py-1 px-2.5 rounded-lg bg-[#25343F]/80 hover:bg-[#25343F] text-slate-200 hover:text-white transition-colors border border-white/5"
          >
            Creator Account
          </button>
        </div>
      </div>

      {/* Social Login Buttons (Google & GitHub) */}
      <SocialButtons
        actionLabel="Continue with"
        dividerText="Or sign in with email"
        onSocialClick={(provider) => {
          setMessage({
            type: "success",
            text: `Connecting with ${provider === "google" ? "Google" : "GitHub"} OAuth...`,
          });
        }}
      />

      {/* Status Notifications */}
      {message && (
        <div
          className={`mt-4 p-3 rounded-xl flex items-start gap-2.5 text-xs ${
            message.type === "success"
              ? "bg-emerald-950/40 border border-emerald-500/30 text-emerald-300"
              : "bg-rose-950/40 border border-rose-500/30 text-rose-300"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Direct Email / Password Form */}
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        {/* Email Field */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Email address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="developer@contextnode.io"
              className="w-full pl-10 pr-4 py-2.5 bg-[#05060A] border border-[#25343F] rounded-xl text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-[#FE7F2D] transition-colors"
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-medium text-slate-300">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs text-[#FE7F2D] hover:text-[#FE7F2D]/80 font-medium transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full pl-10 pr-10 py-2.5 bg-[#05060A] border border-[#25343F] rounded-xl text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-[#FE7F2D] transition-colors font-mono"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Remember Me Checkbox */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded bg-[#05060A] border-[#25343F] text-[#FE7F2D] focus:ring-0 focus:ring-offset-0 cursor-pointer accent-[#FE7F2D]"
            />
            <span className="text-xs text-slate-300">Remember this device for 30 days</span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#FE7F2D] hover:bg-[#FE7F2D]/90 text-slate-950 text-sm font-bold shadow-[0_0_24px_rgba(254,127,45,0.25)] transition-all active:scale-[0.99] disabled:opacity-60 cursor-pointer"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-slate-950/20 border-t-slate-950 rounded-full animate-spin" />
          ) : (
            <>
              <span>Sign in to Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Switch to Signup */}
      <div className="mt-6 pt-5 border-t border-[#25343F]/60 text-center text-xs text-slate-400">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="font-semibold text-[#FE7F2D] hover:text-[#FE7F2D]/80 ml-1 transition-colors"
        >
          Create account for free →
        </Link>
      </div>
    </AuthLayout>
  );
}
