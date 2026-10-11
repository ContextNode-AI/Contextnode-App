import React from 'react'

export const Icon: React.FC = () => {
  return (
    <img
      src="/contextnode-logo.png"
      alt="ContextNode Icon"
      width={28}
      height={28}
      style={{
        borderRadius: '6px',
        objectFit: 'contain',
        filter: 'drop-shadow(0 0 8px rgba(108, 140, 255, 0.4))',
        display: 'inline-block',
        verticalAlign: 'middle',
      }}
    />
  )
}

export default Icon
