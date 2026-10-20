'use client'

import React, { useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface VariationState {
  id: string
  title: string
  description: string
  prompt: string
  previewImageId: number | string | null
  previewImageUrl: string | null
  previewImageName: string
}

export function ImagePromptCreateView() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // 1. Cover Image State
  const [coverImageId, setCoverImageId] = useState<number | string | null>(null)
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null)
  const [coverImageName, setCoverImageName] = useState<string>('')
  const [uploadingCover, setUploadingCover] = useState(false)
  const coverFileInputRef = useRef<HTMLInputElement>(null)

  // 2. Main Prompt
  const [mainPrompt, setMainPrompt] = useState('')

  // 3. Asset Identity
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [isSlugManual, setIsSlugManual] = useState(false)
  const [category, setCategory] = useState('Product')

  // 4. Descriptions
  const [shortDescription, setShortDescription] = useState('')
  const [fullDescription, setFullDescription] = useState('')

  // 5. Prompt Configuration
  const [negativePrompt, setNegativePrompt] = useState('')
  const [aiTool, setAiTool] = useState('midjourney')
  const [model, setModel] = useState('Midjourney V7')
  const [aspectRatio, setAspectRatio] = useState('16:9')
  const [style, setStyle] = useState('product-photography')
  const [useCase, setUseCase] = useState('product-photography')

  // 6. Variations
  const [variations, setVariations] = useState<VariationState[]>([])

  // 7. Tags
  const [tags, setTags] = useState<string[]>([
    'luxury',
    'product-photography',
    'perfume',
    'cinematic',
    'studio',
  ])
  const [tagInput, setTagInput] = useState('')

  // 8. SEO
  const [seoTitle, setSeoTitle] = useState('')
  const [seoDesc, setSeoDesc] = useState('')
  const [ogImageId, setOgImageId] = useState<number | string | null>(null)
  const [ogImageName, setOgImageName] = useState<string>('')

  // 9. Publishing
  const [accessType, setAccessType] = useState<'FREE' | 'PAID'>('FREE')
  const [price, setPrice] = useState<string>('0.00')
  const [publishStatus, setPublishStatus] = useState<'published' | 'draft' | 'archived'>('published')
  const [featured, setFeatured] = useState(false)

  // Auto-slugify
  const handleTitleChange = (val: string) => {
    setTitle(val)
    if (!isSlugManual) {
      const generated = val
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
      setSlug(generated)
    }
  }

  // Cover image upload directly to /api/media
  const handleCoverUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file.')
      return
    }

    setUploadingCover(true)
    setError(null)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('_payload', JSON.stringify({ alt: title || file.name || 'Cover Image' }))
    formData.append('alt', title || file.name || 'Cover Image')

    try {
      const res = await fetch('/api/media', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.errors?.[0]?.message || 'Image upload failed.')
      }

      const doc = data.doc
      setCoverImageId(doc.id)
      setCoverImageUrl(doc.url)
      setCoverImageName(file.name)
    } catch (err: any) {
      console.error('Cover upload error:', err)
      setError(err.message || 'Image upload failed.')
    } finally {
      setUploadingCover(false)
    }
  }

  // Variations Image Upload
  const handleVariationImageUpload = async (index: number, file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('_payload', JSON.stringify({ alt: `Variation ${index + 1}` }))
    formData.append('alt', `Variation ${index + 1}`)

    try {
      const res = await fetch('/api/media', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.errors?.[0]?.message || 'Image upload failed.')

      const doc = data.doc
      setVariations((prev) => {
        const next = [...prev]
        next[index].previewImageId = doc.id
        next[index].previewImageUrl = doc.url
        next[index].previewImageName = file.name
        return next
      })
    } catch (err: any) {
      alert(err.message || 'Error uploading variation image')
    }
  }

  // Add variation
  const addVariation = () => {
    setVariations((prev) => [
      ...prev,
      {
        id: `var-${Date.now()}`,
        title: '',
        description: '',
        prompt: '',
        previewImageId: null,
        previewImageUrl: null,
        previewImageName: '',
      },
    ])
  }

  // Remove variation
  const removeVariation = (index: number) => {
    setVariations((prev) => prev.filter((_, i) => i !== index))
  }

  // Tags management
  const addTag = (text: string) => {
    if (!text.trim()) return
    const rawTokens = text.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean)
    const newTags = [...tags]
    for (const token of rawTokens) {
      if (!newTags.includes(token)) {
        newTags.push(token)
      }
    }
    setTags(newTags)
    setTagInput('')
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove))
  }

  // Form Submit (Draft or Publish)
  const handleSubmit = async (targetStatus?: 'published' | 'draft') => {
    setError(null)
    setSuccess(null)

    const finalStatus = targetStatus || publishStatus

    if (!title.trim()) {
      setError('Please provide an Asset Title.')
      return
    }

    if (!slug.trim()) {
      setError('Please provide a Canonical Slug.')
      return
    }

    if (!shortDescription.trim()) {
      setError('Please provide a Short Description.')
      return
    }

    if (!mainPrompt.trim()) {
      setError('Please provide the Main Prompt.')
      return
    }

    setSubmitting(true)

    // Collect all tags including any pending in input
    const allTags = [...tags]
    if (tagInput.trim()) {
      const pendingTokens = tagInput.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean)
      for (const pt of pendingTokens) {
        if (!allTags.includes(pt)) allTags.push(pt)
      }
    }

    // Build Payload Body
    const payloadBody = {
      title: title.trim(),
      slug: slug.trim(),
      categoryText: category || 'Product',
      shortDescription: shortDescription.trim(),
      fullDescription: fullDescription.trim(),
      assetType: 'prompt',
      promptType: 'image',
      coverImage: coverImageId || undefined,
      mainPrompt: mainPrompt.trim(),
      negativePrompt: negativePrompt.trim() || undefined,
      aiTool,
      model: model.trim() || undefined,
      aspectRatio,
      style,
      useCase,
      variations: variations.map((v) => ({
        title: v.title.trim(),
        description: v.description.trim() || undefined,
        prompt: v.prompt.trim(),
        previewImage: v.previewImageId || undefined,
      })),
      tagList: allTags.map((t) => ({ tag: t.trim() })).filter((t) => Boolean(t.tag)),
      accessType,
      price: accessType === 'PAID' ? parseFloat(price) || 0 : 0,
      status: finalStatus,
      featured,
      seoTitle: seoTitle.trim() || undefined,
      seoDescription: seoDesc.trim() || undefined,
      ogImage: ogImageId || undefined,
    }

    try {
      const res = await fetch('/api/ai-assets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payloadBody),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.errors?.[0]?.message || 'Failed to create image prompt.')
      }

      setSuccess(`Image Prompt "${title}" created successfully (${finalStatus})!`)
      setTimeout(() => {
        router.push('/dashboard/image-prompts')
      }, 1000)
    } catch (err: any) {
      console.error('Submit error:', err)
      setError(err.message || 'Failed to create prompt.')
      setSubmitting(false)
    }
  }

  return (
    <div style={{ padding: '24px 32px', maxWidth: '1440px', margin: '0 auto', width: '100%' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: '#6C6C78', marginBottom: '8px' }}>
            <Link href="/dashboard" style={{ color: '#A5A5AF', textDecoration: 'none' }}>Dashboard</Link>
            <span>/</span>
            <Link href="/dashboard/image-prompts" style={{ color: '#A5A5AF', textDecoration: 'none' }}>Image Prompts</Link>
            <span>/</span>
            <span style={{ color: '#F5F5F7' }}>Create</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#F5F5F7', margin: 0, letterSpacing: '-0.02em' }}>Create Image Prompt</h1>
          <p style={{ fontSize: '0.875rem', color: '#A5A5AF', margin: '4px 0 0 0' }}>Define and publish a complete AI image-generation asset with variations, parameters, and discovery metadata.</p>
        </div>

        <div>
          <Link
            href="/dashboard/image-prompts"
            style={{
              padding: '8px 16px',
              fontSize: '0.8125rem',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#A5A5AF',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            Cancel
          </Link>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div style={{ padding: '16px 20px', background: 'rgba(230, 106, 115, 0.1)', border: '1px solid rgba(230, 106, 115, 0.3)', borderRadius: '10px', color: '#E66A73', marginBottom: '24px', fontSize: '0.875rem' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {success && (
        <div style={{ padding: '16px 20px', background: 'rgba(79, 209, 139, 0.1)', border: '1px solid rgba(79, 209, 139, 0.3)', borderRadius: '10px', color: '#4FD18B', marginBottom: '24px', fontSize: '0.875rem' }}>
          <strong>Success:</strong> {success}
        </div>
      )}

      {/* Form Container */}
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* 1. TOP GRID: Cover Image & Main Prompt */}
        <div className="grid-2col-layout">
          {/* LEFT: Cover Image Upload */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', background: '#101014', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px' }}>
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#F5F5F7', margin: '0 0 4px 0' }}>
                Main Preview / Thumbnail <span style={{ color: '#E66A73' }}>*</span>
              </h3>
              <p style={{ fontSize: '0.8125rem', color: '#A5A5AF', margin: 0 }}>Example generated output image representing this prompt.</p>
            </div>

            <input
              type="file"
              ref={coverFileInputRef}
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleCoverUpload(e.target.files[0])
                }
              }}
            />

            {!coverImageUrl ? (
              <div
                className="dropzone-box"
                onClick={() => coverFileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault()
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    handleCoverUpload(e.dataTransfer.files[0])
                  }
                }}
                style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '260px' }}
              >
                <div className="dropzone-icon" style={{ marginBottom: '12px' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                    <circle cx="9" cy="9" r="2"></circle>
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                  </svg>
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <button
                    type="button"
                    disabled={uploadingCover}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      background: 'rgba(255,255,255,0.08)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      color: '#F5F5F7',
                      fontSize: '0.8125rem',
                      fontWeight: 500,
                      cursor: 'pointer',
                    }}
                  >
                    {uploadingCover ? 'Uploading...' : 'Upload Cover Image'}
                  </button>
                </div>
                <span style={{ fontSize: '0.78rem', color: '#6C6C78' }}>
                  Click to browse or drag & drop (PNG, JPG, WebP)
                </span>
              </div>
            ) : (
              <div style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', overflow: 'hidden', background: '#08080C', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: '240px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: '#0B0B10' }}>
                  <img src={coverImageUrl} alt="Preview" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ fontSize: '0.8125rem', color: '#A5A5AF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '65%' }}>
                    {coverImageName || 'Cover Image Uploaded'}
                  </span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => coverFileInputRef.current?.click()}
                      style={{ padding: '4px 10px', fontSize: '0.75rem', borderRadius: '6px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#F5F5F7', cursor: 'pointer' }}
                    >
                      Change
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCoverImageId(null)
                        setCoverImageUrl(null)
                        setCoverImageName('')
                      }}
                      style={{ padding: '4px 10px', fontSize: '0.75rem', borderRadius: '6px', background: 'transparent', border: '1px solid rgba(230,106,115,0.3)', color: '#E66A73', cursor: 'pointer' }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            )}
            <span style={{ fontSize: '0.75rem', color: '#6C6C78', marginTop: '10px' }}>
              This image represents the output thumbnail, not the prompt text itself.
            </span>
          </div>

          {/* RIGHT: Main Prompt */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', background: '#101014', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px' }}>
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#F5F5F7', margin: '0 0 4px 0' }}>
                Main Prompt <span style={{ color: '#E66A73' }}>*</span>
              </h3>
              <p style={{ fontSize: '0.8125rem', color: '#A5A5AF', margin: 0 }}>The primary AI image-generation instruction.</p>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <textarea
                className="form-control"
                value={mainPrompt}
                onChange={(e) => setMainPrompt(e.target.value)}
                rows={9}
                placeholder="Create a cinematic luxury product photograph of a premium black perfume bottle placed on a reflective marble surface, dramatic studio lighting, soft volumetric shadows, shallow depth of field, ultra realistic..."
                style={{
                  flex: 1,
                  minHeight: '230px',
                  fontSize: '0.92rem',
                  lineHeight: '1.6',
                  padding: '14px 16px',
                  borderRadius: '10px',
                  backgroundColor: '#0B0B0F',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  color: '#F5F5F7',
                  resize: 'vertical',
                }}
                required
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                <span style={{ fontSize: '0.75rem', color: '#6C6C78' }}>Stored strictly as asset generation content.</span>
                <span style={{ fontSize: '0.75rem', color: '#6C6C78', fontFamily: 'monospace' }}>
                  {mainPrompt.length} characters
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. SECOND GRID: Identity & Descriptions */}
        <div className="grid-2col-equal">
          {/* Asset Identity */}
          <div className="card" style={{ background: '#101014', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px' }}>
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#F5F5F7', margin: '0 0 4px 0' }}>Asset Identity</h3>
              <p style={{ fontSize: '0.8125rem', color: '#A5A5AF', margin: 0 }}>Public title, canonical slug, and core category.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: '#F5F5F7', marginBottom: '6px' }}>
                  Title <span style={{ color: '#E66A73' }}>*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Luxury Product Photography Prompt"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  style={{ width: '100%', height: '42px', padding: '0 14px', borderRadius: '8px', background: '#0B0B0F', border: '1px solid rgba(255,255,255,0.08)', color: '#F5F5F7' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: '#F5F5F7', marginBottom: '6px' }}>
                  Slug <span style={{ color: '#E66A73' }}>*</span>
                </label>
                <div className="input-addon-group">
                  <span className="input-addon input-addon-left">contextnode.ai/prompts/</span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="luxury-product-photography-prompt"
                    value={slug}
                    onChange={(e) => {
                      setSlug(e.target.value)
                      setIsSlugManual(true)
                    }}
                    style={{ flex: 1, height: '42px', padding: '0 14px', background: '#0B0B0F', border: '1px solid rgba(255,255,255,0.08)', color: '#F5F5F7', fontFamily: 'monospace', fontSize: '0.85rem' }}
                    required
                  />
                </div>
                <span style={{ fontSize: '0.75rem', color: '#6C6C78', marginTop: '4px', display: 'block' }}>
                  Generated automatically from the title, but editable.
                </span>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: '#F5F5F7', marginBottom: '6px' }}>
                  Category <span style={{ color: '#E66A73' }}>*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{ width: '100%', height: '42px', padding: '0 14px', borderRadius: '8px', background: '#0B0B0F', border: '1px solid rgba(255,255,255,0.08)', color: '#F5F5F7' }}
                  required
                >
                  <option value="Product">Product</option>
                  <option value="Photography">Photography</option>
                  <option value="Portrait">Portrait</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Architecture">Architecture</option>
                  <option value="Cinematic">Cinematic</option>
                  <option value="Illustration">Illustration</option>
                  <option value="3D">3D</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Social Media">Social Media</option>
                  <option value="Concept Art">Concept Art</option>
                </select>
              </div>
            </div>
          </div>

          {/* Asset Descriptions */}
          <div className="card" style={{ background: '#101014', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px' }}>
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#F5F5F7', margin: '0 0 4px 0' }}>Asset Descriptions</h3>
              <p style={{ fontSize: '0.8125rem', color: '#A5A5AF', margin: 0 }}>Concise discovery summaries and extended usage context.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: '#F5F5F7', marginBottom: '6px' }}>
                  Short Description <span style={{ color: '#E66A73' }}>*</span>
                </label>
                <textarea
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  rows={2}
                  placeholder="e.g. Generate premium studio-style product photography with realistic lighting and commercial composition."
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: '#0B0B0F', border: '1px solid rgba(255,255,255,0.08)', color: '#F5F5F7', fontSize: '0.875rem', resize: 'vertical' }}
                  required
                />
                <span style={{ fontSize: '0.75rem', color: '#6C6C78', marginTop: '4px', display: 'block' }}>
                  A concise description explaining what the prompt is useful for (max 160 chars).
                </span>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: '#F5F5F7', marginBottom: '6px' }}>
                  Full Description <span style={{ fontSize: '0.75rem', color: '#6C6C78' }}>(Optional)</span>
                </label>
                <textarea
                  value={fullDescription}
                  onChange={(e) => setFullDescription(e.target.value)}
                  rows={4}
                  placeholder="Detailed explanation of what the prompt does, when to use it, expected output, and important usage notes. Do not put the actual prompt here..."
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: '#0B0B0F', border: '1px solid rgba(255,255,255,0.08)', color: '#F5F5F7', fontSize: '0.875rem', resize: 'vertical' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 3. PROMPT CONFIGURATION */}
        <div className="card" style={{ background: '#101014', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px' }}>
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#F5F5F7', margin: '0 0 4px 0' }}>Prompt Configuration</h3>
            <p style={{ fontSize: '0.8125rem', color: '#A5A5AF', margin: 0 }}>Configure negative prompts and intended AI image generator specifications.</p>
          </div>

          {/* Negative Prompt */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: '#F5F5F7', marginBottom: '6px' }}>
              Negative Prompt <span style={{ fontSize: '0.75rem', color: '#6C6C78' }}>(Optional)</span>
            </label>
            <textarea
              value={negativePrompt}
              onChange={(e) => setNegativePrompt(e.target.value)}
              rows={2}
              placeholder="e.g. ugly, deformed, oversaturated, amateur photography, lowres, text, watermark, logo, plastic shine, noisy background"
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: '#0B0B0F', border: '1px solid rgba(255,255,255,0.08)', color: '#F5F5F7', fontSize: '0.875rem', resize: 'vertical' }}
            />
            <span style={{ fontSize: '0.75rem', color: '#6C6C78', marginTop: '4px', display: 'block' }}>
              Elements or artifacts to avoid. Stored independently and never automatically appended to the main prompt.
            </span>
          </div>

          {/* Parameters Grid */}
          <div className="form-grid">
            <div className="col-4">
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: '#F5F5F7', marginBottom: '6px' }}>AI Tool</label>
              <select
                value={aiTool}
                onChange={(e) => setAiTool(e.target.value)}
                style={{ width: '100%', height: '42px', padding: '0 14px', borderRadius: '8px', background: '#0B0B0F', border: '1px solid rgba(255,255,255,0.08)', color: '#F5F5F7' }}
              >
                <option value="midjourney">Midjourney</option>
                <option value="flux">Flux</option>
                <option value="stable-diffusion">Stable Diffusion</option>
                <option value="gpt-image">GPT Image (DALL-E)</option>
                <option value="ideogram">Ideogram</option>
                <option value="nano-banana">Nano Banana</option>
                <option value="general">General / Any Model</option>
              </select>
            </div>

            <div className="col-4">
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: '#F5F5F7', marginBottom: '6px' }}>Model Version</label>
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="e.g. Midjourney V7, Flux.1 Pro"
                style={{ width: '100%', height: '42px', padding: '0 14px', borderRadius: '8px', background: '#0B0B0F', border: '1px solid rgba(255,255,255,0.08)', color: '#F5F5F7' }}
              />
            </div>

            <div className="col-4">
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: '#F5F5F7', marginBottom: '6px' }}>Aspect Ratio</label>
              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value)}
                style={{ width: '100%', height: '42px', padding: '0 14px', borderRadius: '8px', background: '#0B0B0F', border: '1px solid rgba(255,255,255,0.08)', color: '#F5F5F7' }}
              >
                <option value="1:1">1:1 (Square)</option>
                <option value="4:5">4:5 (Portrait / Social)</option>
                <option value="16:9">16:9 (Landscape / Cinematic)</option>
                <option value="9:16">9:16 (Vertical Story)</option>
                <option value="3:2">3:2 (Classic 35mm)</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            <div className="col-6">
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: '#F5F5F7', marginBottom: '6px' }}>Visual Style</label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                style={{ width: '100%', height: '42px', padding: '0 14px', borderRadius: '8px', background: '#0B0B0F', border: '1px solid rgba(255,255,255,0.08)', color: '#F5F5F7' }}
              >
                <option value="photorealistic">Photorealistic</option>
                <option value="cinematic">Cinematic</option>
                <option value="product-photography">Product Photography</option>
                <option value="editorial">Editorial</option>
                <option value="anime">Anime</option>
                <option value="3d">3D Render</option>
                <option value="illustration">Illustration</option>
                <option value="minimal">Minimal</option>
                <option value="fashion">Fashion</option>
              </select>
            </div>

            <div className="col-6">
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: '#F5F5F7', marginBottom: '6px' }}>Intended Use Case</label>
              <select
                value={useCase}
                onChange={(e) => setUseCase(e.target.value)}
                style={{ width: '100%', height: '42px', padding: '0 14px', borderRadius: '8px', background: '#0B0B0F', border: '1px solid rgba(255,255,255,0.08)', color: '#F5F5F7' }}
              >
                <option value="product-photography">Product Photography</option>
                <option value="social-media">Social Media</option>
                <option value="advertising">Advertising</option>
                <option value="portrait">Portrait</option>
                <option value="e-commerce">E-commerce</option>
                <option value="youtube-thumbnail">YouTube Thumbnail</option>
                <option value="branding">Branding</option>
                <option value="concept-art">Concept Art</option>
              </select>
            </div>
          </div>
        </div>

        {/* 4. PROMPT VARIATIONS */}
        <div className="card" style={{ background: '#101014', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#F5F5F7', margin: '0 0 4px 0' }}>Prompt Variations</h3>
              <p style={{ fontSize: '0.8125rem', color: '#A5A5AF', margin: 0 }}>Alternative prompts designed to generate multiple views, camera angles, or compositions.</p>
            </div>
            <button
              type="button"
              onClick={addVariation}
              style={{
                padding: '6px 14px',
                fontSize: '0.8125rem',
                borderRadius: '8px',
                background: 'rgba(108, 140, 255, 0.12)',
                border: '1px solid rgba(108, 140, 255, 0.3)',
                color: '#6C8CFF',
                cursor: 'pointer',
                fontWeight: 500,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              + Add Variation
            </button>
          </div>

          {variations.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '12px', background: 'rgba(255,255,255,0.01)' }}>
              <p style={{ fontSize: '0.8125rem', color: '#6C6C78', margin: '0 0 4px 0' }}>No prompt variations added. Variations are completely optional.</p>
              <span style={{ fontSize: '0.75rem', color: '#A5A5AF' }}>If this asset supports multiple angles (e.g. Front View, 45 Degree View, Top View), click <strong>+ Add Variation</strong> above.</span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {variations.map((v, idx) => (
                <div
                  key={v.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: '12px',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ background: 'rgba(108,140,255,0.15)', color: '#6C8CFF', fontSize: '0.72rem', fontWeight: 600, padding: '2px 8px', borderRadius: '4px' }}>
                        Variation {idx + 1}
                      </span>
                      <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#F5F5F7' }}>
                        {v.title || 'Untitled Variation'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeVariation(idx)}
                      style={{ background: 'none', border: 'none', color: '#E66A73', fontSize: '0.75rem', cursor: 'pointer' }}
                    >
                      Remove
                    </button>
                  </div>

                  <div className="form-grid">
                    <div className="col-6">
                      <label style={{ display: 'block', fontSize: '0.78rem', color: '#A5A5AF', marginBottom: '4px' }}>Variation Title *</label>
                      <input
                        type="text"
                        value={v.title}
                        onChange={(e) => {
                          const val = e.target.value
                          setVariations((prev) => {
                            const next = [...prev]
                            next[idx].title = val
                            return next
                          })
                        }}
                        placeholder="e.g. Front View, 45 Degree View"
                        style={{ width: '100%', height: '38px', padding: '0 12px', borderRadius: '6px', background: '#0B0B0F', border: '1px solid rgba(255,255,255,0.08)', color: '#F5F5F7' }}
                      />
                    </div>

                    <div className="col-6">
                      <label style={{ display: 'block', fontSize: '0.78rem', color: '#A5A5AF', marginBottom: '4px' }}>Short Description (Optional)</label>
                      <input
                        type="text"
                        value={v.description}
                        onChange={(e) => {
                          const val = e.target.value
                          setVariations((prev) => {
                            const next = [...prev]
                            next[idx].description = val
                            return next
                          })
                        }}
                        placeholder="e.g. Direct front-facing product composition"
                        style={{ width: '100%', height: '38px', padding: '0 12px', borderRadius: '6px', background: '#0B0B0F', border: '1px solid rgba(255,255,255,0.08)', color: '#F5F5F7' }}
                      />
                    </div>

                    <div className="col-12">
                      <label style={{ display: 'block', fontSize: '0.78rem', color: '#A5A5AF', marginBottom: '4px' }}>Variation Prompt *</label>
                      <textarea
                        value={v.prompt}
                        onChange={(e) => {
                          const val = e.target.value
                          setVariations((prev) => {
                            const next = [...prev]
                            next[idx].prompt = val
                            return next
                          })
                        }}
                        rows={3}
                        placeholder="Specific variation prompt for this angle..."
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', background: '#0B0B0F', border: '1px solid rgba(255,255,255,0.08)', color: '#F5F5F7', fontSize: '0.85rem' }}
                      />
                    </div>

                    <div className="col-12">
                      <label style={{ display: 'block', fontSize: '0.78rem', color: '#A5A5AF', marginBottom: '4px' }}>Variation Preview Image (Optional)</label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <input
                          type="file"
                          id={`var-file-${idx}`}
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handleVariationImageUpload(idx, e.target.files[0])
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => document.getElementById(`var-file-${idx}`)?.click()}
                          style={{ padding: '6px 12px', fontSize: '0.75rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: '#F5F5F7', cursor: 'pointer' }}
                        >
                          {v.previewImageUrl ? 'Change Image' : 'Upload Output'}
                        </button>
                        <span style={{ fontSize: '0.8rem', color: '#A5A5AF' }}>
                          {v.previewImageName || (v.previewImageUrl ? 'Image Attached' : 'No image uploaded')}
                        </span>
                        {v.previewImageUrl && (
                          <button
                            type="button"
                            onClick={() => {
                              setVariations((prev) => {
                                const next = [...prev]
                                next[idx].previewImageId = null
                                next[idx].previewImageUrl = null
                                next[idx].previewImageName = ''
                                return next
                              })
                            }}
                            style={{ background: 'none', border: 'none', color: '#E66A73', fontSize: '0.75rem', cursor: 'pointer' }}
                          >
                            Clear
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 5. DISCOVERY (Tags) */}
        <div className="card" style={{ background: '#101014', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px' }}>
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#F5F5F7', margin: '0 0 4px 0' }}>Discovery</h3>
            <p style={{ fontSize: '0.8125rem', color: '#A5A5AF', margin: 0 }}>Searchable keywords and tags for platform discovery.</p>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: '#F5F5F7', marginBottom: '6px' }}>Tags</label>
            <div className="tag-input-wrapper">
              {tags.map((t) => (
                <span key={t} className="tag-pill">
                  {t}
                  <button type="button" className="tag-remove" onClick={() => removeTag(t)}>
                    &times;
                  </button>
                </span>
              ))}
              <input
                type="text"
                className="tag-input-field"
                placeholder="Add tag (press Enter)..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ',') {
                    e.preventDefault()
                    addTag(tagInput)
                  }
                }}
                onBlur={() => {
                  if (tagInput.trim()) {
                    addTag(tagInput)
                  }
                }}
              />
            </div>
            <span style={{ fontSize: '0.75rem', color: '#6C6C78', marginTop: '6px', display: 'block' }}>
              Type a keyword and press Enter or comma. Tags are reusable across ContextNode.
            </span>
          </div>
        </div>

        {/* 6. PUBLISHING & MONETIZATION */}
        <div className="card" style={{ background: '#101014', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px' }}>
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#F5F5F7', margin: '0 0 4px 0' }}>Publishing & Monetization</h3>
            <p style={{ fontSize: '0.8125rem', color: '#A5A5AF', margin: 0 }}>Configure monetization, platform promotion, and publishing state.</p>
          </div>

          <div className="form-grid">
            <div className="col-4">
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: '#F5F5F7', marginBottom: '6px' }}>Access Model</label>
              <select
                value={accessType}
                onChange={(e) => {
                  const val = e.target.value as 'FREE' | 'PAID'
                  setAccessType(val)
                  if (val === 'PAID' && parseFloat(price) <= 0) {
                    setPrice('19.00')
                  }
                }}
                style={{ width: '100%', height: '42px', padding: '0 14px', borderRadius: '8px', background: '#0B0B0F', border: '1px solid rgba(255,255,255,0.08)', color: '#F5F5F7' }}
              >
                <option value="FREE">Free / Public Domain</option>
                <option value="PAID">One-Time Paid Asset</option>
              </select>
            </div>

            <div className="col-4">
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: '#F5F5F7', marginBottom: '6px' }}>Price (USD)</label>
              <div className="input-addon-group">
                <span className="input-addon input-addon-left">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  disabled={accessType === 'FREE'}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  style={{ flex: 1, height: '42px', padding: '0 14px', background: '#0B0B0F', border: '1px solid rgba(255,255,255,0.08)', color: '#F5F5F7', fontFamily: 'monospace' }}
                />
              </div>
            </div>

            <div className="col-4">
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: '#F5F5F7', marginBottom: '6px' }}>Status</label>
              <select
                value={publishStatus}
                onChange={(e) => setPublishStatus(e.target.value as any)}
                style={{ width: '100%', height: '42px', padding: '0 14px', borderRadius: '8px', background: '#0B0B0F', border: '1px solid rgba(255,255,255,0.08)', color: '#F5F5F7' }}
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div className="col-12" style={{ paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label className="switch-label">
                <input
                  type="checkbox"
                  className="switch-input"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                />
                <span className="switch-slider"></span>
                <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#F5F5F7' }}>Featured on Platform Homepage</span>
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <Link
              href="/dashboard/image-prompts"
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#A5A5AF',
                fontSize: '0.8125rem',
                textDecoration: 'none',
              }}
            >
              Cancel
            </Link>

            <button
              type="button"
              disabled={submitting}
              onClick={() => handleSubmit('draft')}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#F5F5F7',
                fontSize: '0.8125rem',
                fontWeight: 500,
                cursor: submitting ? 'not-allowed' : 'pointer',
              }}
            >
              Save Draft
            </button>

            <button
              type="submit"
              disabled={submitting}
              style={{
                padding: '10px 24px',
                borderRadius: '8px',
                background: '#6C8CFF',
                border: 'none',
                color: '#050505',
                fontSize: '0.8125rem',
                fontWeight: 600,
                cursor: submitting ? 'not-allowed' : 'pointer',
                boxShadow: '0 0 20px rgba(108, 140, 255, 0.4)',
                opacity: submitting ? 0.7 : 1,
                minWidth: '160px',
              }}
            >
              {submitting ? 'Publishing...' : 'Publish Image Prompt'}
            </button>
          </div>
        </div>

      </form>
    </div>
  )
}

