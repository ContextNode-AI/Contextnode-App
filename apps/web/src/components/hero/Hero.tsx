"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function Hero() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <section className="relative min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center overflow-hidden pt-12 pb-16 bg-[#05060A]">
      <div className="relative z-10 container max-w-5xl mx-auto px-6 flex flex-col items-center text-center mt-4">
        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]"
        >
          Discover AI Assets That <br className="hidden md:block" />
          Actually Build Things
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          className="text-lg md:text-xl text-slate-400 max-w-2xl mb-10 leading-relaxed"
        >
          Explore prompts, workflows, and production-grade Context Packs for creators and developers. Stop prompting from scratch.
        </motion.p>

        {/* Large Search Bar */}
        <motion.form
          onSubmit={handleSearchSubmit}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25, ease: "easeOut" }}
          className="w-full max-w-2xl mb-4 relative group"
        >
          <div className="absolute -inset-0.5 bg-[#25343F]/60 rounded-2xl blur-xs opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 group-focus-within:bg-[#FE7F2D]/20 transition duration-300" />
          
          <div className="relative flex items-center w-full bg-[#05060A]/90 backdrop-blur-md rounded-2xl p-1.5 border border-[#25343F] shadow-2xl transition-all focus-within:border-[#FE7F2D]/70 focus-within:ring-2 focus-within:ring-[#FE7F2D]/15">
            <div className="pl-4 pr-3 text-slate-400">
              <Search className="w-5 h-5 text-slate-400 group-focus-within:text-[#FE7F2D] transition-colors" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search prompts, context packs, workflows..."
              className="flex-1 bg-transparent border-none text-white placeholder:text-slate-500 outline-hidden py-3 text-base sm:text-lg min-w-0"
            />
            <div className="pr-3 hidden sm:flex items-center gap-1.5">
              <div className="flex items-center justify-center px-2 h-7 rounded-md bg-[#25343F]/60 border border-[#25343F] text-[11px] font-mono text-slate-300 shadow-inner">
                ⌘K
              </div>
            </div>
          </div>
        </motion.form>

        {/* Quick Suggestion Chips */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35, ease: "easeOut" }}
          className="flex flex-wrap items-center justify-center gap-2 mb-8 text-xs text-slate-400"
        >
          <span className="text-slate-500 font-medium">Trending:</span>
          {["Claude 3.7", "Next.js 15", "Agent Workflows", "Cursor Rules", "v0 System"].map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => router.push(`/search?q=${encodeURIComponent(tag)}`)}
              className="px-2.5 py-1 rounded-lg bg-[#25343F]/40 border border-[#25343F]/70 text-slate-300 hover:text-white hover:border-[#FE7F2D]/50 hover:bg-[#25343F]/80 transition-all text-[11px] cursor-pointer"
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
              "w-full sm:w-auto px-7 py-3 rounded-xl font-bold text-sm sm:text-base transition-all",
              "bg-[#FE7F2D] text-slate-950 hover:bg-[#FE7F2D]/90 sm:hover:scale-[1.03] active:scale-[0.98] text-center shadow-lg shadow-[#FE7F2D]/20"
            )}
          >
            Explore Creative Prompts
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
