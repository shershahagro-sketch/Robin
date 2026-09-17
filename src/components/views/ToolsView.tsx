import React, { useState } from 'react';
import { Wrench, Shield, Check, Play, ToggleLeft, ToggleRight, Sliders, ShieldCheck, AlertCircle } from 'lucide-react';
import { ToolDefinition, ThemeConfig, ToolPermission } from '../../types';
import { sounds } from '../../services/soundEffects';

interface ToolsViewProps {
  tools: ToolDefinition[];
  currentTheme: ThemeConfig;
  onToggleTool: (id: string) => void;
  onChangePermission: (id: string, perm: ToolPermission) => void;
  onTestTool: (toolName: string) => void;
}

export const ToolsView: React.FC<ToolsViewProps> = ({
  tools,
  currentTheme,
  onToggleTool,
  onChangePermission,
  onTestTool,
}) => {
  return (
    <div id="view-tool-manager" className="space-y-4 max-w-7xl mx-auto font-mono text-slate-200">
      <div
        className="p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-3"
        style={{
          backgroundColor: currentTheme.panelBg,
          borderColor: currentTheme.panelBorder,
        }}
      >
        <div>
          <div className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-teal-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              PLATFORM TOOL & CAPABILITY MANAGER
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Configure permission policies (Allowed, Prompt Always, Blocked), test tool executions, and audit invocation metrics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">
            Armed Tools: <span className="text-emerald-400 font-bold">{tools.filter((t) => t.enabled).length}</span> / {tools.length}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((tool) => (
          <div
            key={tool.id}
            className="p-4 rounded-xl border flex flex-col justify-between group transition-all"
            style={{
              backgroundColor: currentTheme.panelBg,
              borderColor: currentTheme.panelBorder,
            }}
          >
            <div>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded bg-slate-800">
                    <Wrench className="w-4 h-4 text-sky-400" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white group-hover:text-sky-300 transition-colors">
                      {tool.name}
                    </h3>
                    <span className="text-[10px] text-slate-400">{tool.category}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    sounds.playClick();
                    onToggleTool(tool.id);
                  }}
                  className="text-slate-400 hover:text-white"
                  title={tool.enabled ? 'Click to disable' : 'Click to enable'}
                >
                  {tool.enabled ? (
                    <ToggleRight className="w-6 h-6 text-emerald-400" />
                  ) : (
                    <ToggleLeft className="w-6 h-6 text-slate-600" />
                  )}
                </button>
              </div>

              <p className="text-xs text-slate-300 mt-1 leading-relaxed">{tool.description}</p>

              {/* Permission Policy Selector */}
              <div className="mt-3 p-2 rounded-lg bg-black/40 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-bold flex items-center gap-1">
                    <Shield className="w-3 h-3 text-sky-400" />
                    <span>Security Policy:</span>
                  </span>
                  <select
                    value={tool.permission}
                    onChange={(e) => {
                      sounds.playClick();
                      onChangePermission(tool.id, e.target.value as ToolPermission);
                    }}
                    className="bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-[10px] text-slate-200 outline-none"
                  >
                    <option value="ALLOWED">ALLOWED (Silent)</option>
                    <option value="PROMPT_ALWAYS">PROMPT ALWAYS (Safe)</option>
                    <option value="BLOCKED">BLOCKED</option>
                  </select>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span>Default Risk:</span>
                  <span
                    className={`font-bold uppercase ${
                      tool.riskDefault === 'high'
                        ? 'text-rose-400'
                        : tool.riskDefault === 'medium'
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {tool.riskDefault}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 mt-4 border-t border-slate-800 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">Invocations: {tool.commandsHandled}</span>

              <button
                onClick={() => {
                  sounds.playSuccessTone();
                  onTestTool(tool.name);
                }}
                className="flex items-center gap-1 px-3 py-1 rounded bg-sky-600 hover:bg-sky-500 text-white font-bold transition-all shadow active:scale-95"
              >
                <Play className="w-3 h-3" />
                <span>Test Tool</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
