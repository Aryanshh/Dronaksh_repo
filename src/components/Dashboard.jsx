import React, { useState, useEffect } from 'react';
import { Activity, Battery, Crosshair, Radar, AlertTriangle, Wifi } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useDrones } from '../context/DroneContext';
import { NeumorphicButton } from './NeumorphicButton';
import { TerminalWidget } from './TerminalWidget';

const mockData = [
  { name: '08:00', flights: 4 },
  { name: '10:00', flights: 7 },
  { name: '12:00', flights: 12 },
  { name: '14:00', flights: 15 },
  { name: '16:00', flights: 9 },
  { name: '18:00', flights: 5 },
];

const AnimatedCounter = ({ value }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const numericTarget = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.]/g, '')) || 0 : value;
    
    if (numericTarget === 0) {
      setCount(0);
      return;
    }
    
    const duration = 1200; // 1.2s
    const steps = 40;
    const stepTime = duration / steps;
    const increment = numericTarget / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= numericTarget) {
        setCount(numericTarget);
        clearInterval(timer);
      } else {
        setCount(Math.round(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value]);

  const suffix = typeof value === 'string' ? value.replace(/[0-9.]/g, '') : '';
  const prefix = typeof value === 'string' && value.includes('/') ? value.split('/')[0] : '';
  
  if (typeof value === 'string' && value.includes('/')) {
    // Return fractional value (e.g. 5/10) directly without animation or anim on first part
    return <span>{value}</span>;
  }
  
  return <span>{count}{suffix}</span>;
};

const MetricCard = ({ title, value, icon: Icon, trend, colorStart = '#6366f1', colorEnd = '#a78bfa' }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div 
      className="nm-flat-hover" 
      style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div 
          className="nm-inset animate-float-bob" 
          style={{ 
            width: '48px', 
            height: '48px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            borderRadius: '12px',
            boxShadow: 'inset -2px -2px 5px var(--highlight-color), inset 2px 2px 5px var(--shadow-color)',
          }}
        >
          <Icon size={22} style={{ color: colorStart }} />
        </div>
        <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.05em' }}>{title}</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '8px' }}>
        <div style={{ fontSize: '30px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: "'General Sans', sans-serif" }}>
          <AnimatedCounter value={value} />
        </div>

        {trend !== undefined && (
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center',
              gap: '4px',
              fontSize: '13px',
              fontWeight: 700,
              background: trend > 0 ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
              padding: '4px 8px',
              borderRadius: '8px',
              color: trend > 0 ? 'var(--status-success)' : 'var(--status-danger)',
              transform: hovered ? 'translateX(6px)' : 'translateX(0)',
              transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <span>{trend > 0 ? '+' : ''}{trend}%</span>
          </div>
        )}
      </div>
    </div>
  );
};

const AlphaFeed = React.memo(() => {
  return (
    <div style={{ flex: 1, background: '#090a10', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '340px', overflow: 'hidden', borderRadius: '12px', boxShadow: 'inset -2px -2px 5px var(--highlight-color), inset 2px 2px 5px var(--shadow-color)' }}>
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
          opacity: 0.7,
        }}
        src="/alpha_feed.mp4"
      />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(circle at center, rgba(99, 102, 241, 0.05) 0%, transparent 80%)',
        pointerEvents: 'none'
      }} />
      <Crosshair size={48} color="rgba(99, 102, 241, 0.3)" className="animate-pulse-glow" style={{ position: 'absolute' }} />
      <div style={{ position: 'absolute', bottom: '20px', left: '20px', display: 'flex', gap: '12px' }}>
        <div style={{ background: 'rgba(30,32,48,0.85)', padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Target Lock</div>
          <div style={{ color: 'var(--status-success)', fontWeight: 700, fontSize: '12px' }}>ENGAGED</div>
        </div>
        <div style={{ background: 'rgba(30,32,48,0.85)', padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Altitude</div>
          <div style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '12px' }}>12m AGL</div>
        </div>
      </div>
      <div style={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ 
              background: '#f59e0b', 
              color: '#000', 
              padding: '6px 12px', 
              borderRadius: '6px', 
              fontSize: '10px', 
              fontWeight: 800, 
              letterSpacing: '0.05em',
              fontFamily: 'monospace',
              boxShadow: '0 0 10px rgba(245, 158, 11, 0.4)',
          }}>
              PERSON DETECTED [98%]
          </div>
          <div style={{ 
              background: '#06b6d4', 
              color: '#000', 
              padding: '6px 12px', 
              borderRadius: '6px', 
              fontSize: '10px', 
              fontWeight: 800, 
              letterSpacing: '0.05em',
              fontFamily: 'monospace',
              boxShadow: '0 0 10px rgba(6, 182, 212, 0.4)',
          }}>
              VEHICLE DETECTED [92%]
          </div>
      </div>
    </div>
  );
});

