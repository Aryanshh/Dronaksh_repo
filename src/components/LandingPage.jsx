import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane } from 'lucide-react';
import { NeumorphicButton } from './NeumorphicButton';

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ position: 'absolute', inset: 0, width: '100vw', height: '100vh', zIndex: 1000, backgroundColor: 'var(--bg-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      
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
          opacity: 0.25,
          pointerEvents: 'none'
        }}
      >
        <source src="https://cdn.pixabay.com/video/2019/03/24/22254-325515230_large.mp4" type="video/mp4" />
        <source src="https://cdn.pixabay.com/video/2021/08/19/85489-590076241_large.mp4" type="video/mp4" />
        <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
      </video>

      {/* Decorative Grid Overlay over Video */}
      <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(circle at 50% 50%, transparent 20%, var(--bg-color) 90%), repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)',
          pointerEvents: 'none'
        }} />

      {/* Overlay Neumorphic Card Content */}
      <div 
        className="nm-flat"
        style={{ 
          position: 'relative', 
          zIndex: 10, 
          textAlign: 'center', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          gap: '24px',
          padding: '60px 40px',
          borderRadius: '32px',
          boxShadow: '-8px -8px 24px var(--highlight-color), 8px 8px 24px var(--shadow-color)',
          maxWidth: '540px',
          width: '90%',
        }}
      >
        <div 
          className="nm-inset animate-float-bob" 
          style={{ 
            padding: '24px', 
            borderRadius: '50%', 
            display: 'inline-flex',
            boxShadow: 'inset -3px -3px 8px var(--highlight-color), inset 3px 3px 8px var(--shadow-color)'
          }}
        >
           <Plane size={60} color="var(--accent-primary)" />
        </div>
        
        <h1 style={{ 
          fontSize: 'clamp(2.5rem, 5vw, 4rem)', 
          letterSpacing: '0.12em', 
          margin: 0, 
          fontWeight: 700, 
          color: 'var(--text-primary)', 
          textTransform: 'uppercase',
          fontFamily: "'General Sans', sans-serif"
        }}>
          DRONAKSH
        </h1>
        
        <p style={{ 
          fontSize: 'clamp(0.85rem, 2vw, 1.1rem)', 
          color: 'var(--text-secondary)', 
          letterSpacing: '0.25em', 
          textTransform: 'uppercase', 
          margin: 0,
          fontWeight: 600
        }}>
          Aerial Intelligence Platform
        </p>
        
        <NeumorphicButton 
          onClick={() => navigate('/login')}
          style={{
            marginTop: '32px',
            padding: '16px 48px',
            fontSize: '1rem',
            borderRadius: '99px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            boxShadow: '-4px -4px 10px var(--highlight-color), 4px 4px 10px var(--shadow-color)'
          }}
        >
          Initialize Command Centre
        </NeumorphicButton>
      </div>
    </div>
  );
}
