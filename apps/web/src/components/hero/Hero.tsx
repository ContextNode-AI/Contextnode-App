"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Play, Search, X, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { CradleText } from "@/components/ui/CradleText";

// Lazy load WebGL glitch to prevent SSR/hydration blocking on page refresh
const LetterGlitch = dynamic(() => import("@/components/ui/LetterGlitch"), {
  ssr: false,
});

export function Hero() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Global shortcut: Cmd+K or Ctrl+K to immediately focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleWatchDemo = () => {
    const section =
      document.getElementById("trending-assets") ||
      document.querySelector("section:nth-of-type(2)");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push("/context-packs");
    }
  };

  return (
    <section className="relative min-h-[calc(100vh-3.5rem)] flex flex-col justify-start items-center overflow-hidden pt-0 pb-16 bg-[#05060A]">
      {/* Background Interactive Cyber Letter Glitch on Pure Solid #05060A */}
      <div className="absolute inset-0 z-0 bg-[#05060A]">
        <LetterGlitch
          glitchColors={["#FE7F2D", "#FFA05C", "#FFFFFF", "#38BDF8", "#F59E0B"]}
          baseColor="#25343F"
          baseOpacity={0.28}
          density={0.75}
          fontSize={15}
          spacing={0.58}
          glitchAmount={0.38}
          speed={0.95}
          flow={0.45}
          centerFade={0}
          edgeFade={0}
          cursorRadius={170}
          clickEffect="burst"
          characters="01{}[]<>=/*+-_~^;:!@#$%&?CONTEXTNODEAI"
          backgroundColor="#05060A"
          dpr={1}
          intro={false}
          smooth={true}
          interactive={true}
        />
      </div>

      <div className="relative z-10 w-full px-4 sm:px-6 flex flex-col items-center text-center pt-0">
        {/* Interactive Cradle Text Headline - Attached flush to the top border */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.05, ease: "easeOut" }}
          className="w-full flex justify-center mb-6 sm:mb-8 mt-0"
        >
          <CradleText
            text="Context-Node"
            bounce={0.97}
            intro={true}
            className="text-white font-bold text-[clamp(2.75rem,8.5vw,6.75rem)]"
          />
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          className="text-lg md:text-xl text-slate-400 max-w-3xl mb-10 leading-relaxed font-normal"
        >
          Explore prompts, workflows, and production-grade Context Packs for creators and developers. Stop prompting from scratch.
        </motion.p>

        {/* Large Interactive Search Bar */}
        <motion.form
          onSubmit={handleSearchSubmit}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25, ease: "easeOut" }}
          className="w-full max-w-3xl mb-4 relative group"
        >
          <div className="absolute -inset-0.5 bg-[#25343F]/60 rounded-2xl blur-xs opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition duration-300 pointer-events-none" />

          <div className="relative flex items-center w-full bg-[#05060A]/90 backdrop-blur-md rounded-2xl p-1.5 border border-[#25343F] shadow-2xl transition-all focus-within:border-[#FE7F2D]/80 focus-within:ring-2 focus-within:ring-[#FE7F2D]/20">
            <div className="pl-4 pr-3 text-slate-400">
              <Search className="w-5 h-5 text-slate-400 group-focus-within:text-[#FE7F2D] transition-colors" />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search prompts, context packs, workflows... (Press ⌘K)"
              className="flex-1 bg-transparent border-none text-white placeholder:text-slate-500 outline-hidden py-3 text-base sm:text-lg min-w-0"
            />

            {/* Clear Button if query is present */}
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  searchInputRef.current?.focus();
                }}
                className="p-1 mr-1 text-slate-400 hover:text-white transition-colors cursor-pointer rounded-md hover:bg-[#25343F]/50"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={() => searchInputRef.current?.focus()}
              className="pr-3 hidden sm:flex items-center gap-1.5 cursor-pointer"
            >
              <div className="flex items-center justify-center px-2 h-7 rounded-md bg-[#25343F]/70 border border-[#25343F] text-[11px] font-mono text-slate-300 shadow-inner group-focus-within:border-[#FE7F2D]/40 group-focus-within:text-white transition-colors">
                ⌘K
              </div>
            </button>
          </div>
        </motion.form>

        {/* Quick Suggestion Chips */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35, ease: "easeOut" }}
          className="flex flex-wrap items-center justify-center gap-2 mb-8 text-xs text-slate-400"
        >
          <span className="flex items-center gap-1.5 text-slate-500 font-medium select-none">
            <Sparkles className="w-3.5 h-3.5 text-[#FE7F2D]" />
            Trending:
          </span>
          {["Claude 3.7", "Next.js 15", "Agent Workflows", "Cursor Rules", "v0 System"].map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => router.push(`/search?q=${encodeURIComponent(tag)}`)}
              className="px-2.5 py-1 rounded-lg bg-[#25343F]/40 border border-[#25343F]/80 text-slate-300 hover:text-white hover:border-[#FE7F2D]/50 hover:bg-[#25343F]/80 transition-all text-[11px] cursor-pointer active:scale-95"
            >
              {tag}
            </button>
          ))}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center w-full sm:w-auto gap-3.5 px-4 sm:px-0"
        >
          <Link
            href="/prompts"
            className={cn(
              "w-full sm:w-auto px-7 py-3 rounded-xl font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2",
              "bg-[#FE7F2D] text-slate-950 hover:bg-[#FE7F2D]/90 sm:hover:scale-[1.03] active:scale-[0.98] text-center shadow-lg shadow-[#FE7F2D]/25"
            )}
          >
            Explore Creative Prompts
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/context-packs"
            className={cn(
              "w-full sm:w-auto px-7 py-3 rounded-xl font-semibold text-sm sm:text-base transition-all flex items-center justify-center gap-2",
              "bg-[#25343F] text-white border border-[#25343F] hover:bg-[#25343F]/80 hover:border-[#FE7F2D]/40 sm:hover:scale-[1.03] active:scale-[0.98] text-center shadow-md"
            )}
          >
            Developer
          </Link>
          <button
            type="button"
            onClick={handleWatchDemo}
            className={cn(
              "w-full sm:w-auto px-7 py-3 rounded-xl font-semibold text-sm sm:text-base transition-all flex items-center justify-center gap-2 cursor-pointer",
              "bg-[#25343F]/40 border border-[#25343F] text-slate-300 hover:text-white hover:bg-[#25343F]/70 sm:hover:scale-[1.03] active:scale-[0.98]"
            )}
          >
            <Play className="w-3.5 h-3.5 fill-current text-[#FE7F2D]" />
            Watch Demo
          </button>
        </motion.div>
      </div>
    </section>
  );
}
