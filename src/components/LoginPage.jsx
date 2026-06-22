import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, Lock, User, Mail, ArrowLeft, ShieldCheck, AlertCircle } from 'lucide-react';
import { NeumorphicButton } from './NeumorphicButton';

const MatrixDigitalRain = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*'.split('');
    const fontSize = 16;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);

    const draw = () => {
      // Determine theme background color for clearRect fill
      const theme = document.documentElement.getAttribute('data-theme') || 'dark';
      ctx.fillStyle = theme === 'light' ? 'rgba(224, 229, 236, 0.08)' : 'rgba(30, 32, 48, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = theme === 'light' ? '#4f46e5' : '#6366f1';
      ctx.font = fontSize + 'px monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };
    
    const interval = setInterval(draw, 40);
    window.addEventListener('resize', setCanvasSize);
    
    return () => { 
      clearInterval(interval); 
      window.removeEventListener('resize', setCanvasSize); 
    };
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, opacity: 0.25, pointerEvents: 'none' }} />;
};

export function LoginPage() {
  const navigate = useNavigate();
  const [view, setView] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    
    if (!username || !password) {
      setError('MISSION ERROR: Terminal access requires credentials.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      navigate('/dashboard');
    }, 1500);
  };

  const handleResetRequest = (e) => {
    e.preventDefault();
    if (!email) {
      setError('ENTRY ERROR: Email required for recovery.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setView('reset-success');
    }, 2000);
  };

  return (
    <div style={{ position: 'absolute', inset: 0, width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', backgroundColor: 'var(--bg-color)' }}>
      <MatrixDigitalRain />
      
      {/* Decorative gradient radial overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 50%, transparent 30%, var(--bg-color) 100%)', pointerEvents: 'none' }} />

      {/* Main card */}
      <div 
        className="nm-flat" 
        style={{ 
          width: '100%', 
          maxWidth: '430px', 
          padding: '40px', 
          position: 'relative', 
          zIndex: 10, 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '24px',
          boxShadow: '-8px -8px 20px var(--highlight-color), 8px 8px 20px var(--shadow-color)',
          borderRadius: '24px'
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
            <div 
              className="nm-inset animate-float-bob" 
              style={{ 
                padding: '16px', 
                borderRadius: '50%', 
                display: 'inline-flex',
                boxShadow: 'inset -3px -3px 6px var(--highlight-color), inset 3px 3px 6px var(--shadow-color)'
              }}
            >
              <Plane size={32} color="var(--accent-primary)" />
            </div>
          </div>
          <h2 style={{ margin: 0, fontSize: '2rem', letterSpacing: '0.05em', color: 'var(--text-primary)', fontFamily: "'General Sans', sans-serif" }}>DRONAKSH</h2>
          <p style={{ color: 'var(--text-muted)', margin: '6px 0 0 0', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.75rem', fontWeight: 700 }}>Tactical Command Interface</p>
        </div>

        {error && (
          <div className="nm-inset" style={{ padding: '12px 16px', borderRadius: '8px', color: 'var(--status-danger)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: 'inset -2px -2px 5px var(--highlight-color), inset 2px 2px 5px var(--shadow-color)' }}>
            <AlertCircle size={16} /> <span>{error}</span>
          </div>
        )}

        <div className="nm-inset" style={{ padding: '12px 16px', borderRadius: '12px', fontSize: '11px', color: 'var(--text-secondary)', textAlign: 'center', fontFamily: 'monospace', boxShadow: 'inset -2px -2px 5px var(--highlight-color), inset 2px 2px 5px var(--shadow-color)' }}>
          Uplink Credentials: <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>operator01</span> / <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>password123</span>
        </div>

        {view === 'login' && (
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Operator ID</label>
              <div 
                className="nm-inset" 
                style={{ 
                  position: 'relative',
                  borderRadius: '10px',
                  boxShadow: 'inset -2px -2px 5px var(--highlight-color), inset 2px 2px 5px var(--shadow-color)',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <User size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '16px' }} />
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="operator01"
                  style={{ 
                    width: '100%', 
                    padding: '12px 16px 12px 46px', 
                    background: 'transparent', 
                    border: 'none', 
                    color: 'var(--text-primary)', 
                    borderRadius: '10px', 
                    outline: 'none', 
                    fontSize: '14px',
                    fontFamily: "'Satoshi', sans-serif"
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Clearance Key</label>
              <div 
                className="nm-inset" 
                style={{ 
                  position: 'relative',
                  borderRadius: '10px',
                  boxShadow: 'inset -2px -2px 5px var(--highlight-color), inset 2px 2px 5px var(--shadow-color)',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Lock size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '16px' }} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="password123"
                  style={{ 
                    width: '100%', 
                    padding: '12px 16px 12px 46px', 
                    background: 'transparent', 
                    border: 'none', 
                    color: 'var(--text-primary)', 
                    borderRadius: '10px', 
                    outline: 'none', 
                    fontSize: '14px',
                    fontFamily: "'Satoshi', sans-serif"
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                <input type="checkbox" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} style={{ cursor: 'pointer' }} />
                <span>Keep Session Active</span>
              </label>
              <button 
                type="button"
                onClick={() => { setView('forgot'); setError(''); }}
                style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 700 }}
              >
                Access Recovery?
              </button>
            </div>

            <NeumorphicButton 
              type="submit" 
              disabled={loading} 
              style={{ marginTop: '8px', height: '48px' }}
            >
              {loading ? <span className="blink-text">VALIDATING CREDENTIALS...</span> : 'INITIATE TERMINAL ACCESS'}
            </NeumorphicButton>
          </form>
        )}

        {view === 'forgot' && (
          <form onSubmit={handleResetRequest} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <h3 style={{ margin: 0, fontSize: '1.125rem', color: 'var(--text-primary)' }}>Account Recovery</h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Enter your registered Email linked to this terminal.</p>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div 
                className="nm-inset" 
                style={{ 
                  position: 'relative',
                  borderRadius: '10px',
                  boxShadow: 'inset -2px -2px 5px var(--highlight-color), inset 2px 2px 5px var(--shadow-color)',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Mail size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '16px' }} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="operator@dronaksh.gov"
                  style={{ 
                    width: '100%', 
                    padding: '12px 16px 12px 46px', 
                    background: 'transparent', 
                    border: 'none', 
                    color: 'var(--text-primary)', 
                    borderRadius: '10px', 
                    outline: 'none', 
                    fontSize: '14px',
                    fontFamily: "'Satoshi', sans-serif"
                  }}
                />
              </div>
            </div>

            <NeumorphicButton type="submit" disabled={loading} style={{ height: '48px' }}>
              {loading ? 'SENDING RECOVERY ENCRYPTION...' : 'REQUEST OVERRIDE KEY'}
            </NeumorphicButton>

            <button 
              type="button" 
              onClick={() => setView('login')}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 600 }}
            >
              <ArrowLeft size={14} /> Back to Login
            </button>
          </form>
        )}

        {view === 'reset-success' && (
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '16px', padding: '10px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <ShieldCheck size={48} color="var(--status-success)" />
            </div>
            <div>
              <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>Recovery Link Sent</h3>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '8px' }}>Verification key has been dispatched to your encrypted uplink.</p>
            </div>
            <NeumorphicButton 
              onClick={() => setView('login')}
              style={{ marginTop: '12px', height: '44px' }}
            >
              Return to Login
            </NeumorphicButton>
          </div>
        )}
      </div>
    </div>
  );
}
