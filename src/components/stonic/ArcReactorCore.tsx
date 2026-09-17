import React, { useEffect, useState, useRef } from 'react';
import { Mic, MicOff, Volume2, Sparkles, AlertTriangle, ShieldCheck, Zap, Activity, Radio, Cpu, RotateCw } from 'lucide-react';
import { RobinState, ThemeConfig, SupportedLanguage } from '../../types';
import { sounds } from '../../services/soundEffects';
import { SUPPORTED_LANGUAGES, getLanguageConfig } from '../../data/languages';

interface ArcReactorCoreProps {
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
  activePersona?: string;
}

export const ArcReactorCore: React.FC<ArcReactorCoreProps> = ({
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
  activePersona = 'J.A.R.V.I.S.',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [pulsePhase, setPulsePhase] = useState(0);

  // Smooth rotation animation for reactor outer ring
  useEffect(() => {
    let animId: number;
    let angle = 0;
    const animate = () => {
      const speed = state === 'THINKING' ? 3 : state === 'LISTENING' ? 1.5 : 0.6;
      angle = (angle + speed) % 360;
      setRotationAngle(angle);
      setPulsePhase((prev) => (prev + 0.05) % (Math.PI * 2));
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [state]);

  // Audio frequency wave visualizer canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let frame = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;
      const barsCount = 36;
      const barWidth = 4;
      const spacing = (width - barsCount * barWidth) / (barsCount - 1);

      const isSpeaking = state === 'SPEAKING';
      const isListeningActive = state === 'LISTENING';
      const isExecuting = state === 'EXECUTING';

      // Base color based on state
      const color =
        state === 'LISTENING'
          ? '#00F0FF'
          : state === 'THINKING'
          ? '#C084FC'
          : state === 'EXECUTING'
          ? '#34D399'
          : state === 'SPEAKING'
          ? '#FBBF24'
          : state === 'WARNING'
          ? '#F87171'
          : currentTheme.primaryColor || '#00F0FF';

      ctx.fillStyle = color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = color;

      for (let i = 0; i < barsCount; i++) {
        const x = i * (barWidth + spacing);
        let barHeight = 6;

        if (isListeningActive || isSpeaking || isExecuting) {
          const wave1 = Math.sin(frame * 0.15 + i * 0.35);
          const wave2 = Math.cos(frame * 0.1 + i * 0.5);
          const factor = (Math.abs(wave1 * wave2) + 0.15) * (isSpeaking ? 38 : 26);
          barHeight = Math.max(6, factor);
        } else {
          barHeight = 4 + Math.sin(frame * 0.05 + i * 0.4) * 3;
        }

        ctx.fillRect(x, centerY - barHeight / 2, barWidth, barHeight);
      }

      frame++;
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [state, currentTheme]);

  const getStateMeta = () => {
    switch (state) {
      case 'LISTENING':
        return {
          title: `${activePersona} IS LISTENING`,
          glow: '#00F0FF',
          accent: '#0284C7',
          status: 'Acoustic sensor calibrated. Speak directive...',
          badge: 'VOICE ENGAGED',
          icon: <Mic className="w-5 h-5 text-cyan-300 animate-pulse" />,
        };
      case 'THINKING':
        return {
          title: 'NEURAL FLUX PROCESSING',
          glow: '#C084FC',
          accent: '#7E22CE',
          status: 'Gemini reasoning agent mapping intention matrix...',
          badge: 'COGNITIVE FLUX',
          icon: <Sparkles className="w-5 h-5 text-purple-300 animate-spin" />,
        };
      case 'EXECUTING':
        return {
          title: 'AUTONOMOUS SUB-AGENT ACTIVE',
          glow: '#34D399',
          accent: '#059669',
          status: activeCommandSummary || 'Invoking Windows PC control subsystem...',
          badge: 'TOOL IN FLIGHT',
          icon: <ShieldCheck className="w-5 h-5 text-emerald-300 animate-pulse" />,
        };
      case 'SPEAKING':
        return {
          title: `${activePersona} VOCALIZING`,
          glow: '#FBBF24',
          accent: '#D97706',
          status: 'Synthesizing voice response through neural acoustic pipeline...',
          badge: 'AUDIO SYNTH',
          icon: <Volume2 className="w-5 h-5 text-amber-300 animate-bounce" />,
        };
      case 'WARNING':
        return {
          title: 'SAFETY PROTOCOL ENGAGED',
          glow: '#F87171',
          accent: '#DC2626',
          status: 'High-risk Windows operation requires user verification.',
          badge: 'DEFCON 2 ALERT',
          icon: <AlertTriangle className="w-5 h-5 text-rose-400 animate-ping" />,
        };
      default:
        return {
          title: `${activePersona} COMMAND CORE ONLINE`,
          glow: currentTheme.primaryColor || '#00F0FF',
          accent: currentTheme.secondaryColor || '#2563EB',
          status: 'Mark-85 Arc Reactor operating at 100% nominal capacity. Ready for directives.',
          badge: 'SYSTEM NOMINAL',
          icon: <Zap className="w-5 h-5 text-cyan-300" />,
        };
    }
  };

  const meta = getStateMeta();

  return (
    <div
      id="stonic-arc-reactor-core"
      className="relative flex flex-col items-center justify-center p-6 md:p-8 rounded-2xl border transition-all duration-500 overflow-hidden font-mono select-none"
      style={{
        backgroundColor: currentTheme.panelBg,
        borderColor: currentTheme.panelBorder,
        boxShadow: `0 12px 40px ${meta.glow}25, inset 0 0 50px ${meta.glow}0f`,
      }}
    >
      {/* Sci-Fi HUD Corner Brackets */}
      <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-400/70 pointer-events-none" />
      <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-cyan-400/70 pointer-events-none" />
      <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-cyan-400/70 pointer-events-none" />
      <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-cyan-400/70 pointer-events-none" />

      {/* Background Radial Glow */}
      <div
        className="absolute w-[450px] h-[450px] rounded-full blur-3xl pointer-events-none opacity-20 transition-all duration-700"
        style={{
          background: `radial-gradient(circle, ${meta.glow} 0%, transparent 70%)`,
        }}
      />

      {/* Top Telemetry Ticker Header */}
      <div className="w-full flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800/80 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-cyan-400 font-bold">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>STONIC ARC-CORE</span>
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300 font-semibold">{meta.badge}</span>
        </div>

        <div className="hidden sm:flex items-center gap-3 text-[10px] text-slate-400">
          <span>OUTPUT: <strong className="text-cyan-300 font-mono">3.8 GW</strong></span>
          <span>•</span>
          <span>TEMP: <strong className="text-emerald-400 font-mono">29.4°C</strong></span>
          <span>•</span>
          <span>FREQ: <strong className="text-purple-300 font-mono">432 HZ</strong></span>
        </div>
      </div>

      {/* Iron Man Mark-85 Arc Reactor Holographic Visualizer */}
      <div className="relative w-64 h-64 md:w-72 md:h-72 flex items-center justify-center my-2">
        {/* Outer Tech Calibrations Ring (rotating) */}
        <div
          className="absolute inset-0 rounded-full border border-dashed opacity-40"
          style={{
            borderColor: meta.glow,
            transform: `rotate(${rotationAngle}deg)`,
            transition: 'transform 0.05s linear',
          }}
        />

        {/* Counter-rotating degree ring */}
        <div
          className="absolute w-[92%] h-[92%] rounded-full border border-dotted opacity-30"
          style={{
            borderColor: meta.accent,
            transform: `rotate(-${rotationAngle * 1.5}deg)`,
            transition: 'transform 0.05s linear',
          }}
        />

        {/* Copper Induction Coil Nodes (10 segments around perimeter) */}
        {Array.from({ length: 10 }).map((_, i) => {
          const angle = (i * 36) + rotationAngle;
          const rad = (angle * Math.PI) / 180;
          const radius = 120;
          const x = Math.cos(rad) * radius;
          const y = Math.sin(rad) * radius;

          return (
            <div
              key={i}
              className="absolute w-3 h-3 rounded-full flex items-center justify-center pointer-events-none transition-all duration-300"
              style={{
                transform: `translate(${x}px, ${y}px)`,
                backgroundColor: i % 2 === 0 ? meta.glow : meta.accent,
                boxShadow: `0 0 10px ${meta.glow}`,
                opacity: 0.85,
              }}
            >
              <div className="w-1 h-1 rounded-full bg-white" />
            </div>
          );
        })}

        {/* Pulsing Concentric Energy Ring */}
        <div
          className="absolute w-48 h-48 rounded-full border-2 transition-all duration-500"
          style={{
            borderColor: meta.glow,
            transform: `scale(${1 + Math.sin(pulsePhase) * 0.05})`,
            boxShadow: `0 0 25px ${meta.glow}40, inset 0 0 15px ${meta.glow}20`,
          }}
        />

        {/* Arc Reactor Central Iris Button */}
        <button
          id="btn-stonic-arc-reactor"
          onClick={() => {
            sounds.playWakeChime();
            onToggleListening();
          }}
          className="relative z-10 w-36 h-36 md:w-40 md:h-40 rounded-full flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group hover:scale-105 active:scale-95"
          style={{
            background: `radial-gradient(circle at 40% 40%, ${meta.glow}30, #040814 80%)`,
            border: `2.5px solid ${meta.glow}`,
            boxShadow: `0 0 40px ${meta.glow}70, inset 0 0 30px ${meta.glow}40`,
          }}
          title={isListening ? 'Click to stop listening' : `Click to speak to ${activePersona}`}
        >
          {/* Central Reactor Core Triangle Glyph */}
          <div className="relative flex flex-col items-center">
            <div className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.9)] mb-1">
              {meta.icon}
            </div>
            <span className="text-sm md:text-base font-black tracking-widest text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.9)] font-mono">
              {activePersona}
            </span>
            <span className="text-[10px] font-bold tracking-widest text-cyan-300 uppercase mt-0.5 opacity-90 group-hover:opacity-100">
              {isListening ? 'MIC ACTIVE' : 'TAP TO SPEAK'}
            </span>
          </div>
        </button>
      </div>

      {/* Real-Time Audio Spectrum Canvas Visualizer */}
      <div className="w-full max-w-md h-12 my-2 flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={360}
          height={48}
          className="w-full h-full"
        />
      </div>

      {/* Reactor State & Live Directive Readout */}
      <div className="text-center z-10 max-w-xl mt-1">
        <div className="flex items-center justify-center gap-2 mb-1.5">
          <span
            className="w-2.5 h-2.5 rounded-full animate-ping"
            style={{ backgroundColor: meta.glow }}
          />
          <h2
            className="text-sm md:text-base font-bold font-mono tracking-widest uppercase transition-colors duration-300"
            style={{ color: meta.glow }}
          >
            ◉ {meta.title}
          </h2>
        </div>

        <p className="text-xs text-slate-300 font-mono tracking-wide leading-relaxed min-h-[2rem]">
          {transcriptText ? (
            <span className="text-cyan-300 font-semibold bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/80">
              &ldquo;{transcriptText}&rdquo;
            </span>
          ) : (
            meta.status
          )}
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mt-4">
          <button
            id="btn-toggle-arc-voice"
            onClick={() => {
              sounds.playClick();
              onToggleListening();
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-bold border transition-all ${
              isListening
                ? 'bg-cyan-500/25 text-cyan-200 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.5)]'
                : 'bg-slate-900/90 text-slate-300 hover:text-white border-slate-700 hover:border-cyan-400'
            }`}
          >
            {isListening ? (
              <Mic className="w-4 h-4 text-cyan-400 animate-pulse" />
            ) : (
              <MicOff className="w-4 h-4 text-slate-400" />
            )}
            <span>{isListening ? 'Listening ("Hey Jarvis...")' : 'Activate Voice Stream'}</span>
          </button>

          <button
            id="btn-open-stonic-command-center"
            onClick={() => {
              sounds.playClick();
              onOpenCommandCenter();
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-medium bg-slate-900/90 hover:bg-slate-800 text-sky-300 border border-slate-700 hover:border-sky-400 transition-all shadow-[0_0_10px_rgba(56,189,248,0.2)]"
          >
            <Sparkles className="w-4 h-4 text-sky-400" />
            <span>Command Palette (Ctrl+Space)</span>
          </button>
        </div>

        {/* Quick Language Switcher */}
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-1.5">
          <span className="text-[11px] font-mono text-slate-400 mr-1">Voice Dialect:</span>
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = language === lang.code;
            return (
              <button
                key={lang.code}
                id={`btn-lang-selector-${lang.code}`}
                onClick={() => {
                  sounds.playClick();
                  onLanguageChange?.(lang.code);
                }}
                className={`text-[11px] font-mono px-2 py-0.5 rounded border transition-all flex items-center gap-1 ${
                  isSelected
                    ? 'bg-sky-500/25 text-sky-300 border-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.3)]'
                    : 'bg-slate-900/50 text-slate-400 border-slate-800 hover:border-slate-600 hover:text-slate-300'
                }`}
              >
                <span>{lang.flag}</span>
                <span>{lang.name}</span>
              </button>
            );
          })}
        </div>

        {/* Quick Sample Prompts */}
        {(() => {
          const cfg = getLanguageConfig(language);
          return (
            <div className="mt-2.5 flex flex-wrap items-center justify-center gap-1.5">
              <span className="text-[10px] text-slate-500">Quick Voice Directives:</span>
              {cfg.sampleCommands.slice(0, 3).map((cmd, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    sounds.playClick();
                    onExecuteSample?.(cmd.text);
                  }}
                  className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/40 transition-colors"
                  title="Click to execute"
                >
                  &ldquo;{cmd.text}&rdquo;
                </button>
              ))}
            </div>
          );
        })()}
      </div>
    </div>
  );
};
