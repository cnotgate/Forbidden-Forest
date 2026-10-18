import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { RoadmapWeek } from '../types';
import {
  CheckCircle2,
  Circle,
  Search,
  Edit3,
  X,
  Save,
  Compass,
  Sparkles,
  Calendar,
  Layers,
  Sword,
  Hourglass,
  Clock,
  BookOpen,
  Award,
  Plus,
  Trash2,
  RefreshCw
} from 'lucide-react';
import { formatDateIndo, isPhaseMatchingRotation } from '../utils/dateHelper';
import { sounds } from '../utils/soundHelper';
import confetti from 'canvas-confetti';
import { ModalPortal } from './ModalPortal';

export const RoadmapTab: React.FC = () => {
  const {
    state,
    toggleRoadmapWeek,
    updateRoadmapWeek,
    addRoadmapWeek,
    deleteRoadmapWeek,
    roadmapFilter,
    setRoadmapFilter,
    syncRoadmapWithPhases
  } = useApp();

  const [search, setSearch] = useState('');
  const [selectedRotation, setSelectedRotation] = useState<string>('ALL');
  const [filterDone, setFilterDone] = useState<'ALL' | 'DONE' | 'UNDONE'>('ALL');
  const [viewMode, setViewMode] = useState<'CARDS' | 'TIMELINE'>('CARDS');
  const [editingWeek, setEditingWeek] = useState<RoadmapWeek | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);

  // New chapter form state
  const [newStartDate, setNewStartDate] = useState('');
  const [newEndDate, setNewEndDate] = useState('');
  const [newRotation, setNewRotation] = useState('Penyakit Dalam');
  const [newMode, setNewMode] = useState('Lite');
  const [newHours, setNewHours] = useState(2);
  const [newQuestions, setNewQuestions] = useState(20);
  const [newFocusA, setNewFocusA] = useState('');
  const [newFocusB, setNewFocusB] = useState('');
  const [newMilestone, setNewMilestone] = useState('');

  const rotations = ['ALL', ...Array.from(new Set(state.roadmapWeeks.map(w => w.rotation).filter(Boolean)))];

  // Auto-sync rotation filter when navigated from Dashboard or phase card
  useEffect(() => {
    if (roadmapFilter && roadmapFilter !== 'ALL') {
      const match = rotations.find(r =>
        r.toLowerCase().trim() === roadmapFilter.toLowerCase().trim() ||
        roadmapFilter.toLowerCase().includes(r.toLowerCase()) ||
        r.toLowerCase().includes(roadmapFilter.toLowerCase())
      );
      if (match) {
        setSelectedRotation(match);
      }
    }
  }, [roadmapFilter]);

  const handleSyncRoadmap = () => {
    sounds.playClick();
    const res = syncRoadmapWithPhases();
    setSyncNotice(`Sinkronisasi berhasil! ${res.syncedWeeksCount} chapter diperbarui dengan jadwal stase Markas.`);
    confetti({
      particleCount: 45,
      spread: 60,
      origin: { y: 0.7 }
    });
    setTimeout(() => {
      setSyncNotice(null);
    }, 4000);
  };

  const filteredWeeks = state.roadmapWeeks.filter(w => {
    if (selectedRotation !== 'ALL' && w.rotation !== selectedRotation) return false;
    if (filterDone === 'DONE' && !w.isDone) return false;
    if (filterDone === 'UNDONE' && w.isDone) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const match =
        w.focusA.toLowerCase().includes(q) ||
        w.focusB.toLowerCase().includes(q) ||
        w.rotation.toLowerCase().includes(q) ||
        w.milestone.toLowerCase().includes(q) ||
        `minggu ${w.weekNum}`.includes(q);
      if (!match) return false;
    }
    return true;
  });

  const completedCount = state.roadmapWeeks.filter(w => w.isDone).length;
  const totalCount = state.roadmapWeeks.length;

  const handleToggleWeek = (weekNum: number, currentlyDone: boolean) => {
    toggleRoadmapWeek(weekNum);
    if (!currentlyDone) {
      sounds.playQuestComplete();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    } else {
      sounds.playClick();
    }
  };

  const handleSaveWeekEdit = () => {
    if (editingWeek) {
      updateRoadmapWeek(editingWeek.weekNum, editingWeek);
      sounds.playClick();
      setEditingWeek(null);
    }
  };

  const handleCreateWeek = () => {
    if (!newFocusA.trim()) {
      alert('Mohon isi fokus materi stase (Misi Utama)!');
      return;
    }

    addRoadmapWeek({
      startDate: newStartDate || new Date().toISOString().slice(0, 10),
      endDate: newEndDate || new Date().toISOString().slice(0, 10),
      rotation: newRotation,
      mode: newMode,
      hoursPerDay: newHours,
      questionsPerDay: newQuestions,
      focusA: newFocusA,
      focusB: newFocusB || 'Recall materi lampau',
      milestone: newMilestone,
      isDone: false
    });

    sounds.playLevelUp();
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 }
    });

    // Reset & close
    setNewFocusA('');
    setNewFocusB('');
    setNewMilestone('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-br from-[#f8f3ea] via-[#faf5ec] to-[#f0e7d5] dark:from-[#1c1713] dark:via-[#181410] dark:to-[#120f0d] border border-hogwarts-300/80 dark:border-[#382f25] rounded-3xl p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-xl font-bold text-hogwarts-950 dark:text-hogwarts-100 flex items-center gap-2">
              <Compass className="w-5 h-5 text-tiffany-700 dark:text-tiffany-400" />
              Papan Misi Ekspedisi {totalCount} Chapter (Pass 1 & 2)
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-tiffany-100 dark:bg-tiffany-950/80 text-tiffany-950 dark:text-tiffany-200 border border-tiffany-300 dark:border-tiffany-700">
              Quest Board 📜
            </span>
          </div>
          <p className="text-xs text-hogwarts-800 dark:text-hogwarts-300 mt-1 font-medium">
            Misi Utama: Stase aktif · Misi Sampingan: Spaced recall materi lampau. Selesaikan quest untuk meraup <span className="font-bold text-tiffany-900 dark:text-tiffany-300">+50 EXP ✨</span> tiap chapter!
          </p>
        </div>

        {/* Action button & Progress pill */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleSyncRoadmap}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-hogwarts-100 dark:bg-[#25201b] hover:bg-hogwarts-200 dark:hover:bg-[#2e2721] text-hogwarts-950 dark:text-hogwarts-100 border-2 border-hogwarts-300 dark:border-[#3d3328] shadow-xs transition active:scale-95"
          >
            <RefreshCw className="w-3.5 h-3.5 text-tiffany-700 dark:text-tiffany-400" />
            Sinkronkan Jadwal Stase
          </button>

          <button
            onClick={() => { sounds.playClick(); setIsAddModalOpen(true); }}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl bg-tiffany-200 dark:bg-tiffany-900/60 hover:bg-tiffany-300 dark:hover:bg-tiffany-800 text-tiffany-950 dark:text-tiffany-100 border-2 border-tiffany-700 dark:border-tiffany-600 shadow-xs transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Tambah Chapter
          </button>

          <div className="text-right">
            <div className="font-serif text-sm font-bold text-hogwarts-950 dark:text-hogwarts-100">
              {completedCount} dari {totalCount} Chapter
            </div>
            <div className="text-xs text-tiffany-800 dark:text-tiffany-300 font-bold">
              {Math.round((completedCount / (totalCount || 1)) * 100)}% Terjelajahi 🗺️
            </div>
          </div>
          <div className="w-14 h-14 relative flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-hogwarts-200 dark:text-[#2c241c]"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-tiffany-600 dark:text-tiffany-400"
                strokeDasharray={`${(completedCount / (totalCount || 1)) * 100}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-[11px] font-bold text-tiffany-800 dark:text-tiffany-300 font-serif">
              {Math.round((completedCount / (totalCount || 1)) * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* Sync notification message banner */}
      {syncNotice && (
        <div className="p-3.5 bg-tiffany-100/95 dark:bg-tiffany-950/80 border-2 border-tiffany-400 dark:border-tiffany-700 rounded-2xl flex items-center gap-2.5 text-xs font-bold text-tiffany-950 dark:text-tiffany-200 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-tiffany-700 dark:text-tiffany-400 shrink-0" />
          <span>{syncNotice}</span>
        </div>
      )}

      {/* Active rotation filter indicator banner */}
      {selectedRotation !== 'ALL' && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3.5 bg-gradient-to-r from-tiffany-100 to-[#eaf7f4] dark:from-tiffany-950/80 dark:to-[#0f2e29] border-2 border-tiffany-400 dark:border-tiffany-700 rounded-2xl text-xs font-bold text-tiffany-950 dark:text-tiffany-200 shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-tiffany-700 dark:text-tiffany-400 shrink-0" />
            <span>Memfilter Quest Stase: <span className="font-serif font-extrabold text-sm text-tiffany-900 dark:text-tiffany-300">{selectedRotation}</span> (Terhubung dengan Peta Markas)</span>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              setSelectedRotation('ALL');
              setRoadmapFilter('ALL');
            }}
            className="px-3 py-1 rounded-xl bg-white dark:bg-[#1a1612] hover:bg-tiffany-50 dark:hover:bg-[#25201b] border border-tiffany-400 dark:border-tiffany-700 text-tiffany-950 dark:text-tiffany-200 text-xs font-bold transition shadow-xs active:scale-95 flex items-center gap-1"
          >
            <span>Tampilkan Semua Chapter</span>
            <X className="w-3.5 h-3.5 text-tiffany-700 dark:text-tiffany-400" />
          </button>
        </div>
      )}

      {/* Filter and View Mode Switcher */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-[#fdfcf9] dark:bg-[#1a1612] border-2 border-hogwarts-300 dark:border-[#383028] rounded-2xl p-4 shadow-sm">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-hogwarts-500 dark:text-hogwarts-400" />
          <input
            type="text"
            placeholder="Cari topik stase, materi recall, atau nomor chapter..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-hogwarts-300 dark:border-[#383028] bg-hogwarts-50 dark:bg-[#201a15] text-hogwarts-950 dark:text-hogwarts-100 placeholder-hogwarts-400 dark:placeholder-hogwarts-600 focus:outline-none focus:ring-2 focus:ring-tiffany-600 font-medium"
          />
        </div>

        {/* Filters and View buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedRotation}
            onChange={(e) => {
              setSelectedRotation(e.target.value);
              setRoadmapFilter(e.target.value);
            }}
            className="px-3 py-2 text-xs rounded-xl border border-hogwarts-300 dark:border-[#383028] bg-hogwarts-50 dark:bg-[#201a15] text-hogwarts-950 dark:text-hogwarts-100 focus:outline-none font-bold"
          >
            {rotations.map(r => (
              <option key={r} value={r}>
                {r === 'ALL' ? 'Semua Stase' : r}
              </option>
            ))}
          </select>

          <select
            value={filterDone}
            onChange={(e) => setFilterDone(e.target.value as any)}
            className="px-3 py-2 text-xs rounded-xl border border-hogwarts-300 dark:border-[#383028] bg-hogwarts-50 dark:bg-[#201a15] text-hogwarts-950 dark:text-hogwarts-100 focus:outline-none font-bold"
          >
            <option value="ALL">Semua Quest</option>
            <option value="DONE">✓ Quest Tuntas</option>
            <option value="UNDONE">Belum Tuntas</option>
          </select>

          {/* View toggle */}
          <div className="flex items-center rounded-xl bg-hogwarts-200 dark:bg-[#25201b] p-0.5 border border-hogwarts-300 dark:border-[#383028]">
            <button
              onClick={() => { sounds.playClick(); setViewMode('CARDS'); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                viewMode === 'CARDS'
                  ? 'bg-white dark:bg-[#15120f] text-hogwarts-950 dark:text-hogwarts-100 shadow-sm'
                  : 'text-hogwarts-700 dark:text-hogwarts-400 hover:text-hogwarts-950 dark:hover:text-hogwarts-100'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Kartu Quest 📜</span>
            </button>
            <button
              onClick={() => { sounds.playClick(); setViewMode('TIMELINE'); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                viewMode === 'TIMELINE'
                  ? 'bg-white dark:bg-[#15120f] text-hogwarts-950 dark:text-hogwarts-100 shadow-sm'
                  : 'text-hogwarts-700 dark:text-hogwarts-400 hover:text-hogwarts-950 dark:hover:text-hogwarts-100'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Peta Garis Waktu 🗺️</span>
            </button>
          </div>
        </div>
      </div>

      {/* Empty State when no quests match filter */}
      {filteredWeeks.length === 0 ? (
        <div className="p-12 text-center bg-[#fdfcf9] dark:bg-[#1a1612] rounded-3xl border-2 border-hogwarts-300 dark:border-[#383028] text-hogwarts-600 dark:text-hogwarts-400 space-y-3 animate-in fade-in duration-200">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-hogwarts-100 dark:bg-[#25201b] border border-hogwarts-300 dark:border-[#3d3328] flex items-center justify-center text-3xl">
            🧭
          </div>
          <div>
            <h3 className="font-serif text-base font-bold text-hogwarts-950 dark:text-hogwarts-100">
              Tidak Ada Chapter atau Quest yang Cocok
            </h3>
            <p className="text-xs text-hogwarts-700 dark:text-hogwarts-400 mt-1 max-w-md mx-auto">
              Tidak ditemukan quest chapter dengan filter stase "{selectedRotation}" atau kata kunci pencarian "{search}".
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={() => {
                sounds.playClick();
                setSearch('');
                setSelectedRotation('ALL');
                setRoadmapFilter('ALL');
                setFilterDone('ALL');
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-tiffany-200 dark:bg-tiffany-900/60 hover:bg-tiffany-300 dark:hover:bg-tiffany-800 text-tiffany-950 dark:text-tiffany-100 border border-tiffany-400 dark:border-tiffany-700 shadow-xs transition active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Semua Filter & Pencarian</span>
            </button>
          </div>
        </div>
      ) : viewMode === 'CARDS' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredWeeks.map((week) => {
            const matchingPhase = state.dashboard.phases.find(p => isPhaseMatchingRotation(p.name, week.rotation));
            const isPhaseActive = matchingPhase?.status === 'Sedang berjalan';

            return (
              <div
                key={week.weekNum}
                className={`relative rounded-3xl p-5 border-2 transition-all flex flex-col justify-between shadow-sm hover:shadow-md ${
                  week.isDone
                    ? 'bg-gradient-to-br from-[#f0fbf9] to-[#e4f6f3] dark:from-[#082824] dark:to-[#0e3833] border-tiffany-400 dark:border-tiffany-600/70'
                    : 'bg-[#fdfcf9] dark:bg-[#211c17] border-hogwarts-300 dark:border-[#383028] hover:border-tiffany-500'
                }`}
              >
                {/* Top Card Bar */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center flex-wrap gap-2">
                      <span className="font-serif font-extrabold text-xs px-2.5 py-1 rounded-xl bg-hogwarts-100 text-hogwarts-950 border border-hogwarts-300">
                        M-{week.weekNum}
                      </span>
                      <span className="font-serif font-bold text-sm text-hogwarts-950">
                        {week.rotation}
                      </span>
                      {isPhaseActive && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-950 border border-amber-400 animate-pulse">
                          ⚡ Stase Aktif
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-tiffany-100 text-tiffany-950 border border-tiffany-300">
                        {week.mode}
                      </span>
                      <button
                        onClick={() => setEditingWeek({ ...week })}
                        className="p-1 text-hogwarts-600 hover:text-tiffany-700 rounded-lg hover:bg-hogwarts-100 transition"
                        title="Edit Quest"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    <button
                      onClick={() => {
                        sounds.playClick();
                        if (window.confirm(`Hapus Chapter M-${week.weekNum} (${week.rotation})?`)) {
                          deleteRoadmapWeek(week.weekNum);
                        }
                      }}
                      className="p-1 text-hogwarts-600 hover:text-rose-700 rounded-lg hover:bg-rose-50 transition"
                      title="Hapus Chapter"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Date and Target Pill */}
                <div className="flex items-center justify-between text-[11px] text-hogwarts-700 dark:text-hogwarts-300 bg-white/80 dark:bg-[#15120f] rounded-xl p-2.5 border border-hogwarts-200 dark:border-[#383028] mb-3.5">
                  <div className="flex items-center gap-1.5 font-medium text-hogwarts-800 dark:text-hogwarts-200">
                    <Calendar className="w-3.5 h-3.5 text-tiffany-700 dark:text-tiffany-400 shrink-0" />
                    <span>{formatDateIndo(week.startDate)} – {formatDateIndo(week.endDate)}</span>
                  </div>
                  <div className="flex items-center gap-1 font-bold text-hogwarts-900 dark:text-hogwarts-100 shrink-0">
                    <Clock className="w-3 h-3 text-amber-700 dark:text-amber-400" />
                    <span>{week.hoursPerDay}j · {week.questionsPerDay}s</span>
                  </div>
                </div>

                {/* Main Quest: Focus A */}
                <div className="p-3 rounded-2xl bg-white dark:bg-[#181410] border border-hogwarts-200/90 dark:border-[#383028] space-y-1.5 mb-2.5 shadow-xs">
                  <div className="text-[10px] font-extrabold text-tiffany-950 uppercase font-serif flex items-center gap-1.5">
                    <Sword className="w-3.5 h-3.5 text-tiffany-700 dark:text-tiffany-400" />
                    <span>Misi Utama (Stase Aktif)</span>
                  </div>
                  <p className="text-xs font-serif font-bold text-hogwarts-950 leading-snug">
                    {week.focusA}
                  </p>
                </div>

                {/* Secondary Quest: Focus B */}
                <div className="p-3 rounded-2xl bg-[#faf6ee] dark:bg-[#15120f] border border-hogwarts-200/80 dark:border-[#383028] space-y-1.5 mb-3">
                  <div className="text-[10px] font-bold text-hogwarts-700 uppercase font-serif flex items-center gap-1.5">
                    <Hourglass className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                    <span>Misi Recall Lampau</span>
                  </div>
                  <p className="text-[11px] text-hogwarts-800 dark:text-hogwarts-300 leading-relaxed font-medium">
                    {week.focusB}
                  </p>
                </div>

                {/* Milestone Badge if any */}
                {week.milestone && (
                  <div className="mb-3 px-3 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-700/60 flex items-center gap-1.5 text-amber-950 dark:text-amber-200 text-xs font-bold">
                    <Award className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400 shrink-0" />
                    <span className="truncate">{week.milestone}</span>
                  </div>
                )}
              </div>

              {/* Complete Quest Button */}
              <div className="pt-2 border-t border-hogwarts-200 dark:border-[#383028]">
                <button
                  onClick={() => handleToggleWeek(week.weekNum, week.isDone)}
                  className={`w-full py-2.5 px-4 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2 active:scale-95 shadow-xs ${
                    week.isDone
                      ? 'bg-tiffany-200 hover:bg-tiffany-300 text-tiffany-950 border-2 border-tiffany-500'
                      : 'bg-hogwarts-100 hover:bg-tiffany-100 text-hogwarts-900 border-2 border-hogwarts-300 hover:border-tiffany-400'
                  }`}
                >
                  {week.isDone ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-tiffany-700 fill-tiffany-100" />
                      <span>Quest Tuntas ✨ (+50 EXP Terklaim)</span>
                    </>
                  ) : (
                    <>
                      <Circle className="w-4 h-4 text-hogwarts-400" />
                      <span>Selesaikan Quest (+50 EXP ✨)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
            );
          })}
        </div>
      ) : (
        /* Timeline Path View */
        <div className="bg-[#fdfcf9] dark:bg-[#1a1612] border-2 border-hogwarts-300 dark:border-[#383028] rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b-2 border-hogwarts-200 dark:border-[#383028] pb-3">
            <div>
              <h2 className="font-serif text-base font-bold text-hogwarts-950 dark:text-hogwarts-100 flex items-center gap-2">
                <Compass className="w-5 h-5 text-tiffany-700 dark:text-tiffany-400" />
                Peta Garis Waktu Ekspedisi
              </h2>
              <p className="text-xs text-hogwarts-700 dark:text-hogwarts-400">
                Rangkaian kronologis {filteredWeeks.length} titik penjelajahan klinis menuju UKMPPD.
              </p>
            </div>
            <button
              onClick={() => { sounds.playClick(); setIsAddModalOpen(true); }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-tiffany-200 dark:bg-tiffany-900/60 hover:bg-tiffany-300 dark:hover:bg-tiffany-800 text-tiffany-950 dark:text-tiffany-100 border border-tiffany-400 dark:border-tiffany-700 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              Tambah Titik
            </button>
          </div>

          <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-1 before:bg-hogwarts-200 dark:before:bg-[#383028]">
            {filteredWeeks.map((week) => {
              const matchingPhase = state.dashboard.phases.find(p => isPhaseMatchingRotation(p.name, week.rotation));
              const isPhaseActive = matchingPhase?.status === 'Sedang berjalan';

              return (
              <div key={week.weekNum} className="relative group">
                {/* Node icon on line */}
                <button
                  onClick={() => handleToggleWeek(week.weekNum, week.isDone)}
                  className={`absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition transform active:scale-90 ${
                    week.isDone
                      ? 'bg-tiffany-200 dark:bg-tiffany-900 border-tiffany-700 dark:border-tiffany-400 text-tiffany-950 dark:text-tiffany-100 shadow-sm'
                      : 'bg-white dark:bg-[#201a15] border-hogwarts-400 dark:border-[#4a3e32] text-transparent hover:border-tiffany-600'
                  }`}
                  title={week.isDone ? 'Quest Tuntas' : 'Klik untuk Selesaikan (+50 EXP)'}
                >
                  {week.isDone ? <CheckCircle2 className="w-4 h-4 text-tiffany-800 dark:text-tiffany-300" /> : <Circle className="w-3.5 h-3.5 text-hogwarts-400 dark:text-hogwarts-500" />}
                </button>

                {/* Card body */}
                <div className={`p-4 rounded-2xl border-2 transition ${
                  week.isDone
                    ? 'bg-tiffany-50/70 dark:bg-[#0c2e28] border-tiffany-300 dark:border-tiffany-700/60'
                    : 'bg-[#faf6ee] dark:bg-[#201a15] border-hogwarts-300 dark:border-[#383028] group-hover:border-tiffany-400'
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center flex-wrap gap-2">
                      <span className="font-serif font-bold text-xs px-2.5 py-0.5 rounded-lg bg-hogwarts-200 dark:bg-[#2c241c] text-hogwarts-950 dark:text-hogwarts-100">
                        Chapter {week.weekNum}
                      </span>
                      <span className="font-serif font-bold text-sm text-hogwarts-950 dark:text-hogwarts-100">
                        {week.rotation}
                      </span>
                      {isPhaseActive && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-950 dark:text-amber-200 border border-amber-400 dark:border-amber-700 animate-pulse">
                          ⚡ Stase Aktif
                        </span>
                      )}
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-tiffany-100 dark:bg-tiffany-950/80 text-tiffany-950 dark:text-tiffany-200 border border-tiffany-300 dark:border-tiffany-700">
                        {week.mode} ({week.hoursPerDay}j · {week.questionsPerDay}s)
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-hogwarts-700 dark:text-hogwarts-400 font-medium">
                      <span>{formatDateIndo(week.startDate)} – {formatDateIndo(week.endDate)}</span>
                      <button
                        onClick={() => setEditingWeek({ ...week })}
                        className="p-1 text-hogwarts-600 dark:text-hogwarts-400 hover:text-tiffany-700 dark:hover:text-tiffany-300"
                        title="Edit Quest"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          sounds.playClick();
                          if (window.confirm(`Hapus Chapter M-${week.weekNum}?`)) {
                            deleteRoadmapWeek(week.weekNum);
                          }
                        }}
                        className="p-1 text-hogwarts-600 dark:text-hogwarts-400 hover:text-rose-700 dark:hover:text-rose-400"
                        title="Hapus Quest"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                    <div className="p-2.5 rounded-xl bg-white dark:bg-[#16120e] border border-hogwarts-200 dark:border-[#383028] space-y-1">
                      <span className="text-[10px] font-bold text-tiffany-900 dark:text-tiffany-400 uppercase font-serif flex items-center gap-1">
                        <Sword className="w-3 h-3 text-tiffany-700 dark:text-tiffany-400" /> Misi Utama
                      </span>
                      <p className="font-serif font-semibold text-hogwarts-950 dark:text-hogwarts-100">{week.focusA}</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white dark:bg-[#16120e] border border-hogwarts-200 dark:border-[#383028] space-y-1">
                      <span className="text-[10px] font-bold text-amber-900 dark:text-amber-400 uppercase font-serif flex items-center gap-1">
                        <Hourglass className="w-3 h-3 text-amber-700 dark:text-amber-400" /> Misi Recall
                      </span>
                      <p className="text-hogwarts-800 dark:text-hogwarts-300 font-medium">{week.focusB}</p>
                    </div>
                  </div>

                  {week.milestone && (
                    <div className="mt-2.5 px-3 py-1 rounded-xl bg-amber-100 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-700 text-amber-950 dark:text-amber-200 text-xs font-bold inline-flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                      <span>{week.milestone}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          </div>
        </div>
      )}

      {/* Add New Week Modal */}
      <ModalPortal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <div className="bg-[#fdfcf9] dark:bg-[#1c1814] border-2 border-hogwarts-300 dark:border-[#383028] rounded-3xl w-full max-w-xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b-2 border-hogwarts-200 dark:border-[#383028] pb-3">
              <h3 className="font-serif text-base font-bold text-hogwarts-950 dark:text-hogwarts-100 flex items-center gap-2">
                <Plus className="w-5 h-5 text-tiffany-700 dark:text-tiffany-400" />
                Tambah Chapter Quest Baru (Chapter #{state.roadmapWeeks.length + 1})
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-hogwarts-600 dark:text-hogwarts-400 hover:text-hogwarts-900 dark:hover:text-hogwarts-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-hogwarts-900 dark:text-hogwarts-200 mb-1 font-bold">Tanggal Mulai</label>
                  <input
                    type="date"
                    value={newStartDate}
                    onChange={(e) => setNewStartDate(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border-2 border-hogwarts-300 dark:border-[#42372d] bg-white dark:bg-[#25201b] text-hogwarts-950 dark:text-hogwarts-100 font-medium focus:outline-none focus:ring-2 focus:ring-tiffany-600"
                  />
                </div>
                <div>
                  <label className="block text-hogwarts-900 dark:text-hogwarts-200 mb-1 font-bold">Tanggal Selesai</label>
                  <input
                    type="date"
                    value={newEndDate}
                    onChange={(e) => setNewEndDate(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border-2 border-hogwarts-300 dark:border-[#42372d] bg-white dark:bg-[#25201b] text-hogwarts-950 dark:text-hogwarts-100 font-medium focus:outline-none focus:ring-2 focus:ring-tiffany-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-hogwarts-900 dark:text-hogwarts-200 mb-1 font-bold">Stase</label>
                  <input
                    type="text"
                    value={newRotation}
                    onChange={(e) => setNewRotation(e.target.value)}
                    placeholder="Contoh: Bedah"
                    className="w-full px-3 py-1.5 rounded-xl border-2 border-hogwarts-300 dark:border-[#42372d] bg-white dark:bg-[#25201b] text-hogwarts-950 dark:text-hogwarts-100 placeholder-hogwarts-400 dark:placeholder-hogwarts-600 font-medium focus:outline-none focus:ring-2 focus:ring-tiffany-600"
                  />
                </div>
                <div>
                  <label className="block text-hogwarts-900 dark:text-hogwarts-200 mb-1 font-bold">Mode Belajar</label>
                  <input
                    type="text"
                    value={newMode}
                    onChange={(e) => setNewMode(e.target.value)}
                    placeholder="Lite / Steady / Boost"
                    className="w-full px-3 py-1.5 rounded-xl border-2 border-hogwarts-300 dark:border-[#42372d] bg-white dark:bg-[#25201b] text-hogwarts-950 dark:text-hogwarts-100 placeholder-hogwarts-400 dark:placeholder-hogwarts-600 font-medium focus:outline-none focus:ring-2 focus:ring-tiffany-600"
                  />
                </div>
                <div>
                  <label className="block text-hogwarts-900 dark:text-hogwarts-200 mb-1 font-bold">Target Jam / Hari</label>
                  <input
                    type="number"
                    step="0.5"
                    value={newHours}
                    onChange={(e) => setNewHours(parseFloat(e.target.value) || 1)}
                    className="w-full px-3 py-1.5 rounded-xl border-2 border-hogwarts-300 dark:border-[#42372d] bg-white dark:bg-[#25201b] text-hogwarts-950 dark:text-hogwarts-100 font-medium focus:outline-none focus:ring-2 focus:ring-tiffany-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-hogwarts-900 dark:text-hogwarts-200 mb-1 font-bold">Target Soal / Hari</label>
                <input
                  type="number"
                  value={newQuestions}
                  onChange={(e) => setNewQuestions(parseInt(e.target.value) || 10)}
                  className="w-full px-3 py-1.5 rounded-xl border-2 border-hogwarts-300 dark:border-[#42372d] bg-white dark:bg-[#25201b] text-hogwarts-950 dark:text-hogwarts-100 font-medium focus:outline-none focus:ring-2 focus:ring-tiffany-600"
                />
              </div>

              <div>
                <label className="block text-hogwarts-900 dark:text-hogwarts-200 mb-1 font-bold">Fokus A (Misi Utama Stase)</label>
                <textarea
                  rows={2}
                  value={newFocusA}
                  onChange={(e) => setNewFocusA(e.target.value)}
                  placeholder="Contoh: Penguasaan Appendisitis, Hernia, Trauma Abdomen (SKDI 4A)"
                  className="w-full px-3 py-1.5 rounded-xl border-2 border-hogwarts-300 dark:border-[#42372d] bg-white dark:bg-[#25201b] text-hogwarts-950 dark:text-hogwarts-100 placeholder-hogwarts-400 dark:placeholder-hogwarts-600 font-medium focus:outline-none focus:ring-2 focus:ring-tiffany-600"
                />
              </div>

              <div>
                <label className="block text-hogwarts-900 dark:text-hogwarts-200 mb-1 font-bold">Fokus B (Misi Recall Materi Lampau)</label>
                <textarea
                  rows={2}
                  value={newFocusB}
                  onChange={(e) => setNewFocusB(e.target.value)}
                  placeholder="Contoh: Recall EKG dan Hipertensi dari stase IPD"
                  className="w-full px-3 py-1.5 rounded-xl border-2 border-hogwarts-300 dark:border-[#42372d] bg-white dark:bg-[#25201b] text-hogwarts-950 dark:text-hogwarts-100 placeholder-hogwarts-400 dark:placeholder-hogwarts-600 font-medium focus:outline-none focus:ring-2 focus:ring-tiffany-600"
                />
              </div>

              <div>
                <label className="block text-hogwarts-900 dark:text-hogwarts-200 mb-1 font-bold">Milestone / Event (Opsional)</label>
                <input
                  type="text"
                  value={newMilestone}
                  onChange={(e) => setNewMilestone(e.target.value)}
                  placeholder="Contoh: Tryout Mid-Stase Bedah"
                  className="w-full px-3 py-1.5 rounded-xl border-2 border-hogwarts-300 dark:border-[#42372d] bg-white dark:bg-[#25201b] text-hogwarts-950 dark:text-hogwarts-100 placeholder-hogwarts-400 dark:placeholder-hogwarts-600 font-medium focus:outline-none focus:ring-2 focus:ring-tiffany-600"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t-2 border-hogwarts-200 dark:border-[#383028]">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-1.5 text-xs font-bold text-hogwarts-800 dark:text-hogwarts-200 hover:bg-hogwarts-100 dark:hover:bg-[#25201b] border border-hogwarts-300 dark:border-[#42372d] rounded-xl transition"
              >
                Batal
              </button>
              <button
                onClick={handleCreateWeek}
                className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-tiffany-950 dark:text-tiffany-100 bg-tiffany-200 dark:bg-tiffany-900/60 hover:bg-tiffany-300 dark:hover:bg-tiffany-800 border-2 border-tiffany-700 dark:border-tiffany-600 rounded-xl shadow-sm transition active:scale-95"
              >
                <Save className="w-3.5 h-3.5" />
                Simpan & Tambah Chapter ✨
              </button>
            </div>
          </div>
      </ModalPortal>

      {/* Edit Week Modal */}
      <ModalPortal isOpen={!!editingWeek} onClose={() => setEditingWeek(null)}>
        {editingWeek && (
          <div className="bg-[#fdfcf9] dark:bg-[#1c1814] border-2 border-hogwarts-300 dark:border-[#383028] rounded-3xl w-full max-w-xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b-2 border-hogwarts-200 dark:border-[#383028] pb-3">
              <h3 className="font-serif text-base font-bold text-hogwarts-950 dark:text-hogwarts-100">
                Edit Chapter M-{editingWeek.weekNum} ({editingWeek.rotation})
              </h3>
              <button
                onClick={() => setEditingWeek(null)}
                className="p-1 text-hogwarts-600 dark:text-hogwarts-400 hover:text-hogwarts-900 dark:hover:text-hogwarts-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-hogwarts-900 dark:text-hogwarts-200 mb-1 font-bold">Tanggal Mulai</label>
                  <input
                    type="date"
                    value={editingWeek.startDate}
                    onChange={(e) => setEditingWeek({ ...editingWeek, startDate: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl border-2 border-hogwarts-300 dark:border-[#42372d] bg-white dark:bg-[#25201b] text-hogwarts-950 dark:text-hogwarts-100 font-medium focus:outline-none focus:ring-2 focus:ring-tiffany-600"
                  />
                </div>
                <div>
                  <label className="block text-hogwarts-900 dark:text-hogwarts-200 mb-1 font-bold">Tanggal Selesai</label>
                  <input
                    type="date"
                    value={editingWeek.endDate}
                    onChange={(e) => setEditingWeek({ ...editingWeek, endDate: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl border-2 border-hogwarts-300 dark:border-[#42372d] bg-white dark:bg-[#25201b] text-hogwarts-950 dark:text-hogwarts-100 font-medium focus:outline-none focus:ring-2 focus:ring-tiffany-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-hogwarts-900 dark:text-hogwarts-200 mb-1 font-bold">Stase</label>
                  <input
                    type="text"
                    value={editingWeek.rotation}
                    onChange={(e) => setEditingWeek({ ...editingWeek, rotation: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl border-2 border-hogwarts-300 dark:border-[#42372d] bg-white dark:bg-[#25201b] text-hogwarts-950 dark:text-hogwarts-100 font-medium focus:outline-none focus:ring-2 focus:ring-tiffany-600"
                  />
                </div>
                <div>
                  <label className="block text-hogwarts-900 dark:text-hogwarts-200 mb-1 font-bold">Mode</label>
                  <input
                    type="text"
                    value={editingWeek.mode}
                    onChange={(e) => setEditingWeek({ ...editingWeek, mode: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl border-2 border-hogwarts-300 dark:border-[#42372d] bg-white dark:bg-[#25201b] text-hogwarts-950 dark:text-hogwarts-100 font-medium focus:outline-none focus:ring-2 focus:ring-tiffany-600"
                  />
                </div>
                <div>
                  <label className="block text-hogwarts-900 dark:text-hogwarts-200 mb-1 font-bold">Jam / Hari</label>
                  <input
                    type="number"
                    step="0.5"
                    value={editingWeek.hoursPerDay}
                    onChange={(e) => setEditingWeek({ ...editingWeek, hoursPerDay: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 rounded-xl border-2 border-hogwarts-300 dark:border-[#42372d] bg-white dark:bg-[#25201b] text-hogwarts-950 dark:text-hogwarts-100 font-medium focus:outline-none focus:ring-2 focus:ring-tiffany-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-hogwarts-900 dark:text-hogwarts-200 mb-1 font-bold">Fokus A (Materi Stase Aktif)</label>
                <textarea
                  rows={2}
                  value={editingWeek.focusA}
                  onChange={(e) => setEditingWeek({ ...editingWeek, focusA: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-xl border-2 border-hogwarts-300 dark:border-[#42372d] bg-white dark:bg-[#25201b] text-hogwarts-950 dark:text-hogwarts-100 font-medium focus:outline-none focus:ring-2 focus:ring-tiffany-600"
                />
              </div>

              <div>
                <label className="block text-hogwarts-900 dark:text-hogwarts-200 mb-1 font-bold">Fokus B (Recall Materi Lampau)</label>
                <textarea
                  rows={2}
                  value={editingWeek.focusB}
                  onChange={(e) => setEditingWeek({ ...editingWeek, focusB: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-xl border-2 border-hogwarts-300 dark:border-[#42372d] bg-white dark:bg-[#25201b] text-hogwarts-950 dark:text-hogwarts-100 font-medium focus:outline-none focus:ring-2 focus:ring-tiffany-600"
                />
              </div>

              <div>
                <label className="block text-hogwarts-900 dark:text-hogwarts-200 mb-1 font-bold">Milestone / Event</label>
                <input
                  type="text"
                  value={editingWeek.milestone}
                  onChange={(e) => setEditingWeek({ ...editingWeek, milestone: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-xl border-2 border-hogwarts-300 dark:border-[#42372d] bg-white dark:bg-[#25201b] text-hogwarts-950 dark:text-hogwarts-100 font-medium focus:outline-none focus:ring-2 focus:ring-tiffany-600"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t-2 border-hogwarts-200 dark:border-[#383028]">
              <button
                onClick={() => {
                  sounds.playClick();
                  if (window.confirm(`Yakin ingin menghapus Chapter M-${editingWeek.weekNum}?`)) {
                    deleteRoadmapWeek(editingWeek.weekNum);
                    setEditingWeek(null);
                  }
                }}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-rose-700 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-950/50 rounded-xl transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Hapus Chapter Ini
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditingWeek(null)}
                  className="px-4 py-1.5 text-xs font-bold text-hogwarts-800 dark:text-hogwarts-200 hover:bg-hogwarts-100 dark:hover:bg-[#25201b] border border-hogwarts-300 dark:border-[#42372d] rounded-xl transition"
                >
                  Batal
                </button>
                <button
                  onClick={handleSaveWeekEdit}
                  className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-tiffany-950 dark:text-tiffany-100 bg-tiffany-200 dark:bg-tiffany-900/60 hover:bg-tiffany-300 dark:hover:bg-tiffany-800 border-2 border-tiffany-700 dark:border-tiffany-600 rounded-xl shadow-sm transition active:scale-95"
                >
                  <Save className="w-3.5 h-3.5" />
                  Simpan Quest
                </button>
              </div>
            </div>
          </div>
        )}
      </ModalPortal>
    </div>
  );
};
