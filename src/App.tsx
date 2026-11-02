import React, { useState, useEffect, useRef } from 'react';
import { Trophy, Dices, Plus, Minus, Trash2, Camera, Sparkles, RefreshCw, Volume2, VolumeX, Home, TreePine, Globe, Award } from 'lucide-react';
import { Reto, Player, Place } from './types';
import { RETOS } from './data/retos';
import { Confetti, ConfettiHandle } from './components/Confetti';
import { ChallengeTimer } from './components/ChallengeTimer';
import { playBeep, playFanfare, playClick, setMuted, getMuted } from './utils/audio';

const DEFAULT_PLAYERS: Player[] = [
  { id: 1, name: "Lucas", avatar: "🦁", isCustomImg: false, score: 0 },
  { id: 2, name: "Sofía", avatar: "🚀", isCustomImg: false, score: 0 },
];

const AVATAR_OPTIONS = ['🦁', '🚀', '🦄', '🦖', '⚡', '🍕', '🐶', '🥷', '🐼', '🤖', '👑', '⭐'];

export default function App() {
  const [activeTab, setActiveTab] = useState<'retos' | 'jugadores'>('retos');
  const [filter, setFilter] = useState<Place>('todos');
  const [players, setPlayers] = useState<Player[]>(() => {
    try {
      const saved = localStorage.getItem('retokids_players');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return DEFAULT_PLAYERS;
  });

  const [currentReto, setCurrentReto] = useState<Reto>(() => {
    return RETOS[Math.floor(Math.random() * RETOS.length)];
  });

  // Custom optional timer for challenges that don't have explicit time
  const [customTimerSeconds, setCustomTimerSeconds] = useState<number | null>(null);

  // Formulario de agregar jugador
  const [newPlayerName, setNewPlayerName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('🦁');
  const [customPhoto, setCustomPhoto] = useState<string | null>(null);

  // Audio mute
  const [isMuted, setIsMutedState] = useState(false);

  // Confetti ref
  const confettiRef = useRef<ConfettiHandle>(null);

  // Guardar jugadores en localStorage
  useEffect(() => {
    try {
      localStorage.setItem('retokids_players', JSON.stringify(players));
    } catch {
      // Ignore storage quota errors
    }
  }, [players]);

  // Manejo de sonido
  const handleToggleSound = () => {
    const next = !isMuted;
    setIsMutedState(next);
    setMuted(next);
  };

  // Obtener lista filtrada
  const getFilteredList = (placeFilter: Place) => {
    if (placeFilter === 'todos') return RETOS;
    return RETOS.filter((r) => r.place === 'todos' || r.place === placeFilter);
  };

  // Siguiente reto
  const handleNextChallenge = (specificFilter?: Place) => {
    playClick(440);
    const activeFilter = specificFilter || filter;
    const list = getFilteredList(activeFilter);
    if (list.length === 0) return;

    // Escoger uno distinto al actual si hay más de 1
    let next: Reto;
    if (list.length > 1) {
      const remaining = list.filter((r) => r.id !== currentReto.id);
      next = remaining[Math.floor(Math.random() * remaining.length)];
    } else {
      next = list[0];
    }

    setCustomTimerSeconds(null);
    setCurrentReto(next);
  };

  const handleSetFilter = (newFilter: Place) => {
    setFilter(newFilter);
    handleNextChallenge(newFilter);
  };

  // Sumar punto rápido al participante
  const handleAwardPoint = (playerId: number) => {
    setPlayers((prev) =>
      prev.map((p) => (p.id === playerId ? { ...p, score: p.score + 1 } : p))
    );

    if (confettiRef.current) {
      confettiRef.current.burst();
    }
    playFanfare();

    // Pequeño retardo para celebrar y pasar al siguiente
    setTimeout(() => {
      handleNextChallenge();
    }, 700);
  };

  // Modificar puntuación manual
  const modifyScore = (playerId: number, delta: number) => {
    if (delta > 0) {
      playBeep(650, 'sine', 0.1);
    } else {
      playClick(320);
    }
    setPlayers((prev) =>
      prev.map((p) =>
        p.id === playerId ? { ...p, score: Math.max(0, p.score + delta) } : p
      )
    );
  };

  // Eliminar jugador
  const handleDeletePlayer = (playerId: number) => {
    if (window.confirm('¿Seguro que deseas eliminar a este participante?')) {
      playClick(300);
      setPlayers((prev) => prev.filter((p) => p.id !== playerId));
    }
  };

  // Reiniciar todos los marcadores
  const handleResetScores = () => {
    if (window.confirm('¿Deseas reiniciar los puntos de todos a cero?')) {
      setPlayers((prev) => prev.map((p) => ({ ...p, score: 0 })));
      playClick(350);
    }
  };

  // Agregar nuevo jugador
  const handleAddPlayer = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanName = newPlayerName.trim();
    if (!cleanName) return;

    const newPlayer: Player = {
      id: Date.now(),
      name: cleanName,
      avatar: customPhoto || selectedEmoji,
      isCustomImg: !!customPhoto,
      score: 0,
    };

    setPlayers((prev) => [...prev, newPlayer]);
    setNewPlayerName('');
    setCustomPhoto(null);
    playBeep(700, 'triangle', 0.2);
  };

  // Subir imagen para avatar
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 100;
        canvas.height = 100;
        ctx?.drawImage(img, 0, 0, 100, 100);
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
        setCustomPhoto(compressedBase64);
        playBeep(600, 'sine', 0.08);
      };
      if (typeof event.target?.result === 'string') {
        img.src = event.target.result;
      }
    };
    reader.readAsDataURL(file);
  };

  // Duración activa para el temporizador (ya sea la del reto o una personalizada)
  const activeTimerSeconds = currentReto.timeSeconds || customTimerSeconds;

  // Jugadores ordenados por puntuación
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="flex flex-col min-h-dvh max-w-lg mx-auto bg-slate-50 text-slate-800 relative selection:bg-indigo-500 selection:text-white pb-safe">
      {/* Componente de Confeti */}
      <Confetti ref={confettiRef} />

      {/* Cabecera / Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md px-4 py-3 border-b border-slate-200 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2">
          <div className="font-black text-xl tracking-tight text-indigo-700 flex items-center gap-1.5">
            <span className="text-2xl drop-shadow-xs">⚡</span>
            <span>RetoKids</span>
          </div>
          <span className="bg-indigo-50 text-indigo-700 text-xs font-black px-2.5 py-0.5 rounded-full border border-indigo-200/70">
            +{RETOS.length} Retos
          </span>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-slate-100 p-1 rounded-xl gap-1 border border-slate-200/80">
          <button
            type="button"
            onClick={() => {
              playClick(400);
              setActiveTab('retos');
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === 'retos'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Retos 🎲
          </button>
          <button
            type="button"
            onClick={() => {
              playClick(400);
              setActiveTab('jugadores');
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1 ${
              activeTab === 'jugadores'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span>Puntos</span>
          </button>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="flex-1 p-4 flex flex-col gap-4 overflow-y-auto">
        {/* ===================== VISTA 1: RETOS ===================== */}
        {activeTab === 'retos' && (
          <div className="flex flex-col flex-1 gap-3.5">
            {/* Barra de filtros de lugar */}
            <div className="flex items-center justify-between gap-1.5 bg-slate-200/70 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => handleSetFilter('todos')}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  filter === 'todos'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Todos</span>
              </button>
              <button
                type="button"
                onClick={() => handleSetFilter('casa')}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  filter === 'casa'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Home className="w-3.5 h-3.5" />
                <span>En Casa</span>
              </button>
              <button
                type="button"
                onClick={() => handleSetFilter('calle')}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  filter === 'calle'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <TreePine className="w-3.5 h-3.5" />
                <span>En Calle</span>
              </button>
            </div>

            {/* Tarjeta de Reto */}
            <div
              key={currentReto.id}
              className="bg-white rounded-3xl p-5 border-2 border-indigo-100 shadow-md flex-1 flex flex-col justify-between items-center text-center gap-3.5 animate-pop-in relative"
            >
              {/* Badges de Categoría, Lugar y Tiempo */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                <span className="bg-indigo-100 text-indigo-700 text-xs font-black uppercase px-3 py-1 rounded-full">
                  {currentReto.cat}
                </span>

                <span className="bg-amber-100 text-amber-800 text-xs font-black px-3 py-1 rounded-full">
                  {currentReto.place === 'casa'
                    ? '🏠 En Casa'
                    : currentReto.place === 'calle'
                    ? '🌳 En Calle'
                    : '🌍 Donde Sea'}
                </span>

                {currentReto.timeSeconds && (
                  <span className="bg-rose-100 text-rose-700 text-xs font-black px-3 py-1 rounded-full flex items-center gap-1 border border-rose-200">
                    <span>⏱️</span>
                    <span>{currentReto.timeSeconds}s</span>
                  </span>
                )}
              </div>

              {/* Emoji central */}
              <div className="text-6xl drop-shadow-md select-none transform hover:scale-110 transition-transform">
                {currentReto.emoji}
              </div>

              {/* Título y Descripción del Reto */}
              <div className="flex flex-col gap-2">
                <h2 className="text-xl font-black text-slate-900 leading-tight">
                  {currentReto.title}
                </h2>
                <p className="text-base font-semibold text-slate-600 leading-relaxed max-w-sm mx-auto">
                  {currentReto.desc}
                </p>
              </div>

              {/* ============================================================== */}
              {/* SECCIÓN DEL TEMPORIZADOR (SI EL RETO LLEVA TIEMPO O SE ACTIVA) */}
              {/* ============================================================== */}
              {activeTimerSeconds ? (
                <div className="w-full my-1">
                  <ChallengeTimer
                    initialSeconds={activeTimerSeconds}
                    challengeId={`${currentReto.id}-${activeTimerSeconds}`}
                    onFinished={() => {
                      if (confettiRef.current) confettiRef.current.burst();
                    }}
                    isSoundMuted={isMuted}
                    onToggleSound={handleToggleSound}
                  />
                </div>
              ) : (
                /* Opción para retos libres de añadir un temporizador voluntario */
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/80">
                  <span>⏱️ ¿Quieres retar el tiempo?</span>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => setCustomTimerSeconds(10)}
                      className="px-2 py-0.5 rounded-md bg-white border border-slate-300 hover:border-indigo-500 font-extrabold text-indigo-600 active:scale-95"
                    >
                      10s
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustomTimerSeconds(15)}
                      className="px-2 py-0.5 rounded-md bg-white border border-slate-300 hover:border-indigo-500 font-extrabold text-indigo-600 active:scale-95"
                    >
                      15s
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustomTimerSeconds(30)}
                      className="px-2 py-0.5 rounded-md bg-white border border-slate-300 hover:border-indigo-500 font-extrabold text-indigo-600 active:scale-95"
                    >
                      30s
                    </button>
                  </div>
                </div>
              )}

              {/* Panel de Asignar Punto Rápido */}
              <div className="w-full pt-1 border-t border-slate-100 flex flex-col gap-2">
                <div className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center justify-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  <span>¿Quién completó el reto? (+1 punto)</span>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2 max-h-24 overflow-y-auto px-1 py-1">
                  {players.length === 0 ? (
                    <button
                      type="button"
                      onClick={() => setActiveTab('jugadores')}
                      className="text-xs font-bold text-indigo-600 hover:underline"
                    >
                      + Añadir participantes en la pestaña Puntos
                    </button>
                  ) : (
                    players.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleAwardPoint(p.id)}
                        className="bg-white hover:bg-emerald-50 active:bg-emerald-100 border-2 border-slate-200 hover:border-emerald-500 rounded-full px-3 py-1.5 text-xs font-black text-slate-800 flex items-center gap-1.5 shadow-xs active:scale-95 transition-all cursor-pointer"
                        title={`Asignar punto a ${p.name}`}
                      >
                        {p.isCustomImg ? (
                          <img
                            src={p.avatar}
                            alt={p.name}
                            className="w-5 h-5 rounded-full object-cover border border-slate-300"
                          />
                        ) : (
                          <span className="text-base">{p.avatar}</span>
                        )}
                        <span>{p.name}</span>
                        <span className="text-emerald-700 font-black ml-0.5">+1</span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Botón Siguiente Reto */}
            <button
              type="button"
              onClick={() => handleNextChallenge()}
              className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-black text-base py-3.5 px-4 rounded-2xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer"
            >
              <Dices className="w-5 h-5 animate-spin-hover" />
              <span>🎲 ¡Siguiente Reto Aleatorio!</span>
            </button>
          </div>
        )}

        {/* ===================== VISTA 2: MARCADOR / JUGADORES ===================== */}
        {activeTab === 'jugadores' && (
          <div className="flex flex-col gap-4">
            {/* Formulario Agregar Jugador */}
            <div className="bg-white rounded-3xl p-4 border-2 border-dashed border-indigo-200 shadow-sm flex flex-col gap-3">
              <div className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Nuevo Participante
              </div>

              <form onSubmit={handleAddPlayer} className="flex gap-2">
                <input
                  type="text"
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                  placeholder="Nombre (ej. Lucas, Sofía...)"
                  maxLength={15}
                  className="flex-1 px-3.5 py-2.5 rounded-xl border-2 border-slate-200 font-bold text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
                />
                <button
                  type="submit"
                  disabled={!newPlayerName.trim()}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-black text-sm active:scale-95 transition-all cursor-pointer shadow-xs"
                >
                  Añadir
                </button>
              </form>

              {/* Selector de Emoji o Foto */}
              <div className="flex flex-col gap-1.5">
                <div className="text-xs font-bold text-slate-500">Elige un avatar:</div>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {AVATAR_OPTIONS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => {
                        setSelectedEmoji(emoji);
                        setCustomPhoto(null);
                        playClick(500);
                      }}
                      className={`text-xl p-2 rounded-xl transition-all cursor-pointer ${
                        selectedEmoji === emoji && !customPhoto
                          ? 'bg-indigo-100 ring-2 ring-indigo-500 scale-105'
                          : 'bg-slate-100 hover:bg-slate-200'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subir foto opcional */}
              <label className="flex items-center justify-center gap-2 p-2 rounded-xl border-2 border-dashed border-slate-300 hover:border-indigo-400 text-xs font-bold text-slate-600 cursor-pointer bg-slate-50 hover:bg-indigo-50/50 transition-colors">
                <Camera className="w-4 h-4 text-indigo-600" />
                <span>
                  {customPhoto ? '✓ Foto personalizada cargada' : '📷 O sube una foto desde tu galería'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Podio / Lista de Jugadores */}
            <div className="flex items-center justify-between px-1">
              <h3 className="font-black text-base text-slate-900 flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span>Marcador de Puntos</span>
              </h3>

              {players.length > 0 && (
                <button
                  type="button"
                  onClick={handleResetScores}
                  className="text-xs font-bold text-slate-500 hover:text-rose-600 flex items-center gap-1 active:scale-95"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Reiniciar marcadores</span>
                </button>
              )}
            </div>

            {/* Tarjetas de Jugadores */}
            <div className="flex flex-col gap-2.5">
              {sortedPlayers.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-sm font-semibold">
                  Aún no hay participantes añadidos. ¡Escribe su nombre arriba para empezar!
                </div>
              ) : (
                sortedPlayers.map((player, index) => {
                  const isTop = index === 0 && player.score > 0;
                  const medal =
                    index === 0 && player.score > 0
                      ? '🥇'
                      : index === 1 && player.score > 0
                      ? '🥈'
                      : index === 2 && player.score > 0
                      ? '🥉'
                      : null;

                  return (
                    <div
                      key={player.id}
                      className={`bg-white rounded-2xl p-3 px-4 border-2 flex items-center justify-between shadow-xs transition-all ${
                        isTop ? 'border-amber-300 bg-amber-50/30' : 'border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div className="relative">
                          <div className="w-12 h-12 rounded-full bg-indigo-50 border-2 border-indigo-200 flex items-center justify-center text-2xl overflow-hidden shadow-inner">
                            {player.isCustomImg ? (
                              <img
                                src={player.avatar}
                                alt={player.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span>{player.avatar}</span>
                            )}
                          </div>
                          {medal && (
                            <span className="absolute -top-1 -right-1 text-sm drop-shadow-xs">
                              {medal}
                            </span>
                          )}
                        </div>

                        {/* Nombre y Puntos */}
                        <div>
                          <div className="font-extrabold text-slate-900 text-base leading-tight flex items-center gap-1.5">
                            <span>{player.name}</span>
                            {isTop && (
                              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin-slow" />
                            )}
                          </div>
                          <div className="text-xs font-bold text-slate-500">
                            {player.score} {player.score === 1 ? 'punto' : 'puntos'}
                          </div>
                        </div>
                      </div>

                      {/* Controles de puntuación */}
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => modifyScore(player.id, -1)}
                          className="w-8 h-8 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 font-black flex items-center justify-center active:scale-90 transition-all border border-rose-200"
                          title="Restar 1 punto"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>

                        <div className="font-black text-lg text-indigo-700 min-w-8 text-center">
                          {player.score}
                        </div>

                        <button
                          type="button"
                          onClick={() => modifyScore(player.id, 1)}
                          className="w-8 h-8 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-black flex items-center justify-center active:scale-90 transition-all border border-emerald-200"
                          title="Sumar 1 punto"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeletePlayer(player.id)}
                          className="p-1.5 ml-1 text-slate-400 hover:text-rose-600 transition-colors"
                          title="Eliminar jugador"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer discreto con control de sonido y versión */}
      <footer className="px-4 py-2 text-center text-xs text-slate-400 flex items-center justify-between border-t border-slate-100 bg-white/50">
        <div className="flex items-center gap-1">
          <span>⚡ RetoKids</span>
          <span>•</span>
          <span className="text-slate-500 font-medium">Juego de desafíos activos</span>
        </div>
        <button
          type="button"
          onClick={handleToggleSound}
          className="flex items-center gap-1 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-500" /> : <Volume2 className="w-3.5 h-3.5 text-indigo-600" />}
          <span>{isMuted ? 'Mudo' : 'Sonido'}</span>
        </button>
      </footer>
    </div>
  );
}
