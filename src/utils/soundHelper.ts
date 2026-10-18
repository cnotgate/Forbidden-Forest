// Web Audio API procedural sound synthesizer (Zero external dependencies)

class SoundManager {
	private ctx: AudioContext | null = null;
	private isMuted: boolean = false;

	constructor() {
		try {
			this.isMuted = localStorage.getItem('sound_muted') === 'true';
		} catch {
			this.isMuted = false;
		}
	}

	private initContext() {
		if (!this.ctx && typeof window !== 'undefined') {
			const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
			if (AudioCtx) {
				this.ctx = new AudioCtx();
			}
		}
		if (this.ctx && this.ctx.state === 'suspended') {
			this.ctx.resume();
		}
	}

	public toggleMute(): boolean {
		this.isMuted = !this.isMuted;
		try {
			localStorage.setItem('sound_muted', this.isMuted ? 'true' : 'false');
		} catch {}
		return this.isMuted;
	}

	public getMuted(): boolean {
		return this.isMuted;
	}

	// Soft cozy bubble pop when clicking buttons
	public playClick() {
		if (this.isMuted) return;
		this.initContext();
		if (!this.ctx) return;

		try {
			const osc = this.ctx.createOscillator();
			const gain = this.ctx.createGain();

			osc.type = 'sine';
			osc.frequency.setValueAtTime(440, this.ctx.currentTime);
			osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.08);

			gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
			gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

			osc.connect(gain);
			gain.connect(this.ctx.destination);

			osc.start();
			osc.stop(this.ctx.currentTime + 0.08);
		} catch {}
	}

	// Cozy harp chime when completing a quest or pass
	public playQuestComplete() {
		if (this.isMuted) return;
		this.initContext();
		if (!this.ctx) return;

		try {
			const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
			notes.forEach((freq, idx) => {
				if (!this.ctx) return;
				const osc = this.ctx.createOscillator();
				const gain = this.ctx.createGain();

				osc.type = 'triangle';
				osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.07);

				gain.gain.setValueAtTime(0, this.ctx.currentTime + idx * 0.07);
				gain.gain.linearRampToValueAtTime(0.15, this.ctx.currentTime + idx * 0.07 + 0.02);
				gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.07 + 0.35);

				osc.connect(gain);
				gain.connect(this.ctx.destination);

				osc.start(this.ctx.currentTime + idx * 0.07);
				osc.stop(this.ctx.currentTime + idx * 0.07 + 0.35);
			});
		} catch {}
	}

	// Triumphant level up / boss defeat fanfare
	public playLevelUp() {
		if (this.isMuted) return;
		this.initContext();
		if (!this.ctx) return;

		try {
			const notes = [440, 554.37, 659.25, 880, 1108.73]; // A4, C#5, E5, A5, C#6
			notes.forEach((freq, idx) => {
				if (!this.ctx) return;
				const osc = this.ctx.createOscillator();
				const gain = this.ctx.createGain();

				osc.type = 'sine';
				osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.09);

				gain.gain.setValueAtTime(0, this.ctx.currentTime + idx * 0.09);
				gain.gain.linearRampToValueAtTime(0.2, this.ctx.currentTime + idx * 0.09 + 0.03);
				gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.09 + 0.5);

				osc.connect(gain);
				gain.connect(this.ctx.destination);

				osc.start(this.ctx.currentTime + idx * 0.09);
				osc.stop(this.ctx.currentTime + idx * 0.09 + 0.5);
			});
		} catch {}
	}
}

export const sounds = new SoundManager();
