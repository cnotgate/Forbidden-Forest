import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { IntensifDay } from '../types';
import {
  Flame,
  CheckCircle2,
  Circle,
  Search,
  Coffee,
  Brain,
  Edit3,
  X,
  Save,
  Calendar,
  Sparkles,
  Zap,
  BookOpen,
  Trophy,
  Compass,
  MapPin,
  Clock,
  ShieldAlert,
  Plus,
  Trash2,
  RefreshCw
} from 'lucide-react';
import { formatDateIndo, getDayNameIndo } from '../utils/dateHelper';
import { sounds } from '../utils/soundHelper';
import confetti from 'canvas-confetti';
import { ModalPortal } from './ModalPortal';

export const IntensifTab: React.FC = () => {
  const { state, toggleIntensifDay, updateIntensifDay, addIntensifDay, deleteIntensifDay, autoShiftIntensifFromDDay } = useApp();

  const [search, setSearch] = useState('');
  const [selectedSector, setSelectedSector] = useState<number | 'ALL'>('ALL');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [filterDone, setFilterDone] = useState<'ALL' | 'DONE' | 'UNDONE'>('ALL');
  const [editingDay, setEditingDay] = useState<IntensifDay | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Day form state
  const [newDate, setNewDate] = useState('');
  const [newType, setNewType] = useState('Materi');
  const [newFocus, setNewFocus] = useState('');
  const [newCoreActivity, setNewCoreActivity] = useState('');
  const [newQuestions, setNewQuestions] = useState(60);
  const [newHours, setNewHours] = useState(7);
  const [newNotes, setNewNotes] = useState('');

  const types = ['ALL', 'Materi', 'Recall', 'REST', 'Tryout', 'OSCE', 'Taper', 'UJIAN'];

  // Sectors of 7 days each
  const totalDays = state.intensifDays.length || 70;
  const numSectors = Math.max(1, Math.ceil(totalDays / 7));

  const sectors = useMemo(() => {
    return Array.from({ length: numSectors }, (_, i) => ({
      sectorNum: i + 1,
      startDay: i * 7 + 1,
      endDay: Math.min((i + 1) * 7, totalDays),
      label: `Sektor ${i + 1} (H-${Math.max(1, 71 - (i * 7 + 1))} s/d H-${Math.max(1, 71 - Math.min((i + 1) * 7, totalDays))})`
    }));
  }, [totalDays, numSectors]);

  const filteredDays = state.intensifDays.filter(d => {
    if (selectedSector !== 'ALL') {
      const start = (selectedSector - 1) * 7 + 1;
      const end = selectedSector * 7;
      if (d.dayNum < start || d.dayNum > end) return false;
    }
    if (selectedType !== 'ALL' && !d.type.toLowerCase().includes(selectedType.toLowerCase())) return false;
    if (filterDone === 'DONE' && !d.isDone) return false;
    if (filterDone === 'UNDONE' && d.isDone) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const match =
        d.focus.toLowerCase().includes(q) ||
        d.coreActivity.toLowerCase().includes(q) ||
        d.dayName.toLowerCase().includes(q) ||
        `hari ke-${d.dayNum}`.includes(q) ||
        `h-${71 - d.dayNum}`.includes(q);
      if (!match) return false;
    }
    return true;
  });

  const completedCount = state.intensifDays.filter(d => d.isDone).length;

  const handleToggleDay = (dayNum: number, currentlyDone: boolean, isRest: boolean) => {
    toggleIntensifDay(dayNum);
    if (!currentlyDone) {
      sounds.playQuestComplete();
      confetti({
        particleCount: isRest ? 30 : 60,
        spread: 60,
        origin: { y: 0.7 }
      });
    } else {
      sounds.playClick();
    }
  };

  const handleSaveDayEdit = () => {
    if (editingDay) {
      updateIntensifDay(editingDay.dayNum, editingDay);
      sounds.playClick();
      setEditingDay(null);
    }
  };

  const handleCreateDay = () => {
    if (!newFocus.trim()) {
      alert('Mohon isi fokus materi hari!');
      return;
    }

    const dateVal = newDate || new Date().toISOString().slice(0, 10);
    const dayNameVal = getDayNameIndo(dateVal);

    addIntensifDay({
      date: dateVal,
      dayName: dayNameVal,
      type: newType,
      focus: newFocus,
      coreActivity: newCoreActivity || 'Recall 15m + Drill soal + Error Book',
      targetQuestions: newQuestions,
      targetHours: newHours,
      isDone: false,
      notes: newNotes
    });

    sounds.playLevelUp();
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 }
    });

    setNewFocus('');
    setNewCoreActivity('');
    setNewNotes('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-br from-[#f8f3ea] via-[#faf5ec] to-[#f0e7d5] dark:from-[#1c1713] dark:via-[#181410] dark:to-[#120f0d] border border-hogwarts-300/80 dark:border-[#382f25] rounded-3xl p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-xl font-bold text-hogwarts-950 dark:text-hogwarts-50 flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-700 dark:text-amber-500" />
              Peta Ekspedisi Intensif {totalDays} Hari (Pass 3)
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-950 dark:text-amber-300 border border-amber-400 dark:border-amber-700">
              H-{totalDays} Menuju Ujian
            </span>
          </div>
          <p className="text-xs text-hogwarts-800 dark:text-hogwarts-300 mt-1 font-medium">
            Satu hari satu sistem! <span className="font-bold text-tiffany-900 dark:text-tiffany-400">Recall 15' → 60 Soal Timed → Grimoire Error → Nalar Sokrates</span>.
            Hari Minggu dikhususkan untuk <span className="font-bold text-emerald-900 dark:text-emerald-400">REST (Konsolidasi Memori Otak)</span> ☕.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => { sounds.playClick(); setIsAddModalOpen(true); }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-tiffany-200 hover:bg-tiffany-300 text-tiffany-950 border-2 border-tiffany-700 shadow-xs transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Tambah Hari
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              autoShiftIntensifFromDDay(state.dashboard.ddayUKMPPD);
            }}
            className="text-xs font-bold px-3 py-2 rounded-xl border-2 border-hogwarts-300 dark:border-[#382f25] bg-[#fdfcf9] dark:bg-[#25201b] text-hogwarts-900 dark:text-hogwarts-100 hover:bg-hogwarts-100 dark:hover:bg-[#2e2620] transition active:scale-95 shadow-sm"
          >
            Sinkron ke D-Day
          </button>

          <div className="text-right pl-2">
            <div className="font-serif text-sm font-bold text-hogwarts-950 dark:text-hogwarts-100">
              {completedCount} / {totalDays} Selesai
            </div>
            <div className="text-xs text-tiffany-800 dark:text-tiffany-400 font-bold">
              {Math.round((completedCount / (totalDays || 1)) * 100)}% Terlampaui ✨
            </div>
          </div>
        </div>
      </div>

      {/* Routine Doctrine Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 rounded-3xl bg-hogwarts-100/70 dark:bg-[#181410] border-2 border-hogwarts-300 dark:border-[#382f25] text-xs shadow-sm">
        <div className="p-3.5 bg-[#fdfcf9] dark:bg-[#201a15] rounded-2xl border-2 border-hogwarts-200 dark:border-[#332a21] space-y-1 shadow-xs">
          <div className="font-serif font-bold text-tiffany-900 dark:text-tiffany-400 flex items-center gap-1.5">
            <span>🧠</span> ① Recall Kertas Kosong
          </div>
          <p className="text-hogwarts-800 dark:text-hogwarts-300 text-[11px] leading-relaxed font-medium">
            Tuliskan peta konsep 15 menit tanpa membuka catatan sama sekali.
          </p>
        </div>
        <div className="p-3.5 bg-[#fdfcf9] dark:bg-[#201a15] rounded-2xl border-2 border-hogwarts-200 dark:border-[#332a21] space-y-1 shadow-xs">
          <div className="font-serif font-bold text-tiffany-900 dark:text-tiffany-400 flex items-center gap-1.5">
            <span>⚡</span> ② Drill 60 Soal Timed
          </div>
          <p className="text-hogwarts-800 dark:text-hogwarts-300 text-[11px] leading-relaxed font-medium">
            Latihan soal topik hari ini dengan timer ketat seolah ujian nyata.
          </p>
        </div>
        <div className="p-3.5 bg-[#fdfcf9] dark:bg-[#201a15] rounded-2xl border-2 border-hogwarts-200 dark:border-[#332a21] space-y-1 shadow-xs">
          <div className="font-serif font-bold text-tiffany-900 dark:text-tiffany-400 flex items-center gap-1.5">
            <span>📖</span> ③ Catat ke Error Book
          </div>
          <p className="text-hogwarts-800 dark:text-hogwarts-300 text-[11px] leading-relaxed font-medium">
            Maksimal 15 menit per soal. Tulis evaluasi dengan kata sendiri.
          </p>
        </div>
        <div className="p-3.5 bg-[#fdfcf9] dark:bg-[#201a15] rounded-2xl border-2 border-hogwarts-200 dark:border-[#332a21] space-y-1 shadow-xs">
          <div className="font-serif font-bold text-tiffany-900 dark:text-tiffany-400 flex items-center gap-1.5">
            <span>💬</span> ④ 3 Nalar Sokrates
          </div>
          <p className="text-hogwarts-800 dark:text-hogwarts-300 text-[11px] leading-relaxed font-medium">
            Kenapa diagnosis ini? Apa bedanya dengan DDx? 1 Variabel diubah?
          </p>
        </div>
      </div>

      {/* Sector Selection Ribbon */}
      <div className="bg-[#fdfcf9] dark:bg-[#1c1814] border-2 border-hogwarts-300 dark:border-[#382f25] rounded-3xl p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-serif font-bold text-hogwarts-950 dark:text-hogwarts-100 flex items-center gap-2">
            <Compass className="w-4 h-4 text-tiffany-700 dark:text-tiffany-400" />
            <span>Pilih Sektor Penjelajahan:</span>
          </div>
          <span className="text-[11px] font-bold text-hogwarts-700 dark:text-hogwarts-400">
            {filteredDays.length} Hari Ditampilkan
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => { sounds.playClick(); setSelectedSector('ALL'); }}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
              selectedSector === 'ALL'
                ? 'bg-tiffany-200 text-tiffany-950 border-2 border-tiffany-700 shadow-sm'
                : 'bg-hogwarts-100 dark:bg-[#25201b] hover:bg-hogwarts-200 dark:hover:bg-[#2e2620] text-hogwarts-900 dark:text-hogwarts-200 border border-hogwarts-300 dark:border-[#382f25]'
            }`}
          >
            Semua ({totalDays} Hari)
          </button>
          {sectors.map((sec) => (
            <button
              key={sec.sectorNum}
              onClick={() => { sounds.playClick(); setSelectedSector(sec.sectorNum); }}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                selectedSector === sec.sectorNum
                  ? 'bg-tiffany-200 text-tiffany-950 border-2 border-tiffany-700 shadow-sm'
                  : 'bg-hogwarts-100 dark:bg-[#25201b] hover:bg-hogwarts-200 dark:hover:bg-[#2e2620] text-hogwarts-900 dark:text-hogwarts-200 border border-hogwarts-300 dark:border-[#382f25]'
              }`}
            >
              M-{sec.sectorNum}
            </button>
          ))}
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-[#fdfcf9] dark:bg-[#1c1814] border-2 border-hogwarts-300 dark:border-[#382f25] rounded-2xl p-4 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-hogwarts-500" />
          <input
            type="text"
            placeholder="Cari fokus topik intensif, hari, atau nomor H-..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-hogwarts-300 dark:border-[#382f25] bg-hogwarts-50 dark:bg-[#25201b] text-hogwarts-950 dark:text-hogwarts-100 placeholder-hogwarts-400 dark:placeholder-hogwarts-500 focus:outline-none focus:ring-2 focus:ring-tiffany-600 font-medium"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-hogwarts-300 dark:border-[#382f25] bg-hogwarts-50 dark:bg-[#25201b] text-hogwarts-950 dark:text-hogwarts-100 focus:outline-none font-bold"
          >
            {types.map(t => (
              <option key={t} value={t}>
                {t === 'ALL' ? 'Semua Tipe' : t}
              </option>
            ))}
          </select>

          <select
            value={filterDone}
            onChange={(e) => setFilterDone(e.target.value as any)}
            className="px-3 py-2 text-xs rounded-xl border border-hogwarts-300 dark:border-[#382f25] bg-hogwarts-50 dark:bg-[#25201b] text-hogwarts-950 dark:text-hogwarts-100 focus:outline-none font-bold"
          >
            <option value="ALL">Semua Hari</option>
            <option value="DONE">✓ Tuntas</option>
            <option value="UNDONE">Belum Tuntas</option>
          </select>
        </div>
      </div>

      {/* 70-Day Expedition Tiles Grid */}
      {filteredDays.length === 0 ? (
        <div className="p-12 text-center bg-[#fdfcf9] dark:bg-[#1c1814] rounded-3xl border-2 border-hogwarts-300 dark:border-[#382f25] text-hogwarts-600 dark:text-hogwarts-400 shadow-sm">
          <span className="text-4xl block mb-2">🧭</span>
          <p className="font-serif text-sm font-bold text-hogwarts-950 dark:text-hogwarts-100">
            {search || selectedType !== 'ALL' || selectedSector !== 'ALL' || filterDone !== 'ALL'
              ? 'Tidak ada hari ekspedisi yang cocok dengan filter.'
              : 'Belum ada hari ekspedisi intensif.'}
          </p>
          <p className="text-xs text-hogwarts-700 dark:text-hogwarts-400 mt-1 max-w-md mx-auto">
            {search || selectedType !== 'ALL' || selectedSector !== 'ALL' || filterDone !== 'ALL'
              ? 'Coba ubah kata kunci atau bersihkan filter untuk menampilkan hari intensif.'
              : 'Klik tombol "Tambah Hari" di atas untuk menambahkan jadwal ekspedisi baru.'}
          </p>
          {(search || selectedType !== 'ALL' || selectedSector !== 'ALL' || filterDone !== 'ALL') && (
            <button
              onClick={() => {
                setSearch('');
                setSelectedType('ALL');
                setSelectedSector('ALL');
                setFilterDone('ALL');
              }}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-hogwarts-800 dark:text-hogwarts-200 bg-hogwarts-100 dark:bg-[#28211b] hover:bg-hogwarts-200 dark:hover:bg-[#342b23] border border-hogwarts-300 dark:border-[#382f25] rounded-xl transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset Semua Filter & Pencarian
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredDays.map((day) => {
            const isRest = day.type === 'REST';
            const isTryout = day.type === 'Tryout';
            const isOSCE = day.type === 'OSCE';
            const isUjian = day.type === 'UJIAN';
          const hMinus = Math.max(1, 71 - day.dayNum);

          // Theme based on type
          let cardBg = 'bg-[#fdfcf9] dark:bg-[#1c1814] border-hogwarts-300 dark:border-[#3d3328]';
          let badgeBg = 'bg-amber-100 dark:bg-amber-950/70 text-amber-950 dark:text-amber-300 border-amber-400 dark:border-amber-700/60';
          let icon = '📖';

          if (day.isDone) {
            cardBg = 'bg-gradient-to-br from-[#f0fbf9] to-[#e6f7f4] dark:from-[#082824] dark:to-[#0e3833] border-tiffany-400 dark:border-tiffany-600/70';
            badgeBg = 'bg-amber-100 dark:bg-amber-950/70 text-amber-950 dark:text-amber-300 border-amber-400 dark:border-amber-700/60';
            icon = '📖';
          } else if (isRest) {
            cardBg = 'bg-gradient-to-br from-[#f2fcf5] to-[#e4f8ec] dark:from-[#09281a] dark:to-[#0e3725] border-emerald-400 dark:border-emerald-600/70';
            badgeBg = 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-950 dark:text-emerald-300 border-emerald-400 dark:border-emerald-700/60';
            icon = '☕';
          } else if (isTryout) {
            cardBg = 'bg-gradient-to-br from-[#faf5ff] to-[#f3e8ff] dark:from-[#220b38] dark:to-[#321252] border-purple-400 dark:border-purple-600/70';
            badgeBg = 'bg-purple-100 dark:bg-purple-950/70 text-purple-950 dark:text-purple-300 border-purple-400 dark:border-purple-700/60';
            icon = '🐉';
          } else if (isOSCE) {
            cardBg = 'bg-gradient-to-br from-[#eef2ff] to-[#e0e7ff] dark:from-[#141c3d] dark:to-[#1c2754] border-indigo-400 dark:border-indigo-600/70';
            badgeBg = 'bg-indigo-100 dark:bg-indigo-950/70 text-indigo-950 dark:text-indigo-300 border-indigo-400 dark:border-indigo-700/60';
            icon = '🧪';
          } else if (isUjian) {
            cardBg = 'bg-gradient-to-br from-[#fffbeb] to-[#fef3c7] dark:from-[#331c08] dark:to-[#48270b] border-amber-500 dark:border-amber-600/70';
            badgeBg = 'bg-amber-200 dark:bg-amber-900/70 text-amber-950 dark:text-amber-300 border-amber-500 dark:border-amber-600/70';
            icon = '🏆';
          }

          return (
            <div
              key={day.dayNum}
              className={`rounded-3xl p-4 border-2 transition-all flex flex-col justify-between shadow-xs hover:shadow-md ${cardBg}`}
            >
              <div>
                {/* Card Header */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-serif font-extrabold text-xs px-2.5 py-0.5 rounded-lg bg-hogwarts-100 dark:bg-hogwarts-900/60 text-hogwarts-950 dark:text-hogwarts-200 border border-hogwarts-300 dark:border-hogwarts-700">
                      H-{hMinus}
                    </span>
                    <span className="text-[11px] font-bold text-hogwarts-700 dark:text-hogwarts-400">
                      Hari {day.dayNum}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${badgeBg}`}>
                      {icon} {day.type}
                    </span>
                    <button
                      onClick={() => setEditingDay({ ...day })}
                      className="p-1 text-hogwarts-600 dark:text-hogwarts-400 hover:text-tiffany-700 rounded-lg hover:bg-hogwarts-100 dark:hover:bg-stone-800 transition"
                      title="Edit Hari"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        sounds.playClick();
                        if (window.confirm(`Hapus Hari ke-${day.dayNum} (${day.focus})?`)) {
                          deleteIntensifDay(day.dayNum);
                        }
                      }}
                      className="p-1 text-hogwarts-600 dark:text-hogwarts-400 hover:text-rose-700 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                      title="Hapus Hari"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Date and Target row */}
                <div className="flex items-center justify-between text-[11px] text-hogwarts-700 dark:text-hogwarts-300 bg-white/80 dark:bg-[#15120f] rounded-xl p-2 border border-hogwarts-200 dark:border-[#383028] mb-2.5">
                  <div className="flex items-center gap-1 font-medium text-hogwarts-800 dark:text-hogwarts-200">
                    <Calendar className="w-3 h-3 text-tiffany-700 dark:text-tiffany-400" />
                    <span>{formatDateIndo(day.date)} ({day.dayName})</span>
                  </div>
                  <div>
                    {isRest ? (
                      <span className="text-emerald-900 dark:text-emerald-300 font-bold">Total Rest</span>
                    ) : (
                      <span className="font-bold text-hogwarts-900 dark:text-hogwarts-100">{day.targetQuestions}s · {day.targetHours}j</span>
                    )}
                  </div>
                </div>

                {/* Focus Topic */}
                <div className="space-y-1 mb-2">
                  <div className="text-[10px] font-bold text-tiffany-950 uppercase font-serif">
                    Fokus Ekspedisi:
                  </div>
                  <h3 className="font-serif font-bold text-sm text-hogwarts-950 leading-snug">
                    {day.focus}
                  </h3>
                </div>

                {/* Core Activity */}
                <p className="text-[11px] text-hogwarts-800 dark:text-hogwarts-300 leading-relaxed font-medium bg-white/60 dark:bg-[#15120f] p-2.5 rounded-xl border border-hogwarts-200/80 dark:border-[#383028] mb-3">
                  {day.coreActivity}
                </p>
              </div>

              {/* Complete button */}
              <div className="pt-2 border-t border-hogwarts-200 dark:border-[#383028]">
                <button
                  onClick={() => handleToggleDay(day.dayNum, day.isDone, isRest)}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 active:scale-95 shadow-xs ${
                    day.isDone
                      ? 'bg-tiffany-200 hover:bg-tiffany-300 text-tiffany-950 border-2 border-tiffany-500'
                      : isRest
                      ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-950 border-2 border-emerald-400'
                      : 'bg-hogwarts-100 hover:bg-tiffany-100 text-hogwarts-900 border-2 border-hogwarts-300 hover:border-tiffany-400'
                  }`}
                >
                  {day.isDone ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-tiffany-700 fill-tiffany-100" />
                      <span>Node Tuntas ✨ (+{isRest ? '10' : '20'} EXP)</span>
                    </>
                  ) : (
                    <>
                      <Circle className="w-4 h-4 text-hogwarts-400" />
                      <span>{isRest ? 'Ambil Rehat ☕ (+10 EXP)' : 'Tuntaskan Hari (+20 EXP ✨)'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
        </div>
      )}

      {/* Add New Day Modal */}
      <ModalPortal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <div className="bg-[#fdfcf9] dark:bg-[#1c1814] border-2 border-hogwarts-300 dark:border-[#382f25] rounded-3xl w-full max-w-xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b-2 border-hogwarts-200 dark:border-[#2e261f] pb-3">
              <h3 className="font-serif text-base font-bold text-hogwarts-950 dark:text-hogwarts-50 flex items-center gap-2">
                <Plus className="w-5 h-5 text-tiffany-700 dark:text-tiffany-400" />
                Tambah Hari Ekspedisi Baru (Hari ke-{totalDays + 1})
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-hogwarts-600 dark:text-hogwarts-400 hover:text-hogwarts-900 dark:hover:text-hogwarts-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-hogwarts-900 dark:text-hogwarts-200 mb-1 font-bold">Tanggal</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border-2 border-hogwarts-300 dark:border-[#382f25] bg-white dark:bg-[#25201b] text-hogwarts-950 dark:text-hogwarts-100 font-medium focus:outline-none focus:ring-2 focus:ring-tiffany-600"
                  />
                </div>
                <div>
                  <label className="block text-hogwarts-900 dark:text-hogwarts-200 mb-1 font-bold">Tipe Hari</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border-2 border-hogwarts-300 dark:border-[#382f25] bg-white dark:bg-[#25201b] text-hogwarts-950 dark:text-hogwarts-100 font-medium focus:outline-none focus:ring-2 focus:ring-tiffany-600"
                  >
                    <option value="Materi">Materi</option>
                    <option value="Recall">Recall</option>
                    <option value="REST">REST ☕</option>
                    <option value="Tryout">Tryout 🐉</option>
                    <option value="OSCE">OSCE 🧪</option>
                    <option value="Taper">Taper</option>
                    <option value="UJIAN">UJIAN 🏆</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-hogwarts-900 dark:text-hogwarts-200 mb-1 font-bold">Target Soal</label>
                  <input
                    type="number"
                    value={newQuestions}
                    onChange={(e) => setNewQuestions(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 rounded-xl border-2 border-hogwarts-300 dark:border-[#382f25] bg-white dark:bg-[#25201b] text-hogwarts-950 dark:text-hogwarts-100 font-medium focus:outline-none focus:ring-2 focus:ring-tiffany-600"
                  />
                </div>
                <div>
                  <label className="block text-hogwarts-900 dark:text-hogwarts-200 mb-1 font-bold">Target Jam</label>
                  <input
                    type="number"
                    step="0.5"
                    value={newHours}
                    onChange={(e) => setNewHours(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 rounded-xl border-2 border-hogwarts-300 dark:border-[#382f25] bg-white dark:bg-[#25201b] text-hogwarts-950 dark:text-hogwarts-100 font-medium focus:outline-none focus:ring-2 focus:ring-tiffany-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-hogwarts-900 dark:text-hogwarts-200 mb-1 font-bold">Fokus Topik</label>
                <input
                  type="text"
                  value={newFocus}
                  onChange={(e) => setNewFocus(e.target.value)}
                  placeholder="Contoh: Respirasi: Asma Akut vs PPOK Eksaserbasi"
                  className="w-full px-3 py-1.5 rounded-xl border-2 border-hogwarts-300 dark:border-[#382f25] bg-white dark:bg-[#25201b] text-hogwarts-950 dark:text-hogwarts-100 font-medium focus:outline-none focus:ring-2 focus:ring-tiffany-600"
                />
              </div>

              <div>
                <label className="block text-hogwarts-900 dark:text-hogwarts-200 mb-1 font-bold">Aktivitas Inti</label>
                <textarea
                  rows={2}
                  value={newCoreActivity}
                  onChange={(e) => setNewCoreActivity(e.target.value)}
                  placeholder="Contoh: Recall 15m bagan terapi oksigen + drill 60 soal + catat ke Error Book"
                  className="w-full px-3 py-1.5 rounded-xl border-2 border-hogwarts-300 dark:border-[#382f25] bg-white dark:bg-[#25201b] text-hogwarts-950 dark:text-hogwarts-100 font-medium focus:outline-none focus:ring-2 focus:ring-tiffany-600"
                />
              </div>

              <div>
                <label className="block text-hogwarts-900 dark:text-hogwarts-200 mb-1 font-bold">Catatan Tambahan (Opsional)</label>
                <input
                  type="text"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Catatan kecil untuk diri sendiri..."
                  className="w-full px-3 py-1.5 rounded-xl border-2 border-hogwarts-300 dark:border-[#382f25] bg-white dark:bg-[#25201b] text-hogwarts-950 dark:text-hogwarts-100 font-medium focus:outline-none focus:ring-2 focus:ring-tiffany-600"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t-2 border-hogwarts-200 dark:border-[#2e261f]">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-1.5 text-xs font-bold text-hogwarts-800 dark:text-hogwarts-300 hover:bg-hogwarts-100 dark:hover:bg-[#28211b] border border-hogwarts-300 dark:border-[#382f25] rounded-xl transition"
              >
                Batal
              </button>
              <button
                onClick={handleCreateDay}
                className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-tiffany-950 bg-tiffany-200 hover:bg-tiffany-300 border-2 border-tiffany-700 rounded-xl shadow-sm transition active:scale-95"
              >
                <Save className="w-3.5 h-3.5" />
                Simpan & Tambah Hari ✨
              </button>
            </div>
          </div>
      </ModalPortal>

      {/* Edit Intensif Day Modal */}
      <ModalPortal isOpen={!!editingDay} onClose={() => setEditingDay(null)}>
        {editingDay && (
          <div className="bg-[#fdfcf9] dark:bg-[#1c1814] border-2 border-hogwarts-300 dark:border-[#382f25] rounded-3xl w-full max-w-xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b-2 border-hogwarts-200 dark:border-[#2e261f] pb-3">
              <h3 className="font-serif text-base font-bold text-hogwarts-950 dark:text-hogwarts-50">
                Edit Intensif Hari ke-{editingDay.dayNum} (H-{71 - editingDay.dayNum})
              </h3>
              <button
                onClick={() => setEditingDay(null)}
                className="p-1 text-hogwarts-600 dark:text-hogwarts-400 hover:text-hogwarts-900 dark:hover:text-hogwarts-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-hogwarts-900 dark:text-hogwarts-200 mb-1 font-bold">Tanggal</label>
                  <input
                    type="date"
                    value={editingDay.date}
                    onChange={(e) => setEditingDay({ ...editingDay, date: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl border-2 border-hogwarts-300 dark:border-[#382f25] bg-white dark:bg-[#25201b] text-hogwarts-950 dark:text-hogwarts-100 font-medium focus:outline-none focus:ring-2 focus:ring-tiffany-600"
                  />
                </div>
                <div>
                  <label className="block text-hogwarts-900 dark:text-hogwarts-200 mb-1 font-bold">Hari</label>
                  <input
                    type="text"
                    value={editingDay.dayName}
                    onChange={(e) => setEditingDay({ ...editingDay, dayName: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl border-2 border-hogwarts-300 dark:border-[#382f25] bg-white dark:bg-[#25201b] text-hogwarts-950 dark:text-hogwarts-100 font-medium focus:outline-none focus:ring-2 focus:ring-tiffany-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-hogwarts-900 dark:text-hogwarts-200 mb-1 font-bold">Tipe Hari</label>
                  <select
                    value={editingDay.type}
                    onChange={(e) => setEditingDay({ ...editingDay, type: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl border-2 border-hogwarts-300 dark:border-[#382f25] bg-white dark:bg-[#25201b] text-hogwarts-950 dark:text-hogwarts-100 font-medium focus:outline-none focus:ring-2 focus:ring-tiffany-600"
                  >
                    <option value="Materi">Materi</option>
                    <option value="Recall">Recall</option>
                    <option value="REST">REST</option>
                    <option value="Tryout">Tryout</option>
                    <option value="OSCE">OSCE</option>
                    <option value="Taper">Taper</option>
                    <option value="UJIAN">UJIAN</option>
                  </select>
                </div>
                <div>
                  <label className="block text-hogwarts-900 dark:text-hogwarts-200 mb-1 font-bold">Target Soal</label>
                  <input
                    type="number"
                    value={editingDay.targetQuestions}
                    onChange={(e) => setEditingDay({ ...editingDay, targetQuestions: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 rounded-xl border-2 border-hogwarts-300 dark:border-[#382f25] bg-white dark:bg-[#25201b] text-hogwarts-950 dark:text-hogwarts-100 font-medium focus:outline-none focus:ring-2 focus:ring-tiffany-600"
                  />
                </div>
                <div>
                  <label className="block text-hogwarts-900 dark:text-hogwarts-200 mb-1 font-bold">Target Jam</label>
                  <input
                    type="number"
                    step="0.5"
                    value={editingDay.targetHours}
                    onChange={(e) => setEditingDay({ ...editingDay, targetHours: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 rounded-xl border-2 border-hogwarts-300 dark:border-[#382f25] bg-white dark:bg-[#25201b] text-hogwarts-950 dark:text-hogwarts-100 font-medium focus:outline-none focus:ring-2 focus:ring-tiffany-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-hogwarts-900 dark:text-hogwarts-200 mb-1 font-bold">Fokus Topik</label>
                <input
                  type="text"
                  value={editingDay.focus}
                  onChange={(e) => setEditingDay({ ...editingDay, focus: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-xl border-2 border-hogwarts-300 dark:border-[#382f25] bg-white dark:bg-[#25201b] text-hogwarts-950 dark:text-hogwarts-100 font-medium focus:outline-none focus:ring-2 focus:ring-tiffany-600"
                />
              </div>

              <div>
                <label className="block text-hogwarts-900 dark:text-hogwarts-200 mb-1 font-bold">Aktivitas Inti</label>
                <textarea
                  rows={2}
                  value={editingDay.coreActivity}
                  onChange={(e) => setEditingDay({ ...editingDay, coreActivity: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-xl border-2 border-hogwarts-300 dark:border-[#382f25] bg-white dark:bg-[#25201b] text-hogwarts-950 dark:text-hogwarts-100 font-medium focus:outline-none focus:ring-2 focus:ring-tiffany-600"
                />
              </div>

              <div>
                <label className="block text-hogwarts-900 dark:text-hogwarts-200 mb-1 font-bold">Catatan Pribadi</label>
                <input
                  type="text"
                  value={editingDay.notes}
                  onChange={(e) => setEditingDay({ ...editingDay, notes: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-xl border-2 border-hogwarts-300 dark:border-[#382f25] bg-white dark:bg-[#25201b] text-hogwarts-950 dark:text-hogwarts-100 font-medium focus:outline-none focus:ring-2 focus:ring-tiffany-600"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t-2 border-hogwarts-200 dark:border-[#2e261f]">
              <button
                onClick={() => {
                  sounds.playClick();
                  if (window.confirm(`Yakin ingin menghapus Hari ke-${editingDay.dayNum}?`)) {
                    deleteIntensifDay(editingDay.dayNum);
                    setEditingDay(null);
                  }
                }}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-rose-700 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-950/40 rounded-xl transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Hapus Hari Ini
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditingDay(null)}
                  className="px-4 py-1.5 text-xs font-bold text-hogwarts-800 dark:text-hogwarts-300 hover:bg-hogwarts-100 dark:hover:bg-[#28211b] border border-hogwarts-300 dark:border-[#382f25] rounded-xl transition"
                >
                  Batal
                </button>
                <button
                  onClick={handleSaveDayEdit}
                  className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-tiffany-950 bg-tiffany-200 hover:bg-tiffany-300 border-2 border-tiffany-700 rounded-xl shadow-sm transition active:scale-95"
                >
                  <Save className="w-3.5 h-3.5" />
                  Simpan Hari
                </button>
              </div>
            </div>
          </div>
        )}
      </ModalPortal>
    </div>
  );
};
