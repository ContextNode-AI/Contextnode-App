import type { CollectionConfig, Access, Where } from 'payload'
import { isAdminOrCreator } from '../access/roles'

const readAssets: Access = ({ req: { user } }) => {
  // Unauthenticated / public access: only published assets
  if (!user) {
    const query: Where = {
      status: {
        equals: 'published',
      },
    }
    return query
  }

  // Admins see all assets across the platform
  if ((user as any).role === 'ADMIN') return true

  // Creators see all published assets + their own draft/review assets
  if ((user as any).role === 'CREATOR') {
    const query: Where = {
      or: [
        {
          status: {
            equals: 'published',
          },
        },
        {
          author: {
            equals: user.id,
          },
        },
      ],
    }
    return query
  }

  // Consumers/Users only see published assets
  const query: Where = {
    status: {
      equals: 'published',
    },
  }
  return query
}

const updateAssets: Access = ({ req: { user } }) => {
  if (!user) return false
  if ((user as any).role === 'ADMIN') return true
  if ((user as any).role === 'CREATOR') {
    const query: Where = {
      author: {
        equals: user.id,
      },
    }
    return query
  }
  return false
}

const deleteAssets: Access = ({ req: { user } }) => {
  if (!user) return false
  if ((user as any).role === 'ADMIN') return true
  if ((user as any).role === 'CREATOR') {
    const query: Where = {
      and: [
        {
          author: {
            equals: user.id,
          },
        },
        {
          status: {
            equals: 'draft',
          },
        },
      ],
    }
    return query
  }
  return false
}

