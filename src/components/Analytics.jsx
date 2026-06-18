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
      <h2 style={{ margin: 0 }}>Analytics & Reporting</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        <div className="glass-panel interactive-card" style={{ padding: '24px', minHeight: '350px' }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '1.125rem' }}>Weekly Distance Covered (km)</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={historicalData}>
              <XAxis dataKey="name" stroke="var(--text-muted)" tickLine={false} axisLine={false} />
              <YAxis stroke="var(--text-muted)" tickLine={false} axisLine={false} />
              <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
              <Bar dataKey="dist" fill="var(--accent-primary)" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-panel interactive-card" style={{ padding: '24px', minHeight: '350px' }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '1.125rem' }}>Security Alerts Triggered</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={historicalData}>
              <XAxis dataKey="name" stroke="var(--text-muted)" tickLine={false} axisLine={false} />
              <YAxis stroke="var(--text-muted)" tickLine={false} axisLine={false} />
              <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
              <Line type="monotone" dataKey="alerts" stroke="var(--status-warning)" strokeWidth={3} dot={{ strokeWidth: 2, r: 4, fill: 'var(--bg-secondary)' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
