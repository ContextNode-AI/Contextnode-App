"use client";

import { motion } from "framer-motion";
import { Package } from "lucide-react";

export function FinalCTA() {
  return (
    <section className="relative py-24 md:py-32 bg-[#05060A] flex justify-center px-4 sm:px-6 overflow-hidden">
      {/* Background Lighting */}
      <div className="absolute inset-0 grid-background opacity-20 pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative w-full max-w-6xl rounded-[2rem] sm:rounded-[3rem] border border-[#25343F] bg-[#25343F]/80 backdrop-blur-2xl p-8 sm:p-12 md:p-24 text-center overflow-hidden shadow-2xl"
      >
        {/* Glow Effects inside the card */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#FE7F2D]/10 via-transparent to-[#25343F]/30 pointer-events-none" />
        <div className="absolute top-1/2 left-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-[#FE7F2D]/15 blur-[80px] sm:blur-[120px] rounded-full pointer-events-none -translate-y-1/2 -translate-x-1/2 opacity-40 mix-blend-screen" />
        <div className="absolute top-1/2 right-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-[#25343F]/40 blur-[80px] sm:blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2 opacity-50 mix-blend-screen" />

        <div className="relative z-10 flex flex-col items-center">
          {/* Icon */}
          <motion.div 
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-14 h-14 rounded-2xl bg-[#05060A] border border-[#25343F] flex items-center justify-center mb-8 sm:mb-12 shadow-inner"
          >
            <Package className="w-6 h-6 text-[#FE7F2D]" />
          </motion.div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-6 leading-[1.1]">
            Stop Prompting Randomly. <br />
            <span className="text-slate-400">Start Creating Systematically.</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-10 sm:mb-12 leading-relaxed">
            Join thousands of elite creators and developers building the next generation of software and content with structured AI assets.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#FE7F2D] text-slate-950 font-bold hover:bg-[#FE7F2D]/90 transition-colors shadow-lg"
            >
              Explore Assets
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#05060A] border border-[#25343F] text-white font-semibold hover:bg-[#25343F] transition-colors"
            >
              Start Building
            </motion.button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
