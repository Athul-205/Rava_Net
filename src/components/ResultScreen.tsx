import React, { useState, useEffect } from 'react';
import { RefreshCw, Download, Award, Share2, Sparkles, TrendingUp, AlertCircle, ArrowLeft, Trophy, Target } from 'lucide-react';
import { FOOTNOTE_POOL, LEADERBOARD_DATA } from '../data/ravaData';
import { sound } from '../utils/sound';
import { triggerRavaConfetti } from '../utils/confetti';

interface ResultScreenProps {
  sampleName: string;
  imageUrl: string;
  isUltraMode: boolean;
  onRecalculate: (attempt: number, forcedCount?: number) => void;
  onReset: () => void;
  onOpenCertificate: (resultData: {
    particleCount: number;
    accuracy: string;
    sampleName: string;
    footnote: string;
  }) => void;
  recalculateCount?: number;
  forcedCount?: number | null;
}

interface EmotionalDrama {
  attempt: number;
  quote: string;
  englishTranslation: string;
  title: string;
  subtitle: string;
  theme: 'hurt' | 'cold' | 'crying' | 'rage';
  forcedCount?: number;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  sampleName,
  imageUrl,
  isUltraMode,
  onRecalculate,
  onReset,
  onOpenCertificate,
  recalculateCount = 0,
  forcedCount = null,
}) => {
  // Generate suspiciously specific 5-digit number or ultra-mode number
  const generateCount = (ultra: boolean) => {
    if (forcedCount) return forcedCount;
    if (ultra) {
      // Absurd number like 8,412,009
      return 8000000 + Math.floor(Math.random() * 900000) + Math.floor(Math.random() * 999);
    }
    // Suspiciously specific 5-digit range (14,000 to 18,999), never ending in 00
    const base = 14000 + Math.floor(Math.random() * 4800);
    const suffix = Math.floor(Math.random() * 89) + 11; // Ensure non-zero ending
    return base + suffix;
  };

  const [particleCount, setParticleCount] = useState<number>(() => {
    if (forcedCount) return forcedCount;
    return generateCount(isUltraMode);
  });
  const [displayedCount, setDisplayedCount] = useState<number>(0);
  const [isSpinning, setIsSpinning] = useState<boolean>(true);
  const [footnoteIndex, setFootnoteIndex] = useState<number>(0);
  const [copiedShare, setCopiedShare] = useState<boolean>(false);
  const [showExactComment, setShowExactComment] = useState<boolean>(false);
  const [isPlayingEnnu, setIsPlayingEnnu] = useState<boolean>(false);
  const [manualGrainsCounted, setManualGrainsCounted] = useState<number>(0);

  // Emotional Guilt-Trip Drama state ("THE APP HAS FEELINGS" GAG)
  const [emotionalPrompt, setEmotionalPrompt] = useState<EmotionalDrama | null>(null);
  const [countdown, setCountdown] = useState<number>(3);

  // Sync forcedCount if passed (e.g. 99,999 on rage recount)
  useEffect(() => {
    if (forcedCount) {
      setParticleCount(forcedCount);
    }
  }, [forcedCount]);

  // Preload zero-latency celebration and ennu audio as soon as result screen appears
  useEffect(() => {
    sound.preloadYippee();
    sound.preloadEnnu();
  }, []);

  // Animate count-up or slot machine spin on mount / recalculate
  useEffect(() => {
    setIsSpinning(true);
    let start = 0;
    const target = particleCount;
    const duration = isUltraMode ? 2400 : 1600;
    const startTime = performance.now();

    const animateNumber = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);

      // Easing out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(target * ease);
      setDisplayedCount(current);

      if (elapsed % 80 < 20) {
        sound.playSlotTick();
      }

      if (progress < 1) {
        requestAnimationFrame(animateNumber);
      } else {
        setDisplayedCount(target);
        setIsSpinning(false);
        if (isUltraMode) {
          triggerRavaConfetti();
          sound.playConfettiBurst();
        }
      }
    };

    requestAnimationFrame(animateNumber);
  }, [particleCount, isUltraMode]);

  // Countdown and auto-reloading effect when emotional guilt-trip triggers
  useEffect(() => {
    if (!emotionalPrompt) return;

    const interval = window.setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          window.clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const timer = window.setTimeout(() => {
      proceedToRecalculate();
    }, 3200);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(timer);
    };
  }, [emotionalPrompt]);

  const proceedToRecalculate = () => {
    if (!emotionalPrompt) return;
    const { attempt, forcedCount: forced } = emotionalPrompt;
    setEmotionalPrompt(null);
    onRecalculate(attempt, forced);
  };

  const cancelEmotionalRecalculate = () => {
    sound.playKeyClick();
    setEmotionalPrompt(null);
  };

  // Recalculate click triggers "THE APP HAS FEELINGS" guilt-trip before reloading
  const handleRecalculateClick = () => {
    sound.playKeyClick();
    setShowExactComment(false);
    const nextAttempt = (recalculateCount || 0) + 1;

    let drama: EmotionalDrama;
    if (nextAttempt === 1) {
      sound.playHeartbreakChime();
      drama = {
        attempt: 1,
        quote: "Enne ninaku vishwasam illa alle 🥀😭",
        englishTranslation: "You don't trust me, right? 🥀😭",
        title: "💔 RAVANET™ IS DEEPLY HURT & OFFENDED",
        subtitle: "Ammachi Neural Net is taking this personally. Reloading calculation with a broken heart...",
        theme: 'hurt',
      };
    } else if (nextAttempt === 2) {
      sound.playWarningBlip();
      drama = {
        attempt: 2,
        quote: "Again? Okay. I see how it is.",
        englishTranslation: "Cold. Passive-aggressive. Zero warmth.",
        title: "🧊 PASSIVE-AGGRESSIVE MODE ENGAGED",
        subtitle: "RavaNet™ will recalculate every single grain again just to prove you wrong.",
        theme: 'cold',
      };
    } else if (nextAttempt === 3) {
      sound.playHeartbreakChime();
      drama = {
        attempt: 3,
        quote: "Recalculating for the 3rd time. RavaNet™ is not crying, you're crying.",
        englishTranslation: "Weeping into the kadai. Counting anyway.",
        title: "😭 CRITICAL EMOTIONAL DAMAGE DETECTED",
        subtitle: "Wiping tears from CMOS sensor. Recounting for the 3rd time...",
        theme: 'crying',
      };
    } else {
      sound.playAngrySlam();
      drama = {
        attempt: nextAttempt,
        quote: "Fine!! Here's 99,999 particles. Happy now?? 😤",
        englishTranslation: "Randomization rules shattered out of pure spite.",
        title: "😤 EMOTIONAL MELTDOWN // SPITE OVERFLOW",
        subtitle: "Physics engine bypassed. Dumping maximum semolina payload (99,999 particles).",
        theme: 'rage',
        forcedCount: 99999,
      };
    }

    setCountdown(3);
    setEmotionalPrompt(drama);
  };

  const handleWantCorrectCount = () => {
    // Play immediately in direct user gesture to ensure 100% browser autoplay permission
    sound.playEnnuAudio();
    setShowExactComment(true);
    setIsPlayingEnnu(true);
    setTimeout(() => setIsPlayingEnnu(false), 3300);
  };

  const handleReplayEnnu = () => {
    sound.playEnnuAudio();
    setIsPlayingEnnu(true);
    setTimeout(() => setIsPlayingEnnu(false), 3300);
  };

  const handleShareClick = () => {
    sound.playKeyClick();
    const shareText = `🌾 RavaNet™ AI just calculated my rava vessel at ${particleCount.toLocaleString()} particles with 98.7% accuracy! Ranjith only had 12,001. Flex accordingly.`;
    navigator.clipboard?.writeText(shareText);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 sm:py-12">
      {/* Return to upload bar */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onReset}
          className="flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Scan Another Vessel</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            id="celebrate-grains-btn"
            onMouseEnter={() => sound.preloadYippee()}
            onTouchStart={() => sound.preloadYippee()}
            onClick={() => {
              sound.playYippee();
              triggerRavaConfetti();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-mono transition-all active:scale-95 shadow-sm"
            title="Celebrate Grains! (YIPPEE! 🎉)"
          >
            <span>🌾 Celebrate Grains 🎉</span>
          </button>
        </div>
      </div>

      {/* Main Result Trophy Card */}
      <div className="bg-neutral-900/90 border-2 border-amber-500/40 rounded-3xl p-6 sm:p-10 shadow-[0_0_50px_rgba(245,158,11,0.15)] relative overflow-hidden backdrop-blur-xl">
        {/* Top Gold Ribbon Accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-amber-500 to-transparent h-1 w-3/4" />

        {/* Header Metadata */}
        <div className="text-center space-y-2 mb-8">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>OFFICIAL GRANULOMETRIC CERTIFICATION // BATCH VERIFIED</span>
            </div>

            {recalculateCount > 0 && (
              <div
                id="recount-indicator-tag"
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono border ${
                  recalculateCount === 1
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                    : recalculateCount === 2
                    ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
                    : recalculateCount === 3
                    ? 'bg-blue-500/10 border-blue-500/30 text-blue-300'
                    : 'bg-amber-500/20 border-amber-500 text-amber-300 animate-pulse'
                }`}
              >
                <span>
                  {recalculateCount === 1 && '🥀 Recount #1 (Questioned by user)'}
                  {recalculateCount === 2 && '🧊 Recount #2 (Passive-aggressive mode)'}
                  {recalculateCount === 3 && '😭 Recount #3 (Weeping tensor cores)'}
                  {recalculateCount >= 4 && '😤 Spite Recount (99,999 payload)'}
                </span>
              </div>
            )}
          </div>

          <h2 className="text-sm sm:text-base font-mono text-neutral-400 uppercase tracking-widest">
            {sampleName}
          </h2>
        </div>

        {/* Big Bold Headline Number (Approximate Values / Spite Overflow) */}
        <div className="text-center my-6 sm:my-8">
          {particleCount === 99999 ? (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/20 border border-red-500/50 text-xs font-mono text-red-300 uppercase tracking-wider mb-2 animate-bounce">
              <span>😤 SPITE VALUE: 99,999 PARTICLES</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-red-500/30 text-red-200 font-bold">
                RANGE BROKEN
              </span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-mono text-amber-400 uppercase tracking-wider mb-2">
              <span>≈ Approximate Particle Count</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold">
                ESTIMATED
              </span>
            </div>
          )}

          <div
            id="estimated-particles-display"
            className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-amber-200 to-amber-500 drop-shadow-sm select-all"
          >
            {particleCount === 99999 ? '99,999' : `~${displayedCount.toLocaleString()}`}
          </div>

          <div className="text-xs font-mono text-neutral-400 mt-1">
            {particleCount === 99999
              ? 'RavaNet™ broke its own randomization range because you asked 4+ times. Happy now?? 😤'
              : 'Displaying approximate values based on Kaali-Theta optical diffusion (± 4,000 margin)'}
          </div>

          {isUltraMode && particleCount !== 99999 && (
            <div className="inline-block mt-3 px-3 py-1 rounded bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-mono font-bold animate-pulse">
              ⚡ ULTRA SLOT OVERFLOW: 100% UNCHECKED SWAGGER
            </div>
          )}

          {/* Option: "i want correct count" */}
          <div className="mt-6 mb-2 flex flex-col items-center justify-center">
            <button
              id="want-correct-count-btn"
              onMouseEnter={() => sound.preloadEnnu()}
              onTouchStart={() => sound.preloadEnnu()}
              onClick={handleWantCorrectCount}
              className="group relative inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-amber-500/30 to-yellow-500/20 hover:from-amber-500/40 hover:to-yellow-500/40 text-amber-200 hover:text-white font-mono font-bold text-sm border-2 border-amber-500/70 shadow-[0_0_25px_rgba(245,158,11,0.25)] hover:shadow-[0_0_35px_rgba(245,158,11,0.45)] transition-all active:scale-95 cursor-pointer"
            >
              <Target className="w-4 h-4 text-amber-400 group-hover:rotate-90 transition-transform duration-300" />
              <span>i want correct count</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-400 text-neutral-950 font-bold uppercase tracking-wider ml-1">
                Zero Error
              </span>
            </button>
            <span className="text-[11px] font-mono text-neutral-400 mt-2">
              Unsatisfied with approximate count? Request 100% ground truth.
            </span>
          </div>

          {/* Comment displayed after pressing that button */}
          {showExactComment && (
            <div
              id="malayalam-punchline-box"
              className="mt-6 w-full max-w-2xl mx-auto p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-amber-950/95 via-red-950/70 to-neutral-950 border-2 border-amber-500 shadow-[0_0_50px_rgba(245,158,11,0.5)] text-center animate-in fade-in zoom-in-95 duration-300 relative overflow-hidden"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-mono font-bold border border-amber-500/40">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>OFFICIAL EXACT AUDIT RESULT // GROUND TRUTH</span>
                </div>

                <button
                  id="replay-ennu-audio-btn"
                  onClick={handleReplayEnnu}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold border transition-all active:scale-95 cursor-pointer ${
                    isPlayingEnnu
                      ? 'bg-rose-500 text-white border-rose-400 animate-pulse shadow-md shadow-rose-500/30'
                      : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border-amber-500/40'
                  }`}
                  title="Play audio again"
                >
                  <span className="text-sm">🔊</span>
                  <span>{isPlayingEnnu ? 'Audio Playing...' : 'Replay Audio'}</span>
                </button>
              </div>

              {/* Exact dialogue from user prompt */}
              <div className="text-2xl sm:text-3xl md:text-4xl font-black text-amber-200 leading-snug tracking-wide font-sans my-4 drop-shadow-lg">
                “നിനക്ക് correct ariyanam enkil kuthi erunu angu ennu.” 🌾
              </div>

              <div className="text-xs sm:text-sm font-mono text-neutral-300 italic mb-4">
                (English: &ldquo;If you want to know the correct count, go sit down and count it yourself!&rdquo;)
              </div>

              {/* Interactive Gag: "കുത്തിയിരുന്ന് എണ്ണൽ Simulator" */}
              <div className="mt-5 p-4 rounded-xl bg-black/60 border border-amber-500/30 text-left">
                <div className="flex items-center justify-between text-xs font-mono text-amber-400 mb-2">
                  <span>🌾 കുത്തിയിരുന്ന് എണ്ണൽ SIMULATOR (MANUAL MODE)</span>
                  <span>
                    {manualGrainsCounted} / {particleCount.toLocaleString()} GRAINS
                  </span>
                </div>
                <div className="w-full bg-neutral-900 rounded-full h-2 mb-3 overflow-hidden border border-neutral-800">
                  <div
                    className="bg-amber-400 h-full transition-all duration-200"
                    style={{
                      width: `${Math.max(1, (manualGrainsCounted / particleCount) * 100)}%`,
                    }}
                  />
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <button
                    onClick={() => {
                      sound.playKeyClick();
                      setManualGrainsCounted((prev) => prev + 1);
                    }}
                    className="w-full sm:w-auto px-4 py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 hover:text-white text-xs font-mono font-bold transition-all active:scale-95"
                  >
                    + Count Grain #{manualGrainsCounted + 1} Manually 👆
                  </button>
                  <span className="text-[11px] font-mono text-neutral-400 text-center sm:text-right">
                    {manualGrainsCounted === 0
                      ? `Estimated manual counting duration: 62 hours`
                      : `${(particleCount - manualGrainsCounted).toLocaleString()} grains left. Ammachi is unimpressed.`}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-800 flex flex-wrap items-center justify-center gap-3 text-xs font-mono text-amber-400/90">
                <span>🌾 Ammachi standard algorithm applied</span>
                <span>•</span>
                <span>Accuracy: 100% Unbothered</span>
                <span>•</span>
                <button
                  onClick={() => setShowExactComment(false)}
                  className="text-neutral-400 hover:text-neutral-200 underline text-xs cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Accuracy and Footnote Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8 pt-6 border-t border-neutral-800">
          {/* Fake Confidence Stat */}
          <div className="bg-neutral-950/70 p-4 rounded-xl border border-neutral-800">
            <div className="text-xs font-mono text-neutral-400 mb-1">
              ESTIMATED CONFIDENCE RATING
            </div>
            <div className="text-xl sm:text-2xl font-bold text-emerald-400 font-mono flex items-center gap-2">
              <span>{particleCount === 99999 ? 'Accuracy: 100% Petty (Zero Error)' : 'Accuracy: 98.7% ± 4,000'}</span>
            </div>
            <p className="text-[11px] text-neutral-500 mt-1">
              {particleCount === 99999
                ? 'Zero margin of error. User demanded recount 4+ times so physics gave up and dumped maximum value.'
                : 'Calculated via Kaali-Theta manifold. True count cannot be audited without ruining dinner.'}
            </p>
          </div>

          {/* Randomized Funny Footnote */}
          <div className="bg-neutral-950/70 p-4 rounded-xl border border-neutral-800 flex flex-col justify-between">
            <div>
              <div className="text-xs font-mono text-neutral-400 mb-1 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>OBSERVATIONAL FOOTNOTE</span>
              </div>
              <p
                id="result-funny-footnote"
                className="text-xs sm:text-sm italic text-amber-300/90 leading-relaxed font-mono"
              >
                &ldquo;
                {particleCount === 99999
                  ? 'Fine!! Here is 99,999 particles. Happy now?? 😤 RavaNet™ has emotionally checked out.'
                  : FOOTNOTE_POOL[footnoteIndex]}
                &rdquo;
              </p>
            </div>
            <span className="text-[10px] text-neutral-500 mt-2 font-mono">
              {particleCount === 99999 ? 'Verified by pure unadulterated spite' : 'Margin verified by vibes & Ammachi'}
            </span>
          </div>
        </div>

        {/* Action Buttons: Recalculate, Certificate, Share */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
          <button
            id="recalculate-btn"
            onClick={handleRecalculateClick}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-sm transition-all border border-neutral-700 active:scale-95"
            title="Recalculate (warning: RavaNet™ has feelings about being questioned)"
          >
            <RefreshCw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
            <span>{recalculateCount > 0 ? `Recalculate (#${recalculateCount + 1})` : 'Recalculate'}</span>
          </button>

          <button
            id="view-certificate-btn"
            onClick={() =>
              onOpenCertificate({
                particleCount,
                accuracy: "98.7% ± 4,000",
                sampleName,
                footnote: FOOTNOTE_POOL[footnoteIndex],
              })
            }
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-sm transition-all shadow-lg shadow-amber-500/20 active:scale-95"
          >
            <Award className="w-4 h-4" />
            <span>Get Certificate</span>
          </button>

          <button
            id="share-flex-btn"
            onClick={handleShareClick}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-amber-300 font-bold text-sm transition-all border border-neutral-700 active:scale-95"
          >
            <Share2 className="w-4 h-4" />
            <span>{copiedShare ? "Copied Flex!" : "Share Rava Flex"}</span>
          </button>
        </div>

        {/* Fake Social Leaderboard */}
        <div className="mt-8 pt-8 border-t border-neutral-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                Statewide Rava Particle Leaderboard
              </h3>
            </div>
            <span className="text-xs text-neutral-500 font-mono">Kerala Grain Division</span>
          </div>

          {/* Callout comparing with Ranjith's rava */}
          <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-300 mb-4 font-mono">
            🌾 <strong className="text-white">Your rava has {particleCount.toLocaleString()} particles.</strong>{' '}
            Ranjith&apos;s rava (uploaded yesterday) had only <span className="text-amber-400 font-bold">12,001</span>.{' '}
            <span className="text-emerald-400 font-semibold underline">Flex accordingly.</span>
          </div>

          {/* Mini Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-neutral-800 text-neutral-500">
                  <th className="pb-2">Rank</th>
                  <th className="pb-2">Chef / Entity</th>
                  <th className="pb-2">Location</th>
                  <th className="pb-2 text-right">Particles</th>
                  <th className="pb-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {LEADERBOARD_DATA.map((row) => {
                  const isCurrent = row.rank === 3;
                  return (
                    <tr
                      key={row.rank}
                      className={isCurrent ? 'bg-amber-500/10 text-amber-200 font-bold' : 'text-neutral-400'}
                    >
                      <td className="py-2.5">
                        {row.rank === 1 ? '🥇' : row.rank === 2 ? '🥈' : row.rank === 3 ? '🥉' : `#${row.rank}`}
                      </td>
                      <td className="py-2.5 text-neutral-200">
                        {isCurrent ? `You (${sampleName})` : row.name}
                      </td>
                      <td className="py-2.5 text-neutral-400">{row.location}</td>
                      <td className="py-2.5 text-right font-mono font-bold text-amber-400">
                        {isCurrent ? particleCount.toLocaleString() : row.count.toLocaleString()}
                      </td>
                      <td className="py-2.5 text-right">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-neutral-900 border border-neutral-800 text-neutral-300">
                          {row.verifiedBadge}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Guarantee */}
        <div className="mt-8 pt-4 text-center text-xs text-neutral-500 font-mono border-t border-neutral-800/80">
          Powered by RavaNet™ v3.1 (now with 12% more confidence than v3.0) • Verified by Ammachi Ventures
        </div>
      </div>

      {/* "THE APP HAS FEELINGS" GAG: Emotional Guilt-Trip Modal before reloading */}
      {emotionalPrompt && (
        <div
          id="emotional-guilt-trip-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div
            className={`w-full max-w-lg rounded-3xl p-6 sm:p-8 text-center border-2 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300 ${
              emotionalPrompt.theme === 'hurt'
                ? 'bg-gradient-to-b from-rose-950/95 via-neutral-950 to-neutral-900 border-rose-500 shadow-[0_0_60px_rgba(244,63,94,0.35)]'
                : emotionalPrompt.theme === 'cold'
                ? 'bg-gradient-to-b from-cyan-950/95 via-neutral-950 to-neutral-900 border-cyan-500 shadow-[0_0_60px_rgba(6,182,212,0.35)]'
                : emotionalPrompt.theme === 'crying'
                ? 'bg-gradient-to-b from-blue-950/95 via-neutral-950 to-neutral-900 border-blue-500 shadow-[0_0_60px_rgba(59,130,246,0.35)]'
                : 'bg-gradient-to-b from-amber-950/95 via-red-950 to-neutral-900 border-amber-500 shadow-[0_0_60px_rgba(245,158,11,0.45)]'
            }`}
          >
            {/* Top Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/50 border border-white/10 text-[11px] font-mono font-bold uppercase tracking-wider mb-4 text-white">
              <span>{emotionalPrompt.title}</span>
            </div>

            {/* Dramatic Guilt-Trip Quote */}
            <div className="text-2xl sm:text-3xl font-black text-white leading-snug tracking-wide font-sans my-3 drop-shadow-md">
              &ldquo;{emotionalPrompt.quote}&rdquo;
            </div>

            {/* English translation */}
            <p className="text-xs sm:text-sm font-mono text-neutral-300 italic mb-2">
              ({emotionalPrompt.englishTranslation})
            </p>

            <p className="text-xs font-mono text-neutral-400 mb-6 max-w-md mx-auto">
              {emotionalPrompt.subtitle}
            </p>

            {/* Countdown bar */}
            <div className="space-y-1.5 mb-6">
              <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 px-1">
                <span>Reloading full particle recalculation in {countdown}s...</span>
                <span className="font-bold text-amber-400">{countdown}s</span>
              </div>
              <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-1000 ease-linear rounded-full ${
                    emotionalPrompt.theme === 'hurt'
                      ? 'bg-rose-500'
                      : emotionalPrompt.theme === 'cold'
                      ? 'bg-cyan-400'
                      : emotionalPrompt.theme === 'crying'
                      ? 'bg-blue-400'
                      : 'bg-amber-400'
                  }`}
                  style={{ width: `${(countdown / 3) * 100}%` }}
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                id="force-recalculate-btn"
                onClick={proceedToRecalculate}
                className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold font-mono text-xs uppercase tracking-wider transition-all active:scale-95 shadow-lg ${
                  emotionalPrompt.theme === 'rage'
                    ? 'bg-amber-500 hover:bg-amber-400 text-neutral-950'
                    : 'bg-white hover:bg-neutral-200 text-neutral-950'
                }`}
              >
                Recalculate Now 🚀
              </button>
              <button
                id="cancel-recalculate-btn"
                onClick={cancelEmotionalRecalculate}
                className="w-full sm:w-auto px-4 py-3 rounded-xl bg-neutral-800/80 hover:bg-neutral-800 text-neutral-300 hover:text-white font-mono text-xs transition-all border border-neutral-700 active:scale-95"
              >
                Cancel (I trust you ❤️)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
