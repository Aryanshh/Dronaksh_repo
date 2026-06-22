import React, { useEffect, useState } from 'react';

export function TerminalWidget({ logs = [], title = "OPERATIONS CONSOLE" }) {
  const [visibleLogs, setVisibleLogs] = useState([]);

  useEffect(() => {
    // When logs change, reset and stagger their entry
    setVisibleLogs([]);
    const timers = [];
    logs.forEach((log, index) => {
      const timer = setTimeout(() => {
        setVisibleLogs((prev) => [...prev, log]);
      }, index * 200); // 200ms stagger
      timers.push(timer);
    });

    return () => timers.forEach(clearTimeout);
  }, [logs]);

  return (
    <div 
      className="nm-inset" 
      style={{ 
        borderRadius: '16px', 
        padding: '20px', 
        fontFamily: 'monospace', 
        fontSize: '11px',
        color: 'var(--text-primary)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        height: '100%',
        minHeight: '220px',
        overflow: 'hidden'
      }}
    >
      {/* Terminal Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '10px' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }} />
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }} />
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
        </div>
        <div style={{ color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.1em' }}>{title}</div>
        <div style={{ width: '36px' }} />
      </div>

      {/* Terminal Body */}
      <div 
        style={{ 
          flex: 1, 
          overflowY: 'auto', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '8px',
          paddingRight: '4px'
        }}
      >
        {visibleLogs.map((log, idx) => {
          let logColor = 'var(--text-secondary)';
          if (log.type === 'critical') logColor = 'var(--status-danger)';
          else if (log.type === 'warning') logColor = 'var(--status-warning)';
          else if (log.type === 'success' || log.type === 'info') logColor = 'var(--status-success)';

          const isLast = idx === visibleLogs.length - 1;

          return (
            <div 
              key={log.id || idx} 
              className={isLast ? "cursor-blink" : ""}
              style={{ 
                display: 'flex', 
                gap: '8px',
                transform: 'translateX(0)',
                animation: 'terminalLineIn 0.3s ease-out forwards',
                opacity: 0,
                color: logColor
              }}
            >
              <span style={{ color: 'var(--text-muted)' }}>[{log.time || '00:00'}]</span>
              <span>
                <strong style={{ color: 'var(--text-primary)' }}>{log.droneId}:</strong> {log.text}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
