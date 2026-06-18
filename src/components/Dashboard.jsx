import React from 'react';
import { Activity, Battery, Crosshair, Radar, AlertTriangle, Wifi } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useDrones } from '../context/DroneContext';

const mockData = [
  { name: '08:00', flights: 4 },
  { name: '10:00', flights: 7 },
  { name: '12:00', flights: 12 },
  { name: '14:00', flights: 15 },
  { name: '16:00', flights: 9 },
  { name: '18:00', flights: 5 },
];

const MetricCard = ({ title, value, icon: Icon, trend, color }) => (
  <div className="glass-panel interactive-card" style={{ padding: '24px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
      <div style={{ background: `rgba(${color}, 0.15)`, padding: '12px', borderRadius: '12px' }}>
        <Icon size={24} style={{ color: `rgb(${color})` }} />
      </div>
      {trend && (
        <span style={{ 
          color: trend > 0 ? 'var(--status-success)' : 'var(--status-danger)', 
          fontSize: '0.875rem', 
          fontWeight: 600,
          background: trend > 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          padding: '4px 8px',
          borderRadius: '8px'
        }}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
      )}
    </div>
    <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '4px' }}>{title}</div>
    <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>{value}</div>
  </div>
);

const AlphaFeed = React.memo(() => {
    return (
      <div style={{ flex: 1, background: '#000', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '350px', overflow: 'hidden' }}>
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          preload="auto"
          onTimeUpdate={(e) => {
            if (e.target.currentTime >= 10) {
              e.target.currentTime = 0;
            }
          }}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.8,
          }}
          src="/alpha_feed.mp4"
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(circle at center, rgba(59, 130, 246, 0.02) 0%, transparent 80%)',
          pointerEvents: 'none'
        }} />
        <Crosshair size={48} color="rgba(59, 130, 246, 0.2)" className="animate-pulse-glow" style={{ position: 'absolute' }} />
        <div style={{ position: 'absolute', bottom: '24px', left: '24px', display: 'flex', gap: '16px' }}>
          <div style={{ background: 'rgba(0,0,0,0.6)', padding: '8px 16px', borderRadius: '8px', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Target Lock</div>
            <div style={{ color: 'var(--status-success)', fontWeight: 600 }}>Engaged</div>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.6)', padding: '8px 16px', borderRadius: '8px', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Altitude</div>
            <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>12m AGL</div>
          </div>
        </div>
        <div style={{ position: 'absolute', top: '24px', right: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ 
                background: '#f59e0b', 
                color: '#000', 
                padding: '6px 14px', 
                borderRadius: '2px', 
                fontSize: '0.7rem', 
                fontWeight: 900, 
                letterSpacing: '0.1em',
                fontFamily: 'monospace',
                boxShadow: '0 0 15px rgba(245, 158, 11, 0.4)',
                border: '1px solid rgba(0,0,0,0.2)'
            }}>
                PERSON DETECTED [98%]
            </div>
            <div style={{ 
                background: '#06b6d4', 
                color: '#000', 
                padding: '6px 14px', 
                borderRadius: '2px', 
                fontSize: '0.7rem', 
                fontWeight: 900, 
                letterSpacing: '0.1em',
                fontFamily: 'monospace',
                boxShadow: '0 0 15px rgba(6, 182, 212, 0.4)',
                border: '1px solid rgba(0,0,0,0.2)'
            }}>
                VEHICLE DETECTED [92%]
            </div>
        </div>
      </div>
    );
  });

export function Dashboard() {
  const navigate = useNavigate();
  const { drones, logs } = useDrones();
  const activeCount = drones.filter(d => d.status !== 'idle').length;
  const avgBattery = Math.round(drones.reduce((acc, d) => acc + d.battery, 0) / drones.length);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', paddingBottom: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Dashboard Overview</h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-danger">
            <AlertTriangle size={16} /> Land All
          </button>
          <button onClick={() => navigate('/fleet-management')} className="btn-primary">
            <Wifi size={16} /> Launch Drone
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid-auto">
        <MetricCard title="Active Units" value={`${activeCount}/${drones.length}`} icon={Crosshair} trend={8} color="59, 130, 246" />
        <MetricCard title="Coverage Area" value="20 sq km" icon={Radar} trend={12} color="139, 92, 246" />
        <MetricCard title="Fleet Battery Avg" value={`${avgBattery}%`} icon={Battery} trend={-2} color="16, 185, 129" />
        <MetricCard title="Alerts Logged" value={logs.length} icon={Activity} trend={15} color="245, 158, 11" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', flex: 1, minHeight: '400px' }}>
        {/* Main Live Feed Hub */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0 }}>Primary Live Feed - Alpha Squad</h3>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--status-danger)', fontSize: '0.875rem', fontWeight: 600 }}>
              <div className="animate-pulse-glow" style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--status-danger)' }} />
              REC: AI Analysis
            </span>
          </div>
          <AlphaFeed />
        </div>

        {/* Analytics & Alerts Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Chart Widget */}
          <div className="glass-panel" style={{ padding: '24px', flex: 1, minHeight: '220px' }}>
            <h3 style={{ margin: '0 0 24px 0', fontSize: '1.125rem' }}>Flight Operations</h3>
            <div style={{ height: 'calc(100% - 40px)', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockData}>
                  <defs>
                    <linearGradient id="colorFlights" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'var(--text-primary)' }} itemStyle={{ color: 'var(--accent-primary)' }} />
                  <Area type="monotone" dataKey="flights" stroke="var(--accent-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorFlights)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Log */}
          <div className="glass-panel" style={{ padding: '24px', flex: 1, minHeight: '220px', overflowY: 'auto', maxHeight: '350px' }}>
            <h3 style={{ margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.125rem' }}>
              <Activity size={18} color="var(--accent-secondary)" /> Operations Log
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {logs.map((log) => (
                <div key={log.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', paddingTop: '2px', minWidth: '40px' }}>{log.time}</div>
                  <div style={{ 
                    flex: 1, 
                    fontSize: '0.875rem',
                    color: log.type === 'critical' ? 'var(--status-danger)' : 
                           log.type === 'warning' ? 'var(--status-warning)' : 'var(--text-secondary)'
                  }}>
                    <strong style={{ color: 'var(--text-primary)' }}>{log.droneId}:</strong> {log.text}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
