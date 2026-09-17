import React, { useState } from 'react';
import {
  X,
  Trash2,
  Download,
  Search,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Mic,
  Cpu,
  Shield,
  Filter,
} from 'lucide-react';
import { LogEntry, ThemeConfig } from '../types';
import { sounds } from '../services/soundEffects';

interface SidebarActivityLogsProps {
  logs: LogEntry[];
  currentTheme: ThemeConfig;
  onClearLogs: () => void;
  onClose: () => void;
}

export const SidebarActivityLogs: React.FC<SidebarActivityLogsProps> = ({
  logs,
  currentTheme,
  onClearLogs,
  onClose,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredLogs = logs.filter((log) => {
    if (filterCategory !== 'ALL' && log.category !== filterCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        log.title.toLowerCase().includes(q) ||
        log.message.toLowerCase().includes(q) ||
        (log.details && JSON.stringify(log.details).toLowerCase().includes(q))
      );
    }
    return true;
  });

  const getCategoryIcon = (category: LogEntry['category'], level: LogEntry['level']) => {
    switch (category) {
      case 'VOICE':
        return <Mic className="w-3.5 h-3.5 text-cyan-400" />;
      case 'INTENT':
        return <Cpu className="w-3.5 h-3.5 text-purple-400" />;
      case 'TOOL':
        return <Cpu className="w-3.5 h-3.5 text-sky-400" />;
      case 'EXECUTION':
        return <ActivityIcon className="w-3.5 h-3.5 text-emerald-400" />;
      case 'RESULT':
        return <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />;
      case 'SECURITY':
        return <Shield className="w-3.5 h-3.5 text-amber-400" />;
      case 'ERROR':
        return <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />;
      default:
        return <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  const exportLogs = () => {
    sounds.playClick();
    const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `robin_logs_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <aside
      id="robin-activity-sidebar"
      className="w-80 md:w-96 flex flex-col h-full border-l backdrop-blur-lg z-20 transition-all font-mono"
      style={{
        backgroundColor: currentTheme.panelBg,
        borderColor: currentTheme.panelBorder,
      }}
    >
      {/* Header */}
      <div className="p-3 border-b flex items-center justify-between" style={{ borderColor: currentTheme.panelBorder }}>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <h3 className="text-xs font-bold tracking-widest text-white uppercase">LIVE ACTIVITY</h3>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
            {logs.length}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            id="btn-export-logs"
            onClick={exportLogs}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Export Logs (JSON)"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
          <button
            id="btn-clear-logs"
            onClick={() => {
              sounds.playClick();
              onClearLogs();
            }}
            className="p-1 rounded text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
            title="Clear Activity Logs"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            id="btn-close-sidebar"
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Collapse Sidebar"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-2 border-b space-y-2" style={{ borderColor: currentTheme.panelBorder }}>
        {/* Search Input */}
        <div className="relative">
          <Search className="w-3 h-3 text-slate-400 absolute left-2.5 top-2" />
          <input
            id="input-filter-logs"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search logs..."
            className="w-full bg-slate-900/80 border border-slate-700/80 rounded px-7 py-1 text-[11px] text-slate-200 placeholder-slate-500 outline-none focus:border-sky-500"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[10px]">
          {['ALL', 'VOICE', 'INTENT', 'TOOL', 'EXECUTION', 'RESULT', 'SECURITY'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-2 py-0.5 rounded border transition-colors whitespace-nowrap ${
                filterCategory === cat
                  ? 'bg-sky-500/20 text-sky-300 border-sky-400/50 font-bold'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Log Feed */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-2 text-xs">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs font-mono">
            No events logged yet. Speak or issue a command.
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div
              key={log.id}
              className={`p-2 rounded-lg border text-[11px] transition-all ${
                log.level === 'error'
                  ? 'bg-rose-950/20 border-rose-900/60 text-rose-300'
                  : log.level === 'warn'
                  ? 'bg-amber-950/20 border-amber-900/60 text-amber-300'
                  : 'bg-slate-900/60 border-slate-800/80 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                <div className="flex items-center gap-1.5 font-semibold">
                  {getCategoryIcon(log.category, log.level)}
                  <span className="text-white tracking-wider">{log.category}</span>
                </div>
                <span className="text-slate-500">{log.timestamp}</span>
              </div>

              <div className="font-semibold text-slate-200">{log.title}</div>
              <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">{log.message}</p>

              {log.details && (
                <pre className="mt-1 p-1 bg-black/40 rounded text-[10px] text-slate-400 overflow-x-auto">
                  {typeof log.details === 'string' ? log.details : JSON.stringify(log.details, null, 2)}
                </pre>
              )}
            </div>
          ))
        )}
      </div>
    </aside>
  );
};

function ActivityIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}
