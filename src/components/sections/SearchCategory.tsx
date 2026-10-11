"use client";

import { motion } from "framer-motion";
import { Bot, Terminal, Code2, Package, Sparkles, Layers } from "lucide-react";

export function SearchCategory() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background Lighting */}
      <div className="absolute top-1/2 left-1/2 w-[800px] h-[400px] ambient-glow-blue rounded-[100%] blur-3xl opacity-20 pointer-events-none transform -translate-x-1/2 -translate-y-1/2" />
      
      <div className="container max-w-6xl mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center mb-16 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6"
          >
            Explore the Ecosystem
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg max-w-2xl"
          >
            Discover high-fidelity creative prompts and production-ready context packs designed to accelerate your AI workflow.
          </motion.p>
        </div>

        {/* Two Featured Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl mx-auto">
          
          {/* Creative Prompts Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="group relative overflow-hidden rounded-3xl border border-white/5 bg-[#0B0B0F]/80 backdrop-blur-xl p-8 hover:border-blue-500/30 transition-all duration-500 hover:shadow-[0_0_40px_rgba(59,130,246,0.1)] cursor-pointer flex flex-col"
          >
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[80px] group-hover:bg-blue-500/20 transition-colors pointer-events-none" />
            
            {/* Visual Area */}
            <div className="relative h-48 w-full mb-8 rounded-2xl overflow-hidden border border-white/5 bg-black/40">
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0F] via-transparent to-transparent z-10" />
              <div className="absolute inset-0 grid grid-cols-3 gap-3 p-3 opacity-60 transform -rotate-6 scale-125 group-hover:scale-110 group-hover:opacity-100 transition-all duration-700">
                <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format" alt="prompt1" className="rounded-xl object-cover h-32 w-full shadow-2xl" />
                <img src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=400&auto=format" alt="prompt2" className="rounded-xl object-cover h-40 w-full -translate-y-4 shadow-2xl" />
                <img src="https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=400&auto=format" alt="prompt3" className="rounded-xl object-cover h-32 w-full shadow-2xl" />
              </div>
            </div>

            <div className="relative z-10 flex flex-col flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                  <Sparkles className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">AI Creative Prompts</h3>
              </div>
              
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Masterpiece-level prompts for Midjourney, Veo, and DALL-E. Stop guessing and start generating with proven, high-fidelity instructions tailored for specific styles.
              </p>
              
              <div className="mt-auto flex flex-wrap gap-2">
                <span className="text-xs font-semibold text-blue-300 bg-blue-500/10 px-3 py-1.5 rounded-md border border-blue-500/20 uppercase tracking-wider">Image Gen</span>
                <span className="text-xs font-semibold text-purple-300 bg-purple-500/10 px-3 py-1.5 rounded-md border border-purple-500/20 uppercase tracking-wider">Video Gen</span>
                <span className="text-xs font-semibold text-pink-300 bg-pink-500/10 px-3 py-1.5 rounded-md border border-pink-500/20 uppercase tracking-wider">Stable Diffusion</span>
              </div>
            </div>
          </motion.div>

          {/* Context Packs Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="group relative overflow-hidden rounded-3xl border border-white/5 bg-[#0B0B0F]/80 backdrop-blur-xl p-8 hover:border-green-500/30 transition-all duration-500 hover:shadow-[0_0_40px_rgba(34,197,94,0.1)] cursor-pointer flex flex-col"
          >
             <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-green-500/10 rounded-full blur-[80px] group-hover:bg-green-500/20 transition-colors pointer-events-none" />
            
            {/* Visual Area */}
            <div className="relative h-48 w-full mb-8 rounded-2xl overflow-hidden border border-white/5 bg-black/40 flex items-center justify-center">
               <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0F] via-transparent to-transparent z-10" />
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:16px_16px] opacity-20" />
               
               <div className="relative z-0 w-3/4 bg-[#1E1E1E] rounded-xl border border-white/10 shadow-2xl overflow-hidden flex flex-col transform group-hover:-translate-y-2 group-hover:scale-105 transition-all duration-500">
                  <div className="h-8 bg-black/40 border-b border-white/5 flex items-center px-3 gap-2">
                     <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                     <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                     <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                     <div className="ml-2 text-[10px] font-mono text-muted-foreground">system.config.ts</div>
                  </div>
                  <div className="p-4 font-mono text-[10px] sm:text-xs text-white/50 space-y-2">
                     <div className="flex gap-2"><span className="text-purple-400">import</span> {"{ Context }"} <span className="text-purple-400">from</span> <span className="text-green-400">'@ai/core'</span>;</div>
                     <div className="h-2 w-1/2 bg-white/10 rounded mt-2" />
                     <div className="flex gap-2"><span className="text-blue-400">const</span> pack = <span className="text-yellow-300">initContext</span>();</div>
                     <div className="h-2 w-3/4 bg-white/10 rounded" />
                     <div className="h-2 w-1/3 bg-white/10 rounded" />
                  </div>
               </div>
            </div>

            <div className="relative z-10 flex flex-col flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                  <Layers className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">Context Packs</h3>
              </div>
              
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Ready-to-use codebase contexts, SaaS boilerplates, and developer system prompts. Drop them into Claude or GPT-4 and start building immediately.
              </p>
              
              <div className="mt-auto flex flex-wrap gap-2">
                <span className="text-xs font-semibold text-green-300 bg-green-500/10 px-3 py-1.5 rounded-md border border-green-500/20 uppercase tracking-wider">React / Next.js</span>
                <span className="text-xs font-semibold text-emerald-300 bg-emerald-500/10 px-3 py-1.5 rounded-md border border-emerald-500/20 uppercase tracking-wider">API Integration</span>
                <span className="text-xs font-semibold text-teal-300 bg-teal-500/10 px-3 py-1.5 rounded-md border border-teal-500/20 uppercase tracking-wider">Architecture</span>
              </div>
            </div>
          </motion.div>

        </div>
        
        {/* Additional Sub-categories row */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 flex flex-wrap justify-center gap-3 sm:gap-4 max-w-4xl mx-auto"
        >
           {/* Chips/tags for other items */}
           <div className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10 transition-all duration-300 cursor-pointer text-sm text-white/70 hover:text-white hover:scale-105">
             <Bot className="w-4 h-4 text-orange-400" /> AI Agents
           </div>
           <div className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10 transition-all duration-300 cursor-pointer text-sm text-white/70 hover:text-white hover:scale-105">
             <Terminal className="w-4 h-4 text-yellow-400" /> Dev Systems
           </div>
           <div className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10 transition-all duration-300 cursor-pointer text-sm text-white/70 hover:text-white hover:scale-105">
             <Code2 className="w-4 h-4 text-cyan-400" /> Workflows
           </div>
           <div className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10 transition-all duration-300 cursor-pointer text-sm text-white/70 hover:text-white hover:scale-105">
             <Package className="w-4 h-4 text-rose-400" /> Boilerplates
           </div>
        </motion.div>

      </div>
    </section>
  );
}
