import React from 'react'
import ReactDOM from 'react-dom/client'
import Lenis from 'lenis'
import App from './App.jsx'
import './index.css'

// ── Initialize Lenis smooth scroll ────────────────────────────
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // exponential ease-out
  orientation: 'vertical',
  smoothWheel: true,
  wheelMultiplier: 0.9,
  touchMultiplier: 1.5,
})

function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}
requestAnimationFrame(raf)

// ── Mount React ────────────────────────────────────────────────
ReactDOM.createRoot(document.getElementById('app')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
