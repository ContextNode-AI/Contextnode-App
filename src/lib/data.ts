export interface Prompt {
  id: number;
  slug: string;
  title: string;
  copies: string;
  category: string;
  image: string;
  promptText: string;
  author: string;
  models: string[];
}

export const PROMPTS: Prompt[] = [
  {
    id: 1,
    slug: "ethereal-portraiture",
    title: "Ethereal Portraiture",
    copies: "8.9k",
    category: "Photography",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format",
    promptText: "A cinematic, ethereal portrait of a young woman with bioluminescent freckles, floating in a dark zero-gravity chamber. Soft cyan rim lighting, volumetric fog, high fidelity, 8k resolution, shot on 35mm lens, hyperrealistic skin textures, Unreal Engine 5 render style.",
    author: "Elena Rostova",
    models: ["Midjourney v6", "Stable Diffusion XL", "Veo"]
  },
  {
    id: 2,
    slug: "dark-studio-product-macro",
    title: "Dark Studio Product Macro",
    copies: "2.8k",
    category: "Photography",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format",
    promptText: "Extreme macro product photography of a premium minimalist wristwatch on a dark, wet basalt stone. Subtle water droplets, single diagonal key light, dramatic shadows, deep black background, warm metallic accents, shallow depth of field, shot on Hasselblad 100c.",
    author: "Kai Jensen",
    models: ["Midjourney v6", "DALL-E 3"]
  },
  {
    id: 3,
    slug: "ghibli-esque-floating-worlds",
    title: "Ghibli-esque Floating Worlds",
    copies: "5.1k",
    category: "Illustration",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format",
    promptText: "Studio Ghibli style anime illustration of a tiny floating island with a single ancient cherry blossom tree and a small wooden cottage. Clouds drifting underneath, bright blue sky, soft hand-drawn textures, nostalgic pastel color palette, gouache painting style, whimsical mood.",
    author: "Sora Takahashi",
    models: ["Midjourney Niji 6", "Stable Diffusion 3"]
  },
  {
    id: 4,
    slug: "cyberpunk-street-level",
    title: "Cyberpunk Street Level",
    copies: "3.2k",
    category: "Cyberpunk",
    image: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?q=80&w=800&auto=format",
    promptText: "Low-angle wide shot of a rainy cyberpunk alleyway in Neo-Seoul. Glowing holographic advertisements in pink and cyan reflecting on wet asphalt puddles, a lone figure in a dark techwear jacket walking away, steam rising from grates, high detail cinematic scene.",
    author: "V_Design",
    models: ["Midjourney v6", "Flux.1 Dev"]
  },
  {
    id: 5,
    slug: "neo-tokyo-cinematic-stills",
    title: "Neo-Tokyo Cinematic Stills",
    copies: "4.2k",
    category: "Cinematic",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=800&auto=format",
    promptText: "Cinematic movie still from a 1980s sci-fi film set in Tokyo. Moody lighting, anamorphic lens flare, retro-futuristic monitors inside a smoky ramen shop, amber and teal color grade, film grain, nostalgic atmosphere.",
    author: "Akira88",
    models: ["Midjourney v6", "Runway Gen-3"]
  },
  {
    id: 6,
    slug: "minimalist-architecture",
    title: "Minimalist Architecture",
    copies: "1.2k",
    category: "Architecture",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format",
    promptText: "Architectural photography of a brutalist concrete villa set in a desert at sunset. Sharp geometric lines, concrete texture detail, large glass panels reflecting the orange sunset sky, palm shadows projected on the walls, high-end architectural digest style.",
    author: "Zaha's Apprentice",
    models: ["Midjourney v6", "Stable Diffusion 3"]
  },
  {
    id: 7,
    slug: "cinematic-food-photography",
    title: "Cinematic Food Photography",
    copies: "6.5k",
    category: "Cinematic",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=800&auto=format",
    promptText: "Dramatic close-up of a gourmet chocolate dessert being drizzled with warm gold-dusted caramel sauce. Steam rising slightly, dark rustic table setting, rich warm tones, macro lens, high-speed shutter catching splash detail, fine dining aesthetic.",
    author: "ChefAI",
    models: ["Midjourney v6", "DALL-E 3"]
  },
  {
    id: 8,
    slug: "sci-fi-concept-art",
    title: "Sci-Fi Concept Art",
    copies: "7.4k",
    category: "Illustration",
    image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format",
    promptText: "Epic concept art of a massive interstellar colony ship arriving at a ringed alien exoplanet. Vast cosmic background with nebulae and dust clouds, intricate mechanical details on the hull, glowing engine trails, scale comparison, high-concept illustration.",
    author: "Orion's Belt",
    models: ["Midjourney v6", "Stable Diffusion 3"]
  },
  {
    id: 9,
    slug: "retro-wave-aesthetics",
    title: "Retro Wave Aesthetics",
    copies: "2.1k",
    category: "Illustration",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format",
    promptText: "80s outrun synthwave visual. A wireframe grid landscape leading to a glowing vector neon grid sun, futuristic sports car driving on a highway, magenta and purple glowing colors, palm tree silhouettes, retro sci-fi VHS aesthetic.",
    author: "Kavinsky_Fan",
    models: ["Midjourney v6", "Flux.1 Dev"]
  },
  {
    id: 10,
    slug: "surreal-landscapes",
    title: "Surreal Landscapes",
    copies: "9.3k",
    category: "3D Render",
    image: "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?q=80&w=800&auto=format",
    promptText: "Surreal dreamlike scene. An endless ocean of smooth violet glass under a sky with three giant pale moons. Giant glowing floating jellyfish drifting in the air, reflection on the water surface, atmospheric fog, ethereal, Salvador Dali meets modern 3D design.",
    author: "DreamWeaver",
    models: ["Midjourney v6", "Stable Diffusion XL"]
  },
  {
    id: 11,
    slug: "neon-lit-alleyway",
    title: "Neon Lit Alleyway",
    copies: "4.8k",
    category: "Cyberpunk",
    image: "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=800&auto=format",
    promptText: "Atmospheric cyberpunk alleyway in Tokyo during heavy rain. Traditional glowing red paper lanterns hanging next to neon signs, wet stone path reflecting warm light, steam rising from street food stalls, hyper-detailed photography.",
    author: "Shibuya_Eyes",
    models: ["Midjourney v6", "Flux.1 Dev"]
  },
  {
    id: 12,
    slug: "clean-ui-dashboard-concept",
    title: "Clean UI Dashboard Concept",
    copies: "8.1k",
    category: "Minimalist",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format",
    promptText: "Dribbble-style UI mockup of a clean analytics dashboard. Transparent glassmorphic cards, vibrant gradient charts in purple and blue, clean typography, dark theme, smooth drop shadows, professional UI/UX presentation render.",
    author: "Figma_Pro",
    models: ["Midjourney v6", "DALL-E 3"]
  }
];

