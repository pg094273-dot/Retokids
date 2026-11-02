import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Plus, Minus, Volume2, VolumeX, CheckCircle2 } from 'lucide-react';
import { playTick, playWarningTick, playTimerFinished, playClick } from '../utils/audio';

interface ChallengeTimerProps {
  initialSeconds: number;
  challengeId: string;
  onFinished?: () => void;
  isSoundMuted: boolean;
  onToggleSound: () => void;
}

export const ChallengeTimer: React.FC<ChallengeTimerProps> = ({
  initialSeconds,
  challengeId,
  onFinished,
  isSoundMuted,
  onToggleSound,
}) => {
  const [totalSeconds, setTotalSeconds] = useState<number>(initialSeconds);
  const [timeLeft, setTimeLeft] = useState<number>(initialSeconds);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [hasFinished, setHasFinished] = useState<boolean>(false);

  const timerRef = useRef<number | null>(null);

  // Reset timer whenever the challenge changes
  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setTotalSeconds(initialSeconds);
    setTimeLeft(initialSeconds);
    setIsRunning(false);
    setHasFinished(false);
  }, [challengeId, initialSeconds]);

  // Main countdown interval
  useEffect(() => {
    if (isRunning) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            setIsRunning(false);
            setHasFinished(true);
            playTimerFinished();
            if (onFinished) onFinished();
            return 0;
          }

          const next = prev - 1;
          if (next <= 3 && next > 0) {
            playWarningTick(next);
          } else {
            playTick();
          }
          return next;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, onFinished]);

  const handleStartPause = () => {
    playClick(500);
    if (hasFinished) {
      // Si ya terminó, reiniciar y empezar de nuevo
      setTimeLeft(totalSeconds);
      setHasFinished(false);
      setIsRunning(true);
    } else {
      setIsRunning((prev) => !prev);
    }
  };

  const handleReset = () => {
    playClick(380);
    setIsRunning(false);
    setHasFinished(false);
    setTimeLeft(totalSeconds);
  };

  const handleAdjustTime = (delta: number) => {
    playClick(440);
    const newTotal = Math.max(3, Math.min(180, totalSeconds + delta));
    setTotalSeconds(newTotal);
    if (!isRunning) {
      setTimeLeft(newTotal);
      setHasFinished(false);
    } else {
      setTimeLeft((prev) => Math.max(1, prev + delta));
    }
  };

  // Porcentaje restante para el círculo SVG
  const progressRatio = totalSeconds > 0 ? timeLeft / totalSeconds : 0;
  const strokeRadius = 42;
  const circumference = 2 * Math.PI * strokeRadius;
  const strokeDashoffset = circumference * (1 - progressRatio);

  // Esquema de colores según urgencia
  const isDanger = timeLeft <= 3 && isRunning;
  const isWarning = timeLeft <= 5 && !isDanger;

  const ringColor = hasFinished
    ? 'text-emerald-500'
    : isDanger
    ? 'text-rose-500'
    : isWarning
    ? 'text-amber-500'
    : 'text-indigo-600';

  const badgeBg = hasFinished
    ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
    : isDanger
    ? 'bg-rose-50 border-rose-300 text-rose-800 animate-pulse'
    : isWarning
    ? 'bg-amber-50 border-amber-300 text-amber-800'
    : 'bg-indigo-50 border-indigo-200 text-indigo-900';

  return (
    <div className={`w-full rounded-2xl border-2 p-3.5 transition-all shadow-sm ${badgeBg} flex flex-col items-center gap-2.5`}>
      {/* Barra superior del temporizador: Título y controles auxiliares */}
      <div className="w-full flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5 font-extrabold text-xs uppercase tracking-wider">
          <span className="text-base">⏱️</span>
          <span>Temporizador de Reto</span>
          <span className="bg-white/80 px-2 py-0.5 rounded-full text-[11px] font-black border border-current/20">
            {totalSeconds}s
          </span>
        </div>

        <div className="flex items-center gap-1">
          {/* Botón de sonido */}
          <button
            type="button"
            onClick={onToggleSound}
            aria-label={isSoundMuted ? "Activar sonido" : "Silenciar sonido"}
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 bg-white/70 hover:bg-white active:scale-95 transition-all"
            title={isSoundMuted ? "Sonido desactivado" : "Sonido activado"}
          >
            {isSoundMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-indigo-600" />}
          </button>
        </div>
      </div>

      {/* Visualizador Circular y Tiempo */}
      <div className="flex items-center justify-center gap-4 py-1">
        {/* Reloj SVG Circular */}
        <div className="relative w-24 h-24 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
            {/* Círculo de fondo */}
            <circle
              cx="50"
              cy="50"
              r={strokeRadius}
              stroke="currentColor"
              strokeWidth="7"
              className="text-slate-200/70"
              fill="transparent"
            />
            {/* Círculo de progreso dinámico */}
            <circle
              cx="50"
              cy="50"
              r={strokeRadius}
              stroke="currentColor"
              strokeWidth="7"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className={`transition-all duration-300 ${ringColor}`}
              fill="transparent"
            />
          </svg>

          {/* Contador digital en el centro */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            {hasFinished ? (
              <span className="text-2xl animate-bounce">⏰</span>
            ) : (
              <span
                className={`font-black tracking-tight leading-none ${
                  timeLeft >= 100 ? 'text-2xl' : 'text-3xl'
                } ${isDanger ? 'scale-110 text-rose-600 font-black' : ''} transition-transform`}
              >
                {timeLeft}
                <span className="text-xs font-bold block text-slate-500">seg</span>
              </span>
            )}
          </div>
        </div>

        {/* Controles de Acción Principal */}
        <div className="flex flex-col gap-2">
          {/* Botón principal Iniciar / Pausar */}
          <button
            type="button"
            onClick={handleStartPause}
            className={`px-5 py-2.5 rounded-xl font-black text-sm text-white shadow-md active:scale-95 flex items-center justify-center gap-2 transition-all cursor-pointer ${
              hasFinished
                ? 'bg-emerald-600 hover:bg-emerald-500'
                : isRunning
                ? 'bg-amber-500 hover:bg-amber-600'
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {hasFinished ? (
              <>
                <RotateCcw className="w-4 h-4" />
                <span>¡Repetir!</span>
              </>
            ) : isRunning ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Pausar</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>{timeLeft < totalSeconds ? 'Continuar' : '¡Iniciar!'}</span>
              </>
            )}
          </button>

          {/* Botones secundarios: Reiniciar y +/- 5s */}
          <div className="flex items-center gap-1.5 justify-center">
            <button
              type="button"
              onClick={handleReset}
              disabled={timeLeft === totalSeconds && !hasFinished}
              className="p-2 rounded-lg bg-white/90 text-slate-700 hover:bg-white disabled:opacity-40 disabled:pointer-events-none active:scale-90 transition-all border border-slate-200/80 shadow-xs"
              title="Reiniciar a tiempo original"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => handleAdjustTime(-5)}
              className="px-2 py-1.5 rounded-lg bg-white/90 text-slate-700 hover:bg-white active:scale-90 transition-all border border-slate-200/80 text-xs font-bold shadow-xs flex items-center gap-0.5"
              title="Restar 5 segundos"
            >
              <Minus className="w-3 h-3" />
              <span>5s</span>
            </button>

            <button
              type="button"
              onClick={() => handleAdjustTime(5)}
              className="px-2 py-1.5 rounded-lg bg-white/90 text-slate-700 hover:bg-white active:scale-90 transition-all border border-slate-200/80 text-xs font-bold shadow-xs flex items-center gap-0.5"
              title="Añadir 5 segundos"
            >
              <Plus className="w-3 h-3" />
              <span>5s</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mensaje de estado descriptivo */}
      <div className="text-center font-bold text-xs">
        {hasFinished ? (
          <div className="flex items-center justify-center gap-1 text-emerald-700 font-extrabold animate-pulse">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>¡TIEMPO TERMINADO! ¿Quién lo logró? 👇</span>
          </div>
        ) : isRunning ? (
          <span className="text-slate-600">
            {isDanger ? '🚨 ¡Últimos segundos! ¡Rápido!' : '⏱️ ¡El tiempo está corriendo! ¡Tú puedes!'}
          </span>
        ) : timeLeft < totalSeconds ? (
          <span className="text-amber-700">Pausado en {timeLeft}s</span>
        ) : (
          <span className="text-slate-500">Pulsa <strong>¡Iniciar!</strong> cuando estés listo</span>
        )}
      </div>
    </div>
  );
};
