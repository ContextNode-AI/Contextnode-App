"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Download, 
  Copy, 
  Check,
  Filter, 
  Folder, 
  Cpu, 
  Sparkles, 
  BookOpen, 
  Star, 
  Terminal,
  Code2,
  Lock,
  Workflow,
  Database
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { CONTEXT_PACKS, DEV_PROMPTS, ContextPack, DevPrompt } from "@/lib/data";

const CONTEXT_CATEGORIES = ["All", "Coding", "Design", "Database", "AI Engine", "Creative"];
const PROMPT_CATEGORIES = ["All", "TypeScript", "React / Next", "CSS / Styling", "Database", "Systems", "AI Engine"];

function CardPreviewContent({ slug }: { slug: string }) {
  // Renders a high-fidelity stylized mockup inside the tilted window frame
  return (
    <div className="w-full h-full bg-[#0a0a0a] rounded-t-lg border-t border-x border-white/10 p-3 select-none flex flex-col gap-2 font-mono text-[8px] text-white/70 overflow-hidden relative">
      
      {/* Dynamic Background Glow */}
      <div className="absolute -top-10 -left-10 w-24 h-24 rounded-full bg-white/[0.02] blur-xl pointer-events-none" />

      {/* Render custom Vercel template style mockups based on slug */}
      {slug === "nextjs-15-app-router" && (
        <div className="flex flex-col gap-1.5 h-full">
          {/* Mock Browser Header */}
          <div className="flex items-center justify-between border-b border-white/5 pb-1 opacity-60">
            <span className="text-[7px]">nextjs-15-app</span>
            <span className="px-1 bg-white/5 rounded text-[6px]">main</span>
          </div>
          {/* Main Visual: Stylized Next.js Logo */}
          <div className="flex-1 flex items-center justify-center relative">
            <div className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-full border border-white/10 relative">
              <svg viewBox="0 0 75 65" fill="none" className="w-5 h-5 text-white">
                <path d="M37.5 0L75 65H0L37.5 0Z" fill="currentColor"/>
              </svg>
            </div>
            {/* Mock layout code tree */}
            <div className="absolute right-0 top-1 text-[6px] opacity-40 flex flex-col gap-0.5">
              <span>layout.tsx</span>
              <span className="text-red-400">page.tsx</span>
              <span>route.ts</span>
            </div>
          </div>
        </div>
      )}

      {slug === "tailwind-css-v4-reference" && (
        <div className="flex flex-col gap-2 h-full">
          <div className="flex items-center justify-between border-b border-white/5 pb-1 opacity-60">
            <span className="text-[7px]">tailwind-v4</span>
            <span className="text-cyan-400 text-[6px]">config</span>
          </div>
          {/* Color Palettes Grid */}
          <div className="grid grid-cols-4 gap-1 flex-1 py-1">
            <div className="bg-cyan-500/20 border border-cyan-500/30 rounded h-6 flex items-end p-1 text-[6px] text-cyan-300">cyan</div>
            <div className="bg-violet-500/20 border border-violet-500/30 rounded h-6 flex items-end p-1 text-[6px] text-violet-300">violet</div>
            <div className="bg-rose-500/20 border border-rose-500/30 rounded h-6 flex items-end p-1 text-[6px] text-rose-300">rose</div>
            <div className="bg-amber-500/20 border border-amber-500/30 rounded h-6 flex items-end p-1 text-[6px] text-amber-300">amber</div>
          </div>
        </div>
      )}

      {slug === "prisma-schema-postgres-optimization" && (
        <div className="flex flex-col gap-1.5 h-full">
          <div className="flex items-center justify-between border-b border-white/5 pb-1 opacity-60">
            <span className="text-[7px]">schema.prisma</span>
            <Database className="w-2.5 h-2.5 text-violet-400" />
          </div>
          {/* Relational model layout */}
          <div className="flex items-center justify-between gap-1 flex-1">
            <div className="bg-white/5 border border-white/10 rounded p-1.5 flex-1 flex flex-col gap-0.5 text-[6px] scale-95">
              <span className="text-violet-400 font-bold">User</span>
              <span>id Int @id</span>
              <span>email String</span>
            </div>
            <div className="w-4 h-[1px] border-t border-dashed border-white/20" />
            <div className="bg-white/5 border border-white/10 rounded p-1.5 flex-1 flex flex-col gap-0.5 text-[6px] scale-95">
              <span className="text-violet-400 font-bold">Post</span>
              <span>id Int @id</span>
              <span>userId Int</span>
            </div>
          </div>
        </div>
      )}

      {slug === "fastapi-pydantic-v2-patterns" && (
        <div className="flex flex-col gap-1 h-full">
          <div className="flex items-center justify-between border-b border-white/5 pb-1 opacity-60">
            <span className="text-[7px]">FastAPI Docs</span>
            <span className="text-emerald-400 text-[6px]">v2.0</span>
          </div>
          {/* Swagger layout */}
          <div className="flex flex-col gap-1 py-1">
            <div className="flex items-center justify-between bg-emerald-950/20 border border-emerald-500/20 rounded px-1.5 py-1 text-[6px]">
              <span className="text-emerald-400 font-bold">GET</span>
              <span className="text-white/50">/api/v1/health</span>
              <span className="text-emerald-400">200 OK</span>
            </div>
            <div className="flex items-center justify-between bg-blue-950/20 border border-blue-500/20 rounded px-1.5 py-1 text-[6px]">
              <span className="text-blue-400 font-bold">POST</span>
              <span className="text-white/50">/api/v1/login</span>
              <span className="text-blue-400">201</span>
            </div>
          </div>
        </div>
      )}

      {slug === "framer-motion-animation-maps" && (
        <div className="flex flex-col gap-1.5 h-full">
          <div className="flex items-center justify-between border-b border-white/5 pb-1 opacity-60">
            <span className="text-[7px]">motion.div</span>
            <span className="text-pink-400 text-[6px]">spring</span>
          </div>
          {/* Bezier curve chart */}
          <div className="flex-1 flex items-center justify-center relative">
            <svg viewBox="0 0 100 40" fill="none" className="w-full h-10 text-pink-500/80">
              <path d="M10 30 C 35 30, 45 10, 90 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="10" cy="30" r="2.5" fill="currentColor" />
              <circle cx="90" cy="10" r="2.5" fill="currentColor" />
            </svg>
            <div className="absolute bottom-0 right-0 text-[5px] text-white/30">stiffness: 300</div>
          </div>
        </div>
      )}

      {slug === "langchain-ai-agentic-loops" && (
        <div className="flex flex-col gap-1.5 h-full">
          <div className="flex items-center justify-between border-b border-white/5 pb-1 opacity-60">
            <span className="text-[7px]">Agent Loop</span>
            <Workflow className="w-2.5 h-2.5 text-orange-400" />
          </div>
          {/* Nodes */}
          <div className="flex items-center justify-center gap-2 flex-1">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex flex-col items-center justify-center text-orange-400 scale-90">
              <span className="text-[6px]">LLM</span>
            </div>
            <span className="opacity-40">→</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex flex-col items-center justify-center text-amber-400 scale-90">
              <span className="text-[6px]">Tool</span>
            </div>
          </div>
        </div>
      )}

      {/* Developer Prompts */}
      {slug === "typescript-type-wizard" && (
        <div className="flex flex-col gap-1 h-full">
          <div className="flex items-center justify-between border-b border-white/5 pb-1 opacity-60">
            <span className="text-[7px]">TS Parser</span>
            <span className="text-blue-400 text-[6px]">strictly-typed</span>
          </div>
          <div className="flex-1 flex flex-col gap-0.5 py-1 text-[6px]">
            <div className="text-blue-400">type APIRes&lt;T&gt; = &#123;</div>
            <div className="text-white/40 pl-2">data: T;</div>
            <div className="text-white/40 pl-2">status: 200 | 500;</div>
            <div className="text-blue-400">&#125;;</div>
          </div>
        </div>
      )}

      {slug === "nextjs-server-action-handler" && (
        <div className="flex flex-col gap-1 h-full">
          <div className="flex items-center justify-between border-b border-white/5 pb-1 opacity-60">
            <span className="text-[7px]">Server Action</span>
            <Lock className="w-2.5 h-2.5 text-red-400" />
          </div>
          <div className="flex-1 flex flex-col gap-0.5 py-1 text-[6px]">
            <div className="text-red-400">"use server";</div>
            <div className="text-white/60">export async function update() &#123;</div>
            <div className="text-white/40 pl-2">const user = await getSession();</div>
            <div className="text-white/60">&#125;</div>
          </div>
        </div>
      )}

      {slug === "postgresql-query-optimizer" && (
        <div className="flex flex-col gap-1.5 h-full">
          <div className="flex items-center justify-between border-b border-white/5 pb-1 opacity-60">
            <span className="text-[7px]">SQL Optimize</span>
            <span className="text-emerald-400 text-[6px]">20x Faster</span>
          </div>
          <div className="flex flex-col gap-1 py-1 text-[5px]">
            <div className="flex justify-between items-center text-red-400/80">
              <span>Seq Scan (Raw)</span>
              <span>124ms</span>
            </div>
            <div className="flex justify-between items-center text-emerald-400">
              <span>Index Scan (Opt)</span>
              <span>0.8ms</span>
            </div>
          </div>
        </div>
      )}

      {slug === "tailwind-v4-ui-generator" && (
        <div className="flex flex-col gap-1.5 h-full">
          <div className="flex items-center justify-between border-b border-white/5 pb-1 opacity-60">
            <span className="text-[7px]">Flex Grid wireframe</span>
            <span className="text-sky-400 text-[6px]">Tailwind v4</span>
          </div>
          <div className="grid grid-cols-3 gap-1 flex-1 py-1">
            <div className="col-span-2 h-4 bg-white/5 border border-white/10 rounded flex items-center justify-center text-[5px] text-white/30">flex-1</div>
            <div className="col-span-1 h-4 bg-white/5 border border-white/10 rounded flex items-center justify-center text-[5px] text-white/30">w-10</div>
          </div>
        </div>
      )}

      {slug === "rust-concurrency-wrapper" && (
        <div className="flex flex-col gap-1 h-full">
          <div className="flex items-center justify-between border-b border-white/5 pb-1 opacity-60">
            <span className="text-[7px]">Cargo Run</span>
            <span className="text-orange-400 text-[6px]">safe</span>
          </div>
          <div className="flex-1 flex flex-col gap-0.5 py-1 text-[6px]">
            <div className="text-orange-400">cargo build --release</div>
            <div className="text-emerald-400">Finished release [optimized]</div>
          </div>
        </div>
      )}

      {slug === "ai-tool-calling-schema" && (
        <div className="flex flex-col gap-1 h-full">
          <div className="flex items-center justify-between border-b border-white/5 pb-1 opacity-60">
            <span className="text-[7px]">JSON Spec</span>
            <span className="text-amber-400 text-[6px]">functions</span>
          </div>
          <div className="flex-1 flex flex-col gap-0.5 py-1 text-[6px] text-amber-300/80">
            <div>&#123;</div>
            <div className="pl-2">"name": "fetch_agent",</div>
            <div className="pl-2">"type": "function"</div>
            <div>&#125;</div>
          </div>
        </div>
      )}

    </div>
  );
}

