import React, { useState } from 'react';
import { Clock, Brain, Search, Trash2, Download, Star, Play, CheckCircle2, AlertCircle, Plus } from 'lucide-react';
import { CommandItem, MemoryItem, ThemeConfig } from '../../types';
import { sounds } from '../../services/soundEffects';

interface HistoryMemoryViewProps {
  commandHistory: CommandItem[];
  memories: MemoryItem[];
  currentTheme: ThemeConfig;
  onExecuteCommand: (cmd: string) => void;
  onToggleFavorite: (id: string) => void;
  onClearHistory: () => void;
  onSaveMemory: (key: string, val: string, category: MemoryItem['category']) => void;
  onDeleteMemory: (id: string) => void;
  onClearAllMemories: () => void;
}

export const HistoryMemoryView: React.FC<HistoryMemoryViewProps> = ({
  commandHistory,
  memories,
  currentTheme,
  onExecuteCommand,
  onToggleFavorite,
  onClearHistory,
  onSaveMemory,
  onDeleteMemory,
  onClearAllMemories,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'history' | 'memory'>('history');
  const [searchHistory, setSearchHistory] = useState('');
  const [searchMemory, setSearchMemory] = useState('');
  const [showAddMemory, setShowAddMemory] = useState(false);
  const [memKey, setMemKey] = useState('');
  const [memVal, setMemVal] = useState('');
  const [memCat, setMemCat] = useState<MemoryItem['category']>('User preferences');

  const filteredHistory = commandHistory.filter((c) => {
    if (!searchHistory.trim()) return true;
    const q = searchHistory.toLowerCase();
    return (
      c.command.toLowerCase().includes(q) ||
      c.intent.toLowerCase().includes(q) ||
      c.tool.toLowerCase().includes(q)
    );
  });

  const filteredMemories = memories.filter((m) => {
    if (!searchMemory.trim()) return true;
    const q = searchMemory.toLowerCase();
    return (
      m.key.toLowerCase().includes(q) ||
      m.value.toLowerCase().includes(q) ||
      m.category.toLowerCase().includes(q)
    );
  });

  const handleAddMemorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memKey.trim() || !memVal.trim()) return;
    sounds.playSuccessTone();
    onSaveMemory(memKey.trim(), memVal.trim(), memCat);
    setMemKey('');
    setMemVal('');
    setShowAddMemory(false);
  };

  const exportMemoryJson = () => {
    sounds.playClick();
    const blob = new Blob([JSON.stringify(memories, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `robin_memory_vault_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div id="view-history-memory" className="space-y-4 max-w-7xl mx-auto font-mono text-slate-200">
      {/* Sub-tabs header */}
      <div
        className="p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        style={{
          backgroundColor: currentTheme.panelBg,
          borderColor: currentTheme.panelBorder,
        }}
      >
        <div className="flex items-center gap-2">
          {activeSubTab === 'history' ? (
            <Clock className="w-5 h-5 text-sky-400" />
          ) : (
            <Brain className="w-5 h-5 text-purple-400" />
          )}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              {activeSubTab === 'history'
                ? 'COMMAND HISTORY & TRACE AUDIT'
                : 'LOCAL PERSISTENT CONTEXT & MEMORY STORE'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {activeSubTab === 'history'
                ? 'Full execution history with intent classification, tool metadata, and performance benchmarks.'
                : 'ROBIN stores habits, preferred paths, and custom workstation preferences locally.'}
            </p>
          </div>
        </div>

        {/* Tab switch buttons */}
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg bg-black/40 p-1 border border-slate-800">
            <button
              onClick={() => setActiveSubTab('history')}
              className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                activeSubTab === 'history' ? 'bg-sky-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Command History
            </button>
            <button
              onClick={() => setActiveSubTab('memory')}
              className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                activeSubTab === 'memory' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Memory Vault
            </button>
          </div>
        </div>
      </div>

      {activeSubTab === 'history' ? (
        /* History View */
        <div
          className="p-4 rounded-xl border space-y-4"
          style={{
            backgroundColor: currentTheme.panelBg,
            borderColor: currentTheme.panelBorder,
          }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchHistory}
                onChange={(e) => setSearchHistory(e.target.value)}
                placeholder="Search history by command or intent..."
                className="w-full bg-slate-900/90 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white outline-none focus:border-sky-400"
              />
            </div>

            <button
              onClick={() => {
                sounds.playClick();
                onClearHistory();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 hover:border-rose-800 text-xs text-slate-400 hover:text-rose-300 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          </div>

          <div className="divide-y divide-slate-800/80">
            {filteredHistory.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">
                No past executions match your search filter.
              </div>
            ) : (
              filteredHistory.map((item) => (
                <div
                  key={item.id}
                  className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-800/20 px-2 rounded-lg transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => {
                        sounds.playClick();
                        onToggleFavorite(item.id);
                      }}
                      className={`mt-0.5 ${item.favorite ? 'text-amber-400' : 'text-slate-600 hover:text-slate-400'}`}
                      title={item.favorite ? 'Favorited' : 'Bookmark command'}
                    >
                      <Star className="w-4 h-4" fill={item.favorite ? 'currentColor' : 'none'} />
                    </button>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        <span>&ldquo;{item.command}&rdquo;</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-sky-300">
                          {item.intent}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Tool: <span className="text-slate-300">{item.tool}</span> • Agent:{' '}
                        <span className="text-slate-300">{item.agent}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1">
                      {item.status === 'SUCCESS' ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                      )}
                      <span className={item.status === 'SUCCESS' ? 'text-emerald-400' : 'text-amber-400'}>
                        {item.status} ({item.durationSec}s)
                      </span>
                    </div>

                    <span className="text-slate-500 text-[11px]">{item.timestamp}</span>

                    <button
                      onClick={() => {
                        sounds.playClick();
                        onExecuteCommand(item.command);
                      }}
                      className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all text-xs"
                    >
                      <Play className="w-2.5 h-2.5" />
                      <span>Re-run</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        /* Memory Store View */
        <div
          className="p-4 rounded-xl border space-y-4"
          style={{
            backgroundColor: currentTheme.panelBg,
            borderColor: currentTheme.panelBorder,
          }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchMemory}
                onChange={(e) => setSearchMemory(e.target.value)}
                placeholder="Search persistent preferences..."
                className="w-full bg-slate-900/90 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white outline-none focus:border-purple-400"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={exportMemoryJson}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 hover:border-slate-500 text-xs text-slate-300 hover:text-white transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-purple-400" />
                <span>Export Vault</span>
              </button>

              <button
                onClick={() => setShowAddMemory(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white transition-all shadow"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Teach ROBIN Preference</span>
              </button>
            </div>
          </div>

          {showAddMemory && (
            <form
              onSubmit={handleAddMemorySubmit}
              className="p-4 rounded-xl border border-purple-500/40 bg-slate-900/90 space-y-3 animate-fadeIn"
            >
              <div className="flex items-center justify-between text-xs font-bold text-purple-300 uppercase">
                <span>Add Memory Context</span>
                <button
                  type="button"
                  onClick={() => setShowAddMemory(false)}
                  className="text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <select
                  value={memCat}
                  onChange={(e) => setMemCat(e.target.value as any)}
                  className="bg-black/50 border border-slate-700 rounded px-3 py-1.5 text-xs text-slate-200 outline-none"
                >
                  <option value="User preferences">User preferences</option>
                  <option value="Favorite applications">Favorite applications</option>
                  <option value="Frequently used folders">Frequently used folders</option>
                  <option value="Common commands">Common commands</option>
                  <option value="Voice settings">Voice settings</option>
                  <option value="Work routines">Work routines</option>
                  <option value="Project paths">Project paths</option>
                </select>

                <input
                  type="text"
                  value={memKey}
                  onChange={(e) => setMemKey(e.target.value)}
                  placeholder="Context Key (e.g. Workstation Screen Layout)"
                  className="bg-black/50 border border-slate-700 rounded px-3 py-1.5 text-xs text-white outline-none focus:border-purple-400 font-mono"
                  required
                />

                <input
                  type="text"
                  value={memVal}
                  onChange={(e) => setMemVal(e.target.value)}
                  placeholder="Value / Behavior instruction"
                  className="bg-black/50 border border-slate-700 rounded px-3 py-1.5 text-xs text-white outline-none focus:border-purple-400 font-mono"
                  required
                />
              </div>
              <button
                type="submit"
                className="px-4 py-1.5 rounded bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white transition-all"
              >
                Store in Local Vault
              </button>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredMemories.map((mem) => (
              <div
                key={mem.id}
                className="p-3 rounded-lg border border-slate-800 bg-slate-900/40 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] text-purple-300 font-bold mb-1">
                    <span className="uppercase">{mem.category}</span>
                    <button
                      onClick={() => onDeleteMemory(mem.id)}
                      className="text-slate-500 hover:text-rose-400"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="text-xs font-bold text-white">{mem.key}</div>
                  <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">{mem.value}</p>
                </div>
                <div className="text-[10px] text-slate-500 mt-2 pt-1.5 border-t border-slate-800/80">
                  Updated: {mem.updatedAt}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
