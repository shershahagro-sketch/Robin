import React, { useState } from 'react';
import { Bot, Sparkles, Send, Coffee, Zap, MessageSquare, ShieldCheck, Terminal, Brain, Palette, CheckCircle2, Play, Users } from 'lucide-react';
import { ThemeConfig, AgentDefinition } from '../../types';
import { sounds } from '../../services/soundEffects';

interface AgentTownProps {
  currentTheme: ThemeConfig;
  onExecuteCommand?: (cmd: string) => void;
  dynamicallyInjectedAgents?: AgentDefinition[];
}

interface TownAgent {
  id: string;
  name: string;
  role: string;
  specialty: string;
  avatarIcon: string;
  color: string;
  status: 'WORKING' | 'THINKING' | 'IDLE' | 'TESTING' | 'COFFEE';
  currentTask: string;
  speechBubble: string;
  deskType: 'RESEARCH_LAB' | 'DEVOPS_RACK' | 'STUDIO_CANVAS' | 'SECURITY_BUNKER';
  completedTasks: number;
}

const DEFAULT_TOWN_AGENTS: TownAgent[] = [
  {
    id: 'alice',
    name: 'Alice',
    role: 'Lead Intelligence & Synthesis',
    specialty: 'Knowledge Graphs & Multi-Model Research',
    avatarIcon: '👩‍💻',
    color: '#00F0FF',
    status: 'WORKING',
    currentTask: 'Synthesizing Windows memory dump & indexing project semantic embeddings',
    speechBubble: 'Cross-referencing docs with Gemini LLM...',
    deskType: 'RESEARCH_LAB',
    completedTasks: 142,
  },
  {
    id: 'bob',
    name: 'Bob',
    role: 'DevOps & Kernel Architect',
    specialty: 'Container Orchestration, CLI & System Scripts',
    avatarIcon: '👨‍💻',
    color: '#F59E0B',
    status: 'TESTING',
    currentTask: 'Compiling Docker edge containers and testing Windows socket performance',
    speechBubble: 'All test benchmarks compiling green!',
    deskType: 'DEVOPS_RACK',
    completedTasks: 218,
  },
  {
    id: 'carol',
    name: 'Carol',
    role: 'Creative & Workflow Dispatcher',
    specialty: 'Task Automation, UI Flows & User Communications',
    avatarIcon: '👩‍🎨',
    color: '#EC4899',
    status: 'IDLE',
    currentTask: 'Awaiting directive to assemble automated multi-step productivity sequence',
    speechBubble: 'Ready for new creative workflow layout.',
    deskType: 'STUDIO_CANVAS',
    completedTasks: 97,
  },
  {
    id: 'dave',
    name: 'Dave',
    role: 'Cybersecurity & Red Team Sentinel',
    specialty: 'Zero-Trust Intrusion Detection & Sandbox Isolation',
    avatarIcon: '🛡️',
    color: '#10B981',
    status: 'WORKING',
    currentTask: 'Continuous port sweep and memory bounds integrity audit across PC processes',
    speechBubble: 'Perimeter secure. 0 unauthorized anomalies.',
    deskType: 'SECURITY_BUNKER',
    completedTasks: 305,
  },
];

