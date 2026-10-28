"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Users, Workflow, Code, PenTool, Layout } from "lucide-react";

const CREATORS = [
  {
    name: "Alex Developer",
    avatar: "https://i.pravatar.cc/150?img=11",
    specialization: "Full-Stack Dev",
    icon: Code,
    workflows: 24,
    uses: "125k",
  },
  {
    name: "Sarah Creates",
    avatar: "https://i.pravatar.cc/150?img=5",
    specialization: "Content & Copy",
    icon: PenTool,
    workflows: 18,
    uses: "89k",
  },
  {
    name: "UI Master",
    avatar: "https://i.pravatar.cc/150?img=32",
    specialization: "Design Systems",
    icon: Layout,
    workflows: 12,
    uses: "64k",
  },
  {
    name: "Founder AI",
    avatar: "https://i.pravatar.cc/150?img=33",
    specialization: "Business Ops",
    icon: Users,
    workflows: 31,
    uses: "210k",
  }
];

export function CreatorSpotlight() {
  return (
    <section className="py-24 relative">
      <div className="w-full px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold text-white mb-3">Top Creators</h2>
            <p className="text-white/60 text-lg">Learn from the best workflow engineers.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CREATORS.map((creator, index) => (
            <motion.div
              key={creator.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group flex flex-col p-6 rounded-2xl bg-[#0B0B0F] border border-white/5 hover:border-white/20 transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-white/10 group-hover:ring-2 ring-blue-500/50 transition-all">
                  <Image src={creator.avatar} alt={creator.name} fill className="object-cover" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">{creator.name}</h3>
                  <div className="flex items-center gap-1.5 text-sm text-white/50">
                    <creator.icon className="w-4 h-4" />
                    {creator.specialization}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/5">
                <div>
                  <div className="text-sm text-white/50 mb-1 flex items-center gap-1.5">
                    <Workflow className="w-4 h-4" /> Workflows
                  </div>
                  <div className="text-lg font-semibold text-white">{creator.workflows}</div>
                </div>
                <div>
                  <div className="text-sm text-white/50 mb-1 flex items-center gap-1.5">
                    <Users className="w-4 h-4" /> Total Uses
                  </div>
                  <div className="text-lg font-semibold text-white">{creator.uses}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
