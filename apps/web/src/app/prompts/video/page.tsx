"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { api, ImagePrompt } from "@/lib/api";
import {
  Film,
  Search,
  Filter,
  Copy,
  Check,
  Play,
  Pause,
  ExternalLink,
  Sparkles,
  Camera,
  Clock,
  Layers,
  Sliders,
  Plus,
} from "lucide-react";

const CATEGORIES = [
  "All",
  "Cinematic",
  "Commercial",
  "Sci-Fi",
  "Drone / Aerial",
  "VFX & Motion",
  "Architecture",
  "Character / Portrait",
  "Animation",
  "Nature / Wildlife",
  "Music Video",
];

const AI_TOOLS = [
  "All Tools",
  "Runway Gen-3",
  "OpenAI Sora",
  "Kling AI",
  "Luma Dream Machine",
  "Google Veo 2",
  "Pika 2.0",
];

function VideoCard({ prompt }: { prompt: ImagePrompt }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [copied, setCopied] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleMouseEnter = () => {
    if (videoRef.current && prompt.previewVideoUrl) {
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current && prompt.previewVideoUrl) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const handleCopyPrompt = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(prompt.prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group rounded-2xl bg-[#090D14] border border-[#25343F] hover:border-[#FE7F2D]/60 transition-all duration-300 overflow-hidden flex flex-col justify-between"
    >
      {/* Visual Container */}
      <div className="relative aspect-video w-full bg-black overflow-hidden flex items-center justify-center">
        {prompt.previewVideoUrl ? (
          <video
            ref={videoRef}
            src={prompt.previewVideoUrl}
            poster={prompt.previewImageUrl || undefined}
            muted
            playsInline
            loop
            className="w-full h-full object-cover"
          />
        ) : prompt.previewImageUrl ? (
          <img
            src={prompt.previewImageUrl}
            alt={prompt.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex flex-col items-center gap-1.5 text-slate-500">
            <Film className="w-8 h-8 opacity-40" />
            <span className="text-[11px]">No Video Preview</span>
          </div>
        )}

        {/* Play Overlay Indicator */}
        {prompt.previewVideoUrl && !isPlaying && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center pointer-events-none transition-opacity group-hover:opacity-0">
            <div className="w-10 h-10 rounded-full bg-black/60 border border-white/20 text-white flex items-center justify-center backdrop-blur-xs">
              <Play className="w-4 h-4 fill-white translate-x-0.5" />
            </div>
          </div>
        )}

        {/* AI Tool Badge */}
        {prompt.aiTool && (
          <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-black/75 border border-white/10 backdrop-blur-md text-[10px] font-semibold text-slate-200">
            {prompt.aiTool}
          </div>
        )}

        {/* Duration & FPS Badge */}
        <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-md bg-[#FE7F2D]/20 border border-[#FE7F2D]/40 backdrop-blur-md text-[10px] font-bold text-[#FE7F2D] flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>{prompt.duration || "15s"}</span>
          {prompt.fps ? <span>• {prompt.fps}fps</span> : null}
        </div>
      </div>

      {/* Content & Metadata */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#25343F] text-slate-300">
              {prompt.category}
            </span>
            {prompt.cameraMovement && (
              <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-indigo-950/60 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                <Camera className="w-2.5 h-2.5" />
                {prompt.cameraMovement}
              </span>
            )}
          </div>

          <h3 className="text-sm font-bold text-white group-hover:text-[#FE7F2D] transition-colors line-clamp-1">
            {prompt.title}
          </h3>

          <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {prompt.shortDescription || prompt.prompt}
          </p>
        </div>

        {/* Bottom Actions */}
        <div className="pt-3 border-t border-[#25343F]/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-400 text-[11px]">
            <span>by {prompt.author?.name || "Creator"}</span>
          </div>

          <button
            type="button"
            onClick={handleCopyPrompt}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25343F]/70 hover:bg-[#FE7F2D] hover:text-slate-950 text-slate-200 text-xs font-semibold transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Prompt</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function VideoPromptsPage() {
  const [prompts, setPrompts] = useState<ImagePrompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeTool, setActiveTool] = useState("All Tools");

  useEffect(() => {
    let mounted = true;
    async function loadVideos() {
      try {
        setLoading(true);
        const data = await api.prompts.getPublicVideos();
        if (mounted) {
          setPrompts(data || []);
        }
      } catch (err) {
        console.error("Failed to load video prompts:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadVideos();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredPrompts = useMemo(() => {
    return prompts.filter((p) => {
      const matchCategory =
        activeCategory === "All" ||
        p.category.toLowerCase() === activeCategory.toLowerCase();
      const matchTool =
        activeTool === "All Tools" ||
        (p.aiTool && p.aiTool.toLowerCase().includes(activeTool.toLowerCase()));
      const matchSearch =
        !searchQuery.trim() ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.cameraMovement &&
          p.cameraMovement.toLowerCase().includes(searchQuery.toLowerCase())) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());

      return matchCategory && matchTool && matchSearch;
    });
  }, [prompts, activeCategory, activeTool, searchQuery]);

  return (
    <div className="min-h-screen bg-[#05060A] text-slate-100 pt-8 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Breadcrumbs & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2">
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link href="/prompts" className="hover:text-white transition-colors">
                Prompts
              </Link>
              <span>/</span>
              <span className="text-white font-medium">Video Prompts</span>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-[#FE7F2D]/10 border border-[#FE7F2D]/30 text-[#FE7F2D]">
                <Film className="w-5 h-5" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                AI Video Prompts
              </h1>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Curated, production-grade camera choreography, lighting direction, and scene pacing prompts for Runway Gen-3, OpenAI Sora, Kling AI, and Luma.
            </p>
          </div>

          <Link
            href="/create/creative/video"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#FE7F2D] hover:bg-[#FE7F2D]/90 text-slate-950 font-bold text-xs shadow-[0_0_20px_rgba(254,127,45,0.25)] transition-all cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Create Video Prompt</span>
          </Link>
        </div>

        {/* Search & Tool Filters Bar */}
        <div className="p-4 rounded-2xl bg-[#090D14] border border-[#25343F] mb-6 space-y-3">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search camera motion (e.g. tracking, drone, orbit), styles, keywords..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#05060A] border border-[#25343F] text-xs text-white placeholder-slate-400 focus:outline-hidden focus:border-[#FE7F2D]"
              />
            </div>

            {/* AI Tool Dropdown Filter */}
            <div className="w-full sm:w-56">
              <select
                value={activeTool}
                onChange={(e) => setActiveTool(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#05060A] border border-[#25343F] text-xs text-white focus:outline-hidden focus:border-[#FE7F2D]"
              >
                {AI_TOOLS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar text-xs">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === cat
                    ? "bg-[#FE7F2D] text-slate-950 font-bold"
                    : "bg-[#05060A] hover:bg-[#25343F] text-slate-300 border border-[#25343F]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Video Grid Section */}
        {loading ? (
          <div className="p-16 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-[#FE7F2D] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-400">Loading AI video prompts library...</p>
          </div>
        ) : filteredPrompts.length === 0 ? (
          <div className="p-16 text-center rounded-2xl bg-[#090D14] border border-[#25343F] space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#FE7F2D]/10 text-[#FE7F2D] flex items-center justify-center mx-auto border border-[#FE7F2D]/20">
              <Film className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-white">No Video Prompts Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {searchQuery || activeCategory !== "All" || activeTool !== "All Tools"
                ? "No published prompts match your active filters. Try resetting search or filters."
                : "Be the first creator to submit an AI video prompt! Once approved by Admin, it will be published here."}
            </p>
            <Link
              href="/create/creative/video"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FE7F2D] text-slate-950 font-bold text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Video Prompt</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrompts.map((item) => (
              <VideoCard key={item.id} prompt={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

