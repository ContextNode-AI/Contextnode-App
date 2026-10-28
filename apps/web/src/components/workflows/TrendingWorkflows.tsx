"use client";

import { WorkflowCard } from "./WorkflowCard";
import { motion } from "framer-motion";
import { useRef } from "react";

const TRENDING_WORKFLOWS = [
  {
    title: "Startup Validation Workflow",
    category: "Business",
    stepCount: 8,
    difficulty: "Intermediate" as const,
    completionTime: "12h",
    creator: { name: "Founder AI", avatar: "https://i.pravatar.cc/150?img=33" },
    coverImage: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2064&auto=format&fit=crop",
    usesCount: "25k",
    isTrending: true,
  },
  {
    title: "Next.js App Router Setup",
    category: "Development",
    stepCount: 4,
    difficulty: "Beginner" as const,
    completionTime: "30m",
    creator: { name: "React Pro", avatar: "https://i.pravatar.cc/150?img=68" },
    coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
    usesCount: "18k",
    isTrending: true,
  },
  {
    title: "Viral Thread Generator",
    category: "Marketing",
    stepCount: 3,
    difficulty: "Beginner" as const,
    completionTime: "15m",
    creator: { name: "Growth Hacker", avatar: "https://i.pravatar.cc/150?img=47" },
    coverImage: "https://images.unsplash.com/photo-1616469829581-73993eb86b02?q=80&w=2070&auto=format&fit=crop",
    usesCount: "14k",
    isTrending: true,
  },
  {
    title: "Design System Builder",
    category: "Design",
    stepCount: 6,
    difficulty: "Advanced" as const,
    completionTime: "5h",
    creator: { name: "UI Master", avatar: "https://i.pravatar.cc/150?img=32" },
    coverImage: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=2000&auto=format&fit=crop",
    usesCount: "9k",
    isTrending: true,
  }
];

export function TrendingWorkflows() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section className="py-24 bg-gradient-to-b from-transparent via-[#0B0B0F] to-transparent relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-full h-[300px] bg-blue-500/5 blur-[150px] -translate-y-1/2 pointer-events-none" />
      
      <div className="w-full px-4 sm:px-6 relative z-10">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold mb-4">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            Trending This Week
          </div>
          <h2 className="text-3xl font-bold text-white">Most Executed Workflows</h2>
        </div>

        {/* Carousel Container */}
        <div 
          ref={containerRef}
          className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0"
        >
          {TRENDING_WORKFLOWS.map((workflow, index) => (
            <motion.div
              key={workflow.title}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="min-w-[300px] md:min-w-[350px] lg:min-w-[400px] snap-start"
            >
              <WorkflowCard {...workflow} className="h-full" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
