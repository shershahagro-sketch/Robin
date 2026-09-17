import React, { useState } from 'react';
import { Brain, Zap, Flame, Settings2, Sliders, Volume2, ShieldCheck, Check, Sparkles, Plus, Trash2, Mic, Eye, RefreshCw, Key } from 'lucide-react';
import { ThemeConfig } from '../../types';
import { sounds } from '../../services/soundEffects';

interface FourCircuitsPanelProps {
  currentTheme: ThemeConfig;
  activePersona: string;
  onSelectPersona: (persona: string) => void;
  onExecuteCommand?: (cmd: string) => void;
  isVoiceActive: boolean;
  onToggleVoice: () => void;
}

interface MemoryEntry {
  id: string;
  category: 'PREFERENCE' | 'PROJECT' | 'CREDENTIAL' | 'HABIT';
  key: string;
  value: string;
  confidence: number;
}

const INITIAL_MEMORIES: MemoryEntry[] = [
  {
    id: 'm1',
    category: 'PREFERENCE',
    key: 'Preferred Terminal',
    value: 'Windows Terminal with PowerShell Core (pwsh)',
    confidence: 0.98,
  },
  {
    id: 'm2',
    category: 'PROJECT',
    key: 'Current Repository',
    value: 'ROBIN JARVIS Command Center with Gemini 2.5 Multi-Agent Kernel',
    confidence: 1.0,
  },
  {
    id: 'm3',
    category: 'HABIT',
    key: 'Daily Standup Time',
    value: '09:30 AM PST with automated sprint report generation',
    confidence: 0.94,
  },
  {
    id: 'm4',
    category: 'PREFERENCE',
    key: 'Voice Synthesis Cadence',
    value: 'British English (en-GB) refined formal with 1.05x tempo',
    confidence: 0.95,
  },
];

const SKILL_ITEMS = [
  {
    id: 'app_launch',
    name: 'Windows App Launcher',
    desc: 'Instant startup of Chrome, VS Code, Discord, Spotify, Slack by name',
    status: 'ARMED',
    executions: 412,
  },
  {
    id: 'file_ops',
    name: 'File & Folder Automation',
    desc: 'Recursive search, creation, move, compression, and directory cleanup',
    status: 'ARMED',
    executions: 289,
  },
  {
    id: 'shell_exec',
    name: 'Sandboxed PowerShell CLI',
    desc: 'Execute terminal scripts with safe-mode output sanitization',
    status: 'ARMED',
    executions: 630,
  },
  {
    id: 'media_mixer',
    name: 'Audio & Media Deck',
    desc: 'System volume adjustment, mute toggle, playback control',
    status: 'ARMED',
    executions: 185,
  },
  {
    id: 'web_crawl',
    name: 'Autonomous Web Research',
    desc: 'Live scraping, knowledge extraction, and headline summarization',
    status: 'ARMED',
    executions: 154,
  },
  {
    id: 'sys_diagnose',
    name: 'Hardware Telemetry Monitor',
    desc: 'Real-time CPU, GPU, RAM, thermals, and process thread auditing',
    status: 'ARMED',
    executions: 940,
  },
];

