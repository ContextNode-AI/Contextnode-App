'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { SidebarNav } from '@/components/admin/SidebarNav'
import '@/app/(payload)/custom.scss'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    fetch('/api/users/me')
      .then((res) => res.json())
      .then((data) => {
        if (data?.user) {
          setCurrentUser(data.user)
        }
      })
      .catch(() => { })
  }, [])

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#050505', color: '#F5F5F7' }}>
      {/* Permanent Left Sidebar Navigation — NEVER HIDES */}
      <SidebarNav />

      {/* Main Workspace Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflowX: 'hidden' }}>
        {/* Topbar Header */}
        <header
          style={{
            height: '64px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            backgroundColor: 'rgba(11, 11, 15, 0.7)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 32px',
            position: 'sticky',
            top: 0,
            zIndex: 40,
          }}
        >
          {/* Topbar Left: Global Search */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                width: '320px',
              }}
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#6C6C78"
                strokeWidth="2"
                style={{ position: 'absolute', left: '12px', pointerEvents: 'none' }}
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                type="text"
                placeholder="Search prompts, packs, workflows..."
                style={{
                  width: '100%',
                  height: '36px',
                  backgroundColor: '#0B0B0F',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '8px',
                  padding: '0 12px 0 36px',
                  color: '#F5F5F7',
                  fontSize: '0.8125rem',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Topbar Right: Status, Create Action, User Profile */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: '#A5A5AF' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4FD18B', display: 'inline-block', boxShadow: '0 0 8px rgba(79, 209, 139, 0.6)' }}></span>
              <span>Cluster Live</span>
            </div>


            <Link
              href="/login"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'rgba(108, 140, 255, 0.15)',
                border: '1px solid rgba(108, 140, 255, 0.3)',
                color: '#6C8CFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 600,
                textDecoration: 'none',
              }}
              title="Sign Out / Switch User"
            >
              {currentUser?.name ? currentUser.name.substring(0, 2).toUpperCase() : 'ER'}
            </Link>
          </div>
        </header>

        {/* Content Body */}
        <main style={{ flex: 1, width: '100%' }}>
          {children}
        </main>
      </div>
    </div>
  )
}

