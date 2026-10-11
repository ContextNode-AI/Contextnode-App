'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface MediaObj {
  id: number | string
  url?: string
  filename?: string
  alt?: string
}

interface SceneItem {
  id?: string
  sceneNumber?: number
  title?: string
  timecode?: string
  shotType?: string
  cameraMotion?: string
  prompt?: string
  audioCue?: string
  keyframeImage?: MediaObj | string | null
}

interface VideoPromptItem {
  id: number | string
  title: string
  slug: string
  shortDescription?: string
  fullDescription?: string
  mainPrompt: string
  negativePrompt?: string
  assetType: string
  promptType: string
  coverImage?: MediaObj | string | null
  videoFile?: MediaObj | string | null
  aiTool?: string
  model?: string
  aspectRatio?: string
  duration?: string
  fps?: string
  motionStrength?: number
  cameraMovement?: string
  seed?: string
  firstFramePrompt?: string
  firstFrameImage?: MediaObj | string | null
  lastFramePrompt?: string
  lastFrameImage?: MediaObj | string | null
  scenes?: SceneItem[]
  category?: { id: number | string; name: string } | string | null
  categoryText?: string
  tags?: Array<{ id: number | string; name: string } | string> | null
  tagList?: Array<{ id?: string; tag?: string }> | null
  accessType?: 'FREE' | 'PAID'
  price?: number
  status: 'published' | 'draft' | 'archived' | 'PUBLISHED' | 'DRAFT' | 'ARCHIVED'
  featured?: boolean
  createdAt?: string
  updatedAt?: string
  author?: any
}

