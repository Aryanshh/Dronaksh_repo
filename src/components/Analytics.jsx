import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const historicalData = [
  { name: 'Mon', dist: 120, alerts: 2 },
  { name: 'Tue', dist: 150, alerts: 1 },
  { name: 'Wed', dist: 180, alerts: 4 },
  { name: 'Thu', dist: 90, alerts: 0 },
  { name: 'Fri', dist: 220, alerts: 5 },
  { name: 'Sat', dist: 300, alerts: 2 },
  { name: 'Sun', dist: 250, alerts: 1 },
];

export function Analytics() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', paddingBottom: '24px', overflowY: 'auto' }}>
      
      {/* Title */}
      <div>
        <h2 style={{ margin: 0, color: 'var(--text-primary)' }}>Analytics & Reporting</h2>
        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.875rem' }}>Weekly system metrics, distance metrics, and alert triggers.</p>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        
        {/* Distance covered card */}
        <div className="nm-flat" style={{ padding: '24px', minHeight: '380px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ margin: 0, fontSize: '1.125rem', color: 'var(--text-primary)' }}>Weekly Distance Covered (km)</h3>
          <div style={{ flex: 1, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={historicalData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="var(--text-muted)" tickLine={false} axisLine={false} style={{ fontSize: '11px' }} />
                <YAxis stroke="var(--text-muted)" tickLine={false} axisLine={false} style={{ fontSize: '11px' }} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.03)' }} 
                  contentStyle={{ 
                    background: 'var(--bg-color)', 
                    border: 'none', 
                    borderRadius: '8px', 
                    boxShadow: '-2px -2px 6px var(--highlight-color), 2px 2px 6px var(--shadow-color)',
                    color: 'var(--text-primary)' 
                  }} 
                />
                <Bar dataKey="dist" fill="var(--accent-primary)" radius={[6, 6, 0, 0]} barSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Security alerts card */}
        <div className="nm-flat" style={{ padding: '24px', minHeight: '380px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ margin: 0, fontSize: '1.125rem', color: 'var(--text-primary)' }}>Security Alerts Triggered</h3>
          <div style={{ flex: 1, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historicalData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="var(--text-muted)" tickLine={false} axisLine={false} style={{ fontSize: '11px' }} />
                <YAxis stroke="var(--text-muted)" tickLine={false} axisLine={false} style={{ fontSize: '11px' }} />
                <Tooltip 
                  contentStyle={{ 
                    background: 'var(--bg-color)', 
                    border: 'none', 
                    borderRadius: '8px', 
                    boxShadow: '-2px -2px 6px var(--highlight-color), 2px 2px 6px var(--shadow-color)',
                    color: 'var(--text-primary)' 
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="alerts" 
                  stroke="var(--status-warning)" 
                  strokeWidth={3} 
                  dot={{ stroke: 'var(--status-warning)', strokeWidth: 2, r: 5, fill: 'var(--bg-color)' }} 
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
