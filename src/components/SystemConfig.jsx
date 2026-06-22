import React, { useState } from 'react';
import { NeumorphicButton } from './NeumorphicButton';

export function SystemConfig() {
  const [tracking, setTracking] = useState(true);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '24px', maxWidth: '800px' }}>
      
      {/* Title */}
      <div>
        <h2 style={{ margin: 0, color: 'var(--text-primary)' }}>System Configuration</h2>
        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.875rem' }}>Configure neural models, tracking sensitivities, and api integrations.</p>
      </div>
      
      {/* AI parameters card */}
      <div className="nm-flat" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h3 style={{ margin: 0, fontSize: '1.125rem', color: 'var(--text-primary)' }}>AI Parameters</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Confidence Threshold</div>
              <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Minimum AI confidence score to trigger security alerts.</div>
            </div>
            <input 
              type="number" 
              defaultValue={85} 
              className="nm-inset"
              style={{ 
                border: 'none', 
                color: 'var(--text-primary)', 
                padding: '8px 16px', 
                borderRadius: '8px', 
                width: '80px', 
                textAlign: 'right', 
                outline: 'none',
                fontFamily: "'Satoshi', sans-serif",
                fontWeight: 600,
                boxShadow: 'inset -2px -2px 5px var(--highlight-color), inset 2px 2px 5px var(--shadow-color)'
              }} 
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Continuous Object Tracking</div>
              <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Enable multi-camera tracking algorithms for moving targets.</div>
            </div>
            
            {/* Custom Neumorphic Switch Toggle */}
            <div 
              onClick={() => setTracking(!tracking)}
              className="nm-inset"
              style={{ 
                width: '52px', 
                height: '26px', 
                borderRadius: '14px', 
                position: 'relative', 
                cursor: 'pointer',
                boxShadow: 'inset -2px -2px 5px var(--highlight-color), inset 2px 2px 5px var(--shadow-color)',
                background: 'var(--bg-color)',
                padding: '2px'
              }}
            >
              <div 
                className="nm-flat"
                style={{ 
                  position: 'absolute', 
                  left: tracking ? '28px' : '2px', 
                  top: '2px', 
                  width: '22px', 
                  height: '22px', 
                  background: tracking ? 'var(--status-success)' : 'var(--text-muted)', 
                  borderRadius: '50%',
                  boxShadow: '-1px -1px 3px var(--highlight-color), 1px 1px 3px var(--shadow-color)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }} 
              />
            </div>
          </div>

        </div>
      </div>

      {/* Network parameters card */}
      <div className="nm-flat" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h3 style={{ margin: 0, fontSize: '1.125rem', color: 'var(--text-primary)' }}>Network Security</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '14px' }}>Command API Token</div>
          <input 
            type="password" 
            defaultValue="dronaksh_token_8x99af0f2k" 
            className="nm-inset"
            style={{ 
              border: 'none', 
              color: 'var(--text-muted)', 
              padding: '12px 16px', 
              borderRadius: '8px', 
              width: '100%', 
              outline: 'none',
              fontFamily: 'monospace',
              fontSize: '13px',
              boxShadow: 'inset -2px -2px 5px var(--highlight-color), inset 2px 2px 5px var(--shadow-color)'
            }} 
          />
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
          <NeumorphicButton>
            <span>Save System State</span>
          </NeumorphicButton>
        </div>
      </div>

    </div>
  );
}
