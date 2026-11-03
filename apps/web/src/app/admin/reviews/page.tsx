"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { api, ImagePrompt } from "@/lib/api";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  ArrowLeft,
  Sparkles,
  ExternalLink,
  MessageSquare,
  Image as ImageIcon,
  Sliders,
  User as UserIcon,
} from "lucide-react";

export default function AdminReviewsPage() {
  const { user, isAuthenticated } = useAuth();
  const [pendingPrompts, setPendingPrompts] = useState<ImagePrompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [feedbackInput, setFeedbackInput] = useState<{ [id: string]: string }>({});
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const loadPending = async () => {
    try {
      setLoading(true);
      const data = await api.admin.getPendingPrompts();
      setPendingPrompts(data || []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load pending reviews";
      setToast({ type: "error", text: msg });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadPending();
    }
  }, [isAuthenticated]);

  const handleReview = async (id: string, action: "APPROVE" | "REJECT") => {
    setActionLoading(id);
    setToast(null);

    const feedback = feedbackInput[id]?.trim() || undefined;

    try {
      await api.admin.reviewPrompt(id, action, feedback);
      setToast({
        type: "success",
        text: action === "APPROVE" 
          ? "Prompt approved and published successfully to the public library!" 
          : "Prompt rejected with feedback sent back to the creator.",
      });
      // Remove from pending list
      setPendingPrompts((prev) => prev.filter((p) => p.id !== id));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Moderation action failed";
      setToast({ type: "error", text: msg });
    } finally {
      setActionLoading(null);
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
            You must be logged in with an authorized Administrator account to moderate creator asset submissions.
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
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <Link
              href="/profile"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Profile</span>
            </Link>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-500/20 border border-indigo-500/30 text-indigo-400">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Admin Asset Moderation
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Review and approve creator prompt submissions before they go live in the public catalog.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-[#25343F]/60 border border-[#25343F] text-xs font-mono text-slate-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{pendingPrompts.length} Pending Review</span>
            </span>
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

        {/* Loading */}
        {loading ? (
          <div className="p-16 text-center rounded-2xl bg-[#090D14] border border-[#25343F]">
            <div className="w-6 h-6 border-2 border-[#FE7F2D] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-slate-400">Loading pending submissions...</p>
          </div>
        ) : pendingPrompts.length === 0 ? (
          <div className="p-16 text-center rounded-2xl bg-[#090D14] border border-[#25343F] space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-white">All Caught Up!</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              There are currently no prompt assets pending moderation. Any newly submitted creator assets will appear here.
            </p>
            <Link
              href="/prompts"
              className="inline-flex items-center gap-1 text-xs text-[#FE7F2D] hover:underline font-semibold pt-2"
            >
              <span>Explore Live Catalog</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {pendingPrompts.map((item) => (
              <div
                key={item.id}
                className="p-6 rounded-2xl bg-[#090D14] border border-[#25343F] space-y-5"
              >
                {/* Header info */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-[#25343F]">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#25343F] text-slate-300 font-semibold">
                        {item.category}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#FE7F2D]/10 text-[#FE7F2D] border border-[#FE7F2D]/30 font-semibold">
                        {item.promptFamily} ➔ {item.promptType}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-950/60 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                        Pending Review
                      </span>
                    </div>

                    <h2 className="text-lg font-bold text-white">
                      {item.title}
                    </h2>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {item.shortDescription}
                    </p>
                  </div>

                  {/* Creator info */}
                  <div className="flex items-center gap-2.5 p-2 rounded-xl bg-[#05060A] border border-[#25343F] flex-shrink-0">
                    <div className="w-8 h-8 rounded-lg bg-[#FE7F2D]/20 text-[#FE7F2D] flex items-center justify-center font-bold text-xs">
                      {item.author?.name?.[0]?.toUpperCase() || "C"}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">
                        {item.author?.name || "Creator"}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {item.author?.email || "verified-creator"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Prompt Details & Media Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                  {/* Thumbnail / Image Preview */}
                  <div className="lg:col-span-1">
                    <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-2">
                      Submitted Output Preview
                    </label>
                    <div className="h-52 w-full rounded-xl overflow-hidden bg-[#05060A] border border-[#25343F] flex items-center justify-center relative">
                      {item.previewImageUrl ? (
                        <img
                          src={item.previewImageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-1 text-slate-500">
                          <ImageIcon className="w-8 h-8 opacity-40" />
                          <span className="text-[11px]">No thumbnail provided</span>
                        </div>
                      )}
                    </div>

                    {/* Parameters summary */}
                    <div className="mt-3 p-3 rounded-xl bg-[#05060A] border border-[#25343F] text-[11px] space-y-1 text-slate-300">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Tool:</span>
                        <span className="font-semibold text-white">{item.aiTool || "Midjourney"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Model:</span>
                        <span className="font-semibold text-white">{item.model || "v6.0"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Ratio:</span>
                        <span className="font-semibold text-white">{item.aspectRatio || "16:9"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Style:</span>
                        <span className="font-semibold text-white">{item.style || "Photorealistic"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Main Prompt & Negative Prompt */}
                  <div className="lg:col-span-2 space-y-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
                        Main Prompt Text
                      </label>
                      <div className="p-3.5 rounded-xl bg-[#05060A] border border-[#25343F] font-mono text-xs text-emerald-300 leading-relaxed max-h-40 overflow-y-auto">
                        {item.prompt}
                      </div>
                    </div>

                    {item.negativePrompt && (
                      <div>
                        <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
                          Negative Prompt
                        </label>
                        <div className="p-2.5 rounded-xl bg-[#05060A] border border-[#25343F] font-mono text-xs text-rose-300">
                          {item.negativePrompt}
                        </div>
                      </div>
                    )}

                    {/* Variations count */}
                    {item.variations && item.variations.length > 0 && (
                      <div className="p-3 rounded-xl bg-[#05060A] border border-[#25343F] text-xs">
                        <span className="font-semibold text-white">
                          Variations Included: {item.variations.length}
                        </span>
                        <div className="text-[11px] text-slate-400 mt-1">
                          {item.variations.map((v) => v.title).join(", ")}
                        </div>
                      </div>
                    )}

                    {/* Feedback input for rejection */}
                    <div className="pt-2">
                      <label className="text-[11px] font-semibold text-slate-300 mb-1 block">
                        Admin Feedback / Notes (Sent to creator if rejected or approved)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Please specify aspect ratio or provide a clearer thumbnail preview."
                        value={feedbackInput[item.id] || ""}
                        onChange={(e) =>
                          setFeedbackInput({
                            ...feedbackInput,
                            [item.id]: e.target.value,
                          })
                        }
                        className="w-full px-3.5 py-2 rounded-xl bg-[#05060A] border border-[#25343F] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FE7F2D]"
                      />
                    </div>
                  </div>
                </div>

                {/* Moderation Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#25343F]">
                  <button
                    type="button"
                    onClick={() => handleReview(item.id, "REJECT")}
                    disabled={actionLoading === item.id}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 border border-rose-500/40 text-rose-300 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
                  >
                    <XCircle className="w-3.5 h-3.5 text-rose-400" />
                    <span>Reject Submission</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleReview(item.id, "APPROVE")}
                    disabled={actionLoading === item.id}
                    className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-bold shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all cursor-pointer disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                    <span>{actionLoading === item.id ? "Approving..." : "Approve & Publish Live"}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
