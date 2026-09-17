import React, { useState } from 'react';
import { Cpu, HardDrive, Wifi, BatteryCharging, Battery, Monitor, Activity, ShieldCheck, Zap, Sparkles, RefreshCw, Layers } from 'lucide-react';
import { SystemTelemetry, ThemeConfig } from '../../types';
import { sounds } from '../../services/soundEffects';

interface GlassmorphismTelemetryGridProps {
  telemetry: SystemTelemetry;
  currentTheme: ThemeConfig;
  onSelectProcess?: (procName: string) => void;
  onExecuteCommand?: (cmd: string) => void;
}

export const GlassmorphismTelemetryGrid: React.FC<GlassmorphismTelemetryGridProps> = ({
  telemetry,
  currentTheme,
  onSelectProcess,
  onExecuteCommand,
}) => {
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const [purgingRam, setPurgingRam] = useState<boolean>(false);

  const handlePurgeRam = (e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playWakeChime();
    setPurgingRam(true);
    onExecuteCommand?.('Purge Windows standby RAM memory cache');
    setTimeout(() => setPurgingRam(false), 2500);
  };

  const getMetricColor = (percent: number) => {
    if (percent > 85) return 'text-rose-400 border-rose-500/40 bg-rose-500/20';
    if (percent > 65) return 'text-amber-400 border-amber-500/40 bg-amber-500/20';
    return 'text-cyan-300 border-cyan-500/40 bg-cyan-500/20';
  };

  const cards = [
    {
      id: 'cpu-card',
      title: 'CPU NEURAL LOAD',
      metric: `${telemetry.cpuUsagePercent}%`,
      subtitle: `${telemetry.cpuCores} Cores • 4.8 GHz Boost`,
      percent: telemetry.cpuUsagePercent,
      icon: <Cpu className="w-4 h-4 text-cyan-400" />,
      detail: telemetry.cpuModel,
      tag: 'PROCESSOR',
      action: () => onExecuteCommand?.('Inspect CPU top threads and clock frequency'),
      actionLabel: 'Analyze Threads',
    },
    {
      id: 'ram-card',
      title: 'RAM DYNAMIC MATRIX',
      metric: `${telemetry.ramUsagePercent}%`,
      subtitle: `${telemetry.ramUsedGB} GB / ${telemetry.ramTotalGB} GB (DDR5)`,
      percent: telemetry.ramUsagePercent,
      icon: <Activity className="w-4 h-4 text-emerald-400" />,
      detail: purgingRam ? 'Purging standby memory cache...' : 'Standby Cache Optimized',
      tag: 'MEMORY',
      action: handlePurgeRam,
      actionLabel: purgingRam ? 'Purging...' : 'Purge Cache',
    },
    {
      id: 'gpu-card',
      title: 'GPU TENSOR CORE',
      metric: `${telemetry.gpuUsagePercent}%`,
      subtitle: `${telemetry.gpuTempC}°C • 120 FPS VSync`,
      percent: telemetry.gpuUsagePercent,
      icon: <Monitor className="w-4 h-4 text-purple-400" />,
      detail: telemetry.gpu,
      tag: 'GRAPHICS',
      action: () => onExecuteCommand?.('Verify GPU shader pipeline and thermals'),
      actionLabel: 'Shader Audit',
    },
    {
      id: 'disk-card',
      title: 'NVMe GEN-4 DISK',
      metric: `${telemetry.diskUsagePercent}%`,
      subtitle: `${telemetry.diskUsedGB} GB / ${telemetry.diskTotalGB} GB`,
      percent: telemetry.diskUsagePercent,
      icon: <HardDrive className="w-4 h-4 text-amber-400" />,
      detail: '7,300 MB/s Sequential Read Rate',
      tag: 'STORAGE',
      action: () => onExecuteCommand?.('Check disk health and temp cache files'),
      actionLabel: 'Disk Health',
    },
    {
      id: 'network-card',
      title: 'QUANTUM UPLINK',
      metric: '14 MS',
      subtitle: 'Down: 1.2 Gbps • Up: 840 Mbps',
      percent: 92,
      icon: <Wifi className="w-4 h-4 text-teal-400" />,
      detail: telemetry.networkStatus,
      tag: 'NETWORK',
      action: () => onExecuteCommand?.('Ping gateway and test DNS latency'),
      actionLabel: 'Ping Matrix',
    },
    {
      id: 'security-card',
      title: 'ZERO-TRUST DEFCON',
      metric: 'SECURE',
      subtitle: '0 Breaches • Sentinel Shield On',
      percent: 100,
      icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
      detail: 'Dave Cyber Agent Monitoring Port Bounds',
      tag: 'DEFENSE',
      action: () => onExecuteCommand?.('Run sandbox vulnerability diagnostic'),
      actionLabel: 'Audit Shield',
    },
  ];

  return (
    <div className="w-full space-y-3 font-mono select-none">
      {/* 6 Glassmorphic Interactive Telemetry Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {cards.map((c) => {
          const isSelected = activeCard === c.id;
          const statusBadge = getMetricColor(c.percent);

          return (
            <div
              key={c.id}
              id={c.id}
              onClick={() => {
                sounds.playClick();
                setActiveCard(isSelected ? null : c.id);
              }}
              className={`relative p-3.5 rounded-2xl border backdrop-blur-xl transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden group hover:scale-[1.02] ${
                isSelected
                  ? 'bg-slate-900/80 border-cyan-400 shadow-[0_0_24px_rgba(6,182,212,0.35)] ring-1 ring-cyan-400/50'
                  : 'bg-slate-950/40 hover:bg-slate-900/60 border-slate-800/80 hover:border-cyan-500/50 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]'
              }`}
            >
              {/* Glassmorphic Top Specular Highlight */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent pointer-events-none" />

              {/* Card Header */}
              <div className="flex items-center justify-between gap-1 mb-2">
                <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase truncate">
                  {c.title}
                </span>
                <div className="p-1.5 rounded-lg bg-slate-900/80 border border-slate-800/90 text-cyan-400 shrink-0 group-hover:text-cyan-300">
                  {c.icon}
                </div>
              </div>

              {/* Main Metric Value */}
              <div className="my-1">
                <div className="text-xl md:text-2xl font-black tracking-tight text-white group-hover:text-cyan-300 transition-colors drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
                  {c.metric}
                </div>
                <div className="text-[11px] text-slate-400 truncate mt-0.5">
                  {c.subtitle}
                </div>
              </div>

              {/* Micro Glowing Progress Bar */}
              <div className="w-full bg-slate-900/90 rounded-full h-1.5 my-2 overflow-hidden border border-slate-800/60">
                <div
                  className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-cyan-500 to-blue-500 shadow-[0_0_8px_rgba(6,182,212,0.6)]"
                  style={{ width: `${Math.min(100, Math.max(8, c.percent))}%` }}
                />
              </div>

              {/* Card Footer & Interactive Action Button */}
              <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px]">
                <span className="text-slate-500 truncate max-w-[90px]">{c.tag}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    sounds.playClick();
                    c.action();
                  }}
                  className="px-2 py-0.5 rounded bg-slate-900 hover:bg-cyan-950 text-cyan-300 border border-slate-800 hover:border-cyan-500/50 transition-colors flex items-center gap-1 font-semibold"
                  title={c.actionLabel}
                >
                  <span>{c.actionLabel}</span>
                  <Zap className="w-2.5 h-2.5 text-cyan-400" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Glassmorphic Running Applications & Windows Processes Bar */}
      <div
        id="active-processes-strip"
        className="px-4 py-3 rounded-2xl border backdrop-blur-xl bg-slate-950/40 border-slate-800/80 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] flex flex-wrap items-center justify-between gap-3 text-xs"
      >
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-slate-300 text-xs uppercase tracking-wider font-bold">
            ACTIVE WINDOWS PC PROCESSES ({telemetry.activeApps.length}):
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto py-0.5 scrollbar-thin scrollbar-thumb-slate-800">
          {telemetry.activeApps.map((app) => (
            <button
              key={app.pid}
              onClick={() => {
                sounds.playClick();
                onSelectProcess?.(app.name);
              }}
              className="px-2.5 py-1 rounded-lg border border-slate-800 hover:border-cyan-400/60 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs transition-all flex items-center gap-2 whitespace-nowrap shadow-sm"
              title={`Click to check PID ${app.pid} (${app.memMB} MB)`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span className="font-semibold">{app.name}</span>
              <span className="text-slate-500 font-mono text-[10px]">{app.memMB}MB</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
