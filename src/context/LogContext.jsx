import React, { createContext, useContext, useState, useEffect } from 'react';
import { AlertTriangle, Info, ShieldAlert } from 'lucide-react';

const LogContext = createContext();

const alertTemplates = [
  { type: 'critical', text: 'Suspicious vehicle detected in Sector Alpha', icon: ShieldAlert },
  { type: 'warning', text: 'Heat signature anomaly near Checkpoint Bravo', icon: AlertTriangle },
  { type: 'info', text: 'Routine perimeter scan completed successfully', icon: Info },
  { type: 'critical', text: 'Unauthorized personnel spotted in Sector Foxtrot', icon: ShieldAlert },
  { type: 'warning', text: 'Signal degradation alert triggered', icon: AlertTriangle },
  { type: 'info', text: 'Automated trajectory corrected for crosswinds', icon: Info },
];

export function LogProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [logs, setLogs] = useState([
    { id: 1, time: '20:42', droneId: 'DRN-04', type: 'critical', text: 'Intruder detected in Sector 4', icon: ShieldAlert },
    { id: 2, time: '20:38', droneId: 'DRN-02', type: 'info', text: 'Returning to base (low comms)', icon: Info },
    { id: 3, time: '20:15', droneId: 'DRN-01', type: 'success', text: 'Area scan completed', icon: Info }
  ]);

  const addLog = (template, droneId) => {
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newEntry = {
      id: Date.now(),
      time,
      droneId,
      ...template
    };

    // Add to toasts (temporary)
    setToasts(prev => [...prev, newEntry]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== newEntry.id));
    }, 5000);

    // Add to persistent logs
    setLogs(prev => [newEntry, ...prev].slice(0, 50)); // Keep last 50
  };

  useEffect(() => {
    const spawnRandomEvent = () => {
      const droneId = `DRN-${String(Math.floor(Math.random() * 10) + 1).padStart(2, '0')}`;
      const template = alertTemplates[Math.floor(Math.random() * alertTemplates.length)];
      addLog(template, droneId);

      const nextTime = Math.floor(Math.random() * 8000) + 7000; // 7-15 seconds
      timer = setTimeout(spawnRandomEvent, nextTime);
    };

    let timer = setTimeout(spawnRandomEvent, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <LogContext.Provider value={{ toasts, logs }}>
      {children}
    </LogContext.Provider>
  );
}

export const useLogs = () => useContext(LogContext);
