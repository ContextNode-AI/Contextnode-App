"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import Link from "next/link";
import { PROMPTS, type Prompt } from "@/lib/data";
import { getPublishedPrompts } from "@/lib/promptsApi";
import {
  ScrollVelocityContainer,
  ScrollVelocityRow,
} from "@/registry/magicui/scroll-based-velocity";
import { InkBackground } from "@/components/kokonutui/ink-background";

const FALLBACK_ROW_A: Partial<Prompt>[] = [
  {
    title: "Ethereal Portraiture",
    category: "Photography",
    copies: "8.9k",
    slug: "ethereal-portraiture",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format",
  },
  {
    title: "Cyberpunk Street Level",
    category: "Cyberpunk",
    copies: "3.2k",
    slug: "cyberpunk-street-level",
    image:
      "https://images.unsplash.com/photo-1555680202-c86f0e12f086?q=80&w=800&auto=format",
  },
  {
    title: "Futuristic Architecture",
    category: "Architecture",
    copies: "4.7k",
    slug: "ethereal-portraiture",
    image:
      "https://images.unsplash.com/photo-1749738456487-2af715ab65ea?q=80&w=2340&auto=format&fit=crop",
  },
  {
    title: "Ghibli-esque Floating Worlds",
    category: "Illustration",
    copies: "5.1k",
    slug: "ghibli-esque-floating-worlds",
    image:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format",
  },
  {
    title: "Dark Studio Product Macro",
    category: "Photography",
    copies: "2.8k",
    slug: "dark-studio-product-macro",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format",
  },
  {
    title: "Holographic Neural Lattice",
    category: "3D Render",
    copies: "6.2k",
    slug: "dark-studio-product-macro",
    image:
      "https://plus.unsplash.com/premium_photo-1720139288219-e20aa9c8895b?q=80&w=1810&auto=format&fit=crop",
  },
];

