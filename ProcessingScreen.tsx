import React, { useState, useEffect, useRef } from 'react';
import {
  Terminal,
  AlertOctagon,
  Coffee,
  Bell,
  ShieldAlert,
  Sparkles,
  Pause,
  Play,
  Clock,
  Gauge,
  Eye,
} from 'lucide-react';
import { TECHNICAL_LOGS, ROTATING_TIPS } from '../data/ravaData';
import { sound } from '../utils/sound';

interface ProcessingScreenProps {
  sampleName: string;
  imageUrl: string;
  onComplete: () => void;
  isUltraMode: boolean;
  recalculateCount?: number;
  forcedParticleCount?: number | null;
}

type SpeedMode = 'slow' | 'standard' | 'fast';

export const ProcessingScreen: React.FC<ProcessingScreenProps> = ({
  sampleName,
  imageUrl,
  onComplete,
  isUltraMode,
  recalculateCount = 0,
  forcedParticleCount = null,
}) => {
  const [progress, setProgress] = useState(0);
  const [displayedLogs, setDisplayedLogs] = useState<string[]>([]);
  const [activeComment, setActiveComment] = useState<string>(
    'INITIALIZING: Optical photon receptors calibrating...'
  );
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [glitchMessage, setGlitchMessage] = useState<string | null>(null);
  const [glitchState, setGlitchState] = useState<
    'none' | 'sixty-glitch' | 'sixty-nine-pause' | 'ninety-nine-pause' | 'completed'
  >('none');

  // Interactive controls for live presentation / stage demo
  const [speedMode, setSpeedMode] = useState<SpeedMode>('standard');
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const logsEndRef = useRef<HTMLDivElement>(null);
  const isCancelledRef = useRef<boolean>(false);
  const isPausedRef = useRef<boolean>(false);
  const speedMultiplierRef = useRef<number>(1.0);

  // Sync refs with state so async runner reads them instantaneously
  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    if (speedMode === 'slow') speedMultiplierRef.current = 1.6; // Stage / Presentation pacing (extra slow)
    else if (speedMode === 'standard') speedMultiplierRef.current = 1.0; // Slower, readable default
    else speedMultiplierRef.current = 0.55; // Fast demo
  }, [speedMode]);

  // Auto-scroll logs terminal
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [displayedLogs]);

  // Loading tip carousel
  useEffect(() => {
    const tipInterval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % ROTATING_TIPS.length);
    }, 4500);
    return () => clearInterval(tipInterval);
  }, []);

  // Main scripted progress state machine
  useEffect(() => {
    isCancelledRef.current = false;

    // Resilient sleep that honors Pause & Speed multiplier in real time
    const sleep = async (baseMs: number) => {
      let remaining = baseMs * speedMultiplierRef.current;
      while (remaining > 0 && !isCancelledRef.current) {
        if (!isPausedRef.current) {
          const step = Math.min(remaining, 80);
          await new Promise((resolve) => setTimeout(resolve, step));
          remaining -= step;
        } else {
          // Paused: wait in small ticks until unpaused
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      }
    };

    const addLog = (log: string) => {
      setDisplayedLogs((prev) => [...prev, log]);
      setActiveComment(log);
      sound.playKeyClick();
    };

    const runScriptedBeats = async () => {
      // 1. Emotional state injection if this is a recalculation
      if (recalculateCount > 0) {
        if (recalculateCount === 1) {
          addLog("🥀 [EMOTIONAL OVERFLOW]: 'Enne ninaku vishwasam illa alle 🥀😭'");
          await sleep(1400);
          if (isCancelledRef.current) return;
          addLog("Subroutine: Recounting with bruised ego and severe trust issues...");
        } else if (recalculateCount === 2) {
          addLog("🧊 [COLD SHUTDOWN]: 'Again? Okay. I see how it is.'");
          await sleep(1400);
          if (isCancelledRef.current) return;
          addLog("Passive-aggressive mode engaged. Counting grains with zero enthusiasm.");
        } else if (recalculateCount === 3) {
          addLog("😭 [TEAR DETECTED]: 'Recalculating for the 3rd time. RavaNet™ is not crying, you're crying.'");
          await sleep(1400);
          if (isCancelledRef.current) return;
          addLog("Wiping saline droplets off CMOS optical lens with virtual towel...");
        } else {
          addLog("😤 [RAGE INJECTION]: 'Fine!! Here's 99,999 particles. Happy now?? 😤'");
          await sleep(1400);
          if (isCancelledRef.current) return;
          addLog("💥 OVERRIDING ALL RANDOMIZATION: Forcing exactly 99,999 particles into memory!");
        }
        await sleep(1400);
        if (isCancelledRef.current) return;
      }

      // Initial boot logs - deliberate pacing so audience reads every line
      addLog('INIT: Semolina Tensor Cores 0-7 loaded.');
      await sleep(1400);
      if (isCancelledRef.current) return;

      addLog(`TARGET: "${sampleName}" acquired via Kaali-Theta optical pipeline.`);
      await sleep(1500);
      if (isCancelledRef.current) return;

      addLog('COMMENCING: High-resolution Granulometric Particle Enumeration...');
      await sleep(1600);
      if (isCancelledRef.current) return;

      // Randomize glitch parameters so reruns feel organic
      const glitchTriggerPct = 58 + Math.floor(Math.random() * 4); // 58 to 61
      const glitchDropTarget = 36 + Math.floor(Math.random() * 4); // 36 to 39

      // BEAT 1: 0% -> ~60% with dedicated comments and smooth, readable steps
      const phase1Steps = [
        { pct: 10, log: TECHNICAL_LOGS[1] }, // Calibrating CMOS photon receptor...
        { pct: 22, log: TECHNICAL_LOGS[2] }, // Calculating tan(θ) × cos(θ)...
        { pct: 34, log: TECHNICAL_LOGS[3] }, // Cross-referencing Ammachi's Rava Dataset v2.1...
        { pct: 45, log: TECHNICAL_LOGS[4] }, // Applying Rava Diffusion Coefficient™...
        { pct: 54, log: TECHNICAL_LOGS[5] }, // Detecting microscopic ghee meniscus holding 48 particles hostage...
        { pct: glitchTriggerPct, log: 'Reaching critical boundary layer near kadai perimeter...' },
      ];

      for (const step of phase1Steps) {
        if (isCancelledRef.current) return;
        setProgress(step.pct);
        addLog(step.log);
        await sleep(1800);
      }

      if (isCancelledRef.current) return;

      // BEAT 2: THE FAMOUS ~60% GLITCH (Full deliberate breath for live-demo comedy)
      setGlitchState('sixty-glitch');
      sound.playRecordScratch();

      // Bar snaps backwards!
      setProgress(glitchDropTarget);
      const malayalamGlitch = `${glitchTriggerPct}% aayirunnu... thirichu ${glitchDropTarget}% il poyi. Ayyo, oru rava miss aayi, thirichu poyi athum koode eduthondu varaam...`;
      setGlitchMessage(malayalamGlitch);
      setActiveComment(`🚨 ROLLBACK: ${malayalamGlitch}`);

      setDisplayedLogs((prev) => [
        ...prev,
        '🚨 [CRITICAL RUNTIME EXCEPTION]: Grain #4,091 slipped between manifold coordinates!',
        `<< ROLLBACK TRIGGERED: Snapping from ${glitchTriggerPct}% back to ${glitchDropTarget}% >>`,
        'Searching under the kitchen table for missing rava particle...',
      ]);

      // Give it a full deliberate pause (4.8 seconds) for audience to read and laugh!
      await sleep(4800);
      if (isCancelledRef.current) return;

      setGlitchMessage(null);
      setGlitchState('none');
      addLog('✓ Missing grain retrieved and calmed down with pure ghee.');
      await sleep(1400);
      if (isCancelledRef.current) return;

      addLog('Resuming forward particle triangulation...');
      await sleep(1300);
      if (isCancelledRef.current) return;

      // BEAT 3: ~38% -> 69%
      const phase2Steps = [
        { pct: 44, log: TECHNICAL_LOGS[6] }, // Running Semolina Neural Grid v9 on simulated tensor cores...
        { pct: 52, log: TECHNICAL_LOGS[7] }, // Isolating rogue rava particle #4,102...
        { pct: 60, log: TECHNICAL_LOGS[8] }, // Consulting Ancient Kerala Grain Registry...
        { pct: 65, log: TECHNICAL_LOGS[9] }, // Eliminating ghost grains caused by optical glare...
        { pct: 69, log: TECHNICAL_LOGS[10] }, // Deploying Fourier Transform on curry leaf...
      ];

      for (const step of phase2Steps) {
        if (isCancelledRef.current) return;
        setProgress(step.pct);
        addLog(step.log);
        await sleep(1700);
      }

      if (isCancelledRef.current) return;

      // BEAT 4: 69% PAUSE ("nice. ഒരു ചായ കുടിച്ചിട്ട് വരാം...")
      setProgress(69);
      setGlitchState('sixty-nine-pause');
      sound.playTeaChime();
      const teaMessage = '69%... nice. ഒരു ചായ കുടിച്ചിട്ട് വരാം...';
      setGlitchMessage(teaMessage);
      setActiveComment(`☕ SULAIMANI BREAK: ${teaMessage}`);

      setDisplayedLogs((prev) => [
        ...prev,
        '⏸️ PAUSE: 69% reached. System operator pausing for Sulaimani tea break...',
      ]);

      // Pause ~3.6 seconds
      await sleep(3600);
      if (isCancelledRef.current) return;

      setGlitchMessage(null);
      setGlitchState('none');
      addLog('☕ Sulaimani finished. Resuming neural semolina synthesis...');
      await sleep(1500);
      if (isCancelledRef.current) return;

      // BEAT 5: 69% -> 99%
      const phase3Steps = [
        { pct: 76, log: TECHNICAL_LOGS[11] }, // Calculating probability that Amma adds too much water...
        { pct: 83, log: TECHNICAL_LOGS[12] }, // AI Confidence Check: confirms authentic rava...
        { pct: 90, log: TECHNICAL_LOGS[13] }, // Triangulating particle shadows using sun angle...
        { pct: 95, log: TECHNICAL_LOGS[14] }, // Verifying grain count against WhatsApp family forward database...
        { pct: 98, log: TECHNICAL_LOGS[15] }, // Executing Monte Carlo grain estimation with 100% unjustified swagger...
      ];

      for (const step of phase3Steps) {
        if (isCancelledRef.current) return;
        setProgress(step.pct);
        addLog(step.log);
        await sleep(1800);
      }

      if (isCancelledRef.current) return;

      // BEAT 6: 99% PAUSE ("ഒരു റവ തെറിച്ചു പോയി, തിരിച്ചു പിടിക്കുന്നു...")
      setProgress(99);
      setGlitchState('ninety-nine-pause');
      sound.playWarningBlip();
      const bounceMessage = 'ഒരു റവ തെറിച്ചു പോയി, തിരിച്ചു പിടിക്കുന്നു...';
      setGlitchMessage(bounceMessage);
      setActiveComment(`⚠️ RECAPTURE: ${bounceMessage}`);

      setDisplayedLogs((prev) => [
        ...prev,
        '⚠️ HOLD: Particle bounced off kadai rim during vigorous stirring!',
        'Applying magnetic ladle field to recapture rogue grain...',
      ]);

      // Pause ~3.5 seconds
      await sleep(3500);
      if (isCancelledRef.current) return;

      addLog('✓ Rogue grain recaptured with wooden thavi. Zero casualties reported.');
      await sleep(1500);
      if (isCancelledRef.current) return;

      // BEAT 7: 100% COMPLETION DING!
      setProgress(100);
      setGlitchState('completed');
      setGlitchMessage(null);
      addLog(TECHNICAL_LOGS[16]); // Synthesizing final count via proprietary HallucinationMatrix™...
      await sleep(1200);
      if (isCancelledRef.current) return;

      setDisplayedLogs((prev) => [
        ...prev,
        '✓ All grains accounted for with 98.7% fabricated accuracy!',
        '🔔 GENERATING RAVA CERTIFICATE OF AUTHENTICITY...',
      ]);
      setActiveComment('✓ SCAN COMPLETE: Generating Official Rava Certificate of Authenticity...');

      sound.playCompletionDing();
      await sleep(1600);

      if (!isCancelledRef.current) {
        onComplete();
      }
    };

    runScriptedBeats();

    return () => {
      isCancelledRef.current = true;
    };
  }, [sampleName, onComplete]);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6">
      {/* Top Banner with Terminal Status & Live Presentation Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white font-mono tracking-tight">
                RAVANET-CORE-V3 // GRANULAR SCAN
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono">
                LIVE COMPUTE
              </span>
            </div>
            <p className="text-xs text-neutral-400 font-mono mt-0.5">
              Target: <span className="text-amber-400 font-semibold">{sampleName}</span> • Kaali-Theta Neural Pipeline
            </p>
          </div>
        </div>

        {/* Live Presentation Speed & Pause Bar (So viewers never miss a comment) */}
        <div className="flex flex-wrap items-center gap-2 bg-neutral-900/90 p-2 rounded-xl border border-neutral-800 text-xs font-mono">
          {/* Pause / Resume button */}
          <button
            onClick={() => {
              sound.playKeyClick();
              setIsPaused((p) => !p);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-bold transition-colors ${
              isPaused
                ? 'bg-amber-500 text-neutral-950 border-amber-400 shadow-md shadow-amber-500/20'
                : 'bg-neutral-800 text-neutral-300 hover:text-white border-neutral-700'
            }`}
            title="Pause stream to read comments or speak to judges"
          >
            {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5" />}
            <span>{isPaused ? 'RESUME STREAM' : 'PAUSE TO READ'}</span>
          </button>

          {/* Speed Selector */}
          <div className="flex items-center bg-black/50 p-1 rounded-lg border border-neutral-800">
            <Clock className="w-3 h-3 text-neutral-400 ml-1.5 mr-1" />
            <span className="text-[10px] text-neutral-400 mr-2 hidden sm:inline">PACING:</span>
            <button
              onClick={() => {
                sound.playKeyClick();
                setSpeedMode('slow');
              }}
              className={`px-2 py-1 rounded text-[11px] transition-colors ${
                speedMode === 'slow'
                  ? 'bg-emerald-500/30 text-emerald-300 font-bold border border-emerald-500/50'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
              title="Extra slow for reading all jokes on stage"
            >
              🐢 Stage (Slow)
            </button>
            <button
              onClick={() => {
                sound.playKeyClick();
                setSpeedMode('standard');
              }}
              className={`px-2 py-1 rounded text-[11px] transition-colors ${
                speedMode === 'standard'
                  ? 'bg-emerald-500/30 text-emerald-300 font-bold border border-emerald-500/50'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              🌾 Balanced
            </button>
            <button
              onClick={() => {
                sound.playKeyClick();
                setSpeedMode('fast');
              }}
              className={`px-2 py-1 rounded text-[11px] transition-colors ${
                speedMode === 'fast'
                  ? 'bg-emerald-500/30 text-emerald-300 font-bold border border-emerald-500/50'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              ⚡ Fast
            </button>
          </div>
        </div>
      </div>

      {/* EMOTIONAL RECALCULATION BANNER ("THE APP HAS FEELINGS" GAG) */}
      {recalculateCount > 0 && (
        <div
          id="emotional-recount-banner"
          className={`mb-4 px-4 py-3 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 border shadow-lg animate-in fade-in slide-in-from-top-2 duration-300 ${
            recalculateCount === 1
              ? 'bg-gradient-to-r from-rose-950/80 via-neutral-950 to-neutral-900 border-rose-500/60 text-rose-200'
              : recalculateCount === 2
              ? 'bg-gradient-to-r from-cyan-950/80 via-neutral-950 to-neutral-900 border-cyan-500/60 text-cyan-200'
              : recalculateCount === 3
              ? 'bg-gradient-to-r from-blue-950/80 via-neutral-950 to-neutral-900 border-blue-500/60 text-blue-200'
              : 'bg-gradient-to-r from-amber-950/90 via-red-950/80 to-neutral-950 border-amber-500 text-amber-200 shadow-[0_0_25px_rgba(245,158,11,0.3)]'
          }`}
        >
          <div className="flex items-center gap-2 font-mono text-xs sm:text-sm font-bold">
            <span className="text-base sm:text-lg">
              {recalculateCount === 1 ? '🥀' : recalculateCount === 2 ? '🧊' : recalculateCount === 3 ? '😭' : '😤'}
            </span>
            <span>
              {recalculateCount === 1 && '“Enne ninaku vishwasam illa alle 🥀😭” — Recounting with emotional trauma'}
              {recalculateCount === 2 && '“Again? Okay. I see how it is.” — Cold recount mode'}
              {recalculateCount === 3 && '“Recalculating for the 3rd time. RavaNet™ is not crying, you\'re crying.”'}
              {recalculateCount >= 4 && '“Fine!! Here\'s 99,999 particles. Happy now?? 😤” — Pure Spite Override'}
            </span>
          </div>
          <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded bg-black/50 border border-white/10 shrink-0 self-start sm:self-auto font-bold">
            {recalculateCount >= 4 ? 'SPITE INJECTION' : `RECOUNT #${recalculateCount}`}
          </span>
        </div>
      )}

      {/* HIGHLIGHTED ACTIVE COMMENTARY SPOTLIGHT (Prominent, High-Contrast, Crystal Clear) */}
      <div
        id="active-comment-spotlight"
        className="mb-4 p-4 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-neutral-950 to-neutral-900 border-2 border-emerald-500/50 shadow-[0_0_25px_rgba(16,185,129,0.15)] flex items-center gap-3 transition-all"
      >
        <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0 border border-emerald-500/30">
          <Eye className="w-5 h-5 animate-pulse" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              CURRENT SUBROUTINE OBSERVATION
            </span>
            {isPaused && (
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/30 text-amber-300 border border-amber-500/40 animate-pulse">
                STREAM PAUSED
              </span>
            )}
          </div>
          <div className="text-sm sm:text-base font-mono font-bold text-amber-200 sm:text-amber-300 tracking-tight leading-snug">
            {activeComment}
          </div>
        </div>
      </div>

      {/* Main Terminal Window: Green-on-black, Scanlines, Hacker Glow */}
      <div
        id="terminal-window"
        className="relative bg-black rounded-2xl border-2 border-emerald-950 shadow-[0_0_40px_rgba(16,185,129,0.12)] overflow-hidden crt-scanlines"
      >
        {/* Terminal Header Bar */}
        <div className="bg-neutral-950 border-b border-emerald-900/40 px-4 py-2.5 flex items-center justify-between select-none">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
            <span className="text-xs font-mono text-neutral-400 ml-2">
              root@ravanet-cloud: /var/log/kaali_theta_particle_stream.log
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-mono">
            <span className="text-neutral-500 hidden sm:inline">
              [SPEED: {speedMode.toUpperCase()}]
            </span>
            <span className="text-emerald-500/80 animate-pulse">
              ● RECORDING BEATS
            </span>
          </div>
        </div>

        {/* Split Grid: Live Vision Feed + Monospace Terminal Logs */}
        <div className="grid grid-cols-1 md:grid-cols-12 min-h-[380px] max-h-[500px]">
          {/* Left: Active Camera Frame with particle scan grid */}
          <div className="md:col-span-4 bg-neutral-950/90 p-4 border-b md:border-b-0 md:border-r border-emerald-900/40 flex flex-col justify-between">
            <div>
              <div className="text-[11px] font-mono text-emerald-400 mb-2 flex items-center justify-between">
                <span>[PHOTON CAPTURE]</span>
                <span className="text-amber-400 font-bold">{progress}%</span>
              </div>

              <div className="relative rounded-lg overflow-hidden border border-emerald-500/40 bg-black aspect-square">
                <img
                  src={imageUrl}
                  alt="Rava scan active feed"
                  className="w-full h-full object-cover opacity-75 filter contrast-125 brightness-90"
                />

                {/* Simulated Computer Vision Scanning Reticle */}
                <div
                  className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_10px_#22c55e] animate-bounce"
                  style={{ animationDuration: '2s' }}
                />

                {/* Dynamic particle dots overlay */}
                <div className="absolute inset-0 pointer-events-none p-2 grid grid-cols-4 grid-rows-4 gap-2 opacity-80">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div
                      key={i}
                      className="border border-emerald-500/30 rounded-xs flex items-center justify-center"
                    >
                      <span className="w-1 h-1 rounded-full bg-emerald-400/90 animate-ping" />
                    </div>
                  ))}
                </div>

                {/* Glitch Overlay Banner if 60% glitch */}
                {glitchState === 'sixty-glitch' && (
                  <div className="absolute inset-0 bg-rose-950/85 backdrop-blur-xs flex flex-col items-center justify-center p-3 text-center animate-pulse">
                    <ShieldAlert className="w-8 h-8 text-rose-400 mb-1" />
                    <span className="text-xs font-mono font-bold text-rose-300">
                      ROLLBACK ACTIVE
                    </span>
                    <span className="text-[10px] font-mono text-rose-200 mt-1">
                      Snap-back in progress
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Vessel Metadata */}
            <div className="mt-3 p-2.5 rounded bg-black/60 border border-emerald-900/40 text-[10px] font-mono text-emerald-400/90 space-y-1">
              <div>Vessel: Kadai #7 (Anodized Aluminium)</div>
              <div>Theta: 42.85714° ± 0.00001</div>
              <div>Estimated Moisture: 4.2%</div>
            </div>
          </div>

          {/* Right: Scrolling Green Monospace Terminal with Enlarged Readable Fonts */}
          <div className="md:col-span-8 p-4 font-terminal text-xs sm:text-sm text-emerald-400 bg-black/95 overflow-y-auto flex flex-col justify-between max-h-[460px]">
            <div className="space-y-2 crt-glow">
              {displayedLogs.map((log, index) => {
                const isAlert =
                  log.includes('🚨') || log.includes('<<') || log.includes('ROLLBACK');
                const isPause =
                  log.includes('⏸️') || log.includes('☕') || log.includes('⚠️');
                const isSuccess = log.includes('✓') || log.includes('🔔');
                const isLatest = index === displayedLogs.length - 1;

                return (
                  <div
                    key={index}
                    className={`leading-relaxed transition-all ${
                      isAlert
                        ? 'text-rose-400 font-bold crt-glow-amber bg-rose-950/30 px-3 py-1.5 rounded border border-rose-800/50'
                        : isPause
                        ? 'text-amber-300 font-semibold crt-glow-amber bg-amber-950/30 px-3 py-1.5 rounded border border-amber-800/40'
                        : isSuccess
                        ? 'text-yellow-300 font-bold bg-yellow-950/20 px-3 py-1.5 rounded'
                        : isLatest
                        ? 'text-emerald-200 font-semibold bg-emerald-950/40 px-3 py-1.5 rounded border border-emerald-700/50 shadow-xs'
                        : 'text-emerald-400/90 hover:text-emerald-300'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-emerald-700 select-none shrink-0 font-mono text-xs mt-0.5">
                        [{String(index + 1).padStart(3, '0')}]
                      </span>
                      <span className="flex-1">
                        {log}
                        {isLatest && (
                          <span className="ml-2 inline-block text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/30 text-emerald-300 uppercase font-mono tracking-wider border border-emerald-500/40">
                            NEW
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div className="flex items-center gap-1 text-emerald-400 pt-1">
                <span className="text-emerald-500">&gt;</span>
                <span className="w-2.5 h-4 bg-emerald-400 animate-cursor inline-block" />
              </div>
              <div ref={logsEndRef} />
            </div>
          </div>
        </div>

        {/* High-Visibility Progress Bar & Funny Glitch Callout Section */}
        <div className="p-4 sm:p-6 bg-neutral-950 border-t border-emerald-900/60">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
                Analysis Progress:
              </span>
              <span
                id="progress-percentage-display"
                className={`text-base sm:text-lg font-mono font-extrabold ${
                  glitchState === 'sixty-glitch'
                    ? 'text-rose-400 animate-pulse'
                    : glitchState === 'sixty-nine-pause'
                    ? 'text-amber-300'
                    : 'text-emerald-300'
                }`}
              >
                {progress}%
              </span>
            </div>

            <div className="text-xs font-mono text-neutral-400">
              {progress < 100 ? (
                <span>Crunching semolina tensors...</span>
              ) : (
                <span className="text-emerald-400 font-bold">Scan Complete!</span>
              )}
            </div>
          </div>

          {/* Progress Bar with backward snap transition */}
          <div className="w-full bg-neutral-900 h-4 rounded-full overflow-hidden border border-emerald-900/80 p-0.5 relative">
            <div
              id="scripted-progress-bar"
              className={`h-full rounded-full transition-all duration-300 relative ${
                glitchState === 'sixty-glitch'
                  ? 'bg-rose-500 shadow-[0_0_15px_#f43f5e]'
                  : glitchState === 'sixty-nine-pause'
                  ? 'bg-amber-400 shadow-[0_0_15px_#f59e0b]'
                  : 'bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 shadow-[0_0_15px_#10b981]'
              }`}
              style={{ width: `${progress}%` }}
            >
              {/* Scanline shimmer inside bar */}
              <div className="absolute inset-0 bg-white/20 animate-[pulse_1s_infinite]" />
            </div>
          </div>

          {/* SCRIPTED COMEDY CALLOUT BOX (60% GLITCH, 69% TEA, 99% GRAIN RECOVERY) */}
          {glitchMessage && (
            <div
              id="glitch-comedy-box"
              className={`mt-4 p-4 rounded-xl border flex items-start gap-3 transition-all ${
                glitchState === 'sixty-glitch'
                  ? 'bg-rose-950/80 border-rose-500/80 text-rose-200'
                  : glitchState === 'sixty-nine-pause'
                  ? 'bg-amber-950/80 border-amber-500/80 text-amber-200'
                  : 'bg-yellow-950/80 border-yellow-500/80 text-yellow-200'
              }`}
            >
              {glitchState === 'sixty-glitch' ? (
                <AlertOctagon className="w-6 h-6 text-rose-400 shrink-0 mt-0.5 animate-spin-slow" />
              ) : glitchState === 'sixty-nine-pause' ? (
                <Coffee className="w-6 h-6 text-amber-400 shrink-0 mt-0.5 animate-pulse" />
              ) : (
                <Bell className="w-6 h-6 text-yellow-400 shrink-0 mt-0.5 animate-bounce" />
              )}
              <div>
                <div className="text-xs font-mono font-bold uppercase tracking-wider mb-1">
                  {glitchState === 'sixty-glitch' && '⚡ 60% BACKWARD GLITCH EVENT (PATENT PENDING)'}
                  {glitchState === 'sixty-nine-pause' && '☕ 69% SULAIMANI COOLDOWN SUBROUTINE'}
                  {glitchState === 'ninety-nine-pause' && '🏃 99% ROGUE GRAIN CHASE OPERATION'}
                </div>
                <div className="text-sm sm:text-base md:text-lg font-bold font-mono leading-relaxed text-white">
                  &ldquo;{glitchMessage}&rdquo;
                </div>
              </div>
            </div>
          )}

          {/* Rotating Loading Tip Carousel (Deadpan facts) */}
          <div className="mt-4 pt-3 border-t border-neutral-900 flex items-center justify-between text-xs text-neutral-400">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 font-mono text-[10px] text-amber-400 shrink-0">
                DID YOU KNOW?
              </span>
              <span className="italic text-neutral-300 line-clamp-1">
                {ROTATING_TIPS[currentTipIndex]}
              </span>
            </div>
            <div className="text-[10px] font-mono text-neutral-500 shrink-0 hidden md:block">
              Kaali-Theta Engine v3.1
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
