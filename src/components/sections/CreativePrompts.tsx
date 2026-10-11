"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Copy, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { PROMPTS, type Prompt } from "@/lib/data";
import { getPublishedPrompts } from "@/lib/promptsApi";

export function CreativePrompts() {
  const [prompts, setPrompts] = useState<Prompt[]>(PROMPTS);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const live = await getPublishedPrompts();
        if (isMounted && live && live.length > 0) {
          setPrompts(live);
        }
      } catch (e) {
        console.error(e);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  // Showcase only first 10 on landing page
  const landingPrompts = prompts.slice(0, 10);

  return (
    <section className="relative py-24 bg-[#050505]">
      {/* Subtle grid background */}
      <div className="absolute inset-0 grid-background opacity-20 pointer-events-none" />

      <div className="container max-w-7xl mx-auto px-6 relative z-10">

        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-16 max-w-3xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6 leading-tight"
          >
            Creative Ready to use Prompts
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg"
          >
            Explore a curated collection of high-fidelity prompts for Midjourney, Veo, and other creative AI models.
          </motion.p>
        </div>

        {/* Masonry Layout Grid */}
        <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3 sm:gap-4 sm:space-y-4">
          {landingPrompts.map((prompt, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + (idx % 4) * 0.1 }}
              key={prompt.id}
              className="break-inside-avoid relative group rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer bg-white/5 border border-white/10"
            >
              <Link href={`/prompts/${prompt.slug}`} className="block relative w-full h-full">
                {/* Image */}
                <img
                  src={prompt.image}
                  alt={prompt.title}
                  className="w-full h-auto object-cover transition-transform duration-700 md:group-hover:scale-105"
                  loading="lazy"
                />
                
                {/* Mobile Persistent Copy Count */}
                <div className="md:hidden absolute bottom-2 right-2 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md text-[10px] font-medium text-white border border-white/10 shadow-sm">
                  <Copy className="w-3 h-3" />
                  <span>{prompt.copies}</span>
                </div>
                
                {/* Desktop Hover Overlay */}
                <div className="hidden md:flex absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-col justify-end p-5">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-white font-semibold text-lg line-clamp-1 pr-2">
                        {prompt.title}
                      </h3>
                      <ArrowUpRight className="w-5 h-5 text-white/70 group-hover:text-white transition-colors flex-shrink-0" />
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-medium text-white shadow-sm border border-white/10">
                        <Copy className="w-3.5 h-3.5" />
                        <span>{prompt.copies} copies</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        
      </div>
    </section>
  );
}
