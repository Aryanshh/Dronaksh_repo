import React, { useState, useEffect } from 'react';
import { Plane, Cpu } from 'lucide-react';
import { NeumorphicProgressBar } from './NeumorphicProgressBar';

export function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState([]);

  const bootLogs = [
    '[BOOT] Initializing digital neural core...',
    '[BOOT] Checking peripheral drone connection points...',
    '[BOOT] Setting up high-gain antenna transceivers...',
    '[BOOT] Resolving 24 GPS satellite positions...',
    '[BOOT] Allocating telemetry buffer partitions...',
    '[BOOT] Interface systems ready. Secure handshake established.'
  ];

  useEffect(() => {
    let logIndex = 0;
    const logInterval = setInterval(() => {
      if (logIndex < bootLogs.length) {
        setLogs(prev => [...prev, bootLogs[logIndex]]);
        logIndex++;
      }
    }, 400);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          clearInterval(logInterval);
          setTimeout(() => {
            onComplete();
          }, 400);
          return 100;
        }
        return prev + 1;
      });
    }, 25);

    return () => {
      clearInterval(logInterval);
      clearInterval(progressInterval);
    };
  }, [onComplete]);

  return (
    <div style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-color)', zIndex: 9999, overflow: 'hidden' }}>
      
      {/* Dynamic Keyframes Injector */}
      <style>{`
        @keyframes radar-sweep {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes plane-pulse {
          0%, 100% { transform: scale(1); filter: drop-shadow(0 0 4px var(--accent-primary)); }
          50% { transform: scale(1.12); filter: drop-shadow(0 0 12px var(--accent-primary)); }
        }
        .radar-scan-line {
          position: absolute;
          width: 50%;
          height: 50%;
          top: 0;
          left: 50%;
          background: linear-gradient(90deg, var(--accent-primary) 0%, transparent 60%);
          transform-origin: 0% 100%;
          animation: radar-sweep 3s linear infinite;
          border-left: 2px solid var(--accent-primary);
          opacity: 0.45;
          pointer-events: none;
        }
        .radar-pulse-ring {
          position: absolute;
          border: 1px solid rgba(99, 102, 241, 0.15);
          border-radius: 50%;
          pointer-events: none;
        }
      `}</style>

      {/* Main Loading Panel Card */}
      <div 
        className="nm-flat" 
        style={{ 
          width: '90%', 
          maxWidth: '480px', 
          padding: '40px 32px', 
          borderRadius: '28px', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          gap: '28px',
          boxShadow: '-8px -8px 24px var(--highlight-color), 8px 8px 24px var(--shadow-color)'
        }}
      >
        
        {/* Neumorphic Radar Container */}
        <div 
          className="nm-inset" 
          style={{ 
            width: '180px', 
            height: '180px', 
            borderRadius: '50%', 
            position: 'relative', 
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'inset -4px -4px 10px var(--highlight-color), inset 4px 4px 10px var(--shadow-color)',
            background: 'var(--bg-color)'
          }}
        >
          {/* Radar scan line */}
          <div className="radar-scan-line" />

          {/* Radar target rings */}
          <div className="radar-pulse-ring" style={{ width: '130px', height: '130px' }} />
          <div className="radar-pulse-ring" style={{ width: '80px', height: '80px' }} />
          <div className="radar-pulse-ring" style={{ width: '30px', height: '30px' }} />
          
          {/* Crosshair lines */}
          <div style={{ position: 'absolute', width: '100%', height: '1px', background: 'rgba(99,102,241,0.06)' }} />
          <div style={{ position: 'absolute', height: '100%', width: '1px', background: 'rgba(99,102,241,0.06)' }} />

          {/* Central Pulsing Icon */}
          <div style={{ animation: 'plane-pulse 2s infinite ease-in-out', zIndex: 10 }}>
            <Plane size={44} color="var(--accent-primary)" />
          </div>
        </div>

        {/* Text Headers */}
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', fontFamily: "'General Sans', sans-serif", letterSpacing: '0.1em', margin: 0, fontWeight: 700 }}>
            SYSTEM COMMAND COCKPIT
          </h2>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.2em', textTransform: 'uppercase', margin: '6px 0 0 0', fontWeight: 600 }}>
            Boot Initialization Sequence
          </p>
        </div>

        {/* Progress bar */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)' }}>
            <span>Establishing core link</span>
            <span>{progress}%</span>
          </div>
          <NeumorphicProgressBar value={progress} max={100} colorStart="var(--accent-primary)" colorEnd="var(--accent-secondary)" />
        </div>

        {/* Typing logs */}
        <div 
          className="nm-inset" 
          style={{ 
            width: '100%', 
            height: '110px', 
            background: '#090a10', 
            borderRadius: '12px', 
            padding: '12px 16px', 
            fontFamily: 'monospace', 
            fontSize: '10px', 
            color: 'var(--text-secondary)',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            overflowY: 'auto',
            boxShadow: 'inset -2px -2px 5px var(--highlight-color), inset 2px 2px 5px var(--shadow-color)'
          }}
        >
          {logs.map((log, idx) => (
            <div key={idx} style={{ color: idx === bootLogs.length - 1 ? 'var(--status-success)' : 'var(--text-muted)' }}>
              {log}
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}
