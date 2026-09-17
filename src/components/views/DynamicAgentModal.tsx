import React, { useState } from 'react';
import { X, Plus, Sparkles, Box, Shield, Download, Upload, Terminal, Bot, CheckCircle } from 'lucide-react';
import { DYNAMIC_AGENT_PACKS } from '../../services/agentRegistry';
import { sounds } from '../../services/soundEffects';

interface DynamicAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInjectCustomAgent: (draft: {
    name: string;
    role: string;
    category: string;
    subcategory?: string;
    description: string;
    tools?: string[];
    tier?: 'Tier 1 Autonomous' | 'Tier 2 Semi-Autonomous' | 'Tier 3 Supervised';
    tags?: string[];
  }) => void;
  onInjectPack: (packId: string) => void;
  onExportManifest: () => void;
  onImportManifest: (jsonString: string) => void;
  categories: string[];
}

export const DynamicAgentModal: React.FC<DynamicAgentModalProps> = ({
  isOpen,
  onClose,
  onInjectCustomAgent,
  onInjectPack,
  onExportManifest,
  onImportManifest,
  categories,
}) => {
  const [tab, setTab] = useState<'custom' | 'packs' | 'manifest'>('custom');

  // Custom Agent Form State
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [category, setCategory] = useState(categories[0] || 'Developer');
  const [subcategory, setSubcategory] = useState('Custom Automation');
  const [tier, setTier] = useState<'Tier 1 Autonomous' | 'Tier 2 Semi-Autonomous' | 'Tier 3 Supervised'>('Tier 1 Autonomous');
  const [tools, setTools] = useState('Dynamic Sandbox, CLI Runner');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('dynamic, custom, sub-agent');

  // Manifest Import State
  const [importJson, setImportJson] = useState('');
  const [importSuccess, setImportSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !role.trim() || !description.trim()) return;

    sounds.playSuccessTone();
    onInjectCustomAgent({
      name,
      role,
      category,
      subcategory,
      tier,
      description,
      tools: tools.split(',').map((t) => t.trim()).filter(Boolean),
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
    });

    // Reset and close
    setName('');
    setRole('');
    setDescription('');
    onClose();
  };

  const handlePackInject = (packId: string) => {
    sounds.playSuccessTone();
    onInjectPack(packId);
    onClose();
  };

  const handleImport = () => {
    if (!importJson.trim()) return;
    try {
      onImportManifest(importJson);
      setImportSuccess('Manifest successfully injected into Agent Registry.');
      sounds.playSuccessTone();
      setTimeout(() => {
        setImportSuccess(null);
        onClose();
      }, 1200);
    } catch {
      setImportSuccess('Failed to parse JSON manifest.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in font-mono">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Dynamic Sub-Agent Injection Engine
              </h3>
              <p className="text-[11px] text-slate-400">
                Instantly synthesize and inject autonomous sub-agents into ROBIN&apos;s runtime registry
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-2 px-4 pt-3 border-b border-slate-800 bg-slate-950/40 text-xs">
          <button
            onClick={() => setTab('custom')}
            className={`pb-2.5 px-3 font-semibold transition-all border-b-2 flex items-center gap-1.5 ${
              tab === 'custom'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Custom Sub-Agent</span>
          </button>
          <button
            onClick={() => setTab('packs')}
            className={`pb-2.5 px-3 font-semibold transition-all border-b-2 flex items-center gap-1.5 ${
              tab === 'packs'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>Pre-Engineered Packs (+10)</span>
          </button>
          <button
            onClick={() => setTab('manifest')}
            className={`pb-2.5 px-3 font-semibold transition-all border-b-2 flex items-center gap-1.5 ${
              tab === 'manifest'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>JSON Manifest</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto flex-1 text-xs">
          {tab === 'custom' && (
            <form onSubmit={handleCustomSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Agent Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Postgres Index Heuristic Agent"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Specialized Role *
                  </label>
                  <input
                    type="text"
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Query Plan Heuristics & Index Tuner"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Operational Division
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Subcategory
                  </label>
                  <input
                    type="text"
                    value={subcategory}
                    onChange={(e) => setSubcategory(e.target.value)}
                    placeholder="e.g. Database Diagnostics"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Priority Tier
                  </label>
                  <select
                    value={tier}
                    onChange={(e) => setTier(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Tier 1 Autonomous">Tier 1 Autonomous</option>
                    <option value="Tier 2 Semi-Autonomous">Tier 2 Semi-Autonomous</option>
                    <option value="Tier 3 Supervised">Tier 3 Supervised</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  Bound Tools (comma separated)
                </label>
                <input
                  type="text"
                  value={tools}
                  onChange={(e) => setTools(e.target.value)}
                  placeholder="EXPLAIN Query Runner, Index Benchmarker, Table Vacuum"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  Functional Responsibility Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the autonomous capability, edge cases handled, and execution triggers..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-400 resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold flex items-center gap-1.5 shadow-lg shadow-cyan-600/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Inject Sub-Agent</span>
                </button>
              </div>
            </form>
          )}

          {tab === 'packs' && (
            <div className="space-y-4">
              <p className="text-slate-400 text-xs">
                Deploy comprehensive bundles of 10 fully configured, production-grade sub-agents directly into ROBIN&apos;s active kernel.
              </p>

              <div className="grid grid-cols-1 gap-3">
                {DYNAMIC_AGENT_PACKS.map((pack) => (
                  <div
                    key={pack.id}
                    className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 flex flex-col md:flex-row md:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <Box className="w-4 h-4 text-cyan-400" />
                        <h4 className="text-xs font-bold text-white">{pack.name}</h4>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800">
                          {pack.division}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">{pack.description}</p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {pack.agents.slice(0, 4).map((a, i) => (
                          <span
                            key={i}
                            className="text-[9px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800"
                          >
                            {a.name}
                          </span>
                        ))}
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-900 text-cyan-400">
                          +6 more
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handlePackInject(pack.id)}
                      className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold shrink-0 flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Inject 10 Agents</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'manifest' && (
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-xs">
                  Export complete agent registry or import external JSON manifests.
                </span>
                <button
                  onClick={onExportManifest}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center gap-1.5 font-bold"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Manifest</span>
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  Import Agents JSON
                </label>
                <textarea
                  rows={6}
                  value={importJson}
                  onChange={(e) => setImportJson(e.target.value)}
                  placeholder="Paste JSON array of AgentDefinition items..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-[11px] focus:outline-none focus:border-cyan-400 resize-none"
                />
              </div>

              {importSuccess && (
                <div className="p-2 rounded bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>{importSuccess}</span>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  Close
                </button>
                <button
                  onClick={handleImport}
                  className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Inject from JSON</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
