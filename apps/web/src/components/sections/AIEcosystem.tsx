"use client";

import { motion } from "framer-motion";
import { Bot, Wand2, Code, Wind, Video } from "lucide-react";

const GithubIcon = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const STACK = [
  { icon: GithubIcon, name: "GitHub Copilot" },
  { icon: Bot, name: "ChatGPT & Claude" },
  { icon: Wand2, name: "Midjourney" },
  { icon: Code, name: "Cursor" },
  { icon: Wind, name: "Windsurf" },
  { icon: Video, name: "Runway & Veo" },
];

export function AIEcosystem() {
  return (
    <section className="relative pt-24 pb-12 bg-[#05060A] overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 grid-background opacity-20 pointer-events-none" />
      
      {/* Subtle Glows */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-32 h-32 bg-[#25343F]/30 blur-[50px] pointer-events-none" />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-32 h-32 bg-[#25343F]/30 blur-[50px] pointer-events-none" />

      <div className="w-full px-4 sm:px-6 relative z-10">
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-xs font-bold tracking-[0.2em] uppercase text-slate-400 mb-10"
        >
          Works with your favorite AI stack
        </motion.p>

        <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20">
          {STACK.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, ease: "easeOut" }}
              className="group flex flex-col items-center justify-center cursor-pointer relative"
            >
              <item.icon className="w-8 h-8 md:w-10 md:h-10 text-slate-400 group-hover:text-[#FE7F2D] transition-all duration-300 group-hover:scale-110" />
              
              {/* Tooltip on hover */}
              <div className="absolute -bottom-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <span className="text-[10px] font-semibold tracking-wider text-slate-200 bg-[#25343F] px-2 py-0.5 rounded border border-[#25343F] uppercase whitespace-nowrap">
                  {item.name}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
