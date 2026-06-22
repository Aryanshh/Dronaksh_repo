import React, { useState, useEffect, useRef } from 'react';
import { ShieldAlert, Users, Swords, Crosshair, Zap, Activity, AlertTriangle, Camera, Upload, ShieldCheck, Loader2 } from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, Cell } from 'recharts';
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import { useDrones } from '../context/DroneContext';
import { NeumorphicButton } from './NeumorphicButton';
import { NeumorphicProgressBar } from './NeumorphicProgressBar';

const DetectionMetric = ({ label, value, color, icon: Icon }) => {
  const valPercent = typeof value === 'string' && value.endsWith('%') ? parseInt(value) : (parseInt(value) || 0);

  return (
    <div className="nm-flat" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ color: color, display: 'flex', alignItems: 'center' }}>
          <Icon size={18} />
        </div>
        <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>LIVE ANALYTICS</span>
      </div>
      <div>
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{label}</div>
        <div style={{ fontSize: '22px', fontWeight: 700, color: color, fontFamily: "'General Sans', sans-serif", marginTop: '2px' }}>{value}</div>
      </div>
      <NeumorphicProgressBar 
        value={valPercent} 
        max={100} 
        colorStart={color} 
        colorEnd={color} 
        glow={valPercent > 40}
      />
    </div>
  );
};

