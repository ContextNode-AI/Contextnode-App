"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { api, ImagePromptVariation } from "@/lib/api";
import {
  Sparkles,
  ArrowLeft,
  Upload,
  Image as ImageIcon,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sliders,
  Send,
  Save,
  Tag,
  Eye,
} from "lucide-react";

const CATEGORIES = [
  "Product",
  "Photography",
  "Portrait",
  "Fashion",
  "Architecture",
  "Cinematic",
  "Illustration",
  "3D",
  "Marketing",
  "Social Media",
  "Concept Art",
];

const AI_TOOLS = [
  "Midjourney",
  "Flux",
  "Stable Diffusion",
  "GPT Image (DALL-E)",
  "Ideogram",
  "Nano Banana",
  "General / Any Model",
];

const ASPECT_RATIOS = ["16:9", "1:1", "4:5", "9:16", "3:2", "Custom"];

const STYLES = [
  "Photorealistic",
  "Cinematic",
  "Product Photography",
  "Editorial",
  "Anime",
  "3D Render",
  "Illustration",
  "Minimal",
  "Fashion",
];

const USE_CASES = [
  "Product Photography",
  "Social Media",
  "Advertising",
  "Portrait",
  "E-commerce",
  "YouTube Thumbnail",
  "Branding",
  "Concept Art",
];

