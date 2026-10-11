"use client";

import { motion } from "framer-motion";
import { ArrowRight, Plus } from "lucide-react";

export function CTA() {
  return (
    <section className="py-32 relative overflow-hidden">
      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[400px] bg-blue-500/10 blur-[150px] mix-blend-screen pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[300px] h-[100px] bg-red-500/20 blur-[80px] pointer-events-none" />
      </div>

      <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="p-10 md:p-16 rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-xl"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            Build Faster With <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Proven Workflows
            </span>
          </h2>
          
          <p className="text-lg text-white/60 mb-10 max-w-2xl mx-auto">
            Join thousands of developers, creators, and founders executing complex AI tasks in minutes instead of days.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-black font-semibold hover:bg-white/90 transition-all flex items-center justify-center gap-2 text-lg">
              Explore Workflows
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-transparent text-white border border-white/20 hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-lg font-medium">
              <Plus className="w-5 h-5" />
              Create Workflow
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
