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

async function seedPendingAssets() {
  console.log('--- Seeding Pending Review AI Assets for Admin Verification ---')
  const payload = await getPayload({ config: configPromise })

  const creatorUser = await payload.find({
    collection: 'users',
    where: {
      email: {
        equals: 'creator@contextnode.ai',
      },
    },
  })

  const authorId = creatorUser.docs[0]?.id || 3

  const pendingItems = [
    {
      title: 'Next.js 15 App Router & Strict Security Architecture Context Pack',
      slug: 'nextjs-15-app-router-security-context-pack',
      shortDescription: 'Production-ready context pack containing project structure rules, middleware RBAC templates, and AI coding prompt constraints.',
      fullDescription: 'Comprehensive developer context pack engineered for Cursor and Windsurf IDEs. Includes full AGENTS.md rules, Next.js 15 Server Actions best practices, and automated TypeScript contract validations.',
      assetType: 'context_pack' as const,
      categoryText: 'Fullstack Development',
      status: 'pending_review' as const,
      accessType: 'PAID' as const,
      price: 29.00,
      author: authorId,
      supportedTools: ['cursor', 'windsurf', 'claude-code'] as any,
    },
    {
      title: 'Cinematic Cyberpunk Neon Megacity Drone Hyperlapse',
      slug: 'cinematic-cyberpunk-neon-megacity-drone-hyperlapse',
      shortDescription: 'Production video prompt for Runway Gen-3 and Sora creating ultra-realistic futuristic city aerial flythroughs.',
      fullDescription: 'Fine-tuned cinematic camera motion prompt for generative AI video models. Produces consistent camera dolly speed, anamorphic lens flares, and volumetric rain physics.',
      assetType: 'prompt' as const,
      promptType: 'video' as const,
      categoryText: 'Cinematic Video',
      status: 'pending_review' as const,
      accessType: 'FREE' as const,
      price: 0,
      author: authorId,
      aiTool: 'runway-gen3',
      mainPrompt: 'FPV cinematic drone diving through dense vertical cyberpunk metropolis, holographic neon advertisements reflecting off towering glass arcologies, torrential rain with glistening puddles, anamorphic 35mm lens, 4k 60fps photorealistic motion blur.',
    },
    {
      title: 'Automated OpenAPI Spec to TypeScript SDK CI Workflow',
      slug: 'automated-openapi-spec-typescript-sdk-workflow',
      shortDescription: 'End-to-end automated developer pipeline generating type-safe API clients upon backend route updates.',
      fullDescription: 'DevOps workflow template integrating GitHub Actions, Payload REST endpoint exports, and automatic NPM package distribution.',
      assetType: 'workflow' as const,
      categoryText: 'DevOps & Tooling',
      status: 'pending_review' as const,
      accessType: 'PAID' as const,
      price: 49.00,
      author: authorId,
    },
  ]

  for (const item of pendingItems) {
    const existing = await payload.find({
      collection: 'ai-assets',
      where: {
        slug: {
          equals: item.slug,
        },
      },
    })

    if (existing.totalDocs > 0) {
      console.log(`Asset "${item.title}" already exists. Updating status to pending_review...`)
      await payload.update({
        collection: 'ai-assets',
        id: existing.docs[0].id,
        data: {
          status: 'pending_review',
        },
      })
    } else {
      console.log(`Creating pending review asset "${item.title}"...`)
      await payload.create({
        collection: 'ai-assets',
        data: item as any,
      })
    }
  }

  console.log('--- Successfully Seeded Pending Review Assets ---')
  process.exit(0)
}

seedPendingAssets().catch((err) => {
  console.error('Seeding failed:', err)
  process.exit(1)
})
