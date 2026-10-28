"use client";

import { motion } from "framer-motion";
import { MousePointerClick, Play, Target } from "lucide-react";

const STEPS = [
  {
    icon: MousePointerClick,
    title: "Choose Workflow",
    description: "Find a proven execution system built by experts in your domain.",
    delay: 0.2
  },
  {
    icon: Play,
    title: "Follow Execution Steps",
    description: "Execute each AI prompt in sequence to complete your objective.",
    delay: 0.4
  },
  {
    icon: Target,
    title: "Get Predictable Results",
    description: "Achieve consistent, high-quality outputs instead of guessing prompts.",
    delay: 0.6
  }
];

export function WorkflowProcess() {
  return (
    <section className="py-32 relative overflow-hidden bg-black border-y border-white/5">
      {/* Background glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[800px] h-[300px] bg-blue-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="w-full px-4 sm:px-6 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How Workflows Work</h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Stop starting from scratch. Use systematic processes to guarantee results.
          </p>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          {STEPS.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: step.delay }}
              className="relative flex flex-col items-center text-center group"
            >
              <div className="w-24 h-24 rounded-2xl bg-[#111115] border border-white/10 flex items-center justify-center mb-6 relative z-10 group-hover:border-blue-500/50 group-hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] transition-all duration-500">
                <step.icon className="w-10 h-10 text-blue-400" />
              </div>
              
              <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
              <p className="text-white/60 leading-relaxed max-w-xs">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
