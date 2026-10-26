"use client";

import { motion } from "framer-motion";
import { X, Check, Shuffle, AlertTriangle, Ghost, Unlink, Layers, Network, Building2, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const WITHOUT_STRUCTURE = [
  {
    title: "Random prompting",
    description: "Starting from scratch every time, hoping for a good output.",
    icon: Shuffle,
  },
  {
    title: "Inconsistent results",
    description: "Outputs vary wildly between sessions and team members.",
    icon: AlertTriangle,
  },
  {
    title: "Hallucinations",
    description: "Lack of strict context leads to made-up facts and broken code.",
    icon: Ghost,
  },
  {
    title: "Broken workflows",
    description: "Manual handoffs between different AI tools and steps.",
    icon: Unlink,
  },
];

const WITH_CONTEXTNODE = [
  {
    title: "Reusable systems",
    description: "Save, version, and share proven context packs and prompts.",
    icon: Layers,
  },
  {
    title: "Structured execution",
    description: "Strict schemas and constraints for predictable, reliable outputs.",
    icon: Network,
  },
  {
    title: "Production architecture",
    description: "Pre-built foundations for complex software and content systems.",
    icon: Building2,
  },
  {
    title: "Scalable AI workflows",
    description: "Chain prompts and context together for automated pipelines.",
    icon: TrendingUp,
  },
];

export function WhyContextNode() {
  return (
    <section className="relative py-24 bg-[#05060A] overflow-hidden">
      {/* Background Lighting */}
      <div className="absolute inset-0 grid-background opacity-20 pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] ambient-glow-secondary rounded-full blur-3xl opacity-40 pointer-events-none transform -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] ambient-glow-accent rounded-full blur-3xl opacity-30 pointer-events-none transform -translate-y-1/2" />

      <div className="container max-w-5xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col items-center mb-16 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6 leading-tight max-w-3xl"
          >
            AI becomes powerful <br className="hidden md:block" />
            when organized correctly.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 text-lg max-w-2xl"
          >
            Stop copy-pasting from scattered notes. Start building with structured, reusable systems.
          </motion.p>
        </div>

        {/* Comparison Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Without Structure Panel */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="relative p-6 sm:p-8 rounded-3xl border border-[#25343F] bg-[#25343F]/30 backdrop-blur-sm"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/30">
                <X className="w-4 h-4 text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">Without structure</h3>
            </div>

            <div className="flex flex-col gap-4">
              {WITHOUT_STRUCTURE.map((item, idx) => (
                <div key={idx} className="flex items-start gap-4 p-4 rounded-xl border border-[#25343F] bg-[#05060A]/80">
                  <item.icon className="w-5 h-5 text-red-400/80 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white/90 text-sm mb-1">{item.title}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* With ContextNode Panel */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="relative p-6 sm:p-8 rounded-3xl border border-[#FE7F2D]/40 bg-[#25343F]/60 backdrop-blur-sm shadow-xl"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-8 h-8 rounded-full bg-[#FE7F2D]/20 flex items-center justify-center border border-[#FE7F2D]/40">
                <Check className="w-4 h-4 text-[#FE7F2D] stroke-[3]" />
              </div>
              <h3 className="text-xl font-semibold text-white">With ContextNode</h3>
            </div>

            <div className="flex flex-col gap-4">
              {WITH_CONTEXTNODE.map((item, idx) => (
                <div key={idx} className="flex items-start gap-4 p-4 rounded-xl border border-[#25343F] bg-[#05060A]/80 hover:border-[#FE7F2D]/50 transition-colors">
                  <item.icon className="w-5 h-5 text-[#FE7F2D] mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white text-sm mb-1">{item.title}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
