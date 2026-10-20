"use client";

import { motion } from "framer-motion";
import { Package } from "lucide-react";

export function FinalCTA() {
  return (
    <section className="relative py-24 md:py-32 bg-[#050505] flex justify-center px-4 sm:px-6 overflow-hidden">
      {/* Background Lighting */}
      <div className="absolute inset-0 grid-background opacity-20 pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative w-full max-w-5xl rounded-[2rem] sm:rounded-[3rem] border border-white/5 bg-[#0B0B0F]/90 backdrop-blur-2xl p-8 sm:p-12 md:p-24 text-center overflow-hidden shadow-2xl"
      >
        {/* Glow Effects inside the card */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/10 via-transparent to-red-500/10 pointer-events-none" />
        <div className="absolute top-1/2 left-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-blue-500/20 blur-[80px] sm:blur-[120px] rounded-full pointer-events-none -translate-y-1/2 -translate-x-1/2 opacity-40 mix-blend-screen" />
        <div className="absolute top-1/2 right-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-red-500/20 blur-[80px] sm:blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2 opacity-30 mix-blend-screen" />

        <div className="relative z-10 flex flex-col items-center">
          {/* Icon */}
          <motion.div 
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 sm:mb-12 shadow-inner"
          >
            <Package className="w-6 h-6 text-white" />
          </motion.div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-6 leading-[1.1]">
            Stop Prompting Randomly. <br />
            <span className="text-white/60">Start Creating Systematically.</span>
          </h2>

          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-10 sm:mb-12 leading-relaxed">
            Join thousands of elite creators and developers building the next generation of software and content with structured AI assets.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white text-black font-semibold hover:bg-white/90 transition-colors shadow-[0_0_30px_rgba(255,255,255,0.2)]"
            >
              Explore Assets
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-transparent border border-white/10 text-white font-semibold hover:bg-white/5 transition-colors"
            >
              Start Building
            </motion.button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
