import React, { useEffect, useState } from 'react';
import { Navigation, Target, ShieldAlert, Cpu } from 'lucide-react';
import { useDrones } from '../context/DroneContext';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Default Dubai Center (Fallback)
const DUBAI_CENTER = [25.1972, 55.2744];
const LAT_DELTA = 0.04;
const LNG_DELTA = 0.05;

// Helper to map 0-100 x/y to GPS
const getGPS = (x, y, center) => {
  const lat = center[0] - ((y / 100) - 0.5) * LAT_DELTA;
  const lng = center[1] + ((x / 100) - 0.5) * LNG_DELTA;
  return [lat, lng];
};

// Component to handle map centering on geolocation
function LocationManager({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
}

// Custom Icon factory - MILITARY AIRCRAFT / SILHOUETTE Theme
const createDroneIcon = (drone, center) => {
  const color = drone.status === 'active' ? '#10b981' : '#f59e0b';
  const gps = getGPS(drone.x, drone.y, center);
  
  const html = `
    <div style="display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -50%);">
      <!-- Glow Ring -->
      <div style="
        position: absolute; width: 48px; height: 48px; 
        border-radius: 50%; border: 1px solid ${color}40;
        animation: pulse 2s infinite; pointer-events: none;
      "></div>
      
      <!-- Aircraft Silhouette -->
      <div style="
        width: 44px; height: 44px; 
        display: flex; alignItems: center; justifyContent: center;
        filter: drop-shadow(0 0 8px ${color});
        transform: rotate(${45 + (drone.x * 2)}deg);
      ">
        <svg viewBox="0 0 24 24" width="32" height="32" fill="${color}" xmlns="http://www.w3.org/2000/svg">
          <path d="M21,16 L21,14 L13,9 L13,3.5 C13,2.67 12.33,2 11.5,2 C10.67,2 10,2.67 10,3.5 L10,9 L2,14 L2,16 L10,13.5 L10,19 L8,20.5 L8,22 L11.5,21 L15,22 L15,20.5 L13,19 L13,13.5 L21,16 Z" />
        </svg>
      </div>

      <!-- Precision Coordinates Label -->
      <div style="
        background: rgba(0,0,0,0.95); color: #fff; 
        padding: 4px 8px; border: 1px solid ${color};
        border-radius: 4px; font-family: 'Courier New', monospace;
        font-size: 8px; margin-top: 4px;
        display: flex; flex-direction: column; gap: 2px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.5);
        pointer-events: none;
      ">
        <span style="color: ${color}; font-weight: bold;">${drone.id}</span>
        <span>LAT: ${gps[0].toFixed(5)}</span>
        <span>LNG: ${gps[1].toFixed(5)}</span>
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-drone-icon',
    iconSize: [60, 80],
    iconAnchor: [30, 40]
  });
};

export function FleetMap() {
  const { drones } = useDrones();
  const [userCenter, setUserCenter] = useState(DUBAI_CENTER);

  // Request Location Permission
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserCenter([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.warn("Location permission denied or unavailable, defaulting to HQ coordinates.");
        }
      );
    }
  }, []);

  // ONLY show drones that are NOT idle
  const activeDrones = drones.filter(d => d.status !== 'idle');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', paddingBottom: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0 }}>Active Tactical Map</h2>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.875rem' }}>High-Precision GPS Monitoring | {activeDrones.length} Units Airborne</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', background: 'rgba(16, 185, 129, 0.1)', padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
          <Target size={14} color="#10b981" />
          <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>PRECISION TRACKING ACTIVE [24-SATELLITE LOCK]</span>
        </div>
      </div>

      <div className="glass-panel" style={{ flex: 1, position: 'relative', overflow: 'hidden', minHeight: '650px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
        <MapContainer 
          center={userCenter} 
          zoom={15} 
          style={{ height: '100%', width: '100%', filter: 'grayscale(0.3) contrast(1.1) brightness(0.9) hue-rotate(-15deg)' }}
          zoomControl={true}
          scrollWheelZoom={false}
          doubleClickZoom={true}
        >
          <LocationManager center={userCenter} />
          
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution='&copy; Esri'
          />
          
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(16, 185, 129, 0.05)', mixBlendMode: 'overlay', pointerEvents: 'none', zIndex: 1000 }} />

          {activeDrones.map(drone => (
            <Marker 
              key={drone.id} 
              position={getGPS(drone.x, drone.y, userCenter)} 
              icon={createDroneIcon(drone, userCenter)}
            >
              <Popup className="dark-popup">
                <div style={{ background: '#000', color: '#fff', padding: '10px', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', borderBottom: '1px solid #333', paddingBottom: '4px' }}>
                    <Cpu size={14} color="#10b981" />
                    <h4 style={{ margin: 0 }}>{drone.id}</h4>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '11px' }}>
                    <div style={{ color: '#888' }}>Status:</div><div style={{ color: '#10b981', fontWeight: 700 }}>{drone.status.toUpperCase()}</div>
                    <div style={{ color: '#888' }}>Latitude:</div><div>{getGPS(drone.x, drone.y, userCenter)[0].toFixed(6)}</div>
                    <div style={{ color: '#888' }}>Longitude:</div><div>{getGPS(drone.x, drone.y, userCenter)[1].toFixed(6)}</div>
                    <div style={{ color: '#888' }}>Battery:</div><div>{Math.floor(drone.battery)}%</div>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
