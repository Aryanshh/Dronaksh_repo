import React, { useState, useEffect } from 'react';
import { Link, Wifi, Play, Cpu, ShieldAlert, CheckCircle, Terminal } from 'lucide-react';
import { useDrones } from '../context/DroneContext';
import { NeumorphicButton } from './NeumorphicButton';
import { NeumorphicProgressBar } from './NeumorphicProgressBar';

export function ConnectionPage() {
  const { setConnection } = useDrones();
  const [connecting, setConnecting] = useState(false);
  const [connectMode, setConnectMode] = useState(null);
  const [logs, setLogs] = useState([]);
  const [progress, setProgress] = useState(0);

  // Form states
  const [port, setPort] = useState('COM3');
  const [baud, setBaud] = useState('115200');
  const [ip, setIp] = useState('192.168.1.100');
  const [udpPort, setUdpPort] = useState('14550');

  const startConnection = (mode) => {
    setConnectMode(mode);
    setConnecting(true);
    setLogs([]);
    setProgress(0);
  };

  useEffect(() => {
    if (!connecting) return;

    let steps = [];
    let details = {};

    if (connectMode === 'uart') {
      details = { port, baud };
      steps = [
        `[SYS] Opening serial port ${port}...`,
        `[SYS] Configuring baud rate to ${baud} bps...`,
        `[SYS] Pinging hardware transceiver module...`,
        `[SYS] Hardware handshake verified. Syncing parameter tables...`,
        `[SYS] Uplink ENGAGED. Receiving active drone state vectors.`
      ];
    } else if (connectMode === 'wifi') {
      details = { ip, port: udpPort };
      steps = [
        `[SYS] Pinging remote IP node ${ip}:${udpPort}...`,
        `[SYS] Creating socket descriptor (UDP/IP)...`,
        `[SYS] Opening incoming telemetry channel...`,
        `[SYS] Telemetry stream synchronization complete (MAVLink v2).`,
        `[SYS] Uplink ENGAGED. Monitoring 10 drone data matrices.`
      ];
    } else {
      details = { type: 'Simulator' };
      steps = [
        `[SYS] Starting local mock telemetry generators...`,
        `[SYS] Seeding random drone coordinates...`,
        `[SYS] Initializing local camera video buffers...`,
        `[SYS] Sandbox virtual environment complete.`,
        `[SYS] Uplink ENGAGED. Loading local operations cockpit.`
      ];
    }

    let logIndex = 0;
    const logInterval = setInterval(() => {
      if (logIndex < steps.length) {
        setLogs(prev => [...prev, steps[logIndex]]);
        setProgress(Math.round(((logIndex + 1) / steps.length) * 100));
        logIndex++;
      } else {
        clearInterval(logInterval);
        // Complete transition after 600ms
        setTimeout(() => {
          setConnection(connectMode, details);
        }, 600);
      }
    }, 450);

    return () => clearInterval(logInterval);
  }, [connecting, connectMode]);

  if (connecting) {
    return (
      <div style={{ position: 'absolute', inset: 0, width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-color)', zIndex: 1000, padding: '24px' }}>
        
        {/* Animated full screen connection overlay box */}
        <div 
          className="nm-flat" 
          style={{ 
            width: '100%', 
            maxWidth: '560px', 
            padding: '32px', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '24px', 
            borderRadius: '24px',
            boxShadow: '-8px -8px 24px var(--highlight-color), 8px 8px 24px var(--shadow-color)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Cpu className="animate-spin" size={24} color="var(--accent-primary)" style={{ animationDuration: '3s' }} />
            <h3 style={{ margin: 0, fontSize: '1.25rem', letterSpacing: '0.05em', color: 'var(--text-primary)' }}>
              ESTABLISHING LINK...
            </h3>
          </div>

          {/* Progress bar container */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)' }}>
              <span>Handshaking Progress</span>
              <span>{progress}%</span>
            </div>
            <NeumorphicProgressBar value={progress} max={100} colorStart="var(--accent-primary)" colorEnd="var(--accent-secondary)" />
          </div>

          {/* Terminal log readouts */}
          <div 
            className="nm-inset" 
            style={{ 
              height: '180px', 
              background: '#090a10', 
              borderRadius: '12px', 
              padding: '16px', 
              fontFamily: 'monospace', 
              fontSize: '11px',
              color: 'var(--text-primary)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              overflowY: 'auto',
              boxShadow: 'inset -2px -2px 5px var(--highlight-color), inset 2px 2px 5px var(--shadow-color)'
            }}
          >
            {logs.map((log, index) => (
              <div 
                key={index} 
                className={index === logs.length - 1 ? "cursor-blink" : ""}
                style={{ 
                  animation: 'terminalLineIn 0.2s ease-out forwards',
                  color: index === steps.length - 1 ? 'var(--status-success)' : 'var(--text-secondary)'
                }}
              >
                {log}
              </div>
            ))}
          </div>

        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'absolute', inset: 0, width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-color)', overflowY: 'auto', padding: '40px 24px' }}>
      
      <div style={{ width: '100%', maxWidth: '1080px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        {/* Title branding */}
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--text-primary)', fontFamily: "'General Sans', sans-serif", letterSpacing: '0.05em', margin: 0 }}>
            UPLINK CONNECTION CONFIGURATION
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.15em', marginTop: '8px', fontWeight: 700 }}>
            Select physical interface to receive aerial intelligence streams
          </p>
        </div>

        {/* 3 columns grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
          
          {/* Card 1: UART Connection */}
          <div className="nm-flat" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px', borderRadius: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="nm-inset" style={{ padding: '10px', borderRadius: '10px', display: 'flex', boxShadow: 'inset -2px -2px 5px var(--highlight-color), inset 2px 2px 5px var(--shadow-color)' }}>
                <Link size={20} color="var(--accent-primary)" />
              </div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--text-primary)' }}>UART Connection</h3>
            </div>
            
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', margin: 0, minHeight: '40px' }}>
              Connect using physical FTDI USB-to-serial telemetry modules.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '8px' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>Serial Port</label>
                <div className="nm-inset" style={{ padding: '8px 12px', borderRadius: '8px', boxShadow: 'inset -2px -2px 5px var(--highlight-color), inset 2px 2px 5px var(--shadow-color)' }}>
                  <select 
                    value={port} 
                    onChange={(e) => setPort(e.target.value)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', width: '100%', cursor: 'pointer', fontFamily: "'Satoshi', sans-serif", fontWeight: 600 }}
                  >
                    <option value="COM1" style={{ background: 'var(--bg-color)', color: 'var(--text-primary)' }}>COM1 (Direct Serial)</option>
                    <option value="COM2" style={{ background: 'var(--bg-color)', color: 'var(--text-primary)' }}>COM2</option>
                    <option value="COM3" style={{ background: 'var(--bg-color)', color: 'var(--text-primary)' }}>COM3 (Telemetry Radio)</option>
                    <option value="COM4" style={{ background: 'var(--bg-color)', color: 'var(--text-primary)' }}>COM4</option>
                    <option value="/dev/ttyUSB0" style={{ background: 'var(--bg-color)', color: 'var(--text-primary)' }}>/dev/ttyUSB0 (Linux USB)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>Baud Rate</label>
                <div className="nm-inset" style={{ padding: '8px 12px', borderRadius: '8px', boxShadow: 'inset -2px -2px 5px var(--highlight-color), inset 2px 2px 5px var(--shadow-color)' }}>
                  <select 
                    value={baud} 
                    onChange={(e) => setBaud(e.target.value)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', width: '100%', cursor: 'pointer', fontFamily: "'Satoshi', sans-serif", fontWeight: 600 }}
                  >
                    <option value="9600" style={{ background: 'var(--bg-color)', color: 'var(--text-primary)' }}>9600 bps</option>
                    <option value="38400" style={{ background: 'var(--bg-color)', color: 'var(--text-primary)' }}>38400 bps</option>
                    <option value="57600" style={{ background: 'var(--bg-color)', color: 'var(--text-primary)' }}>57600 bps</option>
                    <option value="115200" style={{ background: 'var(--bg-color)', color: 'var(--text-primary)' }}>115200 bps (Recommended)</option>
                  </select>
                </div>
              </div>

            </div>

            <NeumorphicButton onClick={() => startConnection('uart')} style={{ marginTop: 'auto', height: '44px' }}>
              <span>Establish UART Uplink</span>
            </NeumorphicButton>
          </div>

          {/* Card 2: Wifi Connection */}
          <div className="nm-flat" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px', borderRadius: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="nm-inset" style={{ padding: '10px', borderRadius: '10px', display: 'flex', boxShadow: 'inset -2px -2px 5px var(--highlight-color), inset 2px 2px 5px var(--shadow-color)' }}>
                <Wifi size={20} color="var(--status-success)" />
              </div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--text-primary)' }}>Wi-Fi / UDP Socket</h3>
            </div>
            
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', margin: 0, minHeight: '40px' }}>
              Connect over local IP routing networks and sync MAVLink streams.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '8px' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>Host IP Address</label>
                <input 
                  type="text" 
                  value={ip}
                  onChange={(e) => setIp(e.target.value)}
                  className="nm-inset"
                  style={{ 
                    border: 'none', 
                    color: 'var(--text-primary)', 
                    padding: '10px 12px', 
                    borderRadius: '8px', 
                    outline: 'none',
                    fontFamily: "'Satoshi', sans-serif",
                    fontWeight: 600,
                    boxShadow: 'inset -2px -2px 5px var(--highlight-color), inset 2px 2px 5px var(--shadow-color)'
                  }} 
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>UDP Port</label>
                <input 
                  type="number" 
                  value={udpPort}
                  onChange={(e) => setUdpPort(e.target.value)}
                  className="nm-inset"
                  style={{ 
                    border: 'none', 
                    color: 'var(--text-primary)', 
                    padding: '10px 12px', 
                    borderRadius: '8px', 
                    outline: 'none',
                    fontFamily: "'Satoshi', sans-serif",
                    fontWeight: 600,
                    boxShadow: 'inset -2px -2px 5px var(--highlight-color), inset 2px 2px 5px var(--shadow-color)'
                  }} 
                />
              </div>

            </div>

            <NeumorphicButton onClick={() => startConnection('wifi')} style={{ marginTop: 'auto', height: '44px' }}>
              <span>Establish Wi-Fi Uplink</span>
            </NeumorphicButton>
          </div>

          {/* Card 3: Demo simulation mode */}
          <div className="nm-flat" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px', borderRadius: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="nm-inset" style={{ padding: '10px', borderRadius: '10px', display: 'flex', boxShadow: 'inset -2px -2px 5px var(--highlight-color), inset 2px 2px 5px var(--shadow-color)' }}>
                <Play size={20} color="var(--status-warning)" />
              </div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--text-primary)' }}>Simulation Mode</h3>
            </div>
            
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', margin: 0, minHeight: '40px' }}>
              Inspect and test platform parameters using simulated local drone telemetry.
            </p>

            <div 
              className="nm-inset" 
              style={{ 
                padding: '16px', 
                borderRadius: '12px', 
                fontSize: '0.8rem', 
                color: 'var(--text-secondary)', 
                display: 'flex', 
                gap: '10px', 
                marginTop: '8px',
                boxShadow: 'inset -2px -2px 5px var(--highlight-color), inset 2px 2px 5px var(--shadow-color)'
              }}
            >
              <ShieldAlert size={28} color="var(--status-warning)" style={{ flexShrink: 0 }} />
              <div>
                <strong style={{ color: 'var(--text-primary)' }}>Offline Sandbox:</strong> Hardware interfaces and cellular transceivers are bypassed. Ideal for user interface walk-throughs.
              </div>
            </div>

            <NeumorphicButton onClick={() => startConnection('demo')} style={{ marginTop: 'auto', height: '44px' }}>
              <span>Initialize Demo Mode</span>
            </NeumorphicButton>
          </div>

        </div>

      </div>
    </div>
  );
}
