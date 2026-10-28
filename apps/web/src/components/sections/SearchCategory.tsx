"use client";

import { motion } from "framer-motion";
import { Bot, Terminal, Code2, Package, Sparkles, Layers } from "lucide-react";

export function SearchCategory() {
  return (
    <section className="relative py-24 bg-[#05060A] overflow-hidden">
      {/* Background Lighting */}
      <div className="absolute top-1/2 left-1/2 w-[800px] h-[400px] ambient-glow-secondary rounded-[100%] blur-3xl opacity-40 pointer-events-none transform -translate-x-1/2 -translate-y-1/2" />
      
      <div className="w-full px-4 sm:px-6 relative z-10">
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
            className="text-slate-400 text-lg max-w-2xl"
          >
            Discover high-fidelity creative prompts and production-ready context packs designed to accelerate your AI workflow.
          </motion.p>
        </div>

        {/* Two Featured Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl mx-auto">
          
          {/* Creative Prompts Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="group relative overflow-hidden rounded-3xl border border-[#25343F] bg-[#25343F]/60 backdrop-blur-xl p-8 hover:border-[#FE7F2D]/50 transition-all duration-500 hover:shadow-2xl cursor-pointer flex flex-col"
          >
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#FE7F2D]/10 rounded-full blur-[80px] group-hover:bg-[#FE7F2D]/20 transition-colors pointer-events-none" />
            
            {/* Visual Area */}
            <div className="relative h-48 w-full mb-8 rounded-2xl overflow-hidden border border-[#25343F] bg-[#05060A]">
              <div className="absolute inset-0 bg-gradient-to-t from-[#05060A] via-transparent to-transparent z-10" />
              <div className="absolute inset-0 grid grid-cols-3 gap-3 p-3 opacity-60 transform -rotate-6 scale-125 group-hover:scale-110 group-hover:opacity-100 transition-all duration-700">
                <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format" alt="prompt1" className="rounded-xl object-cover h-32 w-full shadow-2xl" />
                <img src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=400&auto=format" alt="prompt2" className="rounded-xl object-cover h-40 w-full -translate-y-4 shadow-2xl" />
                <img src="https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=400&auto=format" alt="prompt3" className="rounded-xl object-cover h-32 w-full shadow-2xl" />
              </div>
            </div>

            <div className="relative z-10 flex flex-col flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#FE7F2D]/15 border border-[#FE7F2D]/30 flex items-center justify-center shadow-xs">
                  <Sparkles className="w-6 h-6 text-[#FE7F2D]" />
                </div>
                <h3 className="text-2xl font-bold text-white">AI Creative Prompts</h3>
              </div>
              
              <p className="text-slate-400 mb-8 leading-relaxed">
                Masterpiece-level prompts for Midjourney, Veo, and DALL-E. Stop guessing and start generating with proven, high-fidelity instructions tailored for specific styles.
              </p>
              
              <div className="mt-auto flex flex-wrap gap-2">
                <span className="text-xs font-semibold text-[#FE7F2D] bg-[#FE7F2D]/15 px-3 py-1.5 rounded-md border border-[#FE7F2D]/30 uppercase tracking-wider">Image Gen</span>
                <span className="text-xs font-semibold text-slate-300 bg-[#05060A] px-3 py-1.5 rounded-md border border-[#25343F] uppercase tracking-wider">Video Gen</span>
                <span className="text-xs font-semibold text-slate-300 bg-[#05060A] px-3 py-1.5 rounded-md border border-[#25343F] uppercase tracking-wider">Stable Diffusion</span>
              </div>
            </div>
          </motion.div>

          {/* Context Packs Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="group relative overflow-hidden rounded-3xl border border-[#25343F] bg-[#25343F]/60 backdrop-blur-xl p-8 hover:border-[#FE7F2D]/50 transition-all duration-500 hover:shadow-2xl cursor-pointer flex flex-col"
          >
             <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#25343F]/40 rounded-full blur-[80px] pointer-events-none" />
            
            {/* Visual Area */}
            <div className="relative h-48 w-full mb-8 rounded-2xl overflow-hidden border border-[#25343F] bg-[#05060A] flex items-center justify-center">
               <div className="absolute inset-0 bg-gradient-to-t from-[#05060A] via-transparent to-transparent z-10" />
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:16px_16px] opacity-20" />
               
               <div className="relative z-0 w-3/4 bg-[#05060A] rounded-xl border border-[#25343F] shadow-2xl overflow-hidden flex flex-col transform group-hover:-translate-y-2 group-hover:scale-105 transition-all duration-500">
                  <div className="h-8 bg-[#25343F]/70 border-b border-[#25343F] flex items-center px-3 gap-2">
                     <div className="w-2.5 h-2.5 rounded-full bg-[#FE7F2D]" />
                     <div className="w-2.5 h-2.5 rounded-full bg-slate-500" />
                     <div className="w-2.5 h-2.5 rounded-full bg-[#25343F]" />
                     <div className="ml-2 text-[10px] font-mono text-slate-400">system.config.ts</div>
                  </div>
                  <div className="p-4 font-mono text-[10px] sm:text-xs text-slate-300 space-y-2">
                     <div className="flex gap-2"><span className="text-[#FE7F2D]">import</span> {"{ Context }"} <span className="text-[#FE7F2D]">from</span> <span className="text-slate-300">'@ai/core'</span>;</div>
                     <div className="h-2 w-1/2 bg-[#25343F] rounded mt-2" />
                     <div className="flex gap-2"><span className="text-white">const</span> pack = <span className="text-[#FE7F2D]">initContext</span>();</div>
                     <div className="h-2 w-3/4 bg-[#25343F] rounded" />
                     <div className="h-2 w-1/3 bg-[#25343F] rounded" />
                  </div>
               </div>
            </div>

            <div className="relative z-10 flex flex-col flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#FE7F2D]/15 border border-[#FE7F2D]/30 flex items-center justify-center shadow-xs">
                  <Layers className="w-6 h-6 text-[#FE7F2D]" />
                </div>
                <h3 className="text-2xl font-bold text-white">Context Packs</h3>
              </div>
              
              <p className="text-slate-400 mb-8 leading-relaxed">
                Ready-to-use codebase contexts, SaaS boilerplates, and developer system prompts. Drop them into Claude or GPT-4 and start building immediately.
              </p>
              
              <div className="mt-auto flex flex-wrap gap-2">
                <span className="text-xs font-semibold text-[#FE7F2D] bg-[#FE7F2D]/15 px-3 py-1.5 rounded-md border border-[#FE7F2D]/30 uppercase tracking-wider">React / Next.js</span>
                <span className="text-xs font-semibold text-slate-300 bg-[#05060A] px-3 py-1.5 rounded-md border border-[#25343F] uppercase tracking-wider">API Integration</span>
                <span className="text-xs font-semibold text-slate-300 bg-[#05060A] px-3 py-1.5 rounded-md border border-[#25343F] uppercase tracking-wider">Architecture</span>
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
           <div className="flex items-center gap-2 px-6 py-3 rounded-xl border border-[#25343F] bg-[#25343F]/40 hover:bg-[#25343F] hover:border-[#FE7F2D]/50 transition-all duration-300 cursor-pointer text-sm text-slate-300 hover:text-white hover:scale-105">
             <Bot className="w-4 h-4 text-[#FE7F2D]" /> AI Agents
           </div>
           <div className="flex items-center gap-2 px-6 py-3 rounded-xl border border-[#25343F] bg-[#25343F]/40 hover:bg-[#25343F] hover:border-[#FE7F2D]/50 transition-all duration-300 cursor-pointer text-sm text-slate-300 hover:text-white hover:scale-105">
             <Terminal className="w-4 h-4 text-[#FE7F2D]" /> Dev Systems
           </div>
           <div className="flex items-center gap-2 px-6 py-3 rounded-xl border border-[#25343F] bg-[#25343F]/40 hover:bg-[#25343F] hover:border-[#FE7F2D]/50 transition-all duration-300 cursor-pointer text-sm text-slate-300 hover:text-white hover:scale-105">
             <Code2 className="w-4 h-4 text-[#FE7F2D]" /> Workflows
           </div>
           <div className="flex items-center gap-2 px-6 py-3 rounded-xl border border-[#25343F] bg-[#25343F]/40 hover:bg-[#25343F] hover:border-[#FE7F2D]/50 transition-all duration-300 cursor-pointer text-sm text-slate-300 hover:text-white hover:scale-105">
             <Package className="w-4 h-4 text-[#FE7F2D]" /> Boilerplates
           </div>
        </motion.div>

      </div>
    </section>
  );
}
