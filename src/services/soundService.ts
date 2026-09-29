/**
 * Interactive Sound System using Web Audio API
 * Generates futuristic, subtle synthesized sounds without external MP3 dependencies.
 * Respects user preferences and prevents autoplay before user interaction.
 */

class SoundService {
  private static instance: SoundService;
  private ctx: AudioContext | null = null;
  private isSoundOn: boolean = true;
  private isAmbientOn: boolean = false;
  private ambientOsc1: OscillatorNode | null = null;
  private ambientOsc2: OscillatorNode | null = null;
  private ambientGain: GainNode | null = null;
  private hasInteracted: boolean = false;

  private constructor() {
    if (typeof window !== 'undefined') {
      try {
        const savedSound = localStorage.getItem('transit_sound_enabled');
        this.isSoundOn = savedSound !== null ? savedSound === 'true' : true;

        const savedAmbient = localStorage.getItem('transit_ambient_enabled');
        this.isAmbientOn = savedAmbient === 'true';
      } catch {
        this.isSoundOn = true;
        this.isAmbientOn = false;
      }
    }
  }

  public static getInstance(): SoundService {
    if (!SoundService.instance) {
      SoundService.instance = new SoundService();
    }
    return SoundService.instance;
  }

  private initContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    this.hasInteracted = true;
    return this.ctx;
  }

  public registerUserInteraction(): void {
    this.initContext();
    if (this.isAmbientOn && !this.ambientGain) {
      this.startAmbientMusic();
    }
  }

  public isSoundEnabled(): boolean {
    return this.isSoundOn;
  }

  public isAmbientEnabled(): boolean {
    return this.isAmbientOn;
  }

  public toggleSound(forceState?: boolean): boolean {
    this.isSoundOn = forceState !== undefined ? forceState : !this.isSoundOn;
    try {
      localStorage.setItem('transit_sound_enabled', String(this.isSoundOn));
    } catch {}

    if (!this.isSoundOn) {
      this.stopAmbientMusic();
    } else {
      this.playClick();
    }
    return this.isSoundOn;
  }

  public toggleAmbientMusic(forceState?: boolean): boolean {
    this.isAmbientOn = forceState !== undefined ? forceState : !this.isAmbientOn;
    try {
      localStorage.setItem('transit_ambient_enabled', String(this.isAmbientOn));
    } catch {}

    if (this.isAmbientOn) {
      this.startAmbientMusic();
    } else {
      this.stopAmbientMusic();
    }
    return this.isAmbientOn;
  }

  /**
   * Soft futuristic electronic click
   */
  public playClick(): void {
    if (!this.isSoundOn) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.06);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.07);
    } catch {}
  }

  /**
   * Smooth futuristic whoosh for category transition / card flip
   */
  public playWhoosh(): void {
    if (!this.isSoundOn) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(520, now + 0.12);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.25);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.07, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.26);
    } catch {}
  }

  /**
   * Notification / chime sound
   */
  public playChime(): void {
    if (!this.isSoundOn) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      [1046.5, 1318.5].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);

        gain.gain.setValueAtTime(0.06, now + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.32);
      });
    } catch {}
  }

  /**
   * Warp / teleport transition chord
   */
  public playWarp(): void {
    if (!this.isSoundOn) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const baseFreqs = [220, 277.18, 329.63]; // A Major chord

      baseFreqs.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 0.35);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.05, now + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.42);
      });
    } catch {}
  }

  /**
   * Ambient generative cosmic background drone (very subtle, low volume)
   */
  private startAmbientMusic(): void {
    if (!this.isSoundOn || !this.isAmbientOn) return;
    const ctx = this.initContext();
    if (!ctx) return;

    this.stopAmbientMusic();

    try {
      const now = ctx.currentTime;
      this.ambientGain = ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.001, now);
      this.ambientGain.gain.linearRampToValueAtTime(0.025, now + 3); // Very gentle 2.5% max volume

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(280, now);

      this.ambientOsc1 = ctx.createOscillator();
      this.ambientOsc1.type = 'sine';
      this.ambientOsc1.frequency.setValueAtTime(108, now); // Root drone A2

      this.ambientOsc2 = ctx.createOscillator();
      this.ambientOsc2.type = 'triangle';
      this.ambientOsc2.frequency.setValueAtTime(162, now); // Perfect fifth E3

      this.ambientOsc1.connect(filter);
      this.ambientOsc2.connect(filter);
      filter.connect(this.ambientGain);
      this.ambientGain.connect(ctx.destination);

      this.ambientOsc1.start();
      this.ambientOsc2.start();
    } catch {}
  }

  private stopAmbientMusic(): void {
    try {
      if (this.ambientGain && this.ctx) {
        this.ambientGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 1);
        setTimeout(() => {
          this.ambientOsc1?.stop();
          this.ambientOsc2?.stop();
          this.ambientOsc1 = null;
          this.ambientOsc2 = null;
          this.ambientGain = null;
        }, 1100);
      }
    } catch {}
  }
}

export const soundService = SoundService.getInstance();
