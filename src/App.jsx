import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { LiveFeeds } from './components/LiveFeeds';
import { FleetMap } from './components/FleetMap';
import { Analytics } from './components/Analytics';
import { SystemConfig } from './components/SystemConfig';
import { FleetManagement } from './components/FleetManagement';
import { LoginPage } from './components/LoginPage';
import { LandingPage } from './components/LandingPage';
import { AIDetection } from './components/AIDetection';
import { useDrones } from './context/DroneContext';

function App() {
  const location = useLocation();
  const isAuthScene = ['/', '/login'].includes(location.pathname);
  const { toasts } = useDrones();

  if (isAuthScene) {
    return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    );
  }

  return (
    <div className="layout-container">
      {/* Global Notifications */}
      <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '12px', pointerEvents: 'none' }}>
        {toasts.map(t => (
          <div 
            key={t.id} 
            className="slide-left nm-flat" 
            style={{ 
              width: '320px', 
              padding: '16px', 
              display: 'flex', 
              gap: '12px', 
              pointerEvents: 'auto',
              borderLeft: `4px solid ${t.type === 'critical' ? 'var(--status-danger)' : t.type === 'warning' ? 'var(--status-warning)' : 'var(--status-success)'}`,
              borderRadius: '12px'
            }}
          >
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              background: 'var(--bg-color)', 
              boxShadow: 'inset -2px -2px 5px var(--highlight-color), inset 2px 2px 5px var(--shadow-color)',
              color: t.type === 'critical' ? 'var(--status-danger)' : t.type === 'warning' ? 'var(--status-warning)' : 'var(--accent-primary)', 
              width: '40px', 
              height: '40px', 
              borderRadius: '50%' 
            }}>
              <t.icon size={20} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>{t.droneId} Alert</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{t.text}</div>
            </div>
          </div>
        ))}
      </div>

      <Sidebar />
      <main className="main-content">
        <Header />
        <div className="page-content">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/live" element={<LiveFeeds />} />
            <Route path="/map" element={<FleetMap />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<SystemConfig />} />
            <Route path="/fleet-management" element={<FleetManagement />} />
            <Route path="/ai-detection" element={<AIDetection />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}

export default App;
