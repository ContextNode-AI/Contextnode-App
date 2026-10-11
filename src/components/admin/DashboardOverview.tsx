'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useAuth } from '@payloadcms/ui'

import { AdminDashboardView } from './AdminDashboardView'

interface Dataset {
  label: string
  color: string
  fillColorStart?: string
  fillColorEnd?: string
  data: number[]
}

interface TooltipState {
  visible: boolean
  x: number
  y: number
  title: string
  value: string
  color?: string
}

export const DashboardOverview: React.FC = () => {
  let contextUser: any = null
  try {
    const auth = useAuth()
    contextUser = auth?.user
  } catch {
    contextUser = null
  }
  const [currentUser, setCurrentUser] = useState<any>(contextUser)

  useEffect(() => {
    fetch('/api/users/me')
      .then((res) => res.json())
      .then((data) => {
        if (data?.user) {
          setCurrentUser(data.user)
        }
      })
      .catch(() => {})
  }, [])

  const user = currentUser || contextUser
  const userEmail = user?.email || ''
  const userRole = (user as any)?.role || (userEmail.startsWith('427') || userEmail.includes('admin') ? 'ADMIN' : 'CREATOR')
  const isAdmin = userRole === 'ADMIN'
  const isCreator = userRole === 'CREATOR'

  if (isAdmin) {
    return <AdminDashboardView />
  }

  const [dateRange, setDateRange] = useState<'30' | '7' | '90' | 'year'>('30')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    x: 0,
    y: 0,
    title: '',
    value: '',
  })

  const assetGrowthCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const revenueCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const userGrowthCanvasRef = useRef<HTMLCanvasElement | null>(null)

  // Dynamic metrics and chart data based on dateRange
  const getChartData = () => {
    switch (dateRange) {
      case '7':
        return {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          assetGrowth: [
            {
              label: 'Total Assets',
              color: '#6C8CFF',
              fillColorStart: 'rgba(108, 140, 255, 0.22)',
              fillColorEnd: 'rgba(108, 140, 255, 0.0)',
              data: [120, 122, 123, 125, 126, 127, 128],
            },
            {
              label: 'Published Assets',
              color: '#4FD18B',
              fillColorStart: 'rgba(79, 209, 139, 0.18)',
              fillColorEnd: 'rgba(79, 209, 139, 0.0)',
              data: [88, 89, 90, 91, 92, 93, 94],
            },
          ],
          revenue: [6200, 7100, 6900, 8400, 9200, 11400, 12150],
          userGrowth: [
            {
              label: 'Active Users',
              color: '#C084FC',
              fillColorStart: 'rgba(192, 132, 252, 0.25)',
              fillColorEnd: 'rgba(192, 132, 252, 0.0)',
              data: [210, 280, 340, 410, 490, 560, 640],
            },
          ],
          metrics: {
            creative: { value: '36', trend: '+4%', note: 'Across Image & Video' },
            image: { value: '24', trend: '+3%', note: 'Midjourney, Flux, SDXL' },
            video: { value: '12', trend: '+5%', note: 'Veo 2, Runway, Sora' },
            views: { value: '42.8k', trend: '+14%', note: 'vs last week (37.5k)' },
            userGrowthBadge: '+640',
            revenueBadge: '+22.1% WoW',
          },
        }
      case '90':
        return {
          labels: ['Aug', 'Sep', 'Oct'],
          assetGrowth: [
            {
              label: 'Total Assets',
              color: '#6C8CFF',
              fillColorStart: 'rgba(108, 140, 255, 0.22)',
              fillColorEnd: 'rgba(108, 140, 255, 0.0)',
              data: [92, 114, 128],
            },
            {
              label: 'Published Assets',
              color: '#4FD18B',
              fillColorStart: 'rgba(79, 209, 139, 0.18)',
              fillColorEnd: 'rgba(79, 209, 139, 0.0)',
              data: [70, 85, 94],
            },
          ],
          revenue: [38900, 42100, 48350],
          userGrowth: [
            {
              label: 'Active Users',
              color: '#C084FC',
              fillColorStart: 'rgba(192, 132, 252, 0.25)',
              fillColorEnd: 'rgba(192, 132, 252, 0.0)',
              data: [10700, 12600, 14820],
            },
          ],
          metrics: {
            creative: { value: '36', trend: '+35%', note: 'Across Image & Video' },
            image: { value: '24', trend: '+28%', note: 'Midjourney, Flux, SDXL' },
            video: { value: '12', trend: '+44%', note: 'Veo 2, Runway, Sora' },
            views: { value: '312.4k', trend: '+39%', note: 'vs prior 90 days' },
            userGrowthBadge: '+4,120',
            revenueBadge: '+31.2% QoQ',
          },
        }
      case 'year':
        return {
          labels: ['Q1', 'Q2', 'Q3', 'Q4'],
          assetGrowth: [
            {
              label: 'Total Assets',
              color: '#6C8CFF',
              fillColorStart: 'rgba(108, 140, 255, 0.22)',
              fillColorEnd: 'rgba(108, 140, 255, 0.0)',
              data: [28, 55, 92, 128],
            },
            {
              label: 'Published Assets',
              color: '#4FD18B',
              fillColorStart: 'rgba(79, 209, 139, 0.18)',
              fillColorEnd: 'rgba(79, 209, 139, 0.0)',
              data: [18, 38, 70, 94],
            },
          ],
          revenue: [52000, 84000, 115000, 148350],
          userGrowth: [
            {
              label: 'Active Users',
              color: '#C084FC',
              fillColorStart: 'rgba(192, 132, 252, 0.25)',
              fillColorEnd: 'rgba(192, 132, 252, 0.0)',
              data: [2400, 6100, 10700, 14820],
            },
          ],
          metrics: {
            creative: { value: '36', trend: '+140%', note: 'Across Image & Video' },
            image: { value: '24', trend: '+110%', note: 'Midjourney, Flux, SDXL' },
            video: { value: '12', trend: '+190%', note: 'Veo 2, Runway, Sora' },
            views: { value: '582.1k', trend: '+165%', note: 'YTD Growth' },
            userGrowthBadge: '+12,420',
            revenueBadge: '+44.8% YoY',
          },
        }
      case '30':
      default:
        return {
          labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
          assetGrowth: [
            {
              label: 'Total Assets',
              color: '#6C8CFF',
              fillColorStart: 'rgba(108, 140, 255, 0.22)',
              fillColorEnd: 'rgba(108, 140, 255, 0.0)',
              data: [45, 62, 78, 92, 114, 128],
            },
            {
              label: 'Published Assets',
              color: '#4FD18B',
              fillColorStart: 'rgba(79, 209, 139, 0.18)',
              fillColorEnd: 'rgba(79, 209, 139, 0.0)',
              data: [32, 44, 58, 70, 85, 94],
            },
          ],
          revenue: [18400, 24600, 31200, 38900, 42100, 48350],
          userGrowth: [
            {
              label: 'Active Users',
              color: '#C084FC',
              fillColorStart: 'rgba(192, 132, 252, 0.25)',
              fillColorEnd: 'rgba(192, 132, 252, 0.0)',
              data: [4200, 6800, 8900, 10700, 12600, 14820],
            },
          ],
          metrics: {
            creative: { value: '36', trend: '+18%', note: 'Across Image & Video' },
            image: { value: '24', trend: '+12%', note: 'Midjourney, Flux, SDXL' },
            video: { value: '12', trend: '+25%', note: 'Veo 2, Runway, Sora' },
            views: { value: '184.2k', trend: '+28%', note: 'vs last month (143k)' },
            userGrowthBadge: '+2,840',
            revenueBadge: '+18.4% YoY',
          },
        }
    }
  }

  const currentData = getChartData()

  // Setup High-DPI canvas
  const setupCanvas = (canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    const ctx = canvas.getContext('2d')
    if (!ctx) return null
    ctx.scale(dpr, dpr)
    return { ctx, width: rect.width, height: rect.height }
  }

  // Draw Multi-Line Chart
  const drawLineChart = (
    canvas: HTMLCanvasElement,
    datasets: Dataset[],
    labels: string[],
    isSparkline = false,
  ) => {
    const canvasSetup = setupCanvas(canvas)
    if (!canvasSetup) return
    const { ctx, width, height } = canvasSetup

    const padding = isSparkline
      ? { top: 15, right: 15, bottom: 25, left: 35 }
      : { top: 25, right: 20, bottom: 35, left: 45 }
    const chartW = width - padding.left - padding.right
    const chartH = height - padding.top - padding.bottom

    let maxVal = 0
    datasets.forEach((ds) => {
      ds.data.forEach((val) => {
        if (val > maxVal) maxVal = val
      })
    })
    maxVal = Math.ceil((maxVal * 1.15) / 10) * 10 || 100

    // Draw horizontal grid lines
    const gridLines = isSparkline ? 3 : 4
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)'
    ctx.lineWidth = 1
    ctx.fillStyle = '#6C6C78'
    ctx.font = '10px Inter, sans-serif'
    ctx.textAlign = 'right'

    for (let i = 0; i <= gridLines; i++) {
      const y = padding.top + (chartH / gridLines) * i
      const value = Math.round(maxVal - (maxVal / gridLines) * i)

      ctx.beginPath()
      ctx.moveTo(padding.left, y)
      ctx.lineTo(width - padding.right, y)
      ctx.stroke()

      const formattedVal = value >= 1000 ? `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}k` : value.toString()
      ctx.fillText(formattedVal, padding.left - 8, y + 3)
    }

    // Draw X-axis labels
    ctx.textAlign = 'center'
    const stepX = chartW / (labels.length - 1)
    labels.forEach((label, i) => {
      const x = padding.left + i * stepX
      ctx.fillText(label, x, height - 10)
    })

    // Plot datasets
    const pointPositions: { x: number; y: number; val: number; label: string; name: string; color: string }[] = []

    datasets.forEach((ds) => {
      const coords = ds.data.map((val, idx) => ({
        x: padding.left + idx * stepX,
        y: padding.top + chartH - (val / maxVal) * chartH,
        val: val,
        label: labels[idx],
        name: ds.label,
        color: ds.color,
      }))

      pointPositions.push(...coords)

      // Gradient Fill
      const grad = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartH)
      grad.addColorStop(0, ds.fillColorStart || 'rgba(108, 140, 255, 0.25)')
      grad.addColorStop(1, ds.fillColorEnd || 'rgba(108, 140, 255, 0.0)')

      ctx.beginPath()
      ctx.moveTo(coords[0].x, padding.top + chartH)
      coords.forEach((pt) => ctx.lineTo(pt.x, pt.y))
      ctx.lineTo(coords[coords.length - 1].x, padding.top + chartH)
      ctx.closePath()
      ctx.fillStyle = grad
      ctx.fill()

      // Stroke Line
      ctx.beginPath()
      coords.forEach((pt, i) => {
        if (i === 0) ctx.moveTo(pt.x, pt.y)
        else ctx.lineTo(pt.x, pt.y)
      })
      ctx.strokeStyle = ds.color || '#6C8CFF'
      ctx.lineWidth = 2.5
      ctx.lineJoin = 'round'
      ctx.stroke()

      // Point circles
      coords.forEach((pt) => {
        ctx.beginPath()
        ctx.arc(pt.x, pt.y, 3.5, 0, Math.PI * 2)
        ctx.fillStyle = '#050505'
        ctx.fill()
        ctx.strokeStyle = ds.color || '#6C8CFF'
        ctx.lineWidth = 2
        ctx.stroke()
      })
    })

    // Tooltip event handling
    canvas.onmousemove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top

      let nearest: (typeof pointPositions)[0] | null = null
      let minDist = 25

      pointPositions.forEach((pt) => {
        const dist = Math.hypot(pt.x - mouseX, pt.y - mouseY)
        if (dist < minDist) {
          minDist = dist
          nearest = pt
        }
      })

      if (nearest) {
        setTooltip({
          visible: true,
          x: e.clientX,
          y: e.clientY,
          title: (nearest as any).label,
          value: `${(nearest as any).name}: ${(nearest as any).val.toLocaleString()}`,
          color: (nearest as any).color,
        })
      } else {
        setTooltip((prev) => ({ ...prev, visible: false }))
      }
    }

    canvas.onmouseleave = () => {
      setTooltip((prev) => ({ ...prev, visible: false }))
    }
  }

  // Draw Bar Chart
  const drawBarChart = (canvas: HTMLCanvasElement, data: number[], labels: string[]) => {
    const canvasSetup = setupCanvas(canvas)
    if (!canvasSetup) return
    const { ctx, width, height } = canvasSetup

    const padding = { top: 25, right: 20, bottom: 35, left: 55 }
    const chartW = width - padding.left - padding.right
    const chartH = height - padding.top - padding.bottom

    const maxVal = Math.ceil((Math.max(...data) * 1.2) / 1000) * 1000 || 50000

    // Draw horizontal grid lines
    const gridLines = 4
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)'
    ctx.lineWidth = 1
    ctx.fillStyle = '#6C6C78'
    ctx.font = '10px Inter, sans-serif'
    ctx.textAlign = 'right'

    for (let i = 0; i <= gridLines; i++) {
      const y = padding.top + (chartH / gridLines) * i
      const value = Math.round(maxVal - (maxVal / gridLines) * i)

      ctx.beginPath()
      ctx.moveTo(padding.left, y)
      ctx.lineTo(width - padding.right, y)
      ctx.stroke()

      ctx.fillText(`$${(value / 1000).toFixed(0)}k`, padding.left - 8, y + 3)
    }

    // Draw Bars
    const totalBars = labels.length
    const barSpacing = chartW / totalBars
    const barWidth = Math.min(barSpacing * 0.55, 36)
    const barsData: { x: number; y: number; w: number; h: number; val: number; label: string }[] = []

    labels.forEach((label, i) => {
      const val = data[i]
      const barH = (val / maxVal) * chartH
      const x = padding.left + i * barSpacing + (barSpacing - barWidth) / 2
      const y = padding.top + chartH - barH

      // Bar fill gradient
      const grad = ctx.createLinearGradient(0, y, 0, y + barH)
      grad.addColorStop(0, '#6C8CFF')
      grad.addColorStop(1, 'rgba(108, 140, 255, 0.3)')

      ctx.fillStyle = grad
      ctx.beginPath()
      const radius = 4
      ctx.moveTo(x, y + barH)
      ctx.lineTo(x, y + radius)
      ctx.quadraticCurveTo(x, y, x + radius, y)
      ctx.lineTo(x + barWidth - radius, y)
      ctx.quadraticCurveTo(x + barWidth, y, x + barWidth, y + radius)
      ctx.lineTo(x + barWidth, y + barH)
      ctx.closePath()
      ctx.fill()

      // Border stroke
      ctx.strokeStyle = 'rgba(108, 140, 255, 0.6)'
      ctx.lineWidth = 1
      ctx.stroke()

      barsData.push({ x, y, w: barWidth, h: barH, val, label })

      // X-axis label
      ctx.fillStyle = '#6C6C78'
      ctx.textAlign = 'center'
      ctx.fillText(label, x + barWidth / 2, height - 10)
    })

    // Bar hover tooltip
    canvas.onmousemove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top

      const hit = barsData.find(
        (b) => mouseX >= b.x && mouseX <= b.x + b.w && mouseY >= b.y && mouseY <= b.y + b.h,
      )

      if (hit) {
        setTooltip({
          visible: true,
          x: e.clientX,
          y: e.clientY,
          title: hit.label,
          value: `$${hit.val.toLocaleString()}`,
          color: '#4FD18B',
        })
      } else {
        setTooltip((prev) => ({ ...prev, visible: false }))
      }
    }

    canvas.onmouseleave = () => {
      setTooltip((prev) => ({ ...prev, visible: false }))
    }
  }

  // Render all canvases
  const renderAllCharts = () => {
    if (assetGrowthCanvasRef.current) {
      drawLineChart(assetGrowthCanvasRef.current, currentData.assetGrowth, currentData.labels)
    }
    if (revenueCanvasRef.current) {
      drawBarChart(revenueCanvasRef.current, currentData.revenue, currentData.labels)
    }
    if (userGrowthCanvasRef.current) {
      drawLineChart(userGrowthCanvasRef.current, currentData.userGrowth, currentData.labels, true)
    }
  }

  useEffect(() => {
    renderAllCharts()

    const handleResize = () => {
      renderAllCharts()
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [dateRange])

  // Handle Refresh
  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      renderAllCharts()
      setIsRefreshing(false)
    }, 400)
  }

  return (
    <div className="contextnode-dashboard-container">
      {/* Floating Tooltip */}
      {tooltip.visible && (
        <div
          className="cn-chart-tooltip"
          style={{
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
          }}
        >
          <span style={{ color: '#A5A5AF', marginRight: '6px' }}>{tooltip.title}:</span>
          <strong style={{ color: tooltip.color || '#FFFFFF' }}>{tooltip.value}</strong>
        </div>
      )}

      {/* Top Page Header */}
      <div className="cn-page-header">
        <div className="cn-page-title-group">
          <h1 className="cn-page-title">
            {isCreator ? 'Creator Studio' : 'Dashboard'}
            <span
              style={{
                fontSize: '0.65rem',
                fontWeight: 700,
                color: isCreator ? '#C084FC' : '#6C8CFF',
                background: isCreator ? 'rgba(192, 132, 252, 0.12)' : 'rgba(108, 140, 255, 0.12)',
                border: isCreator ? '1px solid rgba(192, 132, 252, 0.3)' : '1px solid rgba(108, 140, 255, 0.3)',
                padding: '2px 8px',
                borderRadius: '9999px',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}
            >
              {isCreator ? 'CREATOR OS' : 'ADMIN OS'}
            </span>
          </h1>
          <p className="cn-page-subtitle">
            {isCreator
              ? 'Overview of your creative prompts, assets performance, and creator earnings telemetry.'
              : 'Overview of your ContextNode Creative Prompts and platform generation telemetry.'}
          </p>
        </div>

        <div className="cn-page-actions">
          {/* Date Range Selector */}
          <select
            className="form-control"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as any)}
            style={{ width: 'auto', height: '36px', fontSize: 'var(--text-xs)', cursor: 'pointer' }}
          >
            <option value="30">Last 30 days</option>
            <option value="7">Last 7 days</option>
            <option value="90">Last 90 days</option>
            <option value="year">Year to Date</option>
          </select>

          {/* Refresh Button */}
          <button
            type="button"
            className="cn-btn cn-btn-secondary cn-btn-sm"
            onClick={handleRefresh}
            title="Refresh Metrics"
          >
            <svg
              className={`cn-icon cn-icon-sm ${isRefreshing ? 'animate-spin' : ''}`}
              viewBox="0 0 24 24"
              style={{ transition: 'transform 0.4s ease', transform: isRefreshing ? 'rotate(180deg)' : 'none' }}
            >
              <polyline points="23 4 23 10 17 10"></polyline>
              <polyline points="1 20 1 14 7 14"></polyline>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
            </svg>
            <span>Refresh</span>
          </button>

          {/* + Create Prompt Dropdown */}
          <div className="cn-dropdown">
            <button
              type="button"
              className="cn-btn cn-btn-primary cn-btn-sm"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
            >
              <svg className="cn-icon cn-icon-sm" viewBox="0 0 24 24">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              <span>+ Create Prompt</span>
              <svg className="cn-icon cn-icon-xs" viewBox="0 0 24 24">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>

            {isDropdownOpen && (
              <div
                className="cn-dropdown-menu"
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                <a
                  href="/dashboard/image-prompts/create"
                  className="cn-dropdown-item"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <svg className="cn-icon cn-icon-sm" viewBox="0 0 24 24" style={{ color: '#C084FC' }}>
                    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path>
                  </svg>
                  <span>Image Prompt</span>
                </a>
                <a
                  href="/admin/collections/ai-assets/create"
                  className="cn-dropdown-item"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <svg className="cn-icon cn-icon-sm" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#38BDF8' }}>
                    <polygon points="6 3 20 12 6 21 6 3"></polygon>
                  </svg>
                  <span>Video Prompt</span>
                </a>
                <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '4px 0' }} />
                <a
                  href="/admin/collections/ai-assets/create"
                  className="cn-dropdown-item"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <svg className="cn-icon cn-icon-sm" viewBox="0 0 24 24" style={{ color: '#6C8CFF' }}>
                    <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                    <rect width="8" height="8" x="8" y="8" rx="1"></rect>
                  </svg>
                  <span>Context Pack</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4 Core Metrics Grid */}
      <div className="cn-metrics-grid">
        {/* Metric 1: Creative Prompts */}
        <a href="/dashboard/image-prompts" className="cn-metric-card">
          <div className="cn-metric-header">
            <span className="cn-metric-label">{isCreator ? 'My Creative Prompts' : 'Creative Prompts'}</span>
            <div className="cn-metric-icon-wrap" style={{ color: 'var(--accent)' }}>
              <svg className="cn-icon cn-icon-sm" viewBox="0 0 24 24">
                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path>
              </svg>
            </div>
          </div>
          <div className="cn-metric-value-wrap">
            <span className="cn-metric-value">{currentData.metrics.creative.value}</span>
            <span className="cn-metric-trend up">
              <svg className="cn-icon cn-icon-sm" viewBox="0 0 24 24">
                <polyline points="18 15 12 9 6 15"></polyline>
              </svg>
              {currentData.metrics.creative.trend}
            </span>
          </div>
          <div className="cn-metric-comparison">{currentData.metrics.creative.note}</div>
        </a>

        {/* Metric 2: Image Prompts */}
        <a href="/dashboard/image-prompts" className="cn-metric-card">
          <div className="cn-metric-header">
            <span className="cn-metric-label">{isCreator ? 'My Image Prompts' : 'Image Prompts'}</span>
            <div className="cn-metric-icon-wrap" style={{ color: 'var(--purple)' }}>
              <svg className="cn-icon cn-icon-sm" viewBox="0 0 24 24">
                <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                <circle cx="9" cy="9" r="2"></circle>
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
              </svg>
            </div>
          </div>
          <div className="cn-metric-value-wrap">
            <span className="cn-metric-value">{currentData.metrics.image.value}</span>
            <span className="cn-metric-trend up">
              <svg className="cn-icon cn-icon-sm" viewBox="0 0 24 24">
                <polyline points="18 15 12 9 6 15"></polyline>
              </svg>
              {currentData.metrics.image.trend}
            </span>
          </div>
          <div className="cn-metric-comparison">{currentData.metrics.image.note}</div>
        </a>

        {/* Metric 3: Video Prompts */}
        <a href="/admin/collections/ai-assets" className="cn-metric-card">
          <div className="cn-metric-header">
            <span className="cn-metric-label">{isCreator ? 'My Video Prompts' : 'Video Prompts'}</span>
            <div className="cn-metric-icon-wrap" style={{ color: 'var(--info)' }}>
              <svg className="cn-icon cn-icon-sm" viewBox="0 0 24 24">
                <path d="m22 8-6 4 6 4V8Z"></path>
                <rect width="14" height="12" x="2" y="6" rx="2" ry="2"></rect>
              </svg>
            </div>
          </div>
          <div className="cn-metric-value-wrap">
            <span className="cn-metric-value">{currentData.metrics.video.value}</span>
            <span className="cn-metric-trend up">
              <svg className="cn-icon cn-icon-sm" viewBox="0 0 24 24">
                <polyline points="18 15 12 9 6 15"></polyline>
              </svg>
              {currentData.metrics.video.trend}
            </span>
          </div>
          <div className="cn-metric-comparison">{currentData.metrics.video.note}</div>
        </a>

        {/* Metric 4: Total Generations */}
        <div className="cn-metric-card">
          <div className="cn-metric-header">
            <span className="cn-metric-label">{isCreator ? 'My Views / Runs' : 'Prompt Views / Runs'}</span>
            <div className="cn-metric-icon-wrap" style={{ color: 'var(--success)' }}>
              <svg className="cn-icon cn-icon-sm" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 14 14"></polyline>
              </svg>
            </div>
          </div>
          <div className="cn-metric-value-wrap">
            <span className="cn-metric-value">{currentData.metrics.views.value}</span>
            <span className="cn-metric-trend up">
              <svg className="cn-icon cn-icon-sm" viewBox="0 0 24 24">
                <polyline points="18 15 12 9 6 15"></polyline>
              </svg>
              {currentData.metrics.views.trend}
            </span>
          </div>
          <div className="cn-metric-comparison">{currentData.metrics.views.note}</div>
        </div>
      </div>

      {/* Charts & Activity Grid (2-Columns) */}
      <div className="cn-dashboard-grid">
        {/* Left Column: Asset Growth & Revenue Charts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Asset Growth Line Chart */}
          <div className="cn-card cn-chart-card">
            <div className="cn-card-header">
              <div className="cn-card-title-group">
                <h3 className="cn-card-title">Asset Growth</h3>
                <p className="cn-card-subtitle">Trajectory of Total Assets versus Published production assets.</p>
              </div>
              <div className="cn-chart-legend">
                <div className="cn-chart-legend-item">
                  <span className="cn-chart-legend-dot" style={{ background: '#6C8CFF' }}></span>
                  <span>Total Assets</span>
                </div>
                <div className="cn-chart-legend-item">
                  <span className="cn-chart-legend-dot" style={{ background: '#4FD18B' }}></span>
                  <span>Published Assets</span>
                </div>
              </div>
            </div>
            <div className="cn-chart-container">
              <canvas ref={assetGrowthCanvasRef} className="cn-chart-canvas" />
            </div>
          </div>

          {/* Monthly Revenue Bar Chart */}
          <div className="cn-card cn-chart-card">
            <div className="cn-card-header">
              <div className="cn-card-title-group">
                <h3 className="cn-card-title">{isCreator ? 'Creator Royalties & Earnings' : 'Monthly Revenue'}</h3>
                <p className="cn-card-subtitle">{isCreator ? 'Gross volume & royalties generated by your published assets.' : 'Gross marketplace volume across all AI assets and subscriptions.'}</p>
              </div>
              <span className="cn-badge cn-badge-published">
                <span className="cn-badge-dot"></span> {currentData.metrics.revenueBadge}
              </span>
            </div>
            <div className="cn-chart-container">
              <canvas ref={revenueCanvasRef} className="cn-chart-canvas" />
            </div>
          </div>
        </div>

        {/* Right Column: User Growth Chart & Recent Activity Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* User Growth Sparkline Card */}
          <div className="cn-card cn-chart-card">
            <div className="cn-card-header">
              <div className="cn-card-title-group">
                <h3 className="cn-card-title">{isCreator ? 'Audience & Prompt Saves' : 'User Growth'}</h3>
                <p className="cn-card-subtitle">{isCreator ? 'Followers and saves on your published prompts.' : 'New creator and engineer registrations.'}</p>
              </div>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--accent)' }}>
                {currentData.metrics.userGrowthBadge}
              </span>
            </div>
            <div className="cn-chart-container" style={{ height: '170px' }}>
              <canvas ref={userGrowthCanvasRef} className="cn-chart-canvas" />
            </div>
          </div>

          {/* Recent Activity Panel */}
          <div className="cn-card">
            <div className="cn-card-header">
              <div className="cn-card-title-group">
                <h3 className="cn-card-title">{isCreator ? 'My Creator Activity' : 'Recent Activity'}</h3>
              </div>
            </div>

            <div className="cn-activity-feed">
              {/* Activity 1 */}
              <div className="cn-activity-item">
                <div className="cn-activity-icon-wrap" style={{ background: 'rgba(108,140,255,0.12)', color: '#6C8CFF' }}>
                  <svg className="cn-icon cn-icon-sm" viewBox="0 0 24 24">
                    <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                    <polyline points="2 17 12 22 22 17"></polyline>
                    <polyline points="2 12 12 17 22 12"></polyline>
                  </svg>
                </div>
                <div className="cn-activity-content">
                  <span className="cn-activity-text">New Context Pack published</span>
                  <div className="cn-activity-meta">
                    <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Alex Vance</span>
                    <span>&bull;</span>
                    <span>Next.js SaaS Context Pack</span>
                    <span>&bull;</span>
                    <span>12 mins ago</span>
                  </div>
                </div>
              </div>

              {/* Activity 2 */}
              <div className="cn-activity-item">
                <div className="cn-activity-icon-wrap" style={{ background: 'rgba(79,209,139,0.12)', color: '#4FD18B' }}>
                  <svg className="cn-icon cn-icon-sm" viewBox="0 0 24 24">
                    <path d="M12 20h9"></path>
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                  </svg>
                </div>
                <div className="cn-activity-content">
                  <span className="cn-activity-text">Asset updated</span>
                  <div className="cn-activity-meta">
                    <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Elena Rostova</span>
                    <span>&bull;</span>
                    <span>DeepSeek R1 Prompt</span>
                    <span>&bull;</span>
                    <span>45 mins ago</span>
                  </div>
                </div>
              </div>

              {/* Activity 3 */}
              <div className="cn-activity-item">
                <div className="cn-activity-icon-wrap" style={{ background: 'rgba(168,85,247,0.12)', color: '#C084FC' }}>
                  <svg className="cn-icon cn-icon-sm" viewBox="0 0 24 24">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                  </svg>
                </div>
                <div className="cn-activity-content">
                  <span className="cn-activity-text">New user registered</span>
                  <div className="cn-activity-meta">
                    <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>david.k@ai-labs.co</span>
                    <span>&bull;</span>
                    <span>San Francisco</span>
                    <span>&bull;</span>
                    <span>1 hour ago</span>
                  </div>
                </div>
              </div>

              {/* Activity 4 */}
              <div className="cn-activity-item">
                <div className="cn-activity-icon-wrap" style={{ background: 'rgba(244,184,96,0.12)', color: '#F4B860' }}>
                  <svg className="cn-icon cn-icon-sm" viewBox="0 0 24 24">
                    <circle cx="8" cy="21" r="1"></circle>
                    <circle cx="19" cy="21" r="1"></circle>
                    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
                  </svg>
                </div>
                <div className="cn-activity-content">
                  <span className="cn-activity-text">Purchase completed</span>
                  <div className="cn-activity-meta">
                    <span style={{ color: 'var(--success)', fontWeight: 600 }}>+$99.00</span>
                    <span>&bull;</span>
                    <span>Enterprise DevKit</span>
                    <span>&bull;</span>
                    <span>2 hours ago</span>
                  </div>
                </div>
              </div>

              {/* Activity 5 */}
              <div className="cn-activity-item">
                <div className="cn-activity-icon-wrap" style={{ background: 'rgba(56,189,248,0.12)', color: '#38BDF8' }}>
                  <svg className="cn-icon cn-icon-sm" viewBox="0 0 24 24">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                  </svg>
                </div>
                <div className="cn-activity-content">
                  <span className="cn-activity-text">Workflow published</span>
                  <div className="cn-activity-meta">
                    <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Marcus Sterling</span>
                    <span>&bull;</span>
                    <span>Auto Code Review</span>
                    <span>&bull;</span>
                    <span>3 hours ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardOverview
