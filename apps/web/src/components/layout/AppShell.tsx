"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { LayoutProvider, useLayout } from "./LayoutContext";
import { AuthProvider } from "@/context/AuthContext";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { PublishResourceModal } from "../modals/PublishResourceModal";
import { SettingsModal } from "../modals/SettingsModal";

function ShellInner({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { 
    toggleSidebar, 
    mobileOpen, 
    setMobileOpen,
    setIsPublishOpen,
    setIsSettingsOpen
  } = useLayout();

  const isAuthRoute =
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/register" ||
    pathname === "/forgot-password";

  // Global Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. Toggle Sidebar: Cmd+[ or Ctrl+[
      if ((e.metaKey || e.ctrlKey) && e.key === "[") {
        e.preventDefault();
        toggleSidebar();
      }
      // 2. Global Search: Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        router.push("/search");
      }
      // 3. Escape key closes drawers and modals
      if (e.key === "Escape") {
        setMobileOpen(false);
        setIsPublishOpen(false);
        setIsSettingsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar, router, setMobileOpen, setIsPublishOpen, setIsSettingsOpen]);

  // Render clean full-screen layout for Auth pages
  if (isAuthRoute) {
    return (
      <div className="h-dvh max-h-dvh w-full overflow-y-auto bg-[#05060A] text-white antialiased font-sans">
        {children}
      </div>
    );
  }

  return (
    <div className="flex h-dvh max-h-dvh w-full overflow-hidden bg-[#05060A] text-white antialiased font-sans">
      {/* Desktop Persistent Left Sidebar (Stationary) */}
      <div className="hidden md:flex h-full flex-shrink-0 z-30">
        <Sidebar isMobile={false} />
      </div>

      {/* Mobile Drawer (Slide-out menu with backdrop overlay) */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 z-50 md:hidden flex"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Drawer"
        >
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer panel */}
          <div className="relative w-[280px] max-w-[85vw] h-full bg-[#05060A] shadow-2xl flex flex-col z-10 border-r border-[#25343F] animate-in slide-in-from-left duration-200">
            <Sidebar isMobile={true} />
          </div>
        </div>
      )}

      {/* Flexible Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden relative">
        {/* Stationary Compact Header */}
        <Header />

        {/* Separately Scrollable Main Content Container */}
        <main
          id="main-content-scroll"
          data-scroll-container
          className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 bg-[#05060A] focus:outline-hidden"
          tabIndex={-1}
        >
          {children}
        </main>
      </div>

      {/* Shared Modals */}
      <PublishResourceModal />
      <SettingsModal />
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <LayoutProvider>
        <ShellInner>{children}</ShellInner>
      </LayoutProvider>
    </AuthProvider>
  );
}
