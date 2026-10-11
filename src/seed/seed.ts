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

export async function runSeed() {
  console.log('--- ContextNode Phase 1 Seeder Starting ---')
  const payload = await getPayload({
    config: configPromise,
  })

  // 1. Seed SuperAdmin & Users
  console.log('Seeding Users...')
  const existingAdmin = await payload.find({
    collection: 'users',
    where: {
      email: {
        equals: '427rohitkumar@gmail.com',
      },
    },
  })

  if (existingAdmin.totalDocs === 0) {
    await payload.create({
      collection: 'users',
      context: { preventRoleSanitization: true },
      data: {
        email: '427rohitkumar@gmail.com',
        password: '427rohit@',
        name: 'Rohit Kumar',
        role: 'ADMIN',
        status: 'ACTIVE',
        plan: 'PAID',
        bio: 'ContextNode Platform Owner & Super Administrator',
      },
    })
    console.log('✓ Created SuperAdmin: admin@contextnode.ai')
  } else {
    console.log('ℹ SuperAdmin already exists.')
  }

  // Sample Customer / User
  const existingUser = await payload.find({
    collection: 'users',
    where: {
      email: {
        equals: 'rohit@example.com',
      },
    },
  })

  if (existingUser.totalDocs === 0) {
    await payload.create({
      collection: 'users',
      data: {
        email: 'rohit@example.com',
        password: 'UserPass2026!',
        name: 'Rohit Kumar',
        role: 'USER',
        status: 'ACTIVE',
        plan: 'FREE',
      },
    })
    console.log('✓ Created Sample User: rohit@example.com')
  }

  // Sample Creator
  const existingCreator = await payload.find({
    collection: 'users',
    where: {
      email: {
        equals: 'creator@contextnode.ai',
      },
    },
  })

  if (existingCreator.totalDocs === 0) {
    await payload.create({
      collection: 'users',
      context: { preventRoleSanitization: true },
      data: {
        email: 'creator@contextnode.ai',
        password: 'CreatorPass2026!',
        name: 'Elena Rostova',
        role: 'CREATOR',
        status: 'ACTIVE',
        plan: 'PAID',
        bio: 'Prompt engineer and AI workflow architect specializing in high-fidelity imagery.',
      },
    })
    console.log('✓ Created Sample Creator: creator@contextnode.ai')
  }

  // 2. Seed Initial Categories
  console.log('Seeding Categories...')
  const defaultCategories = [
    {
      name: 'Full-Stack / Web',
      slug: 'full-stack-web',
      description: 'Full-stack application development frameworks, App Router conventions, and context packs.',
      icon: 'code',
      status: 'ACTIVE' as const,
    },
    {
      name: 'DevOps & CI/CD',
      slug: 'devops-ci-cd',
      description: 'Cloud infrastructure blueprints, containerization, and automation pipelines.',
      icon: 'server',
      status: 'ACTIVE' as const,
    },
    {
      name: 'AI Architecture',
      slug: 'ai-architecture',
      description: 'Cognitive frameworks, LLM system prompts, vector memory, and RAG pipelines.',
      icon: 'cpu',
      status: 'ACTIVE' as const,
    },
    {
      name: 'Image Generation',
      slug: 'image-generation',
      description: 'High-fidelity commercial, product, and cinematic prompts for Midjourney and Flux.',
      icon: 'image',
      status: 'ACTIVE' as const,
    },
    {
      name: 'Video Generation',
      slug: 'video-generation',
      description: 'Cinematic camera movement and motion prompts for Runway Gen-3, Kling, and Luma.',
      icon: 'video',
      status: 'ACTIVE' as const,
    },
  ]

  for (const cat of defaultCategories) {
    const existing = await payload.find({
      collection: 'categories',
      where: {
        slug: {
          equals: cat.slug,
        },
      },
    })

    if (existing.totalDocs === 0) {
      await payload.create({
        collection: 'categories',
        data: cat,
      })
      console.log(`✓ Created Category: ${cat.name}`)
    }
  }

  // 3. Seed Initial Tags
  console.log('Seeding Tags...')
  const defaultTags = [
    { name: 'Next.js 15', slug: 'nextjs-15' },
    { name: 'React 19', slug: 'react-19' },
    { name: 'TypeScript', slug: 'typescript' },
    { name: 'Supabase', slug: 'supabase' },
    { name: 'PostgreSQL', slug: 'postgresql' },
    { name: 'Midjourney v6', slug: 'midjourney-v6' },
    { name: 'Flux.1', slug: 'flux-1' },
    { name: 'Runway Gen-3', slug: 'runway-gen-3' },
    { name: 'Claude 3.5 Sonnet', slug: 'claude-3-5-sonnet' },
    { name: 'GPT-4o', slug: 'gpt-4o' },
  ]

  for (const tag of defaultTags) {
    const existing = await payload.find({
      collection: 'tags',
      where: {
        slug: {
          equals: tag.slug,
        },
      },
    })

    if (existing.totalDocs === 0) {
      await payload.create({
        collection: 'tags',
        data: {
          name: tag.name,
          slug: tag.slug,
          status: 'ACTIVE',
        },
      })
      console.log(`✓ Created Tag: ${tag.name}`)
    }
  }

  console.log('--- ContextNode Phase 1 Seeder Finished Successfully! ---')
}

// Execute when invoked directly
runSeed()
  .then(() => {
    process.exit(0)
  })
  .catch((err) => {
    console.error('Seeder failed:', err)
    process.exit(1)
  })

