import React, { useState } from 'react';
import { Volume2, VolumeX, Sparkles, FileText, Cpu, ShieldCheck } from 'lucide-react';
import { sound } from '../utils/sound';

interface NavbarProps {
  onLogoClick: () => void;
  logoClickCount: number;
  onOpenPitch: () => void;
  isUltraMode: boolean;
  onToggleUltra: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onLogoClick,
  logoClickCount,
  onOpenPitch,
  isUltraMode,
  onToggleUltra,
}) => {
  const [soundMuted, setSoundMuted] = useState(!sound.enabled);

  const toggleSound = () => {
    sound.enabled = !sound.enabled;
    setSoundMuted(!sound.enabled);
    if (sound.enabled) {
      sound.playKeyClick();
    }
  };

  return (
    <header className="w-full border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo with 5x Easter Egg */}
        <div className="flex items-center gap-3">
          <button
            id="ravanet-logo-btn"
            onClick={onLogoClick}
            className="group flex items-center gap-2.5 text-left focus:outline-none transition-transform active:scale-95"
            title="Click 5 times for classified research notes"
          >
            <span className="text-2xl p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 group-hover:border-amber-500/50 transition-colors">
              🌾
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-white flex items-center">
                  RavaNet<span className="text-amber-400">™</span>
                </span>
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  v3.1
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 font-mono hidden sm:block">
                Kaali-Theta Particle Vision
              </p>
            </div>
          </button>

          {logoClickCount > 0 && logoClickCount < 5 && (
            <span className="text-[10px] font-mono text-amber-400/80 animate-pulse hidden md:inline">
              [{5 - logoClickCount} clicks to classified vault]
            </span>
          )}
        </div>

        {/* Status Pill & Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Fake Cloud Status Pill */}
          <div
            id="cloud-status-pill"
            className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-mono text-neutral-300 shadow-inner"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>RavaNet Cloud: <strong className="text-emerald-400 font-semibold">Online</strong> (probably)</span>
          </div>

          {/* Ultra Mode Secret Toggle */}
          <button
            id="ultra-mode-toggle-btn"
            onClick={onToggleUltra}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              isUltraMode
                ? 'bg-amber-500 text-neutral-950 shadow-[0_0_15px_rgba(245,158,11,0.5)] font-bold'
                : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
            }`}
            title="Toggle Secret Ultra Mode (8M+ particles)"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{isUltraMode ? 'ULTRA ACTIVE' : 'Ultra Mode'}</span>
          </button>

          {/* Pitch Deck Drawer / Notes */}
          <button
            id="pitch-notes-btn"
            onClick={onOpenPitch}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-colors"
            title="View TinkerHub Useless Projects Pitch Guide"
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Pitch Notes</span>
          </button>

          {/* Audio Synthesizer Toggle */}
          <button
            id="audio-mute-toggle-btn"
            onClick={toggleSound}
            className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 transition-colors"
            title={soundMuted ? "Unmute sound effects" : "Mute sound effects"}
          >
            {soundMuted ? (
              <VolumeX className="w-4 h-4 text-neutral-500" />
            ) : (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
