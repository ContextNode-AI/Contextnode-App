"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Search, 
  Layers, 
  MessageSquare, 
  Workflow, 
  Users, 
  Bookmark, 
  User, 
  PlusCircle, 
  Settings, 
  PanelLeftClose, 
  PanelLeftOpen, 
  X,
  Sparkles
} from "lucide-react";
import { useLayout } from "./LayoutContext";
import { cn } from "@/lib/utils";

interface NavItemProps {
  label: string;
  href?: string;
  icon: React.ElementType;
  isActive?: boolean;
  onClick?: () => void;
  badge?: string | number;
  badgeColor?: string;
  collapsed?: boolean;
}

function NavItem({
  label,
  href,
  icon: Icon,
  isActive,
  onClick,
  badge,
  badgeColor = "bg-[#25343F] text-slate-300 border border-[#25343F]",
  collapsed,
}: NavItemProps) {
  const content = (
    <div
      className={cn(
        "group relative flex items-center gap-3 rounded-xl transition-all duration-150 text-sm",
        collapsed
          ? "w-10 h-10 mx-auto justify-center p-0"
          : "px-3 py-2 w-full",
        isActive
          ? "bg-[#25343F] text-white font-semibold shadow-xs border border-[#FE7F2D]/60"
          : "text-slate-300 hover:text-white hover:bg-[#25343F]/70 font-medium"
      )}
      title={collapsed ? label : undefined}
    >
      <Icon
        className={cn(
          "w-4 h-4 flex-shrink-0 transition-colors",
          isActive ? "text-[#FE7F2D]" : "text-slate-400 group-hover:text-white"
        )}
      />
      
      {!collapsed && (
        <span className="truncate flex-1 tracking-tight">{label}</span>
      )}

      {!collapsed && badge !== undefined && (
        <span
          className={cn(
            "text-[10px] font-semibold px-1.5 py-0.5 rounded-full leading-none",
            badgeColor
          )}
        >
          {badge}
        </span>
      )}

      {/* Floating Tooltip in collapsed mode */}
      {collapsed && (
        <div className="absolute left-full ml-3 px-2.5 py-1 bg-[#25343F] border border-[#25343F] text-white text-xs font-medium rounded-md shadow-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
          {label}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} onClick={onClick} className="block w-full outline-hidden focus-visible:ring-2 focus-visible:ring-[#FE7F2D]/50 rounded-xl">
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left outline-hidden focus-visible:ring-2 focus-visible:ring-[#FE7F2D]/50 rounded-xl"
    >
      {content}
    </button>
  );
}

export function Sidebar({ isMobile = false }: { isMobile?: boolean }) {
  const pathname = usePathname();
  const {
    collapsed,
    toggleSidebar,
    setMobileOpen,
    savedIds,
    setIsPublishOpen,
    setIsSettingsOpen,
  } = useLayout();

  const isCollapsed = !isMobile && collapsed;

  const handleLinkClick = () => {
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handlePublishClick = () => {
    if (isMobile) setMobileOpen(false);
    setIsPublishOpen(true);
  };

  const handleSettingsClick = () => {
    if (isMobile) setMobileOpen(false);
    setIsSettingsOpen(true);
  };

  const handleSavedClick = () => {
    if (isMobile) setMobileOpen(false);
    if (typeof window !== "undefined") {
      const event = new CustomEvent("contextnode_filter_saved");
      window.dispatchEvent(event);
      if (pathname !== "/") {
        window.location.href = "/?filter=saved";
      }
    }
  };

  const handleCreatorsClick = () => {
    if (isMobile) setMobileOpen(false);
    if (typeof window !== "undefined") {
      const target = document.getElementById("creators-section");
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      } else {
        window.location.href = "/#creators-section";
      }
    }
  };

  return (
    <aside
      className={cn(
        "flex flex-col h-full bg-[#05060A] border-r border-[#25343F] text-slate-200 select-none overflow-x-hidden",
        isMobile
          ? "w-full"
          : isCollapsed
          ? "w-[72px] transition-[width] duration-200"
          : "w-[260px] transition-[width] duration-200"
      )}
      aria-label="Sidebar Navigation"
    >
      {/* 1. Brand Header */}
      <div
        className={cn(
          "flex items-center h-14 px-4 border-b border-[#25343F] flex-shrink-0 bg-[#05060A]",
          isCollapsed ? "justify-center" : "justify-between"
        )}
      >
        <Link
          href="/"
          onClick={handleLinkClick}
          className="flex items-center gap-2.5 group outline-hidden"
          title="ContextNode Home"
        >
          <img
            src="/contextnode-logo.png"
            alt="ContextNode Logo"
            className="w-7 h-7 object-contain flex-shrink-0 transition-transform group-hover:scale-105"
          />
          {!isCollapsed && (
            <span className="font-bold text-white tracking-tight text-base flex items-center gap-1.5">
              ContextNode
              <span className="text-[10px] font-semibold text-[#FE7F2D] bg-[#FE7F2D]/15 border border-[#FE7F2D]/30 px-1.5 py-0.2 rounded-full">
                AI
              </span>
            </span>
          )}
        </Link>

        {isMobile ? (
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#25343F] transition-colors"
            aria-label="Close sidebar menu"
          >
            <X className="w-5 h-5" />
          </button>
        ) : (
          !isCollapsed && (
            <button
              type="button"
              onClick={toggleSidebar}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#25343F] transition-colors"
              aria-label="Collapse sidebar"
              title="Collapse sidebar (⌘+[)"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          )
        )}
      </div>

      {/* Expand Button When Collapsed */}
      {isCollapsed && (
        <div className="flex justify-center pt-2 pb-1 border-b border-[#25343F]">
          <button
            type="button"
            onClick={toggleSidebar}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#25343F] transition-colors"
            aria-label="Expand sidebar"
            title="Expand sidebar"
          >
            <PanelLeftOpen className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. Scrollable Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4 text-xs font-medium">
        {/* Primary Navigation */}
        <div className="space-y-1">
          <NavItem
            label="Home"
            href="/"
            icon={Home}
            isActive={pathname === "/"}
            onClick={handleLinkClick}
            collapsed={isCollapsed}
          />
          <NavItem
            label="Search"
            href="/search"
            icon={Search}
            isActive={pathname === "/search"}
            onClick={handleLinkClick}
            collapsed={isCollapsed}
          />
        </div>

        {/* Section: DISCOVER */}
        <div className="space-y-1">
          {!isCollapsed ? (
            <div className="px-3 pt-2 pb-1 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
              Discover
            </div>
          ) : (
            <div className="my-2 border-t border-[#25343F]" />
          )}

          <NavItem
            label="Context Packs"
            href="/context-packs"
            icon={Layers}
            isActive={pathname.startsWith("/context-packs")}
            onClick={handleLinkClick}
            badge="6"
            collapsed={isCollapsed}
          />
          <NavItem
            label="Prompts"
            href="/prompts"
            icon={MessageSquare}
            isActive={pathname.startsWith("/prompts")}
            onClick={handleLinkClick}
            badge="18+"
            collapsed={isCollapsed}
          />
          <NavItem
            label="Workflows"
            href="/workflows"
            icon={Workflow}
            isActive={pathname.startsWith("/workflows")}
            onClick={handleLinkClick}
            badge="8"
            collapsed={isCollapsed}
          />
          <NavItem
            label="Creators"
            icon={Users}
            onClick={handleCreatorsClick}
            collapsed={isCollapsed}
          />
        </div>

        {/* Section: YOUR WORKSPACE */}
        <div className="space-y-1">
          {!isCollapsed ? (
            <div className="px-3 pt-2 pb-1 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
              Your Workspace
            </div>
          ) : (
            <div className="my-2 border-t border-[#25343F]" />
          )}

          <NavItem
            label="Saved Resources"
            icon={Bookmark}
            onClick={handleSavedClick}
            badge={savedIds.length > 0 ? savedIds.length : undefined}
            badgeColor="bg-[#FE7F2D]/20 text-[#FE7F2D] border border-[#FE7F2D]/40"
            collapsed={isCollapsed}
          />
          <NavItem
            label="Creator Profile"
            icon={User}
            onClick={handleSettingsClick}
            collapsed={isCollapsed}
          />
          <NavItem
            label="Publish Resource"
            icon={PlusCircle}
            onClick={handlePublishClick}
            collapsed={isCollapsed}
          />
        </div>
      </div>

      {/* 3. Bottom Section: Account & Settings */}
      <div className="p-3 border-t border-[#25343F] bg-[#05060A] flex-shrink-0">
        <button
          type="button"
          onClick={handleSettingsClick}
          className={cn(
            "w-full flex items-center rounded-xl p-2 bg-[#25343F]/80 hover:bg-[#25343F] border border-[#25343F] text-slate-200 hover:text-white transition-colors text-left group",
            isCollapsed ? "justify-center" : "gap-3"
          )}
          title={isCollapsed ? "Account & Settings" : undefined}
          aria-label="Account and Settings"
        >
          {/* Avatar / User icon */}
          <div className="w-8 h-8 rounded-full bg-[#05060A] border border-[#FE7F2D]/40 text-white flex items-center justify-center text-xs font-semibold flex-shrink-0 shadow-xs relative">
            <span>CN</span>
            <span className="absolute bottom-0 right-0 w-2 h-2 bg-[#FE7F2D] rounded-full border-2 border-[#05060A]" />
          </div>

          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-white truncate flex items-center gap-1.5">
                Developer Mode
                <Sparkles className="w-3 h-3 text-[#FE7F2D]" />
              </div>
              <div className="text-[11px] text-slate-400 truncate">Account & settings</div>
            </div>
          )}

          {!isCollapsed && (
            <Settings className="w-4 h-4 text-slate-400 group-hover:text-white flex-shrink-0" />
          )}
        </button>
      </div>
    </aside>
  );
}
