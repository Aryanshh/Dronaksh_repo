import React from 'react';

export function SystemConfig() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '24px', maxWidth: '800px' }}>
      <h2 style={{ margin: 0 }}>System Configuration</h2>
      
      <div className="glass-panel interactive-card" style={{ padding: '24px' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '1.125rem' }}>AI Parameters</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 600 }}>Confidence Threshold</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Minimum AI confidence score to trigger security alerts.</div>
            </div>
            <input type="number" defaultValue={85} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '8px 12px', borderRadius: '8px', width: '80px', textAlign: 'right', outline: 'none' }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <div>
              <div style={{ fontWeight: 600 }}>Continuous Object Tracking</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Enable multi-camera tracking algorithms for moving targets.</div>
            </div>
            <div style={{ background: 'var(--status-success)', width: '44px', height: '24px', borderRadius: '12px', position: 'relative', cursor: 'pointer', border: '1px solid rgba(16,185,129,0.5)' }}>
              <div style={{ position: 'absolute', right: '2px', top: '1px', width: '20px', height: '20px', background: 'white', borderRadius: '50%', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }} />
            </div>
          </div>
        </div>
      </div>

      <div className="glass-panel interactive-card" style={{ padding: '24px' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '1.125rem' }}>Network Security</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ fontWeight: 600 }}>Command API Token</div>
          <input type="password" defaultValue="dronaksh_token_8x99af0f2k" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-muted)', padding: '12px', borderRadius: '8px', width: '100%', outline: 'none' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
          <button className="btn-primary">Save System State</button>
        </div>
      </div>

    </div>
  );
}
