import React, { useState, useEffect, useRef } from 'react';
import { useApp, CANONICAL_HABIT_NAMES } from '../context/AppContext';
import { HabitItem } from '../types';
import {
  Clock,
  CheckCircle2,
  Circle,
  Plus,
  Flame,
  Moon,
  Zap,
  Sparkles,
  Edit3,
  Trash2,
  X,
  Save,
  Calendar,
  Heart,
  Coffee,
  Scroll
} from 'lucide-react';
import { formatDateWithDay } from '../utils/dateHelper';
import { sounds } from '../utils/soundHelper';
import { ModalPortal } from './ModalPortal';
import { HabitCompletionChart } from './HabitCompletionChart';
import confetti from 'canvas-confetti';

export const HabitTab: React.FC = () => {
  const { state, progress, logDailyHabit, addHabit, updateHabit, deleteHabit } = useApp();

  const todayStr = new Date().toISOString().slice(0, 10);
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<HabitItem | null>(null);

  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitPriority, setNewHabitPriority] = useState<'High' | 'Medium' | 'Low'>('High');

  const currentLog = state.dailyHabitLogs[selectedDate] || {
    date: selectedDate,
    level: 1,
    habitsDone: [],
    note: ''
  };

  const currentLevel = currentLog.level ?? 1;
  const currentDoneList = currentLog.habitsDone || [];

  const [noteInput, setNoteInput] = useState<string>(currentLog.note || '');
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync noteInput with state whenever selected date or log note changes
  useEffect(() => {
    setNoteInput(currentLog.note || '');
  }, [selectedDate, currentLog.note]);

  // Clean up debounced timer on unmount
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, []);

  const handleLevelSelect = (lvl: number) => {
    sounds.playClick();
    logDailyHabit(selectedDate, lvl, currentDoneList, noteInput);
  };

  const getCanonicalId = (h: HabitItem): string | undefined => {
    return CANONICAL_HABIT_NAMES[h.name];
  };

  const isHabitChecked = (h: HabitItem): boolean => {
    const canonicalId = getCanonicalId(h);
    return currentDoneList.includes(h.id) || (!!canonicalId && currentDoneList.includes(canonicalId));
  };

  const handleToggleHabit = (h: HabitItem) => {
    sounds.playClick();
    const canonicalId = getCanonicalId(h);
    const targetId = canonicalId || h.id;
    const isDone = isHabitChecked(h);

    const updated = isDone
      ? currentDoneList.filter(id => id !== h.id && id !== canonicalId && id !== targetId)
      : Array.from(new Set([...currentDoneList, targetId]));

    // Trigger celebration if this is the first habit completed today
    if (!isDone && selectedDate === todayStr && currentDoneList.length === 0) {
      sounds.playLevelUp();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    }

    logDailyHabit(selectedDate, currentLevel, updated, noteInput);
  };

  const handleNoteChange = (note: string) => {
    setNoteInput(note);
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }
    saveTimerRef.current = setTimeout(() => {
      logDailyHabit(selectedDate, currentLevel, currentDoneList, note);
    }, 500);
  };

  const handleNoteBlur = () => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
    }
    if (noteInput !== (currentLog.note || '')) {
      logDailyHabit(selectedDate, currentLevel, currentDoneList, noteInput);
    }
  };

  const handleCreateHabit = () => {
    if (!newHabitName.trim()) {
      alert('Mohon masukkan nama habit!');
      return;
    }
    sounds.playQuestComplete();
    addHabit(newHabitName, newHabitPriority);
    setNewHabitName('');
    setIsAddModalOpen(false);
  };

  const handleSaveHabitEdit = () => {
    if (editingHabit && editingHabit.name.trim()) {
      sounds.playClick();
      updateHabit(editingHabit.id, editingHabit.name, editingHabit.priority);
      setEditingHabit(null);
    }
  };

  const highHabits = state.habits.filter(h => h.priority === 'High');
  const mediumHabits = state.habits.filter(h => h.priority === 'Medium');
  const lowHabits = state.habits.filter(h => h.priority === 'Low');

  const highDone = highHabits.filter(h => isHabitChecked(h)).length;
  const mediumDone = mediumHabits.filter(h => isHabitChecked(h)).length;
  const lowDone = lowHabits.filter(h => isHabitChecked(h)).length;

  const totalDoneToday = highDone + mediumDone + lowDone;
  const totalHabits = state.habits.length || 1;
  const pctToday = Math.round((totalDoneToday / totalHabits) * 100);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#faf6ee] dark:bg-[#1f1a14] border-2 border-hogwarts-300 dark:border-[#3d3328] rounded-3xl p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-xl font-bold text-hogwarts-950 dark:text-hogwarts-100 flex items-center gap-2">
              <Coffee className="w-5 h-5 text-hogwarts-700 dark:text-hogwarts-400" />
              Ritual Harian & Kebiasaan Belajar (Anti-Burnout)
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-hogwarts-100 dark:bg-hogwarts-900/60 text-hogwarts-950 dark:text-hogwarts-200 border border-hogwarts-300 dark:border-hogwarts-700">
              3 Mode Energi Koas 📜
            </span>
          </div>
          <p className="text-xs text-hogwarts-800 dark:text-hogwarts-300 mt-1 font-medium">
            Hari dinas/jaga malam melelahkan? Aktifkan <span className="font-bold text-amber-800 dark:text-amber-400">🌙 Level 0: Sleepy Koas</span>, <span className="font-bold text-teal-800 dark:text-teal-400">🌿 Level 1: Normal Healer</span>, atau <span className="font-bold text-purple-800 dark:text-purple-400">⚡ Level 2: Super Boost</span>. Rantai streak aman & tetap berhak atas XP harian!
          </p>
        </div>

        <button
          onClick={() => { sounds.playClick(); setIsAddModalOpen(true); }}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl bg-[#fdfcf9] dark:bg-[#251f19] hover:bg-[#f5efe4] dark:hover:bg-[#2e261f] text-hogwarts-950 dark:text-hogwarts-100 border-2 border-hogwarts-400 dark:border-[#3d3328] shadow-xs transition active:scale-95"
        >
          <Plus className="w-4 h-4 text-hogwarts-700 dark:text-hogwarts-400" />
          Tambah Habit
        </button>
      </div>

      {/* Date Navigator & Level Selector */}
      <div className="bg-[#fdfcf9] dark:bg-[#1c1814] border-2 border-hogwarts-300 dark:border-[#3d3328] rounded-3xl p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-hogwarts-200 dark:border-[#382e24] pb-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-hogwarts-700 dark:text-hogwarts-400" />
            <div>
              <div className="font-serif text-sm font-bold text-hogwarts-950 dark:text-hogwarts-100">
                Pilih Tanggal Evaluasi:
              </div>
              <div className="text-xs text-hogwarts-700 dark:text-hogwarts-400 font-medium">
                {formatDateWithDay(selectedDate)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl border-2 border-hogwarts-300 dark:border-[#382e24] bg-white dark:bg-[#251f19] text-hogwarts-950 dark:text-hogwarts-100 font-bold focus:outline-none focus:ring-2 focus:ring-tiffany-600"
            />
            {selectedDate !== todayStr && (
              <button
                onClick={() => setSelectedDate(todayStr)}
                className="px-2.5 py-1.5 text-xs font-bold rounded-xl bg-[#fdfcf9] dark:bg-[#251f19] hover:bg-[#f5efe4] dark:hover:bg-[#2e261f] text-hogwarts-950 dark:text-hogwarts-100 border-2 border-hogwarts-300 dark:border-[#382e24]"
              >
                Hari Ini
              </button>
            )}
          </div>
        </div>

        {/* 3 Energy Levels */}
        <div>
          <div className="text-xs font-serif font-bold text-hogwarts-950 dark:text-hogwarts-100 mb-3 flex items-center gap-1.5">
            <span>⚖️</span> Pilih Mode Energi Hari Ini:
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Level 0 */}
            <div
              onClick={() => handleLevelSelect(0)}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-3 active:scale-[0.99] ${
                currentLevel === 0
                  ? 'border-amber-600 bg-amber-100/90 text-amber-950 shadow-md ring-2 ring-amber-400/40'
                  : 'border-dashed border-stone-300 bg-stone-50/80 text-stone-700 hover:border-amber-400 hover:bg-stone-100/90 hover:text-stone-900'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className={`font-serif font-bold text-sm flex items-center gap-1.5 ${
                    currentLevel === 0 ? 'text-amber-950' : 'text-stone-800'
                  }`}>
                    <span>🌙</span> Level 0: Sleepy Koas
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      currentLevel === 0
                        ? 'bg-amber-200/90 text-amber-950 border-amber-500'
                        : 'bg-stone-200/60 text-stone-600 border-stone-300'
                    }`}>
                      +15 XP
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border whitespace-nowrap ${
                      currentLevel === 0
                        ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                        : 'bg-stone-200/80 text-stone-600 border-stone-300'
                    }`}>
                      {currentLevel === 0 ? '✓ Aktif' : '○ Pilih'}
                    </span>
                  </div>
                </div>
                <p className={`text-[11px] font-medium leading-relaxed ${
                  currentLevel === 0 ? 'text-amber-900' : 'text-stone-600'
                }`}>
                  Lelah pasca-jaga malam? Cukup tuntaskan 10 soal + 1 analisa error (~20 menit). Menang tanpa rasa bersalah!
                </p>
              </div>
            </div>

            {/* Level 1 */}
            <div
              onClick={() => handleLevelSelect(1)}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-3 active:scale-[0.99] ${
                currentLevel === 1
                  ? 'border-teal-600 bg-teal-100/90 text-teal-950 shadow-md ring-2 ring-teal-400/40'
                  : 'border-dashed border-stone-300 bg-stone-50/80 text-stone-700 hover:border-teal-400 hover:bg-stone-100/90 hover:text-stone-900'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className={`font-serif font-bold text-sm flex items-center gap-1.5 ${
                    currentLevel === 1 ? 'text-teal-950' : 'text-stone-800'
                  }`}>
                    <span>🌿</span> Level 1: Normal Healer
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      currentLevel === 1
                        ? 'bg-teal-200/90 text-teal-950 border-teal-500'
                        : 'bg-stone-200/60 text-stone-600 border-stone-300'
                    }`}>
                      Konsisten
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border whitespace-nowrap ${
                      currentLevel === 1
                        ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                        : 'bg-stone-200/80 text-stone-600 border-stone-300'
                    }`}>
                      {currentLevel === 1 ? '✓ Aktif' : '○ Pilih'}
                    </span>
                  </div>
                </div>
                <p className={`text-[11px] font-medium leading-relaxed ${
                  currentLevel === 1 ? 'text-teal-900' : 'text-stone-600'
                }`}>
                  Penuhi habit High Priority + target drill soal harian sesuai mode roadmap stase berjalan.
                </p>
              </div>
            </div>

            {/* Level 2 */}
            <div
              onClick={() => handleLevelSelect(2)}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-3 active:scale-[0.99] ${
                currentLevel === 2
                  ? 'border-purple-600 bg-purple-100/90 text-purple-950 shadow-md ring-2 ring-purple-400/40'
                  : 'border-dashed border-stone-300 bg-stone-50/80 text-stone-700 hover:border-purple-400 hover:bg-stone-100/90 hover:text-stone-900'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className={`font-serif font-bold text-sm flex items-center gap-1.5 ${
                    currentLevel === 2 ? 'text-purple-950' : 'text-stone-800'
                  }`}>
                    <span>⚡</span> Level 2: Super Boost
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      currentLevel === 2
                        ? 'bg-purple-200/90 text-purple-950 border-purple-500'
                        : 'bg-stone-200/60 text-stone-600 border-stone-300'
                    }`}>
                      Akselerasi ⚡
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border whitespace-nowrap ${
                      currentLevel === 2
                        ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                        : 'bg-stone-200/80 text-stone-600 border-stone-300'
                    }`}>
                      {currentLevel === 2 ? '✓ Aktif' : '○ Pilih'}
                    </span>
                  </div>
                </div>
                <p className={`text-[11px] font-medium leading-relaxed ${
                  currentLevel === 2 ? 'text-purple-900' : 'text-stone-600'
                }`}>
                  Waktu luang / akhir pekan / pasca-koas: tancap gas penuntasan sistem, drill OSCE & bedah kasus kompleks.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Revamped Daily Completion Progress Bar Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-teal-50/50 border-2 border-teal-200/90 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-teal-100 border border-teal-400 flex items-center justify-center text-teal-800 text-lg font-bold shrink-0 shadow-xs">
                {pctToday === 100 ? '👑' : pctToday >= 75 ? '🌿' : pctToday >= 50 ? '✨' : '☕'}
              </div>
              <div>
                <div className="font-serif font-bold text-sm text-hogwarts-950 flex items-center gap-2">
                  <span>Tingkat Kelulusan Ritual Hari Ini</span>
                  <span className={`text-[10px] font-sans font-extrabold px-2.5 py-0.5 rounded-full border inline-flex items-center gap-1 shadow-2xs ${
                    pctToday === 100
                      ? 'bg-emerald-200 text-emerald-950 border-emerald-500 ring-1 ring-emerald-400/40 dark:bg-[#064e3b] dark:text-[#ecfdf5] dark:border-[#34d399]'
                      : pctToday >= 75
                      ? 'bg-teal-100 text-teal-950 border-teal-400 dark:bg-[#042f2e] dark:text-[#5eead4] dark:border-[#0d9488]'
                      : pctToday >= 50
                      ? 'bg-amber-100 text-amber-950 border-amber-400 dark:bg-[#451a03] dark:text-[#fde68a] dark:border-[#d97706]'
                      : pctToday > 0
                      ? 'bg-emerald-100 text-emerald-950 border-emerald-400 dark:bg-[#062e24] dark:text-[#6ee7b7] dark:border-[#10b981]'
                      : 'bg-stone-100 text-stone-700 border-stone-300 dark:bg-[#211c17] dark:text-[#d8cbbb] dark:border-[#4a3e30]'
                  }`}>
                    {pctToday === 100
                      ? '👑 Sempurna (100%)'
                      : pctToday >= 75
                      ? '🌿 Healer Konsisten'
                      : pctToday >= 50
                      ? '✨ Separuh Jalan'
                      : pctToday > 0
                      ? '🌱 Memulai Langkah'
                      : '○ Belum Dimulai'}
                  </span>
                </div>
                <div className="text-[11px] text-hogwarts-700 font-medium">
                  {formatDateWithDay(selectedDate)} • Selesai <strong className="text-hogwarts-950">{totalDoneToday}</strong> dari <strong className="text-hogwarts-950">{totalHabits}</strong> ritual
                </div>
              </div>
            </div>

            {/* Priority Mini Badges & Streak */}
            <div className="flex items-center gap-1.5 flex-wrap text-[10px]">
              <span className={`px-2.5 py-0.5 rounded-lg border font-bold flex items-center gap-1 ${
                progress.streak.isTodayCompleted
                  ? 'bg-amber-100 border-amber-400 text-amber-950 shadow-2xs'
                  : progress.streak.status === 'at_risk'
                  ? 'bg-amber-50 border-amber-400 text-amber-900 animate-pulse'
                  : 'bg-stone-100 border-stone-300 text-stone-700'
              }`}>
                <span>{progress.streak.isTodayCompleted ? '🔥' : '⏳'}</span>
                <span>Streak: {progress.streak.currentStreak} Hari</span>
              </span>
              <span className={`px-2 py-0.5 rounded-lg border font-bold ${
                highDone === highHabits.length && highHabits.length > 0
                  ? 'bg-teal-200/90 border-teal-500 text-teal-950'
                  : 'bg-teal-50 border-teal-300 text-teal-900'
              }`}>
                🌿 Wajib: {highDone}/{highHabits.length}
              </span>
              <span className={`px-2 py-0.5 rounded-lg border font-bold ${
                mediumDone === mediumHabits.length && mediumHabits.length > 0
                  ? 'bg-amber-200/90 border-amber-500 text-amber-950'
                  : 'bg-amber-50 border-amber-300 text-amber-900'
              }`}>
                📜 Senggang: {mediumDone}/{mediumHabits.length}
              </span>
              <span className={`px-2 py-0.5 rounded-lg border font-bold ${
                lowDone === lowHabits.length && lowHabits.length > 0
                  ? 'bg-purple-200/90 border-purple-500 text-purple-950'
                  : 'bg-purple-50 border-purple-300 text-purple-900'
              }`}>
                🕯️ Pengayaan: {lowDone}/{lowHabits.length}
              </span>
            </div>
          </div>

          {/* Large Tactile Progress Bar */}
          <div className="space-y-1">
            <div className="relative w-full h-4 sm:h-5 bg-[#faf6ee] border-2 border-hogwarts-300 rounded-full overflow-hidden p-0.5 shadow-inner">
              <div
                className={`h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2 text-[9px] font-black text-white ${
                  pctToday === 100
                    ? 'bg-gradient-to-r from-teal-600 via-emerald-500 to-emerald-400 ring-2 ring-emerald-300/50'
                    : pctToday >= 75
                    ? 'bg-gradient-to-r from-teal-700 via-teal-600 to-teal-400'
                    : pctToday >= 50
                    ? 'bg-gradient-to-r from-teal-600 to-amber-500'
                    : 'bg-gradient-to-r from-stone-400 to-teal-500'
                }`}
                style={{ width: `${Math.max(pctToday, pctToday > 0 ? 6 : 0)}%` }}
              >
                {pctToday >= 20 && `${pctToday}%`}
              </div>
            </div>

            {/* Milestones Labels */}
            <div className="flex justify-between text-[9px] text-hogwarts-600 font-bold px-1">
              <span>0% Mulai</span>
              <span>25%</span>
              <span>50% Setengah</span>
              <span>75%</span>
              <span className={pctToday === 100 ? 'text-emerald-800 font-black' : ''}>100% Master 👑</span>
            </div>
          </div>
        </div>
      </div>

      {/* Completion Rate Trend Chart with Range Selector */}
      <HabitCompletionChart
        dailyHabitLogs={state.dailyHabitLogs}
        habits={state.habits}
        selectedDate={selectedDate}
        onSelectDate={(date) => setSelectedDate(date)}
      />

      {/* Habits Checklist Groups with Full CRUD */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* High Priority - Fresh Mint / Teal */}
        <div className="bg-[#fdfcf9] border-2 border-hogwarts-300 rounded-3xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b-2 border-teal-200/80 pb-2">
            <span className="font-serif text-xs font-bold text-teal-950 uppercase tracking-wide flex items-center gap-1.5">
              <span>🌿</span> Prioritas Utama (Wajib)
            </span>
            <span className="text-[10px] text-teal-950 font-bold px-2 py-0.5 rounded-full bg-teal-100 border border-teal-300">
              Pondasi Harian
            </span>
          </div>

          <div className="space-y-2">
            {highHabits.map((h) => {
              const isChecked = isHabitChecked(h);
              return (
                <div
                  key={h.id}
                  className={`p-3 rounded-2xl border-2 flex items-center justify-between gap-2 transition-all ${
                    isChecked
                      ? 'border-teal-500 bg-teal-100/90 text-teal-950 shadow-xs ring-2 ring-teal-400/30'
                      : 'border-dashed border-stone-300 bg-stone-50/80 text-stone-700 hover:border-teal-400 hover:bg-stone-100/90'
                  }`}
                >
                  <div
                    onClick={() => handleToggleHabit(h)}
                    className="flex items-center gap-2.5 cursor-pointer flex-1 min-w-0"
                  >
                    <button className="transition transform active:scale-90 shrink-0">
                      {isChecked ? (
                        <CheckCircle2 className="w-5 h-5 text-teal-700 fill-teal-200" />
                      ) : (
                        <Circle className="w-5 h-5 text-stone-400 hover:text-teal-700" />
                      )}
                    </button>
                    <span className={`text-xs leading-snug break-words ${
                      isChecked ? 'text-teal-950 line-through font-bold opacity-90' : 'text-hogwarts-950 font-medium'
                    }`}>
                      {h.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {isChecked && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-teal-200/90 border border-teal-400 text-teal-950 hidden sm:inline-block">
                        ✓
                      </span>
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); setEditingHabit({ ...h }); }}
                      className="p-1 text-hogwarts-500 hover:text-teal-800 rounded-lg hover:bg-white"
                      title="Edit Habit"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`Hapus habit "${h.name}"?`)) {
                          deleteHabit(h.id);
                        }
                      }}
                      className="p-1 text-hogwarts-500 hover:text-rose-700 rounded-lg hover:bg-rose-50"
                      title="Hapus Habit"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Medium Priority - Warm Golden Amber */}
        <div className="bg-[#fdfcf9] border-2 border-hogwarts-300 rounded-3xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b-2 border-amber-200/80 pb-2">
            <span className="font-serif text-xs font-bold text-amber-950 uppercase tracking-wide flex items-center gap-1.5">
              <span>📜</span> Prioritas Menengah
            </span>
            <span className="text-[10px] text-amber-950 font-bold px-2 py-0.5 rounded-full bg-amber-100 border border-amber-300">
              Saat Senggang
            </span>
          </div>

          <div className="space-y-2">
            {mediumHabits.map((h) => {
              const isChecked = isHabitChecked(h);
              return (
                <div
                  key={h.id}
                  className={`p-3 rounded-2xl border-2 flex items-center justify-between gap-2 transition-all ${
                    isChecked
                      ? 'border-amber-500 bg-amber-100/90 text-amber-950 shadow-xs ring-2 ring-amber-400/30'
                      : 'border-dashed border-stone-300 bg-stone-50/80 text-stone-700 hover:border-amber-400 hover:bg-stone-100/90'
                  }`}
                >
                  <div
                    onClick={() => handleToggleHabit(h)}
                    className="flex items-center gap-2.5 cursor-pointer flex-1 min-w-0"
                  >
                    <button className="transition transform active:scale-90 shrink-0">
                      {isChecked ? (
                        <CheckCircle2 className="w-5 h-5 text-amber-700 fill-amber-200" />
                      ) : (
                        <Circle className="w-5 h-5 text-stone-400 hover:text-amber-700" />
                      )}
                    </button>
                    <span className={`text-xs leading-snug break-words ${
                      isChecked ? 'text-amber-950 line-through font-bold opacity-90' : 'text-hogwarts-950 font-medium'
                    }`}>
                      {h.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {isChecked && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-200/90 border border-amber-400 text-amber-950 hidden sm:inline-block">
                        ✓
                      </span>
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); setEditingHabit({ ...h }); }}
                      className="p-1 text-hogwarts-500 hover:text-amber-800 rounded-lg hover:bg-white"
                      title="Edit Habit"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`Hapus habit "${h.name}"?`)) {
                          deleteHabit(h.id);
                        }
                      }}
                      className="p-1 text-hogwarts-500 hover:text-rose-700 rounded-lg hover:bg-rose-50"
                      title="Hapus Habit"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Low Priority & Daily Reflection Note - Royal Purple / Amethyst */}
        <div className="bg-[#fdfcf9] border-2 border-hogwarts-300 rounded-3xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b-2 border-purple-200/80 pb-2">
            <span className="font-serif text-xs font-bold text-purple-950 uppercase tracking-wide flex items-center gap-1.5">
              <span>🕯️</span> Pengayaan & Refleksi
            </span>
            <span className="text-[10px] text-purple-950 font-bold px-2 py-0.5 rounded-full bg-purple-100 border border-purple-300">
              Bonus
            </span>
          </div>

          <div className="space-y-2">
            {lowHabits.map((h) => {
              const isChecked = isHabitChecked(h);
              return (
                <div
                  key={h.id}
                  className={`p-3 rounded-2xl border-2 flex items-center justify-between gap-2 transition-all ${
                    isChecked
                      ? 'border-purple-500 bg-purple-100/90 text-purple-950 shadow-xs ring-2 ring-purple-400/30'
                      : 'border-dashed border-stone-300 bg-stone-50/80 text-stone-700 hover:border-purple-400 hover:bg-stone-100/90'
                  }`}
                >
                  <div
                    onClick={() => handleToggleHabit(h)}
                    className="flex items-center gap-2.5 cursor-pointer flex-1 min-w-0"
                  >
                    <button className="transition transform active:scale-90 shrink-0">
                      {isChecked ? (
                        <CheckCircle2 className="w-5 h-5 text-purple-700 fill-purple-200" />
                      ) : (
                        <Circle className="w-5 h-5 text-stone-400 hover:text-purple-700" />
                      )}
                    </button>
                    <span className={`text-xs leading-snug break-words ${
                      isChecked ? 'text-purple-950 line-through font-bold opacity-90' : 'text-hogwarts-950 font-medium'
                    }`}>
                      {h.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {isChecked && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-purple-200/90 border border-purple-400 text-purple-950 hidden sm:inline-block">
                        ✓
                      </span>
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); setEditingHabit({ ...h }); }}
                      className="p-1 text-hogwarts-500 hover:text-purple-800 rounded-lg hover:bg-white"
                      title="Edit Habit"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`Hapus habit "${h.name}"?`)) {
                          deleteHabit(h.id);
                        }
                      }}
                      className="p-1 text-hogwarts-500 hover:text-rose-700 rounded-lg hover:bg-rose-50"
                      title="Hapus Habit"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Daily 2-Min Reflection */}
          <div className="pt-3 border-t-2 border-hogwarts-200 dark:border-[#382e24] space-y-1.5">
            <label className="block text-[11px] font-serif font-bold text-hogwarts-900 dark:text-hogwarts-200 flex items-center gap-1">
              <span>📝</span> Refleksi Harian Singkat (2 Menit):
            </label>
            <textarea
              rows={3}
              value={noteInput}
              onChange={(e) => handleNoteChange(e.target.value)}
              onBlur={handleNoteBlur}
              placeholder="Apa 1 hal bermakna yang kamu pelajari hari ini? Apa yang ingin diperbaiki besok?"
              className="w-full p-2.5 text-xs rounded-xl border-2 border-hogwarts-300 dark:border-[#382e24] bg-white dark:bg-[#1c1814] text-hogwarts-950 dark:text-[#f3ede2] placeholder-hogwarts-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-tiffany-600 font-medium"
            />
          </div>
        </div>
      </div>

      {/* Add Habit Modal */}
      <ModalPortal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <div className="bg-[#fdfcf9] dark:bg-[#1c1814] border-2 border-hogwarts-300 dark:border-[#3d3328] rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4 text-hogwarts-950 dark:text-hogwarts-100">
            <div className="flex items-center justify-between border-b-2 border-hogwarts-200 dark:border-[#382e24] pb-3">
              <h3 className="font-serif text-base font-bold text-hogwarts-950 dark:text-hogwarts-100">
                Tambah Kebiasaan / Ritual Baru
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-hogwarts-600 dark:text-hogwarts-400 hover:text-hogwarts-900 dark:hover:text-hogwarts-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-hogwarts-900 dark:text-hogwarts-200 mb-1 font-bold">Nama Kebiasaan</label>
                <input
                  type="text"
                  value={newHabitName}
                  onChange={(e) => setNewHabitName(e.target.value)}
                  placeholder="Contoh: Baca ringkasan obat kardiovaskuler 1 bab"
                  className="w-full px-3 py-1.5 rounded-xl border-2 border-hogwarts-300 dark:border-[#382e24] bg-white dark:bg-[#251f19] text-hogwarts-950 dark:text-hogwarts-100 font-medium focus:outline-none focus:ring-2 focus:ring-tiffany-600"
                />
              </div>

              <div>
                <label className="block text-hogwarts-900 dark:text-hogwarts-200 mb-1 font-bold">Prioritas</label>
                <select
                  value={newHabitPriority}
                  onChange={(e) => setNewHabitPriority(e.target.value as any)}
                  className="w-full px-3 py-1.5 rounded-xl border-2 border-hogwarts-300 dark:border-[#382e24] bg-white dark:bg-[#251f19] text-hogwarts-950 dark:text-hogwarts-100 font-bold focus:outline-none focus:ring-2 focus:ring-tiffany-600"
                >
                  <option value="High">High (Wajib bahkan saat hari jaga)</option>
                  <option value="Medium">Medium (Lakukan saat jadwal senggang)</option>
                  <option value="Low">Low (Pengayaan / penguatan tambahan)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t-2 border-hogwarts-200 dark:border-[#382e24]">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-1.5 text-xs font-bold text-hogwarts-800 dark:text-hogwarts-300 hover:bg-hogwarts-100 dark:hover:bg-[#2e261f] border border-hogwarts-300 dark:border-[#382e24] rounded-xl transition"
              >
                Batal
              </button>
              <button
                onClick={handleCreateHabit}
                className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-hogwarts-950 dark:text-hogwarts-100 bg-[#fdfcf9] dark:bg-[#251f19] hover:bg-[#f5efe4] dark:hover:bg-[#2e261f] border-2 border-hogwarts-400 dark:border-[#3d3328] rounded-xl shadow-xs transition active:scale-95"
              >
                <Save className="w-3.5 h-3.5 text-hogwarts-700 dark:text-hogwarts-400" />
                <span>Simpan Kebiasaan ✨</span>
              </button>
            </div>
          </div>
      </ModalPortal>

      {/* Edit Habit Modal */}
      <ModalPortal isOpen={!!editingHabit} onClose={() => setEditingHabit(null)}>
        {editingHabit && (
          <div className="bg-[#fdfcf9] dark:bg-[#1c1814] border-2 border-hogwarts-300 dark:border-[#3d3328] rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4 text-hogwarts-950 dark:text-hogwarts-100">
            <div className="flex items-center justify-between border-b-2 border-hogwarts-200 dark:border-[#382e24] pb-3">
              <h3 className="font-serif text-base font-bold text-hogwarts-950 dark:text-hogwarts-100">
                Edit Kebiasaan Belajar
              </h3>
              <button
                onClick={() => setEditingHabit(null)}
                className="p-1 text-hogwarts-600 dark:text-hogwarts-400 hover:text-hogwarts-900 dark:hover:text-hogwarts-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-hogwarts-900 dark:text-hogwarts-200 mb-1 font-bold">Nama Kebiasaan</label>
                <input
                  type="text"
                  value={editingHabit.name}
                  onChange={(e) => setEditingHabit({ ...editingHabit, name: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-xl border-2 border-hogwarts-300 dark:border-[#382e24] bg-white dark:bg-[#251f19] text-hogwarts-950 dark:text-hogwarts-100 font-medium focus:outline-none focus:ring-2 focus:ring-tiffany-600"
                />
              </div>

              <div>
                <label className="block text-hogwarts-900 dark:text-hogwarts-200 mb-1 font-bold">Prioritas</label>
                <select
                  value={editingHabit.priority}
                  onChange={(e) => setEditingHabit({ ...editingHabit, priority: e.target.value as any })}
                  className="w-full px-3 py-1.5 rounded-xl border-2 border-hogwarts-300 dark:border-[#382e24] bg-white dark:bg-[#251f19] text-hogwarts-950 dark:text-hogwarts-100 font-bold focus:outline-none focus:ring-2 focus:ring-tiffany-600"
                >
                  <option value="High">High (Wajib bahkan saat hari jaga)</option>
                  <option value="Medium">Medium (Lakukan saat jadwal senggang)</option>
                  <option value="Low">Low (Pengayaan / penguatan tambahan)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t-2 border-hogwarts-200 dark:border-[#382e24]">
              <button
                onClick={() => {
                  if (window.confirm(`Hapus habit "${editingHabit.name}"?`)) {
                    deleteHabit(editingHabit.id);
                    setEditingHabit(null);
                  }
                }}
                className="flex items-center gap-1 text-xs font-bold text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 px-3 py-1.5 rounded-xl"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Hapus
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditingHabit(null)}
                  className="px-4 py-1.5 text-xs font-bold text-hogwarts-800 dark:text-hogwarts-300 hover:bg-hogwarts-100 dark:hover:bg-[#2e261f] border border-hogwarts-300 dark:border-[#382e24] rounded-xl transition"
                >
                  Batal
                </button>
                <button
                  onClick={handleSaveHabitEdit}
                  className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-hogwarts-950 dark:text-hogwarts-100 bg-[#fdfcf9] dark:bg-[#251f19] hover:bg-[#f5efe4] dark:hover:bg-[#2e261f] border-2 border-hogwarts-400 dark:border-[#3d3328] rounded-xl shadow-xs transition active:scale-95"
                >
                  <Save className="w-3.5 h-3.5 text-hogwarts-700 dark:text-hogwarts-400" />
                  Simpan Perubahan
                </button>
              </div>
            </div>
          </div>
        )}
      </ModalPortal>
    </div>
  );
};
