import React from 'react';
import {
  Globe,
  FolderTree,
  Terminal,
  Camera,
  Activity,
  Search,
  Mic,
  Command,
  Lock,
  Briefcase,
  ShieldAlert,
} from 'lucide-react';
import { ThemeConfig } from '../types';
import { sounds } from '../services/soundEffects';

interface QuickActionsBarProps {
  currentTheme: ThemeConfig;
  onExecuteCommand: (cmd: string) => void;
  onEmergencyStop: () => void;
  onOpenCommandCenter: () => void;
  onToggleVoice: () => void;
}

export const QuickActionsBar: React.FC<QuickActionsBarProps> = ({
  currentTheme,
  onExecuteCommand,
  onEmergencyStop,
  onOpenCommandCenter,
  onToggleVoice,
}) => {
  const actions = [
    {
      id: 'qa-chrome',
      label: 'Open Browser',
      icon: <Globe className="w-3.5 h-3.5 text-sky-400" />,
      command: 'Open Chrome',
    },
    {
      id: 'qa-explorer',
      label: 'File Explorer',
      icon: <FolderTree className="w-3.5 h-3.5 text-amber-400" />,
      command: 'Open File Explorer',
    },
    {
      id: 'qa-terminal',
      label: 'Terminal',
      icon: <Terminal className="w-3.5 h-3.5 text-emerald-400" />,
      command: 'Open Terminal',
    },
    {
      id: 'qa-screenshot',
      label: 'Screenshot',
      icon: <Camera className="w-3.5 h-3.5 text-purple-400" />,
      command: 'Take a screenshot',
    },
    {
      id: 'qa-system',
      label: 'System Status',
      icon: <Activity className="w-3.5 h-3.5 text-teal-400" />,
      command: 'Show my CPU and RAM usage',
    },
    {
      id: 'qa-search',
      label: 'Search Web',
      icon: <Search className="w-3.5 h-3.5 text-blue-400" />,
      command: 'Search the web for AI developments',
    },
    {
      id: 'qa-work',
      label: 'Start Work',
      icon: <Briefcase className="w-3.5 h-3.5 text-indigo-400" />,
      command: 'start work',
    },
    {
      id: 'qa-lock',
      label: 'Lock PC',
      icon: <Lock className="w-3.5 h-3.5 text-rose-400" />,
      command: 'Lock my computer',
    },
  ];

  return (
    <div
      id="quick-actions-bar"
      className="p-3 rounded-xl border transition-all flex flex-wrap items-center justify-between gap-2 text-xs font-mono"
      style={{
        backgroundColor: currentTheme.panelBg,
        borderColor: currentTheme.panelBorder,
      }}
    >
      <div className="flex items-center gap-1.5 text-slate-400 text-[11px] uppercase tracking-wider font-semibold mr-2">
        <span className="w-2 h-2 rounded-full bg-sky-400" />
        <span>QUICK ACTIONS:</span>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap flex-1">
        {actions.map((act) => (
          <button
            key={act.id}
            id={act.id}
            onClick={() => {
              sounds.playClick();
              onExecuteCommand(act.command);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-700/80 hover:border-sky-500/60 bg-slate-900/60 hover:bg-slate-800/80 text-slate-300 hover:text-white transition-all text-xs font-mono shadow-sm active:scale-95"
            title={`Executes: "${act.command}"`}
          >
            {act.icon}
            <span>{act.label}</span>
          </button>
        ))}

        {/* Command Center & Voice triggers */}
        <button
          id="btn-qa-command-center"
          onClick={() => {
            sounds.playClick();
            onOpenCommandCenter();
          }}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-sky-500/40 bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 transition-all text-xs font-mono"
        >
          <Command className="w-3.5 h-3.5" />
          <span>Palette</span>
        </button>

        <button
          id="btn-qa-voice"
          onClick={() => {
            sounds.playClick();
            onToggleVoice();
          }}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-cyan-500/40 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 transition-all text-xs font-mono"
        >
          <Mic className="w-3.5 h-3.5" />
          <span>Voice</span>
        </button>
      </div>

      <button
        id="btn-qa-emergency"
        onClick={() => {
          sounds.playEmergencyStop();
          onEmergencyStop();
        }}
        className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono text-red-400 bg-red-950/40 hover:bg-red-600 hover:text-white border border-red-800/70 transition-all"
        title="Emergency Stop (Ctrl+Shift+Esc)"
      >
        <ShieldAlert className="w-3.5 h-3.5" />
        <span className="font-semibold">STOP</span>
      </button>
    </div>
  );
};
