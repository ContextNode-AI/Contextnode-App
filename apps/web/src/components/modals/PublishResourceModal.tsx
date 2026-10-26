"use client";

import { useState } from "react";
import { X, Plus, Sparkles, Check, Layers, MessageSquare, Workflow } from "lucide-react";
import { useLayout } from "../layout/LayoutContext";
import { cn } from "@/lib/utils";

export function PublishResourceModal() {
  const { isPublishOpen, setIsPublishOpen } = useLayout();
  const [resourceType, setResourceType] = useState<"pack" | "prompt" | "workflow">("pack");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Development");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [content, setContent] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!isPublishOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setIsPublishOpen(false);
      setTitle("");
      setDescription("");
      setTags("");
      setContent("");
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-none">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
        onClick={() => setIsPublishOpen(false)}
      />

      {/* Modal Dialog */}
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="publish-modal-title"
        className="relative w-full max-w-xl bg-[#05060A] text-white rounded-2xl shadow-2xl border border-[#25343F] overflow-hidden flex flex-col max-h-[90vh] z-10 animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#25343F] bg-[#25343F]/40">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#FE7F2D] bg-[#FE7F2D]/15 border border-[#FE7F2D]/30 px-2 py-0.5 rounded-full w-fit mb-1">
              <Sparkles className="w-3 h-3" />
              <span>Creator Community</span>
            </div>
            <h2 id="publish-modal-title" className="text-base sm:text-lg font-bold text-white">
              Publish AI Resource
            </h2>
            <p className="text-xs text-slate-400">
              Share prompts, context packs, and workflows with the AI developer community.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsPublishOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#25343F] transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        {submitted ? (
          <div className="p-8 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#FE7F2D]/20 border border-[#FE7F2D]/40 text-[#FE7F2D] flex items-center justify-center">
              <Check className="w-6 h-6 stroke-[2.5]" />
            </div>
            <h3 className="text-base font-bold text-white">Resource Submitted!</h3>
            <p className="text-xs text-slate-400 max-w-sm">
              Your resource has been staged for indexing into the ContextNode developer library.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs">
            {/* Resource Type Selector */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Resource Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setResourceType("pack")}
                  className={cn(
                    "flex flex-col items-center gap-1 p-2.5 rounded-xl border text-center transition-all",
                    resourceType === "pack"
                      ? "bg-[#25343F] border-[#FE7F2D] text-white font-semibold shadow-xs"
                      : "bg-[#05060A] border-[#25343F] text-slate-300 hover:bg-[#25343F]/60"
                  )}
                >
                  <Layers className={cn("w-4 h-4", resourceType === "pack" ? "text-[#FE7F2D]" : "text-slate-400")} />
                  <span>Context Pack</span>
                </button>
                <button
                  type="button"
                  onClick={() => setResourceType("prompt")}
                  className={cn(
                    "flex flex-col items-center gap-1 p-2.5 rounded-xl border text-center transition-all",
                    resourceType === "prompt"
                      ? "bg-[#25343F] border-[#FE7F2D] text-white font-semibold shadow-xs"
                      : "bg-[#05060A] border-[#25343F] text-slate-300 hover:bg-[#25343F]/60"
                  )}
                >
                  <MessageSquare className={cn("w-4 h-4", resourceType === "prompt" ? "text-[#FE7F2D]" : "text-slate-400")} />
                  <span>Dev Prompt</span>
                </button>
                <button
                  type="button"
                  onClick={() => setResourceType("workflow")}
                  className={cn(
                    "flex flex-col items-center gap-1 p-2.5 rounded-xl border text-center transition-all",
                    resourceType === "workflow"
                      ? "bg-[#25343F] border-[#FE7F2D] text-white font-semibold shadow-xs"
                      : "bg-[#05060A] border-[#25343F] text-slate-300 hover:bg-[#25343F]/60"
                  )}
                >
                  <Workflow className={cn("w-4 h-4", resourceType === "workflow" ? "text-[#FE7F2D]" : "text-slate-400")} />
                  <span>Workflow</span>
                </button>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Title <span className="text-[#FE7F2D]">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Next.js 15 Server Actions Context Pack"
                className="w-full h-9 px-3 bg-[#25343F]/50 border border-[#25343F] rounded-lg text-white placeholder:text-slate-400 focus:outline-hidden focus:border-[#FE7F2D]/70 focus:ring-1 focus:ring-[#FE7F2D]/50 text-xs"
              />
            </div>

            {/* Category & Tags Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-9 px-3 bg-[#25343F]/50 border border-[#25343F] rounded-lg text-white focus:outline-hidden focus:border-[#FE7F2D]/70 text-xs"
                >
                  <option value="Development" className="bg-[#05060A] text-white">Development</option>
                  <option value="TypeScript" className="bg-[#05060A] text-white">TypeScript</option>
                  <option value="Design" className="bg-[#05060A] text-white">Design</option>
                  <option value="Database" className="bg-[#05060A] text-white">Database</option>
                  <option value="AI Engine" className="bg-[#05060A] text-white">AI Engine</option>
                  <option value="Systems" className="bg-[#05060A] text-white">Systems</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="Next.js, React, Claude 3.5"
                  className="w-full h-9 px-3 bg-[#25343F]/50 border border-[#25343F] rounded-lg text-white placeholder:text-slate-400 focus:outline-hidden focus:border-[#FE7F2D]/70 text-xs"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Description
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief summary of how this resource assists AI developers..."
                className="w-full p-2.5 bg-[#25343F]/50 border border-[#25343F] rounded-lg text-white placeholder:text-slate-400 focus:outline-hidden focus:border-[#FE7F2D]/70 text-xs resize-none"
              />
            </div>

            {/* Content / Prompt Spec */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Prompt Instructions or Context Specification <span className="text-[#FE7F2D]">*</span>
              </label>
              <textarea
                rows={4}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste system instructions, prompt text, or context pack blueprint..."
                className="w-full p-2.5 bg-[#181818] border border-[#25343F] font-mono text-slate-100 rounded-lg text-xs placeholder:text-slate-500 focus:outline-hidden focus:border-[#FE7F2D]/70 focus:ring-1 focus:ring-[#FE7F2D]/50 resize-none leading-relaxed"
              />
            </div>

            {/* Footer Buttons */}
            <div className="pt-2 border-t border-[#25343F] flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsPublishOpen(false)}
                className="px-3 py-2 rounded-lg font-medium text-slate-300 hover:bg-[#25343F] hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg font-bold bg-[#FE7F2D] text-slate-950 hover:bg-[#FE7F2D]/90 transition-colors shadow-xs"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Submit Resource</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
