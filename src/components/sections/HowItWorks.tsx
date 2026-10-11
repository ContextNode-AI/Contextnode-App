"use client";

import { motion } from "framer-motion";
import { Search, Sparkles } from "lucide-react";

const STEPS = [
  {
    num: 1,
    title: "Discover AI assets",
    description: "Search our curated library of prompts, context packs, and workflows. Filter by model, stack, and complexity to find exactly what your project needs.",
    visual: (
      <div className="w-full bg-[#050505] rounded-xl border border-white/5 p-4 flex items-center gap-3 shadow-inner">
        <Search className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-mono text-muted-foreground">Next.js Auth Architecture...</span>
      </div>
    )
  },
  {
    num: 2,
    title: "Import into your workflow",
    description: "Copy context directly into Cursor, Copilot, or your preferred AI IDE. Use our CLI tool to pull complex packs straight into your repository.",
    visual: (
      <div className="w-full bg-[#050505] rounded-xl border border-white/5 p-5 font-mono text-sm flex flex-col gap-3 shadow-inner">
        <div className="flex items-center gap-2">
          <span className="text-emerald-500 font-bold">$</span>
          <span className="text-white/80">contextnode pull saas-starter-kit --target ./src</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground text-xs opacity-70">
          <span className="w-2 h-2 rounded-full bg-emerald-500/50 animate-pulse" />
          Importing context files...
        </div>
      </div>
    )
  },
  {
    num: 3,
    title: "Create faster with AI",
    description: "Let your AI assistant handle the heavy lifting with perfect context. Eliminate hallucinations and skip the boilerplate setup phase completely.",
    visual: (
      <div className="w-full bg-[#050505] rounded-xl border border-white/5 p-5 flex items-start gap-4 shadow-inner">
        <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
          <Sparkles className="w-4 h-4 text-blue-400" />
        </div>
        <div className="flex flex-col gap-3 w-full pt-1">
           <div className="h-1.5 w-3/4 bg-white/10 rounded-full" />
           <div className="h-1.5 w-full bg-white/10 rounded-full" />
           <div className="h-1.5 w-5/6 bg-white/10 rounded-full" />
           <div className="h-1.5 w-1/2 bg-blue-500/40 rounded-full mt-2" />
        </div>
      </div>
    )
  }
];

export function HowItWorks() {
  return (
    <section className="relative py-24 bg-[#050505] overflow-hidden">
      {/* Background Lighting */}
      <div className="absolute inset-0 grid-background opacity-20 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] ambient-glow-blue rounded-full blur-[120px] opacity-[0.03] pointer-events-none transform -translate-x-1/2 -translate-y-1/2" />

      <div className="container max-w-5xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col items-center mb-24 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6"
          >
            Build at the Speed of AI
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg"
          >
            From discovery to production in minutes, not days.
          </motion.p>
        </div>

        {/* Timeline Layout */}
        <div className="relative max-w-4xl mx-auto">
          {/* Vertical Glowing Line */}
          <div className="absolute left-6 md:left-10 top-4 bottom-12 w-[1px] bg-gradient-to-b from-blue-500/0 via-white/10 to-transparent" />

          <div className="flex flex-col gap-12 md:gap-16">
            {STEPS.map((step, idx) => (
              <div key={idx} className="relative flex flex-col md:flex-row gap-6 md:gap-12 pl-16 md:pl-28 items-start">
                
                {/* Timeline Node */}
                <motion.div 
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + idx * 0.1, type: "spring" }}
                  className="absolute left-0 md:left-4 top-0 w-12 h-12 rounded-full bg-[#0A0A0A] border border-white/10 flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.03)] z-10"
                >
                  <span className="font-bold text-lg text-white/90">{step.num}</span>
                </motion.div>

                {/* Content Card */}
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + idx * 0.1 }}
                  className="flex-1 w-full glass rounded-3xl p-6 md:p-10 border border-white/5 hover:border-white/10 transition-colors"
                >
                  <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
                  <p className="text-muted-foreground mb-8 text-base leading-relaxed">
                    {step.description}
                  </p>
                  
                  {/* Interface Visual */}
                  <div className="mt-auto">
                    {step.visual}
                  </div>
                </motion.div>

              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
