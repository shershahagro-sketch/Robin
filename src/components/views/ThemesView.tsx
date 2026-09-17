import React, { useState } from 'react';
import { Palette, Download, Upload, Check, RefreshCw, Sparkles, Sliders } from 'lucide-react';
import { ThemeConfig } from '../../types';
import { PRESET_THEMES } from '../../data/initialState';
import { sounds } from '../../services/soundEffects';

interface ThemesViewProps {
  currentTheme: ThemeConfig;
  availableThemes: ThemeConfig[];
  onSelectTheme: (id: string) => void;
  onUpdateCustomTheme: (theme: ThemeConfig) => void;
}

export const ThemesView: React.FC<ThemesViewProps> = ({
  currentTheme,
  availableThemes,
  onSelectTheme,
  onUpdateCustomTheme,
}) => {
  const [editingTheme, setEditingTheme] = useState<ThemeConfig>({ ...currentTheme });

  const handleColorChange = (key: keyof ThemeConfig, val: any) => {
    const updated = { ...editingTheme, [key]: val };
    setEditingTheme(updated);
    onUpdateCustomTheme(updated);
  };

  const exportThemeJson = () => {
    sounds.playClick();
    const blob = new Blob([JSON.stringify(editingTheme, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `robin_theme_${editingTheme.name.toLowerCase().replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.primaryColor && parsed.bgBase) {
          sounds.playSuccessTone();
          setEditingTheme(parsed);
          onUpdateCustomTheme(parsed);
        }
      } catch (err) {
        console.error('Failed to parse theme JSON', err);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div id="view-theme-engine" className="space-y-4 max-w-7xl mx-auto font-mono text-slate-200">
      {/* Header */}
      <div
        className="p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-3"
        style={{
          backgroundColor: currentTheme.panelBg,
          borderColor: currentTheme.panelBorder,
        }}
      >
        <div>
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-purple-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              ROBIN THEME & SHADER ENGINE
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Choose from 8 tuned futuristic presets or customize glow, glass translucency, borders, and RGB hues in real-time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-xs text-slate-300 hover:text-white transition-all cursor-pointer">
            <Upload className="w-3.5 h-3.5 text-sky-400" />
            <span>Import JSON</span>
            <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
          </label>

          <button
            onClick={exportThemeJson}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-xs text-slate-300 hover:text-white transition-all"
          >
            <Download className="w-3.5 h-3.5 text-teal-400" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* Preset Cards */}
      <div className="space-y-2">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          PRESET FUTURISTIC THEMES
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {availableThemes.map((theme) => {
            const isSelected = currentTheme.id === theme.id;
            return (
              <button
                key={theme.id}
                onClick={() => {
                  sounds.playClick();
                  onSelectTheme(theme.id);
                  setEditingTheme({ ...theme });
                }}
                className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden group ${
                  isSelected ? 'border-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.4)]' : 'border-slate-800 hover:border-slate-700'
                }`}
                style={{
                  backgroundColor: theme.panelBg,
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className="w-4 h-4 rounded-full border border-white/20"
                    style={{ backgroundColor: theme.primaryColor, boxShadow: `0 0 8px ${theme.primaryColor}` }}
                  />
                  {isSelected && <Check className="w-3.5 h-3.5 text-sky-400" />}
                </div>
                <div className="text-xs font-bold text-white truncate">{theme.name}</div>
                <div className="text-[10px] text-slate-400 capitalize">{theme.category}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Real-time Theme Editor & Interactive Preview Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Editor Controls */}
        <div
          className="p-4 rounded-xl border space-y-4"
          style={{
            backgroundColor: currentTheme.panelBg,
            borderColor: currentTheme.panelBorder,
          }}
        >
          <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: currentTheme.panelBorder }}>
            <span className="text-xs font-bold uppercase text-white flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-sky-400" />
              <span>Real-Time Color & Shader Tuner</span>
            </span>
            <span className="text-[10px] text-sky-400 font-semibold">Active: {editingTheme.name}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="text-[10px] text-slate-400 uppercase font-bold">Primary Glow</label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="color"
                  value={editingTheme.primaryColor}
                  onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                  className="w-7 h-7 rounded border border-slate-700 bg-transparent cursor-pointer"
                />
                <span className="text-[11px] text-slate-300 uppercase">{editingTheme.primaryColor}</span>
              </div>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 uppercase font-bold">Secondary</label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="color"
                  value={editingTheme.secondaryColor}
                  onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                  className="w-7 h-7 rounded border border-slate-700 bg-transparent cursor-pointer"
                />
                <span className="text-[11px] text-slate-300 uppercase">{editingTheme.secondaryColor}</span>
              </div>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 uppercase font-bold">Accent Neon</label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="color"
                  value={editingTheme.accentColor}
                  onChange={(e) => handleColorChange('accentColor', e.target.value)}
                  className="w-7 h-7 rounded border border-slate-700 bg-transparent cursor-pointer"
                />
                <span className="text-[11px] text-slate-300 uppercase">{editingTheme.accentColor}</span>
              </div>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 uppercase font-bold">Canvas Background</label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="color"
                  value={editingTheme.bgBase}
                  onChange={(e) => handleColorChange('bgBase', e.target.value)}
                  className="w-7 h-7 rounded border border-slate-700 bg-transparent cursor-pointer"
                />
                <span className="text-[11px] text-slate-300 uppercase">{editingTheme.bgBase}</span>
              </div>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 uppercase font-bold">Text Primary</label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="color"
                  value={editingTheme.textBase}
                  onChange={(e) => handleColorChange('textBase', e.target.value)}
                  className="w-7 h-7 rounded border border-slate-700 bg-transparent cursor-pointer"
                />
                <span className="text-[11px] text-slate-300 uppercase">{editingTheme.textBase}</span>
              </div>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 uppercase font-bold">Glow Intensity</label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="range"
                  min="0.2"
                  max="1.0"
                  step="0.05"
                  value={editingTheme.glowIntensity}
                  onChange={(e) => handleColorChange('glowIntensity', Number(e.target.value))}
                  className="w-full accent-sky-400 cursor-pointer"
                />
                <span className="text-[10px] text-slate-300">{Math.round(editingTheme.glowIntensity * 100)}%</span>
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">Updates applied live to your interface.</span>
            <button
              onClick={() => {
                sounds.playSuccessTone();
                onUpdateCustomTheme(editingTheme);
              }}
              className="px-4 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-xs font-bold text-white transition-all shadow"
            >
              Apply Theme
            </button>
          </div>
        </div>

        {/* Live Preview Canvas */}
        <div
          className="p-6 rounded-xl border flex flex-col justify-center items-center text-center relative overflow-hidden transition-all duration-300"
          style={{
            backgroundColor: editingTheme.bgBase,
            borderColor: editingTheme.panelBorder,
            boxShadow: `0 8px 30px ${editingTheme.glowColor}`,
          }}
        >
          {/* Sample Card */}
          <div
            className="p-4 rounded-xl border max-w-sm w-full transition-all"
            style={{
              backgroundColor: editingTheme.panelBg,
              borderColor: editingTheme.panelBorder,
              boxShadow: `0 4px 20px ${editingTheme.glowColor}`,
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className="text-xs font-bold uppercase tracking-widest font-mono"
                style={{ color: editingTheme.primaryColor }}
              >
                ◉ ROBIN JARVIS PREVIEW
              </span>
              <span
                className="w-2 h-2 rounded-full animate-ping"
                style={{ backgroundColor: editingTheme.accentColor }}
              />
            </div>
            <p className="text-xs mb-3 font-mono" style={{ color: editingTheme.textBase }}>
              Command Center theme visual preview. Observe typography contrast, glass translucency, and edge illumination.
            </p>
            <div className="flex items-center justify-center gap-2">
              <button
                className="px-3 py-1 rounded text-xs font-bold font-mono transition-all"
                style={{
                  backgroundColor: editingTheme.primaryColor,
                  color: '#000000',
                  boxShadow: `0 0 12px ${editingTheme.primaryColor}80`,
                }}
              >
                Execute
              </button>
              <button
                className="px-3 py-1 rounded text-xs font-mono border"
                style={{
                  borderColor: editingTheme.panelBorder,
                  color: editingTheme.textBase,
                }}
              >
                Secondary
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
