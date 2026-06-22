import React from 'react';
import { Battery, Wifi, Map, Clock, Video, Activity, AlertTriangle } from 'lucide-react';
import { useDrones } from '../context/DroneContext';
import { NeumorphicButton } from './NeumorphicButton';
import { NeumorphicProgressBar } from './NeumorphicProgressBar';

const DroneCard = ({ drone, onLaunch, onLand }) => {
  const isAirborne = drone.status === 'active' || drone.status === 'returning';
  const isIdle = drone.status === 'idle';
  const isLaunching = drone.status === 'launching';
  const isLanding = drone.status === 'landing';
  const isRecalling = drone.status === 'recalling';

  // Customize battery bar colors
  const getBatteryColors = (bat) => {
    if (bat < 20) return { start: 'var(--status-danger)', end: '#dc2626' };
    if (bat < 50) return { start: 'var(--status-warning)', end: '#d97706' };
    return { start: 'var(--status-success)', end: '#059669' };
  };

  const batColors = getBatteryColors(drone.battery);

  return (
    <div className="nm-flat" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', padding: '16px', gap: '16px' }}>
      
      {/* Title / Status row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ margin: 0, fontSize: '1.125rem', color: 'var(--text-primary)', fontWeight: 700 }}>{drone.id}</h4>
        
        {isLaunching && <span className="blink-text" style={{ color: 'var(--accent-primary)', fontSize: '0.825rem', fontWeight: 700 }}>LAUNCHING...</span>}
        {isLanding && <span className="blink-text" style={{ color: 'var(--status-warning)', fontSize: '0.825rem', fontWeight: 700 }}>{drone.autoLanding ? 'AUTO LANDING...' : 'LANDING...'}</span>}
        {isRecalling && <span className="blink-text" style={{ color: 'var(--status-danger)', fontSize: '0.825rem', fontWeight: 700 }}>RECALLING...</span>}
        
        {!isLaunching && !isLanding && !isRecalling && (
          <span 
            className="nm-inset"
            style={{ 
              fontSize: '11px', 
              fontWeight: 700, 
              padding: '4px 10px', 
              borderRadius: '8px',
              color: drone.status === 'active' ? 'var(--status-success)' : drone.status === 'returning' ? 'var(--status-warning)' : 'var(--text-muted)',
              boxShadow: 'inset -2px -2px 5px var(--highlight-color), inset 2px 2px 5px var(--shadow-color)'
            }}
          >
            {drone.status.toUpperCase()}
          </span>
        )}
      </div>

      {/* Screen container */}
      <div 
        className="nm-inset"
        style={{ 
          height: '160px', 
          background: '#090a10', 
          position: 'relative', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          overflow: 'hidden',
          borderRadius: '12px',
          boxShadow: 'inset -3px -3px 6px var(--highlight-color), inset 3px 3px 6px var(--shadow-color)'
        }}
      >
        {drone.videoUrl && !isIdle && !drone.interference && (
          <video src={drone.videoUrl} autoPlay loop muted playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, rgba(99, 102, 241, 0.05) 0%, transparent 80%)', pointerEvents: 'none' }} />
        {drone.interference && <div className="tv-static-animated" style={{ position: 'absolute', inset: '-20px' }} />}
        {(isAirborne || isLanding || isRecalling) ? (
          <>
            <Video size={28} color={drone.interference ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.15)"} />
            <div style={{ position: 'absolute', top: 12, left: 12, color: drone.interference ? 'var(--status-warning)' : 'var(--status-danger)', fontSize: '10px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(30,32,48,0.85)', padding: '4px 8px', borderRadius: '6px' }}>
               <div className="animate-pulse-glow" style={{ width: '6px', height: '6px', borderRadius: '50%', background: drone.interference ? 'var(--status-warning)' : 'var(--status-danger)' }} /> 
               {drone.interference ? 'SIGNAL DEGRADED' : 'LIVE FEED'}
            </div>
          </>
        ) : (
          <div style={{ color: drone.interference ? 'var(--status-warning)' : 'var(--text-muted)', fontSize: '0.825rem', display: 'flex', alignItems: 'center', gap: '8px', zIndex: 10 }}>
            {drone.interference ? <AlertTriangle size={16} /> : <Activity size={16} />} 
            {drone.interference ? 'Telemetry Lost - Reconnecting...' : 'Telemetry Offline'}
          </div>
        )}
      </div>

      {/* Battery Progress Bar Component */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
          <span>Battery Status</span>
          <span style={{ color: batColors.start }}>{Math.floor(drone.battery)}%</span>
        </div>
        <NeumorphicProgressBar 
          value={drone.battery} 
          max={100} 
          colorStart={batColors.start} 
          colorEnd={batColors.end} 
          glow={drone.battery > 15}
        />
      </div>

      {/* Metadata Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', padding: '4px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Map size={16} color="var(--text-muted)" />
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{drone.area}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Clock size={16} color="var(--text-muted)" />
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{drone.time}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', gridColumn: 'span 2' }}>
          <Wifi size={16} color={drone.signal === 'Weak' || drone.signal === 'Poor' ? 'var(--status-danger)' : 'var(--status-success)'} />
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>Signal Status: {drone.signal}</div>
        </div>
      </div>

      {/* Button Controls */}
      <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
        <NeumorphicButton 
          onClick={() => onLaunch(drone.id)} 
          disabled={!isIdle} 
          style={{ flex: 1, height: '40px' }}
        >
          Launch
        </NeumorphicButton>
        <NeumorphicButton 
          onClick={() => onLand(drone.id)} 
          disabled={!isAirborne} 
          style={{ flex: 1, height: '40px', color: 'var(--status-danger)' }}
        >
          Land
        </NeumorphicButton>
      </div>

    </div>
  );
};

export function FleetManagement() {
  const { drones, handleLaunch, handleLand, handleRecallAll } = useDrones();
  const isRecallingAll = drones.some(d => d.status === 'recalling');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', paddingBottom: '24px', overflowY: 'auto' }}>
      
      {/* Title & Recall Trigger */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, color: 'var(--text-primary)' }}>Fleet Management</h2>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.875rem' }}>Active drone deployments and live telemetry feeds.</p>
        </div>
        <NeumorphicButton 
          onClick={handleRecallAll} 
          disabled={isRecallingAll} 
          style={{ color: 'var(--status-danger)' }}
        >
          {isRecallingAll ? (
            <span className="blink-text">RECALLING ALL UNITS...</span>
          ) : (
            <>
              <AlertTriangle size={16} />
              <span>Emergency Recall All</span>
            </>
          )}
        </NeumorphicButton>
      </div>

      {/* Drones list grid */}
      <div className="grid-auto">
        {drones.map(drone => (
          <DroneCard key={drone.id} drone={drone} onLaunch={handleLaunch} onLand={handleLand} />
        ))}
      </div>
    </div>
  );
}
