import React from 'react';
import { Camera, AlertTriangle } from 'lucide-react';

export function LiveFeeds() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', paddingBottom: '24px', overflowY: 'auto' }}>
      
      {/* Title */}
      <div>
        <h2 style={{ margin: 0, color: 'var(--text-primary)' }}>Live Surveillance Feeds</h2>
        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.875rem' }}>Encrypted drone video uplink stream analysis.</p>
      </div>

      <div className="grid-auto" style={{ flex: 1 }}>
        {[1, 2, 3, 4].map(num => (
           <div key={num} className="nm-flat" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', padding: '16px', gap: '12px' }}>
             
             {/* Feed card header */}
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                 <Camera size={16} color="var(--accent-primary)" />
                 <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>Drone DRN-0{num} Feed</span>
               </div>
               {num === 2 && (
                 <span 
                   className="nm-inset blink-text" 
                   style={{ 
                     color: 'var(--status-danger)', 
                     fontSize: '0.75rem', 
                     display: 'flex', 
                     alignItems: 'center', 
                     gap: '4px',
                     padding: '4px 10px',
                     borderRadius: '8px',
                     boxShadow: 'inset -1px -1px 3px var(--highlight-color), inset 1px 1px 3px var(--shadow-color)'
                   }}
                 >
                   <AlertTriangle size={14} /> Heat Anomaly
                 </span>
               )}
             </div>

             {/* Screen container */}
             <div 
               className="nm-inset" 
               style={{ 
                 flex: 1, 
                 background: '#090a10', 
                 display: 'flex', 
                 alignItems: 'center', 
                 justifyContent: 'center', 
                 position: 'relative',
                 minHeight: '200px',
                 borderRadius: '12px',
                 boxShadow: 'inset -3px -3px 6px var(--highlight-color), inset 3px 3px 6px var(--shadow-color)'
               }}
             >
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'repeating-linear-gradient(0deg, transparent, transparent 10px, rgba(255,255,255,0.015) 10px, rgba(255,255,255,0.015) 11px)',
                  borderRadius: '12px'
                }} />
                <div style={{ color: 'var(--text-muted)', fontSize: '0.825rem', fontFamily: 'monospace' }}>Establishing link... signal encrypted</div>
             </div>
           </div>
        ))}
      </div>
    </div>
  );
}
