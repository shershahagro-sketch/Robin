import React from 'react';
import { Cpu, HardDrive, Zap, Wifi, BatteryCharging, Battery, Monitor, Activity } from 'lucide-react';
import { SystemTelemetry, ThemeConfig } from '../types';

interface LiveTelemetryGridProps {
  telemetry: SystemTelemetry;
  currentTheme: ThemeConfig;
  onSelectProcess?: (procName: string) => void;
}

export const LiveTelemetryGrid: React.FC<LiveTelemetryGridProps> = ({
  telemetry,
  currentTheme,
  onSelectProcess,
}) => {
  const getProgressColor = (percent: number) => {
    if (percent > 85) return 'bg-rose-500';
    if (percent > 65) return 'bg-amber-500';
    return 'bg-sky-400';
  };

  const cards = [
    {
      id: 'metric-cpu',
      title: 'CPU USAGE',
      value: `${telemetry.cpuUsagePercent}%`,
      sub: `${telemetry.cpuCores} Cores Active`,
      percent: telemetry.cpuUsagePercent,
      icon: <Cpu className="w-4 h-4 text-sky-400" />,
      detail: telemetry.cpuModel,
    },
    {
      id: 'metric-ram',
      title: 'RAM MEMORY',
      value: `${telemetry.ramUsagePercent}%`,
      sub: `${telemetry.ramUsedGB} / ${telemetry.ramTotalGB} GB`,
      percent: telemetry.ramUsagePercent,
      icon: <Activity className="w-4 h-4 text-emerald-400" />,
      detail: 'DDR5 6000MHz Dual Channel',
    },
    {
      id: 'metric-gpu',
      title: 'GPU LOAD',
      value: `${telemetry.gpuUsagePercent}%`,
      sub: `${telemetry.gpuTempC}°C Nominal`,
      percent: telemetry.gpuUsagePercent,
      icon: <Monitor className="w-4 h-4 text-purple-400" />,
      detail: telemetry.gpu,
    },
    {
      id: 'metric-disk',
      title: 'NVMe DRIVE C:',
      value: `${telemetry.diskUsagePercent}%`,
      sub: `${telemetry.diskUsedGB} / ${telemetry.diskTotalGB} GB`,
      percent: telemetry.diskUsagePercent,
      icon: <HardDrive className="w-4 h-4 text-amber-400" />,
      detail: 'PCIe 4.0 7300MB/s Read',
    },
    {
      id: 'metric-network',
      title: 'NETWORK LINK',
      value: 'ONLINE',
      sub: 'Ping 14ms • 1.2 Gbps',
      percent: 88,
      icon: <Wifi className="w-4 h-4 text-teal-400" />,
      detail: telemetry.networkStatus,
    },
    {
      id: 'metric-battery',
      title: 'POWER STATUS',
      value: `${telemetry.batteryPercent}%`,
      sub: telemetry.batteryCharging ? 'AC Powered (Charging)' : 'Discharging',
      percent: telemetry.batteryPercent,
      icon: telemetry.batteryCharging ? (
        <BatteryCharging className="w-4 h-4 text-green-400" />
      ) : (
        <Battery className="w-4 h-4 text-emerald-400" />
      ),
      detail: 'High Performance Plan',
    },
  ];

  return (
    <div className="w-full space-y-3">
      {/* 6 Hardware Sensor Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {cards.map((c) => (
          <div
            key={c.id}
            id={c.id}
            className="p-3 rounded-xl border transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between group"
            style={{
              backgroundColor: currentTheme.panelBg,
              borderColor: currentTheme.panelBorder,
              boxShadow: `0 2px 10px ${currentTheme.glowColor}15`,
            }}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-mono font-medium tracking-wider text-slate-400 uppercase">
                {c.title}
              </span>
              <div className="p-1 rounded bg-slate-800/60">{c.icon}</div>
            </div>

            <div className="my-1">
              <div className="text-xl font-bold font-mono tracking-tight text-white group-hover:text-sky-300 transition-colors">
                {c.value}
              </div>
              <div className="text-[11px] font-mono text-slate-400 truncate">{c.sub}</div>
            </div>

            {/* Micro Progress Bar */}
            <div className="w-full bg-slate-800/80 rounded-full h-1.5 mt-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${getProgressColor(c.percent)}`}
                style={{ width: `${Math.min(100, Math.max(5, c.percent))}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Running Applications Strip */}
      <div
        id="active-processes-strip"
        className="px-3.5 py-2.5 rounded-xl border flex flex-wrap items-center justify-between gap-2 text-xs font-mono"
        style={{
          backgroundColor: currentTheme.panelBg,
          borderColor: currentTheme.panelBorder,
        }}
      >
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-400 text-[11px] uppercase tracking-wider font-semibold">
            ACTIVE WINDOWS PROCESSES ({telemetry.activeApps.length}):
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto py-1">
          {telemetry.activeApps.map((app) => (
            <button
              key={app.pid}
              onClick={() => onSelectProcess?.(app.name)}
              className="px-2 py-0.5 rounded border border-slate-700 hover:border-sky-500/60 bg-slate-900/80 text-slate-300 hover:text-white text-[11px] transition-all flex items-center gap-1.5 whitespace-nowrap"
              title={`PID: ${app.pid} | Memory: ${app.memMB} MB`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
              <span>{app.name}</span>
              <span className="text-slate-500 text-[10px]">{app.memMB}MB</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
