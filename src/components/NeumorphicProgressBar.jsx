import React from 'react';

export function NeumorphicProgressBar({ value, max = 100, colorStart = '#6366f1', colorEnd = '#a78bfa', glow = true }) {
  const percentage = Math.max(0, Math.min(100, (value / max) * 100));

  return (
    <div 
      className="nm-inset" 
      style={{ 
        height: '12px', 
        borderRadius: '999px', 
        width: '100%', 
        position: 'relative', 
        overflow: 'hidden',
        padding: '1px'
      }}
    >
      <div 
        style={{
          height: '100%',
          width: `${percentage}%`,
          borderRadius: '999px',
          background: `linear-gradient(90deg, ${colorStart}, ${colorEnd})`,
          transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'hidden',
          color: colorEnd,
          boxShadow: glow ? `0 0 8px ${colorStart}aa` : 'none',
          animation: glow ? 'glowPulse 2s infinite ease-in-out' : 'none'
        }}
      >
        {/* Shimmer overlay */}
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            width: '200%',
            background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0) 100%)',
            animation: 'waveShimmer 2s infinite linear',
          }}
        />
      </div>
    </div>
  );
}
