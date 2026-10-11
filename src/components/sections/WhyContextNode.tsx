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
    <section className="relative py-24 bg-[#050505] overflow-hidden">
      {/* Background Lighting */}
      <div className="absolute inset-0 grid-background opacity-20 pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] ambient-glow-red rounded-full blur-3xl opacity-10 pointer-events-none transform -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] ambient-glow-blue rounded-full blur-3xl opacity-10 pointer-events-none transform -translate-y-1/2" />

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
            className="text-muted-foreground text-lg max-w-2xl"
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
            className="relative p-6 sm:p-8 rounded-3xl border border-red-900/30 bg-gradient-to-b from-red-950/20 to-black/40 backdrop-blur-sm"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
                <X className="w-4 h-4 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold text-white">Without structure</h3>
            </div>

            <div className="flex flex-col gap-4">
              {WITHOUT_STRUCTURE.map((item, idx) => (
                <div key={idx} className="flex items-start gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                  <item.icon className="w-5 h-5 text-red-400/70 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white/90 text-sm mb-1">{item.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
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
            className="relative p-6 sm:p-8 rounded-3xl border border-blue-900/30 bg-gradient-to-b from-blue-900/20 via-purple-900/10 to-black/40 backdrop-blur-sm shadow-[0_0_50px_rgba(59,130,246,0.05)]"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                <Check className="w-4 h-4 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">With ContextNode</h3>
            </div>

            <div className="flex flex-col gap-4">
              {WITH_CONTEXTNODE.map((item, idx) => (
                <div key={idx} className="flex items-start gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                  <item.icon className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white/90 text-sm mb-1">{item.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
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
