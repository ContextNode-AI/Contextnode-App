"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { api, ImagePromptVariation } from "@/lib/api";
import {
  Video,
  Sparkles,
  Save,
  Send,
  Upload,
  Link2,
  Trash2,
  Plus,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Film,
  Camera,
  Layers,
  Sliders,
  Clock,
  Play,
  Image as ImageIcon,
} from "lucide-react";

export default function CreateVideoPromptPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  // Form State - Identity
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [category, setCategory] = useState("Cinematic");
  const [shortDescription, setShortDescription] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");

  // Media (Video & Poster)
  const [previewVideoUrl, setPreviewVideoUrl] = useState("");
  const [previewImageUrl, setPreviewImageUrl] = useState(""); // Poster thumbnail
  const [videoInputMethod, setVideoInputMethod] = useState<"upload" | "url">("upload");
  const [posterInputMethod, setPosterInputMethod] = useState<"upload" | "url">("upload");

  // Video Parameters & Camera Choreography
  const [aiTool, setAiTool] = useState("Runway Gen-3");
  const [model, setModel] = useState("Gen-3 Alpha Turbo");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [duration, setDuration] = useState("15s");
  const [fps, setFps] = useState<number>(60);
  const [motionStrength, setMotionStrength] = useState<number>(8);
  const [cameraMovement, setCameraMovement] = useState("Dynamic Tracking");
  const [seed, setSeed] = useState("");

  // Keyframes (Image-to-Video)
  const [firstFrameImageUrl, setFirstFrameImageUrl] = useState("");
  const [firstFramePrompt, setFirstFramePrompt] = useState("");
  const [lastFrameImageUrl, setLastFrameImageUrl] = useState("");
  const [lastFramePrompt, setLastFramePrompt] = useState("");

  // Tags
  const [tags, setTags] = useState<string[]>(["cinematic", "4k", "hyper-realistic", "tracking"]);
  const [tagInput, setTagInput] = useState("");

  // Multi-Scene Storyboard Variations
  const [variations, setVariations] = useState<ImagePromptVariation[]>([
    {
      title: "Scene 1: Approach Shot",
      prompt: "Low-angle dynamic tracking camera matching vehicle acceleration, neon rim highlights, wet asphalt caustics --motion 8 --fps 60",
      description: "Opening 5-second tracking approach",
      orderIndex: 0,
    },
  ]);

  // UI status
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingPoster, setUploadingPoster] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Auto-generate slug from title
  useEffect(() => {
    if (!slugManuallyEdited && title.trim()) {
      const generated = title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setSlug(generated);
    }
  }, [title, slugManuallyEdited]);

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlugManuallyEdited(true);
    setSlug(e.target.value);
  };

  const handleRegenerateSlug = () => {
    const generated = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setSlug(generated);
    setSlugManuallyEdited(false);
  };

  // Tags handlers
  const handleAddTag = () => {
    const val = tagInput.trim().toLowerCase();
    if (val && !tags.includes(val)) {
      setTags([...tags, val]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  // Storyboard Variations handlers
  const handleAddVariation = () => {
    setVariations([
      ...variations,
      {
        title: `Scene ${variations.length + 1}`,
        prompt: "",
        description: "",
        orderIndex: variations.length,
      },
    ]);
  };

  const handleUpdateVariation = (
    index: number,
    field: keyof ImagePromptVariation,
    value: string
  ) => {
    const updated = [...variations];
    updated[index] = { ...updated[index], [field]: value };
    setVariations(updated);
  };

  const handleRemoveVariation = (index: number) => {
    setVariations(variations.filter((_, i) => i !== index));
  };

  // Video Upload Handler
  const handleVideoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) {
        setErrorMsg("Video size exceeds 100MB limit.");
        return;
      }

      setUploadingVideo(true);
      setErrorMsg(null);

      try {
        const uploadRes = await api.uploads.uploadVideo(file);
        setPreviewVideoUrl(uploadRes.url);
        if (uploadRes.posterUrl && !previewImageUrl) {
          setPreviewImageUrl(uploadRes.posterUrl);
        }
        setSuccessMsg("Video uploaded successfully!");
        setTimeout(() => setSuccessMsg(null), 3000);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Failed to upload video";
        setErrorMsg(
          `${msg}. (Tip: You can also toggle to 'Video URL' mode and paste a direct MP4/WebM URL).`
        );
      } finally {
        setUploadingVideo(false);
      }
    }
  };

  // Poster Image Upload Handler
  const handlePosterFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setErrorMsg("Poster image size exceeds 10MB limit.");
        return;
      }

      setUploadingPoster(true);
      setErrorMsg(null);

      try {
        const uploadRes = await api.uploads.uploadImage(file);
        setPreviewImageUrl(uploadRes.url);
        setSuccessMsg("Poster thumbnail uploaded successfully!");
        setTimeout(() => setSuccessMsg(null), 3000);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Failed to upload poster";
        setErrorMsg(msg);
      } finally {
        setUploadingPoster(false);
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
      setErrorMsg("Master video prompt text is required.");
      return;
    }
    if (!category.trim()) {
      setErrorMsg("Category is required.");
      return;
    }

    setSubmitting(true);

    try {
      const created = await api.prompts.createCreativeVideo({
        title: title.trim(),
        slug: slug.trim() || undefined,
        shortDescription: shortDescription.trim(),
        fullDescription: fullDescription.trim() || undefined,
        prompt: prompt.trim(),
        negativePrompt: negativePrompt.trim() || undefined,
        previewVideoUrl: previewVideoUrl.trim() || undefined,
        previewImageUrl: previewImageUrl.trim() || undefined,
        category,
        aiTool,
        model: model.trim() || undefined,
        aspectRatio,
        duration,
        fps,
        motionStrength,
        cameraMovement,
        seed: seed.trim() || undefined,
        firstFrameImageUrl: firstFrameImageUrl.trim() || undefined,
        firstFramePrompt: firstFramePrompt.trim() || undefined,
        lastFrameImageUrl: lastFrameImageUrl.trim() || undefined,
        lastFramePrompt: lastFramePrompt.trim() || undefined,
        tags,
        variations: variations.filter((v) => v.title && v.prompt),
        status: targetStatus,
        accessType: "FREE",
        price: 0,
      });

      if (targetStatus === "PENDING_REVIEW") {
        setSuccessMsg(
          "Video prompt submitted successfully! An Admin will review it before publication."
        );
      } else {
        setSuccessMsg("Draft saved successfully.");
      }

      setTimeout(() => {
        router.push("/profile");
      }, 1800);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create video prompt";
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
                <Film className="w-4 h-4" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Create Video Prompt
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Author and publish complete AI video-generation assets with camera choreography, frame control, and multi-scene storyboard breakdowns.
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
               1. TOP GRID — 2 Columns (Video Preview / Master Video Prompt)
               ══════════════════════════════════════════════════════════════════ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            
            {/* LEFT: Video Preview & Poster */}
            <div className="p-5 rounded-2xl bg-[#090D14] border border-[#25343F]/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-[#FE7F2D]" />
                    Video Preview & Poster <span className="text-[#FE7F2D]">*</span>
                  </span>
                  
                  {/* Method Switcher */}
                  <div className="flex items-center bg-[#05060A] p-0.5 rounded-lg border border-[#25343F]/60 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setVideoInputMethod("upload")}
                      className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                        videoInputMethod === "upload"
                          ? "bg-[#FE7F2D] text-slate-950 font-bold"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Upload MP4
                    </button>
                    <button
                      type="button"
                      onClick={() => setVideoInputMethod("url")}
                      className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                        videoInputMethod === "url"
                          ? "bg-[#FE7F2D] text-slate-950 font-bold"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Video URL
                    </button>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 mb-4">
                  Rendered video output file (MP4/WebM) and optional catalog poster thumbnail.
                </p>

                {/* Video Player Display if loaded */}
                {previewVideoUrl ? (
                  <div className="relative group rounded-xl overflow-hidden border border-[#25343F] bg-black aspect-video mb-4">
                    <video
                      src={previewVideoUrl}
                      poster={previewImageUrl || undefined}
                      controls
                      playsInline
                      className="w-full h-full object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => setPreviewVideoUrl("")}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/70 hover:bg-rose-950 text-slate-300 hover:text-rose-300 border border-white/10 transition-colors"
                      title="Remove video"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div>
                    {videoInputMethod === "upload" ? (
                      <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#25343F] hover:border-[#FE7F2D]/50 rounded-xl p-6 text-center cursor-pointer transition-colors bg-[#05060A]/40 min-h-[160px]">
                        <input
                          type="file"
                          accept="video/mp4,video/webm,video/quicktime"
                          onChange={handleVideoFileChange}
                          disabled={uploadingVideo}
                          className="hidden"
                        />
                        <div className="p-3 rounded-full bg-[#FE7F2D]/10 text-[#FE7F2D] mb-3">
                          <Upload className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-semibold text-slate-200">
                          {uploadingVideo ? "Uploading video..." : "Click to upload video (MP4, WebM)"}
                        </span>
                        <span className="text-[10px] text-slate-400 mt-1">
                          Max file size: 100MB
                        </span>
                      </label>
                    ) : (
                      <div className="relative mb-3">
                        <Link2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="url"
                          placeholder="https://example.com/generated-video.mp4"
                          value={previewVideoUrl}
                          onChange={(e) => setPreviewVideoUrl(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#05060A] border border-[#25343F] text-xs text-white placeholder-slate-400 focus:outline-hidden focus:border-[#FE7F2D]"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Poster / Thumbnail Option */}
                <div className="pt-3 border-t border-[#25343F]/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                      <ImageIcon className="w-3 h-3 text-slate-400" />
                      Catalog Poster Thumbnail <span className="text-slate-400 font-normal">(Optional)</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setPosterInputMethod(posterInputMethod === "upload" ? "url" : "upload")}
                      className="text-[10px] text-[#FE7F2D] hover:underline"
                    >
                      {posterInputMethod === "upload" ? "Switch to URL" : "Switch to Upload"}
                    </button>
                  </div>

                  {previewImageUrl ? (
                    <div className="flex items-center justify-between p-2 rounded-lg bg-[#05060A] border border-[#25343F]">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <img
                          src={previewImageUrl}
                          alt="Poster"
                          className="w-10 h-10 object-cover rounded-md flex-shrink-0"
                        />
                        <span className="text-[11px] text-slate-300 truncate max-w-[200px]">
                          {previewImageUrl}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPreviewImageUrl("")}
                        className="text-slate-400 hover:text-rose-400 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : posterInputMethod === "upload" ? (
                    <label className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border border-dashed border-[#25343F] hover:border-slate-500 text-xs text-slate-400 cursor-pointer bg-[#05060A]/30 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePosterFileChange}
                        disabled={uploadingPoster}
                        className="hidden"
                      />
                      <Upload className="w-3.5 h-3.5 text-slate-400" />
                      <span>{uploadingPoster ? "Uploading poster..." : "Upload Poster Image (PNG, JPG)"}</span>
                    </label>
                  ) : (
                    <input
                      type="url"
                      placeholder="https://example.com/poster.jpg"
                      value={previewImageUrl}
                      onChange={(e) => setPreviewImageUrl(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#05060A] border border-[#25343F] text-xs text-white placeholder-slate-400 focus:outline-hidden focus:border-[#FE7F2D]"
                    />
                  )}
                </div>
              </div>

              <span className="text-[10px] text-slate-400 mt-3 block">
                This video represents the example generated output asset, not the prompt text itself.
              </span>
            </div>

            {/* RIGHT: Master Video Prompt */}
            <div className="p-5 rounded-2xl bg-[#090D14] border border-[#25343F]/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#FE7F2D]" />
                    Master Video Prompt <span className="text-[#FE7F2D]">*</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {prompt.length} chars
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mb-3">
                  Primary creative direction, motion pacing, and visual style for the video generator.
                </p>

                <textarea
                  rows={9}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe the cinematic scene, camera choreography, subject motion, lighting, and atmosphere in rich detail... e.g. Cinematic 35mm film shot of a matte black futuristic hypercar accelerating through a wet concrete tunnel at dusk, headlights piercing through dense mist, high contrast neon light streaks, low-angle dynamic tracking camera matching car velocity, slow motion 60fps --motion 8 --duration 15s"
                  className="w-full p-3.5 rounded-xl bg-[#05060A] border border-[#25343F] text-xs text-slate-100 placeholder-slate-400 focus:outline-hidden focus:border-[#FE7F2D] transition-colors resize-none leading-relaxed font-sans"
                />
              </div>

              <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                <span>Tip: Specify lens optics (35mm/anamorphic), lighting, and camera motion speed.</span>
              </div>
            </div>

          </div>

          {/* ══════════════════════════════════════════════════════════════════
               2. SECOND GRID — Identity & Descriptions (2 Columns)
               ══════════════════════════════════════════════════════════════════ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Identity */}
            <div className="p-5 rounded-2xl bg-[#090D14] border border-[#25343F]/80 space-y-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Asset Identity
                </h3>
                <p className="text-[11px] text-slate-400">
                  Naming, canonical URL slug, and primary classification.
                </p>
              </div>

              {/* Title */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Title <span className="text-[#FE7F2D]">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Cinematic Futuristic Hypercar Tunnel Acceleration"
                  className="w-full px-3 py-2 rounded-xl bg-[#05060A] border border-[#25343F] text-xs text-white placeholder-slate-400 focus:outline-hidden focus:border-[#FE7F2D]"
                />
              </div>

              {/* Slug */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-semibold text-slate-300">
                    Slug <span className="text-[#FE7F2D]">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleRegenerateSlug}
                    className="text-[10px] text-[#FE7F2D] hover:underline"
                  >
                    Auto-generate from Title
                  </button>
                </div>
                <input
                  type="text"
                  value={slug}
                  onChange={handleSlugChange}
                  placeholder="cinematic-futuristic-hypercar-tunnel-acceleration"
                  className="w-full px-3 py-2 rounded-xl bg-[#05060A] border border-[#25343F] text-xs text-slate-300 font-mono focus:outline-hidden focus:border-[#FE7F2D]"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  URL: /prompts/video/{slug || "slug-preview"}
                </span>
              </div>

              {/* Category */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Primary Category <span className="text-[#FE7F2D]">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#05060A] border border-[#25343F] text-xs text-white focus:outline-hidden focus:border-[#FE7F2D]"
                >
                  <option value="Cinematic">Cinematic</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Sci-Fi">Sci-Fi</option>
                  <option value="Drone / Aerial">Drone / Aerial</option>
                  <option value="VFX & Motion">VFX & Motion</option>
                  <option value="Architecture">Architecture</option>
                  <option value="Character / Portrait">Character / Portrait</option>
                  <option value="Animation">Animation</option>
                  <option value="Nature / Wildlife">Nature / Wildlife</option>
                  <option value="Music Video">Music Video</option>
                </select>
              </div>
            </div>

            {/* Descriptions */}
            <div className="p-5 rounded-2xl bg-[#090D14] border border-[#25343F]/80 space-y-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Asset Descriptions
                </h3>
                <p className="text-[11px] text-slate-400">
                  Concise discovery summaries and extended video direction context.
                </p>
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Short Description <span className="text-[#FE7F2D]">*</span>
                </label>
                <textarea
                  rows={2}
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  maxLength={160}
                  placeholder="e.g. Cinematic 35mm film shot of a matte black futuristic hypercar accelerating through a wet concrete tunnel at dusk."
                  className="w-full p-2.5 rounded-xl bg-[#05060A] border border-[#25343F] text-xs text-white placeholder-slate-400 focus:outline-hidden focus:border-[#FE7F2D] resize-none"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Concise summary explaining what the video prompt generates (max 160 chars).
                </span>
              </div>

              {/* Full Description */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Full Description <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  rows={4}
                  value={fullDescription}
                  onChange={(e) => setFullDescription(e.target.value)}
                  placeholder="Detailed explanation of what the prompt produces, pacing instructions, lighting design, expected audio synchronization, and post-processing color grading notes..."
                  className="w-full p-2.5 rounded-xl bg-[#05060A] border border-[#25343F] text-xs text-white placeholder-slate-400 focus:outline-hidden focus:border-[#FE7F2D] resize-none leading-relaxed"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Provide helpful context for video creators. Do not put the actual prompt here.
                </span>
              </div>
            </div>

          </div>

          {/* ══════════════════════════════════════════════════════════════════
               3. Video Engine & Camera Choreography
               ══════════════════════════════════════════════════════════════════ */}
          <div className="p-5 rounded-2xl bg-[#090D14] border border-[#25343F]/80 space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-[#FE7F2D]" />
                Video Engine & Camera Choreography
              </span>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Configure AI video generator specifications, frame rate, motion velocity, and camera movement.
              </p>
            </div>

            {/* Negative Prompt */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Negative Prompt <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <textarea
                rows={2}
                value={negativePrompt}
                onChange={(e) => setNegativePrompt(e.target.value)}
                placeholder="e.g. jerky motion, morphing, jittery camera, temporal flickering, warped faces, artifacts, blurry frames, watermark, logo, text, low quality"
                className="w-full p-2.5 rounded-xl bg-[#05060A] border border-[#25343F] text-xs text-white placeholder-slate-400 focus:outline-hidden focus:border-[#FE7F2D] resize-none"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Artifacts or motion flaws to avoid. Stored independently and never mixed with the master prompt.
              </span>
            </div>

            {/* Controls Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 border-t border-[#25343F]/60">
              {/* AI Tool */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  AI Video Tool
                </label>
                <select
                  value={aiTool}
                  onChange={(e) => setAiTool(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#05060A] border border-[#25343F] text-xs text-white focus:outline-hidden focus:border-[#FE7F2D]"
                >
                  <option value="Runway Gen-3">Runway Gen-3</option>
                  <option value="OpenAI Sora">OpenAI Sora</option>
                  <option value="Kling AI">Kling AI</option>
                  <option value="Luma Dream Machine">Luma Dream Machine</option>
                  <option value="Google Veo 2">Google Veo 2</option>
                  <option value="Pika 2.0">Pika 2.0</option>
                  <option value="Minimax Hailuo">Minimax Hailuo</option>
                  <option value="General / Any Model">General / Any Model</option>
                </select>
              </div>

              {/* Model */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Model Version
                </label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="e.g. Gen-3 Alpha Turbo"
                  className="w-full px-3 py-2 rounded-xl bg-[#05060A] border border-[#25343F] text-xs text-white placeholder-slate-400 focus:outline-hidden focus:border-[#FE7F2D]"
                />
              </div>

              {/* Aspect Ratio */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Aspect Ratio
                </label>
                <select
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#05060A] border border-[#25343F] text-xs text-white focus:outline-hidden focus:border-[#FE7F2D]"
                >
                  <option value="16:9">16:9 (Landscape / Cinema)</option>
                  <option value="9:16">9:16 (Vertical Story / Reels)</option>
                  <option value="1:1">1:1 (Square)</option>
                  <option value="2.39:1">2.39:1 (Anamorphic Scope)</option>
                  <option value="4:3">4:3 (Vintage TV)</option>
                </select>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Duration
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#05060A] border border-[#25343F] text-xs text-white focus:outline-hidden focus:border-[#FE7F2D]"
                >
                  <option value="5s">5 Seconds</option>
                  <option value="10s">10 Seconds</option>
                  <option value="15s">15 Seconds</option>
                  <option value="30s">30 Seconds</option>
                  <option value="60s">60 Seconds (1 min)</option>
                </select>
              </div>

              {/* Frame Rate (FPS) */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Frame Rate (FPS)
                </label>
                <select
                  value={fps}
                  onChange={(e) => setFps(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-[#05060A] border border-[#25343F] text-xs text-white focus:outline-hidden focus:border-[#FE7F2D]"
                >
                  <option value={24}>24 FPS (Cinematic Film)</option>
                  <option value={30}>30 FPS (Standard Broadcast)</option>
                  <option value={60}>60 FPS (High-Speed Motion)</option>
                  <option value={120}>120 FPS (Extreme Slow Motion)</option>
                </select>
              </div>

              {/* Motion Strength */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Motion Strength (1-10)
                </label>
                <select
                  value={motionStrength}
                  onChange={(e) => setMotionStrength(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-[#05060A] border border-[#25343F] text-xs text-white focus:outline-hidden focus:border-[#FE7F2D]"
                >
                  <option value={2}>2 - Subtle Ambient Drift</option>
                  <option value={5}>5 - Natural Motion</option>
                  <option value={7}>7 - Dynamic Cinematic</option>
                  <option value={8}>8 - High Velocity</option>
                  <option value={10}>10 - Extreme Action</option>
                </select>
              </div>

              {/* Camera Movement */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Camera Movement
                </label>
                <select
                  value={cameraMovement}
                  onChange={(e) => setCameraMovement(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#05060A] border border-[#25343F] text-xs text-white focus:outline-hidden focus:border-[#FE7F2D]"
                >
                  <option value="Dynamic Tracking">Dynamic Tracking</option>
                  <option value="Static / Locked-off">Static / Locked-off</option>
                  <option value="Pan Left / Right">Pan Left / Right</option>
                  <option value="Tilt Up / Down">Tilt Up / Down</option>
                  <option value="Zoom In / Push-in">Zoom In / Push-in</option>
                  <option value="Zoom Out / Pull-out">Zoom Out / Pull-out</option>
                  <option value="Orbit 360°">Orbit 360°</option>
                  <option value="FPV Drone Sweep">FPV Drone Sweep</option>
                  <option value="Crane / Boom Up/Down">Crane / Boom Up/Down</option>
                  <option value="Handheld Camera">Handheld Camera</option>
                </select>
              </div>

              {/* Seed */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Seed / Motion Brush
                </label>
                <input
                  type="text"
                  value={seed}
                  onChange={(e) => setSeed(e.target.value)}
                  placeholder="Random or Seed ID"
                  className="w-full px-3 py-2 rounded-xl bg-[#05060A] border border-[#25343F] text-xs text-white font-mono placeholder-slate-400 focus:outline-hidden focus:border-[#FE7F2D]"
                />
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════════
               4. Keyframe Management (Image-to-Video Seed & Interpolation)
               ══════════════════════════════════════════════════════════════════ */}
          <div className="p-5 rounded-2xl bg-[#090D14] border border-[#25343F]/80 space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-[#FE7F2D]" />
                Keyframe & Frame Management
              </span>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Manage initial reference images and ending keyframes for Image-to-Video (I2V) and seamless interpolation.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* First Frame */}
              <div className="p-3.5 rounded-xl bg-[#05060A] border border-[#25343F]/70 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                    First Frame (00:00)
                  </span>
                  <span className="text-[10px] text-slate-400">Starting Keyframe</span>
                </div>
                <input
                  type="url"
                  placeholder="First frame image URL (https://...)"
                  value={firstFrameImageUrl}
                  onChange={(e) => setFirstFrameImageUrl(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-[#090D14] border border-[#25343F] text-xs text-white placeholder-slate-400 focus:outline-hidden focus:border-[#FE7F2D]"
                />
                <textarea
                  rows={2}
                  placeholder="Starting frame visual guidance... e.g. Car stationary at brutalist tunnel mouth"
                  value={firstFramePrompt}
                  onChange={(e) => setFirstFramePrompt(e.target.value)}
                  className="w-full p-2 rounded-lg bg-[#090D14] border border-[#25343F] text-xs text-white placeholder-slate-400 focus:outline-hidden focus:border-[#FE7F2D] resize-none"
                />
              </div>

              {/* Last Frame */}
              <div className="p-3.5 rounded-xl bg-[#05060A] border border-[#25343F]/70 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider">
                    Last Frame (Target)
                  </span>
                  <span className="text-[10px] text-slate-400">Interpolation Target</span>
                </div>
                <input
                  type="url"
                  placeholder="Last frame image URL (https://...)"
                  value={lastFrameImageUrl}
                  onChange={(e) => setLastFrameImageUrl(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-[#090D14] border border-[#25343F] text-xs text-white placeholder-slate-400 focus:outline-hidden focus:border-[#FE7F2D]"
                />
                <textarea
                  rows={2}
                  placeholder="Ending frame visual guidance... e.g. Vehicle exiting tunnel into high-contrast rain streaks"
                  value={lastFramePrompt}
                  onChange={(e) => setLastFramePrompt(e.target.value)}
                  className="w-full p-2 rounded-lg bg-[#090D14] border border-[#25343F] text-xs text-white placeholder-slate-400 focus:outline-hidden focus:border-[#FE7F2D] resize-none"
                />
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════════
               5. Storyboard Scenes / Variations
               ══════════════════════════════════════════════════════════════════ */}
          <div className="p-5 rounded-2xl bg-[#090D14] border border-[#25343F]/80 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#FE7F2D]" />
                  Storyboard Scenes / Sequence Breakdown
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Break long videos into choreographed scenes with individual camera and pacing instructions.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddVariation}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#25343F]/60 hover:bg-[#25343F] text-slate-200 text-xs font-semibold border border-[#25343F] transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Scene</span>
              </button>
            </div>

            <div className="space-y-3">
              {variations.map((v, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-[#05060A] border border-[#25343F]/80 space-y-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <input
                      type="text"
                      value={v.title}
                      onChange={(e) =>
                        handleUpdateVariation(idx, "title", e.target.value)
                      }
                      placeholder="Scene Title (e.g. Scene 1: Approach Shot)"
                      className="px-2.5 py-1 rounded-lg bg-[#090D14] border border-[#25343F] text-xs font-semibold text-white focus:outline-hidden focus:border-[#FE7F2D] flex-1 max-w-xs"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveVariation(idx)}
                      className="text-slate-400 hover:text-rose-400 p-1"
                      title="Remove Scene"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <textarea
                    rows={2}
                    value={v.prompt}
                    onChange={(e) =>
                      handleUpdateVariation(idx, "prompt", e.target.value)
                    }
                    placeholder="Specific scene choreography, pacing, camera movement, and subject action..."
                    className="w-full p-2.5 rounded-lg bg-[#090D14] border border-[#25343F] text-xs text-white placeholder-slate-400 focus:outline-hidden focus:border-[#FE7F2D] resize-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════════
               6. Tags & Metadata
               ══════════════════════════════════════════════════════════════════ */}
          <div className="p-5 rounded-2xl bg-[#090D14] border border-[#25343F]/80 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Discovery Tags
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#25343F]/60 border border-[#25343F] text-xs text-slate-300"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-slate-400 hover:text-rose-400"
                  >
                    ×
                  </button>
                </span>
              ))}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="Add tag and hit Enter..."
                  className="px-2.5 py-1 rounded-lg bg-[#05060A] border border-[#25343F] text-xs text-white placeholder-slate-400 focus:outline-hidden focus:border-[#FE7F2D]"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-2 py-1 rounded-lg bg-[#25343F] text-slate-300 text-xs font-semibold hover:text-white"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════════
               Bottom Actions Bar
               ══════════════════════════════════════════════════════════════════ */}
          <div className="flex items-center justify-between pt-4 border-t border-[#25343F]">
            <Link
              href="/profile"
              className="text-xs text-slate-400 hover:text-white transition-colors"
            >
              Cancel and return to Profile
            </Link>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleSubmit("DRAFT")}
                disabled={submitting}
                className="px-4 py-2 rounded-xl bg-[#25343F]/50 hover:bg-[#25343F] border border-[#25343F] text-slate-200 text-xs font-semibold transition-all disabled:opacity-50 cursor-pointer"
              >
                Save Draft
              </button>
              <button
                type="button"
                onClick={() => handleSubmit("PENDING_REVIEW")}
                disabled={submitting}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FE7F2D] hover:bg-[#FE7F2D]/90 text-slate-950 text-xs font-bold shadow-[0_0_20px_rgba(254,127,45,0.25)] transition-all disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-4 h-4 stroke-[2.5]" />
                <span>{submitting ? "Submitting..." : "Submit for Review"}</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

