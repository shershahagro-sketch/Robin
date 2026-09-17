import React, { useState } from 'react';
import { ArcReactorCore } from '../stonic/ArcReactorCore';
import { WorldMonitor } from '../stonic/WorldMonitor';
import { AgentTown } from '../stonic/AgentTown';
import { FourCircuitsPanel } from '../stonic/FourCircuitsPanel';
import { StreamerDeck } from '../stonic/StreamerDeck';
import { LiveTelemetryGrid } from '../LiveTelemetryGrid';
import { QuickActionsBar } from '../QuickActionsBar';
import { RobinState, SystemTelemetry, ThemeConfig, CommandItem, SupportedLanguage } from '../../types';
import { CheckCircle2, Clock, Play, AlertCircle, Zap, Globe, Users, Flame, Tv, LayoutDashboard, Radio } from 'lucide-react';
import { sounds } from '../../services/soundEffects';

interface DashboardViewProps {
  robinState: RobinState;
  statusText: string;
  transcriptText: string;
  isListening: boolean;
  onToggleListening: () => void;
  telemetry: SystemTelemetry;
  currentTheme: ThemeConfig;
  recentCommands: CommandItem[];
  onExecuteCommand: (cmd: string) => void;
  onEmergencyStop: () => void;
  onOpenCommandCenter: () => void;
  language?: SupportedLanguage;
  onLanguageChange?: (lang: SupportedLanguage) => void;
}

export type StonicDashboardMode =
  | 'COMMAND_CORE'
  | 'WORLD_MONITOR'
  | 'AGENT_TOWN'
  | 'FOUR_CIRCUITS'
  | 'STREAMER_DECK'
  | 'PANORAMIC_HUD';

