"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { SocialButtons } from "@/components/auth/SocialButtons";
import { useAuth } from "@/context/AuthContext";
import { API_BASE_URL } from "@/lib/api";
import { Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login: loginUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!email.trim() || !password) {
      setMessage({ type: "error", text: "Please enter both your email address and password." });
      return;
    }

    setLoading(true);

    try {
      const loggedInUser = await loginUser({
        email: email.trim().toLowerCase(),
        password,
      });

      setMessage({
        type: "success",
        text: `Welcome back, ${loggedInUser.name}! Signed in as ${loggedInUser.role}. Redirecting to workspace...`,
      });

      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : "Invalid email or password. Please try again.";
      setMessage({
        type: "error",
        text: errorMsg,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      badge="Sign In"
    >
      {/* Social Login Button (Google) */}
      <SocialButtons
        actionLabel="Continue with"
        dividerText="Or sign in with email"
        onSocialClick={() => {
          setMessage({
            type: "success",
            text: "Redirecting to Google Sign-In...",
          });
          window.location.href = `${API_BASE_URL}/auth/google`;
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
