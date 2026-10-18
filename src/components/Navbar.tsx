import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Trophy,
  Calendar,
  Database,
  Volume2,
  VolumeX,
  Sparkles,
  Clock,
  Moon,
  Sun,
  Cloud,
  User,
  Menu
} from 'lucide-react';
import { getDaysRemaining } from '../utils/dateHelper';
import { sounds } from '../utils/soundHelper';
import { useAuth } from '../context/AuthContext';
import { realms, RealmDefinition } from './Sidebar';

export { realms, type RealmDefinition };

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenEditLevel: () => void;
  onOpenEditDate: () => void;
  onOpenBackup: () => void;
  onOpenAvatar: () => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onOpenAuth: () => void;
  onOpenAccount: () => void;
  onOpenStreak: () => void;
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export const Navbar: React.FC<Props> = ({
  activeTab,
  setActiveTab,
  onOpenEditLevel,
  onOpenEditDate,
  onOpenBackup,
  onOpenAvatar,
  darkMode,
  setDarkMode,
  onOpenAuth,
  onOpenAccount,
  onOpenStreak,
  onToggleSidebar,
  isSidebarOpen
}) => {
  const { state, progress } = useApp();
  const { user, isAuthenticated } = useAuth();
  const daysLeft = getDaysRemaining(state.dashboard.ddayUKMPPD);
  const [isMuted, setIsMuted] = useState(sounds.getMuted());

  const handleToggleSound = () => {
    const muted = sounds.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      sounds.playQuestComplete();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#faf6ee] dark:bg-[#161310] border-b-2 border-hogwarts-300 dark:border-[#382f25] shadow-sm transition-all">
      {/* Top HUD Bar - Compact Single Row */}
      <div className="w-full px-3 sm:px-6 lg:px-8 py-2 flex items-center justify-between gap-2.5 sm:gap-4 overflow-x-auto">
        {/* Brand & Companion Avatar */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {onToggleSidebar && (
            <button
              type="button"
              onClick={() => { sounds.playClick(); onToggleSidebar(); }}
              title={isSidebarOpen ? "Tutup Menu Samping" : "Buka Menu Samping (Zona & Quest)"}
              aria-label="Toggle Menu Samping"
              className="p-1.5 sm:p-2 rounded-2xl bg-[#fdfcf9] dark:bg-[#1e1915] text-hogwarts-800 dark:text-hogwarts-200 hover:bg-hogwarts-200 dark:hover:bg-[#2c241c] hover:text-tiffany-700 dark:hover:text-tiffany-400 border-2 border-hogwarts-400 dark:border-[#3d3328] shadow-2xs transition active:scale-90 cursor-pointer flex items-center justify-center shrink-0"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <button
            onClick={() => { sounds.playClick(); onOpenAvatar(); }}
            title="Klik untuk ubah avatar pendamping & mood dokter"
            className="group relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#fdfcf9] dark:bg-[#1e1915] border-2 border-hogwarts-400 dark:border-[#382f25] shadow-sm hover:border-tiffany-700 dark:hover:border-tiffany-500 hover:scale-105 transition-all cursor-pointer shrink-0"
          >
            <span className="text-xl sm:text-2xl">{state.dashboard.doctorAvatar?.slice(0, 2) || '🦉'}</span>
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-tiffany-200 text-[9px] text-tiffany-950 font-bold ring-2 ring-hogwarts-300 dark:ring-[#382f25]">
              ✨
            </span>
          </button>

          <div className="shrink-0">
            <span className="font-serif font-bold text-base sm:text-lg tracking-tight text-hogwarts-950 dark:text-white block leading-tight">
              Forbidden Forest
            </span>
            <div className="flex items-center gap-1.5 text-[11px] text-hogwarts-900 dark:text-hogwarts-300 leading-tight">
              <span className="font-extrabold text-tiffany-950 dark:text-tiffany-300 truncate max-w-[100px] sm:max-w-[140px]">
                {state.dashboard.doctorNickname || 'Dokter Healer ✨'}
              </span>
              <span className="text-hogwarts-400">·</span>
              <span className="italic text-hogwarts-800 dark:text-hogwarts-400 font-medium truncate max-w-[90px] sm:max-w-[150px]">
                {state.dashboard.companionMood || 'Fokus Tenang 📜'}
              </span>
            </div>
          </div>
        </div>

        {/* Status Widgets */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Level & XP Widget */}
          <button
            onClick={() => { sounds.playClick(); onOpenEditLevel(); }}
            title={`Level ${progress.currentLevel.level}: ${progress.currentLevel.title} (${progress.progressPercent}% menuju level berikutnya)`}
            className="group flex items-center gap-2 sm:gap-2.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-2xl bg-[#fdfcf9] dark:bg-[#1e1915] border-2 border-hogwarts-300 dark:border-[#382f25] hover:border-tiffany-700 dark:hover:border-tiffany-500 transition-all cursor-pointer shadow-xs active:scale-95 shrink-0"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-tiffany-100 dark:bg-tiffany-950/80 text-tiffany-950 dark:text-tiffany-200 flex items-center justify-center font-bold text-xs sm:text-sm border-2 border-tiffany-300 dark:border-tiffany-700/80 shrink-0 shadow-2xs">
              <span>{progress.currentLevel.cuteIcon || '🦉'}</span>
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-hogwarts-950 dark:text-hogwarts-100 truncate max-w-[120px] sm:max-w-[160px]">
                  Lvl {progress.currentLevel.level} · {progress.currentLevel.title}
                </span>
                <span className="text-[10px] text-tiffany-700 dark:text-tiffany-400 font-bold underline decoration-dotted group-hover:text-tiffany-900 dark:group-hover:text-tiffany-200 transition-colors">
                  Ubah
                </span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 w-28 sm:w-44">
                <div className="flex-1 h-2 sm:h-2.5 bg-hogwarts-200 dark:bg-[#2c241c] border border-hogwarts-400/80 dark:border-[#4a3e30] rounded-full overflow-hidden relative shadow-inner">
                  <div
                    className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-tiffany-600 via-tiffany-500 to-tiffany-400 dark:from-tiffany-500 dark:to-teal-300 shadow-xs"
                    style={{
                      width: `${Math.min(100, Math.max(progress.progressPercent, progress.progressPercent > 0 ? 5 : 0))}%`,
                      backgroundColor: '#0d9488',
                      minWidth: progress.progressPercent > 0 ? '6px' : '0px',
                      height: '100%'
                    }}
                  />
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold shrink-0">
                  <span className="text-tiffany-800 dark:text-tiffany-300 font-mono font-black">
                    {progress.progressPercent}%
                  </span>
                  <span className="hidden sm:inline text-hogwarts-600 dark:text-hogwarts-400 font-medium font-sans">
                    ({progress.totalXP} XP)
                  </span>
                </div>
              </div>
            </div>
          </button>

          {/* D-Day Countdown Widget */}
          <button
            onClick={() => { sounds.playClick(); onOpenEditDate(); }}
            title="Klik untuk ubah D-Day & tanggal stase"
            className="group flex items-center gap-2 sm:gap-2.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-2xl bg-[#fdfcf9] dark:bg-[#1e1915] border-2 border-hogwarts-300 dark:border-[#382f25] hover:border-tiffany-700 dark:hover:border-tiffany-500 transition-all cursor-pointer shadow-xs active:scale-95 shrink-0"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-tiffany-100 dark:bg-tiffany-950/80 text-tiffany-950 dark:text-tiffany-200 flex items-center justify-center font-bold text-xs border-2 border-tiffany-300 dark:border-tiffany-700/80 shrink-0 shadow-2xs">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-tiffany-800 dark:text-tiffany-300" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-hogwarts-950 dark:text-hogwarts-100 whitespace-nowrap">
                  D-{daysLeft} Hari Menuju Ujian
                </span>
                <span className="text-[10px] text-tiffany-700 dark:text-tiffany-400 font-bold underline decoration-dotted group-hover:text-tiffany-900 dark:group-hover:text-tiffany-200 transition-colors">
                  Ubah
                </span>
              </div>
              <div className="text-[10px] font-semibold text-hogwarts-700 dark:text-hogwarts-400 flex items-center gap-1">
                <span>Target CBT: {state.dashboard.targetCBT}</span>
              </div>
            </div>
          </button>

          {/* Streak Flame Widget - Harmonized with Level & D-Day Widgets */}
          <button
            onClick={() => {
              sounds.playClick();
              onOpenStreak();
            }}
            title={`Api Streak: ${progress.streak.currentStreak} Hari (${
              progress.streak.isTodayCompleted
                ? 'Aman hari ini! 🔥'
                : progress.streak.status === 'at_risk'
                ? 'Hampir padam! Centang 1 ritual hari ini ⚠️'
                : 'Padam - Nyalakan api pertamamu! ✨'
            })`}
            className={`group flex items-center gap-2 sm:gap-2.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-2xl bg-[#fdfcf9] dark:bg-[#1e1915] border-2 transition-all cursor-pointer shadow-xs active:scale-95 shrink-0 ${
              progress.streak.isTodayCompleted
                ? 'border-amber-400 dark:border-amber-600/80 hover:border-amber-500'
                : progress.streak.status === 'at_risk'
                ? 'border-amber-400 dark:border-amber-500 animate-pulse'
                : 'border-hogwarts-300 dark:border-[#382f25] hover:border-amber-500 dark:hover:border-amber-400'
            }`}
          >
            <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center font-bold text-xs sm:text-sm border-2 shrink-0 shadow-2xs ${
              progress.streak.isTodayCompleted
                ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-950 dark:text-amber-200 border-amber-300 dark:border-amber-700/80'
                : progress.streak.status === 'at_risk'
                ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-900 border-amber-400'
                : 'bg-hogwarts-100 dark:bg-[#251f19] text-hogwarts-600 dark:text-hogwarts-400 border-hogwarts-300 dark:border-[#382f25]'
            }`}>
              <span className={`text-sm select-none ${progress.streak.isTodayCompleted ? 'animate-bounce' : ''}`}>
                {progress.streak.isTodayCompleted ? '🔥' : progress.streak.currentStreak > 0 ? '🕯️' : '❄️'}
              </span>
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-hogwarts-950 dark:text-hogwarts-100 whitespace-nowrap">
                  Streak {progress.streak.currentStreak} Hari
                </span>
                <span className="text-[10px] text-amber-700 dark:text-amber-400 font-bold underline decoration-dotted group-hover:text-amber-900 dark:group-hover:text-amber-200 transition-colors">
                  Detail
                </span>
              </div>
              <div className="text-[10px] font-semibold text-hogwarts-700 dark:text-hogwarts-400 flex items-center gap-1 whitespace-nowrap">
                <span>
                  {progress.streak.isTodayCompleted
                    ? 'Aman Hari Ini 🔥'
                    : progress.streak.status === 'at_risk'
                    ? 'Hampir Padam ⚠️'
                    : 'Nyalakan Api ✨'}
                </span>
              </div>
            </div>
          </button>

          {/* Quick HUD Actions: Dark Mode, Sound, & Backup */}
          <div className="flex items-center gap-0.5 sm:gap-1 pl-1 border-l-2 border-hogwarts-300 dark:border-[#382f25] shrink-0">
            <button
              onClick={() => {
                sounds.playClick();
                setDarkMode(!darkMode);
              }}
              title={darkMode ? 'Ganti ke Mode Siang ☀️' : 'Ganti ke Mode Malam 🌙'}
              className="p-1.5 sm:p-2 rounded-xl text-hogwarts-800 dark:text-hogwarts-300 hover:bg-hogwarts-200 dark:hover:bg-[#251f19] border border-transparent hover:border-hogwarts-300 dark:border-[#382f25] transition active:scale-90"
            >
              {darkMode ? (
                <Sun className="w-4 h-4 text-amber-400 animate-in spin-in-180 duration-300" />
              ) : (
                <Moon className="w-4 h-4 text-hogwarts-700 dark:text-hogwarts-400 hover:text-teal-700 transition" />
              )}
            </button>

            <button
              onClick={handleToggleSound}
              title={isMuted ? 'Nyalakan Efek Suara Game' : 'Matikan Efek Suara'}
              className="p-1.5 sm:p-2 rounded-xl text-hogwarts-800 dark:text-hogwarts-300 hover:bg-hogwarts-200 dark:hover:bg-[#251f19] border border-transparent hover:border-hogwarts-300 dark:border-[#382f25] transition active:scale-90"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-hogwarts-500" /> : <Volume2 className="w-4 h-4 text-tiffany-800 dark:text-tiffany-400" />}
            </button>

            <button
              onClick={() => { sounds.playClick(); onOpenBackup(); }}
              title="Backup / Restore File JSON"
              className="p-1.5 sm:p-2 rounded-xl text-hogwarts-800 dark:text-hogwarts-300 hover:bg-hogwarts-200 dark:hover:bg-[#251f19] border border-transparent hover:border-hogwarts-300 dark:border-[#382f25] transition active:scale-90"
            >
              <Database className="w-4 h-4" />
            </button>

            {isAuthenticated ? (
              <button
                onClick={() => { sounds.playClick(); onOpenAccount(); }}
                title={`Pengaturan Akun: ${user?.fullName} (${user?.email})`}
                className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-950/80 dark:hover:bg-emerald-900/80 text-emerald-950 dark:text-emerald-200 border border-emerald-400 dark:border-emerald-700 font-bold text-xs shadow-xs transition active:scale-95 ml-0.5 sm:ml-1"
              >
                <Cloud className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                <span className="hidden md:inline max-w-[80px] truncate">{user?.fullName.split(' ')[0]}</span>
                <span className="text-[10px] px-1 py-0.2 bg-emerald-200 dark:bg-emerald-900 text-emerald-950 dark:text-emerald-200 rounded font-serif font-extrabold">Cloud</span>
              </button>
            ) : (
              <button
                onClick={() => { sounds.playClick(); onOpenAuth(); }}
                title="Masuk atau daftar akun cloud untuk sinkronisasi antar perangkat"
                className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl bg-tiffany-100 hover:bg-tiffany-200 dark:bg-tiffany-950/80 dark:hover:bg-tiffany-900/80 text-tiffany-950 dark:text-tiffany-200 border border-tiffany-300 dark:border-tiffany-700 font-bold text-xs shadow-xs transition active:scale-95 ml-0.5 sm:ml-1"
              >
                <User className="w-3.5 h-3.5 text-tiffany-700 dark:text-tiffany-400" />
                <span className="hidden md:inline">Akun</span>
                <span className="text-[10px] px-1.5 py-0.2 bg-tiffany-200 dark:bg-tiffany-900 text-tiffany-950 dark:text-tiffany-200 rounded font-serif font-extrabold">Masuk</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
