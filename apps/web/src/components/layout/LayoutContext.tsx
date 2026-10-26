"use client";

import React, { createContext, useContext, useState } from "react";

interface LayoutContextType {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  toggleSidebar: () => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  savedIds: string[];
  toggleSaveId: (id: string) => void;
  isSaved: (id: string) => boolean;
  isPublishOpen: boolean;
  setIsPublishOpen: (open: boolean) => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        return localStorage.getItem("contextnode_sidebar_collapsed") === "true";
      } catch {}
    }
    return false;
  });

  const [savedIds, setSavedIds] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("contextnode_saved_ids");
        return stored ? JSON.parse(stored) : [];
      } catch {}
    }
    return [];
  });

  const [mobileOpen, setMobileOpen] = useState(false);
  const [isPublishOpen, setIsPublishOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const toggleSidebar = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("contextnode_sidebar_collapsed", String(next));
      } catch {}
      return next;
    });
  };

  const toggleSaveId = (id: string) => {
    setSavedIds((prev) => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem("contextnode_saved_ids", JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const isSaved = (id: string) => savedIds.includes(id);

  return (
    <LayoutContext.Provider
      value={{
        collapsed,
        setCollapsed,
        toggleSidebar,
        mobileOpen,
        setMobileOpen,
        savedIds,
        toggleSaveId,
        isSaved,
        isPublishOpen,
        setIsPublishOpen,
        isSettingsOpen,
        setIsSettingsOpen,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("useLayout must be used within a LayoutProvider");
  }
  return context;
}
