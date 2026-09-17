import React, { useState } from 'react';
import {
  Settings,
  Mic,
  Cpu,
  Shield,
  Palette,
  Keyboard,
  Power,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Volume2,
  HardDrive,
  Globe,
  Sliders,
  Play,
  X,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { ThemeConfig, VoicePersonality, SupportedLanguage } from '../../types';
import { PRESET_THEMES } from '../../data/initialState';
import { sounds } from '../../services/soundEffects';
import { SUPPORTED_LANGUAGES, getLanguageConfig } from '../../data/languages';

interface SettingsWizardViewProps {
  currentTheme: ThemeConfig;
  personality: VoicePersonality;
  onPersonalityChange: (p: VoicePersonality) => void;
  language: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  onSelectTheme: (id: string) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onResetToDefaults: () => void;
}

export const SettingsWizardView: React.FC<SettingsWizardViewProps> = ({
  currentTheme,
  personality,
  onPersonalityChange,
  language,
  onLanguageChange,
  onSelectTheme,
  soundEnabled,
  onToggleSound,
  onResetToDefaults,
}) => {
  const [activeSettingsTab, setActiveSettingsTab] = useState<string>('general');
  const [wakeWord, setWakeWord] = useState('Robin');
  const [voiceRate, setVoiceRate] = useState(1.0);
  const [voicePitch, setVoicePitch] = useState(1.0);
  const [emergencyHotkey, setEmergencyHotkey] = useState('Ctrl+Shift+Esc');
  const [commandPaletteHotkey, setCommandPaletteHotkey] = useState('Ctrl+Space');
  const [startWithWindows, setStartWithWindows] = useState(true);
  const [minimizeToTray, setMinimizeToTray] = useState(true);
  const [aiProvider, setAiProvider] = useState('gemini');

  // First run wizard modal state
  const [showWizard, setShowWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);

  const testMicFeedback = () => {
    sounds.playWakeChime();
    if ('speechSynthesis' in window) {
      const utter = new SpeechSynthesisUtterance('ROBIN voice and audio subsystems are fully operational.');
      window.speechSynthesis.speak(utter);
    }
  };

  const navSettingsTabs = [
    { id: 'general', label: 'General & Startup', icon: <Settings className="w-4 h-4" /> },
    { id: 'voice', label: 'Voice & Wake Word', icon: <Mic className="w-4 h-4" /> },
    { id: 'ai', label: 'AI Intelligence & Models', icon: <Cpu className="w-4 h-4" /> },
    { id: 'pc', label: 'PC Control & Windows', icon: <Sliders className="w-4 h-4" /> },
    { id: 'security', label: 'Security & Safety Gate', icon: <Shield className="w-4 h-4" /> },
    { id: 'hotkeys', label: 'Global Hotkeys', icon: <Keyboard className="w-4 h-4" /> },
  ];

  return (
    <div id="view-settings-wizard" className="space-y-4 max-w-7xl mx-auto font-mono text-slate-200">
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
            <Settings className="w-5 h-5 text-sky-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              SYSTEM SETTINGS & CONFIGURATION
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Fine-tune wake word detection, synthesis voice pitch, safety confirmation policies, and Windows startup preferences.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-launch-setup-wizard"
            onClick={() => {
              sounds.playClick();
              setWizardStep(1);
              setShowWizard(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-xs font-bold text-white transition-all shadow"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Launch First-Run Setup Wizard</span>
          </button>
        </div>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Left: Tab Menu */}
        <div
          className="p-3 rounded-xl border space-y-1"
          style={{
            backgroundColor: currentTheme.panelBg,
            borderColor: currentTheme.panelBorder,
          }}
        >
          {navSettingsTabs.map((tab) => {
            const isActive = activeSettingsTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  sounds.playClick();
                  setActiveSettingsTab(tab.id);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-all text-left ${
                  isActive ? 'bg-sky-600 text-white shadow' : 'text-slate-400 hover:text-white hover:bg-slate-850'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}

          <div className="pt-4 mt-4 border-t border-slate-800">
            <button
              onClick={() => {
                sounds.playClick();
                if (confirm('Reset all ROBIN preferences to factory defaults?')) {
                  onResetToDefaults();
                }
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-rose-400 hover:bg-rose-950/40 border border-rose-900/60 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Defaults</span>
            </button>
          </div>
        </div>

        {/* Right: Tab Panel */}
        <div
          className="md:col-span-3 p-5 rounded-xl border space-y-4"
          style={{
            backgroundColor: currentTheme.panelBg,
            borderColor: currentTheme.panelBorder,
          }}
        >
          {activeSettingsTab === 'general' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white border-b pb-2" style={{ borderColor: currentTheme.panelBorder }}>
                General Windows Integration
              </h3>

              <div className="space-y-3 text-xs">
                <label className="flex items-center justify-between p-3 rounded-lg bg-black/40 border border-slate-800 cursor-pointer">
                  <div>
                    <div className="font-bold text-white">Start ROBIN automatically with Windows</div>
                    <div className="text-[11px] text-slate-400">Launch in background minimized to system tray on Windows login.</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={startWithWindows}
                    onChange={(e) => setStartWithWindows(e.target.checked)}
                    className="accent-sky-400 w-4 h-4 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-lg bg-black/40 border border-slate-800 cursor-pointer">
                  <div>
                    <div className="font-bold text-white">Minimize to System Notification Tray</div>
                    <div className="text-[11px] text-slate-400">Closing the window sends ROBIN to Windows notification tray instead of quitting.</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={minimizeToTray}
                    onChange={(e) => setMinimizeToTray(e.target.checked)}
                    className="accent-sky-400 w-4 h-4 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-lg bg-black/40 border border-slate-800 cursor-pointer">
                  <div>
                    <div className="font-bold text-white">Synthesized Audio Chimes & Feedback</div>
                    <div className="text-[11px] text-slate-400">Play sci-fi sonic feedback for wake chime, command execution, and errors.</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={soundEnabled}
                    onChange={onToggleSound}
                    className="accent-sky-400 w-4 h-4 cursor-pointer"
                  />
                </label>
              </div>
            </div>
          )}

          {activeSettingsTab === 'voice' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white border-b pb-2" style={{ borderColor: currentTheme.panelBorder }}>
                Voice Input & Audio Synthesis
              </h3>

              <div className="space-y-3 text-xs">
                {/* Multi-language Voice Configuration */}
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold flex items-center justify-between">
                    <span>Command & Voice Language</span>
                    <span className="text-sky-400 font-normal">Hindi, English, Urdu</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-1.5">
                    {SUPPORTED_LANGUAGES.map((l) => {
                      const isSelected = language === l.code;
                      return (
                        <button
                          key={l.code}
                          id={`btn-settings-lang-${l.code}`}
                          onClick={() => {
                            sounds.playClick();
                            onLanguageChange(l.code);
                          }}
                          className={`p-3 rounded-lg border text-left transition-all ${
                            isSelected
                              ? 'bg-sky-600/30 border-sky-400 text-white shadow-[0_0_12px_rgba(56,189,248,0.25)]'
                              : 'bg-black/40 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-base">{l.flag}</span>
                            <div>
                              <div className="font-bold text-xs text-white">{l.name}</div>
                              <div className="text-[10px] text-sky-300 font-mono">{l.nativeName}</div>
                            </div>
                          </div>
                          <div className="text-[10px] text-slate-400 mt-2 truncate">
                            Wake: &ldquo;{l.wakeWords[0]}&rdquo;
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold">Active Wake Word</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-1.5">
                    {['Robin', 'Jarvis', 'Nova', 'Computer'].map((w) => (
                      <button
                        key={w}
                        onClick={() => {
                          sounds.playClick();
                          setWakeWord(w);
                        }}
                        className={`p-2.5 rounded-lg border text-xs font-bold transition-all ${
                          wakeWord === w
                            ? 'bg-sky-600 text-white border-sky-400'
                            : 'bg-black/40 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold">Personality & Tone</label>
                  <select
                    value={personality}
                    onChange={(e) => onPersonalityChange(e.target.value as VoicePersonality)}
                    className="w-full mt-1 bg-black/50 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white outline-none"
                  >
                    <option value="Professional">Professional — Direct, concise, no conversational filler</option>
                    <option value="Futuristic">Futuristic — Sci-fi JARVIS style HUD responses</option>
                    <option value="Executive">Executive — High-level summaries for leadership</option>
                    <option value="Friendly">Friendly — Warm, engaging, supportive</option>
                    <option value="Technical">Technical — Precise parameters, return codes & specs</option>
                    <option value="Calm">Calm — Measured, relaxed cadence</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase font-bold">Speech Rate ({voiceRate}x)</label>
                    <input
                      type="range"
                      min="0.7"
                      max="1.5"
                      step="0.1"
                      value={voiceRate}
                      onChange={(e) => setVoiceRate(Number(e.target.value))}
                      className="w-full mt-1 accent-sky-400 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase font-bold">Pitch Scale ({voicePitch}x)</label>
                    <input
                      type="range"
                      min="0.5"
                      max="1.5"
                      step="0.1"
                      value={voicePitch}
                      onChange={(e) => setVoicePitch(Number(e.target.value))}
                      className="w-full mt-1 accent-sky-400 cursor-pointer"
                    />
                  </div>
                </div>

                <button
                  onClick={testMicFeedback}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold transition-all shadow"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Test Voice Engine Audio Output</span>
                </button>
              </div>
            </div>
          )}

          {activeSettingsTab === 'ai' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white border-b pb-2" style={{ borderColor: currentTheme.panelBorder }}>
                AI Intelligence & Model Provider
              </h3>

              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { id: 'gemini', name: 'Google Gemini 3.8 Flash', desc: 'Default server-side cloud reasoning engine with multimodal parsing.' },
                    { id: 'local', name: 'Local Ollama / Llama 3', desc: 'Zero cloud latency, offline privacy-focused execution.' },
                    { id: 'openai', name: 'OpenAI GPT-4o', desc: 'Advanced code generation and tool calling framework.' },
                    { id: 'claude', name: 'Anthropic Claude 3.5 Sonnet', desc: 'Complex reasoning and document compilation agent.' },
                  ].map((prov) => (
                    <div
                      key={prov.id}
                      onClick={() => {
                        sounds.playClick();
                        setAiProvider(prov.id);
                      }}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        aiProvider === prov.id
                          ? 'bg-sky-500/15 border-sky-500/60 text-white'
                          : 'bg-black/40 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="font-bold text-xs text-white mb-0.5">{prov.name}</div>
                      <div className="text-[11px] text-slate-400 leading-relaxed">{prov.desc}</div>
                    </div>
                  ))}
                </div>

                <div className="p-3 rounded-lg bg-black/40 border border-slate-800 text-[11px] text-slate-300">
                  <span>Active Architecture: </span>
                  <span className="text-emerald-400 font-bold">Hybrid Local-First + Server Gemini Proxy</span>
                </div>
              </div>
            </div>
          )}

          {activeSettingsTab === 'hotkeys' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white border-b pb-2" style={{ borderColor: currentTheme.panelBorder }}>
                System-Wide Global Hotkeys
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-3 rounded-lg bg-black/40 border border-slate-800">
                  <div>
                    <div className="font-bold text-white">Emergency Stop All Automation</div>
                    <div className="text-[11px] text-slate-400">Instantly stops keyboard/mouse macros, browser tasks, and execution loops.</div>
                  </div>
                  <kbd className="px-2.5 py-1 rounded bg-rose-950 border border-rose-800 text-rose-300 font-bold">
                    {emergencyHotkey}
                  </kbd>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-black/40 border border-slate-800">
                  <div>
                    <div className="font-bold text-white">Toggle Command Center Slide Palette</div>
                    <div className="text-[11px] text-slate-400">Pops up the futuristic natural-language query bar anywhere on Windows.</div>
                  </div>
                  <kbd className="px-2.5 py-1 rounded bg-sky-950 border border-sky-800 text-sky-300 font-bold">
                    {commandPaletteHotkey}
                  </kbd>
                </div>
              </div>
            </div>
          )}

          {activeSettingsTab === 'pc' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white border-b pb-2" style={{ borderColor: currentTheme.panelBorder }}>
                Windows PC Subsystem Settings
              </h3>
              <div className="space-y-2 text-xs text-slate-300">
                <div className="p-3 rounded-lg bg-black/40 border border-slate-800 flex justify-between items-center">
                  <span>Window Snapping Layout Default:</span>
                  <span className="text-sky-300 font-bold">50/50 Dual Split</span>
                </div>
                <div className="p-3 rounded-lg bg-black/40 border border-slate-800 flex justify-between items-center">
                  <span>Browser Automation Engine:</span>
                  <span className="text-emerald-400 font-bold">Playwright Chromium (Headed/Headless)</span>
                </div>
                <div className="p-3 rounded-lg bg-black/40 border border-slate-800 flex justify-between items-center">
                  <span>PyAutoGUI Safety Failsafe:</span>
                  <span className="text-emerald-400 font-bold">Active (Corner Abort Armed)</span>
                </div>
              </div>
            </div>
          )}

          {activeSettingsTab === 'security' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white border-b pb-2" style={{ borderColor: currentTheme.panelBorder }}>
                Security & Risk Gate Policy
              </h3>
              <div className="p-3 rounded-lg bg-black/40 border border-slate-800 space-y-2 text-xs">
                <div className="font-bold text-white">Zero-Silent-Destruction Guarantee</div>
                <p className="text-slate-400 leading-relaxed">
                  ROBIN will NEVER delete folders, terminate core Windows system services, or clear databases without explicitly displaying a confirmation dialog with full risk breakdown.
                </p>
                <div className="text-emerald-400 font-bold flex items-center gap-1.5 mt-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Security Gate Armed & Operational</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 10-Step First Run Setup Wizard Modal */}
      {showWizard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div
            className="w-full max-w-xl rounded-2xl border p-6 shadow-2xl font-mono text-slate-200"
            style={{
              backgroundColor: currentTheme.panelBg,
              borderColor: currentTheme.panelBorder,
              boxShadow: `0 20px 60px ${currentTheme.glowColor}`,
            }}
          >
            <div className="flex items-center justify-between border-b pb-3 mb-4" style={{ borderColor: currentTheme.panelBorder }}>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-sky-400" />
                <h3 className="text-sm font-bold text-white uppercase">
                  FIRST-RUN SETUP WIZARD ({wizardStep}/10)
                </h3>
              </div>
              <button
                onClick={() => setShowWizard(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Step Content */}
            <div className="min-h-[220px] flex flex-col justify-center">
              {wizardStep === 1 && (
                <div className="text-center space-y-2">
                  <h4 className="text-lg font-bold text-white">Welcome to ROBIN JARVIS AI</h4>
                  <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                    Your personal Windows desktop command center. Let&apos;s configure your voice triggers, personality, themes, and security gates in 60 seconds.
                  </p>
                </div>
              )}

              {wizardStep === 2 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase text-white">Step 2: Choose Language & Wake Word</h4>
                  <p className="text-xs text-slate-400">Select your preferred voice recognition language.</p>
                  <div className="grid grid-cols-3 gap-2">
                    {SUPPORTED_LANGUAGES.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => {
                          sounds.playClick();
                          onLanguageChange(l.code);
                        }}
                        className={`p-2.5 rounded-lg border text-center transition-all ${
                          language === l.code ? 'bg-sky-600/30 border-sky-400 text-white' : 'bg-black/40 border-slate-800 text-slate-400'
                        }`}
                      >
                        <div className="text-base">{l.flag}</div>
                        <div className="text-xs font-bold text-white">{l.name}</div>
                        <div className="text-[10px] text-sky-300">{l.nativeName}</div>
                      </button>
                    ))}
                  </div>

                  <p className="text-xs text-slate-400 pt-2">Choose primary wake word:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {['Robin', 'Jarvis', 'Nova', 'Computer'].map((w) => (
                      <button
                        key={w}
                        onClick={() => setWakeWord(w)}
                        className={`p-2.5 rounded-lg border text-xs font-bold ${
                          wakeWord === w ? 'bg-sky-600 text-white border-sky-400' : 'bg-black/40 border-slate-800 text-slate-400'
                        }`}
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {wizardStep === 3 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase text-white">Step 3: Test Audio Engine</h4>
                  <p className="text-xs text-slate-400">Verify audio speech synthesis.</p>
                  <button
                    onClick={testMicFeedback}
                    className="w-full py-3 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs"
                  >
                    Play Test Chime & Voice Greeting
                  </button>
                </div>
              )}

              {wizardStep === 4 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase text-white">Step 4: Choose Voice Personality</h4>
                  <select
                    value={personality}
                    onChange={(e) => onPersonalityChange(e.target.value as VoicePersonality)}
                    className="w-full bg-black/50 border border-slate-700 rounded-lg p-2.5 text-xs text-white"
                  >
                    <option value="Professional">Professional</option>
                    <option value="Futuristic">Futuristic</option>
                    <option value="Executive">Executive</option>
                    <option value="Friendly">Friendly</option>
                  </select>
                </div>
              )}

              {wizardStep === 5 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase text-white">Step 5: AI Model Provider</h4>
                  <p className="text-xs text-slate-400">Select default intelligence engine.</p>
                  <div className="p-3 rounded-lg bg-sky-600/20 border border-sky-500/40 text-xs text-sky-300 font-bold">
                    ✓ Google Gemini 3.8 Flash (Server-Side Proxy Connected)
                  </div>
                </div>
              )}

              {wizardStep === 6 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase text-white">Step 6: Default Windows Browser</h4>
                  <div className="p-3 rounded-lg bg-black/40 border border-slate-800 text-xs text-slate-300">
                    Google Chrome / Chromium Playwright instance registered.
                  </div>
                </div>
              )}

              {wizardStep === 7 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase text-white">Step 7: Choose Interface Theme</h4>
                  <div className="grid grid-cols-4 gap-2">
                    {PRESET_THEMES.slice(0, 4).map((t) => (
                      <button
                        key={t.id}
                        onClick={() => onSelectTheme(t.id)}
                        className={`p-2 rounded border text-[11px] font-bold ${
                          currentTheme.id === t.id ? 'border-sky-400 bg-sky-500/20' : 'border-slate-800'
                        }`}
                      >
                        {t.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {wizardStep === 8 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase text-white">Step 8: Set Emergency Stop Hotkey</h4>
                  <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800 text-xs text-rose-300 flex justify-between items-center">
                    <span>Universal Abort Shortcut:</span>
                    <kbd className="font-bold">Ctrl + Shift + Esc</kbd>
                  </div>
                </div>
              )}

              {wizardStep === 9 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase text-white">Step 9: Microphone Permissions</h4>
                  <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800 text-xs text-emerald-300">
                    ✓ Browser audio & speech recognition initialized.
                  </div>
                </div>
              )}

              {wizardStep === 10 && (
                <div className="text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto animate-bounce" />
                  <h4 className="text-base font-bold text-white">ROBIN is Ready to Command</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Say &ldquo;{wakeWord}&rdquo; or press <kbd className="text-sky-300 font-bold">Ctrl + Space</kbd> to launch your first command.
                  </p>
                </div>
              )}
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between border-t pt-3 mt-4" style={{ borderColor: currentTheme.panelBorder }}>
              <button
                onClick={() => setWizardStep((s) => Math.max(1, s - 1))}
                disabled={wizardStep === 1}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-white disabled:opacity-30"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              {wizardStep < 10 ? (
                <button
                  onClick={() => setWizardStep((s) => Math.min(10, s + 1))}
                  className="flex items-center gap-1 px-4 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold"
                >
                  <span>Next</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    sounds.playSuccessTone();
                    setShowWizard(false);
                  }}
                  className="px-5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                >
                  Finish & Launch ROBIN
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
