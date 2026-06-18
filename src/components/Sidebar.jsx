import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Video, Map, Activity, Settings, Plane, Crosshair, Brain } from 'lucide-react';

const NavItem = ({ icon: Icon, label, path }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const active = location.pathname === path;

  return (
    <div 
      onClick={() => navigate(path)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 16px',
        borderRadius: '12px',
        cursor: 'pointer',
        background: active ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
        color: active ? 'var(--accent-primary)' : 'var(--text-secondary)',
        transition: 'all 0.2s ease',
        marginBottom: '8px'
      }}
    >
      <Icon size={20} />
      <span style={{ fontWeight: active ? 600 : 500 }}>{label}</span>
    </div>
  );
};

export function Sidebar() {
  return (
    <aside className="glass-sidebar" style={{ width: 'var(--sidebar-width)', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ background: 'var(--accent-primary)', padding: '8px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(59, 130, 246, 0.4)' }}>
          <Plane size={24} color="white" />
        </div>
        <div>
          <h2 className="text-gradient" style={{ margin: 0, fontSize: '1.25rem' }}>Dronaksh</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', margin: 0 }}>Aerial Intelligence</p>
        </div>
      </div>

      <nav style={{ padding: '0 16px', flex: 1, marginTop: '24px' }}>
        <NavItem icon={LayoutDashboard} label="Dashboard" path="/dashboard" />
        <NavItem icon={Crosshair} label="Fleet Management" path="/fleet-management" />
        <NavItem icon={Video} label="Live Feeds" path="/live" />
        <NavItem icon={Map} label="Fleet Map" path="/map" />
        <NavItem icon={Brain} label="AI Intelligence" path="/ai-detection" />
        <NavItem icon={Activity} label="Analytics" path="/analytics" />
      </nav>

      <div style={{ padding: '24px' }}>
        <NavItem icon={Settings} label="System Config" path="/settings" />
      </div>
    </aside>
  );
}
