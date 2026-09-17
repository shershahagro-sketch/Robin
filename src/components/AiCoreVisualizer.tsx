import React, { useEffect, useState } from 'react';
import { Mic, MicOff, Volume2, Sparkles, AlertTriangle, ShieldCheck } from 'lucide-react';
import { RobinState, ThemeConfig, SupportedLanguage } from '../types';
import { sounds } from '../services/soundEffects';
import { SUPPORTED_LANGUAGES, getLanguageConfig } from '../data/languages';

interface AiCoreVisualizerProps {
  state: RobinState;
  statusText: string;
  transcriptText: string;
  isListening: boolean;
  onToggleListening: () => void;
  currentTheme: ThemeConfig;
  activeCommandSummary?: string | null;
  onOpenCommandCenter: () => void;
  language?: SupportedLanguage;
  onLanguageChange?: (lang: SupportedLanguage) => void;
  onExecuteSample?: (cmd: string) => void;
}

export const AiCoreVisualizer: React.FC<AiCoreVisualizerProps> = ({
  state,
  statusText,
  transcriptText,
  isListening,
  onToggleListening,
  currentTheme,
  activeCommandSummary,
  onOpenCommandCenter,
  language = 'en-US',
  onLanguageChange,
  onExecuteSample,
}) => {
  // Waveform bars simulation
  const [waveHeights, setWaveHeights] = useState<number[]>([12, 18, 28, 42, 34, 22, 15, 30, 45, 20, 14, 25]);

  useEffect(() => {
    let interval: any;
    if (state === 'LISTENING' || state === 'SPEAKING' || state === 'EXECUTING') {
      interval = setInterval(() => {
        setWaveHeights(
          Array.from({ length: 16 }, () => Math.floor(Math.random() * (state === 'SPEAKING' ? 48 : 32)) + 8)
        );
      }, 100);
    } else {
      setWaveHeights([8, 12, 16, 20, 24, 20, 16, 12, 8, 12, 16, 20, 16, 12, 8, 10]);
    }
    return () => clearInterval(interval);
  }, [state]);

  const getStateDetails = () => {
    switch (state) {
      case 'LISTENING':
        return {
          label: 'ROBIN IS LISTENING',
          glow: '#00F0FF',
          secondary: '#0080FF',
          desc: 'Awaiting voice command (e.g., "Open Chrome", "What\'s my CPU usage?")...',
          icon: <Mic className="w-5 h-5 animate-pulse text-cyan-300" />,
        };
      case 'THINKING':
        return {
          label: 'PROCESSING INTENT',
          glow: '#A855F7',
          secondary: '#EC4899',
          desc: 'Reasoning tool execution & permission matrix with Gemini AI...',
          icon: <Sparkles className="w-5 h-5 animate-spin text-purple-300" />,
        };
      case 'EXECUTING':
        return {
          label: 'EXECUTING TOOL',
          glow: '#10B981',
          secondary: '#3B82F6',
          desc: activeCommandSummary || 'Invoking Windows PC control subsystem...',
          icon: <ShieldCheck className="w-5 h-5 text-emerald-300 animate-pulse" />,
        };
      case 'SPEAKING':
        return {
          label: 'ROBIN IS SPEAKING',
          glow: '#F59E0B',
          secondary: '#EF4444',
          desc: 'Broadcasting verbal confirmation through audio engine...',
          icon: <Volume2 className="w-5 h-5 text-amber-300 animate-bounce" />,
        };
      case 'WARNING':
        return {
          label: 'CONFIRMATION REQUIRED',
          glow: '#EF4444',
          secondary: '#F59E0B',
          desc: 'High-risk operation queued. Manual user approval mandated.',
          icon: <AlertTriangle className="w-5 h-5 text-rose-400 animate-ping" />,
        };
      case 'ERROR':
        return {
          label: 'FAULT DETECTED',
          glow: '#DC2626',
          secondary: '#7F1D1D',
          desc: statusText || 'Subsystem reported an error. Safe recovery active.',
          icon: <AlertTriangle className="w-5 h-5 text-red-400" />,
        };
      case 'OFFLINE':
        return {
          label: 'LOCAL OFFLINE CORE',
          glow: '#64748B',
          secondary: '#475569',
          desc: 'Operating without external network. Local rules & automations armed.',
          icon: <ShieldCheck className="w-5 h-5 text-slate-400" />,
        };
      default:
        return {
          label: 'AI CORE ONLINE',
          glow: currentTheme.primaryColor || '#00F0FF',
          secondary: currentTheme.secondaryColor || '#2563EB',
          desc: 'JARVIS Command Center ready. Standby for voice or keyboard directives.',
          icon: <Sparkles className="w-5 h-5 text-sky-300" />,
        };
    }
  };

  const details = getStateDetails();

  return (
    <div
      id="robin-ai-core-visualizer"
      className="relative flex flex-col items-center justify-center py-8 px-6 rounded-2xl border transition-all duration-500 overflow-hidden"
      style={{
        backgroundColor: currentTheme.panelBg,
        borderColor: currentTheme.panelBorder,
        boxShadow: `0 8px 32px ${details.glow}20, inset 0 0 40px ${details.glow}10`,
      }}
    >
      {/* Background Radial Glow */}
      <div
        className="absolute w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-25 transition-all duration-700"
        style={{
          background: `radial-gradient(circle, ${details.glow} 0%, transparent 70%)`,
        }}
      />

      {/* Futuristic Orbit Rings & Core */}
      <div className="relative w-56 h-56 flex items-center justify-center my-2">
        {/* Outer Orbiting Ring 1 */}
        <div
          className="absolute inset-0 rounded-full border border-dashed opacity-40 animate-[spin_20s_linear_infinite]"
          style={{ borderColor: details.glow }}
        />

        {/* Outer Orbiting Ring 2 (counter) */}
        <div
          className="absolute w-48 h-48 rounded-full border border-dotted opacity-30 animate-[spin_12s_linear_infinite_reverse]"
          style={{ borderColor: details.secondary }}
        />

        {/* Glowing Concentric Pulse Ring */}
        <div
          className={`absolute w-40 h-40 rounded-full border transition-all duration-700 ${
            state === 'LISTENING' || state === 'SPEAKING' ? 'scale-110 opacity-70 animate-pulse' : 'opacity-40'
          }`}
          style={{
            borderColor: details.glow,
            boxShadow: `0 0 25px ${details.glow}40`,
          }}
        />

        {/* Central Core Hologram Globe */}
        <button
          id="btn-interactive-ai-core"
          onClick={() => {
            sounds.playWakeChime();
            onToggleListening();
          }}
          className="relative z-10 w-32 h-32 rounded-full flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group hover:scale-105 active:scale-95"
          style={{
            background: `radial-gradient(circle at 35% 35%, ${details.glow}40, rgba(10, 15, 30, 0.95) 75%)`,
            border: `2px solid ${details.glow}`,
            boxShadow: `0 0 35px ${details.glow}60, inset 0 0 20px ${details.glow}30`,
          }}
          title={isListening ? 'Click to pause voice listening' : 'Click to activate ROBIN voice listening'}
        >
          {/* Orbital nodes on the sphere */}
          <div
            className="absolute w-2 h-2 rounded-full -top-1"
            style={{ backgroundColor: details.glow, boxShadow: `0 0 8px ${details.glow}` }}
          />
          <div
            className="absolute w-2 h-2 rounded-full -bottom-1"
            style={{ backgroundColor: details.glow, boxShadow: `0 0 8px ${details.glow}` }}
          />

          {/* Central Logo & Icon */}
          <span className="text-xl font-bold tracking-widest font-mono text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">
            ROBIN
          </span>
          <div className="mt-1 flex items-center gap-1">
            {details.icon}
          </div>
          <span className="text-[9px] font-mono tracking-widest uppercase text-slate-300 mt-1 opacity-80 group-hover:opacity-100">
            {isListening ? 'MIC ON' : 'TAP FOR MIC'}
          </span>
        </button>
      </div>

      {/* Dynamic Sound Waveform Visualizer */}
      <div className="flex items-center justify-center gap-1 h-12 my-2 px-6">
        {waveHeights.map((h, i) => (
          <div
            key={i}
            className="w-1.5 rounded-full transition-all duration-100"
            style={{
              height: `${h}px`,
              backgroundColor: i % 2 === 0 ? details.glow : details.secondary,
              boxShadow: `0 0 6px ${details.glow}60`,
            }}
          />
        ))}
      </div>

      {/* State & Core Status Labels */}
      <div className="text-center z-10 max-w-lg mt-1">
        <div className="flex items-center justify-center gap-2 mb-1">
          <span
            className="w-2 h-2 rounded-full animate-ping"
            style={{ backgroundColor: details.glow }}
          />
          <h2
            className="text-base font-bold font-mono tracking-widest uppercase transition-colors duration-300"
            style={{ color: details.glow }}
          >
            ◉ {details.label}
          </h2>
        </div>

        <p className="text-xs text-slate-300 font-mono tracking-wide leading-relaxed min-h-[1.5rem]">
          {transcriptText ? (
            <span className="text-cyan-300 font-medium">
              &ldquo;{transcriptText}&rdquo;
            </span>
          ) : (
            details.desc
          )}
        </p>

        {/* Action button triggers */}
        <div className="flex items-center justify-center gap-3 mt-4">
          <button
            id="btn-trigger-voice-listen"
            onClick={() => {
              sounds.playClick();
              onToggleListening();
            }}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-mono font-medium border transition-all ${
              isListening
                ? 'bg-cyan-500/20 text-cyan-200 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                : 'bg-slate-800/80 text-slate-300 hover:text-white border-slate-700 hover:border-slate-500'
            }`}
          >
            {isListening ? <Mic className="w-3.5 h-3.5 text-cyan-400 animate-pulse" /> : <MicOff className="w-3.5 h-3.5 text-slate-400" />}
            <span>{isListening ? 'Listening ("Robin...")' : 'Activate Voice'}</span>
          </button>

          <button
            id="btn-open-command-palette-center"
            onClick={() => {
              sounds.playClick();
              onOpenCommandCenter();
            }}
            className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-mono font-medium bg-slate-800/80 hover:bg-slate-700/80 text-sky-300 border border-slate-700 hover:border-sky-500/50 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>Command Palette (Ctrl+Space)</span>
          </button>
        </div>

        {/* Quick Language Chips & Voice Commands */}
        <div className="mt-3 pt-3 border-t border-slate-800/60 flex flex-wrap items-center justify-center gap-2">
          <span className="text-[11px] font-mono text-slate-400">Voice Language:</span>
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = language === lang.code;
            return (
              <button
                key={lang.code}
                id={`btn-lang-chip-${lang.code}`}
                onClick={() => {
                  sounds.playClick();
                  onLanguageChange?.(lang.code);
                }}
                className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full border transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-sky-500/20 text-sky-300 border-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.3)]'
                    : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-600 hover:text-slate-300'
                }`}
              >
                <span>{lang.flag}</span>
                <span className="font-medium">{lang.name}</span>
                <span className="opacity-70 text-[10px]">({lang.nativeName})</span>
              </button>
            );
          })}
        </div>

        {/* Sample Voice Commands in active language */}
        {(() => {
          const cfg = getLanguageConfig(language);
          return (
            <div className="mt-2 flex flex-wrap items-center justify-center gap-1.5 max-w-xl mx-auto">
              <span className="text-[10px] font-mono text-slate-500">Try saying:</span>
              {cfg.sampleCommands.slice(0, 3).map((sample, idx) => (
                <button
                  key={idx}
                  id={`btn-sample-cmd-${idx}`}
                  onClick={() => {
                    sounds.playClick();
                    onExecuteSample?.(sample.text);
                  }}
                  className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900/70 hover:bg-slate-800 text-slate-400 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/40 transition-colors"
                  title={sample.translation || "Click to execute this sample command"}
                >
                  &ldquo;{sample.text}&rdquo;
                </button>
              ))}
            </div>
          );
        })()}
      </div>
    </div>
  );
};
