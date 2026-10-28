"use client";

import { WorkflowCard } from "./WorkflowCard";
import { motion } from "framer-motion";

const FEATURED_WORKFLOWS = [
  {
    title: "Build SaaS MVP",
    category: "Development",
    stepCount: 7,
    difficulty: "Advanced" as const,
    completionTime: "4h",
    creator: {
      name: "Alex Developer",
      avatar: "https://i.pravatar.cc/150?img=11",
    },
    coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop",
    usesCount: "12.5k",
  },
  {
    title: "YouTube Automation System",
    category: "Content",
    stepCount: 5,
    difficulty: "Intermediate" as const,
    completionTime: "2h",
    creator: {
      name: "Sarah Creates",
      avatar: "https://i.pravatar.cc/150?img=5",
    },
    coverImage: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1974&auto=format&fit=crop",
    usesCount: "8.2k",
  },
  {
    title: "AI Content Pipeline",
    category: "Marketing",
    stepCount: 4,
    difficulty: "Beginner" as const,
    completionTime: "1h",
    creator: {
      name: "Mark Growth",
      avatar: "https://i.pravatar.cc/150?img=8",
    },
    coverImage: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?q=80&w=2074&auto=format&fit=crop",
    usesCount: "5.1k",
  },
  {
    title: "Laravel API Development Flow",
    category: "Development",
    stepCount: 6,
    difficulty: "Advanced" as const,
    completionTime: "3h",
    creator: {
      name: "Taylor Codes",
      avatar: "https://i.pravatar.cc/150?img=12",
    },
    coverImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop",
    usesCount: "3.4k",
  },
];

export function FeaturedWorkflows() {
  return (
    <section className="py-24 relative">
      <div className="w-full px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold text-white mb-3">Featured Workflows</h2>
            <p className="text-white/60 text-lg">Hand-picked execution systems for your next project.</p>
          </div>
          <button className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-2 transition-colors mt-4 md:mt-0">
            View All Featured <span aria-hidden="true">&rarr;</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
          {FEATURED_WORKFLOWS.map((workflow, index) => (
            <motion.div
              key={workflow.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <WorkflowCard {...workflow} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
