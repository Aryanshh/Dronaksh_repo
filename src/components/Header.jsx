import React, { useState } from 'react';
import { Search, Bell, User, LogOut, Settings as SettingsIcon, Sun, Moon, ChevronRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [hoveredBreadcrumb, setHoveredBreadcrumb] = useState(false);

  const [theme, setTheme] = useState(() => {
    return document.documentElement.getAttribute('data-theme') || 'dark';
  });

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', nextTheme);
    setTheme(nextTheme);
  };

  const handleSignOut = () => {
    setShowProfile(false);
    navigate('/login');
  };

  // Map route to breadcrumb label
  const getBreadcrumbLabel = () => {
    switch (location.pathname) {
      case '/dashboard': return 'Dashboard';
      case '/fleet-management': return 'Fleet Management';
      case '/live': return 'Live Feeds';
      case '/map': return 'Fleet Map';
      case '/ai-detection': return 'AI Intelligence';
      case '/analytics': return 'Analytics';
      case '/settings': return 'System Config';
      default: return 'Overview';
    }
  };

  return (
    <header 
      className="nm-flat" 
      style={{ 
        height: 'var(--header-height)', 
        display: 'flex', 
        alignItems: 'center', 
        padding: '0 24px', 
        justifyContent: 'space-between',
        position: 'relative',
        zIndex: 50,
        borderRadius: '24px',
        margin: '16px 0 0 0',
        width: '100%',
        boxShadow: '-6px -6px 12px var(--highlight-color), 6px 6px 12px var(--shadow-color)',
      }}
    >
      {/* Left side: Breadcrumbs with rotating chevron */}
      <div 
        style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
        onMouseEnter={() => setHoveredBreadcrumb(true)}
        onMouseLeave={() => setHoveredBreadcrumb(false)}
      >
        <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)' }}>Command Centre</span>
        <ChevronRight 
          size={16} 
          style={{ 
            transform: hoveredBreadcrumb ? 'rotate(90deg)' : 'rotate(0deg)', 
            transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            color: 'var(--text-muted)' 
          }} 
        />
        <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
          {getBreadcrumbLabel()}
        </span>
      </div>

      {/* Center: Search bar using nm-inset */}
      <div 
        className="nm-inset" 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          width: '288px', 
          padding: '8px 16px',
          borderRadius: '999px',
          boxShadow: 'inset -2px -2px 5px var(--highlight-color), inset 2px 2px 5px var(--shadow-color)',
        }}
      >
        <Search size={18} color="var(--text-muted)" />
        <input 
          type="text" 
          placeholder="Search drones..." 
          style={{ 
            background: 'transparent', 
            border: 'none', 
            color: 'var(--text-primary)', 
            marginLeft: '12px',
            outline: 'none',
            width: '100%',
            fontFamily: "'Satoshi', sans-serif",
            fontSize: '14px'
          }} 
        />
      </div>

      {/* Right side: Theme toggle, Notifications and Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        
        {/* Circular Theme Toggle Button */}
        <button 
          onClick={toggleTheme}
          className="nm-button"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
            boxShadow: '-3px -3px 8px var(--highlight-color), 3px 3px 8px var(--shadow-color)'
          }}
          title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {theme === 'dark' ? (
            <Sun size={18} color="var(--text-primary)" />
          ) : (
            <Moon size={18} color="var(--text-primary)" />
          )}
        </button>

        {/* Circular Notification Button */}
        <div style={{ position: 'relative' }}>
          <button 
            onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
            className="nm-button"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
              boxShadow: '-3px -3px 8px var(--highlight-color), 3px 3px 8px var(--shadow-color)'
            }}
          >
            <Bell size={18} color="var(--text-primary)" />
            {/* Pulsing Status Dot */}
            <div 
              className="animate-pulse-glow" 
              style={{ 
                position: 'absolute', 
                top: '2px', 
                right: '2px', 
                width: '8px', 
                height: '8px', 
                background: 'var(--status-danger)', 
                borderRadius: '50%' 
              }} 
            />
          </button>

          {showNotifications && (
            <div 
              className="nm-flat slide-down" 
              style={{ 
                position: 'absolute', 
                top: '52px', 
                right: '0px', 
                width: '300px', 
                padding: '16px', 
                zIndex: 100, 
                boxShadow: '-4px -4px 10px var(--highlight-color), 4px 4px 10px var(--shadow-color)' 
              }}
            >
              <h4 style={{ margin: '0 0 12px 0', fontSize: '0.875rem', fontWeight: 700 }}>Recent Alerts</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ fontSize: '0.825rem', padding: '8px 12px', background: 'rgba(239, 68, 68, 0.08)', borderRadius: '8px', borderLeft: '3px solid var(--status-danger)', color: 'var(--text-primary)' }}>
                  Intruder detected in Sector 4
                </div>
                <div style={{ fontSize: '0.825rem', padding: '8px 12px', background: 'rgba(99, 102, 241, 0.08)', borderRadius: '8px', borderLeft: '3px solid var(--accent-primary)', color: 'var(--text-primary)' }}>
                  Drone DRN-04 completed flight
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar Trigger */}
        <div style={{ position: 'relative' }}>
          <div 
            onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'linear-gradient(45deg, var(--accent-primary), var(--accent-secondary))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '-3px -3px 8px var(--highlight-color), 3px 3px 8px var(--shadow-color)',
              transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <User size={18} color="white" />
          </div>

          {showProfile && (
            <div 
              className="nm-flat slide-down" 
              style={{ 
                position: 'absolute', 
                top: '52px', 
                right: '0px', 
                width: '200px', 
                padding: '8px', 
                zIndex: 100, 
                boxShadow: '-4px -4px 10px var(--highlight-color), 4px 4px 10px var(--shadow-color)', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '4px' 
              }}
            >
              <div 
                style={{ 
                  padding: '8px 12px', 
                  borderRadius: '8px', 
                  cursor: 'pointer', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  fontSize: '0.875rem',
                  color: 'var(--text-secondary)',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <User size={16} /> My Account
              </div>
              <div 
                style={{ 
                  padding: '8px 12px', 
                  borderRadius: '8px', 
                  cursor: 'pointer', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  fontSize: '0.875rem',
                  color: 'var(--text-secondary)',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <SettingsIcon size={16} /> Preferences
              </div>
              <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '4px 0' }} />
              <div 
                style={{ 
                  padding: '8px 12px', 
                  borderRadius: '8px', 
                  cursor: 'pointer', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  fontSize: '0.875rem', 
                  color: 'var(--status-danger)',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                onClick={handleSignOut}
              >
                <LogOut size={16} /> Sign Out
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
