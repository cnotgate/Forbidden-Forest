import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { OSCESkill } from '../types';
import {
  ClipboardList,
  CheckCircle2,
  Circle,
  Search,
  Plus,
  Edit3,
  X,
  Save,
  Trash2,
  Star,
  Sparkles,
  Scroll,
  MapPin,
  Trophy,
  Check,
  RefreshCw
} from 'lucide-react';
import { sounds } from '../utils/soundHelper';
import confetti from 'canvas-confetti';
import { ModalPortal } from './ModalPortal';

export const OSCETab: React.FC = () => {
  const { state, toggleOSCETask, updateOSCESkill, addOSCESkill, deleteOSCESkill } = useApp();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<OSCESkill | null>(null);

  const [newCategory, setNewCategory] = useState('Anamnesis & komunikasi');
  const [newSkillName, setNewSkillName] = useState('');
  const [newLocation, setNewLocation] = useState('Semua');

  const categories = ['ALL', ...Array.from(new Set(state.osceSkills.map(s => s.category).filter(Boolean)))];

  const filteredSkills = state.osceSkills.filter(s => {
    if (selectedCategory !== 'ALL' && s.category !== selectedCategory) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const match =
        s.skillName.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.practiceLocation.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const readyCount = state.osceSkills.filter(s => s.dinilaiDone).length;
  const totalSkills = state.osceSkills.length || 35;

  const handleToggleTask = (no: number, task: 'pahami' | 'solo' | 'partner' | 'dinilai', currentlyDone: boolean) => {
    toggleOSCETask(no, task);
    if (!currentlyDone) {
      if (task === 'dinilai') {
        sounds.playLevelUp();
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.7 }
        });
      } else {
        sounds.playQuestComplete();
      }
    } else {
      sounds.playClick();
    }
  };

  const handleCreate = () => {
    if (!newSkillName.trim()) {
      alert('Mohon masukkan nama skill / stasiun!');
      return;
    }

    addOSCESkill({
      category: newCategory,
      skillName: newSkillName,
      practiceLocation: newLocation,
      pahamiDone: false,
      soloDone: false,
      partnerDone: false,
      dinilaiDone: false,
      notes: ''
    });

    sounds.playClick();
    setNewSkillName('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-br from-[#f8f3ea] via-[#faf5ec] to-[#f0e7d5] dark:from-[#1c1713] dark:via-[#181410] dark:to-[#120f0d] border border-hogwarts-300/80 dark:border-[#382f25] rounded-3xl p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-xl font-bold text-hogwarts-950 dark:text-hogwarts-100 flex items-center gap-2">
              <Scroll className="w-5 h-5 text-hogwarts-700 dark:text-hogwarts-400" />
              Pohon Keterampilan Klinis OSCE (35 Stasiun)
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-hogwarts-100 dark:bg-[#25201b] text-hogwarts-950 dark:text-hogwarts-200 border border-hogwarts-300 dark:border-[#382f25]">
              Skill Lab Arena 🩺
            </span>
          </div>
          <p className="text-xs text-hogwarts-800 dark:text-hogwarts-300 mt-1 font-medium">
            Kuasai 4 tahap kemahiran klinis: <span className="font-bold text-teal-800 dark:text-teal-400">⭐ ① Pahami</span> → <span className="font-bold text-sky-800 dark:text-sky-400">⭐⭐ ② Solo</span> → <span className="font-bold text-amber-800 dark:text-amber-400">⭐⭐⭐ ③ Partner</span> → <span className="font-bold text-emerald-800 dark:text-emerald-400">👑 ④ Dinilai Master</span>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => { sounds.playClick(); setIsAddModalOpen(true); }}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl bg-[#fbf7ef] dark:bg-[#221c17] hover:bg-[#f2e9dc] dark:hover:bg-[#2c241c] text-hogwarts-800 dark:text-hogwarts-100 border border-hogwarts-300/80 dark:border-[#382f25] shadow-xs transition active:scale-95"
          >
            <Plus className="w-4 h-4 text-hogwarts-700 dark:text-hogwarts-400" />
            Tambah Stasiun
          </button>

          <div className="p-3 rounded-2xl bg-[#fbf7ef] dark:bg-[#1c1814] border border-hogwarts-300/80 dark:border-[#382f25] text-center min-w-[120px] shadow-xs">
            <div className="text-[10px] text-hogwarts-800 dark:text-hogwarts-400 font-bold uppercase font-serif">Master 4-Star</div>
            <div className="font-serif text-sm font-bold text-emerald-900 dark:text-emerald-400">
              {readyCount} / {totalSkills} Skill
            </div>
          </div>
        </div>
      </div>

      {/* 4-Stage Legend Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-3xl bg-hogwarts-100/70 border-2 border-hogwarts-300 text-xs shadow-sm">
        <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-teal-50/80 border-2 border-teal-300 shadow-xs">
          <div className="w-8 h-8 rounded-xl bg-teal-100 border border-teal-400 flex items-center justify-center text-teal-700 font-bold text-base shrink-0">⭐</div>
          <div>
            <div className="font-serif font-bold text-teal-950 flex items-center gap-1.5">
              ① Pahami
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-teal-200/90 text-teal-950 border border-teal-400 font-sans font-bold">Teal</span>
            </div>
            <div className="text-[10px] text-teal-800 font-medium">Hafal checklist rubrik</div>
          </div>
        </div>
        <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-sky-50/80 border-2 border-sky-300 shadow-xs">
          <div className="w-8 h-8 rounded-xl bg-sky-100 border border-sky-400 flex items-center justify-center text-sky-700 font-bold text-xs shrink-0 tracking-tighter">⭐⭐</div>
          <div>
            <div className="font-serif font-bold text-sky-950 flex items-center gap-1.5">
              ② Solo Drill
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-sky-200/90 text-sky-950 border border-sky-400 font-sans font-bold">Sky</span>
            </div>
            <div className="text-[10px] text-sky-800 font-medium">Latihan mandiri / cermin</div>
          </div>
        </div>
        <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-amber-50/80 border-2 border-amber-300 shadow-xs">
          <div className="w-8 h-8 rounded-xl bg-amber-100 border border-amber-400 flex items-center justify-center text-amber-700 font-bold text-xs shrink-0 tracking-tighter">⭐⭐⭐</div>
          <div>
            <div className="font-serif font-bold text-amber-950 flex items-center gap-1.5">
              ③ Partner
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-200/90 text-amber-950 border border-amber-400 font-sans font-bold">Amber</span>
            </div>
            <div className="text-[10px] text-amber-800 font-medium">Simulasi dengan rekan</div>
          </div>
        </div>
        <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-emerald-50/80 border-2 border-emerald-300 shadow-xs">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 border border-emerald-400 flex items-center justify-center text-base shrink-0">👑</div>
          <div>
            <div className="font-serif font-bold text-emerald-950 flex items-center gap-1.5">
              ④ Dinilai Master
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-200/90 text-emerald-950 border border-emerald-400 font-sans font-bold">Emerald</span>
            </div>
            <div className="text-[10px] text-emerald-800 font-medium">Evaluasi konsulen/peer</div>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-[#fdfcf9] dark:bg-[#1a1612] border-2 border-hogwarts-300 dark:border-[#383028] rounded-2xl p-4 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-hogwarts-500 dark:text-hogwarts-400" />
          <input
            type="text"
            placeholder="Cari stasiun anamnesis, skill fisik, atau stase..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-hogwarts-300 dark:border-[#383028] bg-hogwarts-50 dark:bg-[#201a15] text-hogwarts-950 dark:text-hogwarts-100 placeholder-hogwarts-400 dark:placeholder-hogwarts-600 focus:outline-none focus:ring-2 focus:ring-tiffany-600 font-medium"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 text-xs rounded-xl border border-hogwarts-300 dark:border-[#383028] bg-hogwarts-50 dark:bg-[#201a15] text-hogwarts-950 dark:text-hogwarts-100 focus:outline-none font-bold w-full sm:w-auto"
        >
          {categories.map(c => (
            <option key={c} value={c}>
              {c === 'ALL' ? 'Semua Kategori' : c}
            </option>
          ))}
        </select>
      </div>

      {/* OSCE Skill Cards Grid or Empty State */}
      {filteredSkills.length === 0 ? (
        <div className="p-12 text-center bg-[#fdfcf9] dark:bg-[#1a1612] rounded-3xl border-2 border-hogwarts-300 dark:border-[#383028] text-hogwarts-600 dark:text-hogwarts-400 space-y-3 animate-in fade-in duration-200">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-hogwarts-100 dark:bg-[#25201b] border border-hogwarts-300 dark:border-[#3d3328] flex items-center justify-center text-3xl">
            🩺
          </div>
          <div>
            <h3 className="font-serif text-base font-bold text-hogwarts-950 dark:text-hogwarts-100">
              Tidak Ada Stasiun OSCE yang Cocok
            </h3>
            <p className="text-xs text-hogwarts-700 dark:text-hogwarts-400 mt-1 max-w-md mx-auto">
              Tidak ditemukan keterampilan klinis dengan kategori "{selectedCategory}" atau kata kunci "{search}".
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={() => {
                sounds.playClick();
                setSearch('');
                setSelectedCategory('ALL');
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-tiffany-200 dark:bg-tiffany-900/60 hover:bg-tiffany-300 dark:hover:bg-tiffany-800 text-tiffany-950 dark:text-tiffany-100 border border-tiffany-400 dark:border-tiffany-700 shadow-xs transition active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Semua Filter & Pencarian</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSkills.map((s) => {
          const stageCount = (s.pahamiDone ? 1 : 0) + (s.soloDone ? 1 : 0) + (s.partnerDone ? 1 : 0) + (s.dinilaiDone ? 1 : 0);
          const isMastered = s.dinilaiDone;

          return (
            <div
              key={s.no}
              className={`rounded-3xl p-5 border-2 transition-all flex flex-col justify-between shadow-xs hover:shadow-md ${
                isMastered
                  ? 'bg-gradient-to-br from-[#f2fcf6] to-[#e4f8ed] dark:from-[#09261a] dark:to-[#0e3827] border-emerald-400 dark:border-emerald-600/70'
                  : stageCount > 0
                  ? 'bg-gradient-to-br from-[#fdfcf9] to-[#f4faf9] dark:from-[#092b26] dark:to-[#0f3d36] border-tiffany-400 dark:border-tiffany-600/70'
                  : 'bg-[#fdfcf9] dark:bg-[#211c17] border-hogwarts-300 dark:border-[#383028] hover:border-tiffany-500'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-serif font-extrabold text-[10px] px-2 py-0.5 rounded-lg bg-hogwarts-100 text-hogwarts-950 border border-hogwarts-300">
                      #{s.no}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-tiffany-100 text-tiffany-950 border border-tiffany-300">
                      {s.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => { sounds.playClick(); setEditingSkill({ ...s }); }}
                      className="p-1 text-hogwarts-600 hover:text-tiffany-700 rounded-lg hover:bg-white transition"
                      title="Edit skill"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        sounds.playClick();
                        if (window.confirm(`Hapus skill "${s.skillName}"?`)) {
                          deleteOSCESkill(s.no);
                        }
                      }}
                      className="p-1 text-hogwarts-600 hover:text-rose-700 rounded-lg hover:bg-white transition"
                      title="Hapus skill"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Skill Name */}
                <h3 className="font-serif font-bold text-sm text-hogwarts-950 leading-snug mb-2">
                  {s.skillName}
                </h3>

                {/* Practice Location */}
                <div className="text-[11px] text-hogwarts-700 dark:text-hogwarts-300 font-medium flex items-center gap-1 mb-3">
                  <MapPin className="w-3 h-3 text-tiffany-700 dark:text-tiffany-400" />
                  <span>Stase Praktik: <strong className="text-hogwarts-900 dark:text-hogwarts-100">{s.practiceLocation}</strong></span>
                </div>

                {/* 4 Interactive Mastery Step Buttons */}
                <div className="p-3 rounded-2xl bg-white dark:bg-[#181410] border border-hogwarts-200/90 dark:border-[#383028] space-y-2 mb-3 shadow-xs">
                  <div className="flex items-center justify-between text-[10px] font-bold">
                    <span className="text-hogwarts-700 uppercase font-serif">4 Tahap Penguasaan</span>
                    <span className={`px-2 py-0.5 rounded-full border ${
                      isMastered
                        ? 'bg-emerald-100 text-emerald-950 border-emerald-400'
                        : stageCount > 0
                        ? 'bg-amber-100 text-amber-950 border-amber-300'
                        : 'bg-hogwarts-100 text-hogwarts-800 border-hogwarts-300'
                    }`}>
                      {isMastered ? '👑 Siap Ujian' : `${stageCount}/4 Bintang`}
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-1.5 pt-1">
                    {/* Step 1: Pahami */}
                    <button
                      onClick={() => handleToggleTask(s.no, 'pahami', s.pahamiDone)}
                      title={s.pahamiDone ? "Klik untuk membatalkan tahap Pahami" : "Klik untuk menandai P1 Pahami checklist selesai (+25 EXP)"}
                      className={`p-2 rounded-2xl text-center text-xs font-bold transition-all flex flex-col items-center justify-between gap-1 active:scale-95 border-2 ${
                        s.pahamiDone
                          ? 'bg-teal-100/90 border-teal-600 text-teal-950 shadow-sm ring-2 ring-teal-400/30'
                          : 'bg-stone-50/90 border-dashed border-stone-300 text-stone-600 hover:border-teal-500 hover:bg-stone-100 hover:text-stone-900'
                      }`}
                    >
                      <div className="flex items-center gap-0.5">
                        <span className={`text-sm ${s.pahamiDone ? 'text-teal-700 font-black' : 'text-stone-300'}`}>
                          {s.pahamiDone ? '★' : '☆'}
                        </span>
                      </div>
                      <span className="text-[10px] font-serif font-bold leading-tight">① Pahami</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border whitespace-nowrap ${
                        s.pahamiDone
                          ? 'bg-teal-200 border-teal-500 text-teal-950'
                          : 'bg-stone-200/60 border-stone-300 text-stone-500'
                      }`}>
                        {s.pahamiDone ? '✓ Done' : '○ Belum'}
                      </span>
                    </button>

                    {/* Step 2: Solo */}
                    <button
                      onClick={() => handleToggleTask(s.no, 'solo', s.soloDone)}
                      title={s.soloDone ? "Klik untuk membatalkan tahap Solo" : "Klik untuk menandai P2 Solo drill selesai (+25 EXP)"}
                      className={`p-2 rounded-2xl text-center text-xs font-bold transition-all flex flex-col items-center justify-between gap-1 active:scale-95 border-2 ${
                        s.soloDone
                          ? 'bg-sky-100/90 border-sky-600 text-sky-950 shadow-sm ring-2 ring-sky-400/30'
                          : 'bg-stone-50/90 border-dashed border-stone-300 text-stone-600 hover:border-sky-500 hover:bg-stone-100 hover:text-stone-900'
                      }`}
                    >
                      <div className="flex items-center gap-0.5">
                        <span className={`text-xs tracking-tighter ${s.soloDone ? 'text-sky-700 font-black' : 'text-stone-300'}`}>
                          {s.soloDone ? '★★' : '☆☆'}
                        </span>
                      </div>
                      <span className="text-[10px] font-serif font-bold leading-tight">② Solo</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border whitespace-nowrap ${
                        s.soloDone
                          ? 'bg-sky-200 border-sky-500 text-sky-950'
                          : 'bg-stone-200/60 border-stone-300 text-stone-500'
                      }`}>
                        {s.soloDone ? '✓ Done' : '○ Belum'}
                      </span>
                    </button>

                    {/* Step 3: Partner */}
                    <button
                      onClick={() => handleToggleTask(s.no, 'partner', s.partnerDone)}
                      title={s.partnerDone ? "Klik untuk membatalkan tahap Partner" : "Klik untuk menandai P3 Simulasi partner selesai (+25 EXP)"}
                      className={`p-2 rounded-2xl text-center text-xs font-bold transition-all flex flex-col items-center justify-between gap-1 active:scale-95 border-2 ${
                        s.partnerDone
                          ? 'bg-amber-100/90 border-amber-600 text-amber-950 shadow-sm ring-2 ring-amber-400/30'
                          : 'bg-stone-50/90 border-dashed border-stone-300 text-stone-600 hover:border-amber-500 hover:bg-stone-100 hover:text-stone-900'
                      }`}
                    >
                      <div className="flex items-center gap-0.5">
                        <span className={`text-xs tracking-tighter ${s.partnerDone ? 'text-amber-700 font-black' : 'text-stone-300'}`}>
                          {s.partnerDone ? '★★★' : '☆☆☆'}
                        </span>
                      </div>
                      <span className="text-[10px] font-serif font-bold leading-tight">③ Partner</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border whitespace-nowrap ${
                        s.partnerDone
                          ? 'bg-amber-200 border-amber-500 text-amber-950'
                          : 'bg-stone-200/60 border-stone-300 text-stone-500'
                      }`}>
                        {s.partnerDone ? '✓ Done' : '○ Belum'}
                      </span>
                    </button>

                    {/* Step 4: Dinilai */}
                    <button
                      onClick={() => handleToggleTask(s.no, 'dinilai', s.dinilaiDone)}
                      title={s.dinilaiDone ? "Klik untuk membatalkan status Dinilai" : "Klik untuk menandai evaluasi Konsulen/Peer selesai (+25 EXP & Mahir!)"}
                      className={`p-2 rounded-2xl text-center text-xs font-bold transition-all flex flex-col items-center justify-between gap-1 active:scale-95 border-2 ${
                        s.dinilaiDone
                          ? 'bg-emerald-100/90 border-emerald-600 text-emerald-950 shadow-sm ring-2 ring-emerald-400/30'
                          : 'bg-stone-50/90 border-dashed border-stone-300 text-stone-600 hover:border-emerald-500 hover:bg-stone-100 hover:text-stone-900'
                      }`}
                    >
                      <div className="flex items-center gap-0.5">
                        <span className={`text-sm ${s.dinilaiDone ? 'filter drop-shadow scale-110' : 'opacity-30 grayscale'}`}>
                          👑
                        </span>
                      </div>
                      <span className="text-[10px] font-serif font-bold leading-tight">④ Dinilai</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border whitespace-nowrap ${
                        s.dinilaiDone
                          ? 'bg-emerald-200 border-emerald-500 text-emerald-950'
                          : 'bg-stone-200/60 border-stone-300 text-stone-500'
                      }`}>
                        {s.dinilaiDone ? '✓ Done' : '○ Belum'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-2 border-t border-hogwarts-200 dark:border-[#383028] flex items-center justify-between text-[11px]">
                <span className="text-hogwarts-700 dark:text-hogwarts-400 font-medium">
                  {isMastered ? '✨ 100% Menguasai Rubrik' : `Terselesaikan ${stageCount} dari 4 langkah`}
                </span>
                <span className="font-bold text-tiffany-900 dark:text-tiffany-300">
                  {stageCount * 25}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
      )}

      {/* Add Skill Modal */}
      <ModalPortal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <div className="bg-[#fdfcf9] dark:bg-[#1c1814] border-2 border-hogwarts-300 dark:border-[#383028] rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b-2 border-hogwarts-200 dark:border-[#383028] pb-3">
              <h3 className="font-serif text-base font-bold text-hogwarts-950 dark:text-hogwarts-100">
                Tambah Skill / Stasiun Baru
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
                <label className="block text-hogwarts-900 dark:text-hogwarts-200 mb-1 font-bold">Kategori</label>
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Contoh: Anamnesis & komunikasi"
                  className="w-full px-3 py-1.5 rounded-xl border-2 border-hogwarts-300 dark:border-[#42372d] bg-white dark:bg-[#25201b] text-hogwarts-950 dark:text-hogwarts-100 placeholder-hogwarts-400 dark:placeholder-hogwarts-600 font-medium focus:outline-none focus:ring-2 focus:ring-tiffany-600"
                />
              </div>

              <div>
                <label className="block text-hogwarts-900 dark:text-hogwarts-200 mb-1 font-bold">Nama Skill</label>
                <input
                  type="text"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  placeholder="Contoh: Pasang kateter urin"
                  className="w-full px-3 py-1.5 rounded-xl border-2 border-hogwarts-300 dark:border-[#42372d] bg-white dark:bg-[#25201b] text-hogwarts-950 dark:text-hogwarts-100 placeholder-hogwarts-400 dark:placeholder-hogwarts-600 font-medium focus:outline-none focus:ring-2 focus:ring-tiffany-600"
                />
              </div>

              <div>
                <label className="block text-hogwarts-900 dark:text-hogwarts-200 mb-1 font-bold">Tempat Stase Latihan</label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="Contoh: IPD / Bedah / Semua"
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
                onClick={handleCreate}
                className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-tiffany-950 dark:text-tiffany-100 bg-tiffany-200 dark:bg-tiffany-900/60 hover:bg-tiffany-300 dark:hover:bg-tiffany-800 border-2 border-tiffany-700 dark:border-tiffany-600 rounded-xl shadow-xs transition active:scale-95"
              >
                <Save className="w-3.5 h-3.5" />
                Simpan Skill
              </button>
            </div>
          </div>
      </ModalPortal>

      {/* Edit Skill Modal */}
      <ModalPortal isOpen={!!editingSkill} onClose={() => setEditingSkill(null)}>
        {editingSkill && (
          <div className="bg-[#fdfcf9] dark:bg-[#1c1814] border-2 border-hogwarts-300 dark:border-[#383028] rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b-2 border-hogwarts-200 dark:border-[#383028] pb-3">
              <h3 className="font-serif text-base font-bold text-hogwarts-950 dark:text-hogwarts-100">
                Edit Skill #{editingSkill.no}
              </h3>
              <button
                onClick={() => setEditingSkill(null)}
                className="p-1 text-hogwarts-600 dark:text-hogwarts-400 hover:text-hogwarts-900 dark:hover:text-hogwarts-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-hogwarts-900 dark:text-hogwarts-200 mb-1 font-bold">Kategori</label>
                <input
                  type="text"
                  value={editingSkill.category}
                  onChange={(e) => setEditingSkill({ ...editingSkill, category: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-xl border-2 border-hogwarts-300 dark:border-[#42372d] bg-white dark:bg-[#25201b] text-hogwarts-950 dark:text-hogwarts-100 font-medium focus:outline-none focus:ring-2 focus:ring-tiffany-600"
                />
              </div>

              <div>
                <label className="block text-hogwarts-900 dark:text-hogwarts-200 mb-1 font-bold">Nama Skill</label>
                <input
                  type="text"
                  value={editingSkill.skillName}
                  onChange={(e) => setEditingSkill({ ...editingSkill, skillName: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-xl border-2 border-hogwarts-300 dark:border-[#42372d] bg-white dark:bg-[#25201b] text-hogwarts-950 dark:text-hogwarts-100 font-medium focus:outline-none focus:ring-2 focus:ring-tiffany-600"
                />
              </div>

              <div>
                <label className="block text-hogwarts-900 dark:text-hogwarts-200 mb-1 font-bold">Tempat Stase</label>
                <input
                  type="text"
                  value={editingSkill.practiceLocation}
                  onChange={(e) => setEditingSkill({ ...editingSkill, practiceLocation: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-xl border-2 border-hogwarts-300 dark:border-[#42372d] bg-white dark:bg-[#25201b] text-hogwarts-950 dark:text-hogwarts-100 font-medium focus:outline-none focus:ring-2 focus:ring-tiffany-600"
                />
              </div>

              {/* Status 4 Tahap Penguasaan in Modal */}
              <div>
                <label className="block text-hogwarts-900 dark:text-hogwarts-200 mb-1 font-bold">Status Penguasaan (4 Tahap)</label>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setEditingSkill({ ...editingSkill, pahamiDone: !editingSkill.pahamiDone })}
                    className={`flex items-center justify-between p-2 rounded-xl border-2 text-xs transition active:scale-95 ${
                      editingSkill.pahamiDone
                        ? 'bg-teal-100/90 dark:bg-teal-950/80 border-teal-600 dark:border-teal-500 text-teal-950 dark:text-teal-200 font-bold shadow-xs'
                        : 'bg-stone-50 dark:bg-[#25201b] border-stone-300 dark:border-[#42372d] text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-[#2d251f]'
                    }`}
                  >
                    <span>⭐ ① Pahami</span>
                    <span className="text-[10px]">{editingSkill.pahamiDone ? '✓ Selesai' : '○ Belum'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditingSkill({ ...editingSkill, soloDone: !editingSkill.soloDone })}
                    className={`flex items-center justify-between p-2 rounded-xl border-2 text-xs transition active:scale-95 ${
                      editingSkill.soloDone
                        ? 'bg-sky-100/90 dark:bg-sky-950/80 border-sky-600 dark:border-sky-500 text-sky-950 dark:text-sky-200 font-bold shadow-xs'
                        : 'bg-stone-50 dark:bg-[#25201b] border-stone-300 dark:border-[#42372d] text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-[#2d251f]'
                    }`}
                  >
                    <span>⭐⭐ ② Solo</span>
                    <span className="text-[10px]">{editingSkill.soloDone ? '✓ Selesai' : '○ Belum'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditingSkill({ ...editingSkill, partnerDone: !editingSkill.partnerDone })}
                    className={`flex items-center justify-between p-2 rounded-xl border-2 text-xs transition active:scale-95 ${
                      editingSkill.partnerDone
                        ? 'bg-amber-100/90 dark:bg-amber-950/80 border-amber-600 dark:border-amber-500 text-amber-950 dark:text-amber-200 font-bold shadow-xs'
                        : 'bg-stone-50 dark:bg-[#25201b] border-stone-300 dark:border-[#42372d] text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-[#2d251f]'
                    }`}
                  >
                    <span>⭐⭐⭐ ③ Partner</span>
                    <span className="text-[10px]">{editingSkill.partnerDone ? '✓ Selesai' : '○ Belum'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditingSkill({ ...editingSkill, dinilaiDone: !editingSkill.dinilaiDone })}
                    className={`flex items-center justify-between p-2 rounded-xl border-2 text-xs transition active:scale-95 ${
                      editingSkill.dinilaiDone
                        ? 'bg-emerald-100/90 dark:bg-emerald-950/80 border-emerald-600 dark:border-emerald-500 text-emerald-950 dark:text-emerald-200 font-bold shadow-xs'
                        : 'bg-stone-50 dark:bg-[#25201b] border-stone-300 dark:border-[#42372d] text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-[#2d251f]'
                    }`}
                  >
                    <span>👑 ④ Dinilai</span>
                    <span className="text-[10px]">{editingSkill.dinilaiDone ? '✓ Selesai' : '○ Belum'}</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t-2 border-hogwarts-200 dark:border-[#383028]">
              <button
                onClick={() => setEditingSkill(null)}
                className="px-4 py-1.5 text-xs font-bold text-hogwarts-800 dark:text-hogwarts-200 hover:bg-hogwarts-100 dark:hover:bg-[#25201b] border border-hogwarts-300 dark:border-[#42372d] rounded-xl transition"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  updateOSCESkill(editingSkill.no, editingSkill);
                  sounds.playClick();
                  setEditingSkill(null);
                }}
                className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-tiffany-950 dark:text-tiffany-100 bg-tiffany-200 dark:bg-tiffany-900/60 hover:bg-tiffany-300 dark:hover:bg-tiffany-800 border-2 border-tiffany-700 dark:border-tiffany-600 rounded-xl shadow-xs transition active:scale-95"
              >
                <Save className="w-3.5 h-3.5" />
                Simpan
              </button>
            </div>
          </div>
        )}
      </ModalPortal>
    </div>
  );
};
