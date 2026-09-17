import React, { useState, useEffect, useRef } from 'react';
import { Globe, MapPin, Radio, ShieldAlert, Satellite, Zap, Crosshair, ChevronRight, AlertTriangle, RefreshCw, Layers } from 'lucide-react';
import { ThemeConfig } from '../../types';
import { sounds } from '../../services/soundEffects';

interface WorldMonitorProps {
  currentTheme: ThemeConfig;
  onExecuteCommand?: (cmd: string) => void;
}

interface Hotspot {
  id: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  type: 'CYBER' | 'INFRASTRUCTURE' | 'QUANTUM' | 'SATELLITE' | 'WEATHER';
  status: string;
  threatLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  details: string;
  bandwidth?: string;
  latencyMs?: number;
}

const GLOBAL_HOTSPOTS: Hotspot[] = [
  {
    id: 'tokyo',
    city: 'Tokyo',
    country: 'Japan',
    lat: 35.6762,
    lng: 139.6503,
    type: 'QUANTUM',
    status: 'Quantum Supercomputing Grid Synced',
    threatLevel: 'LOW',
    details: '4,096 Qubit cryogenic cluster performing real-time sub-agent neural weight optimization.',
    latencyMs: 14,
    bandwidth: '48.2 Tbps',
  },
  {
    id: 'london',
    city: 'London',
    country: 'United Kingdom',
    lat: 51.5074,
    lng: -0.1278,
    type: 'INFRASTRUCTURE',
    status: 'Transatlantic Optical Relay Active',
    threatLevel: 'LOW',
    details: 'Direct London-New York subsea fiber trunk routing live telemetry at 99.999% uptime.',
    latencyMs: 28,
    bandwidth: '92.4 Tbps',
  },
  {
    id: 'sf',
    city: 'Silicon Valley',
    country: 'USA',
    lat: 37.7749,
    lng: -122.4194,
    type: 'INFRASTRUCTURE',
    status: 'AI Model Inference Cluster Online',
    threatLevel: 'LOW',
    details: 'Gemini 2.5 and Flash multi-agent inference endpoints active with 0% dropped packets.',
    latencyMs: 9,
    bandwidth: '120.0 Tbps',
  },
  {
    id: 'frankfurt',
    city: 'Frankfurt',
    country: 'Germany',
    lat: 50.1109,
    lng: 8.6821,
    type: 'CYBER',
    status: 'Zero-Trust Intrusion Blocked',
    threatLevel: 'HIGH',
    details: 'Automated Dave sub-agent neutralized unauthorized SYN flood on port 443. Core sealed.',
    latencyMs: 18,
    bandwidth: '64.0 Tbps',
  },
  {
    id: 'singapore',
    city: 'Singapore',
    country: 'Singapore',
    lat: 1.3521,
    lng: 103.8198,
    type: 'SATELLITE',
    status: 'Equatorial Earth Station Uplink',
    threatLevel: 'LOW',
    details: 'Tracking STONIC-ORBIT-01 and Low-Earth telemetry constellations with crystal phase lock.',
    latencyMs: 22,
    bandwidth: '36.5 Tbps',
  },
  {
    id: 'sydney',
    city: 'Sydney',
    country: 'Australia',
    lat: -33.8688,
    lng: 151.2093,
    type: 'INFRASTRUCTURE',
    status: 'Pacific Backbone Node Nominal',
    threatLevel: 'LOW',
    details: 'Autonomous failover redundancy verified across trans-oceanic edge routers.',
    latencyMs: 42,
    bandwidth: '28.0 Tbps',
  },
];

const STREAMING_HEADLINES = [
  'STONIC SATELLITE 01: Orbit telemetry verified at 540km altitude. Atmospheric sensor array optimal.',
  'CYBER DEFENSE SENTINEL: Dave agent mitigated 1,420 automated port scans across edge perimeter.',
  'GLOBAL LATENCY MESH: Neural link latency between Tokyo and Silicon Valley reduced to 14ms.',
  'SUB-AGENT DISPATCH: Alice and Bob agents auto-synchronized 48 workspace workflows.',
  'WEATHER SATELLITE RADAR: Solar flare radiation index at baseline 1.2. Zero RF interference.',
  'ZERO-TRUST HARDENING: Windows PC system kernel integrity validated. All checksums green.',
];

