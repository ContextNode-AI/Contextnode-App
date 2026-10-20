"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const FILTERS = [
  "All",
  "Development",
  "Content",
  "Marketing",
  "Business",
  "AI Agents",
  "Design",
  "Productivity"
];

export function SearchFilters() {
  const [activeFilter, setActiveFilter] = useState("All");

  return (
    <section className="py-12 border-y border-white/5 bg-black/20 backdrop-blur-sm sticky top-[72px] z-40">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
          
          {/* Search Bar */}
          <div className="relative w-full md:max-w-md group">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-md opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
            <div className="relative flex items-center bg-[#111115] border border-white/10 rounded-full px-5 py-3 hover:border-white/20 transition-colors">
              <Search className="w-5 h-5 text-white/40 group-focus-within:text-white/80 transition-colors" />
              <input 
                type="text"
                placeholder="Search workflows..."
                className="bg-transparent border-none outline-none text-white placeholder:text-white/40 ml-3 w-full text-sm font-medium"
              />
              <button className="ml-2 p-1.5 rounded-full hover:bg-white/10 transition-colors">
                <SlidersHorizontal className="w-4 h-4 text-white/40 hover:text-white/80" />
              </button>
            </div>
          </div>

          {/* Pill Filters */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar mask-edges">
            {FILTERS.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300",
                  activeFilter === filter
                    ? "bg-white text-black"
                    : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/5"
                )}
              >
                {filter}
              </button>
            ))}
          </div>
          
        </div>
      </div>
    </section>
  );
}
