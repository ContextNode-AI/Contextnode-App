"use client";

import { use, useState, useEffect, useRef } from "react";
import { PROMPTS, type Prompt } from "@/lib/data";
import { getPromptBySlug, getSimilarPrompts } from "@/lib/promptsApi";
import { notFound } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Copy, Check, Share2, Sparkles, User, Database, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

function AdSenseZone({ type }: { type: "sidebar" | "leaderboard" }) {
  const [hasAd, setHasAd] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkAdStatus = () => {
      if (typeof window !== "undefined" && !(window as any).adsbygoogle) {
        if (document.readyState === "complete") {
          setHasAd(false);
        }
      }

      const insElement = containerRef.current?.querySelector("ins");
      if (insElement) {
        const status = insElement.getAttribute("data-ad-status");
        if (status === "unfilled" || status === "empty") {
          setHasAd(false);
        }
      }
    };

    const checkTimer = setTimeout(checkAdStatus, 3000);

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes" && mutation.attributeName === "data-ad-status") {
          checkAdStatus();
        }
      });
    });

    if (containerRef.current) {
      observer.observe(containerRef.current, { attributes: true, subtree: true });
    }

    window.addEventListener("load", checkAdStatus);

    return () => {
      clearTimeout(checkTimer);
      observer.disconnect();
      window.removeEventListener("load", checkAdStatus);
    };
  }, []);

  if (!hasAd) return null;

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative rounded-2xl border border-white/5 bg-white/[0.01] overflow-hidden transition-all duration-300 flex flex-col items-center justify-center group/ad",
        type === "sidebar" ? "min-h-[180px] p-4 mt-2 w-full" : "min-h-[100px] p-6 mb-12 w-full"
      )}
    >
      <button 
        onClick={() => setHasAd(false)} 
        className="absolute top-2 right-2 text-[10px] text-white/20 hover:text-white bg-white/5 hover:bg-white/10 px-1.5 py-0.5 rounded transition-all opacity-0 group-hover/ad:opacity-100"
        title="Simulate ad failure or hide"
      >
        × Hide
      </button>

      <span className="text-[9px] uppercase tracking-widest text-white/30 absolute top-2 left-3 font-semibold">
        Advertisement
      </span>

      <div className="text-center pointer-events-none select-none">
        <div className="text-white/20 text-xs font-mono mb-1">
          {type === "sidebar" ? "Google AdSense Slot" : "Google AdSense Leaderboard"}
        </div>
        <div className="text-[10px] text-white/10 font-mono">
          {type === "sidebar" ? "Recommended: 300x250 Display Ad" : "Recommended: 728x90 or Responsive Banner"}
        </div>
      </div>
    </div>
  );
}

