import React from 'react';
import { ModalPortal } from './ModalPortal';
import { StreakInfo } from '../utils/streakHelper';
import {
  Flame,
  Award,
  Calendar,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  X,
  Trophy,
  ShieldCheck
} from 'lucide-react';
import { sounds } from '../utils/soundHelper';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  streak: StreakInfo;
  onNavigateToHabits: () => void;
  doctorAvatar?: string;
}

export const StreakModal: React.FC<Props> = ({
  isOpen,
  onClose,
  streak,
  onNavigateToHabits,
  doctorAvatar
}) => {
  if (!isOpen) return null;

  const mascotIcon = doctorAvatar?.slice(0, 2) || '🦉';

  const flameGlow =
    streak.currentStreak >= 30
      ? 'from-amber-500 via-rose-500 to-yellow-400'
      : streak.currentStreak >= 7
      ? 'from-orange-500 via-amber-500 to-yellow-400'
      : streak.currentStreak >= 3
      ? 'from-amber-400 to-orange-400'
      : 'from-amber-300 to-amber-200';

  return (
    <ModalPortal isOpen={isOpen} onClose={onClose}>
      <div className="relative w-full max-w-md sm:max-w-lg max-h-[88vh] rounded-3xl bg-[#faf6ee] dark:bg-[#1c1814] border-2 border-hogwarts-300 dark:border-[#3d3328] shadow-2xl flex flex-col text-hogwarts-950 dark:text-hogwarts-100 animate-in zoom-in-95 duration-200 overflow-hidden">
        {/* Close Button - Stays fixed on top right */}
        <button
          onClick={() => {
            sounds.playClick();
            onClose();
          }}
          className="absolute top-3.5 right-3.5 z-10 p-2 rounded-xl text-hogwarts-600 dark:text-hogwarts-400 hover:bg-hogwarts-200 dark:hover:bg-[#2c241c] transition cursor-pointer"
          aria-label="Tutup dialog streak"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 pt-3.5 space-y-3 sm:space-y-3.5">
          {/* Hero Flame Header */}
          <div className="text-center space-y-1.5 pt-1">
            {/* Flame Badge */}
            <div className="relative inline-flex items-center justify-center">
              <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr ${flameGlow} shadow-md flex items-center justify-center border-2 border-white/60 dark:border-white/20 animate-pulse`}>
                <span className="text-3xl filter drop-shadow-md select-none">
                  {streak.currentStreak >= 30 ? '👑' : streak.currentStreak >= 7 ? '🔥' : streak.currentStreak >= 1 ? '🕯️' : '❄️'}
                </span>
              </div>
              {streak.isTodayCompleted && (
                <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-full bg-emerald-500 text-white text-[9px] font-bold border-2 border-white dark:border-[#1c1814] shadow-xs">
                  Aman!
                </span>
              )}
            </div>

            <div className="space-y-0.5">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold font-serif uppercase tracking-wider text-amber-700 dark:text-amber-400">
                <Sparkles className="w-3 h-3" />
                <span>Api Belajar Healer UKMPPD</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-extrabold tracking-tight text-hogwarts-950 dark:text-white">
                {streak.currentStreak}{' '}
                <span className="text-xl sm:text-2xl font-bold font-sans text-hogwarts-700 dark:text-hogwarts-300">
                  Hari
                </span>
              </h2>
              <div className="flex items-center justify-center gap-2 text-[11px] font-semibold text-hogwarts-600 dark:text-hogwarts-400 pt-0.5">
                <span className="inline-flex items-center gap-1">
                  <Trophy className="w-3 h-3 text-amber-500" />
                  <span>Rekor Terbaik: <strong>{streak.longestStreak} Hari</strong></span>
                </span>
                <span>•</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                  +{streak.currentStreak * 15} XP Bonus
                </span>
              </div>
            </div>
          </div>

          {/* Dynamic Status Banner */}
          {streak.status === 'completed_today' && (
            <div className="p-2.5 sm:p-3 rounded-xl bg-emerald-100/90 dark:bg-emerald-950/70 border-2 border-emerald-400 dark:border-emerald-700 text-xs text-emerald-950 dark:text-emerald-200 flex items-start gap-2 shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <div className="font-serif font-bold text-xs sm:text-sm">
                  Api Hari Ini Menyala Berkobar! 🔥
                </div>
                <p className="font-medium text-emerald-900 dark:text-emerald-300/90 leading-relaxed text-[11px]">
                  Kamu sudah menyelesaikan ritual belajarmu hari ini. Streakmu aman bertambah 1 hari! Istirahat berkualitas dan sambung kembali apimu besok.
                </p>
              </div>
            </div>
          )}

          {streak.status === 'at_risk' && (
            <div className="p-2.5 sm:p-3 rounded-xl bg-amber-100/90 dark:bg-amber-950/70 border-2 border-amber-400 dark:border-amber-700 text-xs text-amber-950 dark:text-amber-200 flex items-start gap-2 shadow-xs animate-pulse">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <div className="font-serif font-bold text-xs sm:text-sm flex items-center justify-between gap-2">
                  <span>Api Hampir Padam! Selesaikan 1 Ritual! ⚠️</span>
                  <span className="text-[10px] font-sans font-extrabold px-1.5 py-0.2 rounded-full bg-amber-200 dark:bg-amber-900 border border-amber-400">
                    {streak.hoursRemainingToday}j {streak.minutesRemainingToday}m lagi
                  </span>
                </div>
                <p className="font-medium text-amber-900 dark:text-amber-300/90 leading-relaxed text-[11px]">
                  Hari ini belum tercatat ada habit yang selesai. Selesaikan minimal 1 ritual sebelum 23:59 agar streak {streak.currentStreak} harimu tidak terputus!
                </p>
              </div>
            </div>
          )}

          {streak.status === 'broken' && (
            <div className="p-2.5 sm:p-3 rounded-xl bg-teal-50 dark:bg-teal-950/60 border-2 border-teal-300 dark:border-teal-800 text-xs text-teal-950 dark:text-teal-200 flex items-start gap-2 shadow-xs">
              <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <div className="font-serif font-bold text-xs sm:text-sm">
                  Nyalakan Api Pertamamu Hari Ini! ✨
                </div>
                <p className="font-medium text-teal-900 dark:text-teal-300/90 leading-relaxed text-[11px]">
                  Konsistensi dibangun dari satu hari kecil. Centang 1 habit di tab Ritual untuk menyalakan rantai streak barumu sekarang!
                </p>
              </div>
            </div>
          )}

          {/* Weekly Calendar Flame Ring (Senin s/d Minggu) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-serif font-bold text-hogwarts-900 dark:text-hogwarts-200 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-tiffany-700 dark:text-tiffany-400" />
                <span>Aktivitas Pekan Ini</span>
              </span>
              <span className="text-[10px] text-hogwarts-600 dark:text-hogwarts-400 font-medium">
                Senin — Minggu
              </span>
            </div>

            <div className="grid grid-cols-7 gap-1 p-2 sm:p-2.5 rounded-xl bg-[#fdfcf9] dark:bg-[#211c17] border-2 border-hogwarts-300 dark:border-[#382e24]">
              {streak.weekDays.map((d) => (
                <div
                  key={d.dateStr}
                  className={`flex flex-col items-center justify-center p-1 sm:p-1.5 rounded-lg text-center transition-all ${
                    d.isToday
                      ? 'border-2 border-tiffany-600 dark:border-tiffany-400 bg-tiffany-100/70 dark:bg-tiffany-950/60 shadow-xs'
                      : 'border border-transparent'
                  }`}
                >
                  <span className={`text-[9px] sm:text-[10px] font-serif font-bold ${
                    d.isToday ? 'text-tiffany-950 dark:text-tiffany-300' : 'text-hogwarts-600 dark:text-hogwarts-400'
                  }`}>
                    {d.dayName}
                  </span>

                  <div className="my-0.5 sm:my-1">
                    {d.isCompleted ? (
                      <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-tr from-amber-500 to-orange-400 text-white flex items-center justify-center text-xs shadow-xs font-bold animate-bounce duration-1000">
                        🔥
                      </div>
                    ) : d.isToday ? (
                      <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 border-dashed border-amber-400 dark:border-amber-500 text-amber-600 dark:text-amber-400 flex items-center justify-center text-[10px] font-bold animate-pulse">
                        ⏳
                      </div>
                    ) : d.isFuture ? (
                      <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-hogwarts-100 dark:bg-[#29221c] text-hogwarts-400 dark:text-hogwarts-600 flex items-center justify-center text-xs">
                        •
                      </div>
                    ) : (
                      <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-stone-200 dark:bg-[#29221c] text-stone-400 dark:text-stone-600 flex items-center justify-center text-[9px] font-bold">
                        ✕
                      </div>
                    )}
                  </div>

                  <span className={`text-[9px] sm:text-[10px] font-bold ${
                    d.isToday ? 'text-tiffany-950 dark:text-tiffany-200' : 'text-hogwarts-700 dark:text-hogwarts-400'
                  }`}>
                    {d.dayNumber}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Milestones Roadmap */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-serif font-bold text-hogwarts-900 dark:text-hogwarts-200 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Target Pencapaian Api (Milestones)</span>
              </span>
              {streak.nextMilestone && (
                <span className="text-[10px] font-bold text-amber-800 dark:text-amber-400 truncate max-w-[180px]">
                  {streak.daysToNextMilestone} hari lagi ke {streak.nextMilestone.badge} {streak.nextMilestone.title}
                </span>
              )}
            </div>

            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {streak.milestones.map((m) => {
                const progressPct = Math.min(100, Math.round((streak.currentStreak / m.days) * 100));

                return (
                  <div
                    key={m.days}
                    className={`p-2 sm:p-2.5 rounded-xl border-2 transition-all flex items-center justify-between gap-2.5 ${
                      m.unlocked
                        ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800'
                        : 'bg-[#fdfcf9] dark:bg-[#211c17] border-hogwarts-200 dark:border-[#332b22] opacity-75'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-sm border-2 shrink-0 ${
                        m.unlocked
                          ? 'bg-amber-200 dark:bg-amber-900 border-amber-400 shadow-xs'
                          : 'bg-hogwarts-100 dark:bg-[#2c241c] border-hogwarts-300 dark:border-[#3d3328]'
                      }`}>
                        {m.badge}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-serif font-bold text-xs text-hogwarts-950 dark:text-white truncate">
                            {m.days} Hari: {m.title}
                          </span>
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700 shrink-0">
                            +{m.xpReward} XP
                          </span>
                        </div>
                        <p className="text-[10px] text-hogwarts-600 dark:text-hogwarts-400 font-medium truncate">
                          {m.description}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      {m.unlocked ? (
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 border border-emerald-300">
                          <CheckCircle2 className="w-2.5 h-2.5" /> Terbuka
                        </span>
                      ) : (
                        <div className="space-y-0.5 text-right">
                          <span className="text-[9px] font-mono font-bold text-hogwarts-600 dark:text-hogwarts-400">
                            {streak.currentStreak}/{m.days}
                          </span>
                          <div className="w-14 h-1.5 rounded-full bg-hogwarts-200 dark:bg-[#332b22] border border-hogwarts-400/80 dark:border-[#4a3e30] overflow-hidden relative">
                            <div
                              className="h-full bg-amber-500 rounded-full transition-all"
                              style={{
                                width: `${progressPct}%`,
                                backgroundColor: '#f59e0b',
                                minWidth: progressPct > 0 ? '4px' : '0px',
                                height: '100%'
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mascot Speech Bubble */}
          <div className="p-2.5 sm:p-3 rounded-xl bg-[#fdfcf9] dark:bg-[#211c17] border-2 border-hogwarts-300 dark:border-[#382e24] flex items-center gap-2.5">
            <span className="text-xl shrink-0 select-none">{mascotIcon}</span>
            <div className="space-y-0.5 min-w-0">
              <span className="text-[9px] font-bold uppercase tracking-wider text-hogwarts-700 dark:text-hogwarts-400 font-serif block">
                Kata {doctorAvatar ? doctorAvatar.replace(/^[^\s]+\s*/, '') : 'Pendamping Healer'}:
              </span>
              <p className="text-[11px] text-hogwarts-800 dark:text-hogwarts-200 font-medium italic leading-snug line-clamp-2">
                "{streak.motivationalMessage}"
              </p>
            </div>
          </div>
        </div>

        {/* Anchored Call to Action Footer */}
        <div className="p-3.5 sm:p-4 pt-2.5 border-t-2 border-hogwarts-200 dark:border-[#332b22] bg-[#f7f2e7] dark:bg-[#191512] shrink-0">
          <button
            onClick={() => {
              sounds.playClick();
              onNavigateToHabits();
              onClose();
            }}
            className="w-full py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white font-serif font-bold text-xs flex items-center justify-center gap-2 shadow-md transition active:scale-98 cursor-pointer"
          >
            <span>Buka & Centang Ritual Hari Ini</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </ModalPortal>
  );
};
