import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle2, AlertTriangle, ShieldCheck, Sparkles, Award, Star, ArrowRight, Camera, RefreshCw, X } from 'lucide-react';
import { RAVA_PRESETS, RavaPreset } from '../data/ravaData';
import { sound } from '../utils/sound';
import { analyzeImageForRava, RavaDetectionResult } from '../utils/ravaDetector';

interface UploadScreenProps {
  onStartAnalysis: (selectedSample: { name: string; imageUrl: string }) => void;
  isUltraMode: boolean;
}

export const UploadScreen: React.FC<UploadScreenProps> = ({
  onStartAnalysis,
  isUltraMode,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<RavaPreset>(RAVA_PRESETS[0]);
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [customImageName, setCustomImageName] = useState<string>('');
  const [detectionResult, setDetectionResult] = useState<RavaDetectionResult | null>(null);
  const [isDetecting, setIsDetecting] = useState<boolean>(false);
  const [showUploadRequiredModal, setShowUploadRequiredModal] = useState<boolean>(false);
  const [showNonRavaModal, setShowNonRavaModal] = useState<boolean>(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Bonus spicy easter egg: Hold button for 5 seconds
  const [holdTimerProgress, setHoldTimerProgress] = useState(0);
  const [patienceEggTriggered, setPatienceEggTriggered] = useState(false);
  const holdIntervalRef = useRef<number | null>(null);
  const holdStartTimeRef = useRef<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePresetSelect = (preset: RavaPreset) => {
    setSelectedPreset(preset);
    setCustomImage(null);
    setCustomImageName('');
    setDetectionResult(null);
    sound.playKeyClick();
  };

  const handleFileUpload = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      setCustomImageName(file.name);
      setIsDetecting(true);
      const reader = new FileReader();
      reader.onload = async (e) => {
        const dataUrl = e.target?.result as string;
        setCustomImage(dataUrl);

        try {
          const result = await analyzeImageForRava(dataUrl, file.name);
          setDetectionResult(result);
          if (!result.isRava) {
            sound.playBruhAudio();
            setShowNonRavaModal(true);
          } else {
            sound.playKeyClick();
          }
        } catch {
          setDetectionResult({
            isRava: true,
            ravaScore: 75,
            dominantColor: '#d97706',
            reason: 'Scan completed',
          });
          sound.playKeyClick();
        } finally {
          setIsDetecting(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  // Button hold logic for 5-second Easter Egg
  const startHold = () => {
    if (!termsAccepted || !customImage) return;
    holdStartTimeRef.current = Date.now();
    holdIntervalRef.current = window.setInterval(() => {
      if (holdStartTimeRef.current) {
        const elapsed = Date.now() - holdStartTimeRef.current;
        const progress = Math.min(100, (elapsed / 5000) * 100);
        setHoldTimerProgress(progress);
        if (elapsed >= 5000) {
          clearInterval(holdIntervalRef.current!);
          setPatienceEggTriggered(true);
          sound.playTeaChime();
        }
      }
    }, 50);
  };

  const cancelHold = () => {
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
    setHoldTimerProgress(0);
  };

  const handleAnalyzeClick = () => {
    // 1. If someone didn't upload an image, show popup to upload image
    if (!customImage) {
      sound.playWarningBlip();
      setShowUploadRequiredModal(true);
      return;
    }

    // 2. If someone uploaded photos other than rava grains, display comment
    if (detectionResult && !detectionResult.isRava) {
      sound.playBruhAudio();
      setShowNonRavaModal(true);
      return;
    }

    // 3. Check waiver agreement
    if (!termsAccepted) {
      sound.playWarningBlip();
      const checkbox = document.getElementById('mandatory-rava-disclaimer');
      checkbox?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      checkbox?.classList.add('ring-4', 'ring-amber-500');
      setTimeout(() => {
        checkbox?.classList.remove('ring-4', 'ring-amber-500');
      }, 1200);
      return;
    }

    sound.playKeyClick();
    onStartAnalysis({
      name: customImageName ? `Vessel Scan (${customImageName})` : "User's Custom Rava Upload",
      imageUrl: customImage,
    });
  };

  // Helper to generate a realistic SVG graphic for each rava preset
  function getPresetPreviewUrl(id: string) {
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
        <defs>
          <radialGradient id="ravaBowl" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#fef08a" />
            <stop offset="45%" stop-color="#f59e0b" />
            <stop offset="85%" stop-color="#b45309" />
            <stop offset="100%" stop-color="#451a03" />
          </radialGradient>
          <pattern id="particles" width="8" height="8" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.2" fill="#fffbeb" opacity="0.85" />
            <circle cx="6" cy="5" r="1.4" fill="#fde68a" opacity="0.9" />
            <circle cx="3" cy="6" r="0.9" fill="#d97706" opacity="0.6" />
            <circle cx="7" cy="2" r="1.1" fill="#fbbf24" opacity="0.8" />
          </pattern>
        </defs>
        <rect width="400" height="300" fill="#171717"/>
        <!-- Stainless steel plate rim -->
        <ellipse cx="200" cy="150" rx="175" ry="120" fill="#525252" stroke="#a3a3a3" stroke-width="6"/>
        <ellipse cx="200" cy="150" rx="160" ry="108" fill="url(#ravaBowl)"/>
        <ellipse cx="200" cy="150" rx="160" ry="108" fill="url(#particles)"/>
        <!-- Ghee glisten highlight -->
        <path d="M110,110 Q200,80 290,120" stroke="#fef3c7" stroke-width="3" fill="none" opacity="0.4" filter="blur(1px)"/>
        <!-- Curry leaf garnish -->
        <ellipse cx="220" cy="130" rx="22" ry="9" fill="#15803d" transform="rotate(-25 220 130)"/>
        <!-- Mustard seed -->
        <circle cx="170" cy="145" r="2.5" fill="#1c1917"/>
        <circle cx="240" cy="160" r="2" fill="#1c1917"/>
      </svg>
    `);
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 sm:py-12">
      {/* Hero Header */}
      <div className="text-center space-y-4 mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono">
          <Sparkles className="w-3.5 h-3.5" />
          <span>PROPRIETARY KAALI-THETA ARCHITECTURE</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white max-w-2xl mx-auto leading-tight">
          Precision You Can&apos;t Trust. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500">
            Confidence You Can&apos;t Question.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-neutral-400 max-w-xl mx-auto font-normal">
          Because you deserve to know exactly how much rava is in your rava.
        </p>

        {/* Trust Badges Row */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs font-mono text-neutral-300">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900/90 border border-neutral-800">
            <Award className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Trusted by <strong>0</strong> Nutritionists</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900/90 border border-neutral-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span><strong>99.9%</strong> Made-Up Accuracy</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900/90 border border-neutral-800">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 shrink-0" />
            <span><strong>5/5</strong> Stars from Ammachi</span>
          </div>
        </div>
      </div>

      {/* Main SaaS Card */}
      <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        {/* Subtle corner badge */}
        <div className="absolute top-0 right-0 bg-neutral-800 text-[10px] font-mono text-neutral-400 px-3 py-1 rounded-bl-lg border-l border-b border-neutral-700">
          RAVA-CV-ENGINE: READY
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Sample selector & Dropzone */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-neutral-200">
                1. Select Rava Sample for Kaali-Theta Scan
              </label>
              <span className="text-xs text-neutral-400 font-mono">Standard 2D Granulometry</span>
            </div>

            {/* Presets Grid */}
            <div className="grid grid-cols-1 gap-2.5">
              {RAVA_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  id={`preset-${preset.id}`}
                  onClick={() => handlePresetSelect(preset)}
                  className={`text-left p-3.5 rounded-xl border transition-all text-xs ${
                    selectedPreset.id === preset.id && !customImage
                      ? 'bg-amber-500/10 border-amber-500/60 text-white shadow-[0_0_12px_rgba(245,158,11,0.15)] ring-1 ring-amber-500/30'
                      : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
                  }`}
                >
                  <div className="font-bold text-neutral-200 text-sm mb-1">
                    {preset.name}
                  </div>
                  <div className="text-xs text-neutral-400 leading-relaxed">
                    {preset.subtext}
                  </div>
                </button>
              ))}
            </div>

            {/* Dropzone & Custom Upload */}
            <div
              id="rava-dropzone"
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-amber-500 bg-amber-500/10'
                  : detectionResult && !detectionResult.isRava
                  ? 'border-red-500/60 bg-red-950/20 hover:border-red-400'
                  : 'border-neutral-800 hover:border-neutral-700 bg-neutral-950/40'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
              />
              <div className="flex flex-col items-center justify-center gap-2">
                <div className={`p-2.5 rounded-full border ${
                  detectionResult && !detectionResult.isRava
                    ? 'bg-red-950/50 border-red-500/50 text-red-400'
                    : 'bg-neutral-900 border-neutral-800 text-amber-400'
                }`}>
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div className="text-xs text-neutral-300">
                  <span className="font-semibold text-white underline decoration-amber-500/50">
                    {customImage ? 'Upload a different vessel photo' : 'Upload your own vessel photo'}
                  </span>{' '}
                  or drag & drop here
                </div>
                <p className="text-[11px] text-neutral-400">
                  PNG, JPG, or Upma snapshots up to 25MB • No rava is too coarse for RavaNet™
                </p>
              </div>
            </div>

            {/* Non-Rava Reaction Comment Box */}
            {detectionResult && !detectionResult.isRava && (
              <div className="p-4 rounded-xl bg-red-950/80 border-2 border-red-500/70 text-red-200 shadow-xl shadow-red-950/50 animate-in fade-in duration-300">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl select-none">😭</span>
                    <span className="text-2xl font-black text-red-400">
                      എന്തുവാടേ ഇത്? 😭
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/40 shrink-0 font-bold">
                    0% RAVA DETECTED
                  </span>
                </div>
                <p className="text-xs text-red-200/90 mt-2 leading-relaxed">
                  Ammachi inspected your upload and exclaimed: <strong className="text-white">“എന്തുവാടേ ഇത്?” 😭</strong> This image does not contain rava, sooji, or semolina grains. Please upload an image of actual rava grains!
                </p>
                <div className="mt-3 flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      sound.playBruhAudio();
                    }}
                    className="text-xs px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                  >
                    🔊 Replay &quot;Bruh&quot;
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="text-xs px-3.5 py-1.5 rounded-lg bg-red-500 hover:bg-red-400 text-neutral-950 font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    Upload Real Rava
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCustomImage(null);
                      setDetectionResult(null);
                      setCustomImageName('');
                    }}
                    className="text-xs px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-700 transition-colors cursor-pointer"
                  >
                    Clear Photo
                  </button>
                </div>
              </div>
            )}

            {/* Verified Rava Confirmation */}
            {detectionResult && detectionResult.isRava && (
              <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 flex items-center justify-between text-xs font-mono">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  Rava Granules Verified ({detectionResult.ravaScore}% particle density)
                </span>
                <span className="text-[10px] text-emerald-400/80 font-bold">READY TO COUNT</span>
              </div>
            )}
          </div>

          {/* Right Column: Computer Vision Preview Box */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className={`text-xs font-mono ${detectionResult && !detectionResult.isRava ? 'text-red-400' : 'text-neutral-400'}`}>
                {detectionResult && !detectionResult.isRava ? 'OPTICAL FEED: REJECTED' : 'OPTICAL SENSOR FEED'}
              </span>
              {detectionResult && !detectionResult.isRava ? (
                <span className="text-[10px] font-mono text-red-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                  NON-RAVA DETECTED
                </span>
              ) : (
                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  TARGET LOCKED
                </span>
              )}
            </div>

            {/* Simulated CV viewfinder */}
            <div className={`relative rounded-xl overflow-hidden border bg-black aspect-[4/3] group transition-colors ${
              detectionResult && !detectionResult.isRava
                ? 'border-red-500/80 shadow-[0_0_20px_rgba(239,68,68,0.25)]'
                : 'border-neutral-800'
            }`}>
              <img
                src={customImage || getPresetPreviewUrl(selectedPreset.id)}
                alt="Rava target preview"
                className="w-full h-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
              />

              {/* Non-Rava Overlay Banner */}
              {detectionResult && !detectionResult.isRava && (
                <div className="absolute inset-0 bg-red-950/80 backdrop-blur-[2px] flex flex-col items-center justify-center p-4 text-center z-20 pointer-events-none">
                  <div className="text-3xl font-black text-red-400 drop-shadow-lg">
                    എന്തുവാടേ ഇത്? 😭
                  </div>
                  <div className="text-xs font-mono text-red-200 mt-1 font-bold tracking-wider">
                    ZERO RAVA PARTICLES DETECTED
                  </div>
                  <div className="text-[10px] text-red-300/80 mt-1 max-w-[220px]">
                    Ammachi optical sensors detected an alien non-rava object!
                  </div>
                </div>
              )}

              {/* High-tech CV Grid Overlays */}
              <div className="absolute inset-0 pointer-events-none p-3 flex flex-col justify-between z-10">
                <div className="flex justify-between items-start text-[10px] font-mono text-amber-400/80 bg-neutral-950/60 px-2 py-1 rounded backdrop-blur-xs">
                  <span>ROI: {detectionResult && !detectionResult.isRava ? '0.0%' : '94.2%'}</span>
                  <span>{detectionResult && !detectionResult.isRava ? 'ANOMALY: DETECTED' : 'DIFFUSION: ACTIVE'}</span>
                </div>

                {/* Simulated Computer Vision Bounding Boxes */}
                {(!detectionResult || detectionResult.isRava) && (
                  <div className="relative w-full h-24">
                    <div className="absolute top-2 left-6 border border-amber-400/80 w-12 h-10 rounded-xs flex items-start justify-end p-0.5">
                      <span className="text-[8px] font-mono text-amber-300 bg-black/80 px-0.5">#0412</span>
                    </div>
                    <div className="absolute bottom-2 right-8 border border-emerald-400/80 w-16 h-12 rounded-xs flex items-start justify-end p-0.5">
                      <span className="text-[8px] font-mono text-emerald-300 bg-black/80 px-0.5">#9831</span>
                    </div>
                    <div className="absolute top-6 right-16 border border-yellow-400/60 w-8 h-8 rounded-xs"></div>
                    {/* Crosshairs center */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 border border-white/30 rounded-full flex items-center justify-center">
                      <div className="w-1 h-1 bg-amber-400 rounded-full"></div>
                    </div>
                  </div>
                )}

                <div className="text-[9px] font-mono text-neutral-400 flex justify-between bg-neutral-950/70 px-2 py-1 rounded">
                  <span>RES: 4K SEMOLINA-VISION</span>
                  <span>KAALI-THETA: 1.618</span>
                </div>
              </div>
            </div>

            {customImage && (
              <button
                onClick={() => {
                  setCustomImage(null);
                  setDetectionResult(null);
                  setCustomImageName('');
                }}
                className="w-full text-center text-xs text-amber-400 hover:underline flex items-center justify-center gap-1 py-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                Reset image
              </button>
            )}
          </div>
        </div>

        {/* Disclaimer Checkbox (MANDATORY TO UNLOCK) */}
        <div className="mt-6 pt-6 border-t border-neutral-800">
          <label
            id="terms-checkbox-label"
            className="flex items-start gap-3 cursor-pointer select-none group"
          >
            <input
              id="mandatory-rava-disclaimer"
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => {
                setTermsAccepted(e.target.checked);
                sound.playKeyClick();
              }}
              className="mt-1 h-4 w-4 rounded border-neutral-700 bg-neutral-950 text-amber-500 focus:ring-amber-500/40 focus:ring-offset-0 cursor-pointer accent-amber-500"
            />
            <div className="text-xs leading-relaxed text-neutral-300">
              <span className="font-semibold text-neutral-100">Mandatory Rava Waiver:</span>{' '}
              <em>
                &ldquo;I understand RavaNet™ is not responsible for missing rava grains,
                emotional distress, or upma-related disappointment.&rdquo;
              </em>
            </div>
          </label>
        </div>

        {/* Hero Button with 5-Second Hold Easter Egg */}
        <div className="mt-6">
          <div className="relative">
            <button
              id="analyze-my-rava-btn"
              onClick={handleAnalyzeClick}
              onMouseDown={startHold}
              onMouseUp={cancelHold}
              onMouseLeave={cancelHold}
              onTouchStart={startHold}
              onTouchEnd={cancelHold}
              className="w-full relative overflow-hidden py-4 px-6 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-2.5 shadow-lg bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-neutral-950 cursor-pointer active:scale-[0.99] shadow-amber-500/20"
            >
              {/* Progress bar fill for the 5-sec hold easter egg */}
              {holdTimerProgress > 0 && (
                <div
                  className="absolute left-0 top-0 bottom-0 bg-yellow-300/40 transition-all pointer-events-none"
                  style={{ width: `${holdTimerProgress}%` }}
                />
              )}

              <Sparkles className="w-5 h-5 animate-spin-slow text-neutral-950" />
              <span>
                {patienceEggTriggered
                  ? "🌾 Patience. Rava respects patience."
                  : isUltraMode
                  ? "Analyze My Rava (ULTRA SLOT MODE)"
                  : "Analyze My Rava"}
              </span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {!customImage && (
            <p className="text-center text-xs text-neutral-400 font-mono mt-2">
              📸 Upload your rava vessel photo or click Analyze to upload.
            </p>
          )}

          {patienceEggTriggered && (
            <p className="text-center text-xs text-yellow-300 font-mono mt-2 animate-bounce">
              ✨ Easter Egg Unlocked: Ammachi has blessed your vessel with +500 patience grains!
            </p>
          )}
        </div>
      </div>

      {/* Small Popup Modal: Upload Image Required */}
      {showUploadRequiredModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-neutral-900 border border-amber-500/50 rounded-2xl p-6 max-w-sm w-full shadow-2xl relative text-center">
            <button
              onClick={() => setShowUploadRequiredModal(false)}
              className="absolute top-3 right-3 p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="w-14 h-14 rounded-full bg-amber-500/10 border-2 border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto mb-3">
              <Camera className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1.5">
              Upload Image Required
            </h3>
            <p className="text-xs text-neutral-300 leading-relaxed mb-5">
              You haven&apos;t uploaded an image yet! Please upload a photo of your rava vessel or grain sample to run the Kaali-Theta scan.
            </p>
            <div className="space-y-2">
              <button
                onClick={() => {
                  setShowUploadRequiredModal(false);
                  fileInputRef.current?.click();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs font-mono flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-lg shadow-amber-500/20"
              >
                <UploadCloud className="w-4 h-4" />
                Upload Image Now
              </button>
              <button
                onClick={() => {
                  setShowUploadRequiredModal(false);
                  handlePresetSelect(RAVA_PRESETS[0]);
                  setCustomImage(getPresetPreviewUrl(RAVA_PRESETS[0].id));
                  setDetectionResult({
                    isRava: true,
                    ravaScore: 98,
                    dominantColor: '#d97706',
                    reason: "Ammachi's Verified Batch",
                  });
                }}
                className="w-full py-2 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-mono transition-colors cursor-pointer"
              >
                Or Use Ammachi&apos;s Sample Batch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Small Popup Modal: Non-Rava Reaction (എന്തുവാടേ ഇത്? 😭) */}
      {showNonRavaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-neutral-900 border-2 border-red-500/80 rounded-2xl p-6 max-w-sm w-full shadow-2xl relative text-center">
            <button
              onClick={() => setShowNonRavaModal(false)}
              className="absolute top-3 right-3 p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="text-4xl mb-2 select-none animate-bounce">😭</div>
            <h3 className="text-3xl font-black text-red-400 mb-1 tracking-tight">
              എന്തുവാടേ ഇത്? 😭
            </h3>
            <div className="inline-block px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/40 text-[10px] font-mono mb-3 font-bold">
              WRONG IMAGE DETECTED • 0% RAVA
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed mb-4">
              Ammachi inspected this image and went: <strong className="text-white">“Bruh... എന്തുവാടേ ഇത്?” 😭</strong> Our Kaali-Theta optical scan verified 0 grains of rava in this photo. Please upload a real photo of rava grains, sooji, or semolina!
            </p>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => sound.playBruhAudio()}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold text-xs font-mono flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer shadow-md"
              >
                <span>🔊 Replay &quot;Bruh&quot; Sound</span>
              </button>
              <button
                onClick={() => {
                  setShowNonRavaModal(false);
                  fileInputRef.current?.click();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-red-500 hover:bg-red-400 text-neutral-950 font-bold text-xs font-mono flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-lg shadow-red-500/20"
              >
                <UploadCloud className="w-4 h-4" />
                Upload Real Rava Photo
              </button>
              <button
                onClick={() => setShowNonRavaModal(false)}
                className="w-full py-2 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 text-xs font-mono transition-colors cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