export function VideoPromptsView() {
  const router = useRouter()
  const [prompts, setPrompts] = useState<VideoPromptItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [categoryFilter, setCategoryFilter] = useState('ALL')
  const [toolFilter, setToolFilter] = useState('ALL')

  // Delete modal state
  const [promptToDelete, setPromptToDelete] = useState<VideoPromptItem | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  // Fetch video prompts from Payload REST API
  const fetchPrompts = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(
        '/api/ai-assets?where[assetType][equals]=prompt&where[promptType][equals]=video&limit=100&depth=2'
      )
      if (!res.ok) {
        throw new Error('Failed to fetch video prompts.')
      }
      const data = await res.json()
      setPrompts(data.docs || [])
    } catch (err: any) {
      console.error('Error fetching video prompts:', err)
      setError(err.message || 'Error loading video prompts')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPrompts()
  }, [])

  // Categories list extracted from data
  const availableCategories = useMemo(() => {
    const cats = new Set<string>()
    prompts.forEach((p) => {
      const cat: string | undefined =
        typeof p.category === 'object' && p.category?.name
          ? p.category.name
          : typeof p.category === 'string'
          ? p.category
          : p.categoryText
      if (cat) cats.add(cat)
    })
    return Array.from(cats)
  }, [prompts])

  // Filtered prompts
  const filteredPrompts = useMemo(() => {
    return prompts.filter((item) => {
      const q = searchQuery.toLowerCase().trim()
      const title = (item.title || '').toLowerCase()
      const mainPrompt = (item.mainPrompt || '').toLowerCase()
      const desc = (item.shortDescription || '').toLowerCase()
      const categoryName =
        typeof item.category === 'object'
          ? item.category?.name || ''
          : item.category || item.categoryText || ''
      const tool = (item.aiTool || '').toLowerCase()

      const tagsString = [
        ...(Array.isArray(item.tags)
          ? item.tags.map((t: any) => (typeof t === 'object' ? t.name || t.tag || '' : String(t)))
          : []),
        ...(Array.isArray(item.tagList)
          ? item.tagList.map((t: any) => (typeof t === 'object' ? t.tag || '' : String(t)))
          : []),
      ]
        .join(' ')
        .toLowerCase()

      const matchesSearch =
        !q ||
        title.includes(q) ||
        mainPrompt.includes(q) ||
        desc.includes(q) ||
        tagsString.includes(q)

      const matchesStatus =
        statusFilter === 'ALL' || item.status?.toUpperCase() === statusFilter.toUpperCase()

      const matchesCategory =
        categoryFilter === 'ALL' ||
        categoryName.toLowerCase() === categoryFilter.toLowerCase()

      const matchesTool =
        toolFilter === 'ALL' ||
        tool.toLowerCase().includes(toolFilter.toLowerCase())

      return matchesSearch && matchesStatus && matchesCategory && matchesTool
    })
  }, [prompts, searchQuery, statusFilter, categoryFilter, toolFilter])

  // Delete Prompt Handler
  const confirmDelete = async () => {
    if (!promptToDelete) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/ai-assets/${promptToDelete.id}`, {
        method: 'DELETE',
      })
      if (!res.ok) {
        throw new Error('Failed to delete video prompt.')
      }
      setPrompts((prev) => prev.filter((p) => p.id !== promptToDelete.id))
      showToast(`Deleted prompt "${promptToDelete.title}"`)
      setPromptToDelete(null)
    } catch (err: any) {
      alert(err.message || 'Error deleting prompt')
    } finally {
      setDeleting(false)
    }
  }

  // Helper to format tool display name
  const formatToolName = (tool?: string) => {
    if (!tool) return ''
    const map: Record<string, string> = {
      'runway-gen3': 'Runway Gen-3',
      sora: 'OpenAI Sora',
      kling: 'Kling AI',
      luma: 'Luma Dream Machine',
      'veo-2': 'Google Veo 2',
      pika: 'Pika 2.0',
      'minimax-hailuo': 'Minimax Hailuo',
      general: 'General Model',
    }
    return map[tool] || tool
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
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
      <div className="page-header" style={{ marginBottom: 0 }}>
        <div className="page-title-group">
          <div className="breadcrumbs">
            <Link href="/dashboard">Dashboard</Link>
            <span className="breadcrumbs-separator">/</span>
            <span>Creative</span>
            <span className="breadcrumbs-separator">/</span>
            <span>Video Prompts</span>
          </div>
          <h1 className="page-title">Video Prompts</h1>
          <p className="page-subtitle">Create and manage prompts for AI video generation.</p>
        </div>

        <div className="page-actions">
          <Link
            href="/dashboard/video-prompts/create"
            title="Create Video Prompt"
            aria-label="Create Video Prompt"
            style={{
              width: '36px',
              height: '36px',
              backgroundColor: '#6C8CFF',
              color: '#050505',
              borderRadius: '8px',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(108, 140, 255, 0.4)',
              transition: 'all 0.15s ease',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="prompts-filter-bar">
        <div className="filter-search-wrap">
          <svg className="icon icon-sm filter-search-icon" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            className="filter-search-input"
            placeholder="Search video prompts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-dropdowns-group">
          {/* Status Filter */}
          <div className="filter-select-wrap">
            <select
              className="filter-select-custom"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ minWidth: '135px' }}
            >
              <option value="ALL">All Status</option>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>

          {/* AI Tool Filter */}
          <div className="filter-select-wrap">
            <select
              className="filter-select-custom"
              value={toolFilter}
              onChange={(e) => setToolFilter(e.target.value)}
              style={{ minWidth: '145px' }}
            >
              <option value="ALL">All AI Tools</option>
              <option value="runway">Runway Gen-3</option>
              <option value="sora">OpenAI Sora</option>
              <option value="kling">Kling AI</option>
              <option value="luma">Luma Dream Machine</option>
              <option value="veo">Google Veo 2</option>
              <option value="pika">Pika 2.0</option>
            </select>
          </div>

          {/* Dynamic Category Filter */}
          {availableCategories.length > 0 && (
            <div className="filter-select-wrap">
              <select
                className="filter-select-custom"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                style={{ minWidth: '140px' }}
              >
                <option value="ALL">All Categories</option>
                {availableCategories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div
          style={{
            padding: '60px 20px',
            textAlign: 'center',
            color: 'var(--text-secondary)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              border: '3px solid rgba(108,140,255,0.2)',
              borderTopColor: 'var(--accent)',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
            }}
          />
          <span style={{ fontSize: '0.875rem' }}>Loading video prompts...</span>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div
          style={{
            padding: '24px',
            background: 'rgba(230, 106, 115, 0.08)',
            border: '1px solid rgba(230, 106, 115, 0.25)',
            borderRadius: '12px',
            color: '#E66A73',
            fontSize: '0.9rem',
            textAlign: 'center',
          }}
        >
          <p style={{ margin: '0 0 12px 0' }}>{error}</p>
          <button type="button" onClick={fetchPrompts} className="btn btn-secondary btn-sm">
            Retry
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredPrompts.length === 0 && (
        <div
          className="empty-state"
          style={{
            padding: '60px 20px',
            textAlign: 'center',
            border: '1px dashed var(--border-regular)',
            borderRadius: 'var(--radius-xl)',
            marginTop: '12px',
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.04)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
              color: 'var(--text-secondary)',
            }}
          >
            <svg className="icon icon-lg" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="6 3 20 12 6 21 6 3"></polygon>
            </svg>
          </div>
          <h3 className="text-md font-semibold text-primary" style={{ marginBottom: '6px' }}>
            No video prompts found
          </h3>
          <p className="text-sm text-secondary" style={{ maxWidth: '380px', margin: '0 auto 20px auto' }}>
            {searchQuery || statusFilter !== 'ALL' || categoryFilter !== 'ALL'
              ? "We couldn't find any video prompts matching your query."
              : 'Get started by authoring your first AI video generation prompt.'}
          </p>
          <Link href="/dashboard/video-prompts/create" className="btn btn-primary btn-sm">
            + Create Video Prompt
          </Link>
        </div>
      )}

      {/* Prompts Cards Grid */}
      {!loading && !error && filteredPrompts.length > 0 && (
        <div className="prompt-card-grid">
          {filteredPrompts.map((item) => {
            const videoUrl =
              typeof item.videoFile === 'object' && item.videoFile?.url
                ? item.videoFile.url
                : typeof item.videoFile === 'string'
                ? item.videoFile
                : null

            const coverUrl =
              typeof item.coverImage === 'object' && item.coverImage?.url
                ? item.coverImage.url
                : typeof item.coverImage === 'string'
                ? item.coverImage
                : null

            const isPublished = item.status?.toUpperCase() === 'PUBLISHED'
            const sceneCount = Array.isArray(item.scenes) ? item.scenes.length : 0
            const durationLabel = item.duration || '15s'
            const categoryName =
              typeof item.category === 'object'
                ? item.category?.name || ''
                : item.category || item.categoryText || ''
            const toolLabel = formatToolName(item.aiTool)

            return (
              <div key={item.id} className="prompt-card">
                {/* Media visual with play button overlay */}
                <div
                  className="prompt-card-thumb-wrap"
                  style={{
                    height: '190px',
                    position: 'relative',
                    background: '#0B0B10',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {videoUrl ? (
                    <>
                      <video
                        src={videoUrl}
                        poster={coverUrl || undefined}
                        muted
                        playsInline
                        preload="metadata"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div className="video-play-overlay">
                        <div className="play-icon-circle">
                          <svg className="icon icon-sm" viewBox="0 0 24 24" fill="currentColor">
                            <polygon points="6 3 20 12 6 21 6 3"></polygon>
                          </svg>
                        </div>
                      </div>
                    </>
                  ) : coverUrl ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={coverUrl}
                        alt={item.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div className="video-play-overlay">
                        <div className="play-icon-circle">
                          <svg className="icon icon-sm" viewBox="0 0 24 24" fill="currentColor">
                            <polygon points="6 3 20 12 6 21 6 3"></polygon>
                          </svg>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        color: 'var(--text-muted)',
                        fontSize: '0.8rem',
                        gap: '6px',
                      }}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" opacity="0.4">
                        <polygon points="6 3 20 12 6 21 6 3"></polygon>
                      </svg>
                      <span>No Video Preview</span>
                    </div>
                  )}

                  {/* AI Tool Overlay Badge */}
                  {toolLabel && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        fontSize: '0.68rem',
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-full)',
                        background: 'rgba(5,5,8,0.75)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--text-primary)',
                        fontWeight: 500,
                        zIndex: 2,
                      }}
                    >
                      {toolLabel}
                    </span>
                  )}

                  {/* Duration & Scenes Badge */}
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '10px',
                      left: '10px',
                      fontSize: '0.68rem',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-full)',
                      background: 'rgba(108,140,255,0.2)',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(108,140,255,0.4)',
                      color: 'var(--accent-light)',
                      fontWeight: 500,
                      zIndex: 2,
                    }}
                  >
                    {durationLabel}
                    {sceneCount > 0 ? ` • ${sceneCount} Scene${sceneCount > 1 ? 's' : ''}` : ''}
                  </span>
                </div>

                {/* Body Content */}
                <div
                  className="prompt-card-body"
                  style={{
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    flex: 1,
                  }}
                >
                  {categoryName && (
                    <div
                      style={{
                        fontSize: '0.7rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        color: 'var(--accent)',
                        fontWeight: 600,
                      }}
                    >
                      {categoryName}
                    </div>
                  )}

                  <h3
                    style={{
                      fontSize: '0.92rem',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      margin: 0,
                      lineHeight: 1.4,
                      display: '-webkit-box',
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                    title={item.title}
                  >
                    {item.title}
                  </h3>

                  <p
                    className="prompt-preview-text"
                    style={{
                      fontSize: '0.8125rem',
                      lineHeight: 1.5,
                      color: 'var(--text-secondary)',
                      margin: 0,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      wordBreak: 'break-word',
                    }}
                  >
                    {item.shortDescription || item.mainPrompt}
                  </p>

                  {/* Footer Actions */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: 'auto',
                      paddingTop: '12px',
                      borderTop: '1px solid var(--border-subtle)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          fontSize: '0.68rem',
                          fontWeight: 600,
                          padding: '2px 8px',
                          borderRadius: '4px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                          backgroundColor: isPublished
                            ? 'rgba(79, 209, 139, 0.15)'
                            : 'rgba(244, 184, 96, 0.15)',
                          color: isPublished ? '#4FD18B' : '#F4B860',
                          border: `1px solid ${
                            isPublished ? 'rgba(79, 209, 139, 0.3)' : 'rgba(244, 184, 96, 0.3)'
                          }`,
                        }}
                      >
                        {item.status}
                      </span>

                      {item.accessType === 'PAID' ? (
                        <span
                          style={{
                            fontSize: '0.68rem',
                            fontWeight: 600,
                            padding: '2px 6px',
                            borderRadius: '4px',
                            background: 'rgba(244, 184, 96, 0.12)',
                            color: '#F4B860',
                          }}
                        >
                          ${item.price?.toFixed(2) || '0.00'}
                        </span>
                      ) : (
                        <span
                          style={{
                            fontSize: '0.68rem',
                            fontWeight: 500,
                            padding: '2px 6px',
                            borderRadius: '4px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            color: '#A5A5AF',
                          }}
                        >
                          Free
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Link
                        href={`/dashboard/video-prompts/${item.id}`}
                        style={{
                          padding: '4px 10px',
                          fontSize: '0.75rem',
                          fontWeight: 500,
                          borderRadius: '6px',
                          background: 'rgba(255, 255, 255, 0.06)',
                          color: '#F5F5F7',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
                        </svg>
                        <span>Edit</span>
                      </Link>

                      <button
                        type="button"
                        onClick={() => setPromptToDelete(item)}
                        style={{
                          padding: '4px 8px',
                          fontSize: '0.75rem',
                          borderRadius: '6px',
                          background: 'rgba(230, 106, 115, 0.08)',
                          color: '#E66A73',
                          border: '1px solid rgba(230, 106, 115, 0.25)',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                        }}
                        title="Delete prompt"
                      >
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {promptToDelete && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
          }}
        >
          <div
            style={{
              backgroundColor: '#101015',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '16px',
              padding: '28px',
              maxWidth: '460px',
              width: '100%',
              boxShadow: '0 20px 50px rgba(0,0,0,0.9)',
            }}
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: 'rgba(230, 106, 115, 0.12)',
                color: '#E66A73',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#F5F5F7', margin: '0 0 8px 0' }}>
              Delete Video Prompt?
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#A5A5AF', margin: '0 0 24px 0', lineHeight: 1.5 }}>
              Are you sure you want to permanently delete <strong>&ldquo;{promptToDelete.title}&rdquo;</strong>? This
              action cannot be undone.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setPromptToDelete(null)}
                disabled={deleting}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#F5F5F7',
                  fontSize: '0.8125rem',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleting}
                style={{
                  padding: '8px 18px',
                  borderRadius: '8px',
                  background: '#E66A73',
                  border: 'none',
                  color: '#FFFFFF',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  cursor: deleting ? 'not-allowed' : 'pointer',
                  opacity: deleting ? 0.6 : 1,
                }}
              >
                {deleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