export function AIDetection() {
  const { drones } = useDrones();
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  
  const [selectedDroneId, setSelectedDroneId] = useState(drones[0]?.id || '');
  const [customVideoUrl, setCustomVideoUrl] = useState(null);
  const [model, setModel] = useState(null);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [detectedObjects, setDetectedObjects] = useState([]);
  
  const [detectionData, setDetectionData] = useState({
    fightProb: '0%',
    crowdCount: '0',
    weaponThreat: 'LOW',
    aggressionLevel: 0
  });

  const [activeAlert, setActiveAlert] = useState(null);

  const selectedDrone = drones.find(d => d.id === selectedDroneId);
  const activeVideoUrl = customVideoUrl || selectedDrone?.videoUrl || 'https://media.giphy.com/media/l41lN3U3XgHHT0j16/giphy.mp4';

  // Load TensorFlow COCO-SSD model
  useEffect(() => {
    async function loadModel() {
      setIsModelLoading(true);
      try {
        await tf.ready();
        const loadedModel = await cocoSsd.load({ base: 'lite_mobilenet_v2' });
        setModel(loadedModel);
      } catch (err) {
        console.error("Failed to load TensorFlow model", err);
      } finally {
        setIsModelLoading(false);
      }
    }
    loadModel();
  }, []);

  // Throttled detection loop (runs every 180ms to avoid UI thread lag)
  useEffect(() => {
    if (!model) return;

    let active = true;
    let timeoutId = null;

    const detectFrame = async () => {
      if (!active) return;

      const video = videoRef.current;
      if (video && video.readyState >= 2) {
        try {
          const predictions = await model.detect(video);
          const filtered = predictions.filter(p => p.score > 0.45);

          if (active) {
            setDetectedObjects(filtered);

            // Compute metrics from predictions
            const persons = filtered.filter(p => p.class === 'person');
            const suspiciousItems = filtered.filter(p => ['scissors', 'knife', 'cell phone', 'umbrella'].includes(p.class));

            const crowdCountVal = persons.length;
            let fightProbVal = 0;

            if (persons.length >= 2) {
              let minDistance = Infinity;
              for (let i = 0; i < persons.length; i++) {
                for (let j = i + 1; j < persons.length; j++) {
                  const b1 = persons[i].bbox;
                  const b2 = persons[j].bbox;
                  const c1x = b1[0] + b1[2] / 2;
                  const c1y = b1[1] + b1[3] / 2;
                  const c2x = b2[0] + b2[2] / 2;
                  const c2y = b2[1] + b2[3] / 2;
                  const dist = Math.sqrt(Math.pow(c1x - c2x, 2) + Math.pow(c1y - c2y, 2));
                  if (dist < minDistance) minDistance = dist;
                }
              }
              if (minDistance < 250) {
                fightProbVal = Math.min(Math.floor(65 + (250 - minDistance) * 0.15), 98);
              } else {
                fightProbVal = Math.floor(Math.random() * 10) + 15;
              }
            } else if (persons.length === 1) {
              fightProbVal = Math.floor(Math.random() * 5) + 5;
            }

            const isThreatActive = suspiciousItems.length > 0;
            const aggression = Math.min(Math.floor(fightProbVal * 0.8) + (isThreatActive ? 35 : 0), 100);

            setDetectionData({
              fightProb: `${fightProbVal}%`,
              crowdCount: crowdCountVal.toString(),
              weaponThreat: isThreatActive ? 'CRITICAL' : 'LOW',
              aggressionLevel: aggression
            });

            if (isThreatActive) {
              const detectedLabel = suspiciousItems[0].class === 'cell phone' ? 'SUSPICIOUS OBJECT' : suspiciousItems[0].class.toUpperCase();
              setActiveAlert(`${detectedLabel} DETECTED`);
            } else {
              setActiveAlert(null);
            }
          }
        } catch (e) {
          console.error("Frame detection error:", e);
        }
      }

      if (active) {
        timeoutId = setTimeout(detectFrame, 180);
      }
    };

    detectFrame();

    return () => {
      active = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [model, activeVideoUrl]);

  // Real-time canvas drawing overlay
  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const rect = video.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    const videoWidth = video.videoWidth || 1;
    const videoHeight = video.videoHeight || 1;
    const scaleX = rect.width / videoWidth;
    const scaleY = rect.height / videoHeight;

    detectedObjects.forEach(obj => {
      const [x, y, width, height] = obj.bbox;
      const drawX = x * scaleX;
      const drawY = y * scaleY;
      const drawWidth = width * scaleX;
      const drawHeight = height * scaleY;

      let strokeColor = '#3b82f6';
      if (obj.class === 'person') {
        strokeColor = '#10b981';
      } else if (['scissors', 'knife', 'cell phone', 'umbrella'].includes(obj.class)) {
        strokeColor = '#ef4444';
      }

      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 2.5;
      ctx.strokeRect(drawX, drawY, drawWidth, drawHeight);

      ctx.fillStyle = strokeColor;
      const markerSize = 6;
      ctx.fillRect(drawX - 1, drawY - 1, markerSize, markerSize);
      ctx.fillRect(drawX + drawWidth - markerSize + 1, drawY - 1, markerSize, markerSize);
      ctx.fillRect(drawX - 1, drawY + drawHeight - markerSize + 1, markerSize, markerSize);
      ctx.fillRect(drawX + drawWidth - markerSize + 1, drawY + drawHeight - markerSize + 1, markerSize, markerSize);

      const scorePercentage = Math.round(obj.score * 100);
      const labelText = `${obj.class.toUpperCase()} [${scorePercentage}%]`;
      ctx.font = 'bold 9px monospace';
      const textWidth = ctx.measureText(labelText).width;
      
      ctx.fillRect(drawX - 1.2, drawY - 16, textWidth + 8, 16);

      ctx.fillStyle = '#000000';
      ctx.fillText(labelText, drawX + 3, drawY - 5);
    });
  }, [detectedObjects]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomVideoUrl(url);
    }
  };

  const chartData = [
    { name: 'Fight', val: parseInt(detectionData.fightProb) },
    { name: 'Crowd', val: Math.min((parseInt(detectionData.crowdCount) / 10) * 100, 100) },
    { name: 'Weapon', val: activeAlert ? 95 : 5 },
    { name: 'Aggression', val: detectionData.aggressionLevel },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', paddingBottom: '24px' }}>
      
      {/* Title & Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, color: 'var(--text-primary)' }}>AI Tactical Detection</h2>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.875rem' }}>Neural Threat Recognition Suite</p>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          
          {/* Dropdown Styled Neumorphically */}
          <div 
            className="nm-flat" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px', 
              padding: '6px 14px', 
              borderRadius: '12px',
              height: '42px'
            }}
          >
            <Camera size={16} color="var(--text-muted)" />
            <select 
              value={selectedDroneId} 
              onChange={(e) => { setSelectedDroneId(e.target.value); setCustomVideoUrl(null); }}
              style={{ 
                background: 'transparent', 
                border: 'none', 
                color: 'var(--text-primary)', 
                fontSize: '0.875rem', 
                outline: 'none', 
                cursor: 'pointer', 
                paddingRight: '4px',
                fontFamily: "'Satoshi', sans-serif",
                fontWeight: 600
              }}
            >
              {drones.map(d => (
                <option key={d.id} value={d.id} style={{ background: 'var(--bg-color)', color: 'var(--text-primary)' }}>{d.id} - {d.area}</option>
              ))}
            </select>
          </div>
          
          <NeumorphicButton 
            style={{ height: '42px' }}
            onClick={() => fileInputRef.current.click()}
          >
            <Upload size={16} />
            <span>Upload Video</span>
          </NeumorphicButton>
          <input type="file" ref={fileInputRef} hidden accept="video/*" onChange={handleFileUpload} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1.3fr', gap: '24px', flex: 1, minHeight: '520px' }}>
        
        {/* Main Feed Panel */}
        <div 
          className="nm-flat" 
          style={{ 
            position: 'relative', 
            overflow: 'hidden', 
            background: '#090a10', 
            borderRadius: '16px',
            boxShadow: '-6px -6px 12px var(--highlight-color), 6px 6px 12px var(--shadow-color)',
            padding: '16px'
          }}
        >
          <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', borderRadius: '12px' }}>
            <video 
              key={activeVideoUrl}
              ref={videoRef}
              autoPlay loop muted playsInline 
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.55 }}
              src={activeVideoUrl} 
            />

            {/* Neural Canvas Overlay */}
            <canvas 
              ref={canvasRef} 
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 10 }}
            />

            {isModelLoading && (
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(9,10,16,0.92)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 50, gap: '16px' }}>
                <Loader2 className="animate-spin" size={36} color="var(--accent-primary)" />
                <div style={{ fontSize: '10px', color: 'var(--accent-primary)', fontWeight: 700, fontFamily: 'monospace', letterSpacing: '0.15em' }}>LOADING TACTICAL NEURAL WEIGHTS...</div>
              </div>
            )}

            {activeAlert && (
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(239, 68, 68, 0.12)', border: '4px solid var(--status-danger)', animation: 'textBlink 0.5s infinite', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
                <div className="nm-flat" style={{ padding: '24px 40px', borderRadius: '12px', textAlign: 'center', color: 'var(--status-danger)', boxShadow: '0 10px 30px rgba(239, 68, 68, 0.2)' }}>
                  <AlertTriangle size={48} style={{ marginBottom: '12px', color: 'var(--status-danger)' }} />
                  <h2 style={{ color: 'var(--status-danger)', letterSpacing: '0.15em', margin: 0 }}>{activeAlert}</h2>
                </div>
              </div>
            )}

            <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 20, background: 'rgba(30,32,48,0.85)', padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: '10px', color: 'var(--status-success)', fontWeight: 800 }}>SOURCE: {customVideoUrl ? 'LOCAL_DISK_UPLINK' : `STREAM_${selectedDroneId}`}</div>
              <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginTop: '2px' }}>ENGINE: COCO_SSD_MOBILENET_V2</div>
            </div>

            {/* Neural activity bar preview inside feed */}
            <div style={{ position: 'absolute', bottom: 16, right: 16, width: '180px', height: '80px', padding: '10px', background: 'rgba(30,32,48,0.85)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', zIndex: 20 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <Bar dataKey="val">
                    {chartData.map((entry, index) => (
                      <Cell key={index} fill={entry.val > 75 ? 'var(--status-danger)' : 'var(--status-success)'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Metrics Grid and Engine Log */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <DetectionMetric label="Fight Prob" value={detectionData.fightProb} color="var(--status-warning)" icon={Swords} />
            <DetectionMetric label="Person Density" value={detectionData.crowdCount} color="var(--accent-primary)" icon={Users} />
          </div>

          <div className="nm-flat" style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '1.125rem', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-primary)' }}>
              <Activity size={18} color="var(--accent-secondary)" />
              <span>Intelligence Feed Log</span>
            </h3>
            
            <div 
              className="nm-inset" 
              style={{ 
                flex: 1, 
                borderRadius: '12px', 
                padding: '16px', 
                fontFamily: 'monospace', 
                fontSize: '11px',
                color: 'var(--text-primary)',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                overflowY: 'auto'
              }}
            >
              <div style={{ display: 'flex', gap: '8px', borderLeft: '2px solid var(--accent-primary)', paddingLeft: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>[SYS]</span>
                <span>Neural weights balanced. Analyzing {customVideoUrl ? 'Uploaded Sample' : selectedDroneId}.</span>
              </div>
              
              {isModelLoading ? (
                <div style={{ display: 'flex', gap: '8px', borderLeft: '2px solid var(--status-warning)', paddingLeft: '8px', color: 'var(--status-warning)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>[SYS]</span>
                  <span>Downloading COCO-SSD pretrained models (lite weight)...</span>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '8px', borderLeft: '2px solid var(--status-success)', paddingLeft: '8px', color: 'var(--status-success)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>[SYS]</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><ShieldCheck size={12} /> engine ready. listening on feed stream.</span>
                </div>
              )}

              {activeAlert && (
                <div className="blink-text" style={{ display: 'flex', gap: '8px', borderLeft: '2px solid var(--status-danger)', paddingLeft: '8px', color: 'var(--status-danger)', fontWeight: 700 }}>
                  <span style={{ color: 'var(--text-muted)' }}>[ALERT]</span>
                  <span>Threat recognized: {activeAlert}</span>
                </div>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
