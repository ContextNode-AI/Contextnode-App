"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { api, ImagePrompt, AuthUser } from "@/lib/api";
import {
  ShieldCheck,
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
  Eye,
  Layers,
  ArrowRight,
  UserPlus,
  AlertCircle,
  ExternalLink,
  Search,
  XCircle,
} from "lucide-react";

export default function AdminDashboardPage() {
  const { user, isAuthenticated } = useAuth();

  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    totalCreators: 0,
    totalAdmins: 0,
    totalPrompts: 0,
    pendingPrompts: 0,
    publishedPrompts: 0,
    totalViews: 0,
  });

  const [recentPending, setRecentPending] = useState<ImagePrompt[]>([]);
  const [recentUsers, setRecentUsers] = useState<AuthUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Quick review action loading
  const [reviewingId, setReviewingId] = useState<string | null>(null);

  const fetchOverview = async () => {
    try {
      setLoading(true);
      const data = await api.admin.getOverview();
      setMetrics(data.metrics);
      setRecentPending(data.recentPending || []);
      setRecentUsers(data.recentUsers || []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load admin overview";
      setToast({ type: "error", text: msg });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user?.role === "ADMIN") {
      fetchOverview();
    }
  }, [isAuthenticated, user]);

  const handleQuickApprove = async (id: string) => {
    setReviewingId(id);
    try {
      await api.admin.reviewPrompt(id, "APPROVE", "Approved by Administrator");
      setToast({ type: "success", text: "Prompt approved and published live!" });
      setRecentPending((prev) => prev.filter((p) => p.id !== id));
      setMetrics((m) => ({
        ...m,
        pendingPrompts: Math.max(0, m.pendingPrompts - 1),
        publishedPrompts: m.publishedPrompts + 1,
      }));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to approve prompt";
      setToast({ type: "error", text: msg });
    } finally {
      setReviewingId(null);
    }
  };

  if (!isAuthenticated || user?.role !== "ADMIN") {
    return (
      <div className="min-h-screen bg-[#05060A] text-slate-100 flex items-center justify-center p-6">
        <div className="max-w-md w-full p-8 rounded-2xl bg-[#090D14] border border-[#25343F] text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-white">Administrator Access Required</h2>
          <p className="text-xs text-slate-400">
            This dashboard is restricted to verified ContextNode administrators and staff members.
          </p>
          <Link
            href="/login"
            className="inline-block px-4 py-2 rounded-xl bg-[#FE7F2D] text-slate-950 font-bold text-xs"
          >
            Sign In with Admin Account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05060A] text-slate-100 pt-8 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400">
                <ShieldCheck className="w-4 h-4" />
              </span>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-400">
                ContextNode Admin OS
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Platform Administration
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Platform governance, creator asset review queue, and staff user management.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <Link
              href="/admin/users"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#25343F]/60 hover:bg-[#25343F] border border-[#25343F] text-slate-200 text-xs font-semibold transition-all cursor-pointer"
            >
              <Users className="w-3.5 h-3.5 text-[#FE7F2D]" />
              <span>User Management</span>
            </Link>

            <Link
              href="/admin/reviews"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FE7F2D] hover:bg-[#FE7F2D]/90 text-slate-950 text-xs font-bold shadow-[0_0_20px_rgba(254,127,45,0.25)] transition-all cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Review Queue ({metrics.pendingPrompts})</span>
            </Link>
          </div>
        </div>

        {/* Toast */}
        {toast && (
          <div
            className={`mb-6 p-4 rounded-xl text-xs flex items-center gap-3 animate-in fade-in ${
              toast.type === "success"
                ? "bg-emerald-950/50 border border-emerald-500/40 text-emerald-300"
                : "bg-rose-950/50 border border-rose-500/40 text-rose-300"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            )}
            <span>{toast.text}</span>
          </div>
        )}

        {/* 1. Platform Governance Policy Banner */}
        <div className="mb-8 p-4 rounded-2xl bg-[#090D14] border border-purple-500/30 flex items-start gap-3.5">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 flex-shrink-0 mt-0.5">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Admin Role Boundary & Review Policy
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              As an Administrator, you oversee platform integrity. Administrators do not create public prompt assets; creators create and submit assets. Your responsibilities include verifying pending creator submissions, approving quality content, enforcing safe parameters, and managing user accounts and staff access.
            </p>
          </div>
        </div>

        {/* 2. Key Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Pending Reviews */}
          <div className="p-5 rounded-2xl bg-[#090D14] border border-amber-500/30 relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Pending Reviews
              </span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-3xl font-extrabold text-amber-400 font-mono">
              {metrics.pendingPrompts}
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Awaiting admin approval
            </p>
            {metrics.pendingPrompts > 0 && (
              <Link
                href="/admin/reviews"
                className="mt-3 inline-flex items-center gap-1 text-[11px] text-amber-300 hover:underline font-semibold"
              >
                <span>Process reviews →</span>
              </Link>
            )}
          </div>

          {/* Published Assets */}
          <div className="p-5 rounded-2xl bg-[#090D14] border border-[#25343F]">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Published Assets
              </span>
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-extrabold text-white font-mono">
              {metrics.publishedPrompts}
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Live in public explore library
            </p>
          </div>

          {/* Creators Count */}
          <div className="p-5 rounded-2xl bg-[#090D14] border border-[#25343F]">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Active Creators
              </span>
              <Users className="w-4 h-4 text-[#FE7F2D]" />
            </div>
            <div className="text-3xl font-extrabold text-white font-mono">
              {metrics.totalCreators}
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Author accounts onboarded
            </p>
          </div>

          {/* Total Users */}
          <div className="p-5 rounded-2xl bg-[#090D14] border border-[#25343F]">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Total Accounts
              </span>
              <ShieldCheck className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-3xl font-extrabold text-white font-mono">
              {metrics.totalUsers}
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              {metrics.totalAdmins} Staff Admins / {metrics.totalUsers - metrics.totalAdmins} Users
            </p>
          </div>
        </div>

        {/* 3. Two-Column Layout: Pending Approvals & Recent Users */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT 2 COLS: Pending Approval Queue */}
          <div className="lg:col-span-2 p-5 rounded-2xl bg-[#090D14] border border-[#25343F] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#25343F]">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Recent Pending Submissions
                  </h3>
                </div>
                <Link
                  href="/admin/reviews"
                  className="text-xs text-[#FE7F2D] hover:underline font-semibold flex items-center gap-1"
                >
                  <span>View All Queue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {loading ? (
                <div className="p-12 text-center text-xs text-slate-400">
                  Loading submissions...
                </div>
              ) : recentPending.length === 0 ? (
                <div className="p-12 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto opacity-80" />
                  <p className="text-xs font-bold text-white">Queue Empty</p>
                  <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                    All submitted creator prompts have been moderated. New submissions will appear here automatically.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentPending.map((p) => (
                    <div
                      key={p.id}
                      className="p-3.5 rounded-xl bg-[#05060A] border border-[#25343F] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#25343F] text-slate-300">
                            {p.category}
                          </span>
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-950/60 text-amber-400 border border-amber-500/30 font-semibold">
                            Pending Review
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-white truncate">
                          {p.title}
                        </h4>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                          By: <strong className="text-slate-300">{p.author?.name || "Creator"}</strong> ({p.author?.email})
                        </p>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Link
                          href="/admin/reviews"
                          className="px-2.5 py-1.5 rounded-lg bg-[#25343F]/60 hover:bg-[#25343F] text-slate-300 text-xs font-semibold"
                        >
                          Inspect
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleQuickApprove(p.id)}
                          disabled={reviewingId === p.id}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
                        >
                          {reviewingId === p.id ? "Approving..." : "Approve"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT 1 COL: Staff & User Management Quick Box */}
          <div className="p-5 rounded-2xl bg-[#090D14] border border-[#25343F] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#25343F]">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#FE7F2D]" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Recent Accounts
                  </h3>
                </div>
                <Link
                  href="/admin/users"
                  className="text-xs text-[#FE7F2D] hover:underline font-semibold"
                >
                  Manage All
                </Link>
              </div>

              <div className="space-y-2.5">
                {recentUsers.map((u) => (
                  <div
                    key={u.id}
                    className="p-2.5 rounded-xl bg-[#05060A] border border-[#25343F] flex items-center justify-between text-xs"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="font-semibold text-white truncate">
                        {u.name}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono truncate">
                        {u.email}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded font-mono ${
                          u.role === "ADMIN"
                            ? "bg-purple-950 text-purple-300 border border-purple-500/30"
                            : "bg-[#25343F] text-slate-300"
                        }`}
                      >
                        {u.role}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-[#25343F]">
              <Link
                href="/admin/users"
                className="w-full py-2 px-3 rounded-xl bg-[#25343F]/80 hover:bg-[#25343F] border border-[#25343F] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
              >
                <UserPlus className="w-3.5 h-3.5 text-[#FE7F2D]" />
                <span>+ Create Staff / Admin Account</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
