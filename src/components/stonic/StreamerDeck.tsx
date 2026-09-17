import React, { useState } from 'react';
import { Tv, Play, Pause, SkipForward, Volume2, VolumeX, Flame, Monitor, Gamepad2, Code, MessageCircle, Clock, Sparkles, Check } from 'lucide-react';
import { ThemeConfig } from '../../types';
import { sounds } from '../../services/soundEffects';

interface StreamerDeckProps {
  currentTheme: ThemeConfig;
  onExecuteCommand?: (cmd: string) => void;
}

export const StreamerDeck: React.FC<StreamerDeckProps> = ({
  currentTheme,
  onExecuteCommand,
}) => {
  const [activeScene, setActiveScene] = useState<string>('GAMING');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentTrack, setCurrentTrack] = useState<string>('AC/DC - Back In Black (Stark Lab Mix)');
  const [isMicMuted, setIsMicMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(75);
  const [turboActive, setTurboActive] = useState<boolean>(false);

  const scenes = [
    { id: 'GAMING', name: 'Main Game', icon: <Gamepad2 className="w-4 h-4" /> },
    { id: 'CHAT', name: 'Just Chatting', icon: <MessageCircle className="w-4 h-4" /> },
    { id: 'CODE', name: 'Dev & Coding', icon: <Code className="w-4 h-4" /> },
    { id: 'BRB', name: 'Be Right Back', icon: <Clock className="w-4 h-4" /> },
  ];

  const handleTurboBoost = () => {
    sounds.playWakeChime();
    setTurboActive(true);
    onExecuteCommand?.('Execute Windows PC Turbo Boost: Purge standby RAM & set high priority');
    setTimeout(() => {
      setTurboActive(false);
    }, 4000);
  };

  return (
    <div
      id="stonic-streamer-deck"
      className="p-4 md:p-6 rounded-2xl border transition-all duration-300 font-mono space-y-4 select-none"
      style={{
        backgroundColor: currentTheme.panelBg,
        borderColor: currentTheme.panelBorder,
        boxShadow: `0 8px 32px rgba(236,72,153,0.12)`,
      }}
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-pink-950/80 text-pink-400 border border-pink-500/40">
            <Tv className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-wider">
                STREAMER & PC CONTROL DECK
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 font-bold border border-pink-500/40">
                BROADCAST READY
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Voice-triggered OBS scene transitions, background audio mixing, and Windows turbo optimization
            </p>
          </div>
        </div>

        {/* Turbo Optimization Button */}
        <button
          onClick={handleTurboBoost}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
            turboActive
              ? 'bg-rose-600 text-white shadow-[0_0_16px_rgba(244,63,94,0.5)] animate-pulse'
              : 'bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-600/50'
          }`}
        >
          <Flame className="w-4 h-4 text-rose-400" />
          <span>{turboActive ? 'TURBO ACTIVE (RAM PURGED)' : 'PC TURBO BOOST'}</span>
        </button>
      </div>

      {/* Grid of Deck Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* OBS Scene Switcher */}
        <div className="lg:col-span-6 p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Monitor className="w-4 h-4 text-pink-400" />
              <span>OBS Studio Scene Switcher</span>
            </span>
            <span className="text-[10px] text-emerald-400 font-bold">● WEBSOCKET CONNECTED</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {scenes.map((scene) => {
              const isActive = activeScene === scene.id;
              return (
                <button
                  key={scene.id}
                  onClick={() => {
                    sounds.playClick();
                    setActiveScene(scene.id);
                    onExecuteCommand?.(`Switch OBS Scene to ${scene.name}`);
                  }}
                  className={`p-3 rounded-lg border text-left transition-all flex items-center justify-between ${
                    isActive
                      ? 'bg-pink-500/20 text-pink-300 border-pink-500/50 shadow-[0_0_12px_rgba(236,72,153,0.3)]'
                      : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {scene.icon}
                    <span className="text-xs font-bold">{scene.name}</span>
                  </div>
                  {isActive && <Check className="w-3.5 h-3.5 text-pink-400" />}
                </button>
              );
            })}
          </div>

          <p className="text-[10px] text-slate-500">
            Tip: You can say &quot;Hey Jarvis, switch to Just Chatting scene&quot; to change scenes hands-free.
          </p>
        </div>

        {/* Audio & Media Player Deck */}
        <div className="lg:col-span-6 p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-cyan-400" />
              <span>Media Playback & Audio Deck</span>
            </span>
            <button
              onClick={() => {
                sounds.playClick();
                setIsMicMuted(!isMicMuted);
              }}
              className={`text-[10px] px-2 py-0.5 rounded font-bold transition-colors ${
                isMicMuted ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-slate-800 text-slate-300'
              }`}
            >
              {isMicMuted ? 'STREAM MIC MUTED' : 'STREAM MIC LIVE'}
            </button>
          </div>

          {/* Current Playing Track Box */}
          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div className="min-w-0 pr-2">
              <span className="text-[9px] text-slate-500 uppercase font-bold block">NOW PLAYING:</span>
              <span className="text-xs text-cyan-300 font-bold truncate block">{currentTrack}</span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => {
                  sounds.playClick();
                  setIsPlaying(!isPlaying);
                }}
                className="p-1.5 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white transition-colors"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => {
                  sounds.playClick();
                  setCurrentTrack('Hans Zimmer - Driving With The Top Down (Iron Man OST)');
                }}
                className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="Next Track"
              >
                <SkipForward className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Volume Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Master Volume:</span>
              <span className="text-cyan-300 font-bold">{volume}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
