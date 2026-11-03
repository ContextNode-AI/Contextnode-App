"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { SocialButtons } from "@/components/auth/SocialButtons";
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Code2,
  Sparkles,
  Check
} from "lucide-react";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"USER" | "CREATOR">("USER");
  const [showPassword, setShowPassword] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Dynamic Password Strength Meter Calculation
  const getPasswordStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (pwd.length === 0) return { score: 0, label: "", color: "bg-transparent" };
    if (score <= 1) return { score: 1, label: "Weak", color: "bg-rose-500", width: "w-1/4" };
    if (score === 2) return { score: 2, label: "Fair", color: "bg-amber-500", width: "w-2/4" };
    if (score === 3) return { score: 3, label: "Good", color: "bg-blue-400", width: "w-3/4" };
    return { score: 4, label: "Strong", color: "bg-emerald-500", width: "w-full" };
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!name.trim()) {
      setMessage({ type: "error", text: "Please enter your full name." });
      return;
    }

    if (!email.trim() || !email.includes("@")) {
      setMessage({ type: "error", text: "Please provide a valid email address." });
      return;
    }

    if (password.length < 8) {
      setMessage({ type: "error", text: "Password must be at least 8 characters long." });
      return;
    }

    if (!agreedTerms) {
      setMessage({ type: "error", text: "Please agree to the Terms of Service to continue." });
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setMessage({
        type: "success",
        text: `Account created for ${name}! Verification link dispatched to ${email}.`,
      });
    }, 1200);
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join thousands of engineers building and sharing production AI prompt systems."
      badge="Join Platform"
    >
      {/* Account Type Selector Tabs */}
      <div className="mb-5 p-1 rounded-xl bg-[#25343F]/40 border border-[#25343F] grid grid-cols-2 gap-1">
        <button
          type="button"
          onClick={() => setRole("USER")}
          className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
            role === "USER"
              ? "bg-[#FE7F2D] text-slate-950 shadow-md"
              : "text-slate-300 hover:text-white"
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>AI Developer</span>
        </button>

        <button
          type="button"
          onClick={() => setRole("CREATOR")}
          className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
            role === "CREATOR"
              ? "bg-[#FE7F2D] text-slate-950 shadow-md"
              : "text-slate-300 hover:text-white"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Prompt Creator</span>
        </button>
      </div>

      {/* Social Registration */}
      <SocialButtons
        actionLabel="Sign up with"
        dividerText="Or register with email"
        onSocialClick={(provider) => {
          setMessage({
            type: "success",
            text: `Registering via ${provider === "google" ? "Google" : "GitHub"} identity...`,
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

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Full name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Doe"
              className="w-full pl-10 pr-4 py-2.5 bg-[#05060A] border border-[#25343F] rounded-xl text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-[#FE7F2D] transition-colors"
            />
          </div>
        </div>

        {/* Work Email */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Work email
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
              placeholder="jane@organization.com"
              className="w-full pl-10 pr-4 py-2.5 bg-[#05060A] border border-[#25343F] rounded-xl text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-[#FE7F2D] transition-colors"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 8 characters"
              className="w-full pl-10 pr-10 py-2.5 bg-[#05060A] border border-[#25343F] rounded-xl text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-[#FE7F2D] transition-colors font-mono"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Password Strength Indicator */}
          {password.length > 0 && (
            <div className="mt-2 space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Security strength:</span>
                <span className={`font-semibold ${strength.score >= 3 ? "text-emerald-400" : "text-amber-400"}`}>
                  {strength.label}
                </span>
              </div>
              <div className="h-1.5 w-full bg-[#25343F] rounded-full overflow-hidden">
                <div className={`h-full ${strength.color} ${strength.width} transition-all duration-300`} />
              </div>
            </div>
          )}
        </div>

        {/* Terms Agreement Checkbox */}
        <div className="pt-1">
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreedTerms}
              onChange={(e) => setAgreedTerms(e.target.checked)}
              className="w-4 h-4 mt-0.5 rounded bg-[#05060A] border-[#25343F] text-[#FE7F2D] focus:ring-0 focus:ring-offset-0 cursor-pointer accent-[#FE7F2D]"
            />
            <span className="text-xs text-slate-300 leading-snug">
              I agree to the ContextNode{" "}
              <Link href="/terms" className="text-[#FE7F2D] hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-[#FE7F2D] hover:underline">
                Privacy Policy
              </Link>
              .
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#FE7F2D] hover:bg-[#FE7F2D]/90 text-slate-950 text-sm font-bold shadow-[0_0_24px_rgba(254,127,45,0.25)] transition-all active:scale-[0.99] disabled:opacity-60 cursor-pointer"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-slate-950/20 border-t-slate-950 rounded-full animate-spin" />
          ) : (
            <>
              <span>Create Free Account</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Switch to Login */}
      <div className="mt-6 pt-5 border-t border-[#25343F]/60 text-center text-xs text-slate-400">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-[#FE7F2D] hover:text-[#FE7F2D]/80 ml-1 transition-colors"
        >
          Sign in here →
        </Link>
      </div>
    </AuthLayout>
  );
}
