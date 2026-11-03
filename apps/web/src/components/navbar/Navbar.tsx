"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { name: "Explore", href: "/" },
  { name: "Context Packs", href: "/context-packs" },
  { name: "Prompts", href: "/prompts" },
  { name: "Workflows", href: "/workflows" },
];

export function Navbar() {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
      setIsMobileMenuOpen(false); // Close menu on scroll down
    } else {
      setHidden(false);
    }
  });

  return (
    <motion.header
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="fixed top-0 left-0 right-0 z-50 flex flex-col items-center justify-center p-4 md:p-6 pointer-events-none"
    >
      <nav
        className={cn(
          "pointer-events-auto flex w-full max-w-5xl items-center justify-between",
          "rounded-full px-5 py-3 md:px-6 relative z-50",
          "glass shadow-2xl transition-all duration-300"
        )}
      >
        {/* Left: Logo */}
        <div className="flex items-center gap-2">
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 group">
            <img 
              src="/contextnode-logo.png" 
              alt="ContextNode Logo" 
              className="w-8 h-8 object-contain"
            />
            <span className="font-semibold text-white tracking-tight text-base md:text-lg">
              ContextNode
            </span>
          </Link>
        </div>

        {/* Center: Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href || pathname?.startsWith(link.href + "/");
            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors relative py-1",
                  isActive ? "text-white" : "text-muted-foreground hover:text-white"
                )}
              >
                {link.name}
                {isActive && (
                  <motion.span 
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Sign In Link */}
          <Link
            href="/login"
            className="hidden sm:flex text-sm font-medium px-4 py-2 rounded-full text-slate-300 hover:text-white transition-colors"
          >
            Sign In
          </Link>

          {/* Desktop Get Started */}
          <Link
            href="/signup"
            className={cn(
              "hidden md:flex text-sm font-medium px-5 py-2 rounded-full",
              "bg-white text-black hover:bg-white/90 transition-colors",
              "items-center gap-2 font-semibold"
            )}
          >
            Get Started
            <span className="text-black/60 text-xs">→</span>
          </Link>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-full hover:bg-white/10 transition-colors text-white flex items-center justify-center"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto absolute top-full left-4 right-4 mt-2 p-4 bg-[#0A0A0A]/95 backdrop-blur-2xl border border-white/10 rounded-2xl flex flex-col gap-2 shadow-[0_20px_40px_rgba(0,0,0,0.4)] md:hidden z-40"
          >
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href || pathname?.startsWith(link.href + "/");
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "text-base font-medium transition-colors py-3 px-4 rounded-xl",
                      isActive 
                        ? "text-white bg-white/10 font-semibold" 
                        : "text-muted-foreground hover:text-white hover:bg-white/5"
                    )}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>
            <div className="h-px bg-white/10 w-full my-2" />
            <Link
              href="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full text-center text-sm font-medium py-3 px-4 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full text-center text-sm font-semibold px-5 py-3.5 rounded-xl bg-white text-black hover:bg-white/90 transition-colors flex items-center justify-center gap-2 mt-1"
            >
              Get Started
              <span className="text-black/60 text-xs">→</span>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
