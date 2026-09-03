export type ScreenState = 'upload' | 'processing' | 'result';

export interface RavaAnalysisResult {
  particleCount: number;
  accuracy: string;
  footnote: string;
  malayalamPunchline: string;
  timestamp: string;
  certificateId: string;
  sampleName: string;
  imageUrl: string;
  isUltraMode: boolean;
  confidenceScore: number;
  breakdown: {
    wholeGrains: number;
    microParticles: number;
    rogueEscapedGrains: number;
    soojiImpostors: number;
  };
  leaderboardRank: number;
  comparisonName: string;
  comparisonCount: number;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  location: string;
  count: number;
  dish: string;
  verifiedBadge: string;
}