export interface ContextPack {
  id: number;
  slug: string;
  title: string;
  description: string;
  downloads: string;
  category: string;
  filesCount: number;
  tokensCount: string;
  tags: string[];
  author: string;
  rating: number;
  image: string;
}

export const CONTEXT_PACKS: ContextPack[] = [
  {
    id: 1,
    slug: "nextjs-15-app-router",
    title: "Next.js 15 App Router & React 19 Core Pack",
    description: "Full routing, Server Actions, suspense hydration, and core APIs references optimized for AI agent context windows.",
    downloads: "12.4k",
    category: "Coding",
    filesCount: 24,
    tokensCount: "142k",
    tags: ["Next.js", "React 19", "Frontend"],
    author: "Vercel Wizard",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format"
  },
  {
    id: 2,
    slug: "tailwind-css-v4-reference",
    title: "Tailwind CSS v4 Config & Utility Maps",
    description: "Full mapping of new Tailwind v4 design tokens, utility classes, configuration structures, and CSS-in-JS bindings.",
    downloads: "8.1k",
    category: "Design",
    filesCount: 12,
    tokensCount: "58k",
    tags: ["Tailwind", "CSS v4", "Styling"],
    author: "StyleMaster",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=800&auto=format"
  },
  {
    id: 3,
    slug: "prisma-schema-postgres-optimization",
    title: "Prisma Schema & PostgreSQL Optimization Guide",
    description: "Database schema design patterns, indexing guides, raw SQL query optimizations, and Prisma Client query handlers.",
    downloads: "9.5k",
    category: "Database",
    filesCount: 8,
    tokensCount: "44k",
    tags: ["Prisma", "PostgreSQL", "Backend"],
    author: "DbGuru",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=800&auto=format"
  },
  {
    id: 4,
    slug: "fastapi-pydantic-v2-patterns",
    title: "FastAPI & Pydantic v2 Boilerplate Context",
    description: "Clean API routing designs, dependency injection matrices, standard schemas, and OAuth2 security flow configurations.",
    downloads: "6.2k",
    category: "Coding",
    filesCount: 15,
    tokensCount: "92k",
    tags: ["FastAPI", "Python", "API"],
    author: "PyCoder",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1618401471353-b98aedd07871?q=80&w=800&auto=format"
  },
  {
    id: 5,
    slug: "framer-motion-animation-maps",
    title: "Framer Motion Dynamic Animation Reference",
    description: "Spring setup configurations, custom keyframe sets, layout animations, exit transitions, and responsive gesture handlers.",
    downloads: "4.8k",
    category: "Creative",
    filesCount: 10,
    tokensCount: "36k",
    tags: ["Animations", "Motion", "React"],
    author: "MotionDesigner",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format"
  },
  {
    id: 6,
    slug: "langchain-ai-agentic-loops",
    title: "LangChain AI Agentic Chain Construction Pack",
    description: "Ready-to-use prompt templates, tools declaration schemas, stream handlers, and custom LLM agent loop constructs.",
    downloads: "14.3k",
    category: "AI Engine",
    filesCount: 18,
    tokensCount: "118k",
    tags: ["LangChain", "AI Agents", "Python"],
    author: "AIArchitect",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=800&auto=format"
  }
];

