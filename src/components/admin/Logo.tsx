import React from 'react'

export const Logo: React.FC = () => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <img
        src="/contextnode-logo.png"
        alt="ContextNode"
        width={38}
        height={38}
        style={{
          borderRadius: '8px',
          objectFit: 'contain',
          filter: 'drop-shadow(0 0 12px rgba(108, 140, 255, 0.45))',
        }}
      />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span
          style={{
            fontSize: '1.1rem',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: '#FFFFFF',
            lineHeight: 1.2,
          }}
        >
          ContextNode
        </span>
        <span
          style={{
            fontSize: '0.65rem',
            fontWeight: 600,
            letterSpacing: '0.08em',
            color: '#6C8CFF',
            textTransform: 'uppercase',
          }}
        >
          Admin OS
        </span>
      </div>
    </div>
  )
}

export default Logo
