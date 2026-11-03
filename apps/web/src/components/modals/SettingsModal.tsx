"use client";

import Link from "next/link";
import { X, User, Command, Check, LogOut, LogIn, Sparkles } from "lucide-react";
import { useLayout } from "../layout/LayoutContext";
import { useAuth } from "@/context/AuthContext";

export function SettingsModal() {
  const { isSettingsOpen, setIsSettingsOpen, savedIds } = useLayout();
  const { user, isAuthenticated, logout } = useAuth();

  if (!isSettingsOpen) return null;

  const handleLogout = async () => {
    await logout();
    setIsSettingsOpen(false);
  };

  const userInitials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "CN";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-none">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
        onClick={() => setIsSettingsOpen(false)}
      />

      {/* Modal Dialog */}
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-modal-title"
        className="relative w-full max-w-lg bg-[#05060A] text-white rounded-2xl shadow-2xl border border-[#25343F] overflow-hidden flex flex-col max-h-[90vh] z-10 animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#25343F] bg-[#25343F]/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#25343F] border border-[#25343F] text-white flex items-center justify-center font-bold text-sm shadow-xs">
              {userInitials}
            </div>
            <div>
              <h2 id="settings-modal-title" className="text-base font-bold text-white">
                Account & Workspace
              </h2>
              <p className="text-xs text-slate-400">
                ContextNode AI Developer Environment
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsSettingsOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#25343F] transition-colors"
            aria-label="Close settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs text-slate-300">
          {/* User Profile Summary */}
          <div className="p-3.5 rounded-xl bg-[#25343F]/40 border border-[#25343F] flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-[#05060A] border border-[#25343F] flex items-center justify-center text-slate-300 flex-shrink-0">
                {user ? (
                  <span className="font-bold text-xs text-[#FE7F2D]">{userInitials}</span>
                ) : (
                  <User className="w-4 h-4 text-slate-400" />
                )}
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-white flex items-center gap-1.5 truncate">
                  <span>{user ? user.name : "Guest User"}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      user?.role === "CREATOR"
                        ? "text-[#FE7F2D] bg-[#FE7F2D]/15 border-[#FE7F2D]/30"
                        : user?.role === "ADMIN"
                        ? "text-purple-400 bg-purple-500/15 border-purple-500/30"
                        : "text-slate-400 bg-slate-500/15 border-slate-500/30"
                    }`}
                  >
                    {user ? user.role : "GUEST"}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 truncate">
                  {user ? user.email : "Sign in to author & publish AI assets"}
                </div>
              </div>
            </div>

            {isAuthenticated ? (
              <button
                type="button"
                onClick={handleLogout}
                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-400 hover:text-rose-300 bg-rose-950/30 hover:bg-rose-950/60 border border-rose-500/30 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsSettingsOpen(false)}
                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-950 bg-[#FE7F2D] hover:bg-[#FE7F2D]/90 transition-colors shadow-xs"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Link>
            )}
          </div>

          {/* Preferences */}
          <div className="space-y-2">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Workspace Preferences
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2.5 rounded-lg border border-[#25343F] bg-[#25343F]/20">
                <div>
                  <div className="font-semibold text-slate-200">One-Click Snippet Copy</div>
                  <div className="text-[11px] text-slate-400">Copy system prompts directly formatted for LLMs</div>
                </div>
                <div className="w-4 h-4 rounded-full bg-[#FE7F2D] flex items-center justify-center text-slate-950">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg border border-[#25343F] bg-[#25343F]/20">
                <div>
                  <div className="font-semibold text-slate-200">Persistent Sidebar Layout</div>
                  <div className="text-[11px] text-slate-400">Keep application navigation stationary during scroll</div>
                </div>
                <div className="w-4 h-4 rounded-full bg-[#FE7F2D] flex items-center justify-center text-slate-950">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
              </div>
            </div>
          </div>

          {/* Keyboard Shortcuts */}
          <div className="space-y-2">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Command className="w-3.5 h-3.5" />
              <span>Keyboard Shortcuts</span>
            </div>
            <div className="rounded-xl border border-[#25343F] divide-y divide-[#25343F] overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 bg-[#25343F]/20">
                <span className="text-slate-300">Global Resource Search</span>
                <kbd className="px-2 py-0.5 rounded bg-[#05060A] border border-[#25343F] font-mono text-[10px] text-slate-300">
                  ⌘ + K
                </kbd>
              </div>
              <div className="flex items-center justify-between px-3 py-2 bg-[#25343F]/20">
                <span className="text-slate-300">Toggle Sidebar (Expand/Collapse)</span>
                <kbd className="px-2 py-0.5 rounded bg-[#05060A] border border-[#25343F] font-mono text-[10px] text-slate-300">
                  ⌘ + [
                </kbd>
              </div>
              <div className="flex items-center justify-between px-3 py-2 bg-[#25343F]/20">
                <span className="text-slate-300">Close Modals / Drawers</span>
                <kbd className="px-2 py-0.5 rounded bg-[#05060A] border border-[#25343F] font-mono text-[10px] text-slate-300">
                  Esc
                </kbd>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#25343F] bg-[#25343F]/40 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">ContextNode v0.1.0 • Next.js 16</span>
          <button
            type="button"
            onClick={() => setIsSettingsOpen(false)}
            className="px-4 py-1.5 rounded-lg text-xs font-bold bg-[#FE7F2D] text-slate-950 hover:bg-[#FE7F2D]/90 transition-colors shadow-xs cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
