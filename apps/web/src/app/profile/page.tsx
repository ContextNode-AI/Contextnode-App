"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useLayout } from "@/components/layout/LayoutContext";
import { api, ImagePrompt } from "@/lib/api";
import { 
  User, 
  Mail, 
  Sparkles, 
  Calendar, 
  ShieldCheck, 
  Edit3, 
  Share2, 
  Plus, 
  Layers, 
  MessageSquare, 
  Workflow, 
  Bookmark, 
  CheckCircle2, 
  AlertCircle,
  Copy,
  ExternalLink,
  Code2,
  Terminal,
  Settings,
  Star,
  Download
} from "lucide-react";

export default function CreatorProfilePage() {
  const { user, isAuthenticated, updateProfile } = useAuth();
  const { savedIds, setIsPublishOpen } = useLayout();

  const [activeTab, setActiveTab] = useState<"assets" | "saved" | "settings">("assets");
  const [assetFilter, setAssetFilter] = useState<"all" | "packs" | "prompts" | "workflows">("all");
  const [myLivePrompts, setMyLivePrompts] = useState<ImagePrompt[]>([]);
  const [promptsLoading, setPromptsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      setPromptsLoading(true);
      api.prompts
        .getMyImagePrompts()
        .then((data) => setMyLivePrompts(data || []))
        .catch((err) => console.error("Failed to load creator prompts:", err))
        .finally(() => setPromptsLoading(false));
    }
  }, [isAuthenticated]);
  
  // Edit profile state
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || "");
  const [editBio, setEditBio] = useState(user?.bio || "");
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Sync edit state when user loads
  useState(() => {
    if (user) {
      setEditName(user.name);
      setEditBio(user.bio || "");
    }
  });

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) {
      setFeedback({ type: "error", text: "Display name cannot be empty." });
      return;
    }

    setSaving(true);
    setFeedback(null);

    try {
      await updateProfile({
        name: editName.trim(),
        bio: editBio.trim(),
      });
      setIsEditing(false);
      setFeedback({ type: "success", text: "Creator profile updated successfully!" });
      setTimeout(() => setFeedback(null), 3500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update profile";
      setFeedback({ type: "error", text: msg });
    } finally {
      setSaving(false);
    }
  };

  // Mock initial creator assets
  const creatorAssets = [
    {
      id: "cp-1",
      title: "Next.js 15 App Router & Server Actions Pack",
      type: "packs",
      slug: "nextjs-15-app-router",
      status: "Published",
      version: "v2.1.0",
      downloads: 412,
      stars: 68,
      category: "Full Stack",
      desc: "Complete context bundle with production rules, route handler templates, and verification gates.",
    },
    {
      id: "pr-1",
      title: "Senior System Architecture Designer Prompt",
      type: "prompts",
      slug: "system-architecture-designer",
      status: "Published",
      version: "v1.4",
      downloads: 820,
      stars: 124,
      category: "Backend",
      desc: "High-reasoning prompt that converts PRDs and feature requirements into clean diagrams.",
    },
    {
      id: "wf-1",
      title: "Prisma & PostgreSQL Migration Workflow",
      type: "workflows",
      slug: "prisma-postgres-migration",
      status: "Published",
      version: "v1.0.2",
      downloads: 310,
      stars: 49,
      category: "Database",
      desc: "Automated schema diffing, migration validation, and rollback checklist generator.",
    },
    {
      id: "cp-2",
      title: "Tailwind CSS v4 & Lucide UI Micro-System",
      type: "packs",
      slug: "tailwind-v4-micro-system",
      status: "Draft",
      version: "v0.3-beta",
      downloads: 0,
      stars: 12,
      category: "Frontend",
      desc: "Components, color system standards, and atomic design tokens configured for Claude & Gemini.",
    },
  ];

  const mappedLivePrompts = myLivePrompts.map((p) => ({
    id: p.id,
    title: p.title,
    type: "prompts" as const,
    slug: p.slug,
    status:
      p.status === "PUBLISHED"
        ? "Published"
        : p.status === "PENDING_REVIEW"
        ? "Pending Review"
        : p.status === "REJECTED"
        ? "Action Required"
        : "Draft",
    rawStatus: p.status,
    version: p.model || "v1.0",
    downloads: p.viewsCount || 0,
    stars: 0,
    category: p.category,
    desc: p.shortDescription,
    adminFeedback: p.adminFeedback,
    previewImageUrl: p.previewImageUrl,
    isLiveApi: true,
  }));

  const combinedAssets = [
    ...mappedLivePrompts,
    ...creatorAssets.filter(
      (a) => a.type !== "prompts" || mappedLivePrompts.length === 0
    ),
  ];

  const filteredAssets = combinedAssets.filter((item) => {
    if (assetFilter === "all") return true;
    return item.type === assetFilter;
  });

  const userInitials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "CR";

  const memberDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : "Nov 2026";

  if (!isAuthenticated) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center p-6">
        <div className="max-w-md w-full p-8 rounded-2xl bg-[#090D14]/90 border border-[#25343F] text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FE7F2D] to-transparent opacity-80" />
          
          <div className="w-16 h-16 rounded-2xl bg-[#FE7F2D]/10 border border-[#FE7F2D]/30 text-[#FE7F2D] flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8" />
          </div>

          <h1 className="text-xl font-bold text-white mb-2">Creator Profile Locked</h1>
          <p className="text-xs text-slate-400 mb-6 leading-relaxed">
            Sign in to view your published AI prompts, manage context packs, and track downloads in your personalized Creator Studio.
          </p>

          <div className="flex flex-col gap-3">
            <Link
              href="/login"
              className="w-full py-2.5 px-4 rounded-xl bg-[#FE7F2D] text-slate-950 font-bold text-sm hover:bg-[#FE7F2D]/90 transition-all shadow-[0_0_20px_rgba(254,127,45,0.2)]"
            >
              Sign In to Your Account
            </Link>
            <Link
              href="/signup"
              className="w-full py-2.5 px-4 rounded-xl bg-[#25343F]/60 text-white font-semibold text-xs hover:bg-[#25343F] border border-[#25343F] transition-all"
            >
              Join as a Creator for Free →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full pb-16">
      {/* 1. Creator Cover Header */}
      <div className="relative border-b border-[#25343F] bg-[#090D14]/80">
        {/* Ambient Top Light Beam */}
        <div className="absolute top-0 left-1/3 w-96 h-32 bg-[#FE7F2D]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-80 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            {/* Identity & Avatar */}
            <div className="flex items-start sm:items-center gap-5">
              <div className="relative">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#05060A] border-2 border-[#FE7F2D]/60 text-white flex items-center justify-center font-bold text-2xl shadow-[0_0_25px_rgba(254,127,45,0.2)]">
                  {userInitials}
                </div>
                <div className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-[#FE7F2D] text-slate-950 text-[10px] font-extrabold flex items-center gap-0.5 shadow-md">
                  <Sparkles className="w-2.5 h-2.5 fill-current" />
                  <span>CREATOR</span>
                </div>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {user?.name}
                  </h1>
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Verified Author
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-400 mb-2">
                  <span className="flex items-center gap-1 text-slate-300">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    {user?.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Joined {memberDate}
                  </span>
                  <span className="flex items-center gap-1 text-[#FE7F2D]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Role: {user?.role}
                  </span>
                </div>

                <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                  {user?.bio || "ContextNode verified creator building production AI context packs, repeatable engineering workflows, and system prompts."}
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2.5 flex-wrap">
              {user?.role === "ADMIN" && (
                <Link
                  href="/admin/reviews"
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-950/70 hover:bg-purple-900 border border-purple-500/40 text-purple-300 font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                  <span>Admin Moderation</span>
                </Link>
              )}

              <Link
                href="/create/creative/image"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FE7F2D] hover:bg-[#FE7F2D]/90 text-slate-950 font-bold text-xs shadow-[0_0_20px_rgba(254,127,45,0.25)] transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 fill-current" />
                <span>Create Image Prompt</span>
              </Link>

              <button
                type="button"
                onClick={handleShare}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#25343F]/60 hover:bg-[#25343F] border border-[#25343F] text-slate-200 text-xs font-semibold transition-all cursor-pointer"
              >
                {copiedLink ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copiedLink ? "Link Copied!" : "Share Profile"}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#25343F]/60 hover:bg-[#25343F] border border-[#25343F] text-slate-200 text-xs font-semibold transition-all cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5 text-[#FE7F2D]" />
                <span>{isEditing ? "Close Edit" : "Edit Profile"}</span>
              </button>
            </div>
          </div>

          {/* Feedback Toast */}
          {feedback && (
            <div
              className={`mt-4 p-3 rounded-xl flex items-center gap-2.5 text-xs ${
                feedback.type === "success"
                  ? "bg-emerald-950/50 border border-emerald-500/40 text-emerald-300"
                  : "bg-rose-950/50 border border-rose-500/40 text-rose-300"
              }`}
            >
              {feedback.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              )}
              <span>{feedback.text}</span>
            </div>
          )}

          {/* Inline Edit Form Drawer */}
          {isEditing && (
            <form onSubmit={handleSaveProfile} className="mt-6 p-4 rounded-xl bg-[#05060A] border border-[#25343F] max-w-2xl space-y-3.5 animate-in fade-in duration-200">
              <div className="font-semibold text-xs text-white flex items-center gap-1.5">
                <Edit3 className="w-3.5 h-3.5 text-[#FE7F2D]" />
                <span>Edit Creator Profile Information</span>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">Display Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                  placeholder="Your Name"
                  className="w-full px-3 py-2 bg-[#090D14] border border-[#25343F] rounded-lg text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#FE7F2D]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">Creator Bio</label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  rows={3}
                  placeholder="Tell developers what AI prompt engineering and workflows you specialize in..."
                  className="w-full px-3 py-2 bg-[#090D14] border border-[#25343F] rounded-lg text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#FE7F2D]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-1.5 rounded-lg text-xs font-bold bg-[#FE7F2D] text-slate-950 hover:bg-[#FE7F2D]/90 disabled:opacity-50 cursor-pointer"
                >
                  {saving ? "Saving Changes..." : "Save Profile"}
                </button>
              </div>
            </form>
          )}

          {/* 2. Impact Metrics Overview Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            <div className="p-3.5 rounded-xl bg-[#05060A]/90 border border-[#25343F]">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[11px] font-medium">Context Packs</span>
                <Layers className="w-3.5 h-3.5 text-[#FE7F2D]" />
              </div>
              <div className="text-xl font-bold text-white">2</div>
              <div className="text-[10px] text-slate-500">1 published, 1 draft</div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#05060A]/90 border border-[#25343F]">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[11px] font-medium">Authored Prompts</span>
                <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
              </div>
              <div className="text-xl font-bold text-white">1</div>
              <div className="text-[10px] text-slate-500">System templates</div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#05060A]/90 border border-[#25343F]">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[11px] font-medium">Workflows Built</span>
                <Workflow className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="text-xl font-bold text-white">1</div>
              <div className="text-[10px] text-slate-500">Automated chains</div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#05060A]/90 border border-[#25343F]">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[11px] font-medium">Total Usage</span>
                <Download className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div className="text-xl font-bold text-white">1,542</div>
              <div className="text-[10px] text-slate-500">Downloads & copies</div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Navigation Tabs & Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6">
        <div className="flex items-center justify-between border-b border-[#25343F] pb-2 mb-6">
          <div className="flex items-center gap-4 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab("assets")}
              className={`pb-2 transition-colors relative cursor-pointer ${
                activeTab === "assets"
                  ? "text-[#FE7F2D]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <span>My Published Assets</span>
              {activeTab === "assets" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FE7F2D] rounded-full" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("saved")}
              className={`pb-2 transition-colors relative cursor-pointer ${
                activeTab === "saved"
                  ? "text-[#FE7F2D]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <span>Saved & Starred ({savedIds.length})</span>
              {activeTab === "saved" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FE7F2D] rounded-full" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("settings")}
              className={`pb-2 transition-colors relative cursor-pointer ${
                activeTab === "settings"
                  ? "text-[#FE7F2D]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <span>Developer Credentials & Plan</span>
              {activeTab === "settings" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FE7F2D] rounded-full" />
              )}
            </button>
          </div>
        </div>

        {/* Tab 1: Creator Assets */}
        {activeTab === "assets" && (
          <div>
            {/* Type filters */}
            <div className="flex items-center gap-2 mb-4">
              {(["all", "packs", "prompts", "workflows"] as const).map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setAssetFilter(filter)}
                  className={`text-[11px] font-semibold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                    assetFilter === filter
                      ? "bg-[#FE7F2D] text-slate-950 border-[#FE7F2D]"
                      : "bg-[#25343F]/40 hover:bg-[#25343F] text-slate-300 border-[#25343F]"
                  }`}
                >
                  {filter === "all" ? "All Items" : filter === "packs" ? "Context Packs" : filter === "prompts" ? "Prompts" : "Workflows"}
                </button>
              ))}
            </div>

            {/* Asset cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredAssets.map((asset) => (
                <div
                  key={asset.id}
                  className="p-5 rounded-2xl bg-[#090D14]/90 border border-[#25343F] hover:border-[#FE7F2D]/50 transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#25343F] text-slate-300 border border-[#25343F]">
                          {asset.category}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                          asset.status === "Published"
                            ? "bg-emerald-950/60 text-emerald-400 border border-emerald-500/30"
                            : asset.status === "Pending Review"
                            ? "bg-amber-950/60 text-amber-400 border border-amber-500/30"
                            : asset.status === "Action Required"
                            ? "bg-rose-950/60 text-rose-400 border border-rose-500/30"
                            : "bg-slate-800 text-slate-300 border border-slate-700"
                        }`}>
                          {asset.status === "Pending Review" && (
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                          )}
                          <span>{asset.status}</span>
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">{asset.version}</span>
                    </div>

                    <h3 className="text-sm font-bold text-white group-hover:text-[#FE7F2D] transition-colors mb-1.5">
                      {asset.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed mb-2">
                      {asset.desc}
                    </p>

                    {/* Admin Feedback note if any */}
                    {"adminFeedback" in asset && Boolean(asset.adminFeedback) && (
                      <div className="mb-3 p-2 rounded-lg bg-amber-950/40 border border-amber-500/30 text-[11px] text-amber-300 flex items-start gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-amber-400" />
                        <span><strong>Moderation Note:</strong> {String(asset.adminFeedback)}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#25343F]/60 text-xs text-slate-400">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Download className="w-3.5 h-3.5 text-slate-500" />
                        {asset.downloads}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        {asset.stars}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/${asset.type === "packs" ? "context-packs" : asset.type === "prompts" ? "prompts" : "workflows"}/${asset.slug}`}
                        className="text-xs text-[#FE7F2D] hover:underline flex items-center gap-1 font-semibold"
                      >
                        <span>Inspect Asset</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Saved Resources */}
        {activeTab === "saved" && (
          <div>
            {savedIds.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-[#090D14]/90 border border-[#25343F]">
                <Bookmark className="w-10 h-10 text-slate-500 mx-auto mb-3" />
                <h3 className="text-sm font-bold text-white mb-1">No Saved Resources Yet</h3>
                <p className="text-xs text-slate-400 mb-4 max-w-sm mx-auto">
                  Bookmark context packs, prompts, and workflows while browsing the explore library to save them for quick reference.
                </p>
                <Link
                  href="/context-packs"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#25343F] hover:bg-[#25343F]/80 text-white text-xs font-semibold border border-[#25343F]"
                >
                  Explore Context Packs →
                </Link>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-[#090D14]/90 border border-[#25343F]">
                <div className="text-xs font-semibold text-white mb-2">
                  You have bookmarked {savedIds.length} items in this workspace.
                </div>
                <Link
                  href="/?filter=saved"
                  className="text-xs text-[#FE7F2D] hover:underline flex items-center gap-1 font-semibold"
                >
                  View all filtered in workspace view →
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Developer Settings & Plan */}
        {activeTab === "settings" && (
          <div className="max-w-2xl space-y-4">
            {/* Subscription & Role Info Card */}
            <div className="p-5 rounded-2xl bg-[#090D14]/90 border border-[#25343F]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#FE7F2D]" />
                  <h3 className="text-sm font-bold text-white">Creator Membership Tier</h3>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FE7F2D]/15 text-[#FE7F2D] border border-[#FE7F2D]/30">
                  {user?.plan} PLAN
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                As an approved <strong>{user?.role}</strong>, you have full privileges to publish custom Context Packs, distribute system prompts, and bundle repeatable engineering workflows.
              </p>
              <div className="flex items-center gap-3 text-xs text-slate-300">
                <div className="flex items-center gap-1 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Unlimited Public Packs
                </div>
                <div className="flex items-center gap-1 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  ContextPack Manifest CLI Access
                </div>
              </div>
            </div>

            {/* Account Identifiers */}
            <div className="p-5 rounded-2xl bg-[#090D14]/90 border border-[#25343F] space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-indigo-400" />
                <span>Developer Account Identity</span>
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between py-2 border-b border-[#25343F]/60">
                  <span className="text-slate-400">Unique User ID</span>
                  <span className="font-mono text-slate-200 text-[11px]">{user?.id}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-[#25343F]/60">
                  <span className="text-slate-400">Primary Email</span>
                  <span className="text-slate-200">{user?.email}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-slate-400">Authentication Method</span>
                  <span className="text-slate-200 font-mono text-[11px]">
                    {user?.googleId ? "Google OAuth 2.0" : "Direct Email & Password"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

