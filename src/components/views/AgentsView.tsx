import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Bot, Play, ShieldCheck, Sparkles, Search, Filter, Cpu, Plus, CheckCircle2, XCircle, RotateCcw, ChevronRight, Layers, Box, Download, X, PackagePlus } from 'lucide-react';
import { AgentDefinition, ThemeConfig } from '../../types';
import { agentRegistry, DYNAMIC_AGENT_PACKS } from '../../services/agentRegistry';
import { sounds } from '../../services/soundEffects';
import { VirtualizedAgentGrid } from './VirtualizedAgentGrid';
import { AgentHierarchyTree } from './AgentHierarchyTree';
import { DynamicAgentModal } from './DynamicAgentModal';

interface AgentsViewProps {
  agents: AgentDefinition[];
  onToggleAgent: (id: string) => void;
  onExecuteAgentTest: (agentName: string) => void;
  currentTheme: ThemeConfig;
  onInjectAgent?: (draft: Parameters<typeof agentRegistry.injectDynamicAgent>[0]) => void;
  onInjectPack?: (packId: string) => void;
  onDeleteDynamicAgent?: (id: string) => void;
  onResetAgents?: () => void;
}

export const AgentsView: React.FC<AgentsViewProps> = ({
  agents,
  onToggleAgent,
  onExecuteAgentTest,
  currentTheme,
  onInjectAgent,
  onInjectPack,
  onDeleteDynamicAgent,
  onResetAgents,
}) => {
  const [selectedAgent, setSelectedAgent] = useState<AgentDefinition | null>(agents[0] || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchScope, setSearchScope] = useState<'ALL' | 'NAME' | 'TOOLS' | 'TAGS'>('ALL');
  const [selectedDivision, setSelectedDivision] = useState<string>('ALL');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ONLINE' | 'DISABLED'>('ALL');
  const [isInjectionModalOpen, setIsInjectionModalOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Global keyboard shortcut to focus search with '/'
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Compute hierarchical taxonomy from current agent registry
  const hierarchy = useMemo(() => {
    return agentRegistry.getDivisionsHierarchy();
  }, [agents]);

  // Distinct category list for forms
  const allDivisions = useMemo(() => {
    return hierarchy.map((h) => h.division);
  }, [hierarchy]);

  // Aggregate stats
  const stats = useMemo(() => {
    return agentRegistry.getStats();
  }, [agents]);

  // Filtered agents list based on search, hierarchical division, subcategory, and status
  const filteredAgents = useMemo(() => {
    return agents.filter((agent) => {
      // 1. Division filter
      if (selectedDivision !== 'ALL' && agent.category !== selectedDivision) {
        return false;
      }

      // 2. Subcategory filter
      if (selectedSubcategory !== 'ALL' && agent.subcategory !== selectedSubcategory) {
        return false;
      }

      // 3. Status filter
      if (statusFilter === 'ONLINE' && !agent.enabled) return false;
      if (statusFilter === 'DISABLED' && agent.enabled) return false;

      // 4. Search query & scope
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();

      if (searchScope === 'NAME') {
        return agent.name.toLowerCase().includes(q);
      }
      if (searchScope === 'TOOLS') {
        return agent.tools.some((t) => t.toLowerCase().includes(q));
      }
      if (searchScope === 'TAGS') {
        return agent.tags && agent.tags.some((tag) => tag.toLowerCase().includes(q));
      }

      // 'ALL' Scope
      return (
        agent.name.toLowerCase().includes(q) ||
        agent.role.toLowerCase().includes(q) ||
        agent.description.toLowerCase().includes(q) ||
        agent.category.toLowerCase().includes(q) ||
        (agent.subcategory && agent.subcategory.toLowerCase().includes(q)) ||
        (agent.tags && agent.tags.some((tag) => tag.toLowerCase().includes(q))) ||
        agent.tools.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [agents, selectedDivision, selectedSubcategory, statusFilter, searchQuery, searchScope]);

  // Handle Division Selection
  const handleSelectDivision = useCallback((division: string) => {
    setSelectedDivision(division);
    setSelectedSubcategory('ALL');
  }, []);

  // Handle Subcategory Selection
  const handleSelectSubcategory = useCallback((division: string, subcategory: string) => {
    setSelectedDivision(division);
    setSelectedSubcategory(subcategory);
  }, []);

  // Reset Hierarchy Filters
  const handleResetHierarchy = useCallback(() => {
    setSelectedDivision('ALL');
    setSelectedSubcategory('ALL');
  }, []);

  // Handle Custom Dynamic Injection
  const handleInjectCustomAgent = useCallback((draft: Parameters<typeof agentRegistry.injectDynamicAgent>[0]) => {
    if (onInjectAgent) {
      onInjectAgent(draft);
    } else {
      const newAgent = agentRegistry.injectDynamicAgent(draft);
      setSelectedAgent(newAgent);
    }
  }, [onInjectAgent]);

  // Handle Preset Pack Injection
  const handleInjectPack = useCallback((packId: string) => {
    if (onInjectPack) {
      onInjectPack(packId);
    } else {
      const injected = agentRegistry.injectPresetPack(packId);
      if (injected.length > 0) {
        setSelectedAgent(injected[0]);
      }
    }
  }, [onInjectPack]);

  // Handle Agent Deletion
  const handleDeleteAgent = useCallback((id: string) => {
    if (onDeleteDynamicAgent) {
      onDeleteDynamicAgent(id);
    } else {
      agentRegistry.unregisterAgent(id);
      if (selectedAgent?.id === id) {
        setSelectedAgent(agents.find((a) => a.id !== id) || null);
      }
    }
  }, [onDeleteDynamicAgent, selectedAgent, agents]);

  // Export manifest as downloadable JSON
  const handleExportManifest = useCallback(() => {
    sounds.playSuccessTone();
    const manifest = agentRegistry.exportManifest();
    const blob = new Blob([manifest], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `robin-agent-registry-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  // Import manifest from JSON
  const handleImportManifest = useCallback((json: string) => {
    const importedCount = agentRegistry.importManifest(json);
    if (importedCount > 0) {
      sounds.playSuccessTone();
    }
  }, []);

  const pipelineDemo = [
    { name: 'Research Agent', action: 'Gathers AI tool metrics' },
    { name: 'Playwright Crawler', action: 'Crawls benchmark datasets' },
    { name: 'Document Agent', action: 'Formats executive Markdown brief' },
    { name: 'File Agent', action: 'Saves to C:\\Users\\Robin\\Documents' },
  ];

  return (
    <div id="view-multi-agents" className="space-y-4 max-w-7xl mx-auto font-mono text-slate-200">
      {/* Header & Orchestration Summary Card */}
      <div
        className="p-4 rounded-xl border"
        style={{
          backgroundColor: currentTheme.panelBg,
          borderColor: currentTheme.panelBorder,
        }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-cyan-400" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                MULTI-AGENT ORCHESTRATION KERNEL
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              ROBIN coordinates <span className="text-cyan-300 font-bold">{agents.length} autonomous specialized sub-agents</span> with dynamic injection & hierarchical categorization across {hierarchy.length} operational divisions.
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                sounds.playClick();
                setIsInjectionModalOpen(true);
              }}
              className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-cyan-600/25 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Inject Sub-Agent</span>
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                agentRegistry.enableAll();
              }}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
              title="Enable all agents"
            >
              Enable All
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                agentRegistry.disableAll();
              }}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
              title="Disable all agents"
            >
              Disable All
            </button>

            {onResetAgents && (
              <button
                onClick={() => {
                  sounds.playClick();
                  onResetAgents();
                }}
                className="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                title="Reset to default baseline"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Telemetry Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
          <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Total Sub-Agents</span>
            <span className="text-base font-bold text-white font-mono">{stats.total}</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Active Online</span>
            <span className="text-base font-bold text-emerald-400 font-mono">{stats.online}</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Dynamically Injected</span>
            <span className="text-base font-bold text-amber-400 font-mono">{stats.dynamic}</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Total Executions</span>
            <span className="text-base font-bold text-cyan-400 font-mono">{stats.totalExecutions}</span>
          </div>
        </div>

        {/* Visual Orchestration Pipeline Banner */}
        <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
          <div className="text-[11px] font-bold text-sky-300 uppercase mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>Autonomous Pipeline Decomposition (Example: &quot;Research AI tools and create report&quot;)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {pipelineDemo.map((step, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded border border-slate-800 bg-black/40 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800/60">
                    Step {idx + 1}
                  </span>
                  <span className="text-[10px] text-slate-500">Autonomous</span>
                </div>
                <div className="font-bold text-xs text-white">{step.name}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{step.action}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Roster Search, Status Filter & Breadcrumb Toolbar */}
      <div
        className="p-3.5 rounded-xl border flex flex-col gap-2.5"
        style={{
          backgroundColor: currentTheme.panelBg,
          borderColor: currentTheme.panelBorder,
        }}
      >
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Bar */}
          <div className="relative flex-1 min-w-[260px]">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Filter ${agents.length} sub-agents by ${searchScope.toLowerCase()}... (Press '/' to search)`}
              className="w-full pl-9 pr-16 py-2 bg-slate-950/80 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              {searchQuery ? (
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-1 text-slate-400 hover:text-white transition-colors"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : (
                <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-slate-900 text-slate-500 rounded border border-slate-800">
                  /
                </kbd>
              )}
            </div>
          </div>

          {/* Status Filter Toggle */}
          <div className="flex items-center bg-slate-950/90 rounded-lg p-1 border border-slate-800 text-[11px] shrink-0">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-2.5 py-1 rounded transition-all ${
                statusFilter === 'ALL'
                  ? 'bg-sky-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({agents.length})
            </button>
            <button
              onClick={() => setStatusFilter('ONLINE')}
              className={`px-2.5 py-1 rounded transition-all flex items-center gap-1 ${
                statusFilter === 'ONLINE'
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-300" />
              Online ({stats.online})
            </button>
            <button
              onClick={() => setStatusFilter('DISABLED')}
              className={`px-2.5 py-1 rounded transition-all flex items-center gap-1 ${
                statusFilter === 'DISABLED'
                  ? 'bg-slate-700 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <XCircle className="w-3 h-3 text-slate-400" />
              Disabled ({agents.length - stats.online})
            </button>
          </div>
        </div>

        {/* Search Scope & Quick Suggestion Filters */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] pt-1">
          {/* Scope selection */}
          <div className="flex items-center gap-1 text-slate-400">
            <span className="text-slate-500 text-[10px] uppercase font-bold mr-1">Scope:</span>
            {(['ALL', 'NAME', 'TOOLS', 'TAGS'] as const).map((scope) => (
              <button
                key={scope}
                onClick={() => {
                  sounds.playClick();
                  setSearchScope(scope);
                }}
                className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                  searchScope === scope
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/80'
                }`}
              >
                {scope}
              </button>
            ))}
          </div>

          {/* Quick Suggestions */}
          <div className="flex flex-wrap items-center gap-1 text-slate-400">
            <span className="text-slate-500 text-[10px] uppercase font-bold mr-1">Quick:</span>
            {['Docker', 'Saraiki', 'Red Team', 'Crawler', 'Registry', 'DevOps', 'Kernel'].map((term) => (
              <button
                key={term}
                onClick={() => {
                  sounds.playClick();
                  setSearchQuery(term);
                }}
                className="px-1.5 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-[10px] text-slate-400 hover:text-cyan-300 border border-slate-800 transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        {/* Hierarchical Breadcrumb Navigation */}
        <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/80">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-semibold text-slate-300">Hierarchy:</span>
            <button
              onClick={handleResetHierarchy}
              className={`hover:underline ${
                selectedDivision === 'ALL' ? 'text-cyan-300 font-bold' : 'text-slate-400'
              }`}
            >
              All Divisions
            </button>

            {selectedDivision !== 'ALL' && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                <button
                  onClick={() => setSelectedSubcategory('ALL')}
                  className={`hover:underline ${
                    selectedSubcategory === 'ALL' ? 'text-cyan-300 font-bold' : 'text-slate-400'
                  }`}
                >
                  {selectedDivision}
                </button>
              </>
            )}

            {selectedSubcategory !== 'ALL' && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                <span className="text-cyan-300 font-bold">{selectedSubcategory}</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400">
              Matches: <span className="text-white font-bold font-mono">{filteredAgents.length}</span> / {agents.length}
            </span>
            {(selectedDivision !== 'ALL' || selectedSubcategory !== 'ALL' || searchQuery) && (
              <button
                onClick={() => {
                  handleResetHierarchy();
                  setSearchQuery('');
                }}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3-Column Split: Hierarchy Sidebar + Virtualized Grid + Agent Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left (3 cols): Hierarchical Taxonomy Accordion */}
        <div
          className="lg:col-span-3 p-3.5 rounded-xl border space-y-3"
          style={{
            backgroundColor: currentTheme.panelBg,
            borderColor: currentTheme.panelBorder,
          }}
        >
          <AgentHierarchyTree
            hierarchy={hierarchy}
            selectedDivision={selectedDivision}
            selectedSubcategory={selectedSubcategory}
            onSelectDivision={handleSelectDivision}
            onSelectSubcategory={handleSelectSubcategory}
            onResetHierarchy={handleResetHierarchy}
            totalAgentsCount={agents.length}
          />
        </div>

        {/* Center (6 cols): Virtualized Agent Grid */}
        <div
          className="lg:col-span-6 p-3.5 rounded-xl border space-y-2"
          style={{
            backgroundColor: currentTheme.panelBg,
            borderColor: currentTheme.panelBorder,
          }}
        >
          <VirtualizedAgentGrid
            agents={filteredAgents}
            selectedAgentId={selectedAgent?.id}
            onSelectAgent={setSelectedAgent}
            onToggleAgent={onToggleAgent}
            onDeleteAgent={handleDeleteAgent}
            height={640}
            searchHighlight={searchQuery}
          />
        </div>

        {/* Right (3 cols): Selected Agent Detailed Inspector */}
        <div
          className="lg:col-span-3 p-4 rounded-xl border space-y-4 lg:sticky lg:top-4"
          style={{
            backgroundColor: currentTheme.panelBg,
            borderColor: currentTheme.panelBorder,
          }}
        >
          {selectedAgent ? (
            <>
              {/* Agent Title & Status */}
              <div className="flex items-start justify-between border-b pb-3" style={{ borderColor: currentTheme.panelBorder }}>
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className={`p-2 rounded-lg shrink-0 ${
                      selectedAgent.isDynamic ? 'bg-amber-950/80 text-amber-400 border border-amber-800' : 'bg-slate-800 text-sky-400'
                    }`}
                  >
                    <Bot className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold text-white truncate">{selectedAgent.name}</h3>
                    <span className="text-[10px] text-sky-300 block truncate">{selectedAgent.role}</span>
                  </div>
                </div>

                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-bold shrink-0 ${
                    selectedAgent.enabled ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {selectedAgent.enabled ? 'ONLINE' : 'OFFLINE'}
                </span>
              </div>

              {/* Taxonomy Categorization Details */}
              <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">Operational Division:</span>
                  <span className="text-cyan-300 font-bold">{selectedAgent.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Subcategory:</span>
                  <span className="text-slate-300">{selectedAgent.subcategory || 'General Specialization'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Priority Tier:</span>
                  <span className="text-amber-300">{selectedAgent.tier || 'Tier 1 Autonomous'}</span>
                </div>
                {selectedAgent.isDynamic && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Injection Type:</span>
                    <span className="text-amber-400 font-bold">Dynamic Runtime Agent</span>
                  </div>
                )}
              </div>

              {/* Functional Responsibility */}
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                  FUNCTIONAL RESPONSIBILITY
                </span>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {selectedAgent.description}
                </p>
              </div>

              {/* Bound Platform Tools */}
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                  BOUND PLATFORM TOOLS ({selectedAgent.tools.length})
                </span>
                <div className="space-y-1 mt-1.5 max-h-32 overflow-y-auto pr-1">
                  {selectedAgent.tools.map((tool, i) => (
                    <div
                      key={i}
                      className="px-2 py-1.5 rounded bg-slate-900/60 border border-slate-800 text-[11px] text-slate-300 flex items-center justify-between"
                    >
                      <span className="truncate">{tool}</span>
                      <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags */}
              {selectedAgent.tags && selectedAgent.tags.length > 0 && (
                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                    CAPABILITY TAGS
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedAgent.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="text-[9px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Test Protocol Execution Button */}
              <button
                id="btn-test-agent-dispatch"
                onClick={() => {
                  sounds.playSuccessTone();
                  agentRegistry.recordExecution(selectedAgent.id);
                  onExecuteAgentTest(selectedAgent.name);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-all shadow-md active:scale-95"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Test &quot;{selectedAgent.name}&quot; Protocol</span>
              </button>
            </>
          ) : (
            <div className="text-center py-16 text-slate-500 text-xs">
              Select an agent from the virtualized grid to inspect capabilities.
            </div>
          )}
        </div>
      </div>

      {/* Dynamic Agent Injection Modal */}
      <DynamicAgentModal
        isOpen={isInjectionModalOpen}
        onClose={() => setIsInjectionModalOpen(false)}
        onInjectCustomAgent={handleInjectCustomAgent}
        onInjectPack={handleInjectPack}
        onExportManifest={handleExportManifest}
        onImportManifest={handleImportManifest}
        categories={allDivisions}
      />
    </div>
  );
};
