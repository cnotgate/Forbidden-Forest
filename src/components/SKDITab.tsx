import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SKDISystem } from '../types';
import {
  BookOpen,
  CheckCircle2,
  Circle,
  Search,
  Sparkles,
  Edit3,
  X,
  Save,
  Scroll,
  Star,
  Trophy,
  Filter,
  Check,
  Plus,
  Trash2,
  RefreshCw
} from 'lucide-react';
import { sounds } from '../utils/soundHelper';
import confetti from 'canvas-confetti';
import { ModalPortal } from './ModalPortal';

const SYSTEM_ICONS: Record<number, string> = {
  1: '❤️',
  2: '🫁',
  3: '🍽️',
  4: '💧',
  5: '🧬',
  6: '🩸',
  7: '🦟',
  8: '🧠',
  9: '🦴',
  10: '👁️',
  11: '👂',
  12: '🧴',
  13: '🤰',
  14: '👶',
  15: '🩹',
  16: '⚖️',
  17: '🏘️',
  18: '🚨',
  19: '💊',
  20: '📜',
};

export const SKDITab: React.FC = () => {
  const { state, toggleSKDIPass, updateSKDISystem, addSKDISystem, deleteSKDISystem } = useApp();

  const [search, setSearch] = useState('');
  const [filterMastery, setFilterMastery] = useState<'ALL' | 'MASTERED' | 'IN_PROGRESS' | 'UNSTARTED'>('ALL');
  const [editingSystem, setEditingSystem] = useState<SKDISystem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New System form state
  const [newName, setNewName] = useState('');
  const [newSource, setNewSource] = useState('Penyakit Dalam');
  const [newNotes, setNewNotes] = useState('');

  const filteredSystems = state.skdiSystems.filter(sys => {
    const passCount = (sys.p1Done ? 1 : 0) + (sys.p2Done ? 1 : 0) + (sys.p3Done ? 1 : 0);
    if (filterMastery === 'MASTERED' && passCount !== 3) return false;
    if (filterMastery === 'IN_PROGRESS' && (passCount === 0 || passCount === 3)) return false;
    if (filterMastery === 'UNSTARTED' && passCount !== 0) return false;

    if (search.trim()) {
      const q = search.toLowerCase();
      const match =
        sys.systemName.toLowerCase().includes(q) ||
        sys.clerkshipSource.toLowerCase().includes(q) ||
        sys.skdiNotes.toLowerCase().includes(q) ||
        `#${sys.no}`.includes(q);
      if (!match) return false;
    }
    return true;
  });

  const totalSystems = state.skdiSystems.length;
  const totalP1 = state.skdiSystems.filter(s => s.p1Done).length;
  const totalP2 = state.skdiSystems.filter(s => s.p2Done).length;
  const totalP3 = state.skdiSystems.filter(s => s.p3Done).length;
  const totalFullyMastered = state.skdiSystems.filter(s => s.p1Done && s.p2Done && s.p3Done).length;

  const handleTogglePass = (no: number, pass: 'p1' | 'p2' | 'p3', currentlyDone: boolean) => {
    toggleSKDIPass(no, pass);
    if (!currentlyDone) {
      sounds.playQuestComplete();
      confetti({
        particleCount: 40,
        spread: 55,
        origin: { y: 0.7 }
      });
    } else {
      sounds.playClick();
    }
  };

  const handleSaveEdit = () => {
    if (editingSystem) {
      updateSKDISystem(editingSystem.no, editingSystem);
      sounds.playClick();
      setEditingSystem(null);
    }
  };

  const handleCreateSystem = () => {
    if (!newName.trim()) {
      alert('Mohon isi nama sistem organ / cabang ilmu!');
      return;
    }

    addSKDISystem({
      systemName: newName,
      clerkshipSource: newSource || 'Umum',
      status: 'Aktif',
      pass1Desc: 'Kenali gambaran umum klinis & kriteria 4A',
      pass2Desc: 'Kuasai diagnosis banding, penunjang, terapi obat',
      pass3Desc: 'Latihan soal jebakan & pemantapan retensi',
      skdiNotes: newNotes || 'Kompetensi SKDI 4A tuntas mandiri.'
    });

    sounds.playLevelUp();
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 }
    });

    setNewName('');
    setNewNotes('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#f8f3ea] via-[#faf5ec] to-[#f0e7d5] dark:from-[#1c1713] dark:via-[#181410] dark:to-[#120f0d] border border-hogwarts-300/80 dark:border-[#382f25] rounded-3xl p-6 shadow-sm space-y-4">
        {/* Top Row: Title, Description & Action Button */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-serif text-xl font-bold text-hogwarts-950 flex items-center gap-2">
                <Scroll className="w-5 h-5 text-hogwarts-700" />
                Grimoire {totalSystems} Cabang Ilmu Medis (SKDI 2026)
              </h1>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-hogwarts-100 text-hogwarts-950 border border-hogwarts-300">
                3-Star Mastery ⭐
              </span>
            </div>
            <p className="text-xs text-hogwarts-800 mt-1.5 font-medium leading-relaxed">
              <span className="font-bold text-teal-900">⭐ Pass 1: Kenali (Pondasi)</span> →{' '}
              <span className="font-bold text-amber-900">⭐⭐ Pass 2: Tajamkan (DDx & Terapi)</span> →{' '}
              <span className="font-bold text-purple-900">⭐⭐⭐ Pass 3: Kunci (Retensi Ujian)</span>. Tiap pass menyumbang <span className="font-bold text-hogwarts-950">+30 EXP</span>!
            </p>
          </div>

          {/* Action Button: Hogwarts Vintage Parchment (Bukan Biru) */}
          <button
            onClick={() => { sounds.playClick(); setIsAddModalOpen(true); }}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-serif font-bold rounded-2xl bg-[#fdfcf9] hover:bg-[#f5efe4] text-hogwarts-950 border-2 border-hogwarts-400 hover:border-hogwarts-600 shadow-sm transition active:scale-95 shrink-0 self-start md:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4 text-hogwarts-700" />
            <span>Tambah Cabang</span>
          </button>
        </div>

        {/* Bottom Row: 4 Stat Counter Cards Grid - Perfectly Symmetrical & Organized */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 pt-1 border-t border-hogwarts-200/80">
          <div className="p-3 rounded-2xl bg-teal-50/80 border-2 border-teal-300 text-center shadow-xs">
            <div className="text-[10px] text-teal-950 font-bold uppercase font-serif tracking-wide">P1 Kenali</div>
            <div className="font-serif text-sm font-extrabold text-teal-950 mt-0.5">{totalP1} / {totalSystems}</div>
          </div>
          <div className="p-3 rounded-2xl bg-amber-50/80 border-2 border-amber-300 text-center shadow-xs">
            <div className="text-[10px] text-amber-950 font-bold uppercase font-serif tracking-wide">P2 Tajam</div>
            <div className="font-serif text-sm font-extrabold text-amber-950 mt-0.5">{totalP2} / {totalSystems}</div>
          </div>
          <div className="p-3 rounded-2xl bg-purple-50/80 border-2 border-purple-300 text-center shadow-xs">
            <div className="text-[10px] text-purple-950 font-bold uppercase font-serif tracking-wide">P3 Kunci</div>
            <div className="font-serif text-sm font-extrabold text-purple-950 mt-0.5">{totalP3} / {totalSystems}</div>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-50/80 border-2 border-emerald-400 text-center shadow-xs">
            <div className="text-[10px] text-emerald-950 font-bold uppercase font-serif tracking-wide">Mastered 🏆</div>
            <div className="font-serif text-sm font-extrabold text-emerald-950 mt-0.5">{totalFullyMastered} / {totalSystems}</div>
          </div>
        </div>
      </div>

      {/* Search and Mastery Filter */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-[#fdfcf9] dark:bg-[#1a1612] border-2 border-hogwarts-300 dark:border-[#383028] rounded-2xl p-4 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-hogwarts-500 dark:text-hogwarts-400" />
          <input
            type="text"
            placeholder="Cari sistem organ, topik penyakit, atau nama stase..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-hogwarts-300 dark:border-[#383028] bg-hogwarts-50 dark:bg-[#201a15] text-hogwarts-950 dark:text-hogwarts-100 placeholder-hogwarts-400 dark:placeholder-hogwarts-600 focus:outline-none focus:ring-2 focus:ring-tiffany-600 font-medium"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <select
            value={filterMastery}
            onChange={(e) => setFilterMastery(e.target.value as any)}
            className="px-3 py-2 text-xs rounded-xl border border-hogwarts-300 dark:border-[#383028] bg-hogwarts-50 dark:bg-[#201a15] text-hogwarts-950 dark:text-hogwarts-100 focus:outline-none font-bold w-full sm:w-auto"
          >
            <option value="ALL">Semua Cabang ({totalSystems})</option>
            <option value="MASTERED">🏆 Mastered (3 Bintang)</option>
            <option value="IN_PROGRESS">⚡ Ditempa (1-2 Bintang)</option>
            <option value="UNSTARTED">🔒 Belum Dimulai (0 Bintang)</option>
          </select>
        </div>
      </div>

      {/* Spellbook Tome Cards Grid or Empty State */}
      {filteredSystems.length === 0 ? (
        <div className="p-12 text-center bg-[#fdfcf9] dark:bg-[#1a1612] rounded-3xl border-2 border-hogwarts-300 dark:border-[#383028] text-hogwarts-600 dark:text-hogwarts-400 space-y-3 animate-in fade-in duration-200">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-hogwarts-100 dark:bg-[#25201b] border border-hogwarts-300 dark:border-[#3d3328] flex items-center justify-center text-3xl">
            📜
          </div>
          <div>
            <h3 className="font-serif text-base font-bold text-hogwarts-950 dark:text-hogwarts-100">
              Tidak Ada Grimoire SKDI yang Cocok
            </h3>
            <p className="text-xs text-hogwarts-700 dark:text-hogwarts-400 mt-1 max-w-md mx-auto">
              Tidak ditemukan cabang sistem organ atau topik yang cocok dengan filter atau kata kunci "{search}".
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={() => {
                sounds.playClick();
                setSearch('');
                setFilterMastery('ALL');
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
          {filteredSystems.map((sys) => {
            const passCount = (sys.p1Done ? 1 : 0) + (sys.p2Done ? 1 : 0) + (sys.p3Done ? 1 : 0);
            const icon = SYSTEM_ICONS[sys.no] || '📖';

          return (
            <div
              key={sys.no}
              className={`rounded-3xl p-5 border-2 transition-all flex flex-col justify-between shadow-xs hover:shadow-md ${
                passCount === 3
                  ? 'bg-gradient-to-br from-[#f2fcf6] to-[#e4f8ed] dark:from-[#09261a] dark:to-[#0e3827] border-emerald-400 dark:border-emerald-600/70'
                  : passCount > 0
                  ? 'bg-gradient-to-br from-[#fdfcf9] to-[#f4faf9] dark:from-[#092b26] dark:to-[#0f3d36] border-tiffany-400 dark:border-tiffany-600/70'
                  : 'bg-[#fdfcf9] dark:bg-[#211c17] border-hogwarts-300 dark:border-[#383028] hover:border-tiffany-500'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl p-2 rounded-2xl bg-white dark:bg-[#1a1612] border border-hogwarts-200 dark:border-[#383028] shadow-xs">
                      {icon}
                    </span>
                    <div>
                      <span className="text-[10px] font-bold text-hogwarts-700 font-serif block">
                        Tome #{sys.no}
                      </span>
                      <h3 className="font-serif font-bold text-sm text-hogwarts-950 leading-tight">
                        {sys.systemName}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingSystem({ ...sys })}
                      className="p-1.5 text-hogwarts-600 hover:text-tiffany-700 rounded-lg hover:bg-white transition"
                      title="Edit catatan Grimoire"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        sounds.playClick();
                        if (window.confirm(`Hapus Grimoire Tome #${sys.no} (${sys.systemName})?`)) {
                          deleteSKDISystem(sys.no);
                        }
                      }}
                      className="p-1.5 text-hogwarts-600 hover:text-rose-700 rounded-lg hover:bg-rose-50 transition"
                      title="Hapus Cabang"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Stase Origin Badge */}
                <div className="flex items-center justify-between text-xs mb-3 px-3 py-1.5 rounded-xl bg-white/80 dark:bg-[#15120f] border border-hogwarts-200 dark:border-[#383028]">
                  <span className="text-[11px] font-medium text-hogwarts-700 dark:text-hogwarts-400">Sumber Stase:</span>
                  <span className="font-bold text-hogwarts-950">{sys.clerkshipSource}</span>
                </div>

                {/* 3-Star Mastery Inscription */}
                <div className="p-3 rounded-2xl bg-white dark:bg-[#181410] border border-hogwarts-200/90 dark:border-[#383028] space-y-2 mb-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-hogwarts-700 uppercase font-serif">
                      Tingkat Penguasaan
                    </span>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                      passCount === 3
                        ? 'bg-emerald-100 text-emerald-950 border-emerald-400'
                        : passCount > 0
                        ? 'bg-tiffany-100 text-tiffany-950 border-tiffany-300'
                        : 'bg-hogwarts-100 text-hogwarts-800 border-hogwarts-300'
                    }`}>
                      {passCount === 3 ? '🏆 Mastered' : `${passCount}/3 Pass`}
                    </span>
                  </div>

                  {/* 3 Clickable Pass Buttons */}
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    {/* Pass 1 - Teal / Mint */}
                    <button
                      onClick={() => handleTogglePass(sys.no, 'p1', sys.p1Done)}
                      title={sys.p1Done ? "Klik untuk membatalkan P1" : "Klik untuk menandai P1 Kenali selesai (+30 EXP)"}
                      className={`p-2.5 rounded-2xl text-center text-xs font-bold transition-all flex flex-col items-center justify-between gap-1 active:scale-95 border-2 ${
                        sys.p1Done
                          ? 'bg-teal-100/90 border-teal-600 text-teal-950 shadow-sm ring-2 ring-teal-400/30'
                          : 'bg-stone-50/90 border-dashed border-stone-300 text-stone-600 hover:border-teal-500 hover:bg-stone-100 hover:text-stone-900'
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        <span className={`text-sm ${sys.p1Done ? 'text-teal-700 font-black' : 'text-stone-300'}`}>
                          {sys.p1Done ? '★' : '☆'}
                        </span>
                      </div>
                      <span className="text-[10px] font-serif font-bold leading-tight">P1: Kenali</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${
                        sys.p1Done
                          ? 'bg-teal-200 border-teal-500 text-teal-950'
                          : 'bg-stone-200/60 border-stone-300 text-stone-500'
                      }`}>
                        {sys.p1Done ? '✓ Done' : '○ Belum'}
                      </span>
                    </button>

                    {/* Pass 2 - Warm Golden Amber */}
                    <button
                      onClick={() => handleTogglePass(sys.no, 'p2', sys.p2Done)}
                      title={sys.p2Done ? "Klik untuk membatalkan P2" : "Klik untuk menandai P2 Tajam selesai (+30 EXP)"}
                      className={`p-2.5 rounded-2xl text-center text-xs font-bold transition-all flex flex-col items-center justify-between gap-1 active:scale-95 border-2 ${
                        sys.p2Done
                          ? 'bg-amber-100/90 border-amber-600 text-amber-950 shadow-sm ring-2 ring-amber-400/30'
                          : 'bg-stone-50/90 border-dashed border-stone-300 text-stone-600 hover:border-amber-500 hover:bg-stone-100 hover:text-stone-900'
                      }`}
                    >
                      <div className="flex items-center gap-0.5">
                        <span className={`text-sm ${sys.p2Done ? 'text-amber-700 font-black' : 'text-stone-300'}`}>
                          {sys.p2Done ? '★★' : '☆☆'}
                        </span>
                      </div>
                      <span className="text-[10px] font-serif font-bold leading-tight">P2: Tajam</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${
                        sys.p2Done
                          ? 'bg-amber-200 border-amber-500 text-amber-950'
                          : 'bg-stone-200/60 border-stone-300 text-stone-500'
                      }`}>
                        {sys.p2Done ? '✓ Done' : '○ Belum'}
                      </span>
                    </button>

                    {/* Pass 3 - Royal Amethyst Purple */}
                    <button
                      onClick={() => handleTogglePass(sys.no, 'p3', sys.p3Done)}
                      title={sys.p3Done ? "Klik untuk membatalkan P3" : "Klik untuk menandai P3 Kunci selesai (+30 EXP)"}
                      className={`p-2.5 rounded-2xl text-center text-xs font-bold transition-all flex flex-col items-center justify-between gap-1 active:scale-95 border-2 ${
                        sys.p3Done
                          ? 'bg-purple-100/90 border-purple-600 text-purple-950 shadow-sm ring-2 ring-purple-400/30'
                          : 'bg-stone-50/90 border-dashed border-stone-300 text-stone-600 hover:border-purple-500 hover:bg-stone-100 hover:text-stone-900'
                      }`}
                    >
                      <div className="flex items-center gap-0.5">
                        <span className={`text-sm ${sys.p3Done ? 'text-purple-700 font-black' : 'text-stone-300'}`}>
                          {sys.p3Done ? '★★★' : '☆☆☆'}
                        </span>
                      </div>
                      <span className="text-[10px] font-serif font-bold leading-tight">P3: Kunci</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${
                        sys.p3Done
                          ? 'bg-purple-200 border-purple-500 text-purple-950'
                          : 'bg-stone-200/60 border-stone-300 text-stone-500'
                      }`}>
                        {sys.p3Done ? '✓ Done' : '○ Belum'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Clinical Notes / Mantra Box */}
                <div className="space-y-1 mb-2">
                  <span className="text-[10px] font-bold text-tiffany-950 uppercase font-serif">
                    Catatan Klinis (4A vs 3A/3B Rujuk):
                  </span>
                  <p className="text-[11px] text-hogwarts-800 dark:text-hogwarts-300 leading-relaxed font-medium bg-[#faf6ee] dark:bg-[#15120f] p-2.5 rounded-xl border border-hogwarts-200 dark:border-[#383028]">
                    {sys.skdiNotes}
                  </p>
                </div>
              </div>

              {/* Card Footer Status */}
              <div className="pt-2 border-t border-hogwarts-200 dark:border-[#383028] flex items-center justify-between text-[11px]">
                <span className="text-hogwarts-700 dark:text-hogwarts-400 font-medium">
                  {passCount === 3
                    ? '✨ Penguasaan Sempurna (+90 EXP)'
                    : `Terkumpul ${passCount * 30} EXP`}
                </span>
                <span className="font-bold text-tiffany-900 dark:text-tiffany-300">
                  {passCount === 3 ? '100% Siap Ujian' : `${Math.round((passCount / 3) * 100)}%`}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      )}

      {/* Add System Modal */}
      <ModalPortal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <div className="bg-[#fdfcf9] dark:bg-[#1c1814] border-2 border-hogwarts-300 dark:border-[#383028] rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b-2 border-hogwarts-200 dark:border-[#383028] pb-3">
              <h3 className="font-serif text-base font-bold text-hogwarts-950 dark:text-hogwarts-100 flex items-center gap-2">
                <Plus className="w-5 h-5 text-tiffany-700 dark:text-tiffany-400" />
                Tambah Cabang Ilmu / Sistem Medis Baru (#{totalSystems + 1})
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-hogwarts-600 dark:text-hogwarts-400 hover:text-hogwarts-950 dark:hover:text-hogwarts-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-hogwarts-900 dark:text-hogwarts-200 mb-1 font-bold">Nama Cabang / Sistem Organ</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Contoh: Kedokteran Nuklir & Onkologi"
                  className="w-full px-3 py-1.5 rounded-xl border-2 border-hogwarts-300 dark:border-[#42372d] bg-white dark:bg-[#25201b] text-hogwarts-950 dark:text-hogwarts-100 placeholder-hogwarts-400 dark:placeholder-hogwarts-600 font-semibold focus:outline-none focus:ring-2 focus:ring-tiffany-600"
                />
              </div>

              <div>
                <label className="block text-hogwarts-900 dark:text-hogwarts-200 mb-1 font-bold">Sumber Stase</label>
                <input
                  type="text"
                  value={newSource}
                  onChange={(e) => setNewSource(e.target.value)}
                  placeholder="Contoh: Radiologi / IPD / Bedah"
                  className="w-full px-3 py-1.5 rounded-xl border-2 border-hogwarts-300 dark:border-[#42372d] bg-white dark:bg-[#25201b] text-hogwarts-950 dark:text-hogwarts-100 placeholder-hogwarts-400 dark:placeholder-hogwarts-600 font-semibold focus:outline-none focus:ring-2 focus:ring-tiffany-600"
                />
              </div>

              <div>
                <label className="block text-hogwarts-900 dark:text-hogwarts-200 mb-1 font-bold">Catatan Klinis (4A vs 3A/3B Rujuk)</label>
                <textarea
                  rows={4}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Tuliskan kata kunci penting, kriteria diagnosis 4A, dan terapi rasional..."
                  className="w-full px-3 py-1.5 rounded-xl border-2 border-hogwarts-300 dark:border-[#42372d] bg-white dark:bg-[#25201b] text-hogwarts-950 dark:text-hogwarts-100 placeholder-hogwarts-400 dark:placeholder-hogwarts-600 font-medium focus:outline-none focus:ring-2 focus:ring-tiffany-600"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t-2 border-hogwarts-200 dark:border-[#383028]">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-1.5 text-xs text-hogwarts-800 dark:text-hogwarts-200 hover:text-hogwarts-950 dark:hover:text-hogwarts-100 rounded-xl font-bold"
              >
                Batal
              </button>
              <button
                onClick={handleCreateSystem}
                className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-tiffany-950 dark:text-tiffany-100 bg-tiffany-200 dark:bg-tiffany-900/60 hover:bg-tiffany-300 dark:hover:bg-tiffany-800 border-2 border-tiffany-700 dark:border-tiffany-600 rounded-xl shadow-sm transition active:scale-95"
              >
                <Save className="w-3.5 h-3.5" />
                Simpan & Tambah Tome ✨
              </button>
            </div>
          </div>
      </ModalPortal>

      {/* Edit System Modal */}
      <ModalPortal isOpen={!!editingSystem} onClose={() => setEditingSystem(null)}>
        {editingSystem && (
          <div className="bg-[#fdfcf9] dark:bg-[#1c1814] border-2 border-hogwarts-300 dark:border-[#383028] rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b-2 border-hogwarts-200 dark:border-[#383028] pb-3">
              <h3 className="font-serif text-base font-bold text-hogwarts-950 dark:text-hogwarts-100">
                Edit Grimoire Tome #{editingSystem.no}: {editingSystem.systemName}
              </h3>
              <button
                onClick={() => setEditingSystem(null)}
                className="p-1 text-hogwarts-600 dark:text-hogwarts-400 hover:text-hogwarts-950 dark:hover:text-hogwarts-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-hogwarts-900 dark:text-hogwarts-200 mb-1 font-bold">Nama Cabang / Sistem Organ</label>
                <input
                  type="text"
                  value={editingSystem.systemName}
                  onChange={(e) => setEditingSystem({ ...editingSystem, systemName: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-xl border-2 border-hogwarts-300 dark:border-[#42372d] bg-white dark:bg-[#25201b] text-hogwarts-950 dark:text-hogwarts-100 font-semibold focus:outline-none focus:ring-2 focus:ring-tiffany-600"
                />
              </div>

              <div>
                <label className="block text-hogwarts-900 dark:text-hogwarts-200 mb-1 font-bold">Sumber Stase</label>
                <input
                  type="text"
                  value={editingSystem.clerkshipSource}
                  onChange={(e) => setEditingSystem({ ...editingSystem, clerkshipSource: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-xl border-2 border-hogwarts-300 dark:border-[#42372d] bg-white dark:bg-[#25201b] text-hogwarts-950 dark:text-hogwarts-100 font-semibold focus:outline-none focus:ring-2 focus:ring-tiffany-600"
                />
              </div>

              <div>
                <label className="block text-hogwarts-900 dark:text-hogwarts-200 mb-1 font-bold">Catatan Klinis (4A vs 3A/3B Rujuk)</label>
                <textarea
                  rows={4}
                  value={editingSystem.skdiNotes}
                  onChange={(e) => setEditingSystem({ ...editingSystem, skdiNotes: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-xl border-2 border-hogwarts-300 dark:border-[#42372d] bg-white dark:bg-[#25201b] text-hogwarts-950 dark:text-hogwarts-100 font-medium focus:outline-none focus:ring-2 focus:ring-tiffany-600"
                />
              </div>

              <div>
                <label className="block text-hogwarts-900 dark:text-hogwarts-200 mb-1.5 font-bold">Status Pencapaian 3 Pass</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setEditingSystem({ ...editingSystem, p1Done: !editingSystem.p1Done });
                    }}
                    className={`p-2 rounded-xl text-center text-xs font-bold border-2 transition ${
                      editingSystem.p1Done
                        ? 'bg-teal-100 dark:bg-teal-950/80 border-teal-600 dark:border-teal-500 text-teal-950 dark:text-teal-200 shadow-xs'
                        : 'bg-stone-50 dark:bg-[#25201b] border-dashed border-stone-300 dark:border-[#42372d] text-stone-600 dark:text-stone-400'
                    }`}
                  >
                    {editingSystem.p1Done ? '★ P1: Selesai' : '☆ P1: Belum'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setEditingSystem({ ...editingSystem, p2Done: !editingSystem.p2Done });
                    }}
                    className={`p-2 rounded-xl text-center text-xs font-bold border-2 transition ${
                      editingSystem.p2Done
                        ? 'bg-amber-100 dark:bg-amber-950/80 border-amber-600 dark:border-amber-500 text-amber-950 dark:text-amber-200 shadow-xs'
                        : 'bg-stone-50 dark:bg-[#25201b] border-dashed border-stone-300 dark:border-[#42372d] text-stone-600 dark:text-stone-400'
                    }`}
                  >
                    {editingSystem.p2Done ? '★★ P2: Selesai' : '☆☆ P2: Belum'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setEditingSystem({ ...editingSystem, p3Done: !editingSystem.p3Done });
                    }}
                    className={`p-2 rounded-xl text-center text-xs font-bold border-2 transition ${
                      editingSystem.p3Done
                        ? 'bg-purple-100 dark:bg-purple-950/80 border-purple-600 dark:border-purple-500 text-purple-950 dark:text-purple-200 shadow-xs'
                        : 'bg-stone-50 dark:bg-[#25201b] border-dashed border-stone-300 dark:border-[#42372d] text-stone-600 dark:text-stone-400'
                    }`}
                  >
                    {editingSystem.p3Done ? '★★★ P3: Selesai' : '☆☆☆ P3: Belum'}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t-2 border-hogwarts-200 dark:border-[#383028]">
              <button
                onClick={() => {
                  sounds.playClick();
                  if (window.confirm(`Yakin ingin menghapus Tome #${editingSystem.no} (${editingSystem.systemName})?`)) {
                    deleteSKDISystem(editingSystem.no);
                    setEditingSystem(null);
                  }
                }}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-rose-700 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-950/50 rounded-xl transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Hapus Tome
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditingSystem(null)}
                  className="px-4 py-1.5 text-xs text-hogwarts-800 dark:text-hogwarts-200 hover:text-hogwarts-950 dark:hover:text-hogwarts-100 rounded-xl font-bold"
                >
                  Batal
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-tiffany-950 dark:text-tiffany-100 bg-tiffany-200 dark:bg-tiffany-900/60 hover:bg-tiffany-300 dark:hover:bg-tiffany-800 border-2 border-tiffany-700 dark:border-tiffany-600 rounded-xl shadow-sm transition active:scale-95"
                >
                  <Save className="w-3.5 h-3.5" />
                  Simpan Grimoire
                </button>
              </div>
            </div>
          </div>
        )}
      </ModalPortal>
    </div>
  );
};
