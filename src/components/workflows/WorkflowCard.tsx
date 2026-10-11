import { cn } from "@/lib/utils";
import { Clock, BarChart, Bookmark, Users, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface WorkflowCardProps {
  title: string;
  category: string;
  stepCount: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  completionTime: string;
  creator: {
    name: string;
    avatar: string;
  };
  coverImage: string;
  usesCount?: string;
  isTrending?: boolean;
  href?: string;
  className?: string;
}

export function WorkflowCard({
  title,
  category,
  stepCount,
  difficulty,
  completionTime,
  creator,
  coverImage,
  usesCount,
  isTrending,
  href = "#",
  className,
}: WorkflowCardProps) {
  return (
    <Link href={href} className={cn("block group relative", className)}>
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.08] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative h-full flex flex-col rounded-2xl border border-white/[0.08] bg-[#0A0A0C] overflow-hidden transition-all duration-500 hover:border-white/[0.15] hover:shadow-[0_0_30px_rgba(255,255,255,0.03)] hover:-translate-y-1">
        
        {/* Image Section */}
        <div className="relative aspect-[16/9] overflow-hidden bg-[#111115]">
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0C] via-transparent to-transparent z-10" />
          <Image
            src={coverImage}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          
          <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-black/60 backdrop-blur-md border border-white/10 text-white">
                {category}
              </span>
              {isTrending && (
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/20 backdrop-blur-md border border-blue-500/30 text-blue-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                  Trending
                </span>
              )}
            </div>
          </div>
          
          <button className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white/70 hover:text-white hover:bg-black/60 transition-colors">
            <Bookmark className="w-4 h-4" />
          </button>
        </div>

        {/* Content Section */}
        <div className="flex flex-col flex-grow p-5">
          <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1 group-hover:text-blue-400 transition-colors">
            {title}
          </h3>
          
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/50 mb-6 mt-auto">
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-white/70">
                {stepCount}
              </span>
              <span>Steps</span>
            </div>
            <div className="flex items-center gap-1.5">
              <BarChart className="w-4 h-4" />
              <span>{difficulty}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>{completionTime}</span>
            </div>
            {usesCount && (
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                <span>{usesCount}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
            <div className="flex items-center gap-2">
              <div className="relative w-6 h-6 rounded-full overflow-hidden bg-white/10">
                <Image src={creator.avatar} alt={creator.name} fill className="object-cover" />
              </div>
              <span className="text-sm font-medium text-white/70">{creator.name}</span>
            </div>
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
              <ChevronRight className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
