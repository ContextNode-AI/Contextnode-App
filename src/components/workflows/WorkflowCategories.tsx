"use client";

import { motion } from "framer-motion";
import { Terminal, PenTool, Megaphone, Briefcase, Bot, FlaskConical, Layout, Clock } from "lucide-react";
import Link from "next/link";

const CATEGORIES = [
  { name: "Development", icon: Terminal, count: 128, description: "Full-stack apps, APIs, and scripts" },
  { name: "Content Creation", icon: PenTool, count: 85, description: "Blogs, videos, and social media" },
  { name: "Marketing", icon: Megaphone, count: 64, description: "Campaigns, SEO, and funnels" },
  { name: "Business Ops", icon: Briefcase, count: 42, description: "Systems, processes, and automation" },
  { name: "AI Automation", icon: Bot, count: 96, description: "Agents, workflows, and pipelines" },
  { name: "Research", icon: FlaskConical, count: 37, description: "Market analysis and data extraction" },
  { name: "Design", icon: Layout, count: 51, description: "UI/UX, branding, and assets" },
  { name: "Productivity", icon: Clock, count: 73, description: "Time management and organization" },
];

export function WorkflowCategories() {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-3">Browse by Category</h2>
          <p className="text-white/60 text-lg">Find the right execution system for your domain.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {CATEGORIES.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <Link 
                href={`/workflows/category/${category.name.toLowerCase().replace(" ", "-")}`}
                className="group flex flex-col p-6 rounded-2xl bg-[#0F0F13] border border-white/5 hover:border-white/20 hover:bg-[#15151A] transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white/70 group-hover:bg-white/10 group-hover:text-white transition-colors">
                    <category.icon className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-white/5 text-white/50 text-xs font-medium border border-white/5">
                    {category.count}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-blue-400 transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-white/50 line-clamp-1">
                  {category.description}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
