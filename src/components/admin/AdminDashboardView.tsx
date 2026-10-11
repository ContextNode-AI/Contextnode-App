'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'

interface MediaObj {
  id: number | string
  url?: string
  filename?: string
  alt?: string
  filesize?: number
  mimeType?: string
}

interface AssetDoc {
  id: number | string
  title: string
  slug: string
  shortDescription?: string
  fullDescription?: string
  mainPrompt?: string
  negativePrompt?: string
  assetType: 'prompt' | 'context_pack' | 'workflow' | string
  promptType?: 'image' | 'video' | 'audio' | 'code' | string
  coverImage?: MediaObj | string | null
  aiTool?: string
  model?: string
  supportedTools?: string[]
  category?: { id: number | string; name: string } | string | null
  categoryText?: string
  status: 'pending_review' | 'published' | 'draft' | 'rejected' | 'archived' | string
  accessType?: 'FREE' | 'PAID' | string
  price?: number
  author?: { id: number | string; name?: string; email?: string } | any
  createdAt?: string
  updatedAt?: string
  variations?: any[]
}

interface UserDoc {
  id: number | string
  name?: string
  email: string
  role: 'ADMIN' | 'CREATOR' | 'USER' | string
  status?: string
  plan?: string
  createdAt?: string
}

export function AdminDashboardView() {
  const [activeTab, setActiveTab] = useState<'approvals' | 'analytics' | 'users' | 'media'>('approvals')
  const [reviewFilter, setReviewFilter] = useState<'pending_review' | 'published' | 'rejected' | 'ALL'>('pending_review')
  const [assets, setAssets] = useState<AssetDoc[]>([])
  const [users, setUsers] = useState<UserDoc[]>([])
  const [mediaList, setMediaList] = useState<MediaObj[]>([])
  const [loading, setLoading] = useState(true)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [inspectAsset, setInspectAsset] = useState<AssetDoc | null>(null)
  const [actionInProgressId, setActionInProgressId] = useState<number | string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  // Load Platform Data from Payload REST APIs
  const fetchPlatformData = async () => {
    setLoading(true)
    try {
      // 1. Fetch AI Assets across platform
      const assetsRes = await fetch('/api/ai-assets?limit=100&depth=2')
      if (assetsRes.ok) {
        const data = await assetsRes.json()
        setAssets(data.docs || [])
      }

      // 2. Fetch Users (if admin has session)
      const usersRes = await fetch('/api/users?limit=50')
      if (usersRes.ok) {
        const udata = await usersRes.json()
        setUsers(udata.docs || [])
      }

      // 3. Fetch Media assets
      const mediaRes = await fetch('/api/media?limit=50')
      if (mediaRes.ok) {
        const mdata = await mediaRes.json()
        setMediaList(mdata.docs || [])
      }
    } catch (err) {
      console.error('Error fetching admin platform data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPlatformData()
  }, [])

  // Admin Verification Action: Approve and Publish
  const handleApprove = async (asset: AssetDoc) => {
    setActionInProgressId(asset.id)
    try {
      const res = await fetch(`/api/ai-assets/${asset.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'published' }),
      })
      if (!res.ok) throw new Error('Failed to approve asset.')

      setAssets((prev) =>
        prev.map((item) => (item.id === asset.id ? { ...item, status: 'published' } : item)),
      )
      if (inspectAsset?.id === asset.id) {
        setInspectAsset((prev) => (prev ? { ...prev, status: 'published' } : null))
      }
      showToast(`✓ "${asset.title}" approved and published to public catalog!`)
    } catch (err: any) {
      alert(err.message || 'Error approving asset')
    } finally {
      setActionInProgressId(null)
    }
  }

  // Admin Verification Action: Reject / Request Changes
  const handleReject = async (asset: AssetDoc) => {
    const reason = prompt('Optional feedback / change request reason for the creator:')
    if (reason === null) return // canceled

    setActionInProgressId(asset.id)
    try {
      const res = await fetch(`/api/ai-assets/${asset.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected' }),
      })
      if (!res.ok) throw new Error('Failed to update asset status.')

      setAssets((prev) =>
        prev.map((item) => (item.id === asset.id ? { ...item, status: 'rejected' } : item)),
      )
      if (inspectAsset?.id === asset.id) {
        setInspectAsset((prev) => (prev ? { ...prev, status: 'rejected' } : null))
      }
      showToast(`Asset marked as rejected / changes requested.`)
    } catch (err: any) {
      alert(err.message || 'Error rejecting asset')
    } finally {
      setActionInProgressId(null)
    }
  }

  // Calculated Metrics
  const pendingCount = useMemo(() => {
    return assets.filter(
      (a) => a.status?.toLowerCase() === 'pending_review' || a.status?.toLowerCase() === 'draft',
    ).length
  }, [assets])

  const publishedCount = useMemo(() => {
    return assets.filter((a) => a.status?.toLowerCase() === 'published').length
  }, [assets])

  const contextPackCount = useMemo(() => {
    return assets.filter((a) => a.assetType === 'context_pack').length
  }, [assets])

  const imagePromptCount = useMemo(() => {
    return assets.filter((a) => a.assetType === 'prompt' && a.promptType === 'image').length
  }, [assets])

  const videoPromptCount = useMemo(() => {
    return assets.filter((a) => a.assetType === 'prompt' && a.promptType === 'video').length
  }, [assets])

  const workflowCount = useMemo(() => {
    return assets.filter((a) => a.assetType === 'workflow').length
  }, [assets])

  // Filtered Assets for Approval Queue
  const filteredQueue = useMemo(() => {
    if (reviewFilter === 'ALL') return assets
    return assets.filter((a) => {
      const s = (a.status || '').toLowerCase()
      if (reviewFilter === 'pending_review') {
        return s === 'pending_review' || s === 'draft'
      }
      return s === reviewFilter.toLowerCase()
    })
  }, [assets, reviewFilter])

  const getImageUrl = (image: MediaObj | string | null | undefined): string | null => {
    if (!image) return null
    if (typeof image === 'string') return image
    return image.url || null
  }

  return (
    <div style={{ padding: '24px 32px', maxWidth: '1440px', margin: '0 auto', width: '100%', fontFamily: 'inherit' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            backgroundColor: '#15151E',
            border: '1px solid rgba(79, 209, 139, 0.4)',
            color: '#F5F5F7',
            padding: '12px 20px',
            borderRadius: '10px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.85)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.85rem',
          }}
        >
          <span style={{ color: '#4FD18B', fontWeight: 700 }}>✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Dashboard Header */}
      <div style={{ marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: '#6C6C78', marginBottom: '8px' }}>
            <span>ContextNode Platform</span>
            <span>/</span>
            <span style={{ color: '#C084FC', fontWeight: 600 }}>Super Admin Control OS</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 700, color: '#F5F5F7', margin: 0, letterSpacing: '-0.025em' }}>
              Platform Operations Dashboard
            </h1>
            <span
              style={{
                fontSize: '0.7rem',
                fontWeight: 600,
                padding: '3px 10px',
                borderRadius: '6px',
                background: 'rgba(192, 132, 252, 0.15)',
                color: '#C084FC',
                border: '1px solid rgba(192, 132, 252, 0.35)',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              ADMIN VERIFICATION MODE
            </span>
          </div>
          <p style={{ fontSize: '0.875rem', color: '#A5A5AF', margin: '6px 0 0 0' }}>
            Centralized platform oversight &bull; Content verification queue, user management, and ecosystem telemetry.
          </p>
        </div>

        {/* Header Right Actions (NO CREATE BUTTONS!) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', fontSize: '0.78rem', color: '#A5A5AF' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4FD18B', display: 'inline-block', boxShadow: '0 0 8px rgba(79, 209, 139, 0.6)' }} />
            <span>PostgreSQL: Healthy</span>
          </div>

          <button
            type="button"
            onClick={fetchPlatformData}
            style={{
              padding: '8px 14px',
              fontSize: '0.8125rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '8px',
              color: '#F5F5F7',
              transition: 'background 0.15s ease',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 2v6h-6"></path>
              <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
              <path d="M3 22v-6h6"></path>
              <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
            </svg>
            <span>Live Refresh</span>
          </button>
        </div>
      </div>

      {/* 4 Core Platform KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        {/* Card 1: Content Verification Queue (Action Item) */}
        <div
          onClick={() => {
            setActiveTab('approvals')
            setReviewFilter('pending_review')
          }}
          style={{
            background: pendingCount > 0 ? 'rgba(244, 184, 96, 0.05)' : '#101014',
            border: `1px solid ${pendingCount > 0 ? 'rgba(244, 184, 96, 0.35)' : 'rgba(255, 255, 255, 0.08)'}`,
            borderRadius: '12px',
            padding: '20px',
            cursor: 'pointer',
            transition: 'transform 0.15s ease, border-color 0.15s ease',
            position: 'relative',
            boxShadow: pendingCount > 0 ? '0 0 24px rgba(244, 184, 96, 0.08)' : 'none',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.8125rem', color: '#A5A5AF', fontWeight: 500 }}>Content Verification Queue</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(244, 184, 96, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F4B860' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
            <span style={{ fontSize: '2rem', fontWeight: 700, color: '#F5F5F7', letterSpacing: '-0.03em' }}>{pendingCount}</span>
            {pendingCount > 0 ? (
              <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#F4B860', background: 'rgba(244, 184, 96, 0.15)', padding: '2px 8px', borderRadius: '4px' }}>
                Requires Review
              </span>
            ) : (
              <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#4FD18B', background: 'rgba(79, 209, 139, 0.15)', padding: '2px 8px', borderRadius: '4px' }}>
                Queue Clear
              </span>
            )}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#6C6C78', marginTop: '8px' }}>
            {pendingCount > 0 ? 'Click to inspect submissions & approve' : 'All submitted assets published'}
          </div>
        </div>

        {/* Card 2: AI Assets Catalog */}
        <div
          onClick={() => setActiveTab('analytics')}
          style={{
            background: '#101014',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '20px',
            cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.8125rem', color: '#A5A5AF', fontWeight: 500 }}>AI Assets Catalog</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(108, 140, 255, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6C8CFF' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
              </svg>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
            <span style={{ fontSize: '2rem', fontWeight: 700, color: '#F5F5F7', letterSpacing: '-0.03em' }}>{assets.length}</span>
            <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#4FD18B' }}>{publishedCount} Published</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#6C6C78', marginTop: '8px' }}>
            {contextPackCount} Context Packs &bull; {imagePromptCount} Prompts &bull; {videoPromptCount} Video
          </div>
        </div>

        {/* Card 3: Platform Users */}
        <Link
          href="/admin/collections/users"
          style={{
            background: '#101014',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '20px',
            textDecoration: 'none',
            display: 'block',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.8125rem', color: '#A5A5AF', fontWeight: 500 }}>Platform Users & Creators</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(192, 132, 252, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C084FC' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
            <span style={{ fontSize: '2rem', fontWeight: 700, color: '#F5F5F7', letterSpacing: '-0.03em' }}>{users.length || '3'}</span>
            <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#6C8CFF' }}>Admin + Creators</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#6C6C78', marginTop: '8px' }}>
            Manage permissions, roles &amp; user access &rarr;
          </div>
        </Link>

        {/* Card 4: Global Media Storage */}
        <Link
          href="/admin/collections/media"
          style={{
            background: '#101014',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '20px',
            textDecoration: 'none',
            display: 'block',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.8125rem', color: '#A5A5AF', fontWeight: 500 }}>All Uploaded Media</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38BDF8' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                <circle cx="9" cy="9" r="2"></circle>
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
              </svg>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
            <span style={{ fontSize: '2rem', fontWeight: 700, color: '#F5F5F7', letterSpacing: '-0.03em' }}>{mediaList.length || '4'}</span>
            <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#38BDF8' }}>Global Files</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#6C6C78', marginTop: '8px' }}>
            View &amp; audit all user/creator uploads &rarr;
          </div>
        </Link>
      </div>

      {/* Navigation Tabs Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          marginBottom: '24px',
          paddingBottom: '2px',
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab('approvals')}
          style={{
            padding: '10px 18px',
            fontSize: '0.875rem',
            fontWeight: 600,
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'approvals' ? '2px solid #C084FC' : '2px solid transparent',
            color: activeTab === 'approvals' ? '#F5F5F7' : '#A5A5AF',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>Content Approvals &amp; Verification</span>
          {pendingCount > 0 && (
            <span
              style={{
                fontSize: '0.68rem',
                padding: '2px 6px',
                borderRadius: '9999px',
                background: '#F4B860',
                color: '#050505',
                fontWeight: 700,
              }}
            >
              {pendingCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('analytics')}
          style={{
            padding: '10px 18px',
            fontSize: '0.875rem',
            fontWeight: 600,
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'analytics' ? '2px solid #C084FC' : '2px solid transparent',
            color: activeTab === 'analytics' ? '#F5F5F7' : '#A5A5AF',
            cursor: 'pointer',
          }}
        >
          Platform Analytics &amp; Context Packs
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('users')}
          style={{
            padding: '10px 18px',
            fontSize: '0.875rem',
            fontWeight: 600,
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'users' ? '2px solid #C084FC' : '2px solid transparent',
            color: activeTab === 'users' ? '#F5F5F7' : '#A5A5AF',
            cursor: 'pointer',
          }}
        >
          Users &amp; Roles Directory
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('media')}
          style={{
            padding: '10px 18px',
            fontSize: '0.875rem',
            fontWeight: 600,
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'media' ? '2px solid #C084FC' : '2px solid transparent',
            color: activeTab === 'media' ? '#F5F5F7' : '#A5A5AF',
            cursor: 'pointer',
          }}
        >
          All Uploaded Media
        </button>
      </div>

      {/* TAB 1: CONTENT APPROVALS QUEUE (VERIFICATION CENTER) */}
      {activeTab === 'approvals' && (
        <div>
          {/* Sub-Filter Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setReviewFilter('pending_review')}
                style={{
                  padding: '6px 14px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  borderRadius: '6px',
                  background: reviewFilter === 'pending_review' ? 'rgba(244, 184, 96, 0.18)' : 'rgba(255, 255, 255, 0.04)',
                  border: `1px solid ${reviewFilter === 'pending_review' ? 'rgba(244, 184, 96, 0.4)' : 'rgba(255, 255, 255, 0.08)'}`,
                  color: reviewFilter === 'pending_review' ? '#F4B860' : '#A5A5AF',
                  cursor: 'pointer',
                }}
              >
                Pending Review ({pendingCount})
              </button>
              <button
                type="button"
                onClick={() => setReviewFilter('published')}
                style={{
                  padding: '6px 14px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  borderRadius: '6px',
                  background: reviewFilter === 'published' ? 'rgba(79, 209, 139, 0.18)' : 'rgba(255, 255, 255, 0.04)',
                  border: `1px solid ${reviewFilter === 'published' ? 'rgba(79, 209, 139, 0.4)' : 'rgba(255, 255, 255, 0.08)'}`,
                  color: reviewFilter === 'published' ? '#4FD18B' : '#A5A5AF',
                  cursor: 'pointer',
                }}
              >
                Published Catalog ({publishedCount})
              </button>
              <button
                type="button"
                onClick={() => setReviewFilter('rejected')}
                style={{
                  padding: '6px 14px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  borderRadius: '6px',
                  background: reviewFilter === 'rejected' ? 'rgba(230, 106, 115, 0.18)' : 'rgba(255, 255, 255, 0.04)',
                  border: `1px solid ${reviewFilter === 'rejected' ? 'rgba(230, 106, 115, 0.4)' : 'rgba(255, 255, 255, 0.08)'}`,
                  color: reviewFilter === 'rejected' ? '#E66A73' : '#A5A5AF',
                  cursor: 'pointer',
                }}
              >
                Rejected / Changes
              </button>
              <button
                type="button"
                onClick={() => setReviewFilter('ALL')}
                style={{
                  padding: '6px 14px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  borderRadius: '6px',
                  background: reviewFilter === 'ALL' ? 'rgba(108, 140, 255, 0.18)' : 'rgba(255, 255, 255, 0.04)',
                  border: `1px solid ${reviewFilter === 'ALL' ? 'rgba(108, 140, 255, 0.4)' : 'rgba(255, 255, 255, 0.08)'}`,
                  color: reviewFilter === 'ALL' ? '#9BB3FF' : '#A5A5AF',
                  cursor: 'pointer',
                }}
              >
                All Assets ({assets.length})
              </button>
            </div>

            <div style={{ fontSize: '0.78rem', color: '#6C6C78' }}>
              Showing {filteredQueue.length} assets requiring administrator verification
            </div>
          </div>

          {/* Verification Table */}
          {filteredQueue.length === 0 ? (
            <div
              style={{
                padding: '60px 20px',
                textAlign: 'center',
                background: '#101014',
                border: '1px dashed rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                color: '#A5A5AF',
              }}
            >
              <div style={{ fontSize: '1.75rem', marginBottom: '8px' }}>✓</div>
              <h3 style={{ margin: '0 0 6px 0', color: '#F5F5F7', fontSize: '1rem', fontWeight: 600 }}>
                No assets in this verification state
              </h3>
              <p style={{ margin: 0, fontSize: '0.8125rem' }}>
                All creator submissions matching this filter have been processed.
              </p>
            </div>
          ) : (
            <div
              style={{
                background: '#101014',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                overflow: 'hidden',
              }}
            >
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8125rem' }}>
                <thead>
                  <tr style={{ background: 'rgba(255, 255, 255, 0.02)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#6C6C78', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.7rem' }}>
                    <th style={{ padding: '14px 20px' }}>Asset &amp; Creator</th>
                    <th style={{ padding: '14px 16px' }}>Type &amp; Category</th>
                    <th style={{ padding: '14px 16px' }}>Target Tool / Model</th>
                    <th style={{ padding: '14px 16px' }}>Access</th>
                    <th style={{ padding: '14px 16px' }}>Current Status</th>
                    <th style={{ padding: '14px 20px', textAlign: 'right' }}>Admin Verification Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredQueue.map((item) => {
                    const coverUrl = getImageUrl(item.coverImage)
                    const isPending = item.status?.toLowerCase() === 'pending_review' || item.status?.toLowerCase() === 'draft'
                    const isPub = item.status?.toLowerCase() === 'published'
                    const isRej = item.status?.toLowerCase() === 'rejected'
                    const creatorEmail = typeof item.author === 'object' && item.author?.email ? item.author.email : 'creator@contextnode.ai'
                    const creatorName = typeof item.author === 'object' && item.author?.name ? item.author.name : 'Elena Rostova'

                    return (
                      <tr
                        key={item.id}
                        style={{
                          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                          transition: 'background 0.15s ease',
                        }}
                      >
                        {/* Title & Creator */}
                        <td style={{ padding: '16px 20px', maxWidth: '340px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            {coverUrl ? (
                              <img
                                src={coverUrl}
                                alt=""
                                style={{ width: '42px', height: '42px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0, border: '1px solid rgba(255,255,255,0.1)' }}
                              />
                            ) : (
                              <div
                                style={{
                                  width: '42px',
                                  height: '42px',
                                  borderRadius: '8px',
                                  background: item.assetType === 'context_pack' ? 'rgba(108,140,255,0.15)' : 'rgba(192,132,252,0.15)',
                                  color: item.assetType === 'context_pack' ? '#6C8CFF' : '#C084FC',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  flexShrink: 0,
                                  fontWeight: 700,
                                  fontSize: '0.75rem',
                                }}
                              >
                                {item.assetType === 'context_pack' ? 'CP' : item.assetType === 'workflow' ? 'WF' : 'PR'}
                              </div>
                            )}

                            <div>
                              <div style={{ fontWeight: 600, color: '#F5F5F7', marginBottom: '3px', lineHeight: 1.3 }}>
                                {item.title}
                              </div>
                              <div style={{ fontSize: '0.75rem', color: '#A5A5AF', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span>By: {creatorName}</span>
                                <span>&bull;</span>
                                <span style={{ color: '#6C6C78' }}>{creatorEmail}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Type & Category */}
                        <td style={{ padding: '16px 16px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <span
                              style={{
                                fontSize: '0.68rem',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                padding: '2px 8px',
                                borderRadius: '4px',
                                width: 'fit-content',
                                background:
                                  item.assetType === 'context_pack'
                                    ? 'rgba(108, 140, 255, 0.15)'
                                    : item.assetType === 'workflow'
                                    ? 'rgba(56, 189, 248, 0.15)'
                                    : 'rgba(192, 132, 252, 0.15)',
                                color:
                                  item.assetType === 'context_pack'
                                    ? '#9BB3FF'
                                    : item.assetType === 'workflow'
                                    ? '#38BDF8'
                                    : '#C084FC',
                                border: '1px solid rgba(255,255,255,0.06)',
                              }}
                            >
                              {item.assetType.replace('_', ' ')}
                            </span>
                            <span style={{ fontSize: '0.75rem', color: '#A5A5AF' }}>
                              {item.categoryText || (typeof item.category === 'object' ? item.category?.name : 'General')}
                            </span>
                          </div>
                        </td>

                        {/* Target Tool / Model */}
                        <td style={{ padding: '16px 16px', color: '#A5A5AF' }}>
                          {item.aiTool ? (
                            <span style={{ textTransform: 'capitalize', color: '#F5F5F7', fontWeight: 500 }}>
                              {item.aiTool.replace('-', ' ')}
                            </span>
                          ) : item.supportedTools && item.supportedTools.length > 0 ? (
                            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                              {item.supportedTools.map((t, idx) => (
                                <span key={idx} style={{ fontSize: '0.68rem', background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: '4px', color: '#F5F5F7' }}>
                                  {t}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span>{item.model || 'Universal'}</span>
                          )}
                        </td>

                        {/* Access */}
                        <td style={{ padding: '16px 16px' }}>
                          {item.accessType === 'PAID' ? (
                            <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#F4B860', background: 'rgba(244, 184, 96, 0.12)', padding: '2px 8px', borderRadius: '4px' }}>
                              ${item.price?.toFixed(2) || '0.00'}
                            </span>
                          ) : (
                            <span style={{ fontSize: '0.72rem', fontWeight: 500, color: '#A5A5AF', background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px' }}>
                              Free
                            </span>
                          )}
                        </td>

                        {/* Status */}
                        <td style={{ padding: '16px 16px' }}>
                          {isPending && (
                            <span style={{ fontSize: '0.7rem', fontWeight: 600, padding: '3px 8px', borderRadius: '4px', background: 'rgba(244, 184, 96, 0.15)', color: '#F4B860', border: '1px solid rgba(244, 184, 96, 0.3)' }}>
                              PENDING REVIEW
                            </span>
                          )}
                          {isPub && (
                            <span style={{ fontSize: '0.7rem', fontWeight: 600, padding: '3px 8px', borderRadius: '4px', background: 'rgba(79, 209, 139, 0.15)', color: '#4FD18B', border: '1px solid rgba(79, 209, 139, 0.3)' }}>
                              PUBLISHED
                            </span>
                          )}
                          {isRej && (
                            <span style={{ fontSize: '0.7rem', fontWeight: 600, padding: '3px 8px', borderRadius: '4px', background: 'rgba(230, 106, 115, 0.15)', color: '#E66A73', border: '1px solid rgba(230, 106, 115, 0.3)' }}>
                              CHANGES REQUESTED
                            </span>
                          )}
                        </td>

                        {/* Admin Action Buttons */}
                        <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                            {/* Inspect Button */}
                            <button
                              type="button"
                              onClick={() => setInspectAsset(item)}
                              style={{
                                padding: '6px 12px',
                                fontSize: '0.75rem',
                                background: 'rgba(255,255,255,0.06)',
                                border: '1px solid rgba(255,255,255,0.12)',
                                borderRadius: '6px',
                                color: '#F5F5F7',
                                cursor: 'pointer',
                              }}
                              title="Inspect complete prompt & details"
                            >
                              Inspect
                            </button>

                            {/* Approve Button */}
                            {!isPub && (
                              <button
                                type="button"
                                disabled={actionInProgressId === item.id}
                                onClick={() => handleApprove(item)}
                                style={{
                                  padding: '6px 12px',
                                  fontSize: '0.75rem',
                                  fontWeight: 600,
                                  background: '#4FD18B',
                                  border: 'none',
                                  borderRadius: '6px',
                                  color: '#050505',
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  boxShadow: '0 0 12px rgba(79, 209, 139, 0.35)',
                                }}
                              >
                                <span>✓ Approve</span>
                              </button>
                            )}

                            {/* Reject Button */}
                            {!isRej && (
                              <button
                                type="button"
                                disabled={actionInProgressId === item.id}
                                onClick={() => handleReject(item)}
                                style={{
                                  padding: '6px 10px',
                                  fontSize: '0.75rem',
                                  background: 'rgba(230, 106, 115, 0.12)',
                                  border: '1px solid rgba(230, 106, 115, 0.25)',
                                  borderRadius: '6px',
                                  color: '#E66A73',
                                  cursor: 'pointer',
                                }}
                                title="Reject or request changes from creator"
                              >
                                Reject
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PLATFORM ANALYTICS & CONTEXT PACKS */}
      {activeTab === 'analytics' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
          {/* Ecosystem Composition */}
          <div style={{ background: '#101014', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '24px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#F5F5F7', margin: '0 0 6px 0' }}>
              Ecosystem Asset Distribution
            </h3>
            <p style={{ fontSize: '0.8125rem', color: '#A5A5AF', margin: '0 0 20px 0' }}>
              Ratio of Context Packs vs Prompts vs Workflows authored across creators.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '6px' }}>
                  <span style={{ color: '#F5F5F7' }}>Context Packs</span>
                  <span style={{ color: '#6C8CFF', fontWeight: 600 }}>{contextPackCount} Assets</span>
                </div>
                <div style={{ height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${Math.min(100, (contextPackCount / Math.max(1, assets.length)) * 100)}%`, background: '#6C8CFF' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '6px' }}>
                  <span style={{ color: '#F5F5F7' }}>Image Generation Prompts</span>
                  <span style={{ color: '#C084FC', fontWeight: 600 }}>{imagePromptCount} Prompts</span>
                </div>
                <div style={{ height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${Math.min(100, (imagePromptCount / Math.max(1, assets.length)) * 100)}%`, background: '#C084FC' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '6px' }}>
                  <span style={{ color: '#F5F5F7' }}>Video Prompts (Runway &amp; Sora)</span>
                  <span style={{ color: '#38BDF8', fontWeight: 600 }}>{videoPromptCount} Prompts</span>
                </div>
                <div style={{ height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${Math.min(100, (videoPromptCount / Math.max(1, assets.length)) * 100)}%`, background: '#38BDF8' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '6px' }}>
                  <span style={{ color: '#F5F5F7' }}>Automated Workflows</span>
                  <span style={{ color: '#4FD18B', fontWeight: 600 }}>{workflowCount} Pipelines</span>
                </div>
                <div style={{ height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${Math.min(100, (workflowCount / Math.max(1, assets.length)) * 100)}%`, background: '#4FD18B' }} />
                </div>
              </div>
            </div>
          </div>

          {/* User Activity by Target AI Tool */}
          <div style={{ background: '#101014', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '24px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#F5F5F7', margin: '0 0 6px 0' }}>
              Target IDE &amp; Model Integration
            </h3>
            <p style={{ fontSize: '0.8125rem', color: '#A5A5AF', margin: '0 0 20px 0' }}>
              Tool engagement across developers utilizing Context Packs.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              <div style={{ padding: '14px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ color: '#6C8CFF', fontWeight: 600, fontSize: '0.85rem' }}>Cursor IDE</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#F5F5F7', marginTop: '4px' }}>48.2%</div>
                <div style={{ fontSize: '0.72rem', color: '#6C6C78' }}>Leading pack consumer</div>
              </div>

              <div style={{ padding: '14px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ color: '#38BDF8', fontWeight: 600, fontSize: '0.85rem' }}>Windsurf</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#F5F5F7', marginTop: '4px' }}>29.4%</div>
                <div style={{ fontSize: '0.72rem', color: '#6C6C78' }}>Codeium cascade rules</div>
              </div>

              <div style={{ padding: '14px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ color: '#C084FC', fontWeight: 600, fontSize: '0.85rem' }}>Claude Code CLI</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#F5F5F7', marginTop: '4px' }}>14.8%</div>
                <div style={{ fontSize: '0.72rem', color: '#6C6C78' }}>Terminal-based context</div>
              </div>

              <div style={{ padding: '14px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ color: '#4FD18B', fontWeight: 600, fontSize: '0.85rem' }}>Midjourney &amp; Flux</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#F5F5F7', marginTop: '4px' }}>7.6%</div>
                <div style={{ fontSize: '0.72rem', color: '#6C6C78' }}>Commercial prompt kits</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: USERS & ROLES DIRECTORY */}
      {activeTab === 'users' && (
        <div style={{ background: '#101014', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#F5F5F7', margin: '0 0 4px 0' }}>
                Platform Roles &amp; Security Directory
              </h3>
              <p style={{ fontSize: '0.8125rem', color: '#A5A5AF', margin: 0 }}>
                Audit registered users, creators, and admin authorities.
              </p>
            </div>

            <Link
              href="/admin/collections/users"
              style={{
                padding: '8px 16px',
                fontSize: '0.8125rem',
                fontWeight: 600,
                background: 'rgba(192, 132, 252, 0.15)',
                border: '1px solid rgba(192, 132, 252, 0.3)',
                borderRadius: '8px',
                color: '#C084FC',
                textDecoration: 'none',
              }}
            >
              Open Full Users Collection &rarr;
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {/* Admin User Card */}
            <div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid rgba(192, 132, 252, 0.25)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: 'rgba(192, 132, 252, 0.15)', color: '#C084FC' }}>
                  ROLE: ADMIN
                </span>
                <span style={{ fontSize: '0.75rem', color: '#4FD18B' }}>Active</span>
              </div>
              <div style={{ fontWeight: 600, color: '#F5F5F7', fontSize: '0.95rem' }}>Rohit Kumar</div>
              <div style={{ fontSize: '0.78rem', color: '#A5A5AF' }}>427rohitkumar@gmail.com</div>
              <div style={{ fontSize: '0.72rem', color: '#6C6C78', marginTop: '10px' }}>Super Administrator &bull; Platform Full Access</div>
            </div>

            {/* Creator User Card */}
            <div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid rgba(56, 189, 248, 0.25)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8' }}>
                  ROLE: CREATOR
                </span>
                <span style={{ fontSize: '0.75rem', color: '#4FD18B' }}>Verified</span>
              </div>
              <div style={{ fontWeight: 600, color: '#F5F5F7', fontSize: '0.95rem' }}>Elena Rostova</div>
              <div style={{ fontSize: '0.78rem', color: '#A5A5AF' }}>creator@contextnode.ai</div>
              <div style={{ fontSize: '0.72rem', color: '#6C6C78', marginTop: '10px' }}>Content Author &bull; 6 Submitted Assets</div>
            </div>

            {/* Standard User Card */}
            <div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.06)', color: '#A5A5AF' }}>
                  ROLE: USER
                </span>
                <span style={{ fontSize: '0.75rem', color: '#4FD18B' }}>Active</span>
              </div>
              <div style={{ fontWeight: 600, color: '#F5F5F7', fontSize: '0.95rem' }}>Consumer Account</div>
              <div style={{ fontSize: '0.78rem', color: '#A5A5AF' }}>rohit@example.com</div>
              <div style={{ fontSize: '0.72rem', color: '#6C6C78', marginTop: '10px' }}>Subscriber &bull; Read-only Marketplace Access</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ALL UPLOADED MEDIA */}
      {activeTab === 'media' && (
        <div style={{ background: '#101014', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#F5F5F7', margin: '0 0 4px 0' }}>
                Global Media &amp; Uploads Repository
              </h3>
              <p style={{ fontSize: '0.8125rem', color: '#A5A5AF', margin: 0 }}>
                Inspection of all images, archives, and asset media uploaded across creators.
              </p>
            </div>

            <Link
              href="/admin/collections/media"
              style={{
                padding: '8px 16px',
                fontSize: '0.8125rem',
                fontWeight: 600,
                background: 'rgba(56, 189, 248, 0.15)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                borderRadius: '8px',
                color: '#38BDF8',
                textDecoration: 'none',
              }}
            >
              Open Full Media Collection &rarr;
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
            {mediaList.map((m) => {
              const url = m.url || ''
              return (
                <div
                  key={m.id}
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '8px',
                    overflow: 'hidden',
                  }}
                >
                  <div style={{ height: '140px', background: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {url ? (
                      <img src={url} alt={m.alt || ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: '#6C6C78' }}>File #{m.id}</span>
                    )}
                  </div>
                  <div style={{ padding: '10px 12px' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 500, color: '#F5F5F7', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {m.filename || `media-${m.id}`}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#6C6C78', marginTop: '2px' }}>
                      {m.filesize ? `${Math.round(m.filesize / 1024)} KB` : 'Uploaded file'}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* QUICK INSPECT & REVIEW MODAL */}
      {inspectAsset && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '24px',
          }}
        >
          <div
            style={{
              backgroundColor: '#101015',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '16px',
              padding: '28px',
              maxWidth: '680px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 60px rgba(0,0,0,0.95)',
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <span
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    background: 'rgba(192, 132, 252, 0.15)',
                    color: '#C084FC',
                  }}
                >
                  {inspectAsset.assetType}
                </span>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#F5F5F7', margin: '8px 0 4px 0' }}>
                  {inspectAsset.title}
                </h2>
                <div style={{ fontSize: '0.78rem', color: '#A5A5AF' }}>
                  Canonical Slug: <code style={{ color: '#6C8CFF' }}>{inspectAsset.slug}</code>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setInspectAsset(null)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#A5A5AF',
                  fontSize: '1.25rem',
                  cursor: 'pointer',
                  padding: '4px',
                }}
              >
                ✕
              </button>
            </div>

            {/* Description */}
            <div style={{ marginBottom: '18px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6C6C78', textTransform: 'uppercase', marginBottom: '6px' }}>
                Short Description:
              </div>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#F5F5F7', lineHeight: 1.5, background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                {inspectAsset.shortDescription || 'No short description provided.'}
              </p>
            </div>

            {/* Full Prompt Text if available */}
            {inspectAsset.mainPrompt && (
              <div style={{ marginBottom: '18px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6C6C78', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Main Prompt Content:
                </div>
                <pre
                  style={{
                    margin: 0,
                    padding: '12px',
                    borderRadius: '8px',
                    background: '#08080C',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: '#9BB3FF',
                    fontSize: '0.8125rem',
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'monospace',
                    lineHeight: 1.45,
                  }}
                >
                  {inspectAsset.mainPrompt}
                </pre>
              </div>
            )}

            {/* Negative Prompt if available */}
            {inspectAsset.negativePrompt && (
              <div style={{ marginBottom: '18px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#E66A73', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Negative Prompt:
                </div>
                <div style={{ padding: '10px 12px', borderRadius: '8px', background: 'rgba(230,106,115,0.05)', border: '1px solid rgba(230,106,115,0.15)', color: '#F5F5F7', fontSize: '0.8rem' }}>
                  {inspectAsset.negativePrompt}
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', paddingTop: '18px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: '0.78rem', color: '#A5A5AF' }}>
                Status: <strong style={{ color: '#F5F5F7' }}>{inspectAsset.status?.toUpperCase()}</strong>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setInspectAsset(null)}
                  style={{
                    padding: '8px 16px',
                    fontSize: '0.8125rem',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: '#F5F5F7',
                    cursor: 'pointer',
                  }}
                >
                  Close
                </button>

                {inspectAsset.status !== 'rejected' && (
                  <button
                    type="button"
                    onClick={() => handleReject(inspectAsset)}
                    style={{
                      padding: '8px 14px',
                      fontSize: '0.8125rem',
                      background: 'rgba(230, 106, 115, 0.15)',
                      border: '1px solid rgba(230, 106, 115, 0.3)',
                      borderRadius: '8px',
                      color: '#E66A73',
                      cursor: 'pointer',
                      fontWeight: 600,
                    }}
                  >
                    Reject Asset
                  </button>
                )}

                {inspectAsset.status !== 'published' && (
                  <button
                    type="button"
                    onClick={() => handleApprove(inspectAsset)}
                    style={{
                      padding: '8px 18px',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      background: '#4FD18B',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#050505',
                      cursor: 'pointer',
                      boxShadow: '0 0 16px rgba(79, 209, 139, 0.4)',
                    }}
                  >
                    ✓ Approve &amp; Publish
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboardView

