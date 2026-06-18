import React, { useState, useEffect, useRef } from 'react';
import { ShieldAlert, Users, Swords, Crosshair, Zap, Activity, AlertTriangle, Camera, Upload } from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, Cell } from 'recharts';
import { useDrones } from '../context/DroneContext';

const DetectionMetric = ({ label, value, color, icon: Icon }) => (
  <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Icon size={18} color={color} />
      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>LIVE ANALYSIS</span>
    </div>
    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{label}</div>
    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: color }}>{value}</div>
    <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
      <div style={{ width: value, height: '100%', background: color, transition: 'width 0.5s ease-out' }} />
    </div>
  </div>
);

export function AIDetection() {
  const { drones } = useDrones();
  const fileInputRef = useRef(null);
  
  const [selectedDroneId, setSelectedDroneId] = useState(drones[0]?.id || '');
  const [customVideoUrl, setCustomVideoUrl] = useState(null);
  const [detectionData, setDetectionData] = useState({
    fightProb: '12%',
    crowdCount: '42',
    weaponThreat: 'LOW',
    aggressionLevel: 15
  });

  const [activeAlert, setActiveAlert] = useState(null);

  const selectedDrone = drones.find(d => d.id === selectedDroneId);
  const activeVideoUrl = customVideoUrl || selectedDrone?.videoUrl || 'https://media.giphy.com/media/l41lN3U3XgHHT0j16/giphy.mp4';

  // Simulation loop
  useEffect(() => {
    const interval = setInterval(() => {
      const fProb = Math.floor(Math.random() * 20) + 5;
      const cCount = Math.floor(Math.random() * 10) + 40;
      const aggression = Math.floor(Math.random() * 30) + 10;
      
      setDetectionData(prev => ({
        ...prev,
        fightProb: `${fProb}%`,
        crowdCount: cCount.toString(),
        aggressionLevel: aggression
      }));

      if (Math.random() > 0.98) {
        setActiveAlert('WEAPON DETECTED');
        setTimeout(() => setActiveAlert(null), 3000);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomVideoUrl(url);
    }
  };

  const chartData = [
    { name: 'Fight', val: parseInt(detectionData.fightProb) },
    { name: 'Crowd', val: (parseInt(detectionData.crowdCount) / 100) * 100 },
    { name: 'Weapon', val: activeAlert ? 95 : 5 },
    { name: 'General', val: 12 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', paddingBottom: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0 }}>AI Tactical Detection</h2>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.875rem' }}>Neural Threat Recognition Suite</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.03)', padding: '4px 8px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
            <Camera size={16} color="var(--text-muted)" />
            <select 
              value={selectedDroneId} 
              onChange={(e) => { setSelectedDroneId(e.target.value); setCustomVideoUrl(null); }}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: '0.875rem', outline: 'none', cursor: 'pointer', paddingRight: '8px' }}
            >
              {drones.map(d => (
                <option key={d.id} value={d.id} style={{ background: 'var(--bg-secondary)' }}>{d.id} - {d.area}</option>
              ))}
            </select>
          </div>
          
          <button 
            className="btn-primary" 
            style={{ fontSize: '0.75rem', padding: '8px 16px' }}
            onClick={() => fileInputRef.current.click()}
          >
            <Upload size={14} /> Upload Video
          </button>
          <input type="file" ref={fileInputRef} hidden accept="video/*" onChange={handleFileUpload} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '24px', flex: 1, minHeight: '500px' }}>
        <div className="glass-panel" style={{ position: 'relative', overflow: 'hidden', background: '#000' }}>
            <video 
              key={activeVideoUrl}
              autoPlay loop muted playsInline 
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5, filter: 'grayscale(40%) contrast(110%)' }}
              src={activeVideoUrl} 
            />

            {/* AI Bounding Boxes Simulation */}
            <div className="detection-box" style={{ position: 'absolute', top: '25%', left: '35%', width: '100px', height: '160px', border: '2px solid #10b981', boxShadow: '0 0 10px #10b98180' }}>
                 <div style={{ position: 'absolute', top: '-22px', left: '-2px', background: '#10b981', color: '#000', fontSize: '9px', fontWeight: 900, padding: '2px 6px' }}>TARGET_A [98%]</div>
            </div>

            {activeAlert && (
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(239, 68, 68, 0.1)', border: '4px solid #ef4444', animation: 'textBlink 0.5s infinite', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
                    <div style={{ background: '#ef4444', color: '#fff', padding: '20px 40px', borderRadius: '4px', textAlign: 'center' }}>
                        <AlertTriangle size={48} style={{ marginBottom: '12px' }} />
                        <h2 style={{ color: '#fff', letterSpacing: '0.2em' }}>{activeAlert}</h2>
                    </div>
                </div>
            )}

            <div style={{ position: 'absolute', top: 24, left: 24 }}>
                <div style={{ fontSize: '10px', color: '#10b981', fontWeight: 800 }}>SOURCE: {customVideoUrl ? 'LOCAL_DISK_UPLINK' : `STREAM_${selectedDroneId}`}</div>
                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>PROCESSING: WEAPON_V3_CNN</div>
            </div>

            <div style={{ position: 'absolute', bottom: 24, right: 24, width: '180px', height: '100px', padding: '12px', background: 'rgba(0,0,0,0.85)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <Bar dataKey="val">
                            {chartData.map((entry, index) => (
                                <Cell key={index} fill={entry.val > 80 ? '#ef4444' : '#10b981'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <DetectionMetric label="Fight Probability" value={detectionData.fightProb} color="#f59e0b" icon={Swords} />
            <DetectionMetric label="Person Density" value={detectionData.crowdCount} color="#3b82f6" icon={Users} />
            <DetectionMetric label="Threat Level" value={activeAlert ? "CRITICAL" : "NORMAL"} color={activeAlert ? "#ef4444" : "#10b981"} icon={ShieldAlert} />
            
            <div className="glass-panel" style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Activity size={18} color="var(--accent-secondary)" /> Intelligence Log
                </h3>
                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ fontSize: '0.75rem', padding: '8px', borderLeft: '2px solid #3b82f6', background: 'rgba(59,130,246,0.05)' }}>
                        <div style={{ color: 'var(--text-muted)', marginBottom: '4px' }}>SYNC_STATUS</div>
                        <div style={{ color: 'var(--text-primary)' }}>Neural weights balanced. Analyzing {customVideoUrl ? 'Uploaded Sample' : selectedDroneId}.</div>
                    </div>
                    {activeAlert && (
                      <div style={{ fontSize: '0.75rem', padding: '8px', borderLeft: '2px solid #ef4444', background: 'rgba(239,68,68,0.1)', animation: 'textBlink 0.5s infinite' }}>
                          <div style={{ color: '#ef4444', fontWeight: 700 }}>AI_ALERT_CRITICAL</div>
                          <div style={{ color: '#fff' }}>Weapon threat detected in current frame.</div>
                      </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
