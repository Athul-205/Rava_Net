import React from 'react';
import { X, Mic, Lightbulb, HelpCircle, Flame, CheckCircle, Sparkles } from 'lucide-react';
import { sound } from '../utils/sound';

interface PitchDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PitchDeckModal: React.FC<PitchDeckModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="pitch-deck-modal-overlay"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md p-3 sm:p-6"
    >
      <div className="min-h-full flex items-center justify-center py-6 sm:py-8">
        <div className="relative w-full max-w-3xl bg-neutral-950 border-2 border-amber-500/60 rounded-3xl p-6 sm:p-8 shadow-2xl my-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase text-amber-400">
                TinkerHub Useless Projects • Team Nexa
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                🌾 Deadpan Stage Pitch Guide & Delivery Tips
              </h3>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playKeyClick();
              onClose();
            }}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6 text-sm text-neutral-300 font-sans">
          {/* Pitch Card: Core Principle */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
            <div className="flex items-center gap-2 text-amber-400 font-bold font-mono text-xs mb-1">
              <Flame className="w-4 h-4" />
              <span>THE GOLDEN RULE OF DEADPAN COMEDY</span>
            </div>
            <p className="text-neutral-200 text-xs sm:text-sm leading-relaxed">
              <strong>Total confidence, zero substance.</strong> Present completely deadpan with a serious startup-pitch tone. Never smile or break character on stage. The audience does the laughing, not the founders.
            </p>
          </div>

          {/* Problem & Solution */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-2">
              <div className="text-xs font-mono font-bold text-rose-400 uppercase">
                Problem Statement
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                &ldquo;Every day, millions of Malayali households cook rava upma, rava kesari, and rava dosa — yet not a single person on Earth knows <em>exactly</em> how many rava particles are in their vessel. This silent crisis has gone unaddressed for generations.&rdquo;
              </p>
            </div>

            <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-2">
              <div className="text-xs font-mono font-bold text-emerald-400 uppercase">
                Our Solution
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                &ldquo;RavaNet™ uses cutting-edge Kaali-Theta Vision Algorithms™ to analyze any photo of rava and instantly estimate particle count with unwavering (fake) confidence — because uncertainty has no place in the kitchen.&rdquo;
              </p>
            </div>
          </div>

          {/* Innovation Highlights */}
          <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-3">
            <div className="text-xs font-mono font-bold text-amber-400 uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Proprietary Innovation Highlights</span>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-neutral-300">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Patent-pending Rava Diffusion Coefficient™</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Ammachi Dataset v2.1 (0 real data)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Backward-progress-bar technology</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Emotional-support error messages</span>
              </li>
            </ul>
          </div>

          {/* Judges Q&A One-Liners */}
          <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-3">
            <div className="text-xs font-mono font-bold text-cyan-400 uppercase flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Ready-To-Fire Judges Q&amp;A Zingers</span>
            </div>
            <div className="space-y-2.5 text-xs">
              <div className="p-2.5 rounded bg-black/60 border border-neutral-800">
                <div className="text-neutral-400 font-mono">Q: &ldquo;How accurate is this really?&rdquo;</div>
                <div className="text-amber-300 font-semibold mt-1">
                  A: &ldquo;Our accuracy is 98.7%, give or take 4,000 particles — industry standard.&rdquo;
                </div>
              </div>
              <div className="p-2.5 rounded bg-black/60 border border-neutral-800">
                <div className="text-neutral-400 font-mono">Q: &ldquo;What is your monetization model?&rdquo;</div>
                <div className="text-emerald-300 font-semibold mt-1">
                  A: &ldquo;Freemium. Free to feel confident, premium to actually be right.&rdquo;
                </div>
              </div>
              <div className="p-2.5 rounded bg-black/60 border border-neutral-800">
                <div className="text-neutral-400 font-mono">Q: &ldquo;Can someone verify the count?&rdquo;</div>
                <div className="text-rose-300 font-semibold mt-1">
                  A: &ldquo;നിനക്ക് correct ariyanam enkil kuthi erunu angu ennu.&rdquo;
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-neutral-800 flex justify-end">
          <button
            onClick={() => {
              sound.playKeyClick();
              onClose();
            }}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold font-mono text-xs transition-colors"
          >
            Ready to Demo
          </button>
        </div>
        </div>
      </div>
    </div>
  );
};
