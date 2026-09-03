import React, { useRef, useState } from 'react';
import { X, Download, ShieldCheck, Printer, Sparkles } from 'lucide-react';
import { sound } from '../utils/sound';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    particleCount: number;
    accuracy: string;
    sampleName: string;
    footnote: string;
  } | null;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  const certRef = useRef<HTMLDivElement>(null);
  const [showCertEnnu, setShowCertEnnu] = useState<boolean>(false);

  if (!isOpen || !data) return null;

  const certificateNumber = `RN-2026-SOOJI-${data.particleCount.toString().padStart(6, '0')}`;
  const issueDate = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handleDownloadPNG = () => {
    sound.playKeyClick();
    // Render certificate to HTML5 Canvas for pristine PNG export
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 840;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background parchment gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 1200, 840);
    bgGrad.addColorStop(0, '#1c1917');
    bgGrad.addColorStop(0.5, '#292524');
    bgGrad.addColorStop(1, '#1c1917');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1200, 840);

    // Ornate Gold Border
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 14;
    ctx.strokeRect(30, 30, 1140, 780);

    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;
    ctx.strokeRect(45, 45, 1110, 750);

    // Corner flourishes
    ctx.fillStyle = '#f59e0b';
    const corners = [
      [50, 50],
      [1150, 50],
      [50, 790],
      [1150, 790],
    ];
    corners.forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, 12, 0, Math.PI * 2);
      ctx.fill();
    });

    // Header Title
    ctx.textAlign = 'center';
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 24px monospace';
    ctx.fillText('TINKERHUB USELESS PROJECTS // TEAM NEXA', 600, 110);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 44px Georgia, serif';
    ctx.fillText('CERTIFICATE OF AUTHENTICITY', 600, 170);

    ctx.fillStyle = '#d6d3d1';
    ctx.font = 'italic 20px Georgia, serif';
    ctx.fillText('Issued by the RavaNet™ Supreme Board of Grain Granulometry', 600, 210);

    // Decorative divider line
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(250, 235);
    ctx.lineTo(950, 235);
    ctx.stroke();

    // Body Text
    ctx.fillStyle = '#e7e5e4';
    ctx.font = '22px Georgia, serif';
    ctx.fillText('This strictly unverified document hereby certifies that the vessel known as', 600, 285);

    ctx.fillStyle = '#fde68a';
    ctx.font = 'bold 28px Georgia, serif';
    ctx.fillText(`"${data.sampleName}"`, 600, 335);

    ctx.fillStyle = '#e7e5e4';
    ctx.font = '22px Georgia, serif';
    ctx.fillText('has been optically examined and unequivocally determined to contain exactly', 600, 385);

    // Particle Number Banner
    ctx.fillStyle = '#0c0a09';
    ctx.fillRect(300, 415, 600, 95);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;
    ctx.strokeRect(300, 415, 600, 95);

    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 56px monospace';
    ctx.fillText(`${data.particleCount.toLocaleString()} PARTICLES`, 600, 482);

    // Accuracy & Footnote
    ctx.fillStyle = '#a8a29e';
    ctx.font = '18px monospace';
    ctx.fillText(`Accuracy Metric: ${data.accuracy} • Serial: ${certificateNumber}`, 600, 545);

    ctx.font = 'italic 18px Georgia, serif';
    ctx.fillText(`"${data.footnote}"`, 600, 600);

    // Signatures
    ctx.fillStyle = '#ffffff';
    ctx.font = 'italic 20px Georgia, serif';
    ctx.fillText('Dr. K. Rava Krishnan', 350, 710);
    ctx.font = '14px monospace';
    ctx.fillStyle = '#a8a29e';
    ctx.fillText('Head of Kaali-Theta Optics', 350, 735);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'italic 20px Georgia, serif';
    ctx.fillText('Ammachi (Senior Matriarch)', 850, 710);
    ctx.font = '14px monospace';
    ctx.fillStyle = '#a8a29e';
    ctx.fillText('Chief Executive Ghee Officer', 850, 735);

    // Trigger download
    const link = document.createElement('a');
    link.download = `RavaNet_Certificate_${data.particleCount}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div
      id="certificate-modal-overlay"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md p-3 sm:p-6"
    >
      <div className="min-h-full flex items-center justify-center py-6 sm:py-10">
        <div
          id="certificate-modal-card"
          className="relative w-full max-w-3xl bg-stone-950 border-4 border-amber-600/90 rounded-3xl p-4 sm:p-7 shadow-[0_0_50px_rgba(217,119,6,0.3)] my-auto animate-in zoom-in-95 duration-200"
        >
          {/* Clean Dedicated Top Bar - Eliminates any overlap with certificate content */}
          <div className="flex items-center justify-between pb-3.5 mb-3 px-1 border-b border-amber-500/20">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="font-bold tracking-wider uppercase truncate">
                RavaNet™ Official Granulometric Certification
              </span>
            </div>
            <button
              id="close-cert-top-btn"
              onClick={() => {
                sound.playKeyClick();
                onClose();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700 text-xs font-mono transition-colors shadow-sm shrink-0"
              title="Close Certificate"
            >
              <X className="w-4 h-4" />
              <span className="hidden sm:inline">Close</span>
            </button>
          </div>

          {/* Certificate Display Area */}
          <div
            ref={certRef}
            className="border-2 border-amber-500/60 p-5 sm:p-8 rounded-2xl bg-gradient-to-b from-stone-900 via-neutral-950 to-stone-900 text-center relative overflow-hidden font-certificate select-all"
          >
            {/* Watermark Background Seal */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none text-[180px]">
              🌾
            </div>

            <div className="space-y-1 mb-5">
              <div className="text-[10px] sm:text-[11px] font-mono tracking-widest text-amber-500 uppercase">
                TinkerHub Useless Projects • Team Nexa — Rava Division
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-wider uppercase">
                Certificate of Authenticity
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400 italic font-serif">
                Issued by the RavaNet™ Board of Grains &amp; Semolina Sciences
              </p>
            </div>

            {/* Decorative Divider */}
            <div className="w-48 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto my-3.5" />

            {/* Body Certification Text */}
            <p className="text-xs sm:text-sm text-neutral-300 max-w-lg mx-auto leading-relaxed">
              This document certifies that the scanned culinary vessel designated as:
            </p>
            <div className="text-lg sm:text-xl font-bold text-amber-300 my-2">
              &ldquo;{data.sampleName}&rdquo;
            </div>
            <p className="text-xs sm:text-sm text-neutral-300 max-w-lg mx-auto leading-relaxed">
              has been examined via Kaali-Theta optical triangulation and contains exactly:
            </p>

            {/* Prominent Particle Seal Box */}
            <div className="my-5 p-4 sm:p-5 bg-neutral-900/90 border border-amber-500 rounded-xl inline-block max-w-md w-full shadow-inner">
              <div className="text-3xl sm:text-5xl font-black text-amber-400 font-mono tracking-wider">
                {data.particleCount.toLocaleString()}
              </div>
              <div className="text-xs font-mono uppercase text-amber-200 mt-1 tracking-widest">
                INDIVIDUALLY HALLUCINATED GRAINS
              </div>
              <div className="text-[11px] font-mono text-neutral-400 mt-2 flex flex-wrap items-center justify-center gap-2">
                <span>Accuracy: {data.accuracy} • Verified by Vibes</span>
                <span>•</span>
                <button
                  id="cert-doubt-count-btn"
                  onClick={() => {
                    sound.playEnnuAudio();
                    setShowCertEnnu(true);
                  }}
                  className="text-amber-400 hover:text-amber-300 underline cursor-pointer"
                  title="Dispute grain count"
                >
                  Doubt count?
                </button>
              </div>

              {/* Dispute punchline banner with audio */}
              {showCertEnnu && (
                <div className="mt-3 p-3.5 rounded-xl bg-gradient-to-r from-amber-950/90 to-red-950/70 border border-amber-500/60 text-center animate-in fade-in">
                  <div className="text-sm sm:text-base font-black text-amber-200 font-sans leading-snug">
                    “നിനക്ക് correct ariyanam enkil kuthi erunu angu ennu.” 🌾
                  </div>
                  <div className="text-[11px] text-neutral-300 italic mt-1">
                    (If you want the correct count, sit down and count yourself!)
                  </div>
                  <div className="mt-2.5 flex items-center justify-center gap-2.5">
                    <button
                      onClick={() => sound.playEnnuAudio()}
                      className="px-2.5 py-1 rounded text-xs font-mono bg-amber-500 text-neutral-950 font-bold hover:bg-amber-400 transition-all active:scale-95 cursor-pointer"
                    >
                      🔊 Replay Audio
                    </button>
                    <button
                      onClick={() => setShowCertEnnu(false)}
                      className="text-xs text-neutral-400 hover:text-neutral-200 underline cursor-pointer"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Signatures & Serial */}
            <div className="grid grid-cols-2 gap-4 mt-6 pt-5 border-t border-neutral-800 text-left font-mono">
              <div>
                <div className="text-xs font-bold text-neutral-200">Dr. K. Rava Krishnan</div>
                <div className="text-[10px] text-neutral-500">Director of Grain Geometry</div>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-neutral-200">Ammachi</div>
                <div className="text-[10px] text-neutral-500">Chief Executive Ghee Officer</div>
              </div>
            </div>

            <div className="mt-4 text-[10px] font-mono text-neutral-500 flex justify-between items-center">
              <span>Serial: {certificateNumber}</span>
              <span>Date: {issueDate}</span>
            </div>
          </div>

          {/* Action Controls */}
          <div className="mt-5 flex flex-col sm:flex-row items-center justify-end gap-3">
            <button
              onClick={() => {
                sound.playKeyClick();
                onClose();
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-neutral-800 text-xs font-mono text-neutral-300 hover:bg-neutral-900 transition-colors"
            >
              Close
            </button>
            <button
              id="download-png-cert-btn"
              onClick={handleDownloadPNG}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs font-mono shadow-lg transition-all active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Download PNG Certificate</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
