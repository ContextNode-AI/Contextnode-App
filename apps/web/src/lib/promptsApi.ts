import { PROMPTS, type Prompt } from "@/lib/data";

const API_BASE_URL = typeof window !== "undefined" 
  ? "" 
  : (process.env.API_BACKEND_URL || "http://localhost:3000");

const MEDIA_HOST = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  photography: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format",
  cyberpunk: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?q=80&w=800&auto=format",
  cinematic: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=800&auto=format",
  illustration: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format",
  architecture: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format",
  "3d render": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format",
  minimalist: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format",
  product: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format",
  fashion: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format",
};

function formatToolName(tool?: string): string {
  if (!tool) return "Midjourney v6";
  const map: Record<string, string> = {
    midjourney: "Midjourney v6",
    flux: "Flux.1 Pro",
    "stable-diffusion": "Stable Diffusion XL",
    "gpt-image": "DALL-E 3",
    ideogram: "Ideogram v2",
    "nano-banana": "Nano Banana",
    general: "General AI",
  };
  return map[tool.toLowerCase()] || tool;
}

function formatCategory(raw?: string): string {
  if (!raw || typeof raw !== "string") return "Creative";
  return raw
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

export function mapAssetToPrompt(doc: any): Prompt {
  // 1. Cover Image URL
  let imageUrl = "";
  if (doc.coverImage) {
    if (typeof doc.coverImage === "object" && doc.coverImage?.url) {
      imageUrl = doc.coverImage.url.startsWith("http")
        ? doc.coverImage.url
        : `${MEDIA_HOST}${doc.coverImage.url}`;
    } else if (typeof doc.coverImage === "string") {
      imageUrl = doc.coverImage.startsWith("http")
        ? doc.coverImage
        : `${MEDIA_HOST}${doc.coverImage}`;
    }
  }

  // Fallback image if cover image is missing
  if (!imageUrl) {
    const key = (doc.categoryText || doc.style || doc.useCase || "default").toLowerCase();
    imageUrl = CATEGORY_FALLBACK_IMAGES[key] || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format";
  }

  // 2. Author display name
  let author = "ContextNode Creator";
  if (doc.author) {
    if (typeof doc.author === "object") {
      author = doc.author.name || doc.author.email?.split("@")[0] || "ContextNode Creator";
    }
  }

  // 3. Category
  let rawCategory = "Creative";
  if (doc.category && typeof doc.category === "object") {
    rawCategory = doc.category.name || "Creative";
  } else if (doc.categoryText) {
    rawCategory = doc.categoryText;
  } else if (Array.isArray(doc.tagList) && doc.tagList.length > 0) {
    rawCategory = doc.tagList[0]?.tag || "Creative";
  } else if (doc.style) {
    rawCategory = doc.style;
  }

  // 4. Compatible Models
  const modelsSet = new Set<string>();
  if (doc.model && typeof doc.model === "string" && doc.model.trim()) {
    modelsSet.add(doc.model.trim());
  }
  if (doc.aiTool) {
    modelsSet.add(formatToolName(doc.aiTool));
  }
  // Standard formats supported by detail prompt code block
  modelsSet.add("Midjourney v6");
  modelsSet.add("Stable Diffusion XL");
  modelsSet.add("Veo");

  // 5. Copies / downloads metric
  const numId = Number(doc.id) || 1;
  const copies = doc.copies || `${((numId * 739 + 1200) / 1000).toFixed(1)}k`;

  return {
    id: doc.id,
    slug: doc.slug,
    title: doc.title,
    copies,
    category: formatCategory(rawCategory),
    image: imageUrl,
    promptText: doc.mainPrompt || "",
    author,
    models: Array.from(modelsSet),
  };
}

export async function getPublishedPrompts(): Promise<Prompt[]> {
  try {
    const url = `${API_BASE_URL}/api/ai-assets?where[status][equals]=published&where[assetType][equals]=prompt&where[promptType][equals]=image&limit=100&depth=2`;
    const res = await fetch(url, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.warn("API responded with non-200 status for prompts, using static fallback.");
      return PROMPTS;
    }

    const data = await res.json();
    const apiPrompts: Prompt[] = (data.docs || []).map(mapAssetToPrompt);

    // Combine with static prompts: API approved prompts appear FIRST
    const slugSet = new Set<string>();
    const combined: Prompt[] = [];

    for (const p of apiPrompts) {
      if (p.slug && !slugSet.has(p.slug)) {
        slugSet.add(p.slug);
        combined.push(p);
      }
    }

    for (const p of PROMPTS) {
      if (p.slug && !slugSet.has(p.slug)) {
        slugSet.add(p.slug);
        combined.push(p);
      }
    }

    return combined;
  } catch (err) {
    console.error("Error fetching published prompts:", err);
    return PROMPTS;
  }
}

export async function getPromptBySlug(slug: string): Promise<Prompt | null> {
  if (!slug) return null;

  try {
    const url = `${API_BASE_URL}/api/ai-assets?where[slug][equals]=${encodeURIComponent(slug)}&where[status][equals]=published&depth=2&limit=1`;
    const res = await fetch(url, {
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      if (data.docs && data.docs.length > 0) {
        return mapAssetToPrompt(data.docs[0]);
      }
    }
  } catch (err) {
    console.error(`Error querying prompt by slug "${slug}":`, err);
  }

  // Fallback to static data
  return PROMPTS.find((p) => p.slug === slug) || null;
}

export async function getSimilarPrompts(currentSlug: string, category?: string, limit: number = 3): Promise<Prompt[]> {
  const all = await getPublishedPrompts();
  const others = all.filter((p) => p.slug !== currentSlug);

  // First priority: same category
  const sameCategory = category 
    ? others.filter((p) => p.category.toLowerCase() === category.toLowerCase())
    : [];

  const results: Prompt[] = [...sameCategory];

  // Fill up to limit with other prompts
  if (results.length < limit) {
    for (const p of others) {
      if (!results.some((r) => r.slug === p.slug)) {
        results.push(p);
        if (results.length >= limit) break;
      }
    }
  }

  return results.slice(0, limit);
}

