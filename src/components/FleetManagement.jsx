import React from 'react';
import { Battery, Wifi, Map, Clock, Video, Activity, AlertTriangle } from 'lucide-react';
import { useDrones } from '../context/DroneContext';

const DroneCard = ({ drone, onLaunch, onLand }) => {
  const isAirborne = drone.status === 'active' || drone.status === 'returning';
  const isIdle = drone.status === 'idle';
  const isLaunching = drone.status === 'launching';
  const isLanding = drone.status === 'landing';
  const isRecalling = drone.status === 'recalling';

  return (
    <div className="glass-panel interactive-card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.2)' }}>
        <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-primary)' }}>{drone.id}</h4>
        
        {isLaunching && <span className="blink-text" style={{ color: 'var(--accent-primary)', fontSize: '0.875rem', fontWeight: 600 }}>Launching...</span>}
        {isLanding && <span className="blink-text" style={{ color: 'var(--status-warning)', fontSize: '0.875rem', fontWeight: 600 }}>{drone.autoLanding ? 'Auto Landing...' : 'Landing...'}</span>}
        {isRecalling && <span className="blink-text" style={{ color: 'var(--status-danger)', fontSize: '0.875rem', fontWeight: 600 }}>Recalling...</span>}
        
        {!isLaunching && !isLanding && !isRecalling && (
          <span style={{ 
            fontSize: '0.75rem', 
            fontWeight: 600, 
            padding: '2px 8px', 
            borderRadius: '4px',
            background: drone.status === 'active' ? 'rgba(16, 185, 129, 0.2)' : drone.status === 'returning' ? 'rgba(245, 158, 11, 0.2)' : drone.status === 'idle' ? 'rgba(255,255,255,0.1)' : 'rgba(59, 130, 246, 0.2)',
            color: drone.status === 'active' ? 'var(--status-success)' : drone.status === 'returning' ? 'var(--status-warning)' : drone.status === 'idle' ? 'var(--text-muted)' : 'var(--accent-primary)'
          }}>
            {drone.status.toUpperCase()}
          </span>
        )}
      </div>

      <div style={{ height: '180px', background: '#000', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {drone.videoUrl && !isIdle && !drone.interference && (
          <video src={drone.videoUrl} autoPlay loop muted playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.65, filter: 'grayscale(20%) contrast(110%)' }} />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, rgba(59, 130, 246, 0.1) 0%, transparent 80%)', pointerEvents: 'none' }} />
        {drone.interference && <div className="tv-static-animated" style={{ position: 'absolute', inset: '-20px' }} />}
        {(isAirborne || isLanding || isRecalling) ? (
          <>
            <Video size={32} color={drone.interference ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.1)"} />
            <div style={{ position: 'absolute', top: 8, left: 8, color: drone.interference ? 'var(--status-warning)' : 'var(--status-danger)', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
               <div className="animate-pulse-glow" style={{ width: '6px', height: '6px', borderRadius: '50%', background: drone.interference ? 'var(--status-warning)' : 'var(--status-danger)' }} /> 
               {drone.interference ? 'SIGNAL DEGRADED' : 'LIVE'}
               {drone.autoLanding && <span style={{ marginLeft: '6px', color: 'var(--status-warning)', background: 'rgba(245,158,11,0.15)', padding: '2px 6px', borderRadius: '4px' }}>AUTOPILOT ENGAGED</span>}
            </div>
          </>
        ) : (
          <div style={{ color: drone.interference ? 'var(--status-warning)' : 'var(--text-muted)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '8px', position: 'relative', zIndex: 10 }}>
            {drone.interference ? <AlertTriangle size={16} /> : <Activity size={16} />} 
            {drone.interference ? 'Telemtry Lost - Reconnecting...' : 'System Muted - Grounded'}
          </div>
        )}
      </div>

      <div style={{ padding: '12px 16px', display: 'flex', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <button className="btn-primary" onClick={() => onLaunch(drone.id)} disabled={!isIdle} style={{ flex: 1 }}>Launch</button>
        <button className="btn-danger" onClick={() => onLand(drone.id)} disabled={!isAirborne} style={{ flex: 1 }}>Land</button>
      </div>

      <div style={{ padding: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Map size={16} color="var(--text-muted)" /><div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{drone.area}</div></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Clock size={16} color="var(--text-muted)" /><div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{drone.time}</div></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Battery size={16} color={drone.battery < 20 ? 'var(--status-danger)' : drone.battery < 50 ? 'var(--status-warning)' : 'var(--status-success)'} /><div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{Math.floor(drone.battery)}%</div></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Wifi size={16} color={drone.signal === 'Weak' ? 'var(--status-danger)' : drone.signal === 'Poor' ? 'var(--status-danger)' : drone.signal === 'Strong' ? 'var(--status-success)' : 'var(--text-muted)'} /><div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{drone.signal}</div></div>
      </div>
    </div>
  );
};

export function FleetManagement() {
  const { drones, handleLaunch, handleLand, handleRecallAll } = useDrones();
  const isRecallingAll = drones.some(d => d.status === 'recalling');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', paddingBottom: '24px', overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0 }}>Fleet Management</h2>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.875rem' }}>Active drone deployments and live telemetry feeds.</p>
        </div>
        <button onClick={handleRecallAll} disabled={isRecallingAll} className="btn-danger">
          {isRecallingAll ? <span className="blink-text">Recalling...</span> : <><AlertTriangle size={16} /> Emergency Recall All</>}
        </button>
      </div>
      <div className="grid-auto">
        {drones.map(drone => (
          <DroneCard key={drone.id} drone={drone} onLaunch={handleLaunch} onLand={handleLand} />
        ))}
      </div>
    </div>
  );
}
