import React, { useState } from 'react';
import { Search, Bell, ShieldAlert, User, LogOut, Settings as SettingsIcon, Palette } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Header() {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showTheme, setShowTheme] = useState(false);

  const changeTheme = (themeName) => {
    document.documentElement.setAttribute('data-theme', themeName);
    setShowTheme(false);
  };

  const handleSignOut = () => {
    // Simulate session cleanup
    setShowProfile(false);
    navigate('/login');
  };
  
  return (
    <header className="glass-header" style={{ 
      height: 'var(--header-height)', 
      display: 'flex', 
      alignItems: 'center', 
      padding: '0 24px', 
      flexShrink: 0,
      justifyContent: 'space-between',
      position: 'relative',
      zIndex: 50
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <h3 style={{ margin: 0, fontSize: '1.125rem' }}>Command Centre</h3>
        <span style={{ 
          background: 'rgba(16, 185, 129, 0.1)', 
          color: 'var(--status-success)', 
          padding: '4px 12px', 
          borderRadius: '99px',
          fontSize: '0.75rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--status-success)', boxShadow: '0 0 10px var(--status-success)' }} />
          System Online
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          background: 'rgba(255, 255, 255, 0.05)', 
          padding: '8px 16px', 
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          transition: 'border-color 0.2s ease',
        }}
        onFocus={(e) => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
        onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
        >
          <Search size={18} color="var(--text-muted)" />
          <input 
            type="text" 
            placeholder="Search drones, alerts..." 
            style={{ 
              background: 'transparent', 
              border: 'none', 
              color: 'var(--text-primary)', 
              marginLeft: '12px',
              outline: 'none',
              width: '200px'
            }} 
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--text-secondary)' }}>
          <div style={{ position: 'relative', cursor: 'pointer', padding: '4px' }}>
            <ShieldAlert size={20} className="hover-highlight" />
            <div style={{ position: 'absolute', top: 2, right: 2, width: 8, height: 8, background: 'var(--status-warning)', borderRadius: '50%' }} />
          </div>
          
          <div style={{ position: 'relative' }}>
            <div 
              style={{ position: 'relative', cursor: 'pointer', padding: '4px' }}
              onClick={() => { setShowTheme(!showTheme); setShowNotifications(false); setShowProfile(false); }}
            >
              <Palette size={20} color={showTheme ? 'var(--text-primary)' : 'var(--text-secondary)'} className="hover-highlight" />
            </div>
            
            {showTheme && (
              <div className="glass-panel slide-down" style={{ position: 'absolute', top: '40px', right: '-10px', width: '160px', padding: '8px', zIndex: 100, border: '1px solid var(--glass-border)' }}>
                <div onClick={() => changeTheme('cyber')} className="menu-btn" style={{ padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.875rem' }}>
                  Cyber (Default)
                </div>
                <div onClick={() => changeTheme('enterprise')} className="menu-btn" style={{ padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.875rem' }}>
                  Enterprise Light
                </div>
                <div onClick={() => changeTheme('tactical')} className="menu-btn" style={{ padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.875rem' }}>
                  Tactical Stealth
                </div>
                <div onClick={() => changeTheme('eco')} className="menu-btn" style={{ padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.875rem' }}>
                  Agri-Scan (Eco)
                </div>
                <div onClick={() => changeTheme('emergency')} className="menu-btn" style={{ padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.875rem' }}>
                  Crimson (Emergency)
                </div>
              </div>
            )}
          </div>
          
          <div style={{ position: 'relative' }}>
            <div 
              style={{ position: 'relative', cursor: 'pointer', padding: '4px' }}
              onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); setShowTheme(false); }}
            >
              <Bell size={20} color={showNotifications ? 'var(--text-primary)' : 'var(--text-secondary)'} className="hover-highlight" />
              <div className="animate-pulse-glow" style={{ position: 'absolute', top: 2, right: 2, width: 8, height: 8, background: 'var(--status-danger)', borderRadius: '50%' }} />
            </div>
            
            {showNotifications && (
              <div className="glass-panel slide-down" style={{ position: 'absolute', top: '40px', right: '-10px', width: '300px', padding: '16px', zIndex: 100, border: '1px solid rgba(255,255,255,0.1)' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '0.875rem' }}>Recent Alerts</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ fontSize: '0.875rem', padding: '8px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', borderLeft: '2px solid var(--status-danger)' }}>
                    Intruder detected in Sector 4
                  </div>
                  <div style={{ fontSize: '0.875rem', padding: '8px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px', borderLeft: '2px solid var(--text-muted)' }}>
                    Drone 04 completed flight
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div style={{ position: 'relative' }}>
            <div 
              className="hover-bg-container"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '12px', paddingLeft: '24px', borderLeft: '1px solid var(--glass-border)', cursor: 'pointer', padding: '4px 8px 4px 24px', borderRadius: '8px' }}
              onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); setShowTheme(false); }}
            >
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(45deg, var(--accent-primary), var(--accent-secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={18} color="white" />
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: showProfile ? 'var(--text-primary)' : 'var(--text-secondary)' }}>Operator 01</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Admin</div>
              </div>
            </div>

            {showProfile && (
              <div className="glass-panel slide-down" style={{ position: 'absolute', top: '55px', right: '0px', width: '200px', padding: '8px', zIndex: 100, border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div className="menu-btn" style={{ padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem' }}>
                  <User size={16} /> My Account
                </div>
                <div className="menu-btn" style={{ padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem' }}>
                  <SettingsIcon size={16} /> Preferences
                </div>
                <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '4px 0' }} />
                <div 
                  className="menu-btn menu-btn-danger" 
                  style={{ padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: 'var(--status-danger)' }}
                  onClick={handleSignOut}
                >
                  <LogOut size={16} /> Sign Out
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
