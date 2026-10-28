"use client";

import { motion } from "framer-motion";
import { ArrowRight, Zap, ListChecks, Layers, Terminal } from "lucide-react";

export function Hero() {
  return (
    <section className="relative pt-10 pb-16 md:pt-16 md:pb-24 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] opacity-50 mix-blend-screen pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] opacity-30 mix-blend-screen pointer-events-none" />
        
        {/* Subtle Grid */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="w-full px-4 sm:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center w-full">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-start text-left"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/80 text-sm font-medium mb-6">
              <Zap className="w-4 h-4 text-blue-400" />
              <span>ContextNode Workflows 2.0</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight mb-6">
              Execute Complete <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                AI Workflows
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-white/60 mb-8 max-w-xl leading-relaxed">
              Discover production-ready workflows for development, content creation, business operations, marketing, research, and AI-assisted execution.
            </p>
            
            <div className="flex flex-wrap items-center gap-4">
              <button className="px-6 py-3 rounded-full bg-white text-black font-semibold hover:bg-white/90 transition-colors flex items-center gap-2">
                Explore Workflows
                <ArrowRight className="w-4 h-4" />
              </button>
              <button className="px-6 py-3 rounded-full bg-white/5 text-white font-medium hover:bg-white/10 border border-white/10 transition-colors">
                Create Workflow
              </button>
            </div>
          </motion.div>

          {/* Right Visual - Workflow Diagram */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative lg:ml-auto w-full max-w-md"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-3xl blur-2xl opacity-50" />
            
            <div className="relative bg-[#0B0B0F]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                  <Terminal className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Build SaaS MVP</h3>
                  <p className="text-white/50 text-sm">Automated Pipeline</p>
                </div>
              </div>

              <div className="space-y-3 relative">
                <div className="absolute left-4 top-2 bottom-6 w-px bg-gradient-to-b from-blue-500/50 via-white/10 to-transparent" />
                
                {[
                  { icon: ListChecks, text: "Research & Planning", active: true },
                  { icon: Layers, text: "Architecture Design", active: true },
                  { icon: Terminal, text: "API Development", active: false },
                  { icon: Zap, text: "Frontend Integration", active: false },
                ].map((step, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 + (i * 0.1) }}
                    className={`flex items-center gap-4 relative z-10 ${step.active ? 'opacity-100' : 'opacity-50'}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${
                      step.active 
                        ? 'bg-blue-500/20 border-blue-500/30 text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.3)]' 
                        : 'bg-[#15151A] border-white/10 text-white/40'
                    }`}>
                      <step.icon className="w-4 h-4" />
                    </div>
                    <div className={`px-4 py-3 rounded-xl border flex-1 ${
                      step.active 
                        ? 'bg-white/5 border-white/10 text-white' 
                        : 'bg-transparent border-transparent text-white/60'
                    }`}>
                      <span className="text-sm font-medium">{step.text}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