export const WorldMonitor: React.FC<WorldMonitorProps> = ({
  currentTheme,
  onExecuteCommand,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeTab, setActiveTab] = useState<'3D_GLOBE' | '2D_MAP'>('3D_GLOBE');
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot>(GLOBAL_HOTSPOTS[0]);
  const [defconLevel, setDefconLevel] = useState<number>(4);
  const [rotation, setRotation] = useState<number>(0);
  const [headlineIndex, setHeadlineIndex] = useState<number>(0);

  // Rotate ticker headlines
  useEffect(() => {
    const interval = setInterval(() => {
      setHeadlineIndex((prev) => (prev + 1) % STREAMING_HEADLINES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // 3D Globe Canvas Rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let angle = rotation;

    const render = () => {
      angle = (angle + 0.005) % (Math.PI * 2);
      setRotation(angle);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const cx = width / 2;
      const cy = height / 2;
      const radius = Math.min(width, height) * 0.38;

      // Outer Atmosphere Glow
      const glowGrad = ctx.createRadialGradient(cx, cy, radius * 0.8, cx, cy, radius * 1.3);
      glowGrad.addColorStop(0, 'rgba(6, 182, 212, 0.25)');
      glowGrad.addColorStop(0.7, 'rgba(14, 165, 233, 0.08)');
      glowGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.3, 0, Math.PI * 2);
      ctx.fill();

      // Globe Base Sphere
      const sphereGrad = ctx.createRadialGradient(cx - radius * 0.3, cy - radius * 0.3, radius * 0.1, cx, cy, radius);
      sphereGrad.addColorStop(0, '#0f2b48');
      sphereGrad.addColorStop(0.7, '#081729');
      sphereGrad.addColorStop(1, '#020611');
      ctx.fillStyle = sphereGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();

      // Perimeter Rim
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#00F0FF';
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Draw Latitude Rings
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
      ctx.lineWidth = 1;
      for (let lat = -60; lat <= 60; lat += 30) {
        const rad = (lat * Math.PI) / 180;
        const y = cy + Math.sin(rad) * radius;
        const rLat = Math.cos(rad) * radius;
        ctx.beginPath();
        ctx.ellipse(cx, y, rLat, rLat * 0.3, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw Longitude Meridian Lines (Rotating)
      for (let lng = 0; lng < 12; lng++) {
        const lngAngle = angle + (lng * Math.PI) / 6;
        const xOffset = Math.sin(lngAngle) * radius;
        const isVisible = Math.cos(lngAngle) > 0;

        if (isVisible) {
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
          ctx.beginPath();
          ctx.ellipse(cx + xOffset * 0.5, cy, Math.abs(xOffset) * 0.5, radius, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // Orbital Satellite Ring 1
      ctx.strokeStyle = 'rgba(192, 132, 252, 0.4)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.ellipse(cx, cy, radius * 1.25, radius * 0.45, -Math.PI / 6, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Orbiting Satellite 1 position
      const satTime = angle * 2;
      const satX = cx + Math.cos(satTime) * (radius * 1.25);
      const satY = cy + Math.sin(satTime) * (radius * 0.45);

      ctx.fillStyle = '#C084FC';
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#C084FC';
      ctx.beginPath();
      ctx.arc(satX, satY, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Project Hotspots onto the 3D sphere
      GLOBAL_HOTSPOTS.forEach((spot) => {
        const latRad = (spot.lat * Math.PI) / 180;
        const lngRad = (spot.lng * Math.PI) / 180 + angle;

        // Spherical coordinates projection
        const cosLat = Math.cos(latRad);
        const sinLat = Math.sin(latRad);
        const cosLng = Math.cos(lngRad);
        const sinLng = Math.sin(lngRad);

        // Check if on visible hemisphere (facing camera)
        if (cosLng > 0) {
          const px = cx + sinLng * cosLat * radius;
          const py = cy - sinLat * radius;

          const isSelected = selectedHotspot.id === spot.id;
          const spotColor =
            spot.threatLevel === 'HIGH' ? '#F87171' : spot.type === 'QUANTUM' ? '#C084FC' : '#00F0FF';

          // Pulse ring
          ctx.strokeStyle = spotColor;
          ctx.lineWidth = isSelected ? 2 : 1;
          ctx.beginPath();
          ctx.arc(px, py, isSelected ? 9 : 6, 0, Math.PI * 2);
          ctx.stroke();

          // Center dot
          ctx.fillStyle = spotColor;
          ctx.shadowBlur = 8;
          ctx.shadowColor = spotColor;
          ctx.beginPath();
          ctx.arc(px, py, isSelected ? 4 : 2.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;

          // Label
          ctx.font = '9px monospace';
          ctx.fillStyle = isSelected ? '#FFFFFF' : '#94A3B8';
          ctx.fillText(spot.city, px + 8, py - 4);
        }
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [selectedHotspot]);

  return (
    <div
      id="stonic-world-monitor"
      className="p-4 md:p-6 rounded-2xl border transition-all duration-300 font-mono space-y-4 select-none"
      style={{
        backgroundColor: currentTheme.panelBg,
        borderColor: currentTheme.panelBorder,
        boxShadow: `0 8px 32px rgba(6,182,212,0.15)`,
      }}
    >
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-950/80 text-cyan-400 border border-cyan-500/40">
            <Globe className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-wider">WORLD MONITOR & LIVE SATELLITE</h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40">
                STONIC-ORBIT-01
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Live orbital geosynchronous telemetry & autonomous planetary threat detection
            </p>
          </div>
        </div>

        {/* DEFCON Status Pill & View Mode */}
        <div className="flex items-center gap-3">
          {/* DEFCON Level Selector */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-[11px]">
            <span className="text-slate-500 px-1 text-[10px] font-bold">DEFCON:</span>
            {[5, 4, 3, 2, 1].map((lvl) => {
              const isActive = defconLevel === lvl;
              const color =
                lvl === 1
                  ? 'bg-red-600 text-white'
                  : lvl === 2
                  ? 'bg-amber-600 text-white'
                  : lvl === 3
                  ? 'bg-yellow-600 text-black'
                  : lvl === 4
                  ? 'bg-emerald-600 text-white'
                  : 'bg-blue-600 text-white';

              return (
                <button
                  key={lvl}
                  onClick={() => {
                    sounds.playClick();
                    setDefconLevel(lvl);
                  }}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                    isActive ? color : 'text-slate-500 hover:text-slate-300'
                  }`}
                  title={`DEFCON Level ${lvl}`}
                >
                  {lvl}
                </button>
              );
            })}
          </div>

          {/* 3D vs 2D Mode Toggle */}
          <div className="flex items-center bg-slate-900 rounded-lg p-0.5 border border-slate-800 text-[11px]">
            <button
              onClick={() => {
                sounds.playClick();
                setActiveTab('3D_GLOBE');
              }}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === '3D_GLOBE'
                  ? 'bg-cyan-600 text-white shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>3D Globe</span>
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                setActiveTab('2D_MAP');
              }}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === '2D_MAP'
                  ? 'bg-cyan-600 text-white shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>2D Grid</span>
            </button>
          </div>
        </div>
      </div>

      {/* Streaming Global Headlines Ticker */}
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950/80 border border-slate-800 text-xs text-slate-300 overflow-hidden">
        <span className="flex items-center gap-1 text-[10px] font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800/80 shrink-0">
          <Radio className="w-3 h-3 animate-pulse" />
          <span>WORLD FEED</span>
        </span>
        <span className="truncate text-slate-300 font-mono text-[11px]">
          {STREAMING_HEADLINES[headlineIndex]}
        </span>
      </div>

      {/* Main Grid: Globe/Map Stage on Left, Intel Dossier on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Visualizer Stage */}
        <div className="lg:col-span-7 bg-slate-950/70 rounded-xl border border-slate-800/90 p-3 relative flex flex-col items-center justify-center min-h-[380px] overflow-hidden">
          {/* Top HUD Coordinates */}
          <div className="absolute top-3 left-3 text-[10px] text-slate-500 font-mono flex items-center gap-2">
            <span className="text-cyan-400 font-bold">LAT: 34.05° N</span>
            <span>•</span>
            <span className="text-cyan-400 font-bold">LON: 118.24° W</span>
            <span>•</span>
            <span>ALT: 540 KM</span>
          </div>

          {activeTab === '3D_GLOBE' ? (
            <div className="relative w-full flex items-center justify-center py-2">
              <canvas
                ref={canvasRef}
                width={420}
                height={340}
                className="w-full max-w-[420px] h-[340px] cursor-grab active:cursor-grabbing"
              />
            </div>
          ) : (
            /* 2D Tactical Map View */
            <div className="w-full h-[340px] flex flex-col justify-between p-4 bg-slate-950 rounded-lg relative overflow-hidden">
              {/* Tactical grid background */}
              <div
                className="absolute inset-0 opacity-15"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, #38bdf8 1px, transparent 1px), linear-gradient(to bottom, #38bdf8 1px, transparent 1px)',
                  backgroundSize: '32px 32px',
                }}
              />

              <div className="relative z-10 text-xs text-slate-400 font-mono flex justify-between">
                <span>TACTICAL CYBER PERIMETER MAP</span>
                <span className="text-emerald-400">NODES ONLINE: 6/6</span>
              </div>

              {/* 2D Hotspot Pins */}
              <div className="relative z-10 grid grid-cols-2 md:grid-cols-3 gap-3 my-auto">
                {GLOBAL_HOTSPOTS.map((spot) => {
                  const isSelected = selectedHotspot.id === spot.id;
                  return (
                    <button
                      key={spot.id}
                      onClick={() => {
                        sounds.playClick();
                        setSelectedHotspot(spot);
                      }}
                      className={`p-2 rounded-lg border text-left transition-all ${
                        isSelected
                          ? 'border-cyan-400 bg-cyan-500/15 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                          : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                        <span className="font-bold text-white">{spot.city}</span>
                        <span
                          className={`text-[9px] px-1 rounded ${
                            spot.threatLevel === 'HIGH' ? 'bg-rose-950 text-rose-300' : 'bg-slate-800 text-cyan-300'
                          }`}
                        >
                          {spot.type}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">{spot.status}</div>
                    </button>
                  );
                })}
              </div>

              <div className="relative z-10 text-[10px] text-slate-500 text-center font-mono">
                Satellite telemetry synced with Dave security agent monitoring mesh.
              </div>
            </div>
          )}

          {/* Bottom Satellite Status Readout */}
          <div className="w-full flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800/80 pt-2 mt-2 px-1">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <Satellite className="w-3.5 h-3.5" />
              <span>ORBIT TRACK: STONIC-01 (SYNCHRONOUS)</span>
            </div>
            <span>DOWNLINK: 1.2 GB/S</span>
          </div>
        </div>

        {/* Hotspot Intel Dossier & Command Actions */}
        <div className="lg:col-span-5 flex flex-col space-y-3">
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <h4 className="text-xs font-bold text-white tracking-wider uppercase">
                  {selectedHotspot.city}, {selectedHotspot.country}
                </h4>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  selectedHotspot.threatLevel === 'HIGH'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}
              >
                {selectedHotspot.threatLevel} THREAT
              </span>
            </div>

            {/* Status & Latency Matrix */}
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">SUB-AGENT MESH</span>
                <span className="text-cyan-300 font-bold">{selectedHotspot.type}</span>
              </div>
              <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">BANDWIDTH CAPACITY</span>
                <span className="text-white font-bold">{selectedHotspot.bandwidth || '40 Tbps'}</span>
              </div>
              <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">ROUND-TRIP LATENCY</span>
                <span className="text-emerald-400 font-bold">{selectedHotspot.latencyMs || 15} MS</span>
              </div>
              <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">DEFCON STATE</span>
                <span className="text-amber-300 font-bold">LEVEL {defconLevel}</span>
              </div>
            </div>

            {/* Detailed Intelligence Description */}
            <div className="p-2.5 rounded-lg bg-slate-900/40 border border-slate-800/80 text-[11px] text-slate-300 leading-relaxed">
              {selectedHotspot.details}
            </div>

            {/* Quick Tactical Action */}
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  sounds.playClick();
                  onExecuteCommand?.(`Run orbital diagnostics on ${selectedHotspot.city} relay node`);
                }}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow-[0_0_12px_rgba(6,182,212,0.3)] active:scale-95"
              >
                <Crosshair className="w-3.5 h-3.5" />
                <span>Run Diagnostic Sweep on {selectedHotspot.city}</span>
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  onExecuteCommand?.(`Scan for anomalies in ${selectedHotspot.city}`);
                }}
                className="w-full flex items-center justify-center gap-2 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs transition-colors border border-slate-800"
              >
                <RefreshCw className="w-3 h-3 text-slate-400" />
                <span>Ping Satellite Uplink</span>
              </button>
            </div>
          </div>

          {/* Global Hotspots Switcher Quick List */}
          <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/40 space-y-1.5">
            <span className="text-[10px] text-slate-500 font-bold tracking-wider uppercase block">
              Global Ground Relay Select
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {GLOBAL_HOTSPOTS.map((h) => (
                <button
                  key={h.id}
                  onClick={() => {
                    sounds.playClick();
                    setSelectedHotspot(h);
                  }}
                  className={`px-2 py-1 rounded text-[10px] truncate transition-all ${
                    selectedHotspot.id === h.id
                      ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                      : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {h.city}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
