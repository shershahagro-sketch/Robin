import React, { useState, useMemo } from 'react';
import { Layers, ChevronDown, ChevronRight, FolderTree, Cpu, Database, Globe, Brain, Terminal, Shield, Mic, Eye, Wifi, Briefcase, Zap, HardDrive, Search, ChevronsDownUp, ChevronsUpDown } from 'lucide-react';
import { AgentDivisionHierarchy } from '../../types';
import { sounds } from '../../services/soundEffects';

interface AgentHierarchyTreeProps {
  hierarchy: AgentDivisionHierarchy[];
  selectedDivision: string;
  selectedSubcategory: string;
  onSelectDivision: (division: string) => void;
  onSelectSubcategory: (division: string, subcategory: string) => void;
  onResetHierarchy: () => void;
  totalAgentsCount: number;
}

// Icon mapper for divisions
const getDivisionIcon = (division: string) => {
  const d = division.toLowerCase();
  if (d.includes('system') || d.includes('kernel')) return <Cpu className="w-4 h-4 text-cyan-400" />;
  if (d.includes('files') || d.includes('storage')) return <Database className="w-4 h-4 text-emerald-400" />;
  if (d.includes('web') || d.includes('browser')) return <Globe className="w-4 h-4 text-blue-400" />;
  if (d.includes('intelligence') || d.includes('ai') || d.includes('llm')) return <Brain className="w-4 h-4 text-purple-400" />;
  if (d.includes('developer') || d.includes('dev') || d.includes('ops')) return <Terminal className="w-4 h-4 text-amber-400" />;
  if (d.includes('security') || d.includes('red team') || d.includes('audit')) return <Shield className="w-4 h-4 text-rose-400" />;
  if (d.includes('speech') || d.includes('voice') || d.includes('multilingual')) return <Mic className="w-4 h-4 text-pink-400" />;
  if (d.includes('vision') || d.includes('ocr')) return <Eye className="w-4 h-4 text-teal-400" />;
  if (d.includes('network') || d.includes('cloud')) return <Wifi className="w-4 h-4 text-indigo-400" />;
  if (d.includes('productivity') || d.includes('workflow')) return <Briefcase className="w-4 h-4 text-orange-400" />;
  if (d.includes('automation')) return <Zap className="w-4 h-4 text-yellow-400" />;
  if (d.includes('memory')) return <HardDrive className="w-4 h-4 text-sky-400" />;
  return <Layers className="w-4 h-4 text-slate-400" />;
};

