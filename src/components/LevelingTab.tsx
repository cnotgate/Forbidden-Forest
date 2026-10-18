import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Trophy,
  Award,
  Sparkles,
  Gift,
  CheckCircle2,
  Lock,
  Edit3,
  Star,
  Crown,
  Scroll
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  onOpenEditLevel: () => void;
}

export const LevelingTab: React.FC<Props> = ({ onOpenEditLevel }) => {
  const { state, progress, claimLevelReward } = useApp();

  const handleClaim = (lvlNumber: number) => {
    claimLevelReward(lvlNumber);
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 }
    });
  };

  const unlockedBadgesCount = progress.unlockedBadges.filter(b => b.isUnlocked).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hogwarts Healer Academy Level Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-[#faf6ee] p-6 sm:p-8 shadow-sm border-2 border-hogwarts-300">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tiffany-100 text-tiffany-950 text-xs font-bold border border-tiffany-300">
              <Crown className="w-3.5 h-3.5 text-amber-700" />
              <span>Forbidden Forest · Ordo Medicus Healer</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-hogwarts-950 tracking-tight">
              Tingkat Kamu: <span className="text-tiffany-800">{progress.currentLevel.title}</span> {progress.currentLevel.cuteIcon || '📜'}
            </h1>
            <p className="text-xs sm:text-sm text-hogwarts-700 leading-relaxed font-medium">
              XP murni dihitung dari <span className="font-bold text-tiffany-900">proses & kedisiplinan belajarmu</span>.
              Bahkan hari istirahat (REST) dan hari dinas berat (Level 0) tetap memberimu asupan XP untuk menjaga kobaran semangat!
            </p>
            <div className="pt-1">
              <button
                onClick={onOpenEditLevel}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-tiffany-200 hover:bg-tiffany-300 text-tiffany-950 border-2 border-tiffany-700 shadow-sm transition active:scale-95"
              >
                <Edit3 className="w-4 h-4" />
                Ubah Nama Level & Kotak Hadiah 🎁
              </button>
            </div>
          </div>

          {/* Current XP Progress Widget */}
          <div className="bg-[#fdfcf9] border-2 border-hogwarts-300 rounded-2xl p-6 min-w-[280px] space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-tiffany-900 uppercase tracking-wider flex items-center gap-1 font-serif">
                <Sparkles className="w-3.5 h-3.5" /> STATUS EXP
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-hogwarts-200 text-hogwarts-950 font-bold border border-hogwarts-300">
                Level {progress.currentLevel.level} / 11
              </span>
            </div>

            <div className="text-3xl font-serif font-bold text-hogwarts-950">
              {progress.totalXP} <span className="text-sm font-semibold text-hogwarts-700">Total XP</span>
            </div>

            <div>
              <div className="flex justify-between text-xs text-hogwarts-800 dark:text-hogwarts-200 font-bold mb-1.5">
                <span className="flex items-center gap-1.5">
                  <span>{progress.currentLevel.title}</span>
                  <span className="text-tiffany-700 dark:text-tiffany-400 font-mono font-black">({progress.progressPercent}%)</span>
                </span>
                <span className="text-tiffany-800 dark:text-tiffany-300 font-extrabold font-mono">
                  {progress.nextLevel ? `${progress.xpNeededForNext} XP lagi` : 'MAX LEVEL 👑'}
                </span>
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

            {progress.currentLevel.selfReward && (
              <div className="p-3 bg-hogwarts-100 rounded-xl border border-hogwarts-300 text-xs">
                <div className="text-hogwarts-800 font-bold flex items-center gap-1.5 mb-1 font-serif">
                  <Gift className="w-3.5 h-3.5 text-amber-700" />
                  <span>Hadiah Tingkat Ini:</span>
                </div>
                <div className="text-hogwarts-950 font-bold">{progress.currentLevel.selfReward}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 11 RPG Level Cards Ladder */}
      <div className="bg-[#fdfcf9] border-2 border-hogwarts-300 rounded-3xl p-6 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-serif text-lg font-bold text-hogwarts-950 flex items-center gap-2">
              <Scroll className="w-5 h-5 text-tiffany-700" />
              Hierarki 11 Tingkat Healer Kedokteran
            </h2>
            <p className="text-xs text-hogwarts-700">
              Setiap kali naik tingkat, kamu berhak membuka hadiah diri (*Self-Reward*) yang telah kamu tetapkan sendiri!
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {state.leveling.levels.map((lvl) => {
            const isCurrent = progress.currentLevel.level === lvl.level;
            const isUnlocked = progress.totalXP >= lvl.minXP;

            return (
              <div
                key={lvl.level}
                className={`relative p-5 rounded-2xl border-2 transition-all ${
                  isCurrent
                    ? 'border-tiffany-600 dark:border-tiffany-500 bg-tiffany-100/70 dark:bg-[#062d29] shadow-md ring-2 ring-tiffany-400/40'
                    : isUnlocked
                    ? 'border-hogwarts-300 dark:border-[#42382e] bg-[#faf6ee] dark:bg-[#211c17] shadow-sm'
                    : 'border-hogwarts-200 dark:border-[#383028] bg-hogwarts-100/60 dark:bg-[#1a1714]'
                }`}
              >
                {/* Header tag */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{lvl.cuteIcon || '📜'}</span>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-lg font-serif ${
                      isCurrent
                        ? 'bg-tiffany-200 text-tiffany-950 border-2 border-tiffany-700 dark:bg-[#042f2e] dark:text-[#5eead4] dark:border-[#0d9488]'
                        : isUnlocked
                        ? 'bg-hogwarts-200 text-hogwarts-950 border border-hogwarts-300 dark:bg-[#383028] dark:text-[#f7f2ea] dark:border-[#594a3d]'
                        : 'bg-hogwarts-100 text-hogwarts-700 border border-hogwarts-200 dark:bg-[#25201a] dark:text-[#baa996] dark:border-[#3d3328]'
                    }`}>
                      Level {lvl.level}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-hogwarts-800 dark:text-hogwarts-300">
                    {lvl.minXP} XP
                  </span>
                </div>

                <div className="space-y-1 mb-4">
                  <h3 className="font-serif font-bold text-base text-hogwarts-950 dark:text-hogwarts-100 flex items-center gap-1.5">
                    {lvl.title}
                    {isCurrent && (
                      <span className="text-[10px] font-bold text-tiffany-950 bg-tiffany-200 dark:bg-[#042f2e] dark:text-[#5eead4] dark:border-[#0d9488] px-2 py-0.5 rounded-full border border-tiffany-400">
                        🌿 Posisi Saat Ini
                      </span>
                    )}
                  </h3>
                  <p className={`text-xs leading-relaxed font-medium ${
                    isCurrent
                      ? 'text-tiffany-900 dark:text-tiffany-200'
                      : isUnlocked
                      ? 'text-hogwarts-800 dark:text-hogwarts-300'
                      : 'text-hogwarts-700 dark:text-hogwarts-400'
                  }`}>
                    {lvl.meaning}
                  </p>
                </div>

                {/* Self-reward claim box */}
                <div className={`pt-3 border-t-2 flex items-center justify-between gap-2 ${
                  isCurrent
                    ? 'border-tiffany-300/80 dark:border-tiffany-700/80'
                    : 'border-hogwarts-200 dark:border-[#382e25]'
                }`}>
                  <div className="text-xs">
                    <span className={`text-[10px] font-bold block uppercase tracking-wider ${
                      isCurrent
                        ? 'text-tiffany-800 dark:text-tiffany-300'
                        : 'text-hogwarts-600 dark:text-hogwarts-400'
                    }`}>
                      Self-Reward:
                    </span>
                    <span className="font-bold text-hogwarts-950 dark:text-hogwarts-100">
                      {lvl.selfReward || '-'}
                    </span>
                  </div>

                  {isUnlocked ? (
                    <button
                      onClick={() => handleClaim(lvl.level)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-xl transition flex items-center gap-1.5 active:scale-95 ${
                        lvl.rewardClaimed
                          ? 'bg-emerald-100 text-emerald-950 border-2 border-emerald-500 font-bold dark:bg-[#022c22] dark:text-[#a7f3d0] dark:border-[#059669]'
                          : 'bg-tiffany-200 hover:bg-tiffany-300 text-tiffany-950 border-2 border-tiffany-700 font-bold shadow-sm dark:bg-tiffany-700 dark:hover:bg-tiffany-600 dark:text-white dark:border-tiffany-400'
                      }`}
                    >
                      {lvl.rewardClaimed ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                          Sudah Diklaim ✨
                        </>
                      ) : (
                        <>
                          <Gift className="w-3.5 h-3.5" />
                          Klaim Hadiah 🎁
                        </>
                      )}
                    </button>
                  ) : (
                    <span className="text-xs text-hogwarts-600 dark:text-hogwarts-400 font-semibold flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-hogwarts-100/70 dark:bg-[#25201a] border border-hogwarts-200 dark:border-[#382e25]">
                      <Lock className="w-3.5 h-3.5 text-hogwarts-500 dark:text-hogwarts-400" />
                      Terkunci
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Badges & XP Breakdown 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Badges Collection */}
        <div className="bg-[#fdfcf9] border-2 border-hogwarts-300 rounded-3xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-lg font-bold text-hogwarts-950 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-700" /> Koleksi Lambang Kehormatan
              </h2>
              <p className="text-xs text-hogwarts-700">
                Terbuka otomatis seiring pencapaian belajar dan latihanmu!
              </p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-hogwarts-200 text-hogwarts-950 border border-hogwarts-300">
              {unlockedBadgesCount} / {state.leveling.badges.length} Terbuka
            </span>
          </div>

          <div className="space-y-3">
            {progress.unlockedBadges.map((badge) => (
              <div
                key={badge.id}
                className={`p-3.5 rounded-2xl border-2 flex items-center justify-between gap-3 transition ${
                  badge.isUnlocked
                    ? 'border-tiffany-300 bg-tiffany-50/80 shadow-sm'
                    : 'border-hogwarts-200 bg-hogwarts-100/50 opacity-70'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl p-2 rounded-xl bg-white border-2 border-hogwarts-300 shadow-sm">
                    {badge.stickerIcon || '📜'}
                  </div>
                  <div>
                    <div className="font-serif text-sm font-bold text-hogwarts-950">
                      {badge.name}
                    </div>
                    <div className="text-xs text-hogwarts-700 font-medium">
                      Syarat: {badge.condition}
                    </div>
                  </div>
                </div>

                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border-2 ${
                  badge.isUnlocked
                    ? 'bg-emerald-100 text-emerald-950 border-emerald-400'
                    : 'text-hogwarts-600 border-hogwarts-300 bg-hogwarts-100'
                }`}>
                  {badge.isUnlocked ? '✓ Terbuka' : '· Terkunci'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* XP Breakdown Matrix */}
        <div className="bg-[#fdfcf9] border-2 border-hogwarts-300 rounded-3xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-lg font-bold text-hogwarts-950 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-tiffany-700" /> Sumber EXP Belajar
              </h2>
              <p className="text-xs text-hogwarts-700">
                Poin EXP diperoleh dari setiap aktivitas yang kamu selesaikan.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {progress.breakdown.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-[#faf6ee] border-2 border-hogwarts-200 flex items-center justify-between gap-3 shadow-xs hover:border-tiffany-400 transition"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl p-2 rounded-xl bg-white border-2 border-hogwarts-300 shadow-sm shrink-0">
                    {item.cuteIcon}
                  </span>
                  <div>
                    <div className="font-serif font-bold text-sm text-hogwarts-950">
                      {item.activity}
                    </div>
                    <div className="text-xs text-hogwarts-700 font-medium mt-0.5">
                      {item.count} diselesaikan · <span className="font-bold text-hogwarts-900">+{item.xpPerUnit} XP</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-serif font-extrabold text-sm text-tiffany-950 px-3 py-1 rounded-xl bg-tiffany-100 border border-tiffany-300 shadow-xs">
                    +{item.totalXP} XP
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-hogwarts-100/80 border-2 border-hogwarts-300 flex items-center justify-between font-serif">
            <span className="font-bold text-sm text-hogwarts-950 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-tiffany-700" />
              Total Pundi EXP Terkumpul:
            </span>
            <span className="text-lg font-extrabold text-tiffany-950 px-3 py-1 rounded-xl bg-tiffany-200 border-2 border-tiffany-500 shadow-xs">
              {progress.totalXP} XP ✨
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
