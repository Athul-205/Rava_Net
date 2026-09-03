/**
 * 🌾 RavaNet™ — AI-Powered Rava Particle Counter
 * Master Build Prompt | TinkerHub Useless Projects | Team Nexa — Rava Division
 */

import React, { useState, useEffect, useRef } from 'react';
import { ScreenState } from './types';
import { Navbar } from './components/Navbar';
import { UploadScreen } from './components/UploadScreen';
import { ProcessingScreen } from './components/ProcessingScreen';
import { ResultScreen } from './components/ResultScreen';
import { CertificateModal } from './components/CertificateModal';
import { ClassifiedModal } from './components/ClassifiedModal';
import { PitchDeckModal } from './components/PitchDeckModal';
import { FundingTicker } from './components/FundingTicker';
import { triggerRavaConfetti } from './utils/confetti';
import { sound } from './utils/sound';

export default function App() {
  const [screen, setScreen] = useState<ScreenState>('upload');
  const [selectedSample, setSelectedSample] = useState<{ name: string; imageUrl: string }>({
    name: "Ammachi's Roasting Batch #42",
    imageUrl: '',
  });

  const [isUltraMode, setIsUltraMode] = useState<boolean>(false);
  const [logoClicks, setLogoClicks] = useState<number>(0);
  const logoResetTimerRef = useRef<number | null>(null);

  // Emotional recalculate tracking ("THE APP HAS FEELINGS" GAG)
  const [recalculateCount, setRecalculateCount] = useState<number>(0);
  const [forcedCount, setForcedCount] = useState<number | null>(null);

  // Modals
  const [showPitchDeck, setShowPitchDeck] = useState<boolean>(false);
  const [showClassified, setShowClassified] = useState<boolean>(false);
  const [certificateData, setCertificateData] = useState<{
    particleCount: number;
    accuracy: string;
    sampleName: string;
    footnote: string;
  } | null>(null);

  // Easter egg toast notification
  const [easterEggToast, setEasterEggToast] = useState<string | null>(null);

  // Keystroke listener for secret code: "ravaravarava"
  useEffect(() => {
    let keyBuffer = '';
    let lastKeyTime = Date.now();

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is focused on an input element
      const targetTag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (targetTag === 'input' || targetTag === 'textarea') {
        return;
      }

      const now = Date.now();
      // If gap is more than 2 seconds, clear buffer
      if (now - lastKeyTime > 2000) {
        keyBuffer = '';
      }
      lastKeyTime = now;

      keyBuffer += e.key.toLowerCase();

      if (keyBuffer.includes('ravaravarava')) {
        keyBuffer = '';
        triggerRavaConfetti();
        sound.playConfettiBurst();
        setEasterEggToast('🌾 EASTER EGG: "ravaravarava" DETECTED! 10,000 BONUS GRAINS UNLOCKED! 🌾');
        setTimeout(() => setEasterEggToast(null), 4000);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 5x Logo Click handler
  const handleLogoClick = () => {
    sound.playKeyClick();
    const nextCount = logoClicks + 1;
    setLogoClicks(nextCount);

    if (logoResetTimerRef.current) {
      window.clearTimeout(logoResetTimerRef.current);
    }

    if (nextCount >= 5) {
      setShowClassified(true);
      setLogoClicks(0);
      sound.playWarningBlip();
    } else {
      logoResetTimerRef.current = window.setTimeout(() => {
        setLogoClicks(0);
      }, 3000);
    }
  };

  const startAnalysis = (sample: { name: string; imageUrl: string }) => {
    setSelectedSample(sample);
    setRecalculateCount(0);
    setForcedCount(null);
    setScreen('processing');
  };

  const handleProcessingComplete = () => {
    setScreen('result');
  };

  const handleRecalculate = (attempt: number, forced?: number) => {
    setRecalculateCount(attempt);
    setForcedCount(forced ?? null);
    setScreen('processing');
  };

  const handleResetToUpload = () => {
    sound.playKeyClick();
    setRecalculateCount(0);
    setForcedCount(null);
    setScreen('upload');
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col justify-between selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Navigation */}
      <Navbar
        onLogoClick={handleLogoClick}
        logoClickCount={logoClicks}
        onOpenPitch={() => setShowPitchDeck(true)}
        isUltraMode={isUltraMode}
        onToggleUltra={() => {
          sound.playKeyClick();
          setIsUltraMode((prev) => !prev);
          if (!isUltraMode) {
            sound.playSlotTick();
            setEasterEggToast('⚡ ULTRA MODE ENGAGED: SLOT ENUMERATION ACTIVE (8M+ PARTICLES)');
            setTimeout(() => setEasterEggToast(null), 3000);
          }
        }}
      />

      {/* Easter Egg Toast Alert */}
      {easterEggToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full bg-amber-500 text-neutral-950 font-mono font-bold text-xs shadow-2xl animate-bounce border-2 border-amber-300">
          {easterEggToast}
        </div>
      )}

      {/* Main Screen Router */}
      <main className="flex-1 pb-16 flex items-center justify-center">
        {screen === 'upload' && (
          <UploadScreen
            onStartAnalysis={startAnalysis}
            isUltraMode={isUltraMode}
          />
        )}

        {screen === 'processing' && (
          <ProcessingScreen
            sampleName={selectedSample.name}
            imageUrl={selectedSample.imageUrl}
            onComplete={handleProcessingComplete}
            isUltraMode={isUltraMode}
            recalculateCount={recalculateCount}
            forcedParticleCount={forcedCount}
          />
        )}

        {screen === 'result' && (
          <ResultScreen
            sampleName={selectedSample.name}
            imageUrl={selectedSample.imageUrl}
            isUltraMode={isUltraMode}
            onRecalculate={handleRecalculate}
            onReset={handleResetToUpload}
            onOpenCertificate={(data) => setCertificateData(data)}
            recalculateCount={recalculateCount}
            forcedCount={forcedCount}
          />
        )}
      </main>

      {/* Modals */}
      <CertificateModal
        isOpen={!!certificateData}
        onClose={() => setCertificateData(null)}
        data={certificateData}
      />

      <ClassifiedModal
        isOpen={showClassified}
        onClose={() => setShowClassified(false)}
      />

      <PitchDeckModal
        isOpen={showPitchDeck}
        onClose={() => setShowPitchDeck(false)}
      />

      {/* Fake Series A Funding & Market Ticker */}
      <FundingTicker />
    </div>
  );
}
