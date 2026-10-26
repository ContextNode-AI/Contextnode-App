"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Code, Terminal, Sparkles, Filter, Paintbrush } from "lucide-react";
import { Footer } from "@/components/footer/Footer";

const MOCK_DATA = [
  {
    id: 1,
    type: "context_pack",
    category: "development",
    title: "Next.js SaaS Starter Kit",
    description: "Complete architecture with auth, database, and billing components.",
    tags: ["Next.js", "React", "Stripe"],
    author: "Alex R.",
    downloads: "2.4k"
  },
  {
    id: 2,
    type: "prompt",
    category: "creative",
    title: "Cinematic Product Photography",
    description: "Midjourney prompt for ultra-realistic studio lighting on electronics.",
    tags: ["MidjourneyV6", "Design", "Product"],
    author: "Sarah C.",
    downloads: "8.1k"
  },
  {
    id: 3,
    type: "context_pack",
    category: "development",
    title: "AI Agent Backend Flow",
    description: "FastAPI infrastructure for autonomous agent swarms with memory.",
    tags: ["Python", "FastAPI", "AI"],
    author: "David M.",
    downloads: "1.2k"
  },
  {
    id: 4,
    type: "prompt",
    category: "development",
    title: "Senior Code Review Assistant",
    description: "Claude prompt to act as a senior staff engineer reviewing PRs.",
    tags: ["Claude3.5", "DevOps"],
    author: "Elena V.",
    downloads: "4.5k"
  },
  {
    id: 5,
    type: "context_pack",
    category: "development",
    title: "E-Commerce Microservices",
    description: "Go-based microservices for inventory, cart, and checkout.",
    tags: ["Go", "Docker", "PostgreSQL"],
    author: "Tom H.",
    downloads: "890"
  },
  {
    id: 6,
    type: "prompt",
    category: "creative",
    title: "Anime Style Character Sheet",
    description: "Niji Journey prompt for consistent character design reference sheets.",
    tags: ["NijiV6", "Anime", "Art"],
    author: "Yuki S.",
    downloads: "12k"
  }
];

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeView, setActiveView] = useState<"all" | "creative" | "development">("all");

  const filteredData = MOCK_DATA.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (activeView === "all") return matchesSearch;
    return matchesSearch && item.category === activeView;
  });

  const creativeResults = filteredData.filter(item => item.category === "creative");
  const developmentResults = filteredData.filter(item => item.category === "development");

  const renderGrid = (items: typeof MOCK_DATA) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <AnimatePresence mode="popLayout">
        {items.map((item) => (
          <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            key={item.id}
            className="group relative bg-[#0B0B0F]/60 backdrop-blur-sm border border-white/5 p-6 rounded-2xl hover:border-white/15 transition-colors flex flex-col justify-between"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />

            <div>
              <div className="flex justify-between items-start mb-4">
                <span className={`text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-md border ${
                  item.type === "context_pack" 
                    ? "bg-blue-500/10 text-blue-400 border-blue-500/20" 
                    : "bg-purple-500/10 text-purple-400 border-purple-500/20"
                }`}>
                  {item.type === "context_pack" ? "Context Pack" : "Prompt"}
                </span>
                {item.category === "creative" ? (
                  <Sparkles className="w-5 h-5 text-muted-foreground group-hover:text-white transition-colors" />
                ) : (
                  <Code className="w-5 h-5 text-muted-foreground group-hover:text-white transition-colors" />
                )}
              </div>

              <h3 className="text-lg font-bold text-white mb-2 leading-tight">
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-6 line-clamp-2 leading-relaxed">
                {item.description}
              </p>
            </div>

            <div>
              <div className="flex flex-wrap gap-2 mb-4">
                {item.tags.map((tag) => (
                  <span key={tag} className="text-[11px] font-medium bg-white/5 border border-white/5 text-white/70 px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-white/5">
                <span className="flex items-center gap-1">
                  By <strong className="text-white/80">{item.author}</strong>
                </span>
                <span className="font-mono">
                  {item.downloads} ↓
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#05060A]">
      <main className="flex-1 relative pt-8 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 grid-background opacity-30 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none opacity-50" />

        <div className="container max-w-5xl mx-auto relative z-10">
          
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
              Explore ContextNode
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Discover AI assets across two major domains: Creative design and Software development.
            </p>
          </div>

          <div className="relative max-w-3xl mx-auto mb-10 group">
            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
              <Search className="w-6 h-6 text-muted-foreground group-focus-within:text-white transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search across all creative and development assets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0B0B0F]/80 backdrop-blur-xl border border-white/10 rounded-2xl py-6 pl-16 pr-6 text-lg text-white placeholder:text-muted-foreground focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 shadow-[0_0_30px_rgba(255,255,255,0.02)] transition-all"
            />
          </div>

          <div className="flex justify-center gap-2 md:gap-4 mb-16">
            {[
              { id: "all", label: "All Hub", icon: Search },
              { id: "creative", label: "AI Creative", icon: Paintbrush },
              { id: "development", label: "AI Development", icon: Terminal }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id as any)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeView === tab.id
                    ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                    : "bg-white/5 border border-white/5 text-muted-foreground hover:bg-white/10 hover:text-white"
                }`}
              >
                <tab.icon className={`w-4 h-4 ${activeView === tab.id ? "text-black" : "text-current"}`} />
                {tab.label}
              </button>
            ))}
          </div>

          {filteredData.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-20 flex flex-col items-center justify-center text-center"
            >
              <Filter className="w-12 h-12 text-white/10 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No results found</h3>
              <p className="text-muted-foreground">Try adjusting your search query.</p>
            </motion.div>
          ) : (
            <div className="space-y-20">
              {(activeView === "all" || activeView === "creative") && creativeResults.length > 0 && (
                <section>
                  <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/5">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                       <Paintbrush className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">AI Creative</h2>
                      <p className="text-sm text-muted-foreground">Premium prompts for Midjourney, Niji, and DALL-E.</p>
                    </div>
                  </div>
                  {renderGrid(creativeResults)}
                </section>
              )}

              {(activeView === "all" || activeView === "development") && developmentResults.length > 0 && (
                <section>
                  <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/5">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                       <Terminal className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">AI Development</h2>
                      <p className="text-sm text-muted-foreground">Production-ready Context Packs and code-generation prompts.</p>
                    </div>
                  </div>
                  {renderGrid(developmentResults)}
                </section>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
