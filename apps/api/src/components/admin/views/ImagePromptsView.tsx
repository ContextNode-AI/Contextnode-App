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

interface PromptItem {
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
  aiTool?: string
  model?: string
  aspectRatio?: string
  style?: string
  useCase?: string
  category?: { id: number | string; name: string } | string | null
  tags?: Array<{ id: number | string; name: string } | string> | null
  tagList?: Array<{ id?: string; tag?: string }> | null
  variations?: Array<{
    id?: string
    title: string
    description?: string
    prompt: string
    previewImage?: MediaObj | string | null
  }>
  accessType?: 'FREE' | 'PAID'
  price?: number
  status: 'published' | 'draft' | 'archived'
  featured?: boolean
  createdAt?: string
  updatedAt?: string
  author?: any
}

export function ImagePromptsView() {
  const router = useRouter()
  const [prompts, setPrompts] = useState<PromptItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [categoryFilter, setCategoryFilter] = useState('ALL')
  const [toolFilter, setToolFilter] = useState('ALL')

  // Delete modal state
  const [promptToDelete, setPromptToDelete] = useState<PromptItem | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  // Fetch prompts from Payload REST API
  const fetchPrompts = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/ai-assets?where[assetType][equals]=prompt&where[promptType][equals]=image&limit=100&depth=2')
      if (!res.ok) {
        throw new Error('Failed to fetch image prompts.')
      }
      const data = await res.json()
      setPrompts(data.docs || [])
    } catch (err: any) {
      console.error('Error fetching prompts:', err)
      setError(err.message || 'Error loading image prompts')
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
      const cat = typeof p.category === 'object' && p.category?.name ? p.category.name : (p.category || (p as any).categoryText)
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
      const categoryName = typeof item.category === 'object' ? item.category?.name || '' : (item.category || (item as any).categoryText || '')
      const tool = (item.aiTool || '').toLowerCase()

      const tagsString = [
        ...(Array.isArray(item.tags) ? item.tags.map((t: any) => (typeof t === 'object' ? t.name || t.tag || '' : String(t))) : []),
        ...(Array.isArray(item.tagList) ? item.tagList.map((t: any) => (typeof t === 'object' ? t.tag || '' : String(t))) : []),
      ].join(' ').toLowerCase()

      const matchesSearch = !q || title.includes(q) || mainPrompt.includes(q) || desc.includes(q) || tagsString.includes(q)
      const matchesStatus = statusFilter === 'ALL' || item.status?.toUpperCase() === statusFilter.toUpperCase()
      const matchesCategory = categoryFilter === 'ALL' || categoryName.toLowerCase() === categoryFilter.toLowerCase()
      const matchesTool = toolFilter === 'ALL' || tool === toolFilter.toLowerCase()

      return matchesSearch && matchesStatus && matchesCategory && matchesTool
    })
  }, [prompts, searchQuery, statusFilter, categoryFilter, toolFilter])

  // Handle Delete
  const confirmDelete = async () => {
    if (!promptToDelete) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/ai-assets/${promptToDelete.id}`, {
        method: 'DELETE',
      })
      if (!res.ok) {
        throw new Error('Failed to delete prompt.')
      }
      setPrompts((prev) => prev.filter((p) => p.id !== promptToDelete.id))
      showToast(`Prompt "${promptToDelete.title}" successfully deleted.`)
      setPromptToDelete(null)
    } catch (err: any) {
      alert(err.message || 'Error deleting prompt.')
    } finally {
      setDeleting(false)
    }
  }

  const getImageUrl = (image: MediaObj | string | null | undefined): string | null => {
    if (!image) return null
    if (typeof image === 'string') return image
    return image.url || null
  }

  return (
    <div style={{ padding: '24px 32px', maxWidth: '1440px', margin: '0 auto', width: '100%' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            backgroundColor: '#15151E',
            border: '1px solid rgba(108, 140, 255, 0.4)',
            color: '#F5F5F7',
            padding: '12px 20px',
            borderRadius: '10px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.8)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.85rem',
          }}
        >
          <span style={{ color: '#4FD18B' }}>✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div className="page-title-group">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: '#6C6C78', marginBottom: '8px' }}>
            <Link href="/dashboard" style={{ color: '#A5A5AF', textDecoration: 'none' }}>Dashboard</Link>
            <span>/</span>
            <span>Creative</span>
            <span>/</span>
            <span style={{ color: '#F5F5F7' }}>Image Prompts</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#F5F5F7', margin: 0, letterSpacing: '-0.02em' }}>Image Prompts</h1>
          <p style={{ fontSize: '0.875rem', color: '#A5A5AF', margin: '4px 0 0 0' }}>Create, organize, and manage production prompts for AI image generation.</p>
        </div>

        <div className="page-actions" style={{ display: 'flex', gap: '12px' }}>
          <button
            type="button"
            onClick={fetchPrompts}
            className="btn btn-secondary"
            style={{
              padding: '8px 14px',
              fontSize: '0.8125rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              color: '#F5F5F7',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 2v6h-6"></path>
              <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
              <path d="M3 22v-6h6"></path>
              <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
            </svg>
            <span>Refresh</span>
          </button>

          <Link
            href="/dashboard/image-prompts/create"
            title="Create Image Prompt"
            aria-label="Create Image Prompt"
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

      {/* Filter & Search Bar */}
      <div className="prompts-filter-bar" style={{ marginBottom: '24px' }}>
        <div className="filter-search-wrap">
          <svg className="filter-search-icon" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            className="filter-search-input"
            placeholder="Search image prompts by title, prompt text, keyword..."
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
              style={{ minWidth: '130px' }}
            >
              <option value="ALL">All Status</option>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="filter-select-wrap">
            <select
              className="filter-select-custom"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={{ minWidth: '140px' }}
            >
              <option value="ALL">All Categories</option>
              {availableCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* AI Tool Filter */}
          <div className="filter-select-wrap">
            <select
              className="filter-select-custom"
              value={toolFilter}
              onChange={(e) => setToolFilter(e.target.value)}
              style={{ minWidth: '140px' }}
            >
              <option value="ALL">All AI Tools</option>
              <option value="midjourney">Midjourney</option>
              <option value="flux">Flux</option>
              <option value="stable-diffusion">Stable Diffusion</option>
              <option value="gpt-image">GPT Image (DALL-E)</option>
              <option value="ideogram">Ideogram</option>
              <option value="nano-banana">Nano Banana</option>
              <option value="general">General / Any</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div style={{ padding: '80px 20px', textAlign: 'center', color: '#A5A5AF' }}>
          <div style={{ display: 'inline-block', width: '32px', height: '32px', border: '3px solid rgba(108,140,255,0.2)', borderTopColor: '#6C8CFF', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '16px' }} />
          <div>Loading Image Prompts...</div>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div style={{ padding: '24px', background: 'rgba(230, 106, 115, 0.1)', border: '1px solid rgba(230, 106, 115, 0.3)', borderRadius: '12px', color: '#E66A73', marginBottom: '24px' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredPrompts.length === 0 && (
        <div
          className="empty-state"
          style={{
            padding: '64px 24px',
            textAlign: 'center',
            border: '1px dashed rgba(255, 255, 255, 0.12)',
            borderRadius: '16px',
            background: 'rgba(255, 255, 255, 0.01)',
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'rgba(108, 140, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
              color: '#6C8CFF',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path>
            </svg>
          </div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#F5F5F7', margin: '0 0 6px 0' }}>
            {searchQuery || statusFilter !== 'ALL' || categoryFilter !== 'ALL' || toolFilter !== 'ALL'
              ? 'No image prompts matching filter'
              : 'No image prompts created yet'}
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#A5A5AF', maxWidth: '420px', margin: '0 auto 20px auto' }}>
            {searchQuery || statusFilter !== 'ALL'
              ? 'Try modifying your search keywords or clear current filters.'
              : 'Start building your creative portfolio by crafting your first AI image generation prompt.'}
          </p>
          <Link
            href="/dashboard/image-prompts/create"
            style={{
              padding: '8px 18px',
              fontSize: '0.8125rem',
              fontWeight: 600,
              backgroundColor: '#6C8CFF',
              color: '#050505',
              borderRadius: '8px',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            + Create Image Prompt
          </Link>
        </div>
      )}

      {/* Prompts Cards Grid */}
      {!loading && !error && filteredPrompts.length > 0 && (
        <div className="prompt-card-grid">
          {filteredPrompts.map((item) => {
            const coverUrl = getImageUrl(item.coverImage)
            const varCount = Array.isArray(item.variations) ? item.variations.length : 0
            const categoryName = typeof item.category === 'object' ? item.category?.name : (item.category || (item as any).categoryText)
            const isPublished = item.status === 'published'

            return (
              <div key={item.id} className="prompt-card">
                {/* Thumbnail Wrap */}
                <div className="prompt-card-thumb-wrap">
                  {coverUrl ? (
                    <img src={coverUrl} alt={item.title} />
                  ) : (
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#6C6C78',
                        gap: '8px',
                        background: '#08080C',
                      }}
                    >
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                        <circle cx="9" cy="9" r="2"></circle>
                        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                      </svg>
                      <span style={{ fontSize: '0.75rem' }}>No Cover Image</span>
                    </div>
                  )}

                  {/* AI Tool Badge Overlay */}
                  {item.aiTool && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        fontSize: '0.68rem',
                        fontWeight: 600,
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        background: 'rgba(5, 5, 8, 0.8)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        color: '#F5F5F7',
                        textTransform: 'capitalize',
                      }}
                    >
                      {item.aiTool.replace('-', ' ')}
                    </span>
                  )}

                  {/* Variations Count Badge Overlay */}
                  {varCount > 0 && (
                    <span
                      style={{
                        position: 'absolute',
                        bottom: '10px',
                        left: '10px',
                        fontSize: '0.68rem',
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        background: 'rgba(108, 140, 255, 0.25)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(108, 140, 255, 0.45)',
                        color: '#9BB3FF',
                        fontWeight: 600,
                      }}
                    >
                      {varCount} Variation{varCount > 1 ? 's' : ''}
                    </span>
                  )}
                </div>

                {/* Card Body */}
                <div className="prompt-card-body">
                  {/* Category */}
                  {categoryName && (
                    <div className="prompt-card-category">{categoryName}</div>
                  )}

                  {/* Title */}
                  <h3 className="prompt-card-title">{item.title}</h3>

                  {/* Short description or Prompt snippet */}
                  <p className="prompt-preview-text">
                    {item.shortDescription || item.mainPrompt}
                  </p>

                  {/* Meta Bar */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: 'auto',
                      paddingTop: '12px',
                      borderTop: '1px solid rgba(255, 255, 255, 0.06)',
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
                          backgroundColor: isPublished ? 'rgba(79, 209, 139, 0.15)' : 'rgba(244, 184, 96, 0.15)',
                          color: isPublished ? '#4FD18B' : '#F4B860',
                          border: `1px solid ${isPublished ? 'rgba(79, 209, 139, 0.3)' : 'rgba(244, 184, 96, 0.3)'}`,
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
                        href={`/dashboard/image-prompts/${item.id}`}
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
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
              Delete Image Prompt?
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#A5A5AF', margin: '0 0 24px 0', lineHeight: 1.5 }}>
              Are you sure you want to permanently delete <strong>&ldquo;{promptToDelete.title}&rdquo;</strong>? This action cannot be undone.
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
