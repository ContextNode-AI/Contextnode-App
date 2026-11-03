"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { 
  Mail, 
  ArrowLeft, 
  CheckCircle2, 
  Send, 
  KeyRound,
  RotateCcw
} from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  // Timer countdown for resending instructions
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCountdown > 0) {
      timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setResendCountdown(60);
    }, 1000);
  };

  const handleResend = () => {
    if (resendCountdown > 0) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setResendCountdown(60);
    }, 800);
  };

  return (
    <AuthLayout
      title={submitted ? "Check your email" : "Reset your password"}
      subtitle={
        submitted
          ? `We sent password recovery instructions and a secure magic link to ${email}`
          : "Enter your registered email address and we will send you secure recovery instructions."
      }
      badge="Account Recovery"
    >
      {!submitted ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Registered email address
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

          <div className="p-3 rounded-xl bg-[#25343F]/30 border border-[#25343F] flex items-start gap-2.5 text-xs text-slate-300">
            <KeyRound className="w-4 h-4 text-[#FE7F2D] flex-shrink-0 mt-0.5" />
            <span>
              For security, recovery links automatically expire after 15 minutes.
            </span>
          </div>

          <button
            type="submit"
            disabled={loading || !email}
            className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#FE7F2D] hover:bg-[#FE7F2D]/90 text-slate-950 text-sm font-bold shadow-[0_0_24px_rgba(254,127,45,0.25)] transition-all active:scale-[0.99] disabled:opacity-60 cursor-pointer"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-slate-950/20 border-t-slate-950 rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Send Recovery Instructions</span>
              </>
            )}
          </button>
        </form>
      ) : (
        <div className="space-y-5 text-center">
          <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-7 h-7" />
          </div>

          <div className="p-3.5 rounded-xl bg-[#25343F]/40 border border-[#25343F] text-xs text-slate-300 text-left">
            <div className="font-semibold text-white mb-1">Didn&apos;t get the email?</div>
            <p className="text-slate-400 leading-relaxed">
              Check your spam or junk folder. If you still don&apos;t see it, request another link below.
            </p>
          </div>

          <div className="flex flex-col gap-2.5">
            <button
              type="button"
              onClick={handleResend}
              disabled={resendCountdown > 0 || loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#25343F] hover:bg-[#25343F]/80 border border-white/10 text-white text-xs font-semibold transition-all disabled:opacity-50"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#FE7F2D]" />
              <span>
                {resendCountdown > 0
                  ? `Resend available in ${resendCountdown}s`
                  : "Resend recovery email"}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
            >
              Use a different email address
            </button>
          </div>
        </div>
      )}

      {/* Back to Login Link */}
      <div className="mt-6 pt-5 border-t border-[#25343F]/60 text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#FE7F2D] hover:text-[#FE7F2D]/80 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to login</span>
        </Link>
      </div>
    </AuthLayout>
  );
}

