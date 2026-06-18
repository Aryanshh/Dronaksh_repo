import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, Lock, User, Mail, ArrowLeft, ShieldCheck, AlertCircle } from 'lucide-react';

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
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#3b82f6';
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

  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, opacity: 0.8, pointerEvents: 'none' }} />;
};

export function LoginPage() {
  const navigate = useNavigate();
  const [view, setView] = useState('login'); // 'login' | 'forgot' | 'reset-success'
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
      setError('MISSION ERROR: Terminal access requires full credentials.');
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
      setError('ENTRY ERROR: Email/Operator ID required for recovery.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setView('reset-success');
    }, 2000);
  };

  return (
    <div style={{ position: 'absolute', inset: 0, width: '100vw', height: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      <MatrixDigitalRain />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 50%, transparent 20%, #000 100%)', pointerEvents: 'none' }} />

      <div className="glass-panel" style={{ width: '100%', maxWidth: '420px', padding: '40px', position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '24px', border: '1px solid rgba(59, 130, 246, 0.2)', boxShadow: '0 0 40px rgba(59, 130, 246, 0.1)' }}>
        
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
            <div style={{ padding: '16px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '50%', border: '1px solid rgba(59, 130, 246, 0.3)', boxShadow: '0 0 30px rgba(59, 130, 246, 0.4)' }}>
              <Plane size={32} color="#3b82f6" />
            </div>
          </div>
          <h2 style={{ margin: 0, fontSize: '2rem', letterSpacing: '0.05em', color: '#fff', textShadow: '0 0 10px rgba(59, 130, 246, 0.5)' }}>DRONAKSH</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', margin: '8px 0 0 0', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.75rem' }}>Tactical Command Interface</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', padding: '12px', borderRadius: '4px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={14} /> {error}
          </div>
        )}

        <div style={{ background: 'rgba(59, 130, 246, 0.05)', border: '1px dashed rgba(59, 130, 246, 0.3)', padding: '12px', borderRadius: '6px', fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)', textAlign: 'center', fontFamily: 'monospace' }}>
          Uplink Credentials: <span style={{ color: '#3b82f6', fontWeight: 700 }}>operator01</span> / <span style={{ color: '#3b82f6', fontWeight: 700 }}>password123</span>
        </div>

        {view === 'login' && (
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Operator ID</label>
              <div style={{ position: 'relative' }}>
                <User size={18} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="operator01"
                  style={{ width: '100%', padding: '12px 16px 12px 44px', background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(59, 130, 246, 0.2)', color: '#fff', borderRadius: '8px', outline: 'none', transition: 'border-color 0.2s', fontSize: '0.875rem' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Clearance Key</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="password123"
                  style={{ width: '100%', padding: '12px 16px 12px 44px', background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(59, 130, 246, 0.2)', color: '#fff', borderRadius: '8px', outline: 'none', transition: 'border-color 0.2s', fontSize: '0.875rem' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>
                <input type="checkbox" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} style={{ opacity: 0.3 }} />
                Keep Session Active
              </label>
              <button 
                type="button"
                onClick={() => { setView('forgot'); setError(''); }}
                style={{ background: 'none', border: 'none', color: '#3b82f6', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}
              >
                Access Recovery?
              </button>
            </div>

            <button type="submit" disabled={loading} className="menu-btn" style={{ marginTop: '8px', padding: '14px', background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.4)', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer', letterSpacing: '0.1em' }}>
              {loading ? <span className="blink-text">VALIDATING CREDENTIALS...</span> : 'INITIATE TERMINAL ACCESS'}
            </button>
          </form>
        )}

        {view === 'forgot' && (
          <form onSubmit={handleResetRequest} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <h3 style={{ margin: 0, fontSize: '1rem', color: '#fff' }}>Account Recovery</h3>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>Enter your registered Operator ID or Email linked to this terminal.</p>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ position: 'relative' }}>
                <Mail size={18} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="operator@dronaksh.gov"
                  style={{ width: '100%', padding: '12px 16px 12px 44px', background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(59, 130, 246, 0.2)', color: '#fff', borderRadius: '8px', outline: 'none', fontSize: '0.875rem' }}
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="menu-btn" style={{ padding: '14px', background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.4)', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'SENDING RECOVERY ENCRYPTION...' : 'REQUEST OVERRIDE KEY'}
            </button>

            <button 
              type="button" 
              onClick={() => setView('login')}
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <ArrowLeft size={14} /> Back to Login
            </button>
          </form>
        )}

        {view === 'reset-success' && (
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '16px', padding: '20px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <ShieldCheck size={48} color="#10b981" />
            </div>
            <div>
              <h3 style={{ margin: 0, color: '#fff' }}>Recovery Link Sent</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '8px' }}>Verification key has been dispatched to your encrypted uplink.</p>
            </div>
            <button 
              onClick={() => setView('login')}
              className="btn-primary"
              style={{ marginTop: '12px', padding: '12px' }}
            >
              Return to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
