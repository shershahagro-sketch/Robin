import React, { useState } from 'react';
import { Workflow, Play, Plus, Trash2, Clock, CheckCircle2, ArrowRight, Sparkles, Layers } from 'lucide-react';
import { CustomWorkflow, WorkflowAction, ThemeConfig } from '../../types';
import { sounds } from '../../services/soundEffects';

interface WorkflowsViewProps {
  workflows: CustomWorkflow[];
  currentTheme: ThemeConfig;
  onExecuteWorkflow: (wf: CustomWorkflow) => void;
  onCreateWorkflow: (wf: CustomWorkflow) => void;
  onDeleteWorkflow: (id: string) => void;
}

export const WorkflowsView: React.FC<WorkflowsViewProps> = ({
  workflows,
  currentTheme,
  onExecuteWorkflow,
  onCreateWorkflow,
  onDeleteWorkflow,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newTrigger, setNewTrigger] = useState('');
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [actionsList, setActionsList] = useState<WorkflowAction[]>([
    { id: '1', name: 'Open Chrome', tool: 'Application Manager', action: 'open_app', params: { app: 'Chrome' }, delayMs: 400 },
    { id: '2', name: 'Open Terminal', tool: 'Application Manager', action: 'open_app', params: { app: 'Terminal' }, delayMs: 600 },
  ]);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTrigger.trim() || !newName.trim()) return;

    const newWf: CustomWorkflow = {
      id: `wf-${Date.now()}`,
      trigger: newTrigger.toLowerCase().trim(),
      name: newName.trim(),
      description: newDescription.trim() || 'Custom user automation sequence.',
      actions: actionsList,
      enabled: true,
      lastRun: 'Never',
    };

    sounds.playSuccessTone();
    onCreateWorkflow(newWf);
    setIsCreating(false);
    setNewTrigger('');
    setNewName('');
    setNewDescription('');
  };

  const addActionRow = () => {
    setActionsList((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        name: 'New Step Action',
        tool: 'Application Manager',
        action: 'open_app',
        params: {},
        delayMs: 500,
      },
    ]);
  };

  return (
    <div id="view-workflows-builder" className="space-y-4 max-w-7xl mx-auto font-mono text-slate-200">
      {/* Header Bar */}
      <div
        className="p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-3"
        style={{
          backgroundColor: currentTheme.panelBg,
          borderColor: currentTheme.panelBorder,
        }}
      >
        <div>
          <div className="flex items-center gap-2">
            <Workflow className="w-5 h-5 text-indigo-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              CUSTOM COMMAND & WORKFLOW BUILDER
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Map single trigger words (e.g. &ldquo;start work&rdquo;, &ldquo;clean system&rdquo;) to multi-step execution pipelines.
          </p>
        </div>

        <button
          id="btn-create-custom-workflow"
          onClick={() => {
            sounds.playClick();
            setIsCreating(!isCreating);
          }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-xs font-bold text-white transition-all shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>New Custom Command</span>
        </button>
      </div>

      {/* Creation Form */}
      {isCreating && (
        <form
          onSubmit={handleCreateSubmit}
          className="p-4 rounded-xl border border-sky-500/50 bg-slate-900/90 space-y-4 animate-fadeIn"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-bold text-sky-300 uppercase">
              Configure Sequential Command Chain
            </span>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="text-slate-400 hover:text-white text-xs"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] text-slate-400 uppercase font-bold">Voice Trigger Phrase</label>
              <input
                type="text"
                value={newTrigger}
                onChange={(e) => setNewTrigger(e.target.value)}
                placeholder="e.g. morning routine, deep focus"
                className="w-full mt-1 bg-black/50 border border-slate-700 rounded px-3 py-1.5 text-xs text-white outline-none focus:border-sky-400"
                required
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-400 uppercase font-bold">Workflow Name</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Morning Productivity Stack"
                className="w-full mt-1 bg-black/50 border border-slate-700 rounded px-3 py-1.5 text-xs text-white outline-none focus:border-sky-400"
                required
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-400 uppercase font-bold">Description</label>
              <input
                type="text"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Brief summary of operations..."
                className="w-full mt-1 bg-black/50 border border-slate-700 rounded px-3 py-1.5 text-xs text-white outline-none focus:border-sky-400"
              />
            </div>
          </div>

          {/* Action steps builder */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-300 uppercase">Action Pipeline Sequence</span>
              <button
                type="button"
                onClick={addActionRow}
                className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>Add Step</span>
              </button>
            </div>

            <div className="space-y-2">
              {actionsList.map((act, index) => (
                <div
                  key={act.id}
                  className="p-2.5 rounded bg-black/40 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                >
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-sky-300 font-bold">
                    Step {index + 1}
                  </span>
                  <input
                    type="text"
                    value={act.name}
                    onChange={(e) => {
                      const updated = [...actionsList];
                      updated[index].name = e.target.value;
                      setActionsList(updated);
                    }}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white outline-none"
                  />
                  <select
                    value={act.tool}
                    onChange={(e) => {
                      const updated = [...actionsList];
                      updated[index].tool = e.target.value;
                      setActionsList(updated);
                    }}
                    className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-300 outline-none"
                  >
                    <option value="Application Manager">App Manager</option>
                    <option value="File Controller">File Controller</option>
                    <option value="Window Snapper">Window Snapper</option>
                    <option value="System Telemetry">System Telemetry</option>
                  </select>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400">
                    <span>Delay:</span>
                    <input
                      type="number"
                      value={act.delayMs}
                      onChange={(e) => {
                        const updated = [...actionsList];
                        updated[index].delayMs = Number(e.target.value);
                        setActionsList(updated);
                      }}
                      className="w-16 bg-slate-900 border border-slate-700 rounded px-1 py-0.5 text-center text-xs text-white"
                    />
                    <span>ms</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition-all shadow-md"
          >
            Save Custom Command
          </button>
        </form>
      )}

      {/* Workflows Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {workflows.map((wf) => (
          <div
            key={wf.id}
            className="p-4 rounded-xl border flex flex-col justify-between group transition-all"
            style={{
              backgroundColor: currentTheme.panelBg,
              borderColor: currentTheme.panelBorder,
            }}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/60 uppercase">
                  TRIGGER: &ldquo;{wf.trigger}&rdquo;
                </span>
                <button
                  onClick={() => {
                    sounds.playClick();
                    onDeleteWorkflow(wf.id);
                  }}
                  className="text-slate-500 hover:text-rose-400 transition-colors"
                  title="Delete workflow"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                {wf.name}
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">{wf.description}</p>

              {/* Action steps preview */}
              <div className="mt-3 space-y-1.5">
                <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                  SEQUENCE ({wf.actions.length} STEPS):
                </div>
                {wf.actions.map((act, i) => (
                  <div
                    key={act.id}
                    className="p-1.5 rounded bg-slate-900/60 border border-slate-800 text-[11px] text-slate-300 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-slate-500 text-[10px]">#{i + 1}</span>
                      <span className="truncate">{act.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 shrink-0">{act.delayMs}ms</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 mt-4 border-t border-slate-800 flex items-center justify-between text-xs">
              <div className="text-[10px] text-slate-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>Last run: {wf.lastRun}</span>
              </div>

              <button
                onClick={() => {
                  sounds.playSuccessTone();
                  onExecuteWorkflow(wf);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold transition-all shadow-md active:scale-95"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Run Pipeline</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
