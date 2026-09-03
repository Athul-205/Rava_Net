import React from 'react';
import { TICKER_ITEMS } from '../data/ravaData';

export const FundingTicker: React.FC = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-neutral-900/95 border-t border-neutral-800 backdrop-blur-md h-9 overflow-hidden flex items-center select-none">
      <div className="bg-amber-500 text-neutral-950 px-3 h-full flex items-center font-mono font-bold text-[11px] uppercase tracking-wider shrink-0 z-10 shadow-md">
        MARKET PULSE
      </div>
      <div className="flex whitespace-nowrap animate-[marquee_28s_linear_infinite] hover:[animation-play-state:paused]">
        {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, idx) => (
          <span
            key={idx}
            className="inline-flex items-center text-xs text-neutral-300 font-mono mx-6"
          >
            {item}
            <span className="ml-6 text-amber-500/40">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
};
