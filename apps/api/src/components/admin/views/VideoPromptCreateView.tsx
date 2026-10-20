'use client'

import React, { useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface SceneItemState {
  id: string
  sceneNumber: number
  title: string
  timecode: string
  shotType: string
  cameraMotion: string
  prompt: string
  audioCue: string
  keyframeImageId?: number | string | null
  keyframeImageUrl?: string | null
  keyframeImageName?: string
}

export function VideoPromptCreateView() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  // Helper upload function
  const uploadFile = async (file: File, defaultAlt: string) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('_payload', JSON.stringify({ alt: defaultAlt || file.name || 'Media Asset' }))
    formData.append('alt', defaultAlt || file.name || 'Media Asset')

    const res = await fetch('/api/media', {
      method: 'POST',
      body: formData,
    })

    const data = await res.json()
    if (!res.ok) {
      throw new Error(data.errors?.[0]?.message || 'File upload failed.')
    }
    return data.doc
  }

  // 1. Video & Poster state
  const [videoId, setVideoId] = useState<number | string | null>(null)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [videoName, setVideoName] = useState<string>('')
  const [uploadingVideo, setUploadingVideo] = useState(false)
  const videoInputRef = useRef<HTMLInputElement>(null)

  const [coverImageId, setCoverImageId] = useState<number | string | null>(null)
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null)
  const [coverImageName, setCoverImageName] = useState<string>('')
  const [uploadingCover, setUploadingCover] = useState(false)
  const posterInputRef = useRef<HTMLInputElement>(null)

  const handleVideoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (!file.type.startsWith('video/')) {
        setError('Please select a valid video file (MP4, WebM)')
        return
      }
      setUploadingVideo(true)
      setError(null)
      try {
        const doc = await uploadFile(file, title || file.name || 'Video Asset')
        setVideoId(doc.id)
        setVideoUrl(doc.url)
        setVideoName(file.name)
      } catch (err: any) {
        console.error('Video upload failed:', err)
        setError(err.message || 'Video upload failed.')
      } finally {
        setUploadingVideo(false)
      }
    }
  }

  const handleCoverSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setUploadingCover(true)
      setError(null)
      try {
        const doc = await uploadFile(file, title || file.name || 'Catalog Poster')
        setCoverImageId(doc.id)
        setCoverImageUrl(doc.url)
        setCoverImageName(file.name)
      } catch (err: any) {
        console.error('Poster upload failed:', err)
        setError(err.message || 'Poster upload failed.')
      } finally {
        setUploadingCover(false)
      }
    }
  }

  // 2. Master Video Prompt
  const [mainPrompt, setMainPrompt] = useState('')

  // 3. Asset Identity & Descriptions
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false)
  const [category, setCategory] = useState('Cinematic')
  const [shortDescription, setShortDescription] = useState('')
  const [fullDescription, setFullDescription] = useState('')

  const generateSlug = (val: string) => {
    return val
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const handleTitleChange = (val: string) => {
    setTitle(val)
    if (!isSlugManuallyEdited) {
      setSlug(generateSlug(val))
    }
  }

  // 4. Video Engine & Camera Choreography
  const [negativePrompt, setNegativePrompt] = useState('')
  const [aiTool, setAiTool] = useState('runway-gen3')
  const [model, setModel] = useState('Gen-3 Alpha Turbo')
  const [aspectRatio, setAspectRatio] = useState('16:9')
  const [duration, setDuration] = useState('15s')
  const [fps, setFps] = useState('60')
  const [motionStrength, setMotionStrength] = useState<number>(8)
  const [cameraMovement, setCameraMovement] = useState('dynamic-tracking')
  const [seed, setSeed] = useState('')

  // 5. Keyframes
  const [firstFrameId, setFirstFrameId] = useState<number | string | null>(null)
  const [firstFrameUrl, setFirstFrameUrl] = useState<string | null>(null)
  const [firstFrameName, setFirstFrameName] = useState('')
  const [firstFramePrompt, setFirstFramePrompt] = useState('')
  const firstFrameInputRef = useRef<HTMLInputElement>(null)

  const [lastFrameId, setLastFrameId] = useState<number | string | null>(null)
  const [lastFrameUrl, setLastFrameUrl] = useState<string | null>(null)
  const [lastFrameName, setLastFrameName] = useState('')
  const [lastFramePrompt, setLastFramePrompt] = useState('')
  const lastFrameInputRef = useRef<HTMLInputElement>(null)

  const handleFirstFrameSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      try {
        const doc = await uploadFile(file, `${title} - First Frame`)
        setFirstFrameId(doc.id)
        setFirstFrameUrl(doc.url)
        setFirstFrameName(file.name)
      } catch (err: any) {
        setError(err.message || 'First frame upload failed.')
      }
    }
  }

  const handleLastFrameSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      try {
        const doc = await uploadFile(file, `${title} - Last Frame`)
        setLastFrameId(doc.id)
        setLastFrameUrl(doc.url)
        setLastFrameName(file.name)
      } catch (err: any) {
        setError(err.message || 'Last frame upload failed.')
      }
    }
  }

  // 6. Scenes Storyboard
  const [scenes, setScenes] = useState<SceneItemState[]>([])

  const addScene = () => {
    const sceneNum = scenes.length + 1
    const newScene: SceneItemState = {
      id: `scene-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      sceneNumber: sceneNum,
      title: `Scene ${sceneNum}`,
      timecode: sceneNum === 1 ? '00:00 - 00:05' : '',
      shotType: 'wide',
      cameraMotion: 'Dynamic Tracking',
      prompt: '',
      audioCue: '',
      keyframeImageId: null,
      keyframeImageUrl: null,
      keyframeImageName: '',
    }
    setScenes([...scenes, newScene])
  }

  const removeScene = (index: number) => {
    setScenes(scenes.filter((_, idx) => idx !== index))
  }

  const updateScene = (index: number, updates: Partial<SceneItemState>) => {
    setScenes((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], ...updates }
      return updated
    })
  }

  const handleSceneKeyframeUpload = async (index: number, file: File) => {
    try {
      const doc = await uploadFile(file, `Scene ${index + 1} Keyframe`)
      updateScene(index, {
        keyframeImageId: doc.id,
        keyframeImageUrl: doc.url,
        keyframeImageName: file.name,
      })
    } catch (err: any) {
      setError(err.message || 'Scene keyframe upload failed.')
    }
  }

  // 7. Tags
  const [tags, setTags] = useState<string[]>([
    'automotive',
    'cinematic',
    'hypercar',
    'runway-gen3',
    '60fps',
  ])
  const [tagInput, setTagInput] = useState('')

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const clean = tagInput.trim().replace(/^,+|,+$/g, '')
      if (clean && !tags.includes(clean)) {
        setTags([...tags, clean])
      }
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove))
  }

  // 8. SEO
  const [seoTitle, setSeoTitle] = useState('')
  const [seoDesc, setSeoDesc] = useState('')
  const [ogImageId, setOgImageId] = useState<number | string | null>(null)
  const [ogImageUrl, setOgImageUrl] = useState<string | null>(null)
  const [ogImageName, setOgImageName] = useState('')
  const ogInputRef = useRef<HTMLInputElement>(null)

  const handleOgImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      try {
        const doc = await uploadFile(file, `${title} - SEO OG Image`)
        setOgImageId(doc.id)
        setOgImageUrl(doc.url)
        setOgImageName(file.name)
      } catch (err: any) {
        setError(err.message || 'OG image upload failed.')
      }
    }
  }

  // 9. Publishing
  const [accessType, setAccessType] = useState<'FREE' | 'PAID'>('FREE')
  const [price, setPrice] = useState<number>(0)
  const [publishStatus, setPublishStatus] = useState<'published' | 'draft' | 'archived'>('published')
  const [featured, setFeatured] = useState(false)

  // Submit Form
  const handleSubmit = async (overrideStatus?: 'published' | 'draft') => {
    setError(null)

    if (!mainPrompt.trim()) {
      setError('Please provide the Master Video Prompt.')
      return
    }
    if (!title.trim()) {
      setError('Please enter an Asset Title.')
      return
    }
    if (!slug.trim()) {
      setError('Please provide a URL Slug.')
      return
    }
    if (!shortDescription.trim()) {
      setError('Please provide a Short Description.')
      return
    }

    setSubmitting(true)
    const statusToSave = overrideStatus || publishStatus

    const payloadBody = {
      assetType: 'prompt',
      promptType: 'video',
      title: title.trim(),
      slug: slug.trim(),
      categoryText: category,
      shortDescription: shortDescription.trim(),
      fullDescription: fullDescription.trim(),
      coverImage: coverImageId || undefined,
      videoFile: videoId || undefined,
      mainPrompt: mainPrompt.trim(),
      negativePrompt: negativePrompt.trim() || undefined,
      aiTool,
      model: model.trim() || undefined,
      aspectRatio,
      duration,
      fps,
      motionStrength: Number(motionStrength) || 7,
      cameraMovement,
      firstFramePrompt: firstFramePrompt.trim() || undefined,
      firstFrameImage: firstFrameId || undefined,
      lastFramePrompt: lastFramePrompt.trim() || undefined,
      lastFrameImage: lastFrameId || undefined,
      scenes: scenes.map((sc, idx) => ({
        sceneNumber: idx + 1,
        title: sc.title,
        timecode: sc.timecode,
        shotType: sc.shotType,
        cameraMotion: sc.cameraMotion,
        prompt: sc.prompt,
        audioCue: sc.audioCue,
        keyframeImage: sc.keyframeImageId || undefined,
      })),
      tagList: tags.map((t) => ({ tag: t })),
      accessType,
      price: accessType === 'PAID' ? Number(price) || 0 : 0,
      status: statusToSave,
      featured,
      seo: {
        title: seoTitle.trim() || undefined,
        description: seoDesc.trim() || undefined,
        ogImage: ogImageId || coverImageId || undefined,
      },
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
        throw new Error(data.errors?.[0]?.message || 'Failed to save video prompt.')
      }

      showToast('Video prompt published successfully!')
      router.push('/dashboard/video-prompts')
    } catch (err: any) {
      console.error('Error creating video prompt:', err)
      setError(err.message || 'Failed to create video prompt.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ padding: '24px 32px', maxWidth: '1440px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            backgroundColor: '#1E1E26',
            color: '#FFFFFF',
            padding: '12px 20px',
            borderRadius: '10px',
            border: '1px solid #4FD18B',
            boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            zIndex: 9999,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4FD18B" strokeWidth="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div className="page-title-group">
          <div className="breadcrumbs">
            <Link href="/dashboard">Dashboard</Link>
            <span className="breadcrumbs-separator">/</span>
            <Link href="/dashboard/video-prompts">Video Prompts</Link>
            <span className="breadcrumbs-separator">/</span>
            <span>Create</span>
          </div>
          <h1 className="page-title">Create Video Prompt</h1>
          <p className="page-subtitle">
            Author and publish complete AI video-generation assets with camera choreography, frame control, and multi-scene storyboard breakdowns.
          </p>
        </div>
        <div>
          <Link
            href="/dashboard/video-prompts"
            className="btn btn-secondary"
            style={{ textDecoration: 'none' }}
          >
            Cancel
          </Link>
        </div>
      </div>

      {/* Global Error Banner */}
      {error && (
        <div
          style={{
            padding: '14px 18px',
            background: 'rgba(230, 106, 115, 0.1)',
            border: '1px solid rgba(230, 106, 115, 0.3)',
            borderRadius: '8px',
            color: '#E66A73',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
           1. TOP GRID — 2 Columns (Left: Video Preview & Poster / Right: Master Video Prompt)
           ══════════════════════════════════════════════════════════════════ */}
      <div className="grid-2col-layout">
        {/* LEFT COLUMN: Video Preview & Catalog Poster */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', background: '#101014', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px' }}>
          <div className="card-header">
            <div className="card-title-group">
              <h3 className="card-title">
                Video Preview &amp; Poster <span className="required">*</span>
              </h3>
              <p className="card-subtitle">Rendered video output file and optional poster thumbnail for catalog cards.</p>
            </div>
          </div>

          {/* Hidden File Input */}
          <input
            type="file"
            ref={videoInputRef}
            accept="video/*"
            style={{ display: 'none' }}
            onChange={handleVideoSelect}
          />

          {/* Dropzone or Video Player Container */}
          {!videoUrl ? (
            <div
              className="dropzone-box"
              onClick={() => videoInputRef.current?.click()}
              style={{
                border: '2px dashed rgba(255,255,255,0.12)',
                borderRadius: 'var(--radius-lg)',
                padding: '36px 20px',
                textAlign: 'center',
                cursor: 'pointer',
                background: 'rgba(255,255,255,0.015)',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                minHeight: '220px',
              }}
            >
              <div
                className="dropzone-icon"
                style={{
                  margin: '0 auto 12px auto',
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'rgba(108,140,255,0.08)',
                  border: '1px solid rgba(108,140,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent)',
                }}
              >
                <svg className="icon icon-md" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="6 3 20 12 6 21 6 3"></polygon>
                </svg>
              </div>

              <div style={{ marginBottom: '8px' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ pointerEvents: 'none' }}
                  disabled={uploadingVideo}
                >
                  {uploadingVideo ? 'Uploading...' : 'Upload Video (MP4, WebM)'}
                </button>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Click to browse or drag and drop video here (up to 100MB)
              </div>
            </div>
          ) : (
            <div
              style={{
                border: '1px solid var(--border-regular)',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                position: 'relative',
                background: '#08080C',
                flex: 1,
              }}
            >
              <div
                style={{
                  height: '250px',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  background: '#05060A',
                }}
              >
                <video
                  src={videoUrl}
                  controls
                  style={{
                    maxHeight: '100%',
                    maxWidth: '100%',
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                  }}
                >
                  Your browser does not support the video tag.
                </video>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 16px',
                  background: 'rgba(255,255,255,0.02)',
                  borderTop: '1px solid var(--border-subtle)',
                }}
              >
                <span
                  style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-secondary)',
                    maxWidth: '70%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {videoName || 'video.mp4'}
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => videoInputRef.current?.click()}
                    style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                  >
                    Change
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => {
                      setVideoId(null)
                      setVideoUrl(null)
                      setVideoName('')
                    }}
                    style={{
                      padding: '4px 10px',
                      fontSize: '0.75rem',
                      color: 'var(--danger)',
                      borderColor: 'rgba(230,106,115,0.3)',
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Optional Poster Frame / Thumbnail */}
          <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label className="form-label" style={{ marginBottom: 0 }}>
                Catalog Poster Image <span className="form-label-extra">Optional</span>
              </label>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Displays before video play</span>
            </div>

            <input
              type="file"
              ref={posterInputRef}
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleCoverSelect}
            />

            <div
              className="dropzone-box"
              onClick={() => posterInputRef.current?.click()}
              style={{
                padding: '12px',
                border: '1px dashed rgba(255,255,255,0.1)',
                borderRadius: 'var(--radius-md)',
                textAlign: 'center',
                cursor: 'pointer',
                background: 'rgba(255,255,255,0.01)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
              }}
            >
              {coverImageUrl ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={coverImageUrl}
                    alt="Poster preview"
                    style={{ height: '36px', width: '36px', objectFit: 'cover', borderRadius: '4px' }}
                  />
                  <span style={{ fontSize: '0.8rem', color: 'var(--accent)' }}>
                    Poster: {coverImageName || 'Attached'}
                  </span>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      setCoverImageId(null)
                      setCoverImageUrl(null)
                      setCoverImageName('')
                    }}
                    style={{ padding: '2px 8px', fontSize: '0.7rem', color: 'var(--danger)' }}
                  >
                    Clear
                  </button>
                </>
              ) : (
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {uploadingCover
                    ? 'Uploading...'
                    : 'Click to upload custom poster thumbnail (Falls back to first frame if empty)'}
                </span>
              )}
            </div>
          </div>

          <span className="form-hint" style={{ marginTop: '10px', display: 'block' }}>
            This video represents the example generated output asset, not the prompt text itself.
          </span>
        </div>

        {/* RIGHT COLUMN: Master Video Prompt */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', background: '#101014', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px' }}>
          <div className="card-header">
            <div className="card-title-group">
              <h3 className="card-title">
                Master Video Prompt <span className="required">*</span>
              </h3>
              <p className="card-subtitle">Primary creative direction, motion pacing, and visual style for the video.</p>
            </div>
          </div>

          <div className="form-group" style={{ flex: 1, display: 'flex', flexDirection: 'column', marginBottom: 0 }}>
            <textarea
              className="form-textarea"
              rows={9}
              value={mainPrompt}
              onChange={(e) => setMainPrompt(e.target.value)}
              placeholder="Describe the cinematic scene, camera choreography, subject motion, lighting, and atmosphere in rich detail... e.g. Cinematic 35mm film shot of a matte black futuristic hypercar accelerating through a wet concrete tunnel at dusk, headlights piercing through dense mist, high contrast neon light streaks, low-angle dynamic tracking camera matching car velocity, slow motion 60fps --motion 8 --duration 15s"
              required
              style={{
                flex: 1,
                minHeight: '220px',
                resize: 'vertical',
                lineHeight: 1.6,
                fontSize: 'var(--text-base)',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
              <span className="form-hint">Tip: Specify lens optics (35mm/anamorphic), lighting, and camera motion speed.</span>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                {mainPrompt.length} chars
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
           2. SECOND GRID — 2 Columns (Left: Identity / Right: Descriptions)
           ══════════════════════════════════════════════════════════════════ */}
      <div className="grid-2col-equal">
        {/* LEFT: Identity */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: '#101014', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px' }}>
          <div className="card-header">
            <div className="card-title-group">
              <h3 className="card-title">Asset Identity</h3>
              <p className="card-subtitle">Naming, canonical URL slug, and primary classification.</p>
            </div>
          </div>

          {/* Title */}
          <div className="form-group">
            <label className="form-label">
              Title <span className="required">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Cinematic Futuristic Hypercar Tunnel Acceleration"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              required
            />
            <span className="form-hint">A clear, descriptive name for the video prompt asset.</span>
          </div>

          {/* Slug */}
          <div className="form-group">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label className="form-label">
                Slug <span className="required">*</span>
              </label>
              <button
                type="button"
                onClick={() => {
                  setIsSlugManuallyEdited(false)
                  setSlug(generateSlug(title))
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--accent)',
                  fontSize: '0.725rem',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                Auto-generate from Title
              </button>
            </div>
            <input
              type="text"
              className="form-control text-mono"
              placeholder="cinematic-futuristic-hypercar-tunnel-acceleration"
              value={slug}
              onChange={(e) => {
                setIsSlugManuallyEdited(true)
                setSlug(e.target.value)
              }}
              required
            />
            <span className="form-hint">
              URL preview: /prompts/video/
              <span style={{ color: 'var(--accent-light)' }}>{slug || 'untitled-video-prompt'}</span>
            </span>
          </div>

          {/* Category */}
          <div className="form-group">
            <label className="form-label">
              Primary Category <span className="required">*</span>
            </label>
            <select
              className="form-control"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              style={{
                width: '100%',
                height: '42px',
                padding: '0 36px 0 14px',
                borderRadius: '8px',
                background: '#0B0B0F',
                border: '1px solid rgba(255,255,255,0.08)',
                color: '#F5F5F7',
              }}
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

        {/* RIGHT: Short Description, Full Description */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: '#101014', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px' }}>
          <div className="card-header">
            <div className="card-title-group">
              <h3 className="card-title">Asset Descriptions</h3>
              <p className="card-subtitle">Concise discovery summaries and extended video direction context.</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {/* Short Description */}
            <div className="form-group">
              <label className="form-label">
                Short Description <span className="required">*</span>
              </label>
              <textarea
                className="form-control"
                rows={2}
                placeholder="e.g. Cinematic 35mm film shot of a matte black futuristic hypercar accelerating through a wet concrete tunnel at dusk."
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                required
              />
              <span className="form-hint">A concise description explaining what the video prompt generates (max 160 chars).</span>
            </div>

            {/* Full Description */}
            <div className="form-group">
              <label className="form-label">
                Full Description <span className="form-label-extra">Optional</span>
              </label>
              <textarea
                className="form-control"
                rows={5}
                placeholder="Detailed explanation of what the prompt produces, pacing instructions, lighting design, expected audio synchronization, and post-processing color grading notes. Do not put the actual prompt here..."
                value={fullDescription}
                onChange={(e) => setFullDescription(e.target.value)}
              />
              <span className="form-hint">Provide helpful context for video creators. Do not put the actual prompt here.</span>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
           3. Video Engine & Camera Choreography
           ══════════════════════════════════════════════════════════════════ */}
      <div className="card" style={{ background: '#101014', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px' }}>
        <div className="card-header">
          <div className="card-title-group">
            <h3 className="card-title">Video Engine &amp; Camera Choreography</h3>
            <p className="card-subtitle">Configure AI video generator specifications, frame rate, motion velocity, and camera movement.</p>
          </div>
        </div>

        {/* Negative Prompt */}
        <div className="form-group" style={{ marginBottom: 'var(--space-5)' }}>
          <label className="form-label">
            Negative Prompt <span className="form-label-extra">Optional</span>
          </label>
          <textarea
            className="form-control"
            rows={2}
            value={negativePrompt}
            onChange={(e) => setNegativePrompt(e.target.value)}
            placeholder="e.g. jerky motion, morphing, jittery camera, temporal flickering, warped faces, artifacts, blurry frames, watermark, logo, text, low quality"
            style={{ fontSize: '0.88rem', lineHeight: 1.5 }}
          />
          <span className="form-hint">Artifacts, jerky movements, or flaws to avoid. Stored independently and never mixed with the master prompt.</span>
        </div>

        {/* Parameters Grid */}
        <div className="form-grid">
          {/* AI Video Tool */}
          <div className="col-3">
            <div className="form-group">
              <label className="form-label">
                AI Video Tool <span className="form-label-extra">Optional</span>
              </label>
              <select className="form-control" value={aiTool} onChange={(e) => setAiTool(e.target.value)}>
                <option value="runway-gen3">Runway Gen-3</option>
                <option value="sora">OpenAI Sora</option>
                <option value="kling">Kling AI</option>
                <option value="luma">Luma Dream Machine</option>
                <option value="veo-2">Google Veo 2</option>
                <option value="pika">Pika 2.0</option>
                <option value="general">General / Any Model</option>
              </select>
            </div>
          </div>

          {/* Model Version */}
          <div className="col-3">
            <div className="form-group">
              <label className="form-label">
                Model Version <span className="form-label-extra">Optional</span>
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Gen-3 Alpha Turbo, Kling 1.5"
                value={model}
                onChange={(e) => setModel(e.target.value)}
              />
            </div>
          </div>

          {/* Aspect Ratio */}
          <div className="col-3">
            <div className="form-group">
              <label className="form-label">
                Aspect Ratio <span className="form-label-extra">Optional</span>
              </label>
              <select className="form-control" value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)}>
                <option value="16:9">16:9 (Landscape / Cinema)</option>
                <option value="9:16">9:16 (Vertical Story / Reels)</option>
                <option value="1:1">1:1 (Square)</option>
                <option value="2.39:1">2.39:1 (Anamorphic Scope)</option>
                <option value="custom">Custom</option>
              </select>
            </div>
          </div>

          {/* Video Duration */}
          <div className="col-3">
            <div className="form-group">
              <label className="form-label">
                Duration <span className="form-label-extra">Optional</span>
              </label>
              <select className="form-control" value={duration} onChange={(e) => setDuration(e.target.value)}>
                <option value="5s">5 Seconds</option>
                <option value="10s">10 Seconds</option>
                <option value="15s">15 Seconds</option>
                <option value="30s">30 Seconds</option>
                <option value="60s (1 min)">60 Seconds (1 min)</option>
                <option value="Multi-Scene">Multi-Scene (Custom)</option>
              </select>
            </div>
          </div>

          {/* Frame Rate (FPS) */}
          <div className="col-3">
            <div className="form-group">
              <label className="form-label">
                Frame Rate (FPS) <span className="form-label-extra">Optional</span>
              </label>
              <select className="form-control" value={fps} onChange={(e) => setFps(e.target.value)}>
                <option value="24">24 FPS (Cinematic Film)</option>
                <option value="30">30 FPS (Standard Broadcast)</option>
                <option value="60">60 FPS (High-Speed Motion)</option>
                <option value="120">120 FPS (Extreme Slow Motion)</option>
              </select>
            </div>
          </div>

          {/* Motion Strength / Speed */}
          <div className="col-3">
            <div className="form-group">
              <label className="form-label">
                Motion Strength (1-10) <span className="form-label-extra">Optional</span>
              </label>
              <select
                className="form-control"
                value={motionStrength}
                onChange={(e) => setMotionStrength(Number(e.target.value))}
              >
                <option value="2">2 - Subtle Ambient Drift</option>
                <option value="5">5 - Natural Motion</option>
                <option value="7">7 - Dynamic Cinematic</option>
                <option value="8">8 - High Velocity</option>
                <option value="10">10 - Extreme Action</option>
              </select>
            </div>
          </div>

          {/* Camera Movement */}
          <div className="col-3">
            <div className="form-group">
              <label className="form-label">
                Camera Movement <span className="form-label-extra">Optional</span>
              </label>
              <select
                className="form-control"
                value={cameraMovement}
                onChange={(e) => setCameraMovement(e.target.value)}
              >
                <option value="dynamic-tracking">Dynamic Tracking</option>
                <option value="static">Static / Locked-off</option>
                <option value="pan">Pan Left / Right</option>
                <option value="tilt">Tilt Up / Down</option>
                <option value="zoom-in">Zoom In / Push-in</option>
                <option value="zoom-out">Zoom Out / Pull-out</option>
                <option value="orbit">Orbit 360°</option>
                <option value="drone">FPV Drone Sweep</option>
                <option value="crane">Crane / Boom Up/Down</option>
                <option value="handheld">Handheld Camera</option>
              </select>
            </div>
          </div>

          {/* Seed / Reproducibility */}
          <div className="col-3">
            <div className="form-group">
              <label className="form-label">
                Seed / Motion Brush <span className="form-label-extra">Optional</span>
              </label>
              <input
                type="text"
                className="form-control text-mono"
                placeholder="Random or Seed ID"
                value={seed}
                onChange={(e) => setSeed(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
           4. Keyframe & Frame Management (Start Frame & End Frame Control)
           ══════════════════════════════════════════════════════════════════ */}
      <div className="card" style={{ background: '#101014', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px' }}>
        <div className="card-header">
          <div className="card-title-group">
            <h3 className="card-title">Keyframe &amp; Frame Management</h3>
            <p className="card-subtitle">Manage initial reference images and ending keyframes for Image-to-Video (I2V) and seamless interpolation.</p>
          </div>
        </div>

        <div className="grid-2col-equal">
          {/* FIRST FRAME (Starting Keyframe - 00:00) */}
          <div className="keyframe-card">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid var(--border-subtle)',
                paddingBottom: '8px',
              }}
            >
              <span
                className="badge"
                style={{
                  background: 'rgba(79,209,139,0.12)',
                  color: 'var(--success)',
                  fontSize: '0.725rem',
                  fontWeight: 600,
                }}
              >
                First Frame (00:00)
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Initial Starting Keyframe</span>
            </div>

            <input
              type="file"
              ref={firstFrameInputRef}
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFirstFrameSelect}
            />

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">
                First Frame Image <span className="form-label-extra">Optional</span>
              </label>
              <div
                className="dropzone-box"
                onClick={() => firstFrameInputRef.current?.click()}
                style={{
                  padding: '16px',
                  border: '1px dashed rgba(255,255,255,0.1)',
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: 'rgba(255,255,255,0.01)',
                }}
              >
                {firstFrameUrl ? (
                  <>
                    <div style={{ marginBottom: '8px', maxHeight: '120px', overflow: 'hidden', borderRadius: 'var(--radius-sm)' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={firstFrameUrl}
                        alt="First Frame"
                        style={{ maxHeight: '120px', maxWidth: '100%', objectFit: 'contain' }}
                      />
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--success)' }}>
                      Attached: {firstFrameName || 'First Frame'}
                    </span>
                    <br />
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        setFirstFrameId(null)
                        setFirstFrameUrl(null)
                        setFirstFrameName('')
                      }}
                      style={{ marginTop: '6px', padding: '2px 8px', fontSize: '0.7rem', color: 'var(--danger)' }}
                    >
                      Clear
                    </button>
                  </>
                ) : (
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Click to upload Starting Image (Image-to-Video seed)
                  </span>
                )}
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">
                Starting Frame Prompt Guidance <span className="form-label-extra">Optional</span>
              </label>
              <textarea
                className="form-control"
                rows={2}
                placeholder="e.g. Matte black futuristic hypercar stationary at brutalist tunnel mouth, wet reflective asphalt, glowing headlights piercing twilight fog"
                value={firstFramePrompt}
                onChange={(e) => setFirstFramePrompt(e.target.value)}
              />
              <span className="form-hint">Describes the exact visual state at the first frame to lock subject and composition.</span>
            </div>
          </div>

          {/* LAST FRAME (Ending Keyframe - Optional) */}
          <div className="keyframe-card">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid var(--border-subtle)',
                paddingBottom: '8px',
              }}
            >
              <span
                className="badge"
                style={{
                  background: 'rgba(230,106,115,0.12)',
                  color: 'var(--danger)',
                  fontSize: '0.725rem',
                  fontWeight: 600,
                }}
              >
                Last Frame (Interpolation Target)
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>End Keyframe</span>
            </div>

            <input
              type="file"
              ref={lastFrameInputRef}
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleLastFrameSelect}
            />

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">
                Last Frame Image <span className="form-label-extra">Optional</span>
              </label>
              <div
                className="dropzone-box"
                onClick={() => lastFrameInputRef.current?.click()}
                style={{
                  padding: '16px',
                  border: '1px dashed rgba(255,255,255,0.1)',
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: 'rgba(255,255,255,0.01)',
                }}
              >
                {lastFrameUrl ? (
                  <>
                    <div style={{ marginBottom: '8px', maxHeight: '120px', overflow: 'hidden', borderRadius: 'var(--radius-sm)' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={lastFrameUrl}
                        alt="Last Frame"
                        style={{ maxHeight: '120px', maxWidth: '100%', objectFit: 'contain' }}
                      />
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--danger)' }}>
                      Attached: {lastFrameName || 'Last Frame'}
                    </span>
                    <br />
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        setLastFrameId(null)
                        setLastFrameUrl(null)
                        setLastFrameName('')
                      }}
                      style={{ marginTop: '6px', padding: '2px 8px', fontSize: '0.7rem', color: 'var(--danger)' }}
                    >
                      Clear
                    </button>
                  </>
                ) : (
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Click to upload Ending Target Image (Runway/Kling/Luma)
                  </span>
                )}
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">
                Ending Frame Prompt Guidance <span className="form-label-extra">Optional</span>
              </label>
              <textarea
                className="form-control"
                rows={2}
                placeholder="e.g. Hypercar speeding onto elevated neon highway overlooking sprawling futuristic cityscape at night, high crane shot"
                value={lastFramePrompt}
                onChange={(e) => setLastFramePrompt(e.target.value)}
              />
              <span className="form-hint">Used for beginning-to-end interpolation in supported models (Runway Gen-3, Kling, Luma).</span>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
           5. Multi-Scene Storyboard Breakdown (Timeline Chunks)
           ══════════════════════════════════════════════════════════════════ */}
      <div className="card" style={{ background: '#101014', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px' }}>
        <div className="card-header">
          <div className="card-title-group">
            <h3 className="card-title">Scene Storyboard &amp; Timeline Breakdown</h3>
            <p className="card-subtitle">
              Divide multi-shot or long videos (e.g. 15s, 30s, 60s, or longer) into sequenced timeline chunks with dedicated prompts.
            </p>
          </div>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={addScene}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              fontSize: '0.8125rem',
              fontWeight: 500,
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#F5F5F7',
              cursor: 'pointer',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>Add Scene Chunk</span>
          </button>
        </div>

        {/* Empty State for Scenes */}
        {scenes.length === 0 ? (
          <div
            style={{
              padding: '24px',
              textAlign: 'center',
              border: '1px dashed var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255,255,255,0.01)',
            }}
          >
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '0 0 6px 0' }}>
              No scene chunks added. Scene breakdowns are completely optional but highly recommended for complex multi-shot videos.
            </p>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              If this video consists of multiple angles or sequential shots (e.g. Scene 1: Drone Establishing, Scene 2: Interior Dolly, Scene 3: Skyline Reveal), click <strong>+ Add Scene Chunk</strong> above.
            </span>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {scenes.map((scene, index) => (
              <div key={scene.id} className="scene-card">
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid var(--border-subtle)',
                    paddingBottom: '8px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      className="badge"
                      style={{
                        background: 'rgba(108,140,255,0.12)',
                        color: 'var(--accent)',
                        fontSize: '0.725rem',
                        fontWeight: 600,
                      }}
                    >
                      Scene {index + 1}
                    </span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                      {scene.title || `Scene ${index + 1}`}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => removeScene(index)}
                    style={{
                      padding: '3px 8px',
                      fontSize: '0.725rem',
                      color: 'var(--danger)',
                      borderColor: 'rgba(230,106,115,0.3)',
                    }}
                  >
                    <svg className="icon icon-sm" viewBox="0 0 24 24">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                    <span>Remove</span>
                  </button>
                </div>

                <div className="form-grid">
                  <div className="col-4">
                    <div className="form-group">
                      <label className="form-label">
                        Scene Title <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Establishing Drone Shot"
                        value={scene.title}
                        onChange={(e) => updateScene(index, { title: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="col-2">
                    <div className="form-group">
                      <label className="form-label">Timecode</label>
                      <input
                        type="text"
                        className="form-control text-mono"
                        placeholder="00:00 - 00:05"
                        value={scene.timecode}
                        onChange={(e) => updateScene(index, { timecode: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="col-3">
                    <div className="form-group">
                      <label className="form-label">Shot Framing</label>
                      <select
                        className="form-control"
                        value={scene.shotType}
                        onChange={(e) => updateScene(index, { shotType: e.target.value })}
                      >
                        <option value="wide">Wide Establishing Shot</option>
                        <option value="medium">Medium Shot</option>
                        <option value="close-up">Close-Up</option>
                        <option value="extreme-close-up">Extreme Close-Up</option>
                        <option value="pov">POV Shot</option>
                        <option value="drone">Aerial / FPV Drone</option>
                        <option value="extreme-wide">Extreme Wide Shot</option>
                      </select>
                    </div>
                  </div>

                  <div className="col-3">
                    <div className="form-group">
                      <label className="form-label">Camera Motion</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Low-angle Dynamic Tracking"
                        value={scene.cameraMotion}
                        onChange={(e) => updateScene(index, { cameraMotion: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="form-group">
                      <label className="form-label">
                        Scene Generation Prompt <span className="required">*</span>
                      </label>
                      <textarea
                        className="form-control"
                        rows={3}
                        placeholder="Exact video generation prompt for this specific shot chunk..."
                        value={scene.prompt}
                        onChange={(e) => updateScene(index, { prompt: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="col-6">
                    <div className="form-group">
                      <label className="form-label">
                        Audio / SFX / Voiceover Cue <span className="form-label-extra">Optional</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Deep subsonic engine roar, tire screech, ambient synth surge"
                        value={scene.audioCue}
                        onChange={(e) => updateScene(index, { audioCue: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="col-6">
                    <div className="form-group">
                      <label className="form-label">
                        Scene Reference Keyframe <span className="form-label-extra">Optional</span>
                      </label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input
                          type="file"
                          id={`scene-file-${index}`}
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handleSceneKeyframeUpload(index, e.target.files[0])
                            }
                          }}
                        />
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => document.getElementById(`scene-file-${index}`)?.click()}
                        >
                          {scene.keyframeImageUrl ? 'Change Image' : 'Upload Keyframe'}
                        </button>
                        <span
                          style={{
                            fontSize: '0.8rem',
                            color: 'var(--text-secondary)',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {scene.keyframeImageName || (scene.keyframeImageUrl ? 'Keyframe Attached' : 'No keyframe')}
                        </span>
                        {scene.keyframeImageUrl && (
                          <button
                            type="button"
                            className="btn btn-outline btn-sm"
                            onClick={() =>
                              updateScene(index, {
                                keyframeImageId: null,
                                keyframeImageUrl: null,
                                keyframeImageName: '',
                              })
                            }
                            style={{ padding: '2px 8px', fontSize: '0.7rem', color: 'var(--danger)' }}
                          >
                            Clear
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════════
           6. Discovery (Category, Tags)
           ══════════════════════════════════════════════════════════════════ */}
      <div className="card" style={{ background: '#101014', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px' }}>
        <div className="card-header">
          <div className="card-title-group">
            <h3 className="card-title">Discovery</h3>
            <p className="card-subtitle">Taxonomy classification and searchable keywords for platform discovery.</p>
          </div>
        </div>

        <div className="form-grid">
          {/* Category */}
          <div className="col-4">
            <div className="form-group">
              <label className="form-label">
                Category <span className="required">*</span>
              </label>
              <select
                className="form-control"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  width: '100%',
                  height: '42px',
                  padding: '0 36px 0 14px',
                  borderRadius: '8px',
                  background: '#0B0B0F',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: '#F5F5F7',
                }}
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

          {/* Tags */}
          <div className="col-8">
            <div className="form-group">
              <label className="form-label">Tags</label>
              <div className="tag-input-wrapper">
                {tags.map((tag) => (
                  <span key={tag} className="tag-pill">
                    {tag}
                    <button
                      type="button"
                      className="tag-remove"
                      onClick={() => removeTag(tag)}
                      aria-label="Remove tag"
                    >
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
                  onKeyDown={handleAddTag}
                />
              </div>
              <span className="form-hint">Type a keyword and press Enter or comma. Tags are reusable across ContextNode.</span>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
           7. SEO (SEO Title, Meta Description, OG Image)
           ══════════════════════════════════════════════════════════════════ */}
      <div className="card" style={{ background: '#101014', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px' }}>
        <div className="card-header">
          <div className="card-title-group">
            <h3 className="card-title">SEO</h3>
            <p className="card-subtitle">Search engine indexing metadata and social share card preview.</p>
          </div>
        </div>

        <div className="form-grid">
          <div className="col-12">
            <div className="form-group">
              <label className="form-label">
                SEO Title <span className="form-label-extra">Optional</span>
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Leave empty to fallback to prompt title"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
              />
              <span className="form-hint">Custom title override for search engines.</span>
            </div>
          </div>

          <div className="col-12">
            <div className="form-group">
              <label className="form-label">
                Meta Description <span className="form-label-extra">Optional</span>
              </label>
              <textarea
                className="form-control"
                rows={2}
                placeholder="Brief search engine description under 160 characters"
                value={seoDesc}
                onChange={(e) => setSeoDesc(e.target.value)}
              />
              <span className="form-hint">Optimized summary displayed in search results.</span>
            </div>
          </div>

          <div className="col-12">
            <div className="form-group">
              <label className="form-label">
                OG Image <span className="form-label-extra">Optional</span>
              </label>
              <input
                type="file"
                ref={ogInputRef}
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleOgImageSelect}
              />
              <div
                className="dropzone-box"
                onClick={() => ogInputRef.current?.click()}
                style={{
                  padding: '16px',
                  border: '1px dashed rgba(255,255,255,0.1)',
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: 'rgba(255,255,255,0.01)',
                }}
              >
                {ogImageUrl ? (
                  <span style={{ fontSize: '0.8rem', color: 'var(--accent)' }}>
                    OG Image: {ogImageName || 'Attached'}
                  </span>
                ) : (
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Click to upload custom Open Graph image (Falls back to Video Poster / Thumbnail if empty)
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
           8. Publishing (Free / Paid, Price, Featured, Status)
           ══════════════════════════════════════════════════════════════════ */}
      <div className="card" style={{ background: '#101014', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px' }}>
        <div className="card-header">
          <div className="card-title-group">
            <h3 className="card-title">Publishing</h3>
            <p className="card-subtitle">Configure monetization, platform promotion, and publishing state.</p>
          </div>
        </div>

        <div className="form-grid">
          <div className="col-4">
            <div className="form-group">
              <label className="form-label">Access Model</label>
              <select
                className="form-control"
                value={accessType}
                onChange={(e) => setAccessType(e.target.value as any)}
              >
                <option value="FREE">Free / Public Domain</option>
                <option value="PAID">One-Time Paid Asset</option>
              </select>
            </div>
          </div>

          <div className="col-4">
            <div className="form-group">
              <label className="form-label">Price (USD)</label>
              <div className="input-addon-group">
                <span className="input-addon input-addon-left">$</span>
                <input
                  type="number"
                  className="form-control text-mono"
                  value={price}
                  step="0.01"
                  min="0"
                  disabled={accessType === 'FREE'}
                  onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
          </div>

          <div className="col-4">
            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                className="form-control"
                value={publishStatus}
                onChange={(e) => setPublishStatus(e.target.value as any)}
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          <div
            className="col-12"
            style={{
              paddingTop: 'var(--space-3)',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <label className="switch-label">
              <input
                type="checkbox"
                className="switch-input"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
              />
              <span className="switch-slider"></span>
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--text-primary)' }}>
                Featured on Platform Homepage
              </span>
            </label>
          </div>
        </div>

        {/* Form Actions */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '12px',
            marginTop: 'var(--space-6)',
            paddingTop: 'var(--space-6)',
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          <Link href="/dashboard/video-prompts" className="btn btn-secondary">
            Cancel
          </Link>
          <button
            type="button"
            className="btn btn-secondary"
            disabled={submitting}
            onClick={() => handleSubmit('draft')}
          >
            {submitting ? 'Saving...' : 'Save Draft'}
          </button>
          <button
            type="button"
            className="btn btn-primary"
            style={{ minWidth: '160px' }}
            disabled={submitting}
            onClick={() => handleSubmit('published')}
          >
            {submitting ? 'Publishing...' : 'Publish Video Prompt'}
          </button>
        </div>
      </div>
    </div>
  )
}

