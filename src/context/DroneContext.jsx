import React, { createContext, useContext, useState, useEffect } from 'react';
import { AlertTriangle, Info, ShieldAlert } from 'lucide-react';

const DroneContext = createContext();

const initialDrones = [
  { id: 'DRN-01', area: 'Sector Alpha', battery: 84, signal: 'Strong', time: '1h 12m', status: 'active', x: 25, y: 30, videoUrl: 'https://media.giphy.com/media/l41lN3U3XgHHT0j16/giphy.mp4', speed: 0.1 },
  { id: 'DRN-02', area: 'Sector Alpha', battery: 92, signal: 'Strong', time: '45m', status: 'active', x: 45, y: 35, videoUrl: 'https://media.giphy.com/media/3o7TKrEzvPNBgqPzXy/giphy.mp4', speed: 0.2 },
  { id: 'DRN-03', area: 'Sector Bravo', battery: 42, signal: 'Medium', time: '2h 05m', status: 'active', x: 65, y: 25, videoUrl: 'https://media.giphy.com/media/26BkNsA8y2sihLruo/giphy.mp4', speed: 0.8 },
  { id: 'DRN-04', area: 'Sector Charlie', battery: 78, signal: 'Weak', time: '3h 10m', status: 'returning', x: 80, y: 50, videoUrl: 'https://media.giphy.com/media/xT9IgusfDcsnPFzUZO/giphy.mp4', speed: 1.2 },
  { id: 'DRN-05', area: 'Sector Delta', battery: 100, signal: 'N/A', time: '0m', status: 'idle', x: 10, y: 80, videoUrl: 'https://media.giphy.com/media/l0HUqJcgOTKkH53f2/giphy.mp4', speed: 1.0 },
  { id: 'DRN-06', area: 'Sector Delta', battery: 98, signal: 'N/A', time: '0m', status: 'idle', x: 15, y: 85, videoUrl: 'https://media.giphy.com/media/l41lVsYDBC0UVQJCE/giphy.mp4', speed: 1.0 },
  { id: 'DRN-07', area: 'Sector Echo', battery: 60, signal: 'Loss', time: '0m', status: 'idle', x: 70, y: 75, interference: true, speed: 1.0 },
  { id: 'DRN-08', area: 'Sector Echo', battery: 58, signal: 'Loss', time: '0m', status: 'idle', x: 75, y: 80, interference: true, speed: 1.0 },
  { id: 'DRN-09', area: 'Sector Foxtrot', battery: 76, signal: 'Degraded', time: '1h 40m', status: 'active', x: 40, y: 65, interference: true, speed: 1.0 },
  { id: 'DRN-10', area: 'Sector Foxtrot', battery: 12, signal: 'Critical', time: '4h 12m', status: 'landing', autoLanding: true, x: 55, y: 55, interference: true, speed: 0.5 },
];

const alertTemplates = [
  { type: 'critical', text: 'Suspicious vehicle detected in Sector Alpha', icon: ShieldAlert },
  { type: 'warning', text: 'Heat signature anomaly near Checkpoint Bravo', icon: AlertTriangle },
  { type: 'info', text: 'Routine perimeter scan completed successfully', icon: Info },
  { type: 'critical', text: 'Unauthorized personnel spotted in Sector Foxtrot', icon: ShieldAlert },
  { type: 'warning', text: 'Signal degradation alert triggered', icon: AlertTriangle },
  { type: 'info', text: 'Automated trajectory corrected for crosswinds', icon: Info },
];

export function DroneProvider({ children }) {
  const [drones, setDrones] = useState(initialDrones);
  const [toasts, setToasts] = useState([]);
  const [logs, setLogs] = useState([
    { id: 1, time: '20:42', droneId: 'DRN-04', type: 'critical', text: 'Intruder detected in Sector 4', icon: ShieldAlert },
    { id: 2, time: '20:38', droneId: 'DRN-02', type: 'info', text: 'Returning to base (low comms)', icon: Info },
    { id: 3, time: '20:15', droneId: 'DRN-01', type: 'success', text: 'Area scan completed', icon: Info }
  ]);

  // Movement simulation
  useEffect(() => {
    const updatePositions = () => {
      setDrones(prev => prev.map(drone => {
        if (drone.status === 'active' || drone.status === 'returning' || drone.status === 'landing' || drone.status === 'recalling') {
          // Add small random noise to coordinates
          const dx = (Math.random() - 0.5) * 0.5 * (drone.speed || 1);
          const dy = (Math.random() - 0.5) * 0.5 * (drone.speed || 1);
          return {
            ...drone,
            x: Math.max(5, Math.min(95, drone.x + dx)),
            y: Math.max(5, Math.min(95, drone.y + dy)),
            battery: drone.status === 'active' ? Math.max(0, drone.battery - 0.01) : drone.battery
          };
        }
        return drone;
      }));
    };

    const interval = setInterval(updatePositions, 1000);
    return () => clearInterval(interval);
  }, []);

  // Alert simulation
  useEffect(() => {
    const spawnRandomEvent = () => {
      const drone = drones[Math.floor(Math.random() * drones.length)];
      const template = alertTemplates[Math.floor(Math.random() * alertTemplates.length)];
      
      const now = new Date();
      const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const newEntry = {
        id: Date.now(),
        time,
        droneId: drone.id,
        ...template
      };

      setToasts(prev => [...prev, newEntry]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== newEntry.id));
      }, 5000);

      setLogs(prev => [newEntry, ...prev].slice(0, 50));

      const nextTime = Math.floor(Math.random() * 8000) + 7000;
      timer = setTimeout(spawnRandomEvent, nextTime);
    };

    let timer = setTimeout(spawnRandomEvent, 10000);
    return () => clearTimeout(timer);
  }, [drones]);

  const handleLaunch = (id) => {
    setDrones(prev => prev.map(d => d.id === id ? { ...d, status: 'launching' } : d));
    setTimeout(() => {
      setDrones(prev => prev.map(d => d.id === id ? { ...d, status: 'active', signal: 'Strong', time: '0m', battery: 100 } : d));
    }, 3000);
  };

  const handleLand = (id) => {
    setDrones(prev => prev.map(d => d.id === id ? { ...d, status: 'landing' } : d));
    setTimeout(() => {
      setDrones(prev => prev.map(d => d.id === id ? { ...d, status: 'idle', signal: 'N/A', time: '0m' } : d));
    }, 3000);
  };

  const handleRecallAll = () => {
    setDrones(prev => prev.map(d => (d.status === 'active' || d.status === 'returning' || d.status === 'launching') ? { ...d, status: 'recalling' } : d));
    setTimeout(() => {
      setDrones(prev => prev.map(d => d.status === 'recalling' ? { ...d, status: 'idle', signal: 'N/A', time: '0m' } : d));
    }, 4000);
  };

  return (
    <DroneContext.Provider value={{ 
      drones, 
      toasts, 
      logs, 
      handleLaunch, 
      handleLand, 
      handleRecallAll 
    }}>
      {children}
    </DroneContext.Provider>
  );
}

export const useDrones = () => useContext(DroneContext);
