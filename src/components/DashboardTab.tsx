import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Calendar,
  Clock,
  CheckCircle2,
  Trophy,
  ArrowRight,
  Sparkles,
  Heart,
  Star,
  Coffee,
  Flame,
  Edit3,
  MapPin,
  Scroll,
  BookOpen,
  Sword,
  Compass,
  Check,
  Lock,
  RefreshCw
} from 'lucide-react';
import { formatDateIndo, getDaysRemaining, isPhaseMatchingRotation, sortPhasesChronologically } from '../utils/dateHelper';
import { sounds } from '../utils/soundHelper';
import { getAllQuotesForMascot } from '../utils/companionQuotes';
import confetti from 'canvas-confetti';

interface Props {
  onOpenEditDate: () => void;
  onOpenEditLevel: () => void;
  onOpenAvatar: () => void;
  setActiveTab: (tab: string) => void;
  onOpenStreak: () => void;
}

export const DashboardTab: React.FC<Props> = ({
  onOpenEditDate,
  onOpenEditLevel,
  onOpenAvatar,
  setActiveTab,
  onOpenStreak
}) => {
  const { state, progress, setRoadmapFilter, syncRoadmapWithPhases } = useApp();
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  const handleSyncData = () => {
    sounds.playClick();
    const res = syncRoadmapWithPhases();
    setSyncMessage(`Sinkronisasi sukses! ${res.syncedWeeksCount} chapter dan ${res.updatedPhasesCount} status stase diselaraskan.`);
    confetti({
      particleCount: 45,
      spread: 60,
      origin: { y: 0.7 }
    });
    setTimeout(() => {
      setSyncMessage(null);
    }, 4000);
  };

  const daysLeft = getDaysRemaining(state.dashboard.ddayUKMPPD);
  const weeksLeft = Math.ceil(daysLeft / 7);

  const completedWeeksCount = state.roadmapWeeks.filter(w => w.isDone).length;
  const completedIntensifCount = state.intensifDays.filter(d => d.isDone).length;
  const scoredTryoutsCount = state.tryouts.filter(t => t.actualScore !== null).length;

  const sortedPhases = useMemo(() => {
    return sortPhasesChronologically(state.dashboard.phases);
  }, [state.dashboard.phases]);

  const activePhase = sortedPhases.find(p => p.status === 'Sedang berjalan') || sortedPhases[0];

  const mascotQuotes = useMemo(() => {
    return getAllQuotesForMascot(state.dashboard.doctorAvatar, state.dashboard.companionMood);
  }, [state.dashboard.doctorAvatar, state.dashboard.companionMood]);

  const [quoteIndex, setQuoteIndex] = useState(() => Math.floor(Math.random() * mascotQuotes.length));

  const currentQuoteItem = mascotQuotes[quoteIndex % mascotQuotes.length] || mascotQuotes[0];

  const handleNextQuote = () => {
    sounds.playClick();
    setQuoteIndex(prev => (prev + 1) % mascotQuotes.length);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hogwarts Healer Sanctum Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#f8f3ea] via-[#faf5ec] to-[#f0e7d5] dark:from-[#1c1713] dark:via-[#181410] dark:to-[#120f0d] p-6 sm:p-8 shadow-sm border border-hogwarts-300/80 dark:border-[#382f25]">
        {/* Soft atmospheric ambient glow */}
        <div className="absolute -top-16 -right-16 w-72 h-72 bg-amber-200/15 dark:bg-amber-800/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-teal-200/15 dark:bg-teal-800/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-hogwarts-100/80 dark:bg-[#25201b] text-hogwarts-800 dark:text-hogwarts-200 text-xs font-bold border border-hogwarts-300/80 dark:border-[#3d3328] shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400 animate-pulse" />
              <span>Forbidden Forest · Healer Sanctum HQ</span>
            </div>

            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-hogwarts-900 dark:text-hogwarts-50 tracking-tight">
                Selamat Datang, {state.dashboard.doctorNickname || 'Dokter Muda'}! 🌿✨
              </h1>
              {state.dashboard.companionMood && (
                <div className="mt-1.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-tiffany-100/70 dark:bg-tiffany-950/80 border border-tiffany-300/70 dark:border-tiffany-700 text-tiffany-900 dark:text-tiffany-200 text-xs font-semibold shadow-2xs">
                  <span className="text-xs">💬</span>
                  <span>{state.dashboard.companionMood}</span>
                </div>
              )}
            </div>

            {/* Companion Speech Bubble (Interactive & Diversified) */}
            <div
              onClick={handleNextQuote}
              title="Klik untuk mendengar pesan maskot lainnya 🎲✨"
              className="group relative p-4 rounded-2xl bg-[#fbf7ef]/90 dark:bg-[#221c17] border border-hogwarts-300/80 dark:border-[#3d3328] hover:border-hogwarts-400 dark:hover:border-[#524436] text-xs text-hogwarts-800 dark:text-hogwarts-100 leading-relaxed shadow-xs flex items-start gap-3 transition-all cursor-pointer active:scale-[0.99]"
            >
              <div className="relative shrink-0 flex items-center justify-center w-11 h-11 rounded-2xl bg-amber-100/60 dark:bg-[#2c2214] border border-amber-300/70 dark:border-amber-700/60 shadow-2xs group-hover:scale-105 transition-transform">
                <span className="text-2xl animate-bounce duration-1000">
                  {state.dashboard.doctorAvatar?.slice(0, 2) || '🦉'}
                </span>
                <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-teal-200 text-[9px] text-teal-950 font-bold border border-teal-500">
                  ✨
                </span>
              </div>

              <div className="flex-1 pr-6">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-serif font-bold text-hogwarts-900 dark:text-hogwarts-200 flex items-center gap-1.5">
                    Pesan {state.dashboard.doctorAvatar ? state.dashboard.doctorAvatar.replace(/^[^\s]+\s*/, '') : 'Sahabat Healer'}:
                  </span>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-teal-100/80 dark:bg-teal-950/80 text-teal-900 dark:text-teal-200 border border-teal-300/70 dark:border-teal-700">
                    {currentQuoteItem.category}
                  </span>
                </div>
                <p className="text-hogwarts-800 dark:text-hogwarts-300 font-medium leading-relaxed italic">
                  "{currentQuoteItem.quote}"
                </p>
                <div className="mt-1.5 flex items-center gap-1 text-[10px] text-hogwarts-600 dark:text-hogwarts-400 font-semibold opacity-70 group-hover:opacity-100 transition-opacity">
                  <RefreshCw className="w-3 h-3 group-hover:rotate-180 transition-transform duration-500" />
                  <span>Klik untuk ganti pesan ({((quoteIndex % mascotQuotes.length) + 1)}/{mascotQuotes.length})</span>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); handleNextQuote(); }}
                title="Ganti pesan maskot"
                className="absolute top-3 right-3 p-1.5 text-hogwarts-500 dark:text-hogwarts-400 hover:text-teal-800 dark:hover:text-teal-300 rounded-xl hover:bg-hogwarts-100/70 dark:hover:bg-[#2c241c] transition active:scale-90"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="pt-1 flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => { sounds.playClick(); onOpenEditDate(); }}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-[#fbf7ef] dark:bg-[#221c17] hover:bg-[#f2e9dc] dark:hover:bg-[#2c241c] text-hogwarts-800 dark:text-hogwarts-100 border border-hogwarts-300/80 dark:border-[#42372d] shadow-2xs transition active:scale-95"
              >
                <Calendar className="w-3.5 h-3.5 text-hogwarts-700 dark:text-hogwarts-400" />
                Ubah Tanggal Ujian & Stase
              </button>
              <button
                onClick={() => { sounds.playClick(); onOpenEditLevel(); }}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-[#fbf7ef] dark:bg-[#221c17] hover:bg-[#f2e9dc] dark:hover:bg-[#2c241c] text-hogwarts-800 dark:text-hogwarts-100 border border-hogwarts-300/80 dark:border-[#42372d] shadow-2xs transition active:scale-95"
              >
                <Trophy className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                Kustom Nama Level & Reward
              </button>
              <button
                onClick={() => { sounds.playClick(); onOpenAvatar(); }}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl bg-[#fbf7ef] dark:bg-[#221c17] hover:bg-[#f2e9dc] dark:hover:bg-[#2c241c] text-hogwarts-800 dark:text-hogwarts-100 border border-hogwarts-300/80 dark:border-[#42372d] shadow-2xs transition active:scale-95"
              >
                <span>{state.dashboard.doctorAvatar?.slice(0, 2) || '🦉'}</span>
                Ganti Maskot
              </button>
              <button
                onClick={() => { sounds.playClick(); onOpenStreak(); }}
                className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl border shadow-2xs transition active:scale-95 cursor-pointer ${
                  progress.streak.isTodayCompleted
                    ? 'bg-amber-100/80 dark:bg-amber-950/80 hover:bg-amber-200/80 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-700'
                    : progress.streak.status === 'at_risk'
                    ? 'bg-amber-50 dark:bg-[#2c2214] hover:bg-amber-100 text-amber-900 dark:text-amber-200 border-amber-400 dark:border-amber-700 animate-pulse'
                    : 'bg-[#fbf7ef] dark:bg-[#221c17] hover:bg-[#f2e9dc] dark:hover:bg-[#2c241c] text-hogwarts-800 dark:text-hogwarts-100 border-hogwarts-300/80 dark:border-[#3d3328]'
                }`}
              >
                <span className="text-sm">{progress.streak.isTodayCompleted ? '🔥' : progress.streak.currentStreak > 0 ? '🕯️' : '❄️'}</span>
                <span>Streak {progress.streak.currentStreak} Hari</span>
              </button>
            </div>
          </div>

          {/* D-Day & Current Active Realm Card */}
          <div className="bg-[#fbf7ef]/95 dark:bg-[#201a15] border border-hogwarts-300/80 dark:border-[#3d3328] rounded-2xl p-5 min-w-[280px] space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-hogwarts-200/80 dark:border-[#382f25] pb-2.5">
              <div className="text-xs font-bold text-hogwarts-800 dark:text-hogwarts-200">Target D-Day UKMPPD</div>
              <div className="text-xs font-bold text-tiffany-800 dark:text-tiffany-300 font-serif">
                {formatDateIndo(state.dashboard.ddayUKMPPD)}
              </div>
            </div>

            <div className="text-center py-1">
              <div className="text-4xl font-serif font-bold text-tiffany-800 dark:text-tiffany-400">
                {daysLeft} <span className="text-base font-semibold text-hogwarts-700 dark:text-hogwarts-300">Hari Lagi</span>
              </div>
              <div className="text-xs font-semibold text-hogwarts-700 dark:text-hogwarts-400 mt-1">
                ≈ {weeksLeft} Minggu Menuju Ujian Akhir 📜
              </div>
            </div>

            {activePhase && (() => {
              const matchingWeeks = state.roadmapWeeks.filter(w => isPhaseMatchingRotation(activePhase.name, w.rotation));
              const doneCount = matchingWeeks.filter(w => w.isDone).length;
              const totalCount = matchingWeeks.length;
              const pct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

              return (
                <div className="p-3.5 bg-[#f2e9dc]/70 dark:bg-[#29221b] rounded-xl border border-hogwarts-300/70 dark:border-[#42372d] text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-hogwarts-800 dark:text-hogwarts-200 font-bold flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-tiffany-700 dark:text-tiffany-400" />
                      Stase Berjalan:
                    </span>
                    <span className="font-bold text-tiffany-900 dark:text-tiffany-100 px-2.5 py-0.5 rounded-full bg-tiffany-200/80 dark:bg-tiffany-900/80 border border-tiffany-400/80 dark:border-tiffany-700 text-[10px]">
                      {activePhase.status}
                    </span>
                  </div>
                  <div className="font-serif font-bold text-hogwarts-900 dark:text-hogwarts-100 text-sm">
                    {activePhase.name} ({activePhase.type})
                  </div>
                  <div className="text-[11px] text-hogwarts-700 dark:text-hogwarts-300 font-medium">
                    {formatDateIndo(activePhase.startDate)} – {formatDateIndo(activePhase.endDate)} · Mode: <span className="text-tiffany-800 dark:text-tiffany-400 font-bold">{activePhase.mode}</span>
                  </div>

                  {totalCount > 0 && (
                    <div className="pt-2 border-t border-hogwarts-200/80 dark:border-[#382f25] space-y-1.5">
                      <div className="flex justify-between items-center text-[10px] font-bold text-hogwarts-800 dark:text-hogwarts-200">
                        <span>Progress Misi Stase:</span>
                        <span className="text-tiffany-900 dark:text-tiffany-300 font-mono font-black">{doneCount}/{totalCount} Mgg ({pct}%)</span>
                      </div>
                      <div className="w-full h-2 bg-hogwarts-200 dark:bg-[#2c241c] border border-hogwarts-400/80 dark:border-[#4a3e30] rounded-full overflow-hidden relative shadow-inner">
                        <div
                          className="h-full bg-gradient-to-r from-tiffany-600 via-tiffany-500 to-tiffany-400 dark:from-tiffany-500 dark:to-teal-300 rounded-full transition-all duration-300 shadow-xs"
                          style={{
                            width: `${Math.min(100, Math.max(pct, pct > 0 ? 5 : 0))}%`,
                            backgroundColor: '#0d9488',
                            minWidth: pct > 0 ? '6px' : '0px',
                            height: '100%'
                          }}
                        />
                      </div>
                      <button
                        onClick={() => {
                          sounds.playClick();
                          setRoadmapFilter(activePhase.name);
                          setActiveTab('roadmap');
                        }}
                        className="w-full mt-1 py-1.5 px-2 rounded-lg text-[10px] font-bold bg-[#fbf7ef] hover:bg-tiffany-50 dark:bg-[#1f1914] dark:hover:bg-[#27201a] text-tiffany-900 dark:text-tiffany-200 border border-tiffany-300 dark:border-tiffany-600 transition flex items-center justify-center gap-1 shadow-2xs active:scale-95"
                      >
                        <span>Buka Quest Peta 56 Mgg</span>
                        <ArrowRight className="w-3 h-3 text-tiffany-700 dark:text-tiffany-400" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      </div>

      {/* 4 Core Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Level & XP */}
        <div
          onClick={() => { sounds.playClick(); onOpenEditLevel(); }}
          className="p-5 rounded-3xl bg-[#fdfcf9] dark:bg-[#1f1914] border-2 border-hogwarts-300 dark:border-[#382f25] shadow-xs hover:border-tiffany-600 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-hogwarts-700 dark:text-hogwarts-400">Gelar & Tingkat Healer</span>
            <span className="text-xl">{progress.currentLevel.cuteIcon || '📜'}</span>
          </div>
          <div className="mt-2">
            <div className="font-serif text-lg font-bold text-hogwarts-950 dark:text-hogwarts-100 group-hover:text-tiffany-700 dark:group-hover:text-tiffany-400 transition">
              {progress.currentLevel.title}
            </div>
            <div className="text-xs font-semibold text-hogwarts-700 dark:text-hogwarts-400 mt-0.5">
              Level {progress.currentLevel.level} / 11 · {progress.totalXP} XP
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-[11px] font-bold text-hogwarts-800 dark:text-hogwarts-200 mb-1.5">
              <span>Menuju Lvl {progress.nextLevel?.level || 11}</span>
              <span className="text-tiffany-800 dark:text-tiffany-300 font-mono font-black">{progress.progressPercent}%</span>
            </div>
            <div className="w-full h-3 bg-hogwarts-200 dark:bg-[#2c241c] border border-hogwarts-400/80 dark:border-[#4a3e30] rounded-full overflow-hidden relative shadow-inner">
              <div
                className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-tiffany-600 via-tiffany-500 to-tiffany-400 dark:from-tiffany-500 dark:to-teal-300 shadow-xs"
                style={{
                  width: `${Math.min(100, Math.max(progress.progressPercent, progress.progressPercent > 0 ? 5 : 0))}%`,
                  backgroundColor: '#0d9488',
                  minWidth: progress.progressPercent > 0 ? '8px' : '0px',
                  height: '100%'
                }}
              />
            </div>
          </div>
        </div>

        {/* Roadmap Stase */}
        <div
          onClick={() => { sounds.playClick(); setActiveTab('roadmap'); }}
          className="p-5 rounded-3xl bg-[#fdfcf9] dark:bg-[#1f1914] border-2 border-hogwarts-300 dark:border-[#382f25] shadow-xs hover:border-tiffany-600 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-hogwarts-700 dark:text-hogwarts-400">Peta 56 Mgg Stase</span>
            <span className="text-xl">🗺️</span>
          </div>
          <div className="mt-2">
            <div className="font-serif text-xl font-bold text-hogwarts-950 dark:text-hogwarts-100">
              {completedWeeksCount} <span className="text-sm font-semibold text-hogwarts-700 dark:text-hogwarts-400">/ {state.roadmapWeeks.length} Minggu</span>
            </div>
            <div className="text-xs font-semibold text-hogwarts-700 dark:text-hogwarts-400 mt-0.5">
              Quest stase yang telah tuntas
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-[11px] font-bold text-hogwarts-800 dark:text-hogwarts-200 mb-1.5">
              <span>Progres Peta</span>
              <span className="text-tiffany-800 dark:text-tiffany-300 font-mono font-black">{Math.round((completedWeeksCount / (state.roadmapWeeks.length || 1)) * 100)}%</span>
            </div>
            <div className="w-full h-3 bg-hogwarts-200 dark:bg-[#2c241c] border border-hogwarts-400/80 dark:border-[#4a3e30] rounded-full overflow-hidden relative shadow-inner">
              <div
                className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-tiffany-600 via-tiffany-500 to-teal-400 shadow-xs"
                style={{
                  width: `${Math.min(100, Math.max(Math.round((completedWeeksCount / (state.roadmapWeeks.length || 1)) * 100), completedWeeksCount > 0 ? 5 : 0))}%`,
                  backgroundColor: '#0f766e',
                  minWidth: completedWeeksCount > 0 ? '8px' : '0px',
                  height: '100%'
                }}
              />
            </div>
          </div>
        </div>

        {/* Intensif 70 Hari */}
        <div
          onClick={() => { sounds.playClick(); setActiveTab('intensif'); }}
          className="p-5 rounded-3xl bg-[#fdfcf9] dark:bg-[#1f1914] border-2 border-hogwarts-300 dark:border-[#382f25] shadow-xs hover:border-tiffany-600 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-hogwarts-700 dark:text-hogwarts-400">Pass 3: Intensif</span>
            <span className="text-xl">🕯️</span>
          </div>
          <div className="mt-2">
            <div className="font-serif text-xl font-bold text-hogwarts-950 dark:text-hogwarts-100">
              {completedIntensifCount} <span className="text-sm font-semibold text-hogwarts-700 dark:text-hogwarts-400">/ 70 Hari</span>
            </div>
            <div className="text-xs font-semibold text-hogwarts-700 dark:text-hogwarts-400 mt-0.5">
              H-70 sampai D-Day UKMPPD
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-[11px] font-bold text-hogwarts-800 dark:text-hogwarts-200 mb-1.5">
              <span>Progres Intensif</span>
              <span className="text-amber-800 dark:text-amber-400 font-mono font-black">{Math.round((completedIntensifCount / 70) * 100)}%</span>
            </div>
            <div className="w-full h-3 bg-hogwarts-200 dark:bg-[#2c241c] border border-hogwarts-400/80 dark:border-[#4a3e30] rounded-full overflow-hidden relative shadow-inner">
              <div
                className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-400 dark:from-amber-500 dark:to-amber-300 shadow-xs"
                style={{
                  width: `${Math.min(100, Math.max(Math.round((completedIntensifCount / 70) * 100), completedIntensifCount > 0 ? 5 : 0))}%`,
                  backgroundColor: '#d97706',
                  minWidth: completedIntensifCount > 0 ? '8px' : '0px',
                  height: '100%'
                }}
              />
            </div>
          </div>
        </div>

        {/* Tryouts & Error Book */}
        <div
          onClick={() => { sounds.playClick(); setActiveTab('tryout'); }}
          className="p-5 rounded-3xl bg-[#fdfcf9] dark:bg-[#1f1914] border-2 border-hogwarts-300 dark:border-[#382f25] shadow-xs hover:border-tiffany-600 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-hogwarts-700 dark:text-hogwarts-400">Arena 10 Boss Tryout</span>
            <span className="text-xl">⚔️</span>
          </div>
          <div className="mt-2">
            <div className="font-serif text-xl font-bold text-hogwarts-950 dark:text-hogwarts-100">
              {scoredTryoutsCount} <span className="text-sm font-semibold text-hogwarts-700 dark:text-hogwarts-400">/ 10 Boss</span>
            </div>
            <div className="text-xs font-semibold text-hogwarts-700 dark:text-hogwarts-400 mt-0.5">
              {state.errorEntries.length} catatan mantra error
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-[11px] font-bold text-hogwarts-800 dark:text-hogwarts-200 mb-1.5">
              <span>Progres Tryout</span>
              <span className="text-rose-800 dark:text-rose-400 font-mono font-black">{Math.round((scoredTryoutsCount / 10) * 100)}%</span>
            </div>
            <div className="w-full h-3 bg-hogwarts-200 dark:bg-[#2c241c] border border-hogwarts-400/80 dark:border-[#4a3e30] rounded-full overflow-hidden relative shadow-inner">
              <div
                className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-rose-600 via-rose-500 to-rose-400 dark:from-rose-500 dark:to-rose-300 shadow-xs"
                style={{
                  width: `${Math.min(100, Math.max(scoredTryoutsCount * 10, scoredTryoutsCount > 0 ? 5 : 0))}%`,
                  backgroundColor: '#e11d48',
                  minWidth: scoredTryoutsCount > 0 ? '8px' : '0px',
                  height: '100%'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Gamified Retention & Engagement Streak Banner */}
      <div
        onClick={() => { sounds.playClick(); onOpenStreak(); }}
        className="p-5 rounded-3xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/5 border-2 border-amber-300 shadow-xs hover:border-amber-500 transition-all cursor-pointer group"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-400 text-white flex items-center justify-center text-2xl shadow-md border-2 border-amber-300 shrink-0 group-hover:scale-105 transition-transform">
              {progress.streak.isTodayCompleted ? '🔥' : progress.streak.currentStreak > 0 ? '🕯️' : '❄️'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-base text-hogwarts-950">
                  Api Streak: {progress.streak.currentStreak} Hari Berturut-turut
                </span>
                <span className={`text-[10px] font-sans font-extrabold px-2 py-0.5 rounded-full border ${
                  progress.streak.isTodayCompleted
                    ? 'bg-emerald-100 text-emerald-950 border-emerald-400'
                    : progress.streak.status === 'at_risk'
                    ? 'bg-amber-100 text-amber-950 border-amber-400 animate-pulse'
                    : 'bg-stone-100 text-stone-800 border-stone-300'
                }`}>
                  {progress.streak.isTodayCompleted
                    ? '✓ Aman Hari Ini'
                    : progress.streak.status === 'at_risk'
                    ? '⚠️ Hampir Padam'
                    : 'Mulai Baru'}
                </span>
              </div>
              <p className="text-xs text-hogwarts-700 font-medium mt-0.5">
                {progress.streak.motivationalMessage}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            {/* 7 Days Mini Dot Indicators */}
            <div className="flex items-center gap-1 bg-[#fdfcf9] px-2.5 py-1.5 rounded-xl border border-hogwarts-300">
              {progress.streak.weekDays.map((d) => (
                <div
                  key={d.dateStr}
                  title={`${d.dayName}: ${d.isCompleted ? 'Selesai 🔥' : d.isToday ? 'Hari Ini ⏳' : 'Belum'}`}
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold ${
                    d.isCompleted
                      ? 'bg-amber-500 text-white'
                      : d.isToday
                      ? 'border-2 border-amber-400 text-amber-600 animate-pulse'
                      : 'bg-hogwarts-200 text-hogwarts-400'
                  }`}
                >
                  {d.isCompleted ? '✓' : d.dayName.charAt(0)}
                </div>
              ))}
            </div>

            <button
              type="button"
              className="px-3.5 py-2 text-xs font-serif font-bold rounded-xl bg-amber-500 hover:bg-amber-600 text-white flex items-center gap-1.5 shadow-xs transition shrink-0 group-hover:translate-x-0.5"
            >
              <span>Detail Streak</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Realm Portals */}
      <div className="bg-[#faf6ee] dark:bg-[#1a1612] border-2 border-hogwarts-300 dark:border-[#382f25] rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-base font-bold text-hogwarts-950 dark:text-hogwarts-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-tiffany-700 dark:text-tiffany-400" />
              Portal Realm Penjelajahan Cepat
            </h2>
            <p className="text-xs text-hogwarts-700 dark:text-hogwarts-400">
              Gerbang instan menuju arena dan grimoire pembelajaranmu.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <button
            onClick={() => { sounds.playClick(); setActiveTab('roadmap'); }}
            className="p-3.5 rounded-2xl bg-[#fdfcf9] dark:bg-[#221c17] hover:bg-tiffany-50 dark:hover:bg-[#2c241c] border-2 border-hogwarts-300 dark:border-[#3d3328] hover:border-tiffany-500 dark:hover:border-tiffany-500 transition text-center space-y-1.5 group shadow-xs active:scale-95"
          >
            <div className="text-2xl">🗺️</div>
            <div className="font-serif font-bold text-xs text-hogwarts-950 dark:text-hogwarts-100 group-hover:text-tiffany-800 dark:group-hover:text-tiffany-300">56 Mgg Stase</div>
            <div className="text-[10px] text-hogwarts-700 dark:text-hogwarts-400 font-medium">Papan Quest 📜</div>
          </button>

          <button
            onClick={() => { sounds.playClick(); setActiveTab('intensif'); }}
            className="p-3.5 rounded-2xl bg-[#fdfcf9] dark:bg-[#221c17] hover:bg-tiffany-50 dark:hover:bg-[#2c241c] border-2 border-hogwarts-300 dark:border-[#3d3328] hover:border-tiffany-500 dark:hover:border-tiffany-500 transition text-center space-y-1.5 group shadow-xs active:scale-95"
          >
            <div className="text-2xl">⛺</div>
            <div className="font-serif font-bold text-xs text-hogwarts-950 dark:text-hogwarts-100 group-hover:text-tiffany-800 dark:group-hover:text-tiffany-300">Intensif H-70</div>
            <div className="text-[10px] text-hogwarts-700 dark:text-hogwarts-400 font-medium">Peta 70 Hari ✨</div>
          </button>

          <button
            onClick={() => { sounds.playClick(); setActiveTab('skdi'); }}
            className="p-3.5 rounded-2xl bg-[#fdfcf9] dark:bg-[#221c17] hover:bg-tiffany-50 dark:hover:bg-[#2c241c] border-2 border-hogwarts-300 dark:border-[#3d3328] hover:border-tiffany-500 dark:hover:border-tiffany-500 transition text-center space-y-1.5 group shadow-xs active:scale-95"
          >
            <div className="text-2xl">📜</div>
            <div className="font-serif font-bold text-xs text-hogwarts-950 dark:text-hogwarts-100 group-hover:text-tiffany-800 dark:group-hover:text-tiffany-300">Grimoire SKDI</div>
            <div className="text-[10px] text-hogwarts-700 dark:text-hogwarts-400 font-medium">20 Cabang ⭐</div>
          </button>

          <button
            onClick={() => { sounds.playClick(); setActiveTab('error-book'); }}
            className="p-3.5 rounded-2xl bg-[#fdfcf9] dark:bg-[#221c17] hover:bg-tiffany-50 dark:hover:bg-[#2c241c] border-2 border-hogwarts-300 dark:border-[#3d3328] hover:border-tiffany-500 dark:hover:border-tiffany-500 transition text-center space-y-1.5 group shadow-xs active:scale-95"
          >
            <div className="text-2xl">📖</div>
            <div className="font-serif font-bold text-xs text-hogwarts-950 dark:text-hogwarts-100 group-hover:text-tiffany-800 dark:group-hover:text-tiffany-300">Error Book</div>
            <div className="text-[10px] text-hogwarts-700 dark:text-hogwarts-400 font-medium">Nalar Sokrates 💬</div>
          </button>

          <button
            onClick={() => { sounds.playClick(); setActiveTab('tryout'); }}
            className="p-3.5 rounded-2xl bg-[#fdfcf9] dark:bg-[#221c17] hover:bg-tiffany-50 dark:hover:bg-[#2c241c] border-2 border-hogwarts-300 dark:border-[#3d3328] hover:border-tiffany-500 dark:hover:border-tiffany-500 transition text-center space-y-1.5 group shadow-xs active:scale-95"
          >
            <div className="text-2xl">⚔️</div>
            <div className="font-serif font-bold text-xs text-hogwarts-950 dark:text-hogwarts-100 group-hover:text-tiffany-800 dark:group-hover:text-tiffany-300">10 Boss Raid</div>
            <div className="text-[10px] text-hogwarts-700 dark:text-hogwarts-400 font-medium">Arena Tryout 🐉</div>
          </button>

          <button
            onClick={() => { sounds.playClick(); setActiveTab('osce'); }}
            className="p-3.5 rounded-2xl bg-[#fdfcf9] dark:bg-[#221c17] hover:bg-tiffany-50 dark:hover:bg-[#2c241c] border-2 border-hogwarts-300 dark:border-[#3d3328] hover:border-tiffany-500 dark:hover:border-tiffany-500 transition text-center space-y-1.5 group shadow-xs active:scale-95"
          >
            <div className="text-2xl">🧪</div>
            <div className="font-serif font-bold text-xs text-hogwarts-950 dark:text-hogwarts-100 group-hover:text-tiffany-800 dark:group-hover:text-tiffany-300">OSCE Lab</div>
            <div className="text-[10px] text-hogwarts-700 dark:text-hogwarts-400 font-medium">Stasiun Klinis 🩺</div>
          </button>
        </div>
      </div>

      {/* Realm Quest Timeline Journey Cards (NO SPREADSHEET TABLE) */}
      <div className="bg-[#fdfcf9] dark:bg-[#1a1612] border-2 border-hogwarts-300 dark:border-[#383028] rounded-3xl p-6 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-serif text-lg font-bold text-hogwarts-950 dark:text-hogwarts-100 flex items-center gap-2">
              <Scroll className="w-5 h-5 text-tiffany-700 dark:text-tiffany-400" />
              Peta Jalur Perjalanan Stase & Ujian
            </h2>
            <p className="text-xs text-hogwarts-700 dark:text-hogwarts-400">
              Kronologi tahapan koas tersinkronisasi otomatis dengan Peta Quest 56 Minggu & Ekspedisi 70 Hari.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleSyncData}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl bg-tiffany-100 hover:bg-tiffany-200 text-tiffany-950 border-2 border-tiffany-400 transition shadow-xs active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5 text-tiffany-700" />
              🔄 Sinkronkan Data Peta
            </button>
            <button
              onClick={() => { sounds.playClick(); onOpenEditDate(); }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl bg-hogwarts-100 dark:bg-[#25201b] text-hogwarts-900 dark:text-hogwarts-200 hover:bg-hogwarts-200 dark:hover:bg-[#2f2720] border-2 border-hogwarts-300 dark:border-[#42372d] transition"
            >
              <Edit3 className="w-3.5 h-3.5 text-tiffany-700 dark:text-tiffany-400" />
              Edit Tanggal Stase
            </button>
          </div>
        </div>

        {/* Sync notification message banner */}
        {syncMessage && (
          <div className="p-3 bg-tiffany-100/90 border-2 border-tiffany-400 rounded-2xl flex items-center gap-2.5 text-xs font-bold text-tiffany-950 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-tiffany-700 shrink-0" />
            <span>{syncMessage}</span>
          </div>
        )}

        {/* Journey Phase Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
          {sortedPhases.map((p) => {
            const isCurrent = p.status === 'Sedang berjalan';
            const isFinished = p.status === 'Selesai';
            const isIntensif = p.name.toLowerCase().includes('intensif');

            // Roadmap weeks calculation
            const matchingWeeks = state.roadmapWeeks.filter(w => isPhaseMatchingRotation(p.name, w.rotation));
            const doneWeeksCount = matchingWeeks.filter(w => w.isDone).length;
            const totalWeeksCount = matchingWeeks.length;
            const weekPct = totalWeeksCount > 0 ? Math.round((doneWeeksCount / totalWeeksCount) * 100) : 0;

            // Intensif days calculation
            const doneDaysCount = state.intensifDays.filter(d => d.isDone).length;
            const totalDaysCount = state.intensifDays.length || 70;
            const intensifPct = Math.round((doneDaysCount / totalDaysCount) * 100);

            return (
              <div
                key={p.id}
                className={`p-4 rounded-2xl border-2 transition flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-gradient-to-br from-[#f0fbf9] to-[#e4f6f3] dark:from-[#092b26] dark:to-[#0f3d36] border-tiffany-500 shadow-xs ring-2 ring-tiffany-200 dark:ring-tiffany-600/40'
                    : isFinished
                    ? 'bg-[#f4faf6] dark:bg-[#0c2b20] border-emerald-300 dark:border-emerald-700/60'
                    : 'bg-[#faf6ee] dark:bg-[#1a1612] border-hogwarts-300 dark:border-[#383028]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      p.type === 'MAYOR' ? 'bg-amber-100 text-amber-950 border-amber-400' :
                      p.type === 'Minor' ? 'bg-tiffany-100 text-tiffany-950 border-tiffany-400' :
                      'bg-hogwarts-100 text-hogwarts-900 border-hogwarts-300'
                    }`}>
                      {p.type}
                    </span>

                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      isCurrent ? 'bg-tiffany-200 text-tiffany-950 border-tiffany-500 animate-pulse' :
                      isFinished ? 'bg-emerald-100 text-emerald-950 border-emerald-400' :
                      'bg-hogwarts-100 text-hogwarts-700 border-hogwarts-300'
                    }`}>
                      {isCurrent ? '⚡ Berjalan' : isFinished ? '✓ Selesai' : '🔒 Akan Datang'}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-sm text-hogwarts-950 mb-1.5 flex items-center gap-1.5">
                    {isCurrent && <span className="text-tiffany-700 dark:text-tiffany-400">▶</span>}
                    <span>{p.name}</span>
                  </h3>

                  <div className="text-[11px] text-hogwarts-800 dark:text-hogwarts-200 font-medium flex items-center gap-1.5 mb-2 bg-white/70 dark:bg-[#15120f] p-2 rounded-xl border border-hogwarts-200 dark:border-[#383028]">
                    <Calendar className="w-3 h-3 text-tiffany-700 dark:text-tiffany-400 shrink-0" />
                    <span>{formatDateIndo(p.startDate)} – {formatDateIndo(p.endDate)}</span>
                  </div>

                  {p.notes && (
                    <p className="text-[11px] text-hogwarts-700 dark:text-hogwarts-300 leading-snug mb-2 font-medium">
                      {p.notes}
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-hogwarts-200/80 dark:border-[#383028] space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-hogwarts-700 dark:text-hogwarts-400">{p.durationWeeks} Minggu</span>
                    <span className="text-tiffany-900 dark:text-tiffany-300">Mode: {p.mode}</span>
                  </div>

                  {/* Synchronized Real-time Progress & Direct Navigation */}
                  {isIntensif ? (
                    <div className="pt-1.5 border-t border-hogwarts-200/60 dark:border-[#383028] space-y-1.5">
                      <div className="flex justify-between items-center text-[10px] font-bold text-hogwarts-800 dark:text-hogwarts-300">
                        <span>Progress Intensif:</span>
                        <span className="text-amber-800 dark:text-amber-400 font-mono font-black">{doneDaysCount}/{totalDaysCount} Hari ({intensifPct}%)</span>
                      </div>
                      <div className="w-full h-2 bg-hogwarts-200 dark:bg-[#2c241c] border border-hogwarts-400/80 dark:border-[#4a3e30] rounded-full overflow-hidden relative shadow-inner">
                        <div
                          className="h-full bg-gradient-to-r from-amber-600 via-amber-500 to-amber-400 dark:from-amber-500 dark:to-amber-300 rounded-full transition-all duration-300 shadow-xs"
                          style={{
                            width: `${Math.min(100, Math.max(intensifPct, intensifPct > 0 ? 5 : 0))}%`,
                            backgroundColor: '#d97706',
                            minWidth: intensifPct > 0 ? '6px' : '0px',
                            height: '100%'
                          }}
                        />
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          sounds.playClick();
                          setActiveTab('intensif');
                        }}
                        className="w-full mt-1 py-1 px-2 rounded-xl text-[11px] font-bold bg-white/95 hover:bg-white dark:bg-[#201b16] dark:hover:bg-[#2a241e] text-tiffany-950 dark:text-tiffany-300 border border-tiffany-400 hover:border-tiffany-600 transition flex items-center justify-center gap-1 shadow-xs active:scale-95"
                      >
                        <span>Buka Ekspedisi 70 Hari</span>
                        <ArrowRight className="w-3 h-3 text-tiffany-700" />
                      </button>
                    </div>
                  ) : totalWeeksCount > 0 ? (
                    <div className="pt-1.5 border-t border-hogwarts-200/60 dark:border-[#383028] space-y-1.5">
                      <div className="flex justify-between items-center text-[10px] font-bold text-hogwarts-800 dark:text-hogwarts-300">
                        <span>Target Quest:</span>
                        <span className="text-tiffany-900 dark:text-tiffany-300 font-mono font-black">{doneWeeksCount}/{totalWeeksCount} Mgg ({weekPct}%)</span>
                      </div>
                      <div className="w-full h-2 bg-hogwarts-200 dark:bg-[#2c241c] border border-hogwarts-400/80 dark:border-[#4a3e30] rounded-full overflow-hidden relative shadow-inner">
                        <div
                          className="h-full bg-gradient-to-r from-tiffany-600 via-tiffany-500 to-tiffany-400 dark:from-tiffany-500 dark:to-teal-300 rounded-full transition-all duration-300 shadow-xs"
                          style={{
                            width: `${Math.min(100, Math.max(weekPct, weekPct > 0 ? 5 : 0))}%`,
                            backgroundColor: '#0d9488',
                            minWidth: weekPct > 0 ? '6px' : '0px',
                            height: '100%'
                          }}
                        />
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          sounds.playClick();
                          setRoadmapFilter(p.name);
                          setActiveTab('roadmap');
                        }}
                        className="w-full mt-1 py-1 px-2 rounded-xl text-[11px] font-bold bg-white/95 hover:bg-white dark:bg-[#201b16] dark:hover:bg-[#2a241e] text-tiffany-950 dark:text-tiffany-300 border border-tiffany-400 hover:border-tiffany-600 transition flex items-center justify-center gap-1 shadow-xs active:scale-95"
                      >
                        <span>Buka Quest Peta 56 Mgg</span>
                        <ArrowRight className="w-3 h-3 text-tiffany-700" />
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Energy & Study Modes */}
      <div className="bg-[#fdfcf9] border-2 border-hogwarts-300 rounded-3xl p-6 space-y-4 shadow-sm">
        <h2 className="font-serif text-lg font-bold text-hogwarts-950 flex items-center gap-2">
          <span>⚖️</span> Alokasi Mode Energi Belajar
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {state.dashboard.modes.map((m) => (
            <div
              key={m.mode}
              className="p-4 rounded-2xl border-2 border-hogwarts-200 bg-hogwarts-50 space-y-2 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-serif font-bold text-sm text-hogwarts-950">{m.mode}</span>
                <span className="text-[10px] font-bold text-tiffany-950 bg-tiffany-100 border border-tiffany-300 px-2 py-0.5 rounded-full">
                  {m.hoursPerDay} jam / hari
                </span>
              </div>
              <div className="text-xs text-hogwarts-800 font-bold">
                Target: <span className="font-extrabold text-tiffany-800">{m.questionsPerDay} soal</span> / hari
              </div>
              <p className="text-[11px] text-hogwarts-700 leading-snug">
                {m.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
