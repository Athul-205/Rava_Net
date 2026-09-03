import { YIPPEE_AUDIO_DATA_URI } from './yippeeAudio';
import { ENNU_AUDIO_DATA_URI } from './ennuAudio';
import { BRUH_AUDIO_DATA_URI } from './bruhAudio';

/**
 * Web Audio API & Sound effects for RavaNet™
 * 100% client-side, zero external assets or network dependencies.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;
  private yippeeBuffer: AudioBuffer | null = null;
  private ennuBuffer: AudioBuffer | null = null;
  private bruhBuffer: AudioBuffer | null = null;
  private isPreloading: boolean = false;
  private isPreloadingEnnu: boolean = false;
  private isPreloadingBruh: boolean = false;
  private fallbackAudio: HTMLAudioElement | null = null;
  private fallbackEnnuAudio: HTMLAudioElement | null = null;
  private fallbackBruhAudio: HTMLAudioElement | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      // Pre-warm audio and pre-decode on first user interaction
      const warmUp = () => {
        this.initCtx();
        this.preloadYippee();
        this.preloadEnnu();
        this.preloadBruh();
        window.removeEventListener('pointerdown', warmUp);
        window.removeEventListener('keydown', warmUp);
        window.removeEventListener('touchstart', warmUp);
      };
      window.addEventListener('pointerdown', warmUp, { passive: true });
      window.addEventListener('keydown', warmUp, { passive: true });
      window.addEventListener('touchstart', warmUp, { passive: true });

      // Pre-instantiate standby HTMLAudioElement as immediate fallback
      if (typeof Audio !== 'undefined') {
        try {
          this.fallbackAudio = new Audio(YIPPEE_AUDIO_DATA_URI);
          this.fallbackAudio.preload = 'auto';
          this.fallbackAudio.volume = 1.0;
          this.fallbackAudio.load();

          this.fallbackEnnuAudio = new Audio(ENNU_AUDIO_DATA_URI);
          this.fallbackEnnuAudio.preload = 'auto';
          this.fallbackEnnuAudio.volume = 1.0;
          this.fallbackEnnuAudio.load();

          this.fallbackBruhAudio = new Audio(BRUH_AUDIO_DATA_URI);
          this.fallbackBruhAudio.preload = 'auto';
          this.fallbackBruhAudio.volume = 1.0;
          this.fallbackBruhAudio.load();
        } catch {
          // ignore
        }
      }
    }
  }

  public initCtx(): AudioContext | null {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  // Pre-decode audio buffer into RAM so playback has 0ms latency
  public async preloadYippee() {
    if (this.yippeeBuffer || this.isPreloading || typeof window === 'undefined') return;
    this.isPreloading = true;
    try {
      const ctx = this.initCtx();
      if (!ctx) return;

      const base64 = YIPPEE_AUDIO_DATA_URI.split(',')[1];
      if (!base64) return;
      const binaryString = window.atob(base64);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      ctx.decodeAudioData(
        bytes.buffer.slice(0),
        (decoded) => {
          this.yippeeBuffer = decoded;
        },
        () => {
          // Decode error handled gracefully by fallback
        }
      );
    } catch {
      // Fallback audio element used if decode fails
    } finally {
      this.isPreloading = false;
    }
  }

  // Pre-decode Ennu audio buffer into RAM so playback has 0ms latency with 100% original quality
  public async preloadEnnu() {
    if (this.ennuBuffer || this.isPreloadingEnnu || typeof window === 'undefined') return;
    this.isPreloadingEnnu = true;
    try {
      const ctx = this.initCtx();
      if (!ctx) return;

      const base64 = ENNU_AUDIO_DATA_URI.split(',')[1];
      if (!base64) return;
      const binaryString = window.atob(base64);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      ctx.decodeAudioData(
        bytes.buffer.slice(0),
        (decoded) => {
          this.ennuBuffer = decoded;
        },
        (err) => {
          console.warn('Ennu audio decode notice:', err);
        }
      );
    } catch (e) {
      console.warn('Ennu preload notice:', e);
    } finally {
      this.isPreloadingEnnu = false;
    }
  }

  // Pre-decode Bruh audio buffer into RAM so playback has 0ms latency with 100% original quality
  public async preloadBruh() {
    if (this.bruhBuffer || this.isPreloadingBruh || typeof window === 'undefined') return;
    this.isPreloadingBruh = true;
    try {
      const ctx = this.initCtx();
      if (!ctx) return;

      const base64 = BRUH_AUDIO_DATA_URI.split(',')[1];
      if (!base64) return;
      const binaryString = window.atob(base64);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      ctx.decodeAudioData(
        bytes.buffer.slice(0),
        (decoded) => {
          this.bruhBuffer = decoded;
        },
        (err) => {
          console.warn('Bruh audio decode notice:', err);
        }
      );
    } catch (e) {
      console.warn('Bruh preload notice:', e);
    } finally {
      this.isPreloadingBruh = false;
    }
  }

  // Mechanical keyboard click
  playKeyClick() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Randomize pitch slightly for organic typing feel
      const freqs = [1200, 1400, 1600, 1800, 1100];
      const freq = freqs[Math.floor(Math.random() * freqs.length)];
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.025);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.028);
    } catch {
      // Audio errors safely ignored
    }
  }

  // Record scratch / glitch sound for the 60% glitch-back moment
  playRecordScratch() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      
      // White noise buffer for scratch vinyl friction
      const bufferSize = this.ctx.sampleRate * 0.45;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2400, now);
      filter.frequency.exponentialRampToValueAtTime(300, now + 0.4);
      filter.Q.setValueAtTime(4.0, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.linearRampToValueAtTime(0.28, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.42);

      // Pitch sweep screech oscillator
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1800, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.38);

      oscGain.gain.setValueAtTime(0.12, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.connect(oscGain);
      oscGain.connect(this.ctx.destination);

      noise.start(now);
      osc.start(now);
      noise.stop(now + 0.45);
      osc.stop(now + 0.45);
    } catch {
      // Safe fallback
    }
  }

  // Tea break chime for 69% pause
  playTeaChime() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      [523.25, 659.25, 783.99].forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);

        gain.gain.setValueAtTime(0.08, now + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.12 + 0.7);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.75);
      });
    } catch {
      // Safe fallback
    }
  }

  // 99% Alert blip
  playWarningBlip() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(750, now);
      osc.frequency.setValueAtTime(500, now + 0.12);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.32);
    } catch {
      // Safe fallback
    }
  }

  // Windows XP / Retro chord completion ding (100%)
  playCompletionDing() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // Classic chord arpeggio: C4, G4, C5, E5, G5
      const notes = [
        { freq: 261.63, delay: 0.0, dur: 1.6, vol: 0.14 },
        { freq: 392.00, delay: 0.08, dur: 1.5, vol: 0.15 },
        { freq: 523.25, delay: 0.16, dur: 1.8, vol: 0.16 },
        { freq: 659.25, delay: 0.24, dur: 2.0, vol: 0.18 },
        { freq: 1046.50, delay: 0.35, dur: 2.2, vol: 0.12 },
      ];

      notes.forEach(({ freq, delay, dur, vol }) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + delay);

        gain.gain.setValueAtTime(0.001, now + delay);
        gain.gain.linearRampToValueAtTime(vol, now + delay + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + dur);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + delay);
        osc.stop(now + delay + dur + 0.1);
      });
    } catch {
      // Safe fallback
    }
  }

  // Slot machine spinning click
  playSlotTick() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(600 + Math.random() * 400, now);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.02);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.025);
    } catch {
      // Safe fallback
    }
  }

  // Celebration fanfare / Confetti whoosh
  playConfettiBurst() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const freqs = [440, 554.37, 659.25, 880];
      freqs.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);
        gain.gain.setValueAtTime(0.1, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.45);
      });
    } catch {
      // Safe fallback
    }
  }

  // Celebration voice clip: "YIPPEE!" meme audio (instantaneous 0ms latency)
  playYippee() {
    if (!this.enabled) return;
    try {
      const ctx = this.initCtx();

      // Method 1 (Primary): Hardware-level AudioBuffer playback - absolute zero latency
      if (ctx && this.yippeeBuffer) {
        const source = ctx.createBufferSource();
        source.buffer = this.yippeeBuffer;
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(1.0, ctx.currentTime);
        source.connect(gain);
        gain.connect(ctx.destination);
        source.start(0);
        return;
      }

      // Method 2: Pre-instantiated standby audio element (zero initialization delay)
      if (this.fallbackAudio) {
        this.fallbackAudio.currentTime = 0;
        this.fallbackAudio.volume = 1.0;
        const p = this.fallbackAudio.play();
        if (p) {
          p.catch(() => {
            this.playConfettiBurst();
          });
        }
        // Trigger preload for next click
        this.preloadYippee();
        return;
      }

      // Method 3: Standard Audio constructor fallback
      if (typeof Audio !== 'undefined') {
        const audio = new Audio(YIPPEE_AUDIO_DATA_URI);
        audio.volume = 1.0;
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            this.playConfettiBurst();
          });
        }
      } else {
        this.playConfettiBurst();
      }
    } catch {
      this.playConfettiBurst();
    }
  }

  // Audio for "നിനക്ക് correct ariyanam enkil kuthi erunu angu ennu." 🌾
  // Plays at full uncompromised master quality (100% volume, zero dynamic compression)
  playEnnuAudio() {
    if (!this.enabled) return;
    try {
      const ctx = this.initCtx();

      // Ensure AudioContext is actively running (resume immediately if suspended)
      if (ctx && ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }

      // Method 1: Hardware-level AudioBuffer playback (Zero latency, uncompressed PCM quality)
      if (ctx && this.ennuBuffer) {
        const source = ctx.createBufferSource();
        source.buffer = this.ennuBuffer;
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(1.0, ctx.currentTime);
        source.connect(gain);
        gain.connect(ctx.destination);
        source.start(0);
        return;
      }

      // Method 2: HTMLAudioElement using static /sounds/ennu.mp3
      if (typeof Audio !== 'undefined') {
        const directAudio = new Audio('/sounds/ennu.mp3');
        directAudio.volume = 1.0;
        const playPromise = directAudio.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.warn('Direct audio play notice, attempting data URI:', err);
            if (this.fallbackEnnuAudio) {
              this.fallbackEnnuAudio.currentTime = 0;
              this.fallbackEnnuAudio.volume = 1.0;
              this.fallbackEnnuAudio.play().catch(() => {});
            } else {
              const b64Audio = new Audio(ENNU_AUDIO_DATA_URI);
              b64Audio.volume = 1.0;
              b64Audio.play().catch(() => {});
            }
          });
        }
        // Trigger background buffer preload for any subsequent click
        this.preloadEnnu();
        return;
      }
    } catch (e) {
      console.error('Ennu audio playback notice:', e);
    }
  }

  // Audio for "എന്തുവാടേ ഇത്? 😭" (Bruh meme sound effect)
  // Zero-latency instant playback at 320kbps master quality
  playBruhAudio() {
    if (!this.enabled) return;
    try {
      const ctx = this.initCtx();

      // Ensure AudioContext is actively running
      if (ctx && ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }

      // Method 1: Hardware-level AudioBuffer playback (Zero latency)
      if (ctx && this.bruhBuffer) {
        const source = ctx.createBufferSource();
        source.buffer = this.bruhBuffer;
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(1.0, ctx.currentTime);
        source.connect(gain);
        gain.connect(ctx.destination);
        source.start(0);
        return;
      }

      // Method 2: HTMLAudioElement using static /sounds/bruh.mp3 with data URI fallback
      if (typeof Audio !== 'undefined') {
        const directAudio = new Audio('/sounds/bruh.mp3');
        directAudio.volume = 1.0;
        const playPromise = directAudio.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.warn('Direct bruh audio play notice, attempting data URI:', err);
            if (this.fallbackBruhAudio) {
              this.fallbackBruhAudio.currentTime = 0;
              this.fallbackBruhAudio.volume = 1.0;
              this.fallbackBruhAudio.play().catch(() => {});
            } else {
              const b64Audio = new Audio(BRUH_AUDIO_DATA_URI);
              b64Audio.volume = 1.0;
              b64Audio.play().catch(() => {});
            }
          });
        }
        this.preloadBruh();
        return;
      }
    } catch (e) {
      console.error('Bruh audio playback notice:', e);
    }
  }

  // Melodramatic mournful sad violin / heartbreak chord for guilt-trip
  playHeartbreakChime() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // Sad descending minor notes: F4 -> Eb4 -> D4 -> Bb3
      const notes = [349.23, 311.13, 293.66, 233.08];
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.28);
        // Add subtle pitch droop (weeping vibrato)
        osc.frequency.linearRampToValueAtTime(freq * 0.96, now + idx * 0.28 + 0.35);

        gain.gain.setValueAtTime(0.001, now + idx * 0.28);
        gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.28 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.28 + 0.38);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + idx * 0.28);
        osc.stop(now + idx * 0.28 + 0.42);
      });
    } catch {
      // Safe fallback
    }
  }

  // Dramatic angry / spite thud for the 99,999 rage recalculate
  playAngrySlam() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(35, now + 0.4);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.45);
    } catch {
      // Safe fallback
    }
  }
}

export const sound = new SoundEngine();