export default function PromptDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const staticMatch = PROMPTS.find((p) => p.slug === slug) || null;

  const [prompt, setPrompt] = useState<Prompt | null>(staticMatch);
  const [relatedPrompts, setRelatedPrompts] = useState<Prompt[]>(() => {
    if (staticMatch) {
      return PROMPTS.filter((p) => p.id !== staticMatch.id && (p.category === staticMatch.category || p.id % 2 === 0)).slice(0, 3);
    }
    return [];
  });
  const [loading, setLoading] = useState<boolean>(!staticMatch);
  const [activeTab, setActiveTab] = useState<string>(staticMatch?.models?.[0] || "Midjourney v6");
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const livePrompt = await getPromptBySlug(slug);
        if (!isMounted) return;
        if (livePrompt) {
          setPrompt(livePrompt);
          setActiveTab((prev) => (livePrompt.models?.includes(prev) ? prev : livePrompt.models?.[0] || "Midjourney v6"));

          const similar = await getSimilarPrompts(slug, livePrompt.category, 3);
          if (isMounted) {
            setRelatedPrompts(similar);
          }
        } else {
          setPrompt(null);
        }
      } catch (err) {
        console.error("Error loading prompt detail:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (!loading && !prompt) {
    notFound();
  }

  if (loading && !prompt) {
    return (
      <div className="min-h-screen bg-[#050505] pt-32 pb-24 relative overflow-hidden text-white flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white animate-spin" />
      </div>
    );
  }

  const currentPrompt = prompt!;

  const getFormattedPrompt = (model: string) => {
    const text = currentPrompt.promptText;
    if (model.toLowerCase().includes("midjourney")) {
      return `${text} --ar 16:9 --v 6.0 --style raw`;
    }
    if (model.toLowerCase().includes("dall-e") || model.toLowerCase().includes("gpt")) {
      return `Generate an image: ${text}`;
    }
    if (model.toLowerCase().includes("stable diffusion") || model.toLowerCase().includes("flux")) {
      return `${text}, highly detailed, 8k resolution, photorealistic, cinematic lighting`;
    }
    return text;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getFormattedPrompt(activeTab));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleShare = async () => {
    if (typeof window === "undefined") return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: currentPrompt.title,
          text: currentPrompt.promptText,
          url: window.location.href,
        });
      } catch {
        // ignore canceled share
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      } catch {
        // ignore
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] pt-32 pb-24 relative overflow-hidden text-white">
      {/* Background decoration */}
      <div className="absolute inset-0 grid-background opacity-20 pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container max-w-6xl mx-auto px-6 relative z-10">
        {/* Back Link */}
        <Link 
          href="/prompts"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Prompts
        </Link>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
          
          {/* Left Column: Image Showcase */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative rounded-3xl overflow-hidden border border-white/10 bg-white/5 shadow-2xl group"
            >
              <img 
                src={currentPrompt.image} 
                alt={currentPrompt.title} 
                className="w-full h-auto object-contain bg-[#0c0c0e] max-h-[75vh] mx-auto block transition-transform duration-700 group-hover:scale-[1.01]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
            </motion.div>
          </div>

          {/* Right Column: Info & Copy Panel */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-col gap-6"
            >
              {/* Category & Badge Row */}
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-semibold tracking-wide text-white uppercase">
                  {currentPrompt.category}
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5" />
                  {currentPrompt.copies} downloads
                </span>
              </div>

              {/* Title */}
              <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">
                  {currentPrompt.title}
                </h1>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <User className="w-4 h-4 text-white/40" />
                  <span>Created by <b>{currentPrompt.author}</b></span>
                </p>
              </div>

              {/* Terminal-Style Prompt Block with Tabs */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between px-1">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    AI Generation Prompt
                  </label>
                  <span className="text-[10px] text-muted-foreground bg-white/5 px-2 py-0.5 rounded border border-white/10">
                    {activeTab.split(" ")[0]} Format
                  </span>
                </div>

                {/* Tabs */}
                <div className="flex gap-1.5 border-b border-white/10 pb-2 overflow-x-auto hide-scrollbar">
                  {currentPrompt.models.map((model) => (
                    <button
                      key={model}
                      onClick={() => setActiveTab(model)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 border border-transparent whitespace-nowrap",
                        activeTab === model
                          ? "bg-white text-black font-bold"
                          : "text-muted-foreground hover:text-white hover:bg-white/5"
                      )}
                    >
                      {model}
                    </button>
                  ))}
                </div>

                <div className="relative group rounded-2xl border border-white/10 bg-[#0B0B0F]/90 backdrop-blur-xl p-5 shadow-inner">
                  {/* Subtle terminal header */}
                  <div className="flex items-center gap-1.5 mb-3 opacity-60">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                  </div>
                  <p className="text-sm text-white/90 leading-relaxed font-mono select-all break-words">
                    {getFormattedPrompt(activeTab)}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleCopy}
                  className={cn(
                    "flex-1 py-4 px-6 rounded-2xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2.5 shadow-lg",
                    copied 
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                      : "bg-white text-black hover:bg-white/90"
                  )}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy Prompt Text
                    </>
                  )}
                </button>
                <button 
                  onClick={handleShare}
                  title="Share Prompt"
                  className="p-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-white flex items-center justify-center shadow-lg"
                >
                  {shared ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                </button>
              </div>
            </motion.div>

            {/* Bottom Details/Tags */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-8 pt-8 border-t border-white/5 flex flex-col gap-6"
            >
              <div>
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
                  Compatible Models
                </span>
                <div className="flex flex-wrap gap-2">
                  {currentPrompt.models.map((model) => (
                    <span 
                      key={model}
                      className="px-3 py-1 bg-[#121217] border border-white/5 hover:border-white/10 transition-colors rounded-lg text-xs font-medium text-white/80"
                    >
                      {model}
                    </span>
                  ))}
                </div>
              </div>

              {/* Sidebar Display Ad Slot */}
              <AdSenseZone type="sidebar" />
            </motion.div>

          </div>
        </div>

        {/* AdSense Leaderboard Slot */}
        <AdSenseZone type="leaderboard" />

        {/* Related Prompts Section */}
        <div className="border-t border-white/5 pt-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              Similar Prompts
            </h2>
            <Link href="/prompts" className="text-sm font-semibold text-muted-foreground hover:text-white transition-colors">
              Browse all prompts &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {relatedPrompts.map((p) => (
              <motion.div
                key={p.id}
                className="group relative rounded-2xl overflow-hidden border border-white/5 bg-white/[0.02] hover:border-white/10 transition-colors cursor-pointer"
              >
                <Link href={`/prompts/${p.slug}`}>
                  <div className="aspect-[4/3] w-full overflow-hidden bg-white/5">
                    <img 
                      src={p.image} 
                      alt={p.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                        {p.category}
                      </span>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Copy className="w-2.5 h-2.5" />
                        {p.copies}
                      </span>
                    </div>
                    <h3 className="font-semibold text-base text-white group-hover:text-white/80 transition-colors line-clamp-1">
                      {p.title}
                    </h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
