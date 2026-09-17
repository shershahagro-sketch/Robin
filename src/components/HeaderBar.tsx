import React from 'react';
import {
  ShieldAlert,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Search,
  Sidebar as SidebarIcon,
  Palette,
  Settings as SettingsIcon,
  Radio,
  Zap,
} from 'lucide-react';
import { RobinState, VoicePersonality, ThemeConfig, SupportedLanguage } from '../types';
import { sounds } from '../services/soundEffects';
import { SUPPORTED_LANGUAGES } from '../data/languages';

interface HeaderBarProps {
  robinState: RobinState;
  personality: VoicePersonality;
  onPersonalityChange: (p: VoicePersonality) => void;
  language: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  isListening: boolean;
  onToggleListening: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenCommandCenter: () => void;
  onEmergencyStop: () => void;
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  currentTheme: ThemeConfig;
  availableThemes: ThemeConfig[];
  onSelectTheme: (id: string) => void;
  onOpenSettings: () => void;
  emergencyStopped: boolean;
  onResetEmergency: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  robinState,
  personality,
  onPersonalityChange,
  language,
  onLanguageChange,
  isListening,
  onToggleListening,
  soundEnabled,
  onToggleSound,
  onOpenCommandCenter,
  onEmergencyStop,
  sidebarCollapsed,
  onToggleSidebar,
  currentTheme,
  availableThemes,
  onSelectTheme,
  onOpenSettings,
  emergencyStopped,
  onResetEmergency,
}) => {
  const getStateBadge = () => {
    switch (robinState) {
      case 'LISTENING':
        return { text: 'LISTENING', bg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40', dot: 'bg-cyan-400 animate-ping' };
      case 'THINKING':
        return { text: 'THINKING', bg: 'bg-purple-500/20 text-purple-300 border-purple-500/40', dot: 'bg-purple-400 animate-spin' };
      case 'EXECUTING':
        return { text: 'EXECUTING', bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', dot: 'bg-emerald-400 animate-pulse' };
      case 'SPEAKING':
        return { text: 'SPEAKING', bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40', dot: 'bg-amber-400 animate-pulse' };
      case 'WARNING':
        return { text: 'CAUTION', bg: 'bg-rose-500/20 text-rose-300 border-rose-500/40', dot: 'bg-rose-400 animate-ping' };
      case 'ERROR':
        return { text: 'ERROR', bg: 'bg-red-500/20 text-red-300 border-red-500/40', dot: 'bg-red-500' };
      case 'OFFLINE':
        return { text: 'LOCAL MODE', bg: 'bg-slate-500/20 text-slate-300 border-slate-500/40', dot: 'bg-slate-400' };
      default:
        return { text: 'ONLINE', bg: 'bg-sky-500/20 text-sky-300 border-sky-500/40', dot: 'bg-sky-400' };
    }
  };

  const badge = getStateBadge();

  return (
    <header
      id="robin-header-bar"
      className="w-full flex items-center justify-between px-4 py-2.5 border-b backdrop-blur-md z-30 transition-colors"
      style={{
        backgroundColor: currentTheme.panelBg,
        borderColor: currentTheme.panelBorder,
        boxShadow: `0 4px 20px ${currentTheme.glowColor}`,
      }}
    >
      {/* Brand & State */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-lg tracking-wider border transition-all"
            style={{
              borderColor: currentTheme.primaryColor,
              color: currentTheme.primaryColor,
              boxShadow: `0 0 12px ${currentTheme.primaryColor}55`,
              backgroundColor: `${currentTheme.primaryColor}15`,
            }}
          >
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-widest text-white uppercase font-mono">ROBIN</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-medium tracking-wide bg-sky-500/20 text-sky-300 border border-sky-500/30">
                JARVIS CORE
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono tracking-tight hidden sm:block">
              Windows PC Command Center v2.4
            </p>
          </div>
        </div>

        {/* State Pill */}
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono border ${badge.bg}`}>
          <span className={`w-2 h-2 rounded-full ${badge.dot}`} />
          <span>{badge.text}</span>
        </div>
      </div>

      {/* Center Search / Command Launcher Trigger */}
      <div className="flex items-center gap-2 flex-1 max-w-md mx-4">
        <button
          id="btn-open-command-center"
          onClick={() => {
            sounds.playClick();
            onOpenCommandCenter();
          }}
          className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg border text-xs font-mono text-slate-300 hover:text-white transition-all group"
          style={{
            borderColor: currentTheme.panelBorder,
            backgroundColor: 'rgba(0, 0, 0, 0.35)',
          }}
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-sky-400 group-hover:scale-110 transition-transform" />
            <span className="text-slate-400 group-hover:text-slate-200">Ask ROBIN anything (e.g. &quot;Open Chrome&quot;, &quot;CPU status&quot;)...</span>
          </div>
          <kbd className="px-1.5 py-0.5 text-[10px] bg-slate-800 border border-slate-700 rounded text-slate-400 font-mono">
            Ctrl + Space
          </kbd>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        {/* Emergency Stop Latch */}
        {emergencyStopped ? (
          <button
            id="btn-emergency-reset"
            onClick={() => {
              sounds.playClick();
              onResetEmergency();
            }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono font-bold bg-amber-500 hover:bg-amber-400 text-black border border-amber-300 animate-pulse transition-all"
            title="Emergency Stop is currently active. Click to reset."
          >
            <Zap className="w-3.5 h-3.5" />
            <span>RESET LATCH</span>
          </button>
        ) : (
          <button
            id="btn-emergency-stop"
            onClick={() => {
              sounds.playEmergencyStop();
              onEmergencyStop();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono text-red-400 hover:text-white bg-red-950/40 hover:bg-red-600 border border-red-800/80 transition-all group"
            title="EMERGENCY STOP (Ctrl+Shift+Esc): Aborts all macros, browser actions & execution loops"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-red-400 group-hover:text-white" />
            <span className="hidden md:inline font-semibold">STOP</span>
            <span className="text-[10px] text-red-500 group-hover:text-red-200 font-normal hidden lg:inline">
              Ctrl+Shift+Esc
            </span>
          </button>
        )}

        {/* Language Selector (Hindi, English, Urdu) */}
        <select
          id="select-voice-language"
          value={language}
          onChange={(e) => {
            sounds.playClick();
            onLanguageChange(e.target.value as SupportedLanguage);
          }}
          className="bg-slate-900/90 text-xs font-mono text-slate-200 border border-sky-500/50 rounded-md px-2 py-1 outline-none hover:border-sky-400 focus:border-sky-400 transition-colors cursor-pointer shadow-sm"
          title="Command & Voice Language (Hindi / English / Urdu)"
        >
          {SUPPORTED_LANGUAGES.map((l) => (
            <option key={l.code} value={l.code}>
              {l.flag} {l.name} ({l.nativeName})
            </option>
          ))}
        </select>

        {/* Personality Selector */}
        <select
          id="select-voice-personality"
          value={personality}
          onChange={(e) => {
            sounds.playClick();
            onPersonalityChange(e.target.value as VoicePersonality);
          }}
          className="bg-slate-900/90 text-xs font-mono text-slate-300 border border-slate-700/80 rounded-md px-2 py-1 outline-none hover:border-slate-500 focus:border-sky-500 transition-colors hidden xl:block"
          title="Voice response personality"
        >
          <option value="Professional">Persona: Professional</option>
          <option value="Friendly">Persona: Friendly</option>
          <option value="Executive">Persona: Executive</option>
          <option value="Futuristic">Persona: Futuristic</option>
          <option value="Calm">Persona: Calm</option>
          <option value="Technical">Persona: Technical</option>
          <option value="Minimal">Persona: Minimal</option>
          <option value="Assistant">Persona: Assistant</option>
        </select>

        {/* Theme Quick Switcher */}
        <div className="relative group hidden lg:block">
          <select
            id="select-quick-theme"
            value={currentTheme.id}
            onChange={(e) => {
              sounds.playClick();
              onSelectTheme(e.target.value);
            }}
            className="bg-slate-900/90 text-xs font-mono text-slate-300 border border-slate-700/80 rounded-md px-2 py-1 outline-none hover:border-slate-500 transition-colors"
            title="Quick Theme Selector"
          >
            {availableThemes.map((t) => (
              <option key={t.id} value={t.id}>
                Theme: {t.name}
              </option>
            ))}
          </select>
        </div>

        {/* Voice Toggle */}
        <button
          id="btn-voice-toggle"
          onClick={() => {
            sounds.playClick();
            onToggleListening();
          }}
          className={`p-1.5 rounded-md border transition-all ${
            isListening
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.5)]'
              : 'bg-slate-900/80 text-slate-400 hover:text-white border-slate-700 hover:border-slate-600'
          }`}
          title={isListening ? 'Voice listening is ACTIVE (Say "Robin")' : 'Click to enable Voice Listening'}
        >
          {isListening ? <Mic className="w-4 h-4 animate-pulse" /> : <MicOff className="w-4 h-4" />}
        </button>

        {/* Sound FX Toggle */}
        <button
          id="btn-sound-toggle"
          onClick={() => {
            sounds.playClick();
            onToggleSound();
          }}
          className={`p-1.5 rounded-md border transition-all ${
            soundEnabled
              ? 'bg-slate-900/80 text-sky-400 border-slate-700 hover:border-sky-500'
              : 'bg-slate-900/80 text-slate-500 border-slate-800 hover:border-slate-700'
          }`}
          title={soundEnabled ? 'Synthesized Audio Feedback Enabled' : 'Audio Feedback Muted'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Settings button */}
        <button
          id="btn-open-settings"
          onClick={() => {
            sounds.playClick();
            onOpenSettings();
          }}
          className="p-1.5 rounded-md border bg-slate-900/80 text-slate-400 hover:text-white border-slate-700 hover:border-slate-600 transition-all"
          title="Open Settings & Preferences"
        >
          <SettingsIcon className="w-4 h-4" />
        </button>

        {/* Toggle Live Activity Sidebar */}
        <button
          id="btn-toggle-sidebar"
          onClick={() => {
            sounds.playClick();
            onToggleSidebar();
          }}
          className={`p-1.5 rounded-md border transition-all ${
            !sidebarCollapsed
              ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
              : 'bg-slate-900/80 text-slate-400 hover:text-white border-slate-700'
          }`}
          title={sidebarCollapsed ? 'Show Live Logs Sidebar' : 'Hide Live Logs Sidebar'}
        >
          <SidebarIcon className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