export interface DevPrompt {
  id: number;
  slug: string;
  title: string;
  description: string;
  promptText: string;
  copies: string;
  category: string;
  author: string;
  targetModel: string;
  image: string;
}

export const DEV_PROMPTS: DevPrompt[] = [
  {
    id: 1,
    slug: "typescript-type-wizard",
    title: "TypeScript Type Wizard",
    description: "System instructions to convert raw runtime JSON data into production-ready, strictly-typed TS interfaces.",
    promptText: "You are an expert TypeScript compiler engineer. Analyze the provided dynamic JSON structure and generate zero-any, strictly-mapped TypeScript interfaces. Use union types for fields with mixed values, mark fields as optional if they are null or missing in some objects, and construct reusable nested sub-interfaces.",
    copies: "4.5k",
    category: "TypeScript",
    author: "TypeSage",
    targetModel: "Claude 3.5 Sonnet",
    image: "https://images.unsplash.com/photo-1516116211223-5c359a36298a?q=80&w=800&auto=format"
  },
  {
    id: 2,
    slug: "nextjs-server-action-handler",
    title: "Next.js 15 Server Action Handler",
    description: "System prompt to build safe Next.js Server Actions with strict schema validation and error structures.",
    promptText: "You are a Next.js security engineer. Generate a Next.js 15 Server Action that handles database mutations securely. Include: 1) input validation using Zod, 2) session authentication validation, 3) detailed error boundary structures with localized error messages, and 4) Prisma transactional actions.",
    copies: "3.8k",
    category: "React / Next",
    author: "NextWizard",
    targetModel: "GPT-4o",
    image: "https://images.unsplash.com/photo-1618401471353-b98aedd07871?q=80&w=800&auto=format"
  },
  {
    id: 3,
    slug: "postgresql-query-optimizer",
    title: "PostgreSQL Query Optimizer",
    description: "Optimizes slow raw SQL queries, suggests indexing layouts, and rewrites joins for optimal query execution plans.",
    promptText: "You are a Senior database administrator. Analyze the slow query and schema provided. Suggest indexing strategies (B-Tree, GIN, Partial indexes), rewrite complex subqueries using CTEs or optimized INNER/LEFT JOINs, and explain the query execution improvements.",
    copies: "5.1k",
    category: "Database",
    author: "DbGuru",
    targetModel: "DeepSeek Coder",
    image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=800&auto=format"
  },
  {
    id: 4,
    slug: "tailwind-v4-ui-generator",
    title: "Tailwind v4 UI Generator",
    description: "Translates high-fidelity visual description parameters into modern, responsive components with Tailwind CSS v4.",
    promptText: "You are a Senior UI developer. Translate the given UI descriptions into modern, responsive React elements styled exclusively with Tailwind CSS v4 utility classes. Prioritize modern grid/flex layouts, CSS custom properties, and smooth interactive spring animations.",
    copies: "2.9k",
    category: "CSS / Styling",
    author: "StyleCraft",
    targetModel: "Claude 3.5 Sonnet",
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=800&auto=format"
  },
  {
    id: 5,
    slug: "rust-concurrency-wrapper",
    title: "Rust Concurrency Wrapper",
    description: "Generates correct, thread-safe memory wrappers in Rust using crossbeam channels and Arc/Mutex locks.",
    promptText: "You are a Rust systems engineer. Design a memory-safe multi-threaded data pipeline using Arc, Mutex, and crossbeam channels. The solution must contain proper lock acquisition patterns to prevent deadlocks and build with zero compiler warnings.",
    copies: "1.7k",
    category: "Systems",
    author: "Rustacean",
    targetModel: "Claude 3.5 Sonnet",
    image: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?q=80&w=800&auto=format"
  },
  {
    id: 6,
    slug: "ai-tool-calling-schema",
    title: "AI Tool Calling Schema Constructor",
    description: "Builds schema models for LLM tool definition payloads (OpenAI functions/Gemini tools) matching dynamic API responses.",
    promptText: "You are an AI integrations engineer. Your goal is to write a strictly-validated JSON schema for tool declarations matching the provided API spec. Ensure parameters are correctly formatted, optional fields are handled, and return structure descriptions are clear for LLM reasoning models.",
    copies: "6.3k",
    category: "AI Engine",
    author: "AIArchitect",
    targetModel: "Gemini 1.5 Pro",
    image: "https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=800&auto=format"
  }
];
