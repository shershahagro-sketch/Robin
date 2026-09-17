import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { Bot, ToggleLeft, ToggleRight, Sparkles, Trash2, ShieldCheck, Zap, ArrowUp, LayoutGrid, Rows3 } from 'lucide-react';
import { AgentDefinition } from '../../types';
import { sounds } from '../../services/soundEffects';

interface VirtualizedAgentGridProps {
  agents: AgentDefinition[];
  selectedAgentId?: string;
  onSelectAgent: (agent: AgentDefinition) => void;
  onToggleAgent: (id: string) => void;
  onDeleteAgent?: (id: string) => void;
  height?: number;
  searchHighlight?: string;
}

const STANDARD_ROW_HEIGHT = 168; // Height in px per 2-col row
const COMPACT_ROW_HEIGHT = 120; // Height in px per compact row
const OVERSCAN_ROWS = 2; // Extra rows to render above and below viewport

export const VirtualizedAgentGrid: React.FC<VirtualizedAgentGridProps> = ({
  agents,
  selectedAgentId,
  onSelectAgent,
  onToggleAgent,
  onDeleteAgent,
  height = 640,
  searchHighlight = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerWidth, setContainerWidth] = useState(800);
  const [density, setDensity] = useState<'standard' | 'compact'>('standard');
  const [sortBy, setSortBy] = useState<'name' | 'executions' | 'tier'>('name');

  const rowHeight = density === 'compact' ? COMPACT_ROW_HEIGHT : STANDARD_ROW_HEIGHT;

  // Responsive column count based on container width
  const columns = useMemo(() => {
    if (containerWidth < 600) return 1;
    return 2;
  }, [containerWidth]);

  // Track container resize
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateWidth = () => {
      if (el) {
        setContainerWidth(el.clientWidth);
      }
    };

    updateWidth();

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0) {
          setContainerWidth(entry.contentRect.width);
        }
      }
    });

    resizeObserver.observe(el);
    return () => resizeObserver.disconnect();
  }, []);

  // Sorted agents
  const sortedAgents = useMemo(() => {
    const copy = [...agents];
    if (sortBy === 'name') {
      copy.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'executions') {
      copy.sort((a, b) => b.executionsCount - a.executionsCount);
    } else if (sortBy === 'tier') {
      copy.sort((a, b) => (a.tier || 'Tier 1').localeCompare(b.tier || 'Tier 1'));
    }
    return copy;
  }, [agents, sortBy]);

  // Handle scroll events with RAF throttling for high-frame-rate performance
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  // Scroll to top handler
  const scrollToTop = () => {
    if (containerRef.current) {
      sounds.playClick();
      containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Total rows
  const totalRows = Math.ceil(sortedAgents.length / columns);
  const totalHeight = totalRows * rowHeight;

  // Visible row calculations
  const startRow = Math.max(0, Math.floor(scrollTop / rowHeight) - OVERSCAN_ROWS);
  const visibleRowCount = Math.ceil(height / rowHeight) + OVERSCAN_ROWS * 2;
  const endRow = Math.min(totalRows - 1, startRow + visibleRowCount);

  // Collect visible rows
  const visibleRows = useMemo(() => {
    const rows: { rowIndex: number; items: AgentDefinition[] }[] = [];
    for (let r = startRow; r <= endRow; r++) {
      const startIdx = r * columns;
      const endIdx = Math.min(sortedAgents.length, startIdx + columns);
      const rowItems = sortedAgents.slice(startIdx, endIdx);
      if (rowItems.length > 0) {
        rows.push({ rowIndex: r, items: rowItems });
      }
    }
    return rows;
  }, [sortedAgents, columns, startRow, endRow]);

  // Helper to highlight matching text in title/description
  const renderHighlighted = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <mark key={i} className="bg-cyan-500/30 text-cyan-200 px-0.5 rounded">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  if (sortedAgents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center text-slate-500 border border-dashed border-slate-800 rounded-xl h-[400px]">
        <Bot className="w-10 h-10 text-slate-600 mb-3" />
        <h4 className="text-sm font-bold text-slate-400">No Sub-Agents Matched</h4>
        <p className="text-xs text-slate-500 mt-1 max-w-sm">
          Try clearing your search query or selecting a different division or subcategory in the taxonomy.
        </p>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col space-y-2">
      {/* Virtualization Performance & View Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-1.5 border-b border-slate-850 text-[11px] text-slate-400 font-mono">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-cyan-400">
            <Zap className="w-3.5 h-3.5 animate-pulse" />
            <span className="font-semibold text-white">Virtualized Grid</span>
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400">
            Rendering rows {startRow + 1}–{endRow + 1} of {totalRows} ({sortedAgents.length} agents)
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 text-[10px]">
            <span className="text-slate-500">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5 text-slate-300 focus:outline-none focus:border-cyan-400"
            >
              <option value="name">Name (A-Z)</option>
              <option value="executions">Most Executions</option>
              <option value="tier">Priority Tier</option>
            </select>
          </div>

          {/* Density Toggle */}
          <div className="flex items-center bg-slate-900/90 rounded border border-slate-800 p-0.5">
            <button
              onClick={() => {
                sounds.playClick();
                setDensity('standard');
              }}
              className={`p-1 rounded ${
                density === 'standard' ? 'bg-sky-600 text-white' : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Standard View"
            >
              <LayoutGrid className="w-3 h-3" />
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                setDensity('compact');
              }}
              className={`p-1 rounded ${
                density === 'compact' ? 'bg-sky-600 text-white' : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Compact View"
            >
              <Rows3 className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Virtualized Scroll Container */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        style={{ height }}
        className="relative overflow-y-auto overflow-x-hidden rounded-xl border border-slate-800/80 bg-slate-950/40 p-2 scrollbar-thin scrollbar-thumb-slate-700"
      >
        {/* Full virtual height canvas */}
        <div style={{ height: totalHeight, width: '100%', position: 'relative' }}>
          {visibleRows.map(({ rowIndex, items }) => (
            <div
              key={rowIndex}
              style={{
                position: 'absolute',
                top: rowIndex * rowHeight,
                left: 0,
                right: 0,
                height: rowHeight - 8,
              }}
              className={`grid gap-2.5 ${columns === 2 ? 'grid-cols-2' : 'grid-cols-1'}`}
            >
              {items.map((agent) => {
                const isSelected = selectedAgentId === agent.id;
                return (
                  <div
                    key={agent.id}
                    onClick={() => {
                      sounds.playClick();
                      onSelectAgent(agent);
                    }}
                    className={`p-3 rounded-lg border transition-all cursor-pointer flex flex-col justify-between select-none ${
                      isSelected
                        ? 'border-sky-400 bg-sky-500/10 shadow-[0_0_14px_rgba(56,189,248,0.25)] ring-1 ring-sky-400/40'
                        : 'border-slate-800/90 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-900/80'
                    }`}
                  >
                    {/* Header Row */}
                    <div className="flex items-start justify-between gap-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className={`p-1.5 rounded shrink-0 ${
                            agent.isDynamic ? 'bg-amber-950/80 text-amber-400' : 'bg-slate-800 text-sky-400'
                          }`}
                        >
                          <Bot className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-xs font-bold text-white truncate">
                              {renderHighlighted(agent.name, searchHighlight)}
                            </h4>
                            {agent.isDynamic && (
                              <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40">
                                DYNAMIC
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-[10px] text-slate-400 truncate">
                            <span className="text-cyan-300 font-semibold">{agent.category}</span>
                            {agent.subcategory && (
                              <>
                                <span>/</span>
                                <span className="text-slate-400 truncate">{agent.subcategory}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        {agent.isDynamic && onDeleteAgent && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              sounds.playClick();
                              onDeleteAgent(agent.id);
                            }}
                            className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                            title="Eject dynamic agent"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            sounds.playClick();
                            onToggleAgent(agent.id);
                          }}
                          className="text-slate-400 hover:text-white ml-0.5"
                          title={agent.enabled ? 'Click to disable agent' : 'Click to enable agent'}
                        >
                          {agent.enabled ? (
                            <ToggleRight className="w-5 h-5 text-emerald-400" />
                          ) : (
                            <ToggleLeft className="w-5 h-5 text-slate-600" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Role & Description (Shown fully in standard density) */}
                    {density === 'standard' ? (
                      <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed mt-1.5">
                        {renderHighlighted(agent.description, searchHighlight)}
                      </p>
                    ) : (
                      <p className="text-[10px] text-slate-400 truncate mt-1">
                        {renderHighlighted(agent.role, searchHighlight)}
                      </p>
                    )}

                    {/* Tool Badges / Footer */}
                    <div className="pt-2 mt-1 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                      <div className="flex items-center gap-1 overflow-hidden">
                        <ShieldCheck className="w-3 h-3 text-sky-400 shrink-0" />
                        <span className="truncate max-w-[120px]">{agent.tools[0] || 'Standard'}</span>
                        {agent.tools.length > 1 && (
                          <span className="text-[9px] px-1 py-0.2 rounded bg-slate-800 text-slate-300">
                            +{agent.tools.length - 1}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span>{agent.executionsCount} runs</span>
                        <span
                          className={`font-semibold ${
                            agent.enabled ? 'text-emerald-400' : 'text-slate-500'
                          }`}
                        >
                          {agent.enabled ? 'ONLINE' : 'OFFLINE'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Floating Scroll to Top button when scrolled deep */}
      {scrollTop > 300 && (
        <button
          onClick={scrollToTop}
          className="absolute bottom-4 right-4 p-2 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-600/30 transition-all active:scale-95 z-10"
          title="Scroll to Top"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
