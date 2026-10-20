'use client'

import React, { useState } from 'react'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('427rohitkumar@gmail.com')
  const [password, setPassword] = useState('427rohit@')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!email || !password) {
      setError('Please provide both email and password.')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok || !data.user) {
        throw new Error(data.errors?.[0]?.message || 'Invalid email or password.')
      }

      const role = data.user.role || 'CREATOR'
      setSuccess(`Session established (${role})! Redirecting...`)

      setTimeout(() => {
        if (role === 'ADMIN') {
          window.location.href = '/admin'
        } else if (role === 'CREATOR') {
          window.location.href = '/dashboard'
        } else {
          window.location.href = '/'
        }
      }, 500)
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify credentials.')
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        backgroundColor: '#050505',
        backgroundImage: `
          radial-gradient(ellipse 70% 50% at 50% -15%, rgba(108, 140, 255, 0.15), transparent 70%),
          radial-gradient(circle at 85% 85%, rgba(230, 106, 115, 0.06), transparent 40%),
          radial-gradient(circle at 15% 90%, rgba(168, 85, 247, 0.06), transparent 40%)
        `,
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* Top Border Accent Line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(108, 140, 255, 0.6), transparent)',
        }}
      />

      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          zIndex: 10,
        }}
      >
        {/* Brand Logo & Header */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #181822 0%, #101015 100%)',
              border: '1px solid rgba(108, 140, 255, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 30px rgba(108, 140, 255, 0.3)',
              marginBottom: '16px',
            }}
          >
            <img
              src="/contextnode-logo.png"
              alt="ContextNode"
              style={{ width: '42px', height: '42px', objectFit: 'contain', borderRadius: '8px' }}
            />
          </div>
          <h1
            style={{
              fontSize: '1.75rem',
              fontWeight: 700,
              letterSpacing: '-0.025em',
              color: '#F5F5F7',
              margin: '0 0 6px 0',
            }}
          >
            Welcome back
          </h1>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#A5A5AF' }}>
            Universal Sign In &bull; Admin, Creator & User Console
          </p>
        </div>

        {/* Auth Card */}
        <div
          style={{
            background: '#101014',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(108, 140, 255, 0.08)',
            position: 'relative',
          }}
        >
          {error && (
            <div
              style={{
                background: 'rgba(230, 106, 115, 0.12)',
                border: '1px solid rgba(230, 106, 115, 0.3)',
                color: '#E66A73',
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                marginBottom: '18px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div
              style={{
                background: 'rgba(79, 209, 139, 0.12)',
                border: '1px solid rgba(79, 209, 139, 0.3)',
                color: '#4FD18B',
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                marginBottom: '18px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span>✓</span>
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Email Field */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label
                htmlFor="loginEmail"
                style={{ fontSize: '0.8125rem', fontWeight: 500, color: '#F5F5F7' }}
              >
                Email Address
              </label>
              <input
                id="loginEmail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@contextnode.com"
                required
                style={{
                  width: '100%',
                  height: '42px',
                  background: '#0B0B0F',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '8px',
                  padding: '0 14px',
                  fontSize: '0.875rem',
                  color: '#F5F5F7',
                  outline: 'none',
                  transition: 'border-color 0.15s ease',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Password Field */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label
                  htmlFor="loginPassword"
                  style={{ fontSize: '0.8125rem', fontWeight: 500, color: '#F5F5F7' }}
                >
                  Password
                </label>
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault()
                    alert('Password reset link has been dispatched to your email address.')
                  }}
                  style={{ fontSize: '0.75rem', color: '#6C8CFF', textDecoration: 'none' }}
                >
                  Forgot password?
                </a>
              </div>
              <div style={{ position: 'relative', width: '100%' }}>
                <input
                  id="loginPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  style={{
                    width: '100%',
                    height: '42px',
                    background: '#0B0B0F',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '8px',
                    padding: '0 40px 0 14px',
                    fontSize: '0.875rem',
                    color: '#F5F5F7',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    color: '#6C6C78',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 0,
                  }}
                >
                  {showPassword ? (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.8125rem',
                color: '#A5A5AF',
                cursor: 'pointer',
                userSelect: 'none',
                marginTop: '4px',
              }}
            >
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ accentColor: '#6C8CFF', cursor: 'pointer' }}
              />
              <span>Keep me signed in for 30 days</span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                height: '44px',
                marginTop: '8px',
                background: '#6C8CFF',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 0 16px rgba(108, 140, 255, 0.35)',
                opacity: loading ? 0.7 : 1,
                transition: 'all 0.15s ease',
              }}
            >
              {loading ? (
                <>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    style={{ animation: 'spin 1s linear infinite' }}
                  >
                    <line x1="12" y1="2" x2="12" y2="6"></line>
                    <line x1="12" y1="18" x2="12" y2="22"></line>
                    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                    <line x1="2" y1="12" x2="6" y2="12"></line>
                    <line x1="18" y1="12" x2="22" y2="12"></line>
                    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                    <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                  </svg>
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                    <polyline points="10 17 15 12 10 7"></polyline>
                    <line x1="15" y1="12" x2="3" y2="12"></line>
                  </svg>
                  <span>Sign In to Console</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Account Switcher Chips */}
          <div
            style={{
              marginTop: '20px',
              paddingTop: '16px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <div style={{ fontSize: '0.72rem', color: '#6C6C78', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Quick Credentials Autofill:
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => {
                  setEmail('427rohitkumar@gmail.com')
                  setPassword('427rohit@')
                }}
                style={{
                  background: 'rgba(108, 140, 255, 0.1)',
                  border: '1px solid rgba(108, 140, 255, 0.25)',
                  color: '#6C8CFF',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  fontWeight: 500,
                }}
              >
                Admin (Rohit)
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('creator@contextnode.ai')
                  setPassword('CreatorPass2026!')
                }}
                style={{
                  background: 'rgba(56, 189, 248, 0.1)',
                  border: '1px solid rgba(56, 189, 248, 0.25)',
                  color: '#38BDF8',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  fontWeight: 500,
                }}
              >
                Creator (Elena)
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('rohit@example.com')
                  setPassword('UserPass2026!')
                }}
                style={{
                  background: 'rgba(168, 85, 247, 0.1)',
                  border: '1px solid rgba(168, 85, 247, 0.25)',
                  color: '#C084FC',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  fontWeight: 500,
                }}
              >
                User (Customer)
              </button>
            </div>
          </div>

          {/* Security & System Info */}
          <div
            style={{
              marginTop: '16px',
              paddingTop: '14px',
              borderTop: '1px solid rgba(255, 255, 255, 0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.72rem',
              color: '#6C6C78',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#4FD18B',
                  display: 'inline-block',
                }}
              />
              System: Production (v2.4)
            </span>
            <span>256-bit TLS Encrypted</span>
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', fontSize: '0.78rem', color: '#6C6C78' }}>
          <p style={{ margin: 0 }}>
            ContextNode AI Operating System &bull;{' '}
            <Link href="/dashboard" style={{ color: '#6C8CFF', textDecoration: 'none' }}>
              Console Dashboard &rarr;
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
