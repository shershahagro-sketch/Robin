import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Mic,
  MicOff,
  Sparkles,
  CornerDownLeft,
  X,
  ShieldCheck,
  ShieldAlert,
  Clock,
  ArrowRight,
  FolderPlus,
  Cpu,
  Globe,
  Terminal,
} from 'lucide-react';
import { ThemeConfig, RiskLevel, SupportedLanguage } from '../types';
import { sounds } from '../services/soundEffects';
import { getLanguageConfig } from '../data/languages';

interface CommandCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExecuteCommand: (command: string) => void;
  isListening: boolean;
  onToggleListening: () => void;
  currentTheme: ThemeConfig;
  recentCommands: string[];
  language?: SupportedLanguage;
}

export const CommandCenterModal: React.FC<CommandCenterModalProps> = ({
  isOpen,
  onClose,
  onExecuteCommand,
  isListening,
  onToggleListening,
  currentTheme,
  recentCommands,
  language = 'en-US',
}) => {
  const [inputVal, setInputVal] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const langConfig = getLanguageConfig(language);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const suggestions = [
    { text: langConfig.sampleCommands[0]?.text || 'Open Chrome', category: 'App', icon: <Globe className="w-3.5 h-3.5 text-sky-400" /> },
    { text: langConfig.sampleCommands[1]?.text || 'Show CPU and RAM usage', category: 'System', icon: <Cpu className="w-3.5 h-3.5 text-emerald-400" /> },
    { text: langConfig.sampleCommands[2]?.text || 'Create folder Projects on desktop', category: 'Files', icon: <FolderPlus className="w-3.5 h-3.5 text-amber-400" /> },
    { text: langConfig.sampleCommands[3]?.text || 'Search web for AI news', category: 'Web', icon: <Search className="w-3.5 h-3.5 text-blue-400" /> },
    { text: langConfig.sampleCommands[4]?.text || 'Take a screenshot', category: 'PC', icon: <Sparkles className="w-3.5 h-3.5 text-teal-400" /> },
    { text: 'Open Chrome', category: 'English', icon: <Globe className="w-3.5 h-3.5 text-sky-400" /> },
    { text: 'Chrome खोलो', category: 'हिन्दी', icon: <Globe className="w-3.5 h-3.5 text-amber-400" /> },
    { text: 'کروم کھولیں', category: 'اردو', icon: <Globe className="w-3.5 h-3.5 text-emerald-400" /> },
  ];

  const filteredSuggestions = inputVal.trim()
    ? suggestions.filter((s) => s.text.toLowerCase().includes(inputVal.toLowerCase()))
    : suggestions;

  // Real-time risk preview
  const getPredictedRisk = (cmd: string): { risk: RiskLevel; label: string; color: string } => {
    const l = cmd.toLowerCase();
    if (l.includes('delete') || l.includes('kill all') || l.includes('format') || l.includes('close everything')) {
      return { risk: 'high', label: 'HIGH RISK • MANDATORY CONFIRMATION', color: 'text-rose-400 bg-rose-950/40 border-rose-800' };
    }
    if (l.includes('create') || l.includes('move') || l.includes('rename') || l.includes('macro')) {
      return { risk: 'medium', label: 'MEDIUM RISK • SYSTEM MODIFICATION', color: 'text-amber-400 bg-amber-950/40 border-amber-800' };
    }
    return { risk: 'low', label: 'LOW RISK • SAFE EXECUTION', color: 'text-emerald-400 bg-emerald-950/40 border-emerald-800' };
  };

  const riskPreview = inputVal.trim() ? getPredictedRisk(inputVal) : null;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim()) return;
    sounds.playExecutionWhoosh();
    onExecuteCommand(inputVal.trim());
    setInputVal('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/75 backdrop-blur-md transition-all animate-fadeIn">
      <div
        id="robin-command-center-palette"
        className="w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden font-mono text-slate-200 transition-all transform scale-100"
        style={{
          backgroundColor: currentTheme.panelBg,
          borderColor: currentTheme.panelBorder,
          boxShadow: `0 20px 60px ${currentTheme.glowColor}30, 0 0 0 1px ${currentTheme.panelBorder}`,
        }}
      >
        {/* Top Input Bar */}
        <form onSubmit={handleSubmit} className="flex items-center gap-3 px-4 py-3.5 border-b" style={{ borderColor: currentTheme.panelBorder }}>
          <Search className="w-5 h-5 text-sky-400 animate-pulse" />
          <input
            id="input-command-center-query"
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={`Ask ROBIN in ${langConfig.name} (${langConfig.nativeName}) or English...`}
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 outline-none font-mono"
          />

          <span className="hidden sm:inline-block text-[11px] px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/40">
            {langConfig.flag} {langConfig.name}
          </span>

          {/* Voice Input Trigger */}
          <button
            id="btn-palette-voice"
            type="button"
            onClick={() => {
              sounds.playClick();
              onToggleListening();
            }}
            className={`p-1.5 rounded-lg border transition-all ${
              isListening
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.5)]'
                : 'bg-slate-800/80 text-slate-400 hover:text-white border-slate-700'
            }`}
            title="Toggle Voice Dictation"
          >
            {isListening ? <Mic className="w-4 h-4 animate-pulse text-cyan-300" /> : <MicOff className="w-4 h-4" />}
          </button>

          {/* Execute Submit Button */}
          <button
            id="btn-palette-submit"
            type="submit"
            disabled={!inputVal.trim()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 disabled:opacity-40 disabled:hover:bg-sky-600 transition-all"
          >
            <span>Run</span>
            <CornerDownLeft className="w-3.5 h-3.5" />
          </button>

          <button
            id="btn-palette-close"
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </form>

        {/* Real-time Risk Assessment Banner */}
        {riskPreview && (
          <div className={`px-4 py-1.5 border-b text-[11px] font-semibold flex items-center justify-between ${riskPreview.color}`}>
            <div className="flex items-center gap-2">
              {riskPreview.risk === 'high' ? (
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              ) : (
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              )}
              <span>PREDICTED RISK: {riskPreview.label}</span>
            </div>
            <span className="text-[10px] opacity-80">AI Safety Evaluator Active</span>
          </div>
        )}

        {/* Suggestions & History Grid */}
        <div className="p-4 max-h-[60vh] overflow-y-auto space-y-4 text-xs">
          {/* Recent Commands */}
          {recentCommands.length > 0 && !inputVal.trim() && (
            <div>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-2">
                <Clock className="w-3 h-3 text-sky-400" />
                <span>Recent Commands</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {recentCommands.slice(0, 4).map((cmd, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      onExecuteCommand(cmd);
                      onClose();
                    }}
                    className="flex items-center justify-between p-2 rounded-lg border border-slate-800 hover:border-sky-500/50 bg-slate-900/40 hover:bg-slate-800/60 text-left transition-all group"
                  >
                    <span className="text-slate-300 group-hover:text-white truncate">{cmd}</span>
                    <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-sky-400 ml-2 shrink-0 transition-transform group-hover:translate-x-0.5" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Suggested Directives */}
          <div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>Suggested Operations</span>
            </div>
            <div className="space-y-1">
              {filteredSuggestions.map((sug, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    onExecuteCommand(sug.text);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-lg border border-slate-800/80 hover:border-sky-500/60 bg-slate-900/30 hover:bg-slate-800/60 text-left transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1 rounded bg-slate-800/80">{sug.icon}</div>
                    <span className="text-slate-300 group-hover:text-white font-mono">{sug.text}</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800/80 text-slate-400 group-hover:text-sky-300">
                    {sug.category}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 bg-black/40 border-t flex items-center justify-between text-[11px] text-slate-400 font-mono" style={{ borderColor: currentTheme.panelBorder }}>
          <span>Press [Esc] to dismiss • [Enter] to execute</span>
          <span className="text-sky-400 font-semibold">ROBIN Autonomous Kernel</span>
        </div>
      </div>
    </div>
  );
};