export default function CreateImagePromptPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  // Form State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [category, setCategory] = useState("Product");
  const [shortDescription, setShortDescription] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");

  // Media
  const [previewImageUrl, setPreviewImageUrl] = useState("");
  const [imageUploadMethod, setImageUploadMethod] = useState<"url" | "upload">("url");

  // Parameters
  const [aiTool, setAiTool] = useState("Midjourney");
  const [model, setModel] = useState("Midjourney V7");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [style, setStyle] = useState("Product Photography");
  const [useCase, setUseCase] = useState("Product Photography");

  // Tags
  const [tags, setTags] = useState<string[]>(["luxury", "cinematic", "commercial"]);
  const [tagInput, setTagInput] = useState("");

  // Variations
  const [variations, setVariations] = useState<
    Array<{
      title: string;
      description: string;
      prompt: string;
      previewImageUrl?: string;
    }>
  >([]);

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Auto-generate slug when title changes
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!slugManuallyEdited) {
      const generated = val
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setSlug(generated);
    }
  };

  // Tag management
  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const trimmed = tagInput.trim().toLowerCase().replace(/,/g, "");
      if (trimmed && !tags.includes(trimmed)) {
        setTags([...tags, trimmed]);
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  // Variation management
  const handleAddVariation = () => {
    setVariations([
      ...variations,
      {
        title: `Angle Variation #${variations.length + 1}`,
        description: "",
        prompt: "",
        previewImageUrl: "",
      },
    ]);
  };

  const handleUpdateVariation = (
    index: number,
    field: string,
    value: string
  ) => {
    const updated = [...variations];
    updated[index] = { ...updated[index], [field]: value };
    setVariations(updated);
  };

  const handleRemoveVariation = (index: number) => {
    setVariations(variations.filter((_, i) => i !== index));
  };

  // Image Upload handler (Cloudinary API integration)
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setErrorMsg("Image size exceeds 10MB limit.");
        return;
      }

      setUploadingImage(true);
      setErrorMsg(null);

      try {
        const uploadRes = await api.uploads.uploadImage(file);
        setPreviewImageUrl(uploadRes.url);
        setSuccessMsg("Image uploaded successfully to Cloudinary!");
        setTimeout(() => setSuccessMsg(null), 3000);
      } catch (err: unknown) {
        const msg =
          err instanceof Error
            ? err.message
            : "Failed to upload image to Cloudinary";
        setErrorMsg(
          `${msg}. (Tip: If Cloud Name is not configured yet, you can also paste an Image URL directly).`
        );
      } finally {
        setUploadingImage(false);
      }
    }
  };

  // Form submission
  const handleSubmit = async (targetStatus: "DRAFT" | "PENDING_REVIEW") => {
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!isAuthenticated) {
      setErrorMsg("Aap logged in nahi hain. Kripya save/submit karne se pehle Creator ya Admin account se sign in karein.");
      return;
    }

    // Validation
    if (!title.trim()) {
      setErrorMsg("Title is required.");
      return;
    }
    if (!shortDescription.trim()) {
      setErrorMsg("Short description is required.");
      return;
    }
    if (!prompt.trim()) {
      setErrorMsg("Main prompt text is required.");
      return;
    }
    if (!category.trim()) {
      setErrorMsg("Category is required.");
      return;
    }

    setSubmitting(true);

    try {
      const created = await api.prompts.createCreativeImage({
        title: title.trim(),
        slug: slug.trim() || undefined,
        shortDescription: shortDescription.trim(),
        fullDescription: fullDescription.trim() || undefined,
        prompt: prompt.trim(),
        negativePrompt: negativePrompt.trim() || undefined,
        previewImageUrl: previewImageUrl.trim() || undefined,
        category,
        aiTool,
        model: model.trim() || undefined,
        aspectRatio,
        style,
        useCase,
        tags,
        variations: variations.filter((v) => v.title && v.prompt),
        status: targetStatus,
        accessType: "FREE",
        price: 0,
      });

      if (targetStatus === "PENDING_REVIEW") {
        setSuccessMsg(
          "Prompt submitted successfully! An Admin will review it before publication."
        );
      } else {
        setSuccessMsg("Draft saved successfully.");
      }

      setTimeout(() => {
        router.push("/profile");
      }, 1800);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create prompt";
      setErrorMsg(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05060A] text-slate-100 pt-8 pb-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link
              href="/profile"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Creator Profile</span>
            </Link>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[#FE7F2D]/10 border border-[#FE7F2D]/30 text-[#FE7F2D]">
                <Sparkles className="w-4 h-4" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Create Image Prompt
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Define and submit a complete AI image-generation asset with variations, parameters, and discovery metadata.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleSubmit("DRAFT")}
              disabled={submitting}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#25343F]/50 hover:bg-[#25343F] border border-[#25343F] text-slate-300 text-xs font-semibold transition-all disabled:opacity-50 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Draft</span>
            </button>
            <button
              type="button"
              onClick={() => handleSubmit("PENDING_REVIEW")}
              disabled={submitting}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FE7F2D] hover:bg-[#FE7F2D]/90 text-slate-950 text-xs font-bold shadow-[0_0_20px_rgba(254,127,45,0.25)] transition-all disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Submit for Review</span>
            </button>
          </div>
        </div>

        {/* Notifications */}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-3 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-3 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form Container */}
        <div className="space-y-6">
          {/* ══════════════════════════════════════════════════════════════════
               1. TOP GRID — 2 Columns (Thumbnail / Main Prompt)
               ══════════════════════════════════════════════════════════════════ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            {/* LEFT: Preview / Thumbnail */}
            <div className="p-5 rounded-2xl bg-[#090D14] border border-[#25343F]/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-[#FE7F2D]" />
                    <span>Main Preview / Thumbnail</span>
                  </label>
                  <div className="flex items-center gap-2 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setImageUploadMethod("url")}
                      className={`px-2 py-0.5 rounded ${imageUploadMethod === "url"
                          ? "bg-[#FE7F2D]/20 text-[#FE7F2D] font-bold"
                          : "text-slate-400 hover:text-white"
                        }`}
                    >
                      Image URL
                    </button>
                    <span className="text-slate-600">|</span>
                    <button
                      type="button"
                      onClick={() => setImageUploadMethod("upload")}
                      className={`px-2 py-0.5 rounded ${imageUploadMethod === "upload"
                          ? "bg-[#FE7F2D]/20 text-[#FE7F2D] font-bold"
                          : "text-slate-400 hover:text-white"
                        }`}
                    >
                      Upload File
                    </button>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 mb-3">
                  Representative generated image showing users the visual quality of this prompt.
                </p>

                {imageUploadMethod === "url" ? (
                  <input
                    type="url"
                    value={previewImageUrl}
                    onChange={(e) => setPreviewImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/... or hosted image URL"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#05060A] border border-[#25343F] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FE7F2D]"
                  />
                ) : (
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#25343F] hover:border-[#FE7F2D]/50 rounded-xl p-6 text-center cursor-pointer transition-all bg-[#05060A]/50 relative">
                    {uploadingImage ? (
                      <div className="flex flex-col items-center py-2">
                        <div className="w-6 h-6 border-2 border-[#FE7F2D] border-t-transparent rounded-full animate-spin mb-2" />
                        <span className="text-xs font-semibold text-[#FE7F2D]">
                          Uploading to Cloudinary...
                        </span>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-6 h-6 text-slate-400 mb-2" />
                        <span className="text-xs font-semibold text-slate-300">
                          Click to upload image to Cloudinary (PNG, JPG, WebP)
                        </span>
                        <span className="text-[10px] text-slate-500 mt-1">
                          Max file size: 10MB
                        </span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploadingImage}
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Preview Window */}
              <div className="mt-4 h-48 w-full rounded-xl overflow-hidden bg-[#05060A] border border-[#25343F] flex items-center justify-center relative">
                {previewImageUrl ? (
                  <>
                    <img
                      src={previewImageUrl}
                      alt="Prompt preview"
                      className="w-full h-full object-cover"
                      onError={() => setErrorMsg("Could not load preview image URL.")}
                    />
                    <button
                      type="button"
                      onClick={() => setPreviewImageUrl("")}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/70 hover:bg-rose-950 text-rose-400 border border-rose-500/30 text-[10px] flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remove</span>
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-1 text-slate-500">
                    <ImageIcon className="w-8 h-8 opacity-40" />
                    <span className="text-[11px]">No preview image provided</span>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT: Main Prompt */}
            <div className="p-5 rounded-2xl bg-[#090D14] border border-[#25343F]/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#FE7F2D]" />
                    <span>Main Prompt Text <span className="text-[#FE7F2D]">*</span></span>
                  </label>
                  <span className="text-[11px] font-mono text-slate-400">
                    {prompt.length} chars
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mb-3">
                  The primary text prompt instructions used to generate this image asset.
                </p>

                <textarea
                  rows={8}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. A minimalist luxury perfume bottle sculpted from fractured black obsidian crystal, resting on wet slate under a single vertical directional spotlight, dramatic gold rim light, raytraced glass caustics, shot on Hasselblad H6D-100c, 85mm f/1.8 lens --ar 16:9 --v 6.0 --style raw"
                  className="w-full h-44 px-3.5 py-3 rounded-xl bg-[#05060A] border border-[#25343F] text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-[#FE7F2D] leading-relaxed resize-none"
                  required
                />
              </div>

              {/* Negative Prompt */}
              <div className="mt-4">
                <label className="text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                  <span>Negative Prompt (Optional)</span>
                  <span className="text-[10px] text-slate-500">Artifacts to avoid</span>
                </label>
                <input
                  type="text"
                  value={negativePrompt}
                  onChange={(e) => setNegativePrompt(e.target.value)}
                  placeholder="e.g. ugly, deformed, oversaturated, amateur photography, lowres, text, watermark, blur"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#05060A] border border-[#25343F] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FE7F2D]"
                />
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════════
               2. ASSET IDENTITY & DESCRIPTIONS
               ══════════════════════════════════════════════════════════════════ */}
          <div className="p-5 rounded-2xl bg-[#090D14] border border-[#25343F]/80 space-y-4">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Asset Identity & Discovery
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Title */}
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-slate-300 mb-1 block">
                  Title <span className="text-[#FE7F2D]">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Luxury Obsidian Perfume Bottle Photography"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#05060A] border border-[#25343F] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FE7F2D]"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">
                  Category <span className="text-[#FE7F2D]">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#05060A] border border-[#25343F] text-xs text-white focus:outline-none focus:border-[#FE7F2D]"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Slug */}
              <div className="sm:col-span-3">
                <label className="text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                  <span>Canonical URL Slug</span>
                  <span className="text-[10px] text-slate-500">
                    Auto-generated from title
                  </span>
                </label>
                <div className="flex items-center rounded-xl bg-[#05060A] border border-[#25343F] px-3.5 py-2">
                  <span className="text-xs text-slate-500 font-mono select-none">
                    contextnode.ai/prompts/
                  </span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => {
                      setSlugManuallyEdited(true);
                      setSlug(e.target.value);
                    }}
                    placeholder="luxury-obsidian-perfume-bottle"
                    className="flex-1 bg-transparent border-0 text-xs font-mono text-white placeholder-slate-500 focus:outline-none ml-1"
                  />
                </div>
              </div>

              {/* Short Description */}
              <div className="sm:col-span-3">
                <label className="text-xs font-semibold text-slate-300 mb-1 block">
                  Short Discovery Description <span className="text-[#FE7F2D]">*</span>
                </label>
                <input
                  type="text"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="e.g. Generate premium studio-style product photography of an obsidian bottle with commercial lighting."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#05060A] border border-[#25343F] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FE7F2D]"
                  required
                />
              </div>

              {/* Full Description */}
              <div className="sm:col-span-3">
                <label className="text-xs font-semibold text-slate-300 mb-1 block">
                  Full Usage Notes & Guidance (Optional)
                </label>
                <textarea
                  rows={3}
                  value={fullDescription}
                  onChange={(e) => setFullDescription(e.target.value)}
                  placeholder="Provide context on when to use this prompt, lighting setup recommendations, or required parameter adjustments..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#05060A] border border-[#25343F] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FE7F2D] resize-none"
                />
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════════
               3. PROMPT CONFIGURATION (AI Tool, Model, Aspect Ratio, Style, Use Case)
               ══════════════════════════════════════════════════════════════════ */}
          <div className="p-5 rounded-2xl bg-[#090D14] border border-[#25343F]/80 space-y-4">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-[#FE7F2D]" />
              <span>Generation Parameters</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* AI Tool */}
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">
                  Target AI Tool
                </label>
                <select
                  value={aiTool}
                  onChange={(e) => setAiTool(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#05060A] border border-[#25343F] text-xs text-white focus:outline-none focus:border-[#FE7F2D]"
                >
                  {AI_TOOLS.map((tool) => (
                    <option key={tool} value={tool}>
                      {tool}
                    </option>
                  ))}
                </select>
              </div>

              {/* Model */}
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">
                  Model Version
                </label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="e.g. Midjourney V7, Flux.1 Pro"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#05060A] border border-[#25343F] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FE7F2D]"
                />
              </div>

              {/* Aspect Ratio */}
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">
                  Aspect Ratio
                </label>
                <select
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#05060A] border border-[#25343F] text-xs text-white focus:outline-none focus:border-[#FE7F2D]"
                >
                  {ASPECT_RATIOS.map((ar) => (
                    <option key={ar} value={ar}>
                      {ar}
                    </option>
                  ))}
                </select>
              </div>

              {/* Style */}
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">
                  Style
                </label>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#05060A] border border-[#25343F] text-xs text-white focus:outline-none focus:border-[#FE7F2D]"
                >
                  {STYLES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              {/* Use Case */}
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-slate-300 mb-1 block">
                  Primary Use Case
                </label>
                <select
                  value={useCase}
                  onChange={(e) => setUseCase(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#05060A] border border-[#25343F] text-xs text-white focus:outline-none focus:border-[#FE7F2D]"
                >
                  {USE_CASES.map((uc) => (
                    <option key={uc} value={uc}>
                      {uc}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tags */}
            <div className="pt-2">
              <label className="text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-[#FE7F2D]" />
                <span>Search Keywords / Tags (Press Enter or comma)</span>
              </label>
              <div className="flex flex-wrap items-center gap-2 p-2.5 rounded-xl bg-[#05060A] border border-[#25343F]">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#25343F]/60 border border-[#25343F] text-[11px] text-slate-200"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-slate-400 hover:text-rose-400 ml-0.5 text-xs font-bold"
                    >
                      &times;
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="Add tag..."
                  className="flex-1 min-w-[120px] bg-transparent border-0 text-xs text-white placeholder-slate-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════════
               4. VARIATIONS (Optional Multi-angle Prompts)
               ══════════════════════════════════════════════════════════════════ */}
          <div className="p-5 rounded-2xl bg-[#090D14] border border-[#25343F]/80 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Prompt Variations (Optional)
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Provide complementary prompts (e.g. Front View, 45 Degree Angle, Close-up) for multi-angle generation.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddVariation}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#25343F]/60 hover:bg-[#25343F] border border-[#25343F] text-xs font-semibold text-[#FE7F2D] transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Variation</span>
              </button>
            </div>

            {variations.length === 0 ? (
              <div className="p-6 text-center rounded-xl bg-[#05060A]/50 border border-dashed border-[#25343F]">
                <p className="text-xs text-slate-400">
                  No variations added yet. Click <strong>+ Add Variation</strong> above to provide alternative camera angles or lighting setups.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {variations.map((v, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-[#05060A] border border-[#25343F] space-y-3 relative"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-[#FE7F2D]/20 text-[#FE7F2D] text-[10px] flex items-center justify-center font-bold">
                          {idx + 1}
                        </span>
                        <span>Variation Details</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveVariation(idx)}
                        className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <input
                          type="text"
                          value={v.title}
                          onChange={(e) =>
                            handleUpdateVariation(idx, "title", e.target.value)
                          }
                          placeholder="e.g. 45 Degree Angle View"
                          className="w-full px-3 py-2 rounded-lg bg-[#090D14] border border-[#25343F] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FE7F2D]"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          value={v.description}
                          onChange={(e) =>
                            handleUpdateVariation(
                              idx,
                              "description",
                              e.target.value
                            )
                          }
                          placeholder="Short description of this variation angle..."
                          className="w-full px-3 py-2 rounded-lg bg-[#090D14] border border-[#25343F] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FE7F2D]"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <textarea
                          rows={2}
                          value={v.prompt}
                          onChange={(e) =>
                            handleUpdateVariation(idx, "prompt", e.target.value)
                          }
                          placeholder="Prompt instructions specific to this variation..."
                          className="w-full px-3 py-2 rounded-lg bg-[#090D14] border border-[#25343F] text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-[#FE7F2D] resize-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ══════════════════════════════════════════════════════════════════
               5. REVIEW NOTICE & SUBMISSION ACTIONS
               ══════════════════════════════════════════════════════════════════ */}
          <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 flex-shrink-0">
                <HelpCircle className="w-4 h-4" />
              </span>
              <div>
                <h4 className="text-xs font-bold text-amber-300">
                  Moderation & Review Policy
                </h4>
                <p className="text-[11px] text-amber-200/80 mt-0.5 leading-relaxed">
                  When you click <strong>Submit for Review</strong>, this asset status is set to <code className="text-amber-300 font-mono">PENDING_REVIEW</code>.
                  ContextNode platform administrators review all prompts to ensure output quality, safe content, and accurate tags.
                  Once approved, your prompt will automatically become <strong>LIVE</strong> in the public catalog.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end flex-shrink-0">
              <button
                type="button"
                onClick={() => handleSubmit("DRAFT")}
                disabled={submitting}
                className="px-4 py-2.5 rounded-xl bg-[#25343F]/60 hover:bg-[#25343F] border border-[#25343F] text-slate-200 text-xs font-semibold transition-all disabled:opacity-50 cursor-pointer"
              >
                Save as Draft
              </button>
              <button
                type="button"
                onClick={() => handleSubmit("PENDING_REVIEW")}
                disabled={submitting}
                className="px-5 py-2.5 rounded-xl bg-[#FE7F2D] hover:bg-[#FE7F2D]/90 text-slate-950 text-xs font-bold shadow-[0_0_20px_rgba(254,127,45,0.3)] transition-all disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>{submitting ? "Submitting..." : "Submit for Review"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