export function Dashboard() {
  const navigate = useNavigate();
  const { drones, logs, handleRecallAll } = useDrones();
  const activeCount = drones.filter(d => d.status !== 'idle').length;
  const avgBattery = Math.round(drones.reduce((acc, d) => acc + d.battery, 0) / drones.length);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', paddingBottom: '24px' }}>
      
      {/* Header controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--text-primary)' }}>Dashboard Overview</h2>
        <div style={{ display: 'flex', gap: '16px' }}>
          <NeumorphicButton onClick={handleRecallAll} style={{ color: 'var(--status-danger)' }}>
            <AlertTriangle size={16} />
            <span>Recall All</span>
          </NeumorphicButton>
          <NeumorphicButton onClick={() => navigate('/fleet-management')}>
            <Wifi size={16} style={{ color: 'var(--accent-primary)' }} />
            <span>Launch Drone</span>
          </NeumorphicButton>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid-auto">
        <MetricCard title="Active Units" value={`${activeCount}/${drones.length}`} icon={Crosshair} trend={8} colorStart="var(--accent-primary)" />
        <MetricCard title="Coverage Area" value="20 sq km" icon={Radar} trend={12} colorStart="var(--accent-secondary)" />
        <MetricCard title="Fleet Battery Avg" value={`${avgBattery}%`} icon={Battery} trend={-2} colorStart="var(--status-success)" />
        <MetricCard title="Alerts Logged" value={`${logs.length}`} icon={Activity} trend={15} colorStart="var(--status-warning)" />
      </div>

      {/* Bottom two-column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '24px', flex: 1, minHeight: '420px' }}>
        
        {/* Main Live Feed Hub */}
        <div className="nm-flat" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '1.125rem', color: 'var(--text-primary)' }}>Primary Live Feed - Alpha Squad</h3>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--status-danger)', fontSize: '0.825rem', fontWeight: 700 }}>
              <div className="animate-pulse-glow" style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--status-danger)' }} />
              REC: AI Analysis
            </span>
          </div>
          <AlphaFeed />
        </div>

        {/* Analytics & Terminal Widgets */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Chart Widget */}
          <div className="nm-flat" style={{ padding: '24px', flex: 1, minHeight: '220px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.125rem', color: 'var(--text-primary)' }}>Flight Operations</h3>
            <div style={{ height: 'calc(100% - 36px)', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorFlights" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip 
                    contentStyle={{ 
                      background: 'var(--bg-color)', 
                      border: 'none', 
                      borderRadius: '8px', 
                      boxShadow: '-2px -2px 6px var(--highlight-color), 2px 2px 6px var(--shadow-color)',
                      color: 'var(--text-primary)' 
                    }} 
                    itemStyle={{ color: 'var(--accent-primary)' }} 
                  />
                  <XAxis dataKey="name" stroke="var(--text-muted)" tickLine={false} axisLine={false} style={{ fontSize: '10px' }} />
                  <YAxis stroke="var(--text-muted)" tickLine={false} axisLine={false} style={{ fontSize: '10px' }} />
                  <Area type="monotone" dataKey="flights" stroke="var(--accent-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorFlights)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Staggered Typing Operations Console */}
          <div style={{ flex: 1 }}>
            <TerminalWidget logs={logs.slice(0, 5)} title="OPERATIONS CONSOLE" />
          </div>

        </div>
      </div>
    </div>
  );
}