export const AgentTown: React.FC<AgentTownProps> = ({
  currentTheme,
  onExecuteCommand,
  dynamicallyInjectedAgents = [],
}) => {
  const [agents, setAgents] = useState<TownAgent[]>(DEFAULT_TOWN_AGENTS);
  const [selectedAgent, setSelectedAgent] = useState<TownAgent>(DEFAULT_TOWN_AGENTS[0]);
  const [taskInput, setTaskInput] = useState('');
  const [officeMode, setOfficeMode] = useState<'NORMAL' | 'CRUNCH' | 'COFFEE'>('NORMAL');

  // Handle task assignment to chosen agent
  const handleAssignTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskInput.trim()) return;

    sounds.playSuccessTone();
    const newTask = taskInput;
    setAgents((prev) =>
      prev.map((a) =>
        a.id === selectedAgent.id
          ? {
              ...a,
              status: 'WORKING',
              currentTask: newTask,
              speechBubble: `Executing: "${newTask.slice(0, 36)}..."`,
              completedTasks: a.completedTasks + 1,
            }
          : a
      )
    );

    setSelectedAgent((prev) => ({
      ...prev,
      status: 'WORKING',
      currentTask: newTask,
      speechBubble: `Executing: "${newTask.slice(0, 36)}..."`,
      completedTasks: prev.completedTasks + 1,
    }));

    onExecuteCommand?.(`[Agent ${selectedAgent.name}] ${newTask}`);
    setTaskInput('');
  };

  // Trigger Office-Wide Event
  const triggerOfficeEvent = (mode: 'CRUNCH' | 'COFFEE' | 'STANDUP') => {
    sounds.playWakeChime();
    if (mode === 'COFFEE') {
      setOfficeMode('COFFEE');
      setAgents((prev) =>
        prev.map((a) => ({
          ...a,
          status: 'COFFEE',
          speechBubble: 'Taking a 5-minute espresso break ☕',
        }))
      );
    } else if (mode === 'CRUNCH') {
      setOfficeMode('CRUNCH');
      setAgents((prev) =>
        prev.map((a) => ({
          ...a,
          status: 'WORKING',
          speechBubble: 'TURBO CRUNCH: Parallel batch executions enabled! ⚡',
        }))
      );
    } else {
      setOfficeMode('NORMAL');
      setAgents((prev) =>
        prev.map((a) => ({
          ...a,
          status: 'THINKING',
          speechBubble: 'Syncing roadmap priorities at team standup.',
        }))
      );
    }
  };

  return (
    <div
      id="stonic-agent-town"
      className="p-4 md:p-6 rounded-2xl border transition-all duration-300 font-mono space-y-4 select-none"
      style={{
        backgroundColor: currentTheme.panelBg,
        borderColor: currentTheme.panelBorder,
        boxShadow: `0 8px 32px rgba(16,185,129,0.12)`,
      }}
    >
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-950/80 text-emerald-400 border border-emerald-500/40">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-wider">
                AGENT TOWN — SPATIAL MULTI-AGENT HUB
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40">
                ACTIVE OFFICE
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Interactive pixel office: Alice, Bob, Carol, and Dave collaborating on live Windows PC tasks
            </p>
          </div>
        </div>

        {/* Office Mood / Team Action Triggers */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => triggerOfficeEvent('STANDUP')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs border border-slate-800 transition-colors"
            title="Coordinate team standup"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Standup</span>
          </button>
          <button
            onClick={() => triggerOfficeEvent('CRUNCH')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all ${
              officeMode === 'CRUNCH'
                ? 'bg-amber-500/25 text-amber-300 border-amber-500/50 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
            }`}
            title="Accelerate all sub-agents"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Turbo Crunch</span>
          </button>
          <button
            onClick={() => triggerOfficeEvent('COFFEE')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs border transition-all ${
              officeMode === 'COFFEE'
                ? 'bg-orange-500/25 text-orange-300 border-orange-500/50'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
            }`}
            title="Coffee break"
          >
            <Coffee className="w-3.5 h-3.5 text-orange-400" />
            <span>Coffee Break</span>
          </button>
        </div>
      </div>

      {/* Main Agent Town Office Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {agents.map((agent) => {
          const isSelected = selectedAgent.id === agent.id;
          const statusBg =
            agent.status === 'WORKING'
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              : agent.status === 'TESTING'
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              : agent.status === 'COFFEE'
              ? 'bg-orange-500/20 text-orange-300 border-orange-500/40'
              : 'bg-slate-800 text-slate-400 border-slate-700';

          return (
            <div
              key={agent.id}
              onClick={() => {
                sounds.playClick();
                setSelectedAgent(agent);
              }}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden group ${
                isSelected
                  ? 'border-cyan-400 bg-slate-900/90 shadow-[0_0_16px_rgba(6,182,212,0.25)] ring-1 ring-cyan-400/40'
                  : 'border-slate-800/90 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-900/50'
              }`}
            >
              {/* Isometric Desk Background Graphic Accent */}
              <div
                className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-15 pointer-events-none"
                style={{ backgroundColor: agent.color }}
              />

              {/* Speech Bubble Above Desk */}
              <div className="mb-3 relative">
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-700/80 text-[10px] text-slate-200 shadow-md relative leading-tight min-h-[38px] flex items-center">
                  <span className="italic truncate">&ldquo;{agent.speechBubble}&rdquo;</span>
                  {/* speech bubble triangle pointer */}
                  <div className="absolute -bottom-1.5 left-4 w-2.5 h-2.5 bg-slate-900 border-b border-r border-slate-700/80 transform rotate-45" />
                </div>
              </div>

              {/* Desk & Pixel Character Station */}
              <div className="flex items-center gap-3 my-2">
                {/* Character Avatar Box */}
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl border transition-transform group-hover:scale-105 shrink-0 shadow-inner"
                  style={{
                    backgroundColor: `${agent.color}15`,
                    borderColor: `${agent.color}50`,
                  }}
                >
                  <span className="drop-shadow-md">{agent.avatarIcon}</span>
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold text-white truncate">{agent.name}</h4>
                    <span className={`text-[9px] px-1 py-0.2 rounded font-bold border ${statusBg}`}>
                      {agent.status}
                    </span>
                  </div>
                  <p className="text-[10px] text-cyan-300 font-semibold truncate">{agent.role}</p>
                  <p className="text-[9px] text-slate-400 truncate">{agent.specialty}</p>
                </div>
              </div>

              {/* Current Task Box */}
              <div className="p-2 rounded bg-black/40 border border-slate-800 text-[10px] text-slate-300 my-2 leading-tight">
                <span className="text-[9px] text-slate-500 uppercase block font-bold mb-0.5">CURRENT TASK:</span>
                <p className="line-clamp-2">{agent.currentTask}</p>
              </div>

              {/* Station Footer */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                <span className="font-mono">{agent.completedTasks} completed</span>
                <span className="text-cyan-400 group-hover:underline flex items-center gap-0.5 font-bold">
                  <span>Assign</span>
                  <Play className="w-2.5 h-2.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Task Assignment Console for Selected Agent */}
      <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/70 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">{selectedAgent.avatarIcon}</span>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-white tracking-wider">
                  TASK DISPATCHER: {selectedAgent.name.toUpperCase()}
                </h4>
                <span className="text-[10px] text-cyan-400 font-bold">({selectedAgent.role})</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Directly instruct {selectedAgent.name} to execute autonomous Windows workflows
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Specialty: <strong className="text-slate-200">{selectedAgent.specialty}</strong></span>
          </div>
        </div>

        {/* Task Input Form */}
        <form onSubmit={handleAssignTask} className="flex gap-2">
          <input
            type="text"
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            placeholder={`Instruct ${selectedAgent.name} (e.g. "Run security scan", "Index source files", "Compile Docker script")...`}
            className="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
          />
          <button
            type="submit"
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-[0_0_12px_rgba(16,185,129,0.3)] shrink-0 active:scale-95"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Dispatch</span>
          </button>
        </form>

        {/* Quick Suggestion Chips for Selected Agent */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px]">
          <span className="text-[10px] text-slate-500 font-bold">Recommended for {selectedAgent.name}:</span>
          {selectedAgent.id === 'alice' &&
            ['Summarize current workspace', 'Build project semantic index', 'Search latest news on AI'].map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => setTaskInput(prompt)}
                className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-[10px] text-slate-300 hover:text-cyan-300 border border-slate-800"
              >
                {prompt}
              </button>
            ))}
          {selectedAgent.id === 'bob' &&
            ['Check docker container health', 'Clean npm build cache', 'Run benchmark stress test'].map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => setTaskInput(prompt)}
                className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-[10px] text-slate-300 hover:text-cyan-300 border border-slate-800"
              >
                {prompt}
              </button>
            ))}
          {selectedAgent.id === 'carol' &&
            ['Create desktop automation shortcut', 'Generate daily standup digest', 'Organize files in Downloads'].map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => setTaskInput(prompt)}
                className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-[10px] text-slate-300 hover:text-cyan-300 border border-slate-800"
              >
                {prompt}
              </button>
            ))}
          {selectedAgent.id === 'dave' &&
            ['Scan open TCP ports', 'Audit Windows registry keys', 'Verify file checksums'].map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => setTaskInput(prompt)}
                className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-[10px] text-slate-300 hover:text-cyan-300 border border-slate-800"
              >
                {prompt}
              </button>
            ))}
        </div>
      </div>
    </div>
  );
};
