import React from 'react';
import { Camera, AlertTriangle } from 'lucide-react';

export function LiveFeeds() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', paddingBottom: '24px' }}>
      <h2 style={{ margin: 0 }}>Live Surveillance Feeds</h2>
      <div className="grid-auto" style={{ flex: 1 }}>
        {[1, 2, 3, 4].map(num => (
           <div key={num} className="glass-panel interactive-card" style={{ overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column' }}>
             <div style={{ padding: '12px 16px', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                 <Camera size={16} color="var(--text-secondary)" />
                 <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Drone 0{num} Feed</span>
               </div>
               {num === 2 && <span style={{ color: 'var(--status-danger)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}><AlertTriangle size={14} /> Heat Anomaly</span>}
             </div>
             <div style={{ flex: 1, background: '#090a0f', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'repeating-linear-gradient(0deg, transparent, transparent 10px, rgba(255,255,255,0.02) 10px, rgba(255,255,255,0.02) 11px)'
                }} />
               <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Establishing link... signal encrypted</div>
             </div>
           </div>
        ))}
      </div>
    </div>
  );
}
