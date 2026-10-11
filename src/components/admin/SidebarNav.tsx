'use client'

import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@payloadcms/ui'

interface NavItem {
  label: string
  href: string
  isActive: boolean
  icon: React.ReactNode
  count?: string
}

interface NavGroup {
  title: string
  items: NavItem[]
}

export const SidebarNav: React.FC = () => {
  const pathname = usePathname()
  let contextUser: any = null
  try {
    const auth = useAuth()
    contextUser = auth?.user
  } catch {
    contextUser = null
  }
  const [currentUser, setCurrentUser] = useState<any>(contextUser)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('cn_sidebar_collapsed')
    if (stored === 'true') {
      setIsCollapsed(true)
    }

    fetch('/api/users/me')
      .then((res) => res.json())
      .then((data) => {
        if (data?.user) {
          setCurrentUser(data.user)
        }
      })
      .catch(() => {})
  }, [])

  const toggleSidebar = () => {
    const next = !isCollapsed
    setIsCollapsed(next)
    localStorage.setItem('cn_sidebar_collapsed', String(next))
  }

  const user = currentUser || contextUser

  // Determine user display info & Role
  const userEmail = user?.email || '427rohitkumar@gmail.com'
  const userRole = (user as any)?.role || 'CREATOR'
  const isCreator = userRole === 'CREATOR'
  const userName = (user as any)?.name || (userEmail.startsWith('427') ? 'Rohit Kumar' : userEmail.split('@')[0])
  const userInitials = userName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'RK'

  // Overview items: Hide Users tab completely for Creator, add Approvals queue for Admin!
  const overviewItems: NavItem[] = [
    {
      label: 'Dashboard',
      href: isCreator ? '/dashboard' : '/admin',
      isActive: isCreator ? pathname === '/dashboard' : (pathname === '/admin' || pathname === '/admin/dashboard'),
      icon: (
        <svg className="cn-nav-icon" viewBox="0 0 24 24">
          <rect width="7" height="9" x="3" y="3" rx="1"></rect>
          <rect width="7" height="5" x="14" y="3" rx="1"></rect>
          <rect width="7" height="9" x="14" y="12" rx="1"></rect>
          <rect width="7" height="5" x="3" y="16" rx="1"></rect>
        </svg>
      ),
    },
    ...(!isCreator
      ? [
          {
            label: 'Approvals Queue',
            href: '/admin',
            count: '3',
            isActive: pathname === '/admin',
            icon: (
              <svg className="cn-nav-icon" viewBox="0 0 24 24" style={{ color: '#F4B860' }}>
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            ),
          },
          {
            label: 'Users Directory',
            href: '/admin/collections/users',
            isActive: pathname.startsWith('/admin/collections/users'),
            icon: (
              <svg className="cn-nav-icon" viewBox="0 0 24 24">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            ),
          },
        ]
      : []),
    {
      label: isCreator ? 'My Uploads / Media' : 'All Media Files',
      href: '/admin/collections/media',
      isActive: pathname.startsWith('/admin/collections/media'),
      icon: (
        <svg className="cn-nav-icon" viewBox="0 0 24 24">
          <rect width="18" height="18" x="3" y="3" rx="2"></rect>
          <circle cx="9" cy="9" r="2"></circle>
          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
        </svg>
      ),
    },
  ]

  // Navigation Items Definition matching role (Admin vs Creator)
  const navGroups: NavGroup[] = [
    {
      title: 'Overview',
      items: overviewItems,
    },
    {
      title: isCreator ? 'Creative Studio' : 'AI Assets Moderation',
      items: isCreator
        ? [
            {
              label: 'Image Prompts',
              href: '/dashboard/image-prompts',
              count: '24',
              isActive: pathname.startsWith('/dashboard/image-prompts'),
              icon: (
                <svg className="cn-nav-icon" viewBox="0 0 24 24" style={{ color: '#C084FC' }}>
                  <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path>
                </svg>
              ),
            },
            {
              label: 'Video Prompts',
              href: '/dashboard/video-prompts',
              count: '12',
              isActive: pathname.startsWith('/dashboard/video-prompts'),
              icon: (
                <svg className="cn-nav-icon" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#38BDF8' }}>
                  <polygon points="6 3 20 12 6 21 6 3"></polygon>
                </svg>
              ),
            },
          ]
        : [
            {
              label: 'All AI Assets',
              href: '/admin/collections/ai-assets',
              count: '6',
              isActive: pathname.startsWith('/admin/collections/ai-assets'),
              icon: (
                <svg className="cn-nav-icon" viewBox="0 0 24 24" style={{ color: '#6C8CFF' }}>
                  <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                  <rect width="8" height="8" x="8" y="8" rx="1"></rect>
                </svg>
              ),
            },
            {
              label: 'Context Packs',
              href: '/admin/collections/ai-assets',
              count: '1',
              isActive: false,
              icon: (
                <svg className="cn-nav-icon" viewBox="0 0 24 24" style={{ color: '#38BDF8' }}>
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                </svg>
              ),
            },
            {
              label: 'Prompts & Workflows',
              href: '/admin/collections/ai-assets',
              count: '5',
              isActive: false,
              icon: (
                <svg className="cn-nav-icon" viewBox="0 0 24 24" style={{ color: '#C084FC' }}>
                  <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path>
                </svg>
              ),
            },
          ],
    },
    ...(isCreator
      ? [
          {
            title: 'Developer',
            items: [
              {
                label: 'Context Packs',
                href: '/admin/collections/ai-assets',
                count: '8',
                isActive: false,
                icon: (
                  <svg className="cn-nav-icon" viewBox="0 0 24 24" style={{ color: '#6C8CFF' }}>
                    <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                    <rect width="8" height="8" x="8" y="8" rx="1"></rect>
                  </svg>
                ),
              },
              {
                label: 'Prompts',
                href: '/admin/collections/ai-assets',
                count: '16',
                isActive: false,
                icon: (
                  <svg className="cn-nav-icon" viewBox="0 0 24 24">
                    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path>
                  </svg>
                ),
              },
              {
                label: 'Workflows',
                href: '/admin/collections/ai-assets',
                count: '5',
                isActive: false,
                icon: (
                  <svg className="cn-nav-icon" viewBox="0 0 24 24">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                  </svg>
                ),
              },
            ],
          },
        ]
      : []),
    {
      title: 'Taxonomy',
      items: [
        {
          label: 'Categories',
          href: '/admin/collections/categories',
          isActive: pathname.startsWith('/admin/collections/categories'),
          icon: (
            <svg className="cn-nav-icon" viewBox="0 0 24 24">
              <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"></path>
            </svg>
          ),
        },
        {
          label: 'Tags',
          href: '/admin/collections/tags',
          isActive: pathname.startsWith('/admin/collections/tags'),
          icon: (
            <svg className="cn-nav-icon" viewBox="0 0 24 24">
              <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"></path>
              <path d="M7 7h.01"></path>
            </svg>
          ),
        },
      ],
    },
  ]

  return (
    <aside className={`cn-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Sidebar Header: Logo, Brand Text, Toggle */}
      <div className="cn-sidebar-header">
        <Link
          href={isCreator ? '/dashboard' : '/admin'}
          className="cn-sidebar-brand"
          title={isCreator ? 'ContextNode Creator OS' : 'ContextNode Admin OS'}
        >
          <img
            src="/contextnode-logo.png"
            alt="ContextNode"
            className="cn-sidebar-logo-img"
          />
          {!isCollapsed && (
            <div className="cn-sidebar-brand-text">
              <span className="cn-sidebar-brand-name">ContextNode</span>
              <span className="cn-sidebar-brand-badge">{isCreator ? 'CREATOR OS' : 'ADMIN OS'}</span>
            </div>
          )}
        </Link>
        <button
          type="button"
          className="cn-sidebar-toggle-btn"
          onClick={toggleSidebar}
          aria-label={isCollapsed ? 'Expand Navigation' : 'Collapse Navigation'}
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          <svg
            className="cn-nav-icon"
            viewBox="0 0 24 24"
            style={{
              transform: isCollapsed ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.2s ease',
            }}
          >
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
      </div>

      {/* Scrollable Navigation Groups */}
      <nav className="cn-sidebar-nav">
        {navGroups.map((group, groupIdx) => (
          <div key={groupIdx} className="cn-nav-group">
            {!isCollapsed && <div className="cn-nav-group-title">{group.title}</div>}
            {group.items.map((item, itemIdx) => (
              <Link
                key={itemIdx}
                href={item.href}
                className={`cn-nav-item ${item.isActive ? 'active' : ''}`}
                title={isCollapsed ? item.label : undefined}
              >
                <div className="cn-nav-item-content">
                  {item.icon}
                  {!isCollapsed && <span>{item.label}</span>}
                </div>
                {!isCollapsed && item.count && (
                  <span className="cn-nav-item-count">{item.count}</span>
                )}
              </Link>
            ))}
          </div>
        ))}
      </nav>

      {/* Sidebar Footer: Profile Card & Logout */}
      <div className="cn-sidebar-footer">
        <Link href="/admin/account" className="cn-admin-profile-card" title="View Account Profile">
          <div className="cn-admin-avatar">
            <div className="cn-admin-avatar-inner">{userInitials}</div>
          </div>
          {!isCollapsed && (
            <>
              <div className="cn-admin-info">
                <span className="cn-admin-name">{userName}</span>
                <span className="cn-admin-role">{isCreator ? 'Verified Creator' : 'Super Administrator'}</span>
              </div>
              <svg className="cn-nav-icon cn-nav-icon-xs" viewBox="0 0 24 24" style={{ color: 'var(--text-muted)' }}>
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </>
          )}
        </Link>

        <Link href="/login" className="cn-logout-btn-link" title="Sign Out">
          <svg className="cn-nav-icon" viewBox="0 0 24 24">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          {!isCollapsed && <span>Sign Out</span>}
        </Link>
      </div>
    </aside>
  )
}

export default SidebarNav