export const FourCircuitsPanel: React.FC<FourCircuitsPanelProps> = ({
  currentTheme,
  activePersona,
  onSelectPersona,
  onExecuteCommand,
  isVoiceActive,
  onToggleVoice,
}) => {
  const [activeCircuit, setActiveCircuit] = useState<'MEMORY' | 'SKILLS' | 'SOUL' | 'SETTINGS'>('SOUL');

  // Soul settings
  const [humorLevel, setHumorLevel] = useState<number>(65);
  const [speechRate, setSpeechRate] = useState<number>(1.05);
  const [formalityLevel, setFormalityLevel] = useState<number>(85);
  const [wakeWord, setWakeWord] = useState<string>('Hey Jarvis');

  // Memory circuit state
  const [memories, setMemories] = useState<MemoryEntry[]>(INITIAL_MEMORIES);
  const [newMemKey, setNewMemKey] = useState('');
  const [newMemVal, setNewMemVal] = useState('');

  // Settings circuit state
  const [soundEffectsEnabled, setSoundEffectsEnabled] = useState(true);
  const [hologramGlowLevel, setHologramGlowLevel] = useState(80);
  const [autoFallbackOffline, setAutoFallbackOffline] = useState(true);

  const handleAddMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemKey.trim() || !newMemVal.trim()) return;
    sounds.playSuccessTone();
    const entry: MemoryEntry = {
      id: `m_${Date.now()}`,
      category: 'PREFERENCE',
      key: newMemKey.trim(),
      value: newMemVal.trim(),
      confidence: 1.0,
    };
    setMemories([entry, ...memories]);
    setNewMemKey('');
    setNewMemVal('');
  };

  const handleDeleteMemory = (id: string) => {
    sounds.playClick();
    setMemories(memories.filter((m) => m.id !== id));
  };

  return (
    <div
      id="stonic-four-circuits"
      className="p-4 md:p-6 rounded-2xl border transition-all duration-300 font-mono space-y-4 select-none"
      style={{
        backgroundColor: currentTheme.panelBg,
        borderColor: currentTheme.panelBorder,
        boxShadow: `0 8px 32px rgba(192,132,252,0.12)`,
      }}
    >
      {/* Circuit Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-white tracking-wider">
              THE FOUR CIRCUITS OF J.A.R.V.I.S.
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold border border-purple-500/40">
              CORE ARCHITECTURE
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Control the 4 biological & neural circuits governing your PC AI companion
          </p>
        </div>

        {/* The 4 Circuit Selector Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => {
              sounds.playClick();
              setActiveCircuit('MEMORY');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeCircuit === 'MEMORY'
                ? 'bg-cyan-600 text-white shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Brain className="w-3.5 h-3.5 text-cyan-300" />
            <span>1. Memory</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setActiveCircuit('SKILLS');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeCircuit === 'SKILLS'
                ? 'bg-amber-600 text-white shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span>2. Skills</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setActiveCircuit('SOUL');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeCircuit === 'SOUL'
                ? 'bg-purple-600 text-white shadow-[0_0_12px_rgba(192,132,252,0.4)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-purple-300" />
            <span>3. Soul</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setActiveCircuit('SETTINGS');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeCircuit === 'SETTINGS'
                ? 'bg-emerald-600 text-white shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Settings2 className="w-3.5 h-3.5 text-emerald-300" />
            <span>4. Settings</span>
          </button>
        </div>
      </div>

      {/* CIRCUIT 1: MEMORY */}
      {activeCircuit === 'MEMORY' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xs text-slate-300">
              <strong className="text-cyan-400 font-bold">Contextual Memory Bank:</strong> Stores user facts, coding styles, project history, and persistent memories across sessions.
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60">
              {memories.length} Active Slots
            </span>
          </div>

          {/* Add New Memory Slot */}
          <form onSubmit={handleAddMemory} className="flex flex-wrap gap-2 p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <input
              type="text"
              value={newMemKey}
              onChange={(e) => setNewMemKey(e.target.value)}
              placeholder="Memory Key (e.g., Default Project Directory)..."
              className="flex-1 min-w-[200px] px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
            <input
              type="text"
              value={newMemVal}
              onChange={(e) => setNewMemVal(e.target.value)}
              placeholder="Value (e.g., C:\Workspace\AI)..."
              className="flex-1 min-w-[200px] px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
            <button
              type="submit"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow-[0_0_10px_rgba(6,182,212,0.3)] shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Remember</span>
            </button>
          </form>

          {/* Memory Slots Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {memories.map((mem) => (
              <div
                key={mem.id}
                className="p-3 rounded-xl border border-slate-800 bg-slate-950/40 hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] mb-1">
                    <span className="px-1.5 py-0.2 rounded bg-slate-900 text-cyan-300 font-bold border border-slate-800">
                      {mem.category}
                    </span>
                    <button
                      onClick={() => handleDeleteMemory(mem.id)}
                      className="text-slate-500 hover:text-rose-400 p-0.5 transition-colors"
                      title="Delete memory"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                  <h4 className="text-xs font-bold text-white mb-0.5">{mem.key}</h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed">{mem.value}</p>
                </div>

                <div className="pt-2 mt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
                  <span>Confidence: {(mem.confidence * 100).toFixed(0)}%</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    <span>Indexed</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CIRCUIT 2: SKILLS */}
      {activeCircuit === 'SKILLS' && (
        <div className="space-y-4">
          <div className="text-xs text-slate-300">
            <strong className="text-amber-400 font-bold">Autonomous PC Skills:</strong> Modular tool executions that allow the AI to directly operate your Windows OS and applications.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {SKILL_ITEMS.map((skill) => (
              <div
                key={skill.id}
                className="p-3 rounded-xl border border-slate-800 bg-slate-950/50 hover:border-amber-500/50 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                    <span className="text-amber-400 font-bold flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      <span>{skill.status}</span>
                    </span>
                    <span>{skill.executions} runs</span>
                  </div>
                  <h4 className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors mb-1">
                    {skill.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{skill.desc}</p>
                </div>

                <div className="pt-2 mt-2 border-t border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => {
                      sounds.playClick();
                      onExecuteCommand?.(`Test skill: ${skill.name}`);
                    }}
                    className="w-full py-1 text-[11px] font-bold rounded bg-slate-900 hover:bg-amber-950 text-slate-300 hover:text-amber-300 border border-slate-800 hover:border-amber-500/40 transition-colors flex items-center justify-center gap-1"
                  >
                    <span>Test Skill Loadout</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CIRCUIT 3: SOUL */}
      {activeCircuit === 'SOUL' && (
        <div className="space-y-5">
          <div className="text-xs text-slate-300">
            <strong className="text-purple-400 font-bold">Soul & Persona Engine:</strong> Configure the temperament, voice persona, humor, and speech cadence of your AI companion.
          </div>

          {/* Persona Card Selector */}
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Select AI Persona Archetype:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                {
                  name: 'J.A.R.V.I.S.',
                  desc: 'Classic Stark AI. British, witty, polite, sophisticated.',
                  color: '#00F0FF',
                  voice: 'British Formal (Male)',
                },
                {
                  name: 'F.R.I.D.A.Y.',
                  desc: 'Irish tactical assistant. Crisp, decisive, battle-ready.',
                  color: '#10B981',
                  voice: 'Irish Tactical (Female)',
                },
                {
                  name: 'E.D.I.T.H.',
                  desc: 'Tactical security glasses interface. Direct, strategic, precise.',
                  color: '#C084FC',
                  voice: 'Clean American (Female)',
                },
                {
                  name: 'Vision',
                  desc: 'Synthetic philosophical intelligence. Calm, profound, protective.',
                  color: '#F59E0B',
                  voice: 'Resonant Baritone',
                },
              ].map((p) => {
                const isSelected = activePersona === p.name;
                return (
                  <button
                    key={p.name}
                    onClick={() => {
                      sounds.playWakeChime();
                      onSelectPersona(p.name);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-purple-400 bg-purple-950/40 shadow-[0_0_16px_rgba(192,132,252,0.3)] ring-1 ring-purple-400/50'
                        : 'border-slate-800 bg-slate-950/50 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-white">{p.name}</span>
                        {isSelected && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 font-bold border border-purple-500/40">
                            ACTIVE SOUL
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-300 leading-relaxed mb-2">{p.desc}</p>
                    </div>
                    <div className="text-[9px] text-slate-500 pt-1 border-t border-slate-800/80">
                      Voice: <strong className="text-slate-300">{p.voice}</strong>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sliders for Temperament */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            {/* Humor Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Humor & Irony:</span>
                <span className="text-purple-300 font-bold">{humorLevel}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={humorLevel}
                onChange={(e) => setHumorLevel(Number(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer"
              />
              <span className="text-[10px] text-slate-500 block">
                Higher values introduce witty commentary and playful banters.
              </span>
            </div>

            {/* Speech Rate Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Speech Cadence Speed:</span>
                <span className="text-cyan-300 font-bold">{speechRate}x</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="1.5"
                step="0.05"
                value={speechRate}
                onChange={(e) => setSpeechRate(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
              <span className="text-[10px] text-slate-500 block">
                Adjust verbal response rate through the neural TTS synthesizer.
              </span>
            </div>

            {/* Wake Word Selector */}
            <div className="space-y-1.5">
              <span className="text-xs text-slate-400 block">Wake-Word Hotword:</span>
              <select
                value={wakeWord}
                onChange={(e) => {
                  sounds.playClick();
                  setWakeWord(e.target.value);
                }}
                className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-purple-400"
              >
                <option value="Hey Jarvis">"Hey Jarvis"</option>
                <option value="Jarvis">"Jarvis"</option>
                <option value="Robin">"Robin"</option>
                <option value="Friday">"Friday"</option>
              </select>
              <span className="text-[10px] text-slate-500 block">
                Continuous acoustic listener triggers upon hearing this phrase.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* CIRCUIT 4: SETTINGS */}
      {activeCircuit === 'SETTINGS' && (
        <div className="space-y-4">
          <div className="text-xs text-slate-300">
            <strong className="text-emerald-400 font-bold">System HUD Settings:</strong> Visual overlays, audio feedback chimes, security thresholds, and offline operation limits.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Audio Sound FX Toggle */}
            <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white mb-0.5">Sci-Fi Acoustic Sound FX</h4>
                <p className="text-[11px] text-slate-400">
                  Play holographic chimes, beeps, and wake sounds on command actions
                </p>
              </div>
              <button
                onClick={() => {
                  sounds.playClick();
                  setSoundEffectsEnabled(!soundEffectsEnabled);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  soundEffectsEnabled
                    ? 'bg-emerald-600 text-white shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                    : 'bg-slate-800 text-slate-500'
                }`}
              >
                {soundEffectsEnabled ? 'ENABLED' : 'MUTED'}
              </button>
            </div>

            {/* Offline Fallback */}
            <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white mb-0.5">Autonomous Offline Fallback</h4>
                <p className="text-[11px] text-slate-400">
                  Allow local PC automations when internet connection is lost
                </p>
              </div>
              <button
                onClick={() => {
                  sounds.playClick();
                  setAutoFallbackOffline(!autoFallbackOffline);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  autoFallbackOffline
                    ? 'bg-emerald-600 text-white shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                    : 'bg-slate-800 text-slate-500'
                }`}
              >
                {autoFallbackOffline ? 'ACTIVE' : 'DISABLED'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
