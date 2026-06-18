import React, { useState, useEffect, useRef } from 'react';
import { ShieldAlert, Users, Swords, Crosshair, Zap, Activity, AlertTriangle, Camera, Upload, ShieldCheck, Loader2 } from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, Cell } from 'recharts';
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
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
      <div style={{ width: typeof value === 'string' && value.endsWith('%') ? value : `${(parseInt(value) || 0)}%`, height: '100%', background: color, transition: 'width 0.5s ease-out' }} />
    </div>
  </div>
);

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
            const vehicles = filtered.filter(p => ['car', 'truck', 'bus', 'motorcycle', 'bicycle'].includes(p.class));
            
            // For demo convenience, flag scissors, knives, or cell phones as suspicious items / mock weapons
            const suspiciousItems = filtered.filter(p => ['scissors', 'knife', 'cell phone', 'umbrella'].includes(p.class));

            const crowdCountVal = persons.length;
            let fightProbVal = 0;

            // Fight prediction calculation based on physical proximity of bounding boxes
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
              // Overlapping/touching boxes imply aggression
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

      // Color scheme based on classification
      let strokeColor = '#3b82f6'; // vehicle / general
      if (obj.class === 'person') {
        strokeColor = '#10b981'; // person
      } else if (['scissors', 'knife', 'cell phone', 'umbrella'].includes(obj.class)) {
        strokeColor = '#ef4444'; // threat
      }

      // Bounding Box
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 2.5;
      ctx.strokeRect(drawX, drawY, drawWidth, drawHeight);

      // Box corner design accent
      ctx.fillStyle = strokeColor;
      const markerSize = 6;
      ctx.fillRect(drawX - 1, drawY - 1, markerSize, markerSize);
      ctx.fillRect(drawX + drawWidth - markerSize + 1, drawY - 1, markerSize, markerSize);
      ctx.fillRect(drawX - 1, drawY + drawHeight - markerSize + 1, markerSize, markerSize);
      ctx.fillRect(drawX + drawWidth - markerSize + 1, drawY + drawHeight - markerSize + 1, markerSize, markerSize);

      // Label block
      const scorePercentage = Math.round(obj.score * 100);
      const labelText = `${obj.class.toUpperCase()} [${scorePercentage}%]`;
      ctx.font = 'bold 9px monospace';
      const textWidth = ctx.measureText(labelText).width;
      
      ctx.fillRect(drawX - 1.2, drawY - 16, textWidth + 8, 16);

      // Label text
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
              ref={videoRef}
              autoPlay loop muted playsInline 
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }}
              src={activeVideoUrl} 
            />

            {/* Neural Canvas Overlay */}
            <canvas 
              ref={canvasRef} 
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 10 }}
            />

            {isModelLoading && (
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 50, gap: '16px' }}>
                <Loader2 className="animate-spin" size={36} color="#3b82f6" />
                <div style={{ fontSize: '0.8rem', color: '#3b82f6', fontWeight: 700, fontFamily: 'monospace', letterSpacing: '0.15em' }}>LOADING PRETRAINED TACTICAL NEURAL WEIGHTS...</div>
              </div>
            )}

            {activeAlert && (
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(239, 68, 68, 0.1)', border: '4px solid #ef4444', animation: 'textBlink 0.5s infinite', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
                    <div style={{ background: '#ef4444', color: '#fff', padding: '20px 40px', borderRadius: '4px', textAlign: 'center' }}>
                        <AlertTriangle size={48} style={{ marginBottom: '12px' }} />
                        <h2 style={{ color: '#fff', letterSpacing: '0.2em' }}>{activeAlert}</h2>
                    </div>
                </div>
            )}

            <div style={{ position: 'absolute', top: 24, left: 24, zIndex: 20 }}>
                <div style={{ fontSize: '10px', color: '#10b981', fontWeight: 800 }}>SOURCE: {customVideoUrl ? 'LOCAL_DISK_UPLINK' : `STREAM_${selectedDroneId}`}</div>
                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>PROCESSING: COCO_SSD_LITE</div>
            </div>

            <div style={{ position: 'absolute', bottom: 24, right: 24, width: '180px', height: '100px', padding: '12px', background: 'rgba(0,0,0,0.85)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', zIndex: 20 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <Bar dataKey="val">
                            {chartData.map((entry, index) => (
                                <Cell key={index} fill={entry.val > 75 ? '#ef4444' : '#10b981'} />
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
                    {isModelLoading && (
                      <div style={{ fontSize: '0.75rem', padding: '8px', borderLeft: '2px solid #f59e0b', background: 'rgba(245,158,11,0.05)' }}>
                          <div style={{ color: '#f59e0b', fontWeight: 700 }}>NEURAL_LOAD</div>
                          <div style={{ color: 'var(--text-primary)' }}>Downloading COCO-SSD pretrained models (lite weight)...</div>
                      </div>
                    )}
                    {!isModelLoading && (
                      <div style={{ fontSize: '0.75rem', padding: '8px', borderLeft: '2px solid #10b981', background: 'rgba(16,185,129,0.05)', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <div style={{ color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}><ShieldCheck size={12} /> ENGINE_READY</div>
                          <div style={{ color: 'var(--text-primary)' }}>Pretrained COCO SSD detector listening on feed stream.</div>
                      </div>
                    )}
                    {activeAlert && (
                      <div style={{ fontSize: '0.75rem', padding: '8px', borderLeft: '2px solid #ef4444', background: 'rgba(239,68,68,0.1)', animation: 'textBlink 0.5s infinite' }}>
                          <div style={{ color: '#ef4444', fontWeight: 700 }}>AI_ALERT_CRITICAL</div>
                          <div style={{ color: '#fff' }}>Threat recognized: {activeAlert}</div>
                      </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
