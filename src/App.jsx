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
import { AIDetection } from './components/AIDetection';
import { useDrones } from './context/DroneContext';

function App() {
  const location = useLocation();
  const isAuthScene = ['/', '/login'].includes(location.pathname);
  const { toasts } = useDrones();

  if (isAuthScene) {
    return (
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    );
  }

  return (
    <div className="layout-container">
      {/* Global Notifications */}
      <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '12px', pointerEvents: 'none' }}>
        {toasts.map(t => (
          <div key={t.id} className="slide-left glass-panel" style={{ width: '320px', border: `1px solid ${t.type === 'critical' ? 'rgba(239,68,68,0.4)' : t.type === 'warning' ? 'rgba(245,158,11,0.4)' : 'var(--glass-border)'}`, padding: '16px', display: 'flex', gap: '12px', pointerEvents: 'auto', background: 'var(--bg-glass)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: t.type === 'critical' ? 'rgba(239,68,68,0.1)' : t.type === 'warning' ? 'rgba(245,158,11,0.1)' : 'rgba(59,130,246,0.1)', color: t.type === 'critical' ? 'var(--status-danger)' : t.type === 'warning' ? 'var(--status-warning)' : 'var(--accent-primary)', width: '40px', height: '40px', borderRadius: '50%' }}>
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