export default function ContextPacksPage() {
  const [activeTab, setActiveTab] = useState<"packs" | "prompts">("packs");
  const [contextCategory, setContextCategory] = useState("All");
  const [promptCategory, setPromptCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<number | null>(null);

  // Handle Tab Switch (reset search & categories)
  const handleTabChange = (tab: "packs" | "prompts") => {
    setActiveTab(tab);
    setSearchQuery("");
    setContextCategory("All");
    setPromptCategory("All");
  };

  // Copy to clipboard helper
  const handleCopy = (id: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filter Logic for Context Packs
  const filteredPacks = CONTEXT_PACKS.filter((pack) => {
    const matchesCategory = contextCategory === "All" || pack.category === contextCategory;
    const matchesSearch = 
      pack.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      pack.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pack.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Filter Logic for Developer Prompts
  const filteredPrompts = DEV_PROMPTS.filter((prompt) => {
    const matchesCategory = promptCategory === "All" || prompt.category === promptCategory;
    const matchesSearch = 
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      prompt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.promptText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.targetModel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const activeCategories = activeTab === "packs" ? CONTEXT_CATEGORIES : PROMPT_CATEGORIES;
  const currentCategory = activeTab === "packs" ? contextCategory : promptCategory;
  const setCurrentCategory = activeTab === "packs" ? setContextCategory : setPromptCategory;

  return (
    <div className="min-h-screen bg-[#05060A] pt-8 pb-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 grid-background opacity-20 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-red-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[800px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full px-4 sm:px-6 relative z-10">
        
        {/* Header Section with Tab Switcher */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-white/5 pb-5">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-white">
              Templates & Prompts
            </h1>
          </div>

          {/* Vercel-like Switcher Tab */}
          <div className="flex p-0.5 bg-white/5 border border-white/10 rounded-lg relative overflow-hidden self-start">
            <button
              onClick={() => handleTabChange("packs")}
              className={cn(
                "relative z-10 px-3.5 py-1.5 rounded-md text-xs font-medium transition-all duration-300 flex items-center gap-1.5",
                activeTab === "packs" ? "text-black" : "text-muted-foreground hover:text-white"
              )}
            >
              <Folder className="w-3.5 h-3.5" />
              Context Packs
              {activeTab === "packs" && (
                <motion.div
                  layoutId="activeTabBackground"
                  className="absolute inset-0 bg-white rounded-md -z-10"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
            <button
              onClick={() => handleTabChange("prompts")}
              className={cn(
                "relative z-10 px-3.5 py-1.5 rounded-md text-xs font-medium transition-all duration-300 flex items-center gap-1.5",
                activeTab === "prompts" ? "text-black" : "text-muted-foreground hover:text-white"
              )}
            >
              <Terminal className="w-3.5 h-3.5" />
              Dev Prompts
              {activeTab === "prompts" && (
                <motion.div
                  layoutId="activeTabBackground"
                  className="absolute inset-0 bg-white rounded-md -z-10"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          </div>
        </div>

        {/* Sidebar & Grid Content */}
        <div className="flex flex-col md:flex-row gap-10">
          
          {/* Left Sidebar (Filters) */}
          <aside className="w-full md:w-64 flex-shrink-0 flex flex-col gap-8 md:sticky md:top-32 h-fit">
            
            {/* Search Box */}
            <div className="flex flex-col gap-2">
              <div className="text-xs font-semibold text-white/50 uppercase tracking-wider px-1">
                Filter Search
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-white transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder={activeTab === "packs" ? "Search context packs..." : "Search dev prompts..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-white/30 focus:bg-white/10 transition-all"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-white/50 uppercase tracking-wider px-1">
                <Filter className="w-3.5 h-3.5" />
                Category
              </div>
              
              <div className="flex md:flex-col overflow-x-auto md:overflow-visible pb-4 md:pb-0 gap-1.5 snap-x hide-scrollbar">
                {activeCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setCurrentCategory(category)}
                    className={cn(
                      "snap-start whitespace-nowrap text-left px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 border border-transparent",
                      currentCategory === category
                        ? "bg-white/10 text-white border-white/10 font-semibold shadow-sm"
                        : "text-muted-foreground hover:bg-white/5 hover:text-white"
                    )}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Hub Quick Stats */}
            <div className="border border-white/5 bg-white/[0.01] rounded-2xl p-4 hidden md:flex flex-col gap-4">
              <div className="text-xs font-semibold text-white/50 uppercase tracking-wider">
                Registry Stats
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Context Packs:</span>
                  <span className="text-white font-medium">{CONTEXT_PACKS.length}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">System Prompts:</span>
                  <span className="text-white font-medium">{DEV_PROMPTS.length}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Active Clones:</span>
                  <span className="text-white font-medium">82.4k+</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Right Main Grid (Vercel Template Style Grid) */}
          <main className="flex-1">
            <AnimatePresence mode="wait">
              {activeTab === "packs" ? (
                // ---------------- CONTEXT PACKS GRID ----------------
                <motion.div
                  key="packs-grid"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {filteredPacks.length === 0 ? (
                    <div className="col-span-full py-20 flex flex-col items-center justify-center text-center border border-white/5 rounded-2xl bg-white/[0.02]">
                      <Folder className="w-12 h-12 text-white/10 mb-4" />
                      <h3 className="text-lg font-semibold text-white mb-1">No templates found</h3>
                      <p className="text-muted-foreground text-sm max-w-xs">Adjust your search parameters or category filter and try again.</p>
                    </div>
                  ) : (
                    filteredPacks.map((pack) => (
                      <Link
                        key={pack.id}
                        href={`/context-packs/${pack.slug}`}
                        className="group flex flex-col bg-[#080808] border border-white/10 hover:border-white/20 rounded-xl overflow-hidden hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-all duration-300 min-h-[350px] justify-between relative cursor-pointer"
                      >
                        {/* Title and description AT THE TOP */}
                        <div className="p-5 flex-1 flex flex-col pb-2">
                          <div className="flex items-center justify-between mb-3.5">
                            <span className="px-2 py-0.5 bg-white/5 border border-white/10 text-white/60 rounded-full text-[9px] font-medium uppercase tracking-wider">
                              {pack.category}
                            </span>
                            <div className="flex items-center gap-1 text-amber-400 text-[10px] font-semibold">
                              <Star className="w-3 h-3 fill-current" />
                              <span>{pack.rating}</span>
                            </div>
                          </div>

                          <h3 className="text-sm font-semibold text-white mb-2 group-hover:text-white transition-colors line-clamp-1">
                            {pack.title}
                          </h3>

                          <p className="text-muted-foreground text-[11px] leading-relaxed mb-4 line-clamp-2">
                            {pack.description}
                          </p>

                          <div className="flex items-center gap-3 text-[10px] text-white/30 mt-auto">
                            <div className="flex items-center gap-1 font-mono">
                              <BookOpen className="w-2.5 h-2.5" />
                              <span>{pack.filesCount} files</span>
                            </div>
                            <div className="flex items-center gap-1 font-mono">
                              <Cpu className="w-2.5 h-2.5" />
                              <span>{pack.tokensCount} tokens</span>
                            </div>
                          </div>
                        </div>

                        {/* Interactive Dynamic Tilted Preview AT THE BOTTOM */}
                        <div className="relative h-36 w-full overflow-hidden border-t border-white/5 bg-[#040404] flex items-end justify-center pt-2">
                          <div className="w-[88%] h-[92%] bg-zinc-900 border border-white/10 rounded-t-lg origin-bottom-right transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-[1.03] overflow-hidden"
                               style={{ transform: "perspective(800px) rotateX(12deg) rotateY(-10deg) rotateZ(3deg) translateY(12px) translateX(6px)" }}>
                            <CardPreviewContent slug={pack.slug} />
                          </div>

                          {/* Hover action overlay button */}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-xs">
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-black bg-white px-4 py-2 rounded-lg shadow-lg transition-transform duration-300 scale-90 group-hover:scale-100">
                              <BookOpen className="w-3.5 h-3.5" />
                              <span>View Template</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))
                  )}
                </motion.div>
              ) : (
                // ---------------- DEVELOPER PROMPTS GRID ----------------
                <motion.div
                  key="prompts-grid"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {filteredPrompts.length === 0 ? (
                    <div className="col-span-full py-20 flex flex-col items-center justify-center text-center border border-white/5 rounded-2xl bg-white/[0.02]">
                      <Terminal className="w-12 h-12 text-white/10 mb-4" />
                      <h3 className="text-lg font-semibold text-white mb-1">No prompts found</h3>
                      <p className="text-muted-foreground text-sm max-w-xs">We couldn't find any system instructions or prompts matching your parameters.</p>
                    </div>
                  ) : (
                    filteredPrompts.map((prompt) => (
                      <div
                        key={prompt.id}
                        className="group flex flex-col bg-[#080808] border border-white/10 hover:border-white/20 rounded-xl overflow-hidden hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-all duration-300 min-h-[350px] justify-between relative"
                      >
                        {/* Title and description AT THE TOP */}
                        <div className="p-5 flex-1 flex flex-col pb-2">
                          <div className="flex items-center justify-between mb-3.5">
                            <span className="px-2 py-0.5 bg-white/5 border border-white/10 text-white/60 rounded-full text-[9px] font-medium uppercase tracking-wider">
                              {prompt.category}
                            </span>
                            <span className="px-2 py-0.5 bg-red-950/40 border border-red-500/20 text-red-300 rounded-full text-[9px] font-semibold">
                              {prompt.targetModel}
                            </span>
                          </div>

                          <h3 className="text-sm font-semibold text-white mb-2 group-hover:text-white transition-colors line-clamp-1">
                            {prompt.title}
                          </h3>

                          <p className="text-muted-foreground text-[11px] leading-relaxed mb-4 line-clamp-2">
                            {prompt.description}
                          </p>

                          <div className="text-[10px] text-white/30 mt-auto font-mono">
                            By {prompt.author}
                          </div>
                        </div>

                        {/* Interactive Dynamic Tilted Preview AT THE BOTTOM */}
                        <div className="relative h-36 w-full overflow-hidden border-t border-white/5 bg-[#040404] flex items-end justify-center pt-2">
                          <div className="w-[88%] h-[92%] bg-zinc-900 border border-white/10 rounded-t-lg origin-bottom-right transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-[1.03] overflow-hidden"
                               style={{ transform: "perspective(800px) rotateX(12deg) rotateY(-10deg) rotateZ(3deg) translateY(12px) translateX(6px)" }}>
                            <CardPreviewContent slug={prompt.slug} />
                          </div>

                          {/* Hover action overlay button */}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-xs">
                            <button
                              onClick={() => handleCopy(prompt.id, prompt.promptText)}
                              className={cn(
                                "flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg shadow-lg transition-transform duration-300 scale-90 group-hover:scale-100 border",
                                copiedId === prompt.id
                                  ? "bg-emerald-500 text-black border-emerald-500"
                                  : "text-black bg-white hover:bg-neutral-200 border-white"
                              )}
                            >
                              {copiedId === prompt.id ? (
                                <>
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>Copy Prompt</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </main>

        </div>

      </div>
    </div>
  );
}