export const AIAssets: CollectionConfig = {
  slug: 'ai-assets',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'assetType', 'promptType', 'category', 'author', 'status', 'updatedAt'],
    group: 'AI Assets',
  },
  access: {
    read: readAssets,
    create: ({ req: { user } }) => (user as any)?.role === 'CREATOR' || (user as any)?.role === 'ADMIN',
    update: updateAssets,
    delete: deleteAssets,
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (!data) return data

        // Normalize tagList if provided as string array or objects
        if (Array.isArray(data.tagList)) {
          data.tagList = data.tagList
            .map((item: any) => {
              if (typeof item === 'string') return { tag: item.trim() }
              if (item && typeof item === 'object' && typeof item.tag === 'string') {
                return { ...item, tag: item.tag.trim() }
              }
              return item
            })
            .filter((item: any) => Boolean(item?.tag))
        }

        // If string tags were passed to relationship field `tags`, move them to tagList to prevent relationship validation errors
        if (Array.isArray(data.tags)) {
          const invalidRelationshipTags: string[] = []
          const validRelationshipTags: any[] = []
          for (const t of data.tags) {
            if (typeof t === 'number' || (typeof t === 'string' && /^\d+$/.test(t))) {
              validRelationshipTags.push(typeof t === 'number' ? t : parseInt(t, 10))
            } else if (typeof t === 'string' && t.trim()) {
              invalidRelationshipTags.push(t.trim())
            }
          }
          if (invalidRelationshipTags.length > 0) {
            data.tags = validRelationshipTags.length > 0 ? validRelationshipTags : []
            const currentList = Array.isArray(data.tagList) ? data.tagList : []
            const newTags = invalidRelationshipTags.map((tag) => ({ tag }))
            data.tagList = [...currentList, ...newTags]
          }
        }

        return data
      },
    ],
    beforeChange: [
      ({ req, operation, data }) => {
        if (operation === 'create' && req?.user && !data.author) {
          data.author = req.user.id
        }
        return data
      },
    ],
  },
  fields: [
    // 1. Basic Information
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Asset Title',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      label: 'Canonical Slug',
      admin: {
        description: 'URL-friendly identifier for the asset (e.g. luxury-product-photography-prompt)',
      },
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      required: true,
      label: 'Short Description',
      admin: {
        description: 'Concise summary for discovery cards and catalog previews (max 160 chars)',
      },
    },
    {
      name: 'fullDescription',
      type: 'textarea',
      label: 'Full Description',
      admin: {
        description: 'Detailed explanation of what the asset does, when to use it, and expected output. Do not put the actual prompt here.',
      },
    },

    // Architecture & Classification
    {
      name: 'assetType',
      type: 'select',
      required: true,
      defaultValue: 'prompt',
      options: [
        { label: 'Prompt', value: 'prompt' },
        { label: 'Context Pack', value: 'context_pack' },
        { label: 'Workflow', value: 'workflow' },
      ],
      admin: {
        description: 'Primary AI Asset architecture type',
      },
    },
    {
      name: 'promptType',
      type: 'select',
      defaultValue: 'image',
      admin: {
        condition: (data) => data?.assetType === 'prompt',
        description: 'Creative prompt modality',
      },
      options: [
        { label: 'Image Prompt', value: 'image' },
        { label: 'Video Prompt', value: 'video' },
        { label: 'Text / Code Prompt', value: 'text' },
      ],
    },

    // 2. Preview / Thumbnail
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Cover / Preview Image',
      admin: {
        description: 'The output/result image of the prompt used as the thumbnail on the public platform. Optional for Context Packs.',
      },
    },

    // 3. Main Prompt & Negative Prompt
    {
      name: 'mainPrompt',
      type: 'textarea',
      label: 'Main Prompt',
      admin: {
        condition: (data) => data?.assetType === 'prompt',
        description: 'The primary generation instruction instruction for the AI model.',
      },
    },
    {
      name: 'negativePrompt',
      type: 'textarea',
      label: 'Negative Prompt',
      admin: {
        condition: (data) => data?.assetType === 'prompt' && (data?.promptType === 'image' || data?.promptType === 'video'),
        description: 'Elements, styles, or artifacts to avoid (if supported by the model). Stored separately.',
      },
    },

    // 4. Prompt Variations / Angles (Optional repeatable)
    {
      name: 'variations',
      type: 'array',
      label: 'Prompt Variations / Angles',
      labels: {
        singular: 'Prompt Variation',
        plural: 'Prompt Variations',
      },
      admin: {
        condition: (data) => data?.assetType === 'prompt',
        description: 'Optional alternative prompts for the same concept (e.g. Front View, 45 Degree View, Side View, Top View).',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Variation Title',
          admin: {
            placeholder: 'e.g. Front View, 45 Degree View, Top-Down Flat Lay',
          },
        },
        {
          name: 'description',
          type: 'text',
          label: 'Short Description',
          admin: {
            placeholder: 'e.g. Straight front-facing product composition',
          },
        },
        {
          name: 'prompt',
          type: 'textarea',
          required: true,
          label: 'Variation Prompt',
        },
        {
          name: 'previewImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Variation Preview Image',
        },
      ],
    },

    // 5. AI Tool & Generation Metadata
    {
      name: 'aiTool',
      type: 'select',
      label: 'AI Tool',
      options: [
        { label: 'Midjourney', value: 'midjourney' },
        { label: 'Flux', value: 'flux' },
        { label: 'Stable Diffusion', value: 'stable-diffusion' },
        { label: 'Runway Gen-3', value: 'runway-gen3' },
        { label: 'OpenAI Sora', value: 'sora' },
        { label: 'Kling AI', value: 'kling' },
        { label: 'Luma Dream Machine', value: 'luma' },
        { label: 'Google Veo 2', value: 'veo-2' },
        { label: 'Pika 2.0', value: 'pika' },
        { label: 'GPT Image', value: 'gpt-image' },
        { label: 'Ideogram', value: 'ideogram' },
        { label: 'Nano Banana', value: 'nano-banana' },
        { label: 'General / Any Model', value: 'general' },
      ],
    },
    {
      name: 'model',
      type: 'text',
      label: 'Model Version',
      admin: {
        placeholder: 'e.g. Midjourney V7, Flux.1 Pro, SDXL 1.0',
      },
    },
    {
      name: 'aspectRatio',
      type: 'select',
      label: 'Aspect Ratio',
      options: [
        { label: '1:1 (Square)', value: '1:1' },
        { label: '4:5 (Portrait)', value: '4:5' },
        { label: '16:9 (Landscape / Cinematic)', value: '16:9' },
        { label: '9:16 (Vertical Story)', value: '9:16' },
        { label: '3:2 (Classic 35mm)', value: '3:2' },
        { label: 'Custom', value: 'custom' },
      ],
    },
    {
      name: 'style',
      type: 'select',
      label: 'Visual Style',
      options: [
        { label: 'Photorealistic', value: 'photorealistic' },
        { label: 'Cinematic', value: 'cinematic' },
        { label: 'Product Photography', value: 'product-photography' },
        { label: 'Editorial', value: 'editorial' },
        { label: 'Anime', value: 'anime' },
        { label: '3D', value: '3d' },
        { label: 'Illustration', value: 'illustration' },
        { label: 'Minimal', value: 'minimal' },
        { label: 'Fashion', value: 'fashion' },
      ],
    },
    {
      name: 'useCase',
      type: 'select',
      label: 'Intended Use Case',
      options: [
        { label: 'Product Photography', value: 'product-photography' },
        { label: 'Social Media', value: 'social-media' },
        { label: 'Advertising', value: 'advertising' },
        { label: 'Portrait', value: 'portrait' },
        { label: 'E-commerce', value: 'e-commerce' },
        { label: 'YouTube Thumbnail', value: 'youtube-thumbnail' },
        { label: 'Branding', value: 'branding' },
        { label: 'Concept Art', value: 'concept-art' },
      ],
    },

    // Video Engine, Camera Motion & Keyframing (Condition: promptType === 'video')
    {
      name: 'videoFile',
      type: 'upload',
      relationTo: 'media',
      label: 'Video Output File',
      admin: {
        condition: (data) => data?.assetType === 'prompt' && data?.promptType === 'video',
        description: 'Rendered video file (MP4, WebM) preview for the asset.',
      },
    },
    {
      name: 'duration',
      type: 'text',
      label: 'Video Duration',
      admin: {
        condition: (data) => data?.assetType === 'prompt' && data?.promptType === 'video',
        placeholder: 'e.g. 15s, 30s, 60s (1 min)',
      },
    },
    {
      name: 'fps',
      type: 'select',
      label: 'Frame Rate (FPS)',
      admin: {
        condition: (data) => data?.assetType === 'prompt' && data?.promptType === 'video',
      },
      options: [
        { label: '24 FPS (Cinematic)', value: '24' },
        { label: '30 FPS (Standard)', value: '30' },
        { label: '60 FPS (High-Speed Motion)', value: '60' },
        { label: '120 FPS (Extreme Slow Motion)', value: '120' },
      ],
    },
    {
      name: 'motionStrength',
      type: 'number',
      label: 'Motion Strength (1-10)',
      admin: {
        condition: (data) => data?.assetType === 'prompt' && data?.promptType === 'video',
        placeholder: 'e.g. 7',
      },
    },
    {
      name: 'cameraMovement',
      type: 'select',
      label: 'Camera Movement',
      admin: {
        condition: (data) => data?.assetType === 'prompt' && data?.promptType === 'video',
      },
      options: [
        { label: 'Static / Locked-off', value: 'static' },
        { label: 'Dynamic Tracking', value: 'dynamic-tracking' },
        { label: 'Pan Left / Right', value: 'pan' },
        { label: 'Tilt Up / Down', value: 'tilt' },
        { label: 'Zoom In / Push-in', value: 'zoom-in' },
        { label: 'Zoom Out / Pull-out', value: 'zoom-out' },
        { label: 'Orbit 360°', value: 'orbit' },
        { label: 'FPV Drone Sweep', value: 'drone' },
        { label: 'Crane / Jib', value: 'crane' },
        { label: 'Handheld Subtle Jitter', value: 'handheld' },
      ],
    },
    {
      name: 'firstFramePrompt',
      type: 'textarea',
      label: 'First Frame / Starting Keyframe Prompt',
      admin: {
        condition: (data) => data?.assetType === 'prompt' && data?.promptType === 'video',
        description: 'Specific prompt or visual guidance to lock initial frame at 00:00.',
      },
    },
    {
      name: 'firstFrameImage',
      type: 'upload',
      relationTo: 'media',
      label: 'First Frame Reference Image',
      admin: {
        condition: (data) => data?.assetType === 'prompt' && data?.promptType === 'video',
      },
    },
    {
      name: 'lastFramePrompt',
      type: 'textarea',
      label: 'Last Frame / Ending Keyframe Prompt',
      admin: {
        condition: (data) => data?.assetType === 'prompt' && data?.promptType === 'video',
        description: 'Target ending frame prompt for beginning-to-end interpolation (Runway/Kling/Luma).',
      },
    },
    {
      name: 'lastFrameImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Last Frame Reference Image',
      admin: {
        condition: (data) => data?.assetType === 'prompt' && data?.promptType === 'video',
      },
    },

    // Multi-Scene Storyboard & Timeline Breakdown
    {
      name: 'scenes',
      type: 'array',
      label: 'Scene Storyboard & Timeline Breakdown',
      labels: {
        singular: 'Scene Chunk',
        plural: 'Scene Chunks',
      },
      admin: {
        condition: (data) => data?.assetType === 'prompt' && data?.promptType === 'video',
        description: 'Sequenced scene-by-scene prompt chunks for complex multi-shot videos.',
      },
      fields: [
        {
          name: 'sceneNumber',
          type: 'number',
          label: 'Scene #',
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Scene Title',
          admin: {
            placeholder: 'e.g. Establishing Drone Shot, Protagonist Interior, Climactic Exit',
          },
        },
        {
          name: 'timecode',
          type: 'text',
          label: 'Timecode Chunk',
          admin: {
            placeholder: 'e.g. 00:00 - 00:05',
          },
        },
        {
          name: 'shotType',
          type: 'select',
          label: 'Shot Framing',
          options: [
            { label: 'Extreme Wide Shot', value: 'extreme-wide' },
            { label: 'Wide Shot', value: 'wide' },
            { label: 'Medium Shot', value: 'medium' },
            { label: 'Close-Up', value: 'close-up' },
            { label: 'Extreme Close-Up', value: 'extreme-close-up' },
            { label: 'POV', value: 'pov' },
            { label: 'Aerial / Drone', value: 'drone' },
          ],
        },
        {
          name: 'cameraMotion',
          type: 'text',
          label: 'Scene Camera Motion',
          admin: {
            placeholder: 'e.g. Low-angle Dynamic Tracking, Smooth Push-In',
          },
        },
        {
          name: 'prompt',
          type: 'textarea',
          required: true,
          label: 'Scene Generation Prompt',
        },
        {
          name: 'audioCue',
          type: 'text',
          label: 'Audio / Voiceover / Sound Cue',
          admin: {
            placeholder: 'e.g. Deep bass drop, tire screech, Voiceover: "Power redefined"',
          },
        },
        {
          name: 'keyframeImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Scene Keyframe / Reference Image',
        },
      ],
    },

    // =========================================================================
    // CONTEXT PACK ARCHITECTURE & GROUNDING (condition: assetType === 'context_pack')
    // =========================================================================
    {
      name: 'version',
      type: 'text',
      label: 'Pack Version',
      defaultValue: 'v1.0.0',
      admin: {
        condition: (data) => data?.assetType === 'context_pack',
        description: 'Semantic version for this context pack release (e.g. v1.0.0, v2.4.0)',
      },
    },
    {
      name: 'schemaUri',
      type: 'text',
      label: 'Schema / Pack URI',
      admin: {
        condition: (data) => data?.assetType === 'context_pack',
        description: 'Protocol URI for agent resolution (e.g. contextnode.pack://v2.4/nextjs-saas)',
      },
    },
    {
      name: 'targetPersona',
      type: 'select',
      label: 'Target User / Agent Persona',
      admin: {
        condition: (data) => data?.assetType === 'context_pack',
      },
      options: [
        { label: 'Autonomous Agent (Cursor / Windsurf)', value: 'autonomous-agent' },
        { label: 'Claude Code CLI / Terminal Agent', value: 'claude-code' },
        { label: 'Senior Software Architect', value: 'senior-architect' },
        { label: 'AI Engineer / Data Scientist', value: 'ai-engineer' },
        { label: 'Systems / DevOps Engineer', value: 'systems-engineer' },
        { label: 'Technical Founder', value: 'founder' },
        { label: 'Custom Agent', value: 'custom' },
      ],
    },
    {
      name: 'systemPrompt',
      type: 'textarea',
      label: 'Root System Prompt / Foundational Directives',
      admin: {
        condition: (data) => data?.assetType === 'context_pack',
        description: 'The master prompt injected at the root of the context window.',
      },
    },
    {
      name: 'goldenRules',
      type: 'textarea',
      label: 'Golden Rules (Must Do)',
      admin: {
        condition: (data) => data?.assetType === 'context_pack',
        description: 'Strict positive requirements and architectural constraints.',
      },
    },
    {
      name: 'negativeConstraints',
      type: 'textarea',
      label: 'Negative Constraints (Never Do)',
      admin: {
        condition: (data) => data?.assetType === 'context_pack',
        description: 'Guardrails, anti-patterns, and disallowed implementations.',
      },
    },
    {
      name: 'validationGates',
      type: 'array',
      label: 'Automated Quality Gates & Checklists',
      admin: {
        condition: (data) => data?.assetType === 'context_pack',
      },
      fields: [
        {
          name: 'gate',
          type: 'text',
          required: true,
          label: 'Validation Test / Quality Gate',
        },
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: true,
          label: 'Enforced',
        },
      ],
    },
    {
      name: 'files',
      type: 'array',
      label: 'Package Files & Directory Structure',
      admin: {
        condition: (data) => data?.assetType === 'context_pack',
        description: 'Collection of files and folder rules packaged into this resource.',
      },
      fields: [
        {
          name: 'path',
          type: 'text',
          required: true,
          label: 'File Path',
          admin: {
            placeholder: 'e.g. .cursor/rules/nextjs-conventions.md',
          },
        },
        {
          name: 'description',
          type: 'text',
          label: 'File Purpose / Description',
        },
        {
          name: 'fileType',
          type: 'select',
          label: 'File Type',
          options: [
            { label: 'Markdown (.md)', value: 'markdown' },
            { label: 'JSON (.json)', value: 'json' },
            { label: 'TypeScript / JS', value: 'typescript' },
            { label: 'Python (.py)', value: 'python' },
            { label: 'Rust (.rs)', value: 'rust' },
            { label: 'SQL Schema / Policies', value: 'sql' },
            { label: 'YAML / Config', value: 'yaml' },
            { label: 'Configuration (.rules)', value: 'config' },
          ],
        },
        {
          name: 'content',
          type: 'textarea',
          required: true,
          label: 'File Content',
        },
      ],
    },
    {
      name: 'supportedTools',
      type: 'select',
      hasMany: true,
      label: 'Supported AI Tools',
      admin: {
        condition: (data) => data?.assetType === 'context_pack',
      },
      options: [
        { label: 'Cursor IDE', value: 'cursor' },
        { label: 'Windsurf Codeium', value: 'windsurf' },
        { label: 'Claude Code CLI', value: 'claude-code' },
        { label: 'GitHub Copilot', value: 'copilot' },
        { label: 'ChatGPT / Claude Web', value: 'chatgpt' },
        { label: 'Local Models (Ollama)', value: 'ollama' },
      ],
    },
    {
      name: 'zipBundle',
      type: 'upload',
      relationTo: 'media',
      label: 'Downloadable ZIP Bundle Archive',
      admin: {
        condition: (data) => data?.assetType === 'context_pack',
        description: 'Pre-packaged ZIP archive containing the complete directory structure and manifest.',
      },
    },

    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories' as any,
      required: false,
      label: 'Category',
    },
    {
      name: 'categoryText',
      type: 'text',
      label: 'Category Name',
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags' as any,
      hasMany: true,
      label: 'Tags',
    },
    {
      name: 'tagList',
      type: 'array',
      label: 'Tag Keywords',
      fields: [
        {
          name: 'tag',
          type: 'text',
        },
      ],
    },

    // 7. Search Engine Optimization (SEO)
    {
      name: 'seo',
      type: 'group',
      label: 'Search Engine Optimization',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'SEO Title Override',
          admin: {
            description: 'Falls back to asset title if empty',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'SEO Meta Description',
          admin: {
            description: 'Optimized search engine description under 160 characters',
          },
        },
        {
          name: 'keywords',
          type: 'text',
          label: 'SEO Keywords',
        },
        {
          name: 'ogImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Open Graph Image',
          admin: {
            description: 'Falls back to cover preview image if not specified',
          },
        },
      ],
    },

    // 8. Publishing & Access
    {
      name: 'accessType',
      type: 'select',
      defaultValue: 'FREE',
      label: 'Access Model',
      options: [
        { label: 'Free / Public Domain', value: 'FREE' },
        { label: 'One-Time Paid Asset', value: 'PAID' },
        { label: 'Free', value: 'free' },
        { label: 'Paid', value: 'paid' },
      ],
    },
    {
      name: 'price',
      type: 'number',
      defaultValue: 0,
      label: 'Price (USD)',
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'published',
      options: [
        { label: 'Pending Review', value: 'pending_review' },
        { label: 'Published', value: 'published' },
        { label: 'Draft', value: 'draft' },
        { label: 'Rejected / Changes Requested', value: 'rejected' },
        { label: 'Archived', value: 'archived' },
        { label: 'Pending Review (upper)', value: 'PENDING_REVIEW' },
        { label: 'Published (upper)', value: 'PUBLISHED' },
        { label: 'Draft (upper)', value: 'DRAFT' },
        { label: 'Rejected (upper)', value: 'REJECTED' },
        { label: 'Archived (upper)', value: 'ARCHIVED' },
      ],
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      label: 'Featured on Homepage',
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      label: 'Author / Curator',
    },
  ],
}
