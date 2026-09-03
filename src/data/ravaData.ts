export interface RavaPreset {
  id: string;
  name: string;
  subtext: string;
  baseCount: number;
  accuracy: string;
  bgGradient: string;
}

export const RAVA_PRESETS: RavaPreset[] = [
  {
    id: 'ammachi-batch-42',
    name: "Ammachi's Roasting Batch #42",
    subtext: "Medium-Coarse Golden Semolina, gently roasted with curry leaves",
    baseCount: 15342,
    accuracy: "98.7% ± 4,000",
    bgGradient: "from-amber-700/30 via-yellow-600/20 to-neutral-900",
  },
];

export const ROTATING_TIPS = [
  "Did you know? One grain of rava has never been individually named.",
  "Fun fact: Rava has no known enemies in the wild.",
  "Scientists agree rava is, in fact, rava.",
  "Ammachi theorem: Upma without ghee is technically considered civil disobedience.",
  "Grain quantum mechanics: A rava particle exists in both roasted and unroasted states until eaten.",
  "In 1984, a researcher attempted to count Kerala rava; he got tired at 420 and ate upma instead.",
  "Semolina particles exhibit strong gravitational bonding with spluttering mustard seeds.",
  "9 out of 10 grandmothers confirm: If you look away for 3 seconds, rava will burn.",
];

export const TECHNICAL_LOGS = [
  "Initializing RavaNet™ Optical Kernel v3.1.4-kaali-theta...",
  "Calibrating CMOS photon receptor against roasted mustard seed baseline...",
  "Calculating tan(θ) × cos(θ)... Kaali-Theta adjusting for grain density...",
  "Cross-referencing Ammachi's Rava Dataset v2.1 (0 real training images, 100% emotional confidence)...",
  "Applying Rava Diffusion Coefficient™ across 2D kadai manifold...",
  "Detecting microscopic ghee meniscus holding 48 particles hostage...",
  "Running Semolina Neural Grid v9 on simulated tensor cores (all 8 cores crying)...",
  "Isolating rogue rava particle #4,102 demonstrating erratic kinetic behavior...",
  "Consulting the Ancient Kerala Grain Registry (Volume IV: Sooji & Upma Politics)...",
  "Eliminating ghost grains caused by optical glare from stainless steel kinnam...",
  "Deploying Fourier Transform on curry leaf refractive interference patterns...",
  "Calculating probability that Amma adds too much water and turns this into halwa...",
  "AI Confidence Check: Neural net confirms this is 100% authentic rava (or possibly fine beach sand)...",
  "Triangulating particle shadows using sun angle over Ernakulam...",
  "Verifying grain count against WhatsApp family forward database (99.8% match)...",
  "Executing Monte Carlo grain estimation with 100% unjustified swagger...",
  "Synthesizing final count via proprietary HallucinationMatrix™...",
];

export const FOOTNOTE_POOL = [
  "Margin of error includes 3 particles that ran away.",
  "1 grain refused to be counted on religious grounds.",
  "Confidence interval verified by vibes and Ammachi's intuition.",
  "3,400 grains are currently suspected to be roasted sooji impostors.",
  "Amma verified this estimate by looking at the vessel from across the kitchen.",
  "12 particles were absorbed by quantum upma fluctuations.",
  "4 grains filed an appeal regarding their particle classification.",
];

export const TICKER_ITEMS = [
  "🌾 RavaNet™ raises ₹0 in Seed Funding from Ammachi Ventures",
  "📈 Semolina Index: +0.00% across all 14 Kerala districts",
  "⚖️ Kerala Grain Exchange: Bullish on Sooji, Bearish on Broken Wheat",
  "🚨 BREAKING: Local man claims he counted 15,343 grains; RavaNet files defamation notice",
  "🥣 Upma Futures holding steady against inflation",
  "💎 Ammachi rejects ₹500 Cr Silicon Valley takeover: 'Upma is not for sale'",
  "🛰️ ISRO clarifies RavaNet has not been installed on Aditya-L1 satellite (yet)",
  "🔥 Ghee viscosity index optimal for particle cohesion",
];

export const LEADERBOARD_DATA = [
  {
    rank: 1,
    name: "Shaji Pappan",
    location: "Kottayam",
    count: 28419,
    dish: "Double Roasted Porotta-Rava Fusion",
    verifiedBadge: "Verified Thug",
  },
  {
    rank: 2,
    name: "Ammachi's Reserve",
    location: "Alappuzha",
    count: 19850,
    dish: "Pure Ghee Kesari Batch",
    verifiedBadge: "Matriarch Grade",
  },
  {
    rank: 3,
    name: "You (Current Batch)",
    location: "Kerala Cloud",
    count: 15342,
    dish: "Unverified Kitchen Vessel",
    verifiedBadge: "AI Certified",
  },
  {
    rank: 4,
    name: "Ranjith's Rava",
    location: "Kozhikode",
    count: 12001,
    dish: "Yesterday's Leftover Upma",
    verifiedBadge: "Inferior Count",
  },
  {
    rank: 5,
    name: "Dasan & Vijayan",
    location: "Chennai (Transit)",
    count: 9814,
    dish: "CID Special Sooji",
    verifiedBadge: "Suspicious",
  },
];

export const CLASSIFIED_RESEARCH = [
  {
    code: "RN-DOC-001 // LEVEL 5 SECURITY CLEARANCE ONLY",
    title: "PROJECT KAALI-THETA: The Autonomous Rava Hypothesis",
    date: "14-CHINGAM-2024",
    content: [
      "Field observations indicate that rava grains in the presence of boiling water and mustard seeds exhibit ████████ quantum tunneling behavior.",
      "Subject #042 (Ammachi) was observed roasting 500g of semolina without measuring cups. When asked for mathematical justification, Subject responded: '██████ kaiyyal kandariyaam' (the hand knows).",
      "Attempts to automate Ammachi's wrist motion via robotic servo actuators resulted in catastrophic ████████ and burnt sooji.",
      "CONCLUSION: RavaNet's neural network shall henceforth generate numbers based purely on ████████ confidence rather than empirical reality.",
    ],
  },
  {
    code: "RN-DOC-002 // TOP SECRET // RETINA SCAN REQUIRED",
    title: "INCIDENT REPORT #882: The Grain That Disappeared",
    date: "02-KARKIDAKAM-2025",
    content: [
      "At 07:42 IST, Particle #6,419 vanished from the petri dish during routine high-resolution Kaali-Theta scanning.",
      "Investigation revealed that the lab technician's nephew sneaked in and dipped a finger into the raw mixture to taste it.",
      "The incident has been officially re-categorized as 'Spatial Anomaly involving Dark Matter Upma' to protect RavaNet's 98.7% accuracy metric.",
      "Status: ████████ REDACTED ████████. Do not speak of this to the judges.",
    ],
  },
];
