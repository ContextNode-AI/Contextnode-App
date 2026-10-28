"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Copy, ArrowUpRight, Filter } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { PROMPTS, type Prompt } from "@/lib/data";
import { getPublishedPrompts } from "@/lib/promptsApi";

const DEFAULT_CATEGORIES = [
  "All",
  "Photography",
  "3D Render",
  "Illustration",
  "Cyberpunk",
  "Architecture",
  "Minimalist",
  "Cinematic"
];

export default function PromptsPage() {
  const [prompts, setPrompts] = useState<Prompt[]>(PROMPTS);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const livePrompts = await getPublishedPrompts();
        if (isMounted && livePrompts && livePrompts.length > 0) {
          setPrompts(livePrompts);
        }
      } catch (err) {
        console.error("Failed to load live prompts:", err);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const categories = useMemo(() => {
    const list = [...DEFAULT_CATEGORIES];
    prompts.forEach((p) => {
      if (p.category && !list.some((c) => c.toLowerCase() === p.category.toLowerCase())) {
        list.push(p.category);
      }
    });
    return list;
  }, [prompts]);

  const filteredPrompts = prompts.filter((prompt) => {
    const matchesCategory = activeCategory === "All" || prompt.category.toLowerCase() === activeCategory.toLowerCase();
    const matchesSearch = prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          prompt.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#05060A] pt-8 pb-20 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 grid-background opacity-20 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full px-4 sm:px-6 relative z-10 flex flex-col md:flex-row gap-10">
        
        {/* Left Sidebar (Filters & Search) */}
        <aside className="w-full md:w-64 flex-shrink-0 flex flex-col gap-8 md:sticky md:top-32 h-fit">
          
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">
              Discover Prompts
            </h1>
            <p className="text-muted-foreground text-sm">
              High-fidelity visual prompts curated for production use.
            </p>
          </div>

          {/* Search */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-white transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search prompts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-white/30 focus:bg-white/10 transition-all"
            />
          </div>

          {/* Categories */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-white/80 uppercase tracking-wider mb-1 px-1">
              <Filter className="w-4 h-4" />
              Categories
            </div>
            
            {/* Desktop: Vertical List, Mobile: Horizontal Scroll */}
            <div className="flex md:flex-col overflow-x-auto md:overflow-visible pb-4 md:pb-0 gap-2 snap-x hide-scrollbar">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={cn(
                    "snap-start whitespace-nowrap text-left px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border border-transparent",
                    activeCategory.toLowerCase() === category.toLowerCase()
                      ? "bg-white text-black border-white"
                      : "text-muted-foreground hover:bg-white/5 hover:text-white hover:border-white/10"
                  )}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Right Main Content (Masonry Gallery) */}
        <main className="flex-1">
          <AnimatePresence mode="popLayout">
            {filteredPrompts.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20 text-center border border-white/5 rounded-2xl bg-white/[0.02]"
              >
                <Search className="w-12 h-12 text-white/10 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No prompts found</h3>
                <p className="text-muted-foreground">Try adjusting your search or category filters.</p>
                <button 
                  onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
                  className="mt-6 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Clear all filters
                </button>
              </motion.div>
            ) : (
              <motion.div 
                layout
                className="columns-2 md:columns-3 gap-3 space-y-3 sm:gap-4 sm:space-y-4"
              >
                {filteredPrompts.map((prompt) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    key={prompt.id}
                    className="break-inside-avoid relative group rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer bg-white/5 border border-white/10"
                  >
                    <Link href={`/prompts/${prompt.slug}`} className="block relative w-full h-full">
                      {/* Image */}
                      <img
                        src={prompt.image}
                        alt={prompt.title}
                        className="w-full h-auto object-cover transition-transform duration-700 md:group-hover:scale-105"
                        loading="lazy"
                      />
                      
                      {/* Mobile: Persistent Overlay (Always visible on bottom) */}
                      <div className="md:hidden absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent pt-12 pb-3 px-3 flex flex-col justify-end">
                        <div className="flex items-center justify-between mb-1.5">
                          <h3 className="text-white font-medium text-sm line-clamp-1 pr-2">
                            {prompt.title}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-medium text-white shadow-sm border border-white/10">
                            <Copy className="w-3 h-3" />
                            <span>{prompt.copies}</span>
                          </div>
                        </div>
                      </div>

                      {/* Desktop: Hover Overlay */}
                      <div className="hidden md:flex absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-col justify-end p-5">
                        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-white font-semibold text-lg line-clamp-1 pr-2">
                              {prompt.title}
                            </h3>
                            <ArrowUpRight className="w-5 h-5 text-white/70 group-hover:text-white transition-colors flex-shrink-0" />
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-medium text-white shadow-sm border border-white/10">
                              <Copy className="w-3.5 h-3.5" />
                              <span>{prompt.copies} copies</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </main>

      </div>
    </div>
  );
}