export const DashboardView: React.FC<DashboardViewProps> = ({
  robinState,
  statusText,
  transcriptText,
  isListening,
  onToggleListening,
  telemetry,
  currentTheme,
  recentCommands,
  onExecuteCommand,
  onEmergencyStop,
  onOpenCommandCenter,
  language = 'en-US',
  onLanguageChange,
}) => {
  const [dashboardMode, setDashboardMode] = useState<StonicDashboardMode>('COMMAND_CORE');
  const [activePersona, setActivePersona] = useState<string>('J.A.R.V.I.S.');

  const modes = [
    {
      id: 'COMMAND_CORE' as const,
      label: 'Stark Arc Reactor',
      icon: <Zap className="w-3.5 h-3.5 text-cyan-400" />,
      tag: 'CORE',
    },
    {
      id: 'WORLD_MONITOR' as const,
      label: 'World Monitor 3D',
      icon: <Globe className="w-3.5 h-3.5 text-blue-400" />,
      tag: 'SATELLITE',
    },
    {
      id: 'AGENT_TOWN' as const,
      label: 'Agent Town',
      icon: <Users className="w-3.5 h-3.5 text-emerald-400" />,
      tag: 'SPATIAL UI',
    },
    {
      id: 'FOUR_CIRCUITS' as const,
      label: 'The 4 Circuits',
      icon: <Flame className="w-3.5 h-3.5 text-purple-400" />,
      tag: 'SOUL & MEMORY',
    },
    {
      id: 'STREAMER_DECK' as const,
      label: 'Streamer Deck',
      icon: <Tv className="w-3.5 h-3.5 text-pink-400" />,
      tag: 'OBS & MEDIA',
    },
    {
      id: 'PANORAMIC_HUD' as const,
      label: 'Panoramic HUD',
      icon: <LayoutDashboard className="w-3.5 h-3.5 text-amber-400" />,
      tag: 'ALL-IN-ONE',
    },
  ];

  return (
    <div id="view-dashboard" className="space-y-4 max-w-7xl mx-auto font-mono select-none">
      {/* Stonic AI Top Navigation Bar (Inspired by stonicai.com JARVIS) */}
      <div
        className="flex flex-wrap items-center justify-between gap-2.5 p-2 rounded-xl border backdrop-blur-md"
        style={{
          backgroundColor: `${currentTheme.panelBg}f0`,
          borderColor: currentTheme.panelBorder,
        }}
      >
        {/* Brand identity badge */}
        <div className="flex items-center gap-2 pl-2">
          <span className="flex items-center gap-1.5 text-xs font-bold text-white tracking-widest uppercase">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>STONIC J.A.R.V.I.S. LAB</span>
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-[10px] text-cyan-300 font-semibold">
            {activePersona} ACTIVE
          </span>
        </div>

        {/* Dashboard Sub-mode pills */}
        <div className="flex flex-wrap items-center gap-1 bg-slate-950/80 p-1 rounded-lg border border-slate-800/80">
          {modes.map((mode) => {
            const isActive = dashboardMode === mode.id;
            return (
              <button
                key={mode.id}
                id={`btn-stonic-tab-${mode.id.toLowerCase()}`}
                onClick={() => {
                  sounds.playClick();
                  setDashboardMode(mode.id);
                }}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                {mode.icon}
                <span>{mode.label}</span>
                <span className="hidden xl:inline text-[9px] px-1 rounded bg-black/40 text-slate-400">
                  {mode.tag}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* VIEW MODE: COMMAND CORE (Arc Reactor + Telemetry + Quick Actions + Traces) */}
      {dashboardMode === 'COMMAND_CORE' && (
        <div className="space-y-4">
          {/* Iron Man Mark-85 Arc Reactor Holographic Core */}
          <ArcReactorCore
            state={robinState}
            statusText={statusText}
            transcriptText={transcriptText}
            isListening={isListening}
            onToggleListening={onToggleListening}
            currentTheme={currentTheme}
            activeCommandSummary={recentCommands[0]?.voiceResponse}
            onOpenCommandCenter={onOpenCommandCenter}
            language={language}
            onLanguageChange={onLanguageChange}
            onExecuteSample={onExecuteCommand}
            activePersona={activePersona}
          />

          {/* Quick Hardware Telemetry Grid */}
          <LiveTelemetryGrid
            telemetry={telemetry}
            currentTheme={currentTheme}
            onSelectProcess={(proc) => onExecuteCommand(`Check status of ${proc}`)}
          />

          {/* Quick Actions Bar */}
          <QuickActionsBar
            currentTheme={currentTheme}
            onExecuteCommand={onExecuteCommand}
            onEmergencyStop={onEmergencyStop}
            onOpenCommandCenter={onOpenCommandCenter}
            onToggleVoice={onToggleListening}
          />

          {/* Recent Execution Traces */}
          <div
            id="recent-executions-container"
            className="p-4 rounded-xl border transition-all"
            style={{
              backgroundColor: currentTheme.panelBg,
              borderColor: currentTheme.panelBorder,
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-sky-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                  RECENT EXECUTION TRACES
                </h3>
              </div>
              <span className="text-[11px] text-slate-400">
                Automated Intent & Tool Classification Pipeline
              </span>
            </div>

            {recentCommands.length === 0 ? (
              <div className="text-center py-6 text-slate-500 text-xs">
                No executions registered yet. Try asking: &quot;Open Chrome&quot;, &quot;What&apos;s my CPU usage?&quot;, or &quot;Create folder Projects&quot;.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {recentCommands.slice(0, 6).map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-lg border border-slate-800/90 bg-slate-900/50 hover:border-slate-700 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1.5">
                        <span className="px-1.5 py-0.5 rounded bg-slate-800 text-sky-300 font-bold">
                          {item.intent}
                        </span>
                        <span>{item.timestamp}</span>
                      </div>

                      <div className="text-xs font-bold text-white mb-1 group-hover:text-sky-300 transition-colors flex items-center gap-1.5">
                        <span className="truncate">&ldquo;{item.command}&rdquo;</span>
                      </div>

                      <div className="text-[11px] text-slate-400 mb-2">
                        <span className="text-slate-500">Tool:</span> {item.tool} •{' '}
                        <span className="text-slate-500">Agent:</span> {item.agent}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                      <div className="flex items-center gap-1">
                        {item.status === 'SUCCESS' ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                        )}
                        <span
                          className={
                            item.status === 'SUCCESS' ? 'text-emerald-400 font-bold' : 'text-amber-400'
                          }
                        >
                          {item.status} ({item.durationSec}s)
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          sounds.playClick();
                          onExecuteCommand(item.command);
                        }}
                        className="flex items-center gap-1 text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700 transition-colors"
                        title="Re-run command"
                      >
                        <span>Re-run</span>
                        <Play className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW MODE: WORLD MONITOR */}
      {dashboardMode === 'WORLD_MONITOR' && (
        <WorldMonitor
          currentTheme={currentTheme}
          onExecuteCommand={onExecuteCommand}
        />
      )}

      {/* VIEW MODE: AGENT TOWN */}
      {dashboardMode === 'AGENT_TOWN' && (
        <AgentTown
          currentTheme={currentTheme}
          onExecuteCommand={onExecuteCommand}
        />
      )}

      {/* VIEW MODE: THE FOUR CIRCUITS */}
      {dashboardMode === 'FOUR_CIRCUITS' && (
        <FourCircuitsPanel
          currentTheme={currentTheme}
          activePersona={activePersona}
          onSelectPersona={(persona) => {
            setActivePersona(persona);
          }}
          onExecuteCommand={onExecuteCommand}
          isVoiceActive={isListening}
          onToggleVoice={onToggleListening}
        />
      )}

      {/* VIEW MODE: STREAMER DECK */}
      {dashboardMode === 'STREAMER_DECK' && (
        <StreamerDeck
          currentTheme={currentTheme}
          onExecuteCommand={onExecuteCommand}
        />
      )}

      {/* VIEW MODE: PANORAMIC HUD (Side-by-side Stonic Command Deck) */}
      {dashboardMode === 'PANORAMIC_HUD' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            <div className="lg:col-span-6">
              <ArcReactorCore
                state={robinState}
                statusText={statusText}
                transcriptText={transcriptText}
                isListening={isListening}
                onToggleListening={onToggleListening}
                currentTheme={currentTheme}
                activeCommandSummary={recentCommands[0]?.voiceResponse}
                onOpenCommandCenter={onOpenCommandCenter}
                language={language}
                onLanguageChange={onLanguageChange}
                onExecuteSample={onExecuteCommand}
                activePersona={activePersona}
              />
            </div>
            <div className="lg:col-span-6">
              <WorldMonitor
                currentTheme={currentTheme}
                onExecuteCommand={onExecuteCommand}
              />
            </div>
          </div>

          <AgentTown
            currentTheme={currentTheme}
            onExecuteCommand={onExecuteCommand}
          />
        </div>
      )}
    </div>
  );
};
