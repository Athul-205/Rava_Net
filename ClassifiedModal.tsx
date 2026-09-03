import React from 'react';
import { X, ShieldAlert, Lock, AlertTriangle } from 'lucide-react';
import { CLASSIFIED_RESEARCH } from '../data/ravaData';
import { sound } from '../utils/sound';

interface ClassifiedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ClassifiedModal: React.FC<ClassifiedModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="classified-modal-overlay"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md p-3 sm:p-6"
    >
      <div className="min-h-full flex items-center justify-center py-6 sm:py-8">
        <div className="relative w-full max-w-2xl bg-neutral-950 border-2 border-red-600/80 rounded-2xl p-6 sm:p-8 shadow-[0_0_50px_rgba(220,38,38,0.25)] my-auto">
        {/* Top Warning Banner */}
        <div className="flex items-center justify-between border-b border-red-900/60 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-500/10 text-red-500 border border-red-500/30">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-red-400 bg-red-950/80 px-2 py-0.5 rounded border border-red-800">
                  TOP SECRET // EYES ONLY
                </span>
                <span className="text-[10px] font-mono text-neutral-400">
                  LEVEL 5 RESEARCH DISCLOSURE
                </span>
              </div>
              <h3 className="text-lg font-bold text-white font-mono mt-1">
                Classified RavaNet™ Lab Dossier
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

        {/* Easter Egg Intro */}
        <div className="p-3 rounded-lg bg-red-950/30 border border-red-900/40 text-xs text-red-300 font-mono mb-6 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
          <div>
            <strong>Easter Egg Discovered!</strong> You clicked the logo 5 times.
            The following internal lab notes document RavaNet&apos;s initial failure to measure grain quantities with anything resembling scientific accuracy. Hover over blacked-out bars to de-classify.
          </div>
        </div>

        {/* Redacted Documents */}
        <div className="space-y-6 font-mono text-xs">
          {CLASSIFIED_RESEARCH.map((doc, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-neutral-900/70 border border-neutral-800 space-y-3"
            >
              <div className="flex items-center justify-between text-[11px] text-neutral-400 border-b border-neutral-800 pb-2">
                <span className="text-red-400 font-bold">{doc.code}</span>
                <span>{doc.date}</span>
              </div>
              <h4 className="font-bold text-neutral-200 text-sm">{doc.title}</h4>
              <div className="space-y-2 text-neutral-300 leading-relaxed">
                {doc.content.map((p, pIdx) => {
                  // Render blacked out spans
                  const parts = p.split('████████');
                  return (
                    <p key={pIdx}>
                      {parts.map((part, i) => (
                        <React.Fragment key={i}>
                          {part}
                          {i < parts.length - 1 && (
                            <span
                              className="redacted cursor-help px-1 mx-0.5 bg-neutral-800 text-neutral-800 hover:text-white hover:bg-neutral-700 transition-all rounded text-[11px]"
                              title="Declassified on hover"
                            >
                              [REDACTED EVIDENCE]
                            </span>
                          )}
                        </React.Fragment>
                      ))}
                    </p>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-neutral-800 text-right">
          <button
            onClick={() => {
              sound.playKeyClick();
              onClose();
            }}
            className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-mono text-xs font-bold transition-colors"
          >
            Acknowledge & Close File
          </button>
        </div>
        </div>
      </div>
    </div>
  );
};