const FALLBACK_ROW_B: Partial<Prompt>[] = [
  {
    title: "Neo-Tokyo Cinematic Stills",
    category: "Cinematic",
    copies: "7.4k",
    slug: "cyberpunk-street-level",
    image:
      "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format",
  },
  {
    title: "Abstract Geometric Geometry",
    category: "Minimalist",
    copies: "3.9k",
    slug: "ghibli-esque-floating-worlds",
    image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format",
  },
  {
    title: "Bioluminescent Deep Sea",
    category: "3D Render",
    copies: "4.3k",
    slug: "ethereal-portraiture",
    image:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format",
  },
  {
    title: "Hyper-Detailed Mecha Concept",
    category: "Cyberpunk",
    copies: "5.8k",
    slug: "cyberpunk-street-level",
    image:
      "https://images.unsplash.com/photo-1749738456487-2af715ab65ea?q=80&w=2340&auto=format&fit=crop",
  },
  {
    title: "Nordic Minimalist Interior",
    category: "Architecture",
    copies: "2.1k",
    slug: "dark-studio-product-macro",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format",
  },
  {
    title: "Surreal Desert Mirage",
    category: "Illustration",
    copies: "3.5k",
    slug: "ghibli-esque-floating-worlds",
    image:
      "https://plus.unsplash.com/premium_photo-1720139288219-e20aa9c8895b?q=80&w=1810&auto=format&fit=crop",
  },
];

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

  // Split prompts into two balanced rows
  const half = Math.ceil(prompts.length / 2);
  const rowA =
    prompts.length >= 6
      ? prompts.slice(0, half)
      : [...prompts.slice(0, half), ...FALLBACK_ROW_A].slice(0, 6);
  const rowB =
    prompts.length >= 6
      ? prompts.slice(half)
      : [...prompts.slice(half), ...FALLBACK_ROW_B].slice(0, 6);

  return (
    <section className="relative py-20 bg-[#05060A] overflow-hidden">
      {/* Subtle grid background */}
      <div className="absolute inset-0 grid-background opacity-20 pointer-events-none" />

      {/* Kokonut UI Ink Background Headline Area */}
      <div className="w-full relative z-10 mb-4 px-4 sm:px-6">
        <div className="relative w-full rounded-2xl overflow-hidden border border-[#25343F]/40 bg-[#05060A]">
          <InkBackground
            text="Creative Ready to use Prompts"
            accent="#FE7F2D"
            className="min-h-[170px] sm:min-h-[200px] md:min-h-[220px] bg-transparent"
          />

          {/* Right Side Down Prompt Page Link Button */}
          <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-6 z-20 pointer-events-auto">
            <Link
              href="/prompts"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-[#05060A]/85 backdrop-blur-md border border-[#25343F] text-xs sm:text-sm font-medium text-slate-200 hover:text-white hover:border-[#FE7F2D]/60 hover:bg-[#25343F]/80 transition-all group shadow-xl"
            >
              <span>Explore All Prompts</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FE7F2D] transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll-Based Velocity Marquee Rows */}
      <div className="relative w-full overflow-hidden py-4">
        <ScrollVelocityContainer className="w-full space-y-4 sm:space-y-6">
          {/* Row A: Moving Left-to-Right */}
          <ScrollVelocityRow baseVelocity={6} direction={1} className="py-1">
            {rowA.map((item, idx) => (
              <div
                key={`rowA-${item.slug || item.id || idx}-${idx}`}
                className="mx-2.5 sm:mx-3.5 inline-block group relative w-60 sm:w-72 md:w-80 h-40 sm:h-48 md:h-52 rounded-2xl overflow-hidden border border-[#25343F] bg-[#05060A] hover:border-[#FE7F2D]/60 transition-all duration-300 shadow-lg shrink-0 cursor-pointer select-none"
              >
                <Link
                  href={`/prompts/${item.slug || "ethereal-portraiture"}`}
                  className="block w-full h-full relative"
                >
                  <img
                    src={`${item.image}&ixlib=rb-4.0.3`}
                    alt={item.title || "Creative Prompt"}
                    width={320}
                    height={208}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Gradient overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#05060A]/90 via-[#05060A]/30 to-transparent opacity-90 group-hover:opacity-95 transition-opacity" />

                  {/* Category Pill */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-[#05060A]/85 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-medium text-slate-300 border border-[#25343F]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FE7F2D]" />
                    {item.category || "Prompt"}
                  </div>

                  {/* Bottom Metadata */}
                  <div className="absolute bottom-3 inset-x-3 flex items-center justify-between">
                    <div className="min-w-0 pr-2">
                      <h3 className="text-white font-semibold text-sm sm:text-base truncate group-hover:text-[#FE7F2D] transition-colors">
                        {item.title}
                      </h3>
                      <span className="text-xs text-slate-400">
                        {item.copies || "2.5k"} copies
                      </span>
                    </div>
                    <div className="w-7 h-7 rounded-full bg-[#05060A]/90 border border-[#25343F] flex items-center justify-center text-slate-300 group-hover:text-white group-hover:border-[#FE7F2D]/60 transition-colors shrink-0">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </ScrollVelocityRow>

          {/* Row B: Moving Right-to-Left (Opposite Direction) */}
          <ScrollVelocityRow baseVelocity={6} direction={-1} className="py-1">
            {rowB.map((item, idx) => (
              <div
                key={`rowB-${item.slug || item.id || idx}-${idx}`}
                className="mx-2.5 sm:mx-3.5 inline-block group relative w-60 sm:w-72 md:w-80 h-40 sm:h-48 md:h-52 rounded-2xl overflow-hidden border border-[#25343F] bg-[#05060A] hover:border-[#FE7F2D]/60 transition-all duration-300 shadow-lg shrink-0 cursor-pointer select-none"
              >
                <Link
                  href={`/prompts/${item.slug || "ethereal-portraiture"}`}
                  className="block w-full h-full relative"
                >
                  <img
                    src={`${item.image}&ixlib=rb-4.0.3`}
                    alt={item.title || "Creative Prompt"}
                    width={320}
                    height={208}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#05060A]/90 via-[#05060A]/30 to-transparent opacity-90 group-hover:opacity-95 transition-opacity" />

                  {/* Category Pill */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-[#05060A]/85 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-medium text-slate-300 border border-[#25343F]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FE7F2D]" />
                    {item.category || "Prompt"}
                  </div>

                  {/* Bottom Metadata */}
                  <div className="absolute bottom-3 inset-x-3 flex items-center justify-between">
                    <div className="min-w-0 pr-2">
                      <h3 className="text-white font-semibold text-sm sm:text-base truncate group-hover:text-[#FE7F2D] transition-colors">
                        {item.title}
                      </h3>
                      <span className="text-xs text-slate-400">
                        {item.copies || "3.8k"} copies
                      </span>
                    </div>
                    <div className="w-7 h-7 rounded-full bg-[#05060A]/90 border border-[#25343F] flex items-center justify-center text-slate-300 group-hover:text-white group-hover:border-[#FE7F2D]/60 transition-colors shrink-0">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </ScrollVelocityRow>
        </ScrollVelocityContainer>

        {/* Ambient Fade Masks into #05060A */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-20 sm:w-44 bg-gradient-to-r from-[#05060A] to-transparent z-20" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-20 sm:w-44 bg-gradient-to-l from-[#05060A] to-transparent z-20" />
      </div>
    </section>
  );
}
