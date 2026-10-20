import { getPayload } from 'payload'
import configPromise from '../payload.config'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
dotenv.config({ path: path.resolve(dirname, '../../.env') })
dotenv.config({ path: path.resolve(dirname, '../.env') })
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

if (!process.env.PAYLOAD_SECRET) {
  process.env.PAYLOAD_SECRET = '77ec64e904eeab67cd7e34b0'
}
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'postgresql://postgres:admin@localhost:5443/contextnode_db'
}

async function seedImagePrompts() {
  console.log('--- Seeding Creator Image Prompts ---')
  const payload = await getPayload({ config: configPromise })

  // Find creator user
  const creatorUser = await payload.find({
    collection: 'users',
    where: {
      email: {
        equals: 'creator@contextnode.ai',
      },
    },
  })

  const authorId = creatorUser.docs[0]?.id || 3

  const samplePrompts = [
    {
      title: 'Luxury Obsidian Perfume Bottle Photography',
      slug: 'luxury-obsidian-perfume-bottle-photography',
      shortDescription: 'Generate premium studio-style product photography of an obsidian perfume bottle with realistic lighting and commercial composition.',
      fullDescription: 'Engineered for luxury commercial advertising and beauty editorial campaigns. Provides ultra-crisp surface reflections, volumetric atmospheric shadows, and Hasselblad optical fidelity.',
      assetType: 'prompt' as const,
      promptType: 'image' as const,
      mainPrompt: 'A minimalist luxury perfume bottle sculpted from fractured black obsidian crystal, resting on wet slate under a single vertical directional spotlight, dramatic gold rim light, volumetric atmospheric fog, raytraced glass caustics, shot on Hasselblad H6D-100c, 85mm f/1.8 lens, high-end commercial editorial --ar 16:9 --v 6.0 --style raw',
      negativePrompt: 'ugly, deformed, oversaturated, amateur photography, lowres, text, watermark, logo, plastic shine, noisy background',
      aiTool: 'midjourney' as const,
      model: 'Midjourney V7',
      aspectRatio: '16:9' as const,
      style: 'product-photography' as const,
      useCase: 'product-photography' as const,
      variations: [
        {
          title: 'Front View',
          description: 'Straight front-facing product composition with centered framing',
          prompt: 'A minimalist luxury perfume bottle sculpted from fractured black obsidian crystal, centered front-facing composition on wet slate, vertical spotlight, gold rim light, Hasselblad H6D-100c --ar 1:1 --v 6.0',
        },
        {
          title: '45 Degree View',
          description: 'Premium angled composition displaying faceted crystal caustics',
          prompt: 'A minimalist luxury perfume bottle sculpted from fractured black obsidian crystal, 45-degree angle dynamic view, gold specular highlights, wet reflective slate, Hasselblad H6D-100c --ar 16:9 --v 6.0',
        },
      ],
      accessType: 'FREE' as const,
      price: 0,
      status: 'published' as const,
      featured: true,
      author: authorId,
    },
    {
      title: 'Neo-Tokyo Midnight Cyborg Cinematic Portrait',
      slug: 'neo-tokyo-midnight-cyborg-cinematic-portrait',
      shortDescription: 'Cinematic cybernetic portrait set in rain-soaked neo-Tokyo with atmospheric cyan and magenta neon reflections.',
      fullDescription: 'A high-contrast cinematic portrait featuring biomechanical synthetic dermal plating, realistic translucent silicone skin, and rain droplets running down an illuminated robotic jawline.',
      assetType: 'prompt' as const,
      promptType: 'image' as const,
      mainPrompt: 'Close-up cinematic portrait of a female cyborg with exposed chrome auditory implants and micro-LED circuitry under translucent synthetic skin, standing in a drenching rainstorm in a neon-lit Shinjuku alleyway, anamorphic blue lens flare, shot on Arri Alexa Mini, 50mm anamorphic lens --ar 16:9 --v 6.0',
      negativePrompt: 'drawing, cartoon, anime, low quality, bad anatomy, deformed eyes, flat lighting',
      aiTool: 'flux' as const,
      model: 'Flux.1 Pro',
      aspectRatio: '16:9' as const,
      style: 'cinematic' as const,
      useCase: 'concept-art' as const,
      variations: [
        {
          title: 'Profile Angle',
          description: 'Side view emphasizing illuminated nape neural port',
          prompt: 'Side profile of female cyborg in rain, illuminated neural port at nape of neck, neon background bokeh, Arri Alexa --ar 16:9',
        },
      ],
      accessType: 'PAID' as const,
      price: 19.00,
      status: 'published' as const,
      featured: true,
      author: authorId,
    },
    {
      title: 'Architectural Brutalist Concrete Villa in Nordic Pine Mist',
      slug: 'architectural-brutalist-concrete-villa-in-nordic-pine-mist',
      shortDescription: 'Monolithic raw concrete architecture nestled among ancient pines shrouded in Scandinavian early-morning fog.',
      fullDescription: 'Clean modernist geometry contrasting against textured natural wilderness. Board-formed concrete patterns, oversized cantilevered glass volumes with warm interior tungsten illumination.',
      assetType: 'prompt' as const,
      promptType: 'image' as const,
      mainPrompt: 'Architectural photography of a minimalist brutalist concrete residence cantilevered over a misty pine forest in Norway, large floor-to-ceiling glass windows glowing with warm 2700K interior light, raw textured board-formed concrete walls, overcast diffuse dawn sky, shot on Leica S3, 24mm tilt-shift lens --ar 16:9 --v 6.0',
      negativePrompt: 'sunny day, oversaturated, cheap rendering, cartoon, low resolution',
      aiTool: 'midjourney' as const,
      model: 'Midjourney V7',
      aspectRatio: '16:9' as const,
      style: 'photorealistic' as const,
      useCase: 'branding' as const,
      accessType: 'FREE' as const,
      price: 0,
      status: 'draft' as const,
      featured: false,
      author: authorId,
    },
    {
      title: 'Avant-Garde Haute Couture Iridescent Silk Editorial',
      slug: 'avant-garde-haute-couture-iridescent-silk-editorial',
      shortDescription: 'High-fashion editorial photo shoot with billowing iridescent silk fabric capturing holographic chromatic shifts.',
      fullDescription: 'Produced for Paris Fashion Week digital lookbooks. Emphasizes fabric motion blur, dramatic high-key studio lighting, and sculptural garment silhouettes.',
      assetType: 'prompt' as const,
      promptType: 'image' as const,
      mainPrompt: 'Vogue editorial fashion photography of high-fashion model wearing an architectural dress made of liquid iridescent silk that ripples in wind, holographic pearl sheen, minimalist grey concrete cyclorama studio, editorial rim light, shot on Phase One IQ4 150MP --ar 4:5 --v 6.0',
      negativePrompt: 'amateur, bad hands, deformed face, cluttered background, blurry',
      aiTool: 'stable-diffusion' as const,
      model: 'SDXL 1.0',
      aspectRatio: '4:5' as const,
      style: 'fashion' as const,
      useCase: 'advertising' as const,
      accessType: 'PAID' as const,
      price: 24.00,
      status: 'published' as const,
      featured: false,
      author: authorId,
    },
  ]

  for (const item of samplePrompts) {
    const existing = await payload.find({
      collection: 'ai-assets',
      where: {
        slug: {
          equals: item.slug,
        },
      },
    })

    if (existing.totalDocs === 0) {
      await payload.create({
        collection: 'ai-assets',
        data: item as any,
      })
      console.log(`✓ Created Image Prompt: ${item.title}`)
    } else {
      console.log(`ℹ Image Prompt already exists: ${item.title}`)
    }
  }

  console.log('--- Image Prompts Seeding Finished! ---')
  process.exit(0)
}

seedImagePrompts().catch((e) => {
  console.error(e)
  process.exit(1)
})