export const AgentHierarchyTree: React.FC<AgentHierarchyTreeProps> = ({
  hierarchy,
  selectedDivision,
  selectedSubcategory,
  onSelectDivision,
  onSelectSubcategory,
  onResetHierarchy,
  totalAgentsCount,
}) => {
  // Track open/collapsed state of division sections
  const [collapsedDivisions, setCollapsedDivisions] = useState<Record<string, boolean>>({});
  const [treeSearch, setTreeSearch] = useState('');

  const toggleCollapse = (division: string, e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playClick();
    setCollapsedDivisions((prev) => ({
      ...prev,
      [division]: !prev[division],
    }));
  };

  const expandAll = () => {
    sounds.playClick();
    setCollapsedDivisions({});
  };

  const collapseAll = () => {
    sounds.playClick();
    const all: Record<string, boolean> = {};
    hierarchy.forEach((h) => {
      all[h.division] = true;
    });
    setCollapsedDivisions(all);
  };

  // Filter hierarchy by search within sidebar
  const filteredHierarchy = useMemo(() => {
    if (!treeSearch.trim()) return hierarchy;
    const q = treeSearch.toLowerCase();
    return hierarchy
      .map((divGroup) => {
        const matchesDiv = divGroup.division.toLowerCase().includes(q);
        const matchingSubs = divGroup.subcategories.filter((s) =>
          s.name.toLowerCase().includes(q)
        );
        if (matchesDiv || matchingSubs.length > 0) {
          return {
            ...divGroup,
            subcategories: matchesDiv ? divGroup.subcategories : matchingSubs,
          };
        }
        return null;
      })
      .filter(Boolean) as AgentDivisionHierarchy[];
  }, [hierarchy, treeSearch]);

  const isAllSelected = selectedDivision === 'ALL';

  return (
    <div className="flex flex-col space-y-2.5 select-none">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200 uppercase tracking-wider">
          <FolderTree className="w-3.5 h-3.5 text-cyan-400" />
          <span>Taxonomy Hierarchy</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={expandAll}
            className="p-1 text-slate-500 hover:text-slate-300 transition-colors"
            title="Expand All"
          >
            <ChevronsUpDown className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={collapseAll}
            className="p-1 text-slate-500 hover:text-slate-300 transition-colors"
            title="Collapse All"
          >
            <ChevronsDownUp className="w-3.5 h-3.5" />
          </button>
          {!isAllSelected && (
            <button
              onClick={() => {
                sounds.playClick();
                onResetHierarchy();
              }}
              className="ml-1 text-[10px] text-cyan-400 hover:text-cyan-300 hover:underline"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Mini search inside hierarchy sidebar */}
      <div className="relative">
        <Search className="w-3 h-3 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={treeSearch}
          onChange={(e) => setTreeSearch(e.target.value)}
          placeholder="Filter categories..."
          className="w-full pl-7 pr-2.5 py-1 text-[11px] bg-slate-900/90 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
        />
      </div>

      {/* "All Divisions" Master Button */}
      <button
        onClick={() => {
          sounds.playClick();
          onResetHierarchy();
        }}
        className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-bold transition-all border ${
          isAllSelected
            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.25)]'
            : 'bg-slate-900/40 text-slate-400 border-slate-800/80 hover:border-slate-700 hover:text-slate-300'
        }`}
      >
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span>All Operational Divisions</span>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 font-mono font-bold border border-cyan-800/60">
          {totalAgentsCount}
        </span>
      </button>

      {/* Divisions & Subcategories Accordion List */}
      <div className="space-y-1.5 max-h-[560px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800">
        {filteredHierarchy.map((divGroup) => {
          const isDivisionActive = selectedDivision === divGroup.division;
          const isCollapsed = !!collapsedDivisions[divGroup.division];

          return (
            <div
              key={divGroup.division}
              className={`rounded-lg border transition-all overflow-hidden ${
                isDivisionActive
                  ? 'border-sky-500/40 bg-slate-900/70 shadow-[0_0_8px_rgba(14,165,233,0.15)]'
                  : 'border-slate-800/70 bg-slate-950/40 hover:border-slate-750'
              }`}
            >
              {/* Division Header */}
              <div
                onClick={() => {
                  sounds.playClick();
                  onSelectDivision(divGroup.division);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-2 text-xs font-semibold cursor-pointer transition-colors ${
                  isDivisionActive && selectedSubcategory === 'ALL'
                    ? 'bg-sky-500/15 text-sky-300 border-l-2 border-sky-400'
                    : 'text-slate-300 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <button
                    onClick={(e) => toggleCollapse(divGroup.division, e)}
                    className="text-slate-500 hover:text-white p-0.5 transition-colors"
                  >
                    {isCollapsed ? (
                      <ChevronRight className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>
                  {getDivisionIcon(divGroup.division)}
                  <span className="truncate">{divGroup.division}</span>
                </div>

                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 shrink-0 border border-slate-800">
                  {divGroup.count}
                </span>
              </div>

              {/* Subcategories Tree */}
              {!isCollapsed && divGroup.subcategories.length > 0 && (
                <div className="pl-6 pr-2 py-1.5 space-y-1 border-t border-slate-900 bg-black/25">
                  {divGroup.subcategories.map((sub) => {
                    const isSubActive =
                      selectedDivision === divGroup.division &&
                      selectedSubcategory === sub.name;

                    return (
                      <button
                        key={sub.name}
                        onClick={() => {
                          sounds.playClick();
                          onSelectSubcategory(divGroup.division, sub.name);
                        }}
                        className={`w-full flex items-center justify-between px-2 py-1 rounded text-[11px] transition-all ${
                          isSubActive
                            ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40 shadow-[0_0_6px_rgba(6,182,212,0.2)]'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="text-slate-600 font-mono text-xs">•</span>
                          <span className="truncate">{sub.name}</span>
                        </div>
                        <span className="text-[9px] font-mono px-1 rounded bg-slate-900 text-slate-400">
                          {sub.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {filteredHierarchy.length === 0 && (
          <div className="p-4 text-center text-slate-500 text-xs italic">
            No divisions match "{treeSearch}"
          </div>
        )}
      </div>
    </div>
  );
};
