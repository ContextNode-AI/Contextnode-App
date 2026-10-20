"use client";

import { motion } from "framer-motion";
import { Play, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-24 pb-16">
      {/* Background Elements */}
      <div className="absolute inset-0 grid-background pointer-events-none opacity-40" />
      
      {/* Ambient Lighting */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] ambient-glow-red rounded-full blur-3xl opacity-50 pointer-events-none transform -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] ambient-glow-blue rounded-full blur-3xl opacity-50 pointer-events-none transform translate-x-1/2 translate-y-1/2" />

      <div className="relative z-10 container max-w-5xl mx-auto px-6 flex flex-col items-center text-center mt-12">
        
        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]"
        >
          Discover AI Assets That <br className="hidden md:block" />
          Actually Build Things
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-12 leading-relaxed"
        >
          Explore prompts, workflows, and production-grade Context Packs for creators and developers. Stop prompting from scratch.
        </motion.p>

        {/* Large Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
          className="w-full max-w-2xl mb-12 relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-blue-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="relative flex items-center w-full glass rounded-2xl p-2 border-white/10 transition-colors focus-within:border-white/20">
            <div className="pl-4 pr-3 text-muted-foreground">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Search prompts, context packs..."
              className="flex-1 bg-transparent border-none text-white placeholder:text-muted-foreground outline-none py-3 text-base sm:text-lg min-w-0"
            />
            <div className="pr-4 hidden sm:flex items-center">
              <div className="flex items-center justify-center w-8 h-8 rounded bg-white/5 border border-white/10 text-xs font-mono text-muted-foreground">
                K
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center w-full sm:w-auto gap-4 px-4 sm:px-0"
        >
          <button
            className={cn(
              "w-full sm:w-auto px-7 py-3.5 rounded-xl font-medium text-base transition-all",
              "bg-white text-black hover:bg-white/90 sm:hover:scale-105 active:scale-95"
            )}
          >
            Explore Creative Prompts
          </button>
          <button
            className={cn(
              "w-full sm:w-auto px-7 py-3.5 rounded-xl font-medium text-base transition-all flex items-center justify-center gap-2",
              "glass text-white hover:bg-white/10 sm:hover:scale-105 active:scale-95"
            )}
          >
            Developer
          </button>
          <button
            className={cn(
              "w-full sm:w-auto px-7 py-3.5 rounded-xl font-medium text-base transition-all flex items-center justify-center gap-2",
              "bg-white/5 border border-white/5 text-muted-foreground hover:text-white hover:bg-white/10 sm:hover:scale-105 active:scale-95"
            )}
          >
            <Play className="w-4 h-4 fill-current" />
            Watch Demo
          </button>
        </motion.div>
      </div>
    </section>
  );
}
