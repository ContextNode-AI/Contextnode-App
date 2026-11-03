"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { 
  Menu, 
  PanelLeft, 
  Search, 
  Plus, 
  Bookmark, 
  Command,
  Sparkles
} from "lucide-react";
import { useLayout } from "./LayoutContext";
import { useAuth } from "@/context/AuthContext";

function getPageMetadata(pathname: string) {
  if (pathname === "/") return { title: "Workspace", breadcrumb: "Home" };
  if (pathname.startsWith("/context-packs")) {
    if (pathname.split("/").length > 2) return { title: "Context Pack", breadcrumb: "Context Packs / Details" };
    return { title: "Context Packs", breadcrumb: "Context Packs" };
  }
  if (pathname.startsWith("/prompts")) {
    if (pathname.split("/").length > 2) return { title: "Prompt Details", breadcrumb: "Prompts / Details" };
    return { title: "Prompts", breadcrumb: "Prompts" };
  }
  if (pathname.startsWith("/workflows")) return { title: "Workflows", breadcrumb: "Workflows" };
  if (pathname.startsWith("/search")) return { title: "Search", breadcrumb: "Search Resources" };
  return { title: "ContextNode", breadcrumb: "Developer Workspace" };
}

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { 
    collapsed, 
    toggleSidebar, 
    setMobileOpen, 
    savedIds, 
    setIsPublishOpen, 
    setIsSettingsOpen 
  } = useLayout();
  const { user, isAuthenticated } = useAuth();

  const [headerSearch, setHeaderSearch] = useState("");
  const { title, breadcrumb } = getPageMetadata(pathname);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (headerSearch.trim()) {
      router.push(`/search?q=${encodeURIComponent(headerSearch.trim())}`);
    }
  };

  const handlePublishClick = () => {
    if (!isAuthenticated) {
      router.push("/login");
    } else {
      setIsPublishOpen(true);
    }
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
    <header className="h-14 flex-shrink-0 border-b border-[#25343F] bg-[#05060A] px-4 sm:px-6 flex items-center justify-between z-20 select-none">
      {/* Left: Sidebar Toggle + Breadcrumb */}
      <div className="flex items-center gap-3">
        {/* Desktop Collapse Toggle */}
        <button
          type="button"
          onClick={toggleSidebar}
          className="hidden md:flex p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-[#25343F] transition-colors"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand sidebar (⌘+[)" : "Collapse sidebar (⌘+[)"}
        >
          <PanelLeft className="w-4 h-4" />
        </button>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="md:hidden p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-[#25343F] transition-colors"
          aria-label="Open sidebar menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Breadcrumb / Title */}
        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-white hidden sm:inline">{title}</span>
          <span className="text-slate-600 hidden sm:inline">/</span>
          <span className="text-slate-400 font-medium truncate max-w-[140px] sm:max-w-[200px]">
            {breadcrumb}
          </span>
        </div>
      </div>

      {/* Center / Right: Global Search & Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Compact Global Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative hidden sm:block w-48 lg:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={headerSearch}
            onChange={(e) => setHeaderSearch(e.target.value)}
            placeholder="Search resources..."
            className="w-full h-8 pl-8 pr-10 text-xs bg-[#25343F]/60 border border-[#25343F] rounded-lg text-white placeholder:text-slate-400 focus:outline-hidden focus:bg-[#25343F] focus:border-[#FE7F2D]/70 focus:ring-1 focus:ring-[#FE7F2D]/50 transition-all"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5 text-[10px] font-mono text-slate-400 pointer-events-none bg-[#05060A] px-1 py-0.5 rounded border border-[#25343F]">
            <Command className="w-2.5 h-2.5" />
            <span>K</span>
          </div>
        </form>

        {/* Mobile Search Button */}
        <button
          type="button"
          onClick={() => router.push("/search")}
          className="sm:hidden p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-[#25343F] transition-colors"
          aria-label="Search"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Quick Saved Resources Link / Badge */}
        {savedIds.length > 0 && (
          <button
            type="button"
            onClick={() => {
              if (typeof window !== "undefined") {
                const event = new CustomEvent("contextnode_filter_saved");
                window.dispatchEvent(event);
                if (pathname !== "/") {
                  router.push("/?filter=saved");
                }
              }
            }}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-[#FE7F2D] bg-[#FE7F2D]/15 border border-[#FE7F2D]/30 rounded-lg hover:bg-[#FE7F2D]/25 transition-colors"
            title="View Saved Resources"
          >
            <Bookmark className="w-3 h-3 fill-[#FE7F2D] text-[#FE7F2D]" />
            <span>{savedIds.length}</span>
          </button>
        )}

        {/* Publish Action Button */}
        <button
          type="button"
          onClick={handlePublishClick}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-[#FE7F2D] text-slate-950 hover:bg-[#FE7F2D]/90 rounded-lg shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span className="hidden sm:inline">Publish</span>
        </button>

        {/* Role Badge (Creator / Admin) */}
        {isAuthenticated && user && (
          <span
            className={`hidden md:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
              user.role === "CREATOR"
                ? "text-[#FE7F2D] bg-[#FE7F2D]/15 border-[#FE7F2D]/30"
                : user.role === "ADMIN"
                ? "text-purple-400 bg-purple-500/15 border-purple-500/30"
                : "text-slate-400 bg-slate-500/15 border-slate-500/30"
            }`}
          >
            <Sparkles className="w-2.5 h-2.5" />
            <span>{user.role}</span>
          </span>
        )}

        {/* Unauthenticated Sign In Link */}
        {!isAuthenticated && (
          <Link
            href="/login"
            className="hidden sm:inline-flex text-xs font-semibold px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-[#25343F] border border-transparent hover:border-[#25343F] transition-all"
          >
            Sign In
          </Link>
        )}

        {/* Account / Settings Avatar Button */}
        <button
          type="button"
          onClick={() => setIsSettingsOpen(true)}
          className="w-7 h-7 rounded-full bg-[#25343F] hover:bg-[#25343F]/80 border border-[#25343F] flex items-center justify-center text-[11px] font-semibold text-white transition-colors ml-1 cursor-pointer"
          aria-label="User Settings"
          title={user ? `${user.name} (${user.role})` : "Account & Settings"}
        >
          <span>{userInitials}</span>
        </button>
      </div>
    </header>
  );
}
