/**
 * Audio Synthesizer usando Web Audio API nativo.
 * No requiere archivos externos y funciona sin conexión / offline.
 */

let audioCtx: AudioContext | null = null;
let isAudioMuted = false;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    } catch {
      return null;
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    try {
      const res = audioCtx.resume();
      if (res && typeof res.catch === 'function') {
        res.catch(() => {});
      }
    } catch {
      // Silenciar si no hay dispositivo de audio disponible
    }
  }
  return audioCtx;
}

export function setMuted(muted: boolean) {
  isAudioMuted = muted;
}

export function getMuted(): boolean {
  return isAudioMuted;
}

export function playTone(freq = 520, type: OscillatorType = 'sine', duration = 0.15, volume = 0.2) {
  if (isAudioMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {
    // Ignorar errores de interacción en navegadores móviles estrictos
  }
}

export const playBeep = playTone;

/** Sonido de tic-tac de reloj normal */
export function playTick() {
  playTone(800, 'sine', 0.05, 0.12);
}

/** Sonido de alerta de cuenta regresiva (últimos 3 segundos) */
export function playWarningTick(secondsLeft: number) {
  const pitch = secondsLeft === 1 ? 1200 : secondsLeft === 2 ? 1050 : 920;
  playTone(pitch, 'triangle', 0.12, 0.25);
}

/** Sonido triunfal de fin de temporizador (¡TIEMPO!) */
export function playTimerFinished() {
  if (isAudioMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  // Secuencia de campanas alegres
  const notes = [
    { freq: 523.25, time: 0, dur: 0.12 },     // C5
    { freq: 659.25, time: 0.12, dur: 0.12 },  // E5
    { freq: 783.99, time: 0.24, dur: 0.14 },  // G5
    { freq: 1046.50, time: 0.38, dur: 0.4 },  // C6
  ];

  notes.forEach(n => {
    setTimeout(() => {
      playTone(n.freq, 'triangle', n.dur, 0.3);
    }, n.time * 1000);
  });
}

/** Fanfarria de victoria al asignar puntos */
export function playFanfare() {
  if (isAudioMuted) return;
  setTimeout(() => playTone(440, 'triangle', 0.12, 0.25), 0);
  setTimeout(() => playTone(554, 'triangle', 0.12, 0.25), 110);
  setTimeout(() => playTone(659, 'triangle', 0.14, 0.28), 220);
  setTimeout(() => playTone(880, 'triangle', 0.38, 0.32), 340);
}

/** Click suave de interfaz */
export function playClick(freq = 420) {
  playTone(freq, 'sine', 0.06, 0.1);
}
