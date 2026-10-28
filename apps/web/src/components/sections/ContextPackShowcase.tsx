"use client";

import { motion } from "framer-motion";
import { Clock, Layers, Code2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const PACKS = [
  {
    title: "SaaS Starter Kit",
    description: "Complete context for a modern SaaS architecture.",
    tags: ["Next.js", "Supabase", "Stripe"],
    codeSnippet: `/**\n * SYSTEM ARCHITECTURE CONTEXT\n * @stack Next.js 14 App Router, Supabase Auth/DB, Stripe Billing\n * @rules Strict TypeScript, Tailwind utility classes only\n */`,
    codeColor: "text-blue-400",
    time: "~2 hours",
    complexity: "Medium",
    ide: "Cursor/Copilot",
    glow: "hover:shadow-[0_0_40px_rgba(59,130,246,0.15)]",
    borderHover: "hover:border-blue-500/30",
  },
  {
    title: "AI Agent Backend",
    description: "Python backend architecture for autonomous agents.",
    tags: ["Python", "FastAPI", "LangChain"],
    codeSnippet: `"""\nAGENT ARCHITECTURE CONTEXT\nStack: FastAPI, LangChain, Pinecone, UX Pilot AI\nPattern: ReAct (Reason + Act) with Tool usage\n"""`,
    codeColor: "text-emerald-400",
    time: "~4 hours",
    complexity: "High",
    ide: "Cursor/Copilot",
    glow: "hover:shadow-[0_0_40px_rgba(16,185,129,0.15)]",
    borderHover: "hover:border-emerald-500/30",
  }
];

export function ContextPackShowcase() {
  return (
    <section className="relative py-24 bg-[#050505]">
      {/* Subtle grid background */}
      <div className="absolute inset-0 grid-background opacity-20 pointer-events-none" />

      <div className="w-full px-4 sm:px-6 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div className="flex flex-col gap-4 max-w-2xl">
            {/* Developer First Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex"
            >
              <span className="text-[10px] font-bold tracking-wider text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-md uppercase">
                Developer First
              </span>
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight"
            >
              Production Context Packs
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground text-lg"
            >
              Architectural foundations formatted specifically for AI consumption. Skip the boilerplate and start building features immediately.
            </motion.p>
          </div>

          {/* Filter Tabs */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex gap-2"
          >
            {["Frontend", "Backend", "Fullstack"].map((tab, idx) => (
              <button 
                key={tab}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-medium transition-colors border",
                  idx === 0 
                    ? "bg-white/10 text-white border-white/10" 
                    : "bg-transparent text-muted-foreground border-transparent hover:bg-white/5 hover:text-white"
                )}
              >
                {tab}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Divider */}
        <div className="w-full h-[1px] bg-white/5 mb-12" />

        {/* Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {PACKS.map((pack, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + idx * 0.1 }}
              key={idx}
              className={cn(
                "group relative p-6 sm:p-8 rounded-3xl border border-white/5 bg-[#0B0B0F]/80 backdrop-blur-xl flex flex-col transition-all duration-500 cursor-pointer",
                pack.glow,
                pack.borderHover
              )}
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">{pack.title}</h3>
                  <p className="text-sm text-muted-foreground">{pack.description}</p>
                </div>
                {/* Tech Stack Badges */}
                <div className="flex flex-wrap gap-2">
                  {pack.tags.map(tag => (
                    <span key={tag} className="text-xs font-mono text-muted-foreground bg-white/[0.03] border border-white/10 px-2 py-1 rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Code Snippet Area */}
              <div className="w-full bg-[#050505] rounded-xl border border-white/5 p-4 sm:p-6 mb-8 mt-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
                <pre className={cn("text-sm sm:text-base font-mono whitespace-pre-wrap leading-relaxed relative z-10", pack.codeColor)}>
                  {pack.codeSnippet}
                </pre>
              </div>

              {/* Card Footer */}
              <div className="mt-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-white/5">
                <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{pack.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4" />
                    <span>{pack.complexity}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4" />
                    <span>{pack.ide}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-white font-semibold text-sm group-hover:translate-x-1 transition-transform">
                  View Pack <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
