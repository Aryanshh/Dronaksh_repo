import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import 'leaflet/dist/leaflet.css'
import { DroneProvider } from './context/DroneContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <DroneProvider>
        <App />
      </DroneProvider>
    </BrowserRouter>
  </StrictMode>,
)
