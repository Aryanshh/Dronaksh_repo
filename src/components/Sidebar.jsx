import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Video, Map, Activity, Settings, Plane, Crosshair, Brain } from 'lucide-react';
import { NeumorphicButton } from './NeumorphicButton';

const NavItem = ({ icon: Icon, label, path }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const active = location.pathname === path;

  return (
    <div 
      onClick={() => navigate(path)}
      className={active ? "nm-inset sidebar-link" : "sidebar-link"}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '14px 18px',
        borderRadius: '12px',
        cursor: 'pointer',
        color: active ? 'var(--accent-primary)' : 'var(--text-secondary)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        marginBottom: '12px',
        fontSize: '14px',
        fontWeight: 500,
        fontFamily: "'Satoshi', sans-serif",
        position: 'relative',
        overflow: 'hidden',
        boxShadow: active ? 'inset -3px -3px 6px var(--highlight-color), inset 3px 3px 6px var(--shadow-color)' : 'none',
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.color = 'var(--text-primary)';
          e.currentTarget.style.boxShadow = '-3px -3px 8px var(--highlight-color), 3px 3px 8px var(--shadow-color)';
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.color = 'var(--text-secondary)';
          e.currentTarget.style.boxShadow = 'none';
        }
      }}
    >
      {!active && (
        <div 
          className="hover-bg-slide"
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '100%',
            background: 'linear-gradient(90deg, rgba(99, 102, 241, 0.08) 0%, rgba(99, 102, 241, 0) 100%)',
            transform: 'translateX(-100%)',
            transition: 'transform 0.3s ease',
            zIndex: 0,
          }}
        />
      )}
      <Icon size={18} className="animate-float-bob" style={{ position: 'relative', zIndex: 1 }} />
      <span style={{ position: 'relative', zIndex: 1 }}>{label}</span>
    </div>
  );
};

export function Sidebar() {
  const navigate = useNavigate();

  return (
    <aside 
      style={{ 
        width: 'var(--sidebar-width)', 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%',
        backgroundColor: 'var(--bg-color)',
        paddingTop: '8px',
        boxShadow: '4px 0 10px var(--shadow-color)',
        zIndex: 10
      }}
    >
      {/* Brand Card */}
      <div className="nm-flat" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 16px' }}>
        <div style={{ 
          background: 'var(--bg-color)', 
          padding: '10px', 
          borderRadius: '12px', 
          boxShadow: 'inset -2px -2px 5px var(--highlight-color), inset 2px 2px 5px var(--shadow-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Plane size={24} color="var(--accent-primary)" />
        </div>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-primary)' }}>Dronaksh</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', margin: 0, fontWeight: 500 }}>Aerial Intelligence</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav style={{ padding: '0 16px', flex: 1, marginTop: '16px' }}>
        <NavItem icon={LayoutDashboard} label="Dashboard" path="/dashboard" />
        <NavItem icon={Crosshair} label="Fleet Management" path="/fleet-management" />
        <NavItem icon={Video} label="Live Feeds" path="/live" />
        <NavItem icon={Map} label="Fleet Map" path="/map" />
        <NavItem icon={Brain} label="AI Intelligence" path="/ai-detection" />
        <NavItem icon={Activity} label="Analytics" path="/analytics" />
      </nav>

      {/* Bottom Settings Button */}
      <div style={{ padding: '24px' }}>
        <NeumorphicButton 
          onClick={() => navigate('/settings')} 
          style={{ width: '100%' }}
        >
          <Settings size={18} />
          <span>System Config</span>
        </NeumorphicButton>
      </div>
    </aside>
  );
}
