"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { cn } from "@/lib/utils";

const TESTIMONIALS = [
  {
    quote: "ContextNode completely changed how our engineering team uses AI. We went from scattered Notion docs of prompts to a centralized, version-controlled repository of Context Packs. Our Copilot output quality doubled overnight.",
    name: "Alex Rivera",
    role: "CTO at BuildKite",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
  },
  {
    quote: "As a solo founder, speed is everything. The SaaS Starter Kit Context Pack saved me literally weeks of architecture setup. I just pulled it into Cursor and started building product features on day one.",
    name: "Sarah Chen",
    role: "Indie Hacker",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
  },
  {
    quote: "The Midjourney cinematic prompts here are insane. They actually understand camera mechanics and lighting ratios. It's the difference between generating 'cool AI art' and generating usable commercial assets.",
    name: "Marcus Johnson",
    role: "Creative Director",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop"
  },
  {
    quote: "I've tried every boilerplate out there, but ContextNode's integration packs are on another level. The Next.js + Supabase auth flow was production-ready in literally 5 minutes.",
    name: "Elena Rodriguez",
    role: "Full Stack Developer",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop"
  },
  {
    quote: "The AI agent templates saved our startup months of R&D. The LangChain architectures are robust and actually account for edge cases and rate limiting.",
    name: "David Kim",
    role: "Founder, AI Solutions",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
  },
  {
    quote: "As an agency owner, we need to move fast. Dropping these context packs into Claude allows my junior devs to output senior-level architecture without me micromanaging.",
    name: "Rachel Dawson",
    role: "Agency Owner",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop"
  },
  {
    quote: "The visual generation prompts are a masterclass. The specific tokens used for styling and rendering engines have completely transformed our marketing collateral.",
    name: "James Wilson",
    role: "Marketing Head",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop"
  },
  {
    quote: "Finally, a repository that understands how developers actually use LLMs. The GraphQL microservices context pack was perfectly structured for our enterprise migration.",
    name: "Priya Patel",
    role: "Staff Engineer",
    image: "https://images.unsplash.com/photo-1531123897727-8f129e1b88ce?w=100&h=100&fit=crop"
  },
  {
    quote: "I use the Next.js templates for every new client project. It's essentially a cheat code for bootstrapping scalable, accessible, and fast web applications.",
    name: "Tom Becker",
    role: "Freelance Engineer",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop"
  },
  {
    quote: "The workflow automation templates for n8n are brilliant. They handle error catching and retries natively, which is exactly what you need for production deployment.",
    name: "Nina Simone",
    role: "Operations Lead",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop"
  }
];

const MarqueeRow = ({ items, direction }: { items: typeof TESTIMONIALS, direction: "left" | "right" }) => {
  return (
    <div className="flex w-max overflow-visible">
       <div className={cn("flex gap-6 w-max px-3", direction === "left" ? "animate-marquee-left" : "animate-marquee-right")}>
          {[...items, ...items].map((t, idx) => (
             <div 
               key={idx} 
               className="w-[320px] md:w-[420px] flex-shrink-0 relative group p-8 rounded-3xl border border-[#25343F] bg-[#25343F]/60 backdrop-blur-xl flex flex-col justify-between hover:border-[#FE7F2D]/50 transition-colors shadow-lg h-[280px]"
             >
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl pointer-events-none" />
                
                <div className="relative z-10">
                  <Quote className="w-8 h-8 text-[#FE7F2D]/40 mb-4 group-hover:text-[#FE7F2D] transition-colors" />
                  <p className="text-sm md:text-[15px] text-slate-300 leading-relaxed mb-6 line-clamp-4">
                    "{t.quote}"
                  </p>
                </div>
                
                <div className="flex items-center gap-4 relative z-10 mt-auto pt-4 border-t border-[#25343F]">
                  <img src={t.image} alt={t.name} className="w-10 h-10 rounded-full object-cover border border-[#25343F]" />
                  <div>
                    <h4 className="text-sm font-semibold text-white">{t.name}</h4>
                    <p className="text-[11px] uppercase tracking-wider text-slate-400">{t.role}</p>
                  </div>
                </div>
             </div>
          ))}
       </div>
    </div>
  );
};

export function Testimonials() {
  return (
    <section className="relative py-24 bg-[#05060A] overflow-hidden">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee-left {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }
        .animate-marquee-left {
          animation: marquee-left 40s linear infinite;
        }
        .animate-marquee-right {
          animation: marquee-right 40s linear infinite;
        }
        .animate-marquee-left:hover, .animate-marquee-right:hover {
          animation-play-state: paused;
        }
      `}} />

      {/* Background Grid */}
      <div className="absolute inset-0 grid-background opacity-20 pointer-events-none" />

      <div className="container max-w-7xl mx-auto px-6 relative z-10">
        
        <div className="flex flex-col items-center text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6"
          >
            Trusted by Builders
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 text-lg max-w-2xl"
          >
            See how elite creators and developers are standardizing their AI workflows with our pre-built assets.
          </motion.p>
        </div>
      </div>

      {/* Marquee Section (Full Bleed) */}
      <div className="relative w-full max-w-[100vw] overflow-hidden flex flex-col gap-6">
        {/* Fade Masks */}
        <div className="absolute top-0 left-0 bottom-0 w-32 md:w-64 bg-gradient-to-r from-[#05060A] to-transparent z-20 pointer-events-none" />
        <div className="absolute top-0 right-0 bottom-0 w-32 md:w-64 bg-gradient-to-l from-[#05060A] to-transparent z-20 pointer-events-none" />
        
        <MarqueeRow items={TESTIMONIALS.slice(0, 5)} direction="left" />
        <MarqueeRow items={TESTIMONIALS.slice(5, 10)} direction="right" />
      </div>

    </section>
  );
}
