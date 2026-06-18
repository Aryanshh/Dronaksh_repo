import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane } from 'lucide-react';

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ position: 'absolute', inset: 0, width: '100vw', height: '100vh', zIndex: 1000, background: '#040b16', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      {/* Background Video */}
      <video 
        autoPlay 
        loop 
        muted 
        playsInline 
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0.35,
          pointerEvents: 'none'
        }}
      >
        <source src="https://cdn.pixabay.com/video/2019/03/24/22254-325515230_large.mp4" type="video/mp4" />
        <source src="https://cdn.pixabay.com/video/2021/08/19/85489-590076241_large.mp4" type="video/mp4" />
        <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
        {/* Fallback pattern in case video fails to load entirely */}
      </video>

      {/* Decorative Grid Overlay over Video */}
      <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(circle at 50% 50%, transparent 20%, #000 100%), repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)',
          pointerEvents: 'none'
        }} />

      {/* Overlay Content */}
      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
        <div style={{ padding: '24px', background: 'rgba(59,130,246,0.1)', borderRadius: '50%', backdropFilter: 'blur(10px)', border: '1px solid rgba(59,130,246,0.3)', display: 'inline-flex', boxShadow: '0 0 80px rgba(59,130,246,0.3)' }}>
           <Plane size={80} color="#3b82f6" style={{ filter: 'drop-shadow(0 0 10px rgba(59,130,246,0.8))' }} />
        </div>
        
        <h1 style={{ 
          fontSize: 'clamp(4rem, 10vw, 8rem)', 
          letterSpacing: '0.15em', 
          margin: 0, 
          fontWeight: 900, 
          color: 'white', 
          textShadow: '0 10px 40px rgba(0,0,0,0.8)',
          textTransform: 'uppercase'
        }}>
          DRONAKSH
        </h1>
        
        <p style={{ 
          fontSize: 'clamp(1rem, 2vw, 1.5rem)', 
          color: 'rgba(255,255,255,0.8)', 
          letterSpacing: '0.3em', 
          textTransform: 'uppercase', 
          margin: 0,
          textShadow: '0 2px 10px rgba(0,0,0,0.5)'
        }}>
          Aerial Intelligence Platform
        </p>
        
        <button 
          onClick={() => navigate('/login')}
          style={{
            marginTop: '60px',
            padding: '20px 64px',
            fontSize: '1.125rem',
            background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
            color: 'white',
            border: 'none',
            borderRadius: '99px',
            cursor: 'pointer',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            boxShadow: '0 10px 40px rgba(59, 130, 246, 0.5)',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            outline: 'none',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseOver={(e) => { 
            e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)'; 
            e.currentTarget.style.boxShadow = '0 20px 50px rgba(59, 130, 246, 0.7)'; 
          }}
          onMouseOut={(e) => { 
            e.currentTarget.style.transform = 'translateY(0) scale(1)'; 
            e.currentTarget.style.boxShadow = '0 10px 40px rgba(59, 130, 246, 0.5)'; 
          }}
        >
          Initialize Command Centre
        </button>
      </div>
    </div>
  );
}
