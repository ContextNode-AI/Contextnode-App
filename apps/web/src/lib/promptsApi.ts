import { PROMPTS, type Prompt } from "@/lib/data";
import { api, ImagePrompt } from "@/lib/api";

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

export function mapLivePromptToPrompt(p: ImagePrompt): Prompt {
  const key = (p.category || p.style || p.useCase || "default").toLowerCase();
  const image =
    p.previewImageUrl ||
    CATEGORY_FALLBACK_IMAGES[key] ||
    CATEGORY_FALLBACK_IMAGES.product;

  const modelsSet = new Set<string>();
  if (p.model && p.model.trim()) {
    modelsSet.add(p.model.trim());
  }
  if (p.aiTool) {
    modelsSet.add(formatToolName(p.aiTool));
  }
  modelsSet.add("Midjourney v6");
  modelsSet.add("Flux.1 Pro");

  return {
    id: typeof p.id === "number" ? p.id : Math.abs(p.slug.split("").reduce((acc, c) => ((acc << 5) - acc) + c.charCodeAt(0), 0)),
    slug: p.slug,
    title: p.title,
    copies: `${p.viewsCount || 0}`,
    category: formatCategory(p.category),
    image,
    promptText: p.prompt,
    author: p.author?.name || "ContextNode Creator",
    models: Array.from(modelsSet),
  };
}

export async function getPublishedPrompts(): Promise<Prompt[]> {
  try {
    const livePrompts = await api.prompts.getPublicPrompts();
    const mapped: Prompt[] = livePrompts.map(mapLivePromptToPrompt);

    // Combine with static prompts: API approved prompts appear FIRST
    const slugSet = new Set<string>();
    const combined: Prompt[] = [];

    for (const p of mapped) {
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
    console.error("Error fetching published prompts from API, using fallback:", err);
    return PROMPTS;
  }
}

export async function getPromptBySlug(slug: string): Promise<Prompt | null> {
  if (!slug) return null;

  try {
    const prompt = await api.prompts.getPublicPromptBySlug(slug);
    if (prompt) {
      return mapLivePromptToPrompt(prompt);
    }
  } catch (err) {
    console.error(`Error querying prompt by slug "${slug}":`, err);
  }

  // Fallback to static data
  return PROMPTS.find((p) => p.slug === slug) || null;
}

export async function getSimilarPrompts(
  currentSlug: string,
  category?: string,
  limit: number = 3
): Promise<Prompt[]> {
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
