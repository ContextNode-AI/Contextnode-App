"use client";

import { motion } from "framer-motion";
import { Download, ArrowRight } from "lucide-react";
import Link from "next/link";

const ASSETS = [
  {
    id: 1,
    title: "Next.js SaaS Boilerplate",
    description: "Complete authentication, billing, and database setup using Next.js App Router and Supabase. Ready for production.",
    category: "Context Pack",
    tags: ["Next.js", "Tailwind", "Supabase"],
    downloads: "8.1k",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "AI Chatbot Architecture",
    description: "System design and prompt engineering templates for building robust, stateful conversational AI agents.",
    category: "Tech Prompt",
    tags: ["Vercel AI", "Prompt Eng", "Node.js"],
    downloads: "4.2k",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "E-commerce API Flow",
    description: "Robust backend system prompts and context packs for building scalable and secure e-commerce APIs.",
    category: "Tech Prompt",
    tags: ["Node.js", "Stripe", "PostgreSQL"],
    downloads: "5.6k",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "Automation Workflows",
    description: "Pre-configured n8n and Make workflows for content automation, scheduling, and API synchronization.",
    category: "Context Pack",
    tags: ["n8n", "Make", "OpenAI"],
    downloads: "3.5k",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 5,
    title: "GraphQL Microservices",
    description: "Comprehensive boilerplate and prompt set for designing and federating GraphQL microservices.",
    category: "Tech Prompt",
    tags: ["GraphQL", "Apollo", "Docker"],
    downloads: "2.8k",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 6,
    title: "React Native Starter",
    description: "Mobile app boilerplate with Expo, native navigation, and pre-configured deep linking routing.",
    category: "Context Pack",
    tags: ["React Native", "Expo", "TypeScript"],
    downloads: "6.4k",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=800&auto=format&fit=crop",
  }
];

export function TrendingAssets() {
  return (
    <section className="relative py-24 bg-[#050505]">
      {/* Subtle grid background for the whole section */}
      <div className="absolute inset-0 grid-background opacity-20 pointer-events-none" />

      <div className="container max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-6">
          <div>
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-3"
            >
              Developer Resources & Contexts
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground text-base max-w-2xl"
            >
              Production-ready tech prompts, system architectures, and codebase boilerplates to accelerate your development.
            </motion.p>
          </div>
          
          <motion.button 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-sm font-medium text-white/70 hover:text-white transition-colors flex items-center gap-1.5 group"
          >
            View all resources 
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>

        {/* Vercel-Style Template Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ASSETS.map((asset, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              key={asset.id} 
            >
              <Link href={`/assets/${asset.id}`} className="group relative rounded-2xl border border-white/5 bg-[#0A0A0A] hover:bg-[#111111] transition-colors overflow-hidden flex flex-col h-[340px] cursor-pointer shadow-lg hover:shadow-2xl">
                
                {/* Content Area */}
                <div className="p-6 flex-1 flex flex-col z-10">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">{asset.title}</h3>
                  </div>
                  
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-6 leading-relaxed">
                    {asset.description}
                  </p>
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-auto">
                    {/* Tech Chips */}
                    <div className="flex flex-wrap gap-2">
                      {asset.tags.map(tag => (
                        <span key={tag} className="text-[10px] font-medium text-white/70 bg-white/5 border border-white/10 px-2.5 py-1 rounded-md">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    {/* Downloads Count */}
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground bg-white/5 px-2.5 py-1 rounded-md border border-white/5 whitespace-nowrap">
                      <Download className="w-3.5 h-3.5" />
                      {asset.downloads} uses
                    </div>
                  </div>
                </div>
                
                {/* Bottom Image Mockup (Vercel Style) */}
                <div className="h-44 w-full px-6 translate-y-8 group-hover:translate-y-4 transition-transform duration-500 ease-out relative z-0">
                  <div className="w-full h-full rounded-t-xl border-t border-l border-r border-white/10 overflow-hidden bg-black/80 shadow-[0_-10px_30px_rgba(0,0,0,0.3)] relative">
                    {/* Fake Mac Window Header */}
                    <div className="absolute top-0 left-0 right-0 h-6 bg-black/60 border-b border-white/10 flex items-center px-3 gap-1.5 z-20">
                      <div className="w-2 h-2 rounded-full bg-red-500/80" />
                      <div className="w-2 h-2 rounded-full bg-yellow-500/80" />
                      <div className="w-2 h-2 rounded-full bg-green-500/80" />
                    </div>
                    
                    {/* Mockup Image */}
                    <img 
                      src={asset.image} 
                      alt={asset.title} 
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500 pt-6" 
                    />
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
