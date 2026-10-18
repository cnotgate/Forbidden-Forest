import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { GuidelineItem } from '../types';
import {
  Scroll,
  Plus,
  Edit3,
  Trash2,
  Search,
  X,
  Save,
  Sparkles,
  BookOpen,
  Lightbulb,
  Compass,
  ShieldCheck,
  Heart,
  Award,
  CheckCircle2,
  Filter
} from 'lucide-react';
import { sounds } from '../utils/soundHelper';
import confetti from 'canvas-confetti';
import { ModalPortal } from './ModalPortal';

export const GuidelinesTab: React.FC = () => {
  const { state, addGuideline, updateGuideline, deleteGuideline } = useApp();

  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Add modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTopic, setNewTopic] = useState('');
  const [newDetail, setNewDetail] = useState('');

  // Edit modal state
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editTopic, setEditTopic] = useState('');
  const [editDetail, setEditDetail] = useState('');

  const guidelinesList = state.guidelines || [];

  // Filtered guidelines
  const filteredGuidelines = useMemo(() => {
    return guidelinesList
      .map((item, index) => ({ item, index }))
      .filter(({ item }) => {
        // Search filter
        const matchSearch =
          item.topic.toLowerCase().includes(search.toLowerCase()) ||
          item.detail.toLowerCase().includes(search.toLowerCase());
        if (!matchSearch) return false;

        // Category filter
        if (filterCategory === 'strategi') {
          return (
            item.topic.toLowerCase().includes('pass') ||
            item.topic.toLowerCase().includes('level') ||
            item.topic.toLowerCase().includes('overcontrol') ||
            item.topic.toLowerCase().includes('auditory') ||
            item.topic.toLowerCase().includes('socratic') ||
            item.topic.toLowerCase().includes('strategi')
          );
        }
        if (filterCategory === 'asumsi') {
          return (
            item.topic.toLowerCase().includes('asumsi') ||
            item.topic.toLowerCase().includes('d-day') ||
            item.topic.toLowerCase().includes('skor') ||
            item.topic.toLowerCase().includes('target') ||
            item.topic.toLowerCase().includes('libur') ||
            item.topic.toLowerCase().includes('jam') ||
            item.topic.toLowerCase().includes('konten')
          );
        }
        if (filterCategory === 'navigasi') {
          return (
            item.topic.toLowerCase().includes('dashboard') ||
            item.topic.toLowerCase().includes('roadmap') ||
            item.topic.toLowerCase().includes('intensif') ||
            item.topic.toLowerCase().includes('skdi') ||
            item.topic.toLowerCase().includes('tryout')
          );
        }
        return true;
      });
  }, [guidelinesList, search, filterCategory]);

  const handleOpenAdd = () => {
    sounds.playClick();
    setNewTopic('');
    setNewDetail('');
    setIsAddModalOpen(true);
  };

  const handleSaveAdd = () => {
    if (!newTopic.trim()) {
      alert('Judul atau topik pedoman tidak boleh kosong!');
      return;
    }
    sounds.playQuestComplete();
    confetti({
      particleCount: 25,
      spread: 50,
      origin: { y: 0.6 }
    });
    addGuideline({
      topic: newTopic.trim(),
      detail: newDetail.trim()
    });
    setIsAddModalOpen(false);
  };

  const handleOpenEdit = (index: number, item: GuidelineItem) => {
    sounds.playClick();
    setEditingIndex(index);
    setEditTopic(item.topic);
    setEditDetail(item.detail);
  };

  const handleSaveEdit = () => {
    if (editingIndex === null) return;
    if (!editTopic.trim()) {
      alert('Judul atau topik pedoman tidak boleh kosong!');
      return;
    }
    sounds.playQuestComplete();
    updateGuideline(editingIndex, {
      topic: editTopic.trim(),
      detail: editDetail.trim()
    });
    setEditingIndex(null);
  };

  const handleDelete = (index: number, topic: string) => {
    sounds.playClick();
    if (window.confirm(`Yakin ingin menghapus pedoman "${topic}"?`)) {
      deleteGuideline(index);
    }
  };

  // Get icon for guideline
  const getGuidelineIcon = (topic: string) => {
    const t = topic.toLowerCase();
    if (t.includes('pass') || t.includes('spiral')) return '🌿';
    if (t.includes('level') || t.includes('burnout')) return '🌙';
    if (t.includes('overcontrol') || t.includes('salah')) return '📜';
    if (t.includes('auditory') || t.includes('kinesthetic') || t.includes('bicara')) return '🗣️';
    if (t.includes('socratic') || t.includes('pertanyaan') || t.includes('nalar')) return '💡';
    if (t.includes('target 100') || t.includes('realistis') || t.includes('skor')) return '👑';
    if (t.includes('dashboard') || t.includes('navigasi')) return '🧭';
    if (t.includes('roadmap') || t.includes('stase')) return '🗺️';
    if (t.includes('intensif')) return '⚡';
    if (t.includes('skdi')) return '📖';
    if (t.includes('tryout') || t.includes('error')) return '🛡️';
    if (t.includes('osce')) return '🩺';
    if (t.includes('asumsi')) return '📌';
    return '✨';
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-[#faf6ee] border-2 border-hogwarts-300 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-xl font-bold text-hogwarts-950 flex items-center gap-2">
              <Scroll className="w-5 h-5 text-tiffany-700" />
              Doktrin & Pedoman Belajar Ordo Healer
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-tiffany-100 text-tiffany-950 border border-tiffany-300">
              {guidelinesList.length} Pedoman 📜
            </span>
          </div>
          <p className="text-xs text-hogwarts-700 mt-1 font-medium max-w-2xl">
            Rencana ini memadukan ilmu neurosains retensi memori jangka panjang, manajemen energi dinas koas yang realistis, dan ketajaman nalar klinis. Semua doktrin dapat kamu sesuaikan bebas!
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-tiffany-600 hover:bg-tiffany-700 text-white font-serif font-bold text-xs shadow-md transition-all self-start md:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Pedoman Baru</span>
        </button>
      </div>

      {/* 4 Core Socratic Pillars Featurette */}
      <div className="p-6 rounded-3xl bg-[#faf6ee] border-2 border-hogwarts-300 space-y-3 shadow-sm">
        <h2 className="font-serif text-base font-bold text-hogwarts-950 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-tiffany-700" />
          3 Pertanyaan Nalar Sokrates untuk Tiap Penyakit (Prinsip Utama)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-1">
          <div className="p-4 bg-[#fdfcf9] rounded-2xl border-2 border-hogwarts-300 space-y-1 shadow-sm">
            <span className="font-serif font-bold text-tiffany-800 block text-xs">Pertanyaan 1:</span>
            <p className="text-hogwarts-900 font-semibold leading-relaxed">
              "Kenapa diagnosis ini yang paling tepat, dan bukan differential diagnosis (DDx) utamanya?"
            </p>
          </div>
          <div className="p-4 bg-[#fdfcf9] rounded-2xl border-2 border-hogwarts-300 space-y-1 shadow-sm">
            <span className="font-serif font-bold text-tiffany-800 block text-xs">Pertanyaan 2:</span>
            <p className="text-hogwarts-900 font-semibold leading-relaxed">
              "Temuan kunci (key clinical finding) apa dalam anamnesis/PF/lab yang menjadi pembeda definitif?"
            </p>
          </div>
          <div className="p-4 bg-[#fdfcf9] rounded-2xl border-2 border-hogwarts-300 space-y-1 shadow-sm">
            <span className="font-serif font-bold text-tiffany-800 block text-xs">Pertanyaan 3:</span>
            <p className="text-hogwarts-900 font-semibold leading-relaxed">
              "Jika 1 variabel diubah (misal: usia anak, TD anjlok, riwayat alergi), bagaimana tatalaksananya berubah?"
            </p>
          </div>
        </div>
      </div>

      {/* Search and Category Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {[
            { id: 'all', label: 'Semua Pedoman' },
            { id: 'strategi', label: '🌿 Strategi & Neurosains' },
            { id: 'navigasi', label: '🧭 Fitur & Modul' },
            { id: 'asumsi', label: '📌 Asumsi & D-Day' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                sounds.playClick();
                setFilterCategory(cat.id);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                filterCategory === cat.id
                  ? 'bg-tiffany-600 text-white shadow-sm'
                  : 'bg-[#faf6ee] text-hogwarts-900 hover:bg-hogwarts-200 dark:hover:bg-[#2b251f] border border-hogwarts-300'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-hogwarts-700" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari doktrin atau materi..."
            className="w-full pl-9 pr-8 py-2 rounded-2xl bg-[#fdfcf9] border-2 border-hogwarts-300 text-xs font-medium text-hogwarts-950 placeholder:text-hogwarts-600 focus:outline-none focus:border-tiffany-600 shadow-sm"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-hogwarts-600 hover:text-hogwarts-900"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Guidelines Card Grid */}
      {filteredGuidelines.length === 0 ? (
        <div className="p-12 text-center bg-[#faf6ee] rounded-3xl border-2 border-dashed border-hogwarts-300">
          <BookOpen className="w-12 h-12 text-hogwarts-400 mx-auto mb-2" />
          <h3 className="font-serif font-bold text-sm text-hogwarts-950">Tidak ada pedoman yang cocok</h3>
          <p className="text-xs text-hogwarts-700 mt-1">Coba ubah kata kunci pencarian atau tambahkan pedoman baru.</p>
          <button
            onClick={handleOpenAdd}
            className="mt-4 px-4 py-2 rounded-2xl bg-tiffany-600 text-white font-serif font-bold text-xs shadow-sm hover:bg-tiffany-700"
          >
            + Tambah Pedoman Sekarang
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredGuidelines.map(({ item, index }) => {
            const isCategoryHeader = !item.detail.trim();
            const icon = getGuidelineIcon(item.topic);

            if (isCategoryHeader) {
              return (
                <div
                  key={index}
                  className="col-span-1 md:col-span-2 p-4 rounded-2xl bg-[#eedec0] dark:bg-[#2d2015] border-2 border-hogwarts-400 dark:border-amber-700/60 flex items-center justify-between shadow-sm dark:shadow-md transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl p-1.5 rounded-xl bg-white/70 dark:bg-amber-950/70 border border-hogwarts-300 dark:border-amber-700/50 shadow-xs flex items-center justify-center">
                      {icon}
                    </span>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-serif font-black text-sm text-hogwarts-950 dark:text-amber-100 uppercase tracking-wider">
                        {item.topic}
                      </span>
                      <span className="text-[10px] font-sans font-bold px-2 py-0.5 rounded-full bg-amber-200/80 dark:bg-amber-900/70 text-amber-950 dark:text-amber-300 border border-amber-400/80 dark:border-amber-700/60">
                        Seksi Doktrin 📜
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(index, item)}
                      title="Edit Judul"
                      className="p-1.5 rounded-lg text-hogwarts-800 dark:text-amber-200 hover:bg-[#dfcaa8] dark:hover:bg-amber-900/60 transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(index, item.topic)}
                      title="Hapus"
                      className="p-1.5 rounded-lg text-red-700 dark:text-rose-400 hover:bg-red-100 dark:hover:bg-rose-950/60 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={index}
                className="group p-5 rounded-2xl bg-[#fdfcf9] border-2 border-hogwarts-300 shadow-sm hover:border-tiffany-500 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl p-1.5 bg-[#faf6ee] rounded-xl border border-hogwarts-300 shrink-0">
                        {icon}
                      </span>
                      <h3 className="font-serif font-bold text-sm text-hogwarts-950 leading-snug">
                        {item.topic}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleOpenEdit(index, item)}
                        className="p-1.5 rounded-lg bg-[#faf6ee] hover:bg-tiffany-100 text-tiffany-900 border border-hogwarts-300 hover:border-tiffany-400 transition-all text-xs flex items-center gap-1 font-semibold"
                        title="Edit Pedoman"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline text-[11px]">Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(index, item.topic)}
                        className="p-1.5 rounded-lg bg-[#faf6ee] hover:bg-red-100 dark:hover:bg-rose-950/60 text-red-700 dark:text-rose-400 border border-hogwarts-300 hover:border-red-300 dark:hover:border-rose-800 transition-all text-xs"
                        title="Hapus Pedoman"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-hogwarts-900 font-medium leading-relaxed mt-3 whitespace-pre-line bg-[#faf6ee]/50 dark:bg-[#181410] p-3 rounded-xl border border-hogwarts-200 dark:border-[#382f26]">
                    {item.detail}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-hogwarts-200 flex items-center justify-between text-[11px] text-hogwarts-700 font-medium">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-tiffany-600" />
                    Doktrin Resmi UKMPPD
                  </span>
                  <span className="text-hogwarts-500 font-mono">#{index + 1}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Tambah Pedoman */}
      <ModalPortal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <div className="bg-[#fdfcf9] border-2 border-hogwarts-400 rounded-3xl p-6 w-full max-w-lg shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-hogwarts-300 pb-3">
              <div className="flex items-center gap-2">
                <Scroll className="w-5 h-5 text-tiffany-700" />
                <h3 className="font-serif font-bold text-base text-hogwarts-950">
                  Tambah Doktrin & Pedoman Baru
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-hogwarts-700 hover:text-hogwarts-950 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-hogwarts-950 mb-1">
                  Judul / Topik Pedoman *
                </label>
                <input
                  type="text"
                  value={newTopic}
                  onChange={e => setNewTopic(e.target.value)}
                  placeholder="Contoh: Trik Ingat Antibiotik Empiris"
                  className="w-full px-3 py-2 rounded-xl bg-white border-2 border-hogwarts-300 text-xs text-hogwarts-950 font-medium focus:outline-none focus:border-tiffany-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-hogwarts-950 mb-1">
                  Isi Doktrin / Penjelasan Detail
                </label>
                <textarea
                  rows={4}
                  value={newDetail}
                  onChange={e => setNewDetail(e.target.value)}
                  placeholder="Tuliskan petunjuk, tips belajar, atau catatan penting..."
                  className="w-full px-3 py-2 rounded-xl bg-white border-2 border-hogwarts-300 text-xs text-hogwarts-950 font-medium focus:outline-none focus:border-tiffany-600 resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-hogwarts-300">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#faf6ee] text-hogwarts-900 font-bold text-xs border border-hogwarts-300 hover:bg-hogwarts-200 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSaveAdd}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-tiffany-600 hover:bg-tiffany-700 text-white font-serif font-bold text-xs shadow-sm transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Doktrin</span>
              </button>
            </div>
          </div>
      </ModalPortal>

      {/* Modal Edit Pedoman */}
      <ModalPortal isOpen={editingIndex !== null} onClose={() => setEditingIndex(null)}>
        {editingIndex !== null && (
          <div className="bg-[#fdfcf9] border-2 border-hogwarts-400 rounded-3xl p-6 w-full max-w-lg shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-hogwarts-300 pb-3">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-tiffany-700" />
                <h3 className="font-serif font-bold text-base text-hogwarts-950">
                  Edit Pedoman #{editingIndex + 1}
                </h3>
              </div>
              <button
                onClick={() => setEditingIndex(null)}
                className="text-hogwarts-700 hover:text-hogwarts-950 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-hogwarts-950 mb-1">
                  Judul / Topik Pedoman *
                </label>
                <input
                  type="text"
                  value={editTopic}
                  onChange={e => setEditTopic(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border-2 border-hogwarts-300 text-xs text-hogwarts-950 font-medium focus:outline-none focus:border-tiffany-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-hogwarts-950 mb-1">
                  Isi Doktrin / Penjelasan Detail
                </label>
                <textarea
                  rows={4}
                  value={editDetail}
                  onChange={e => setEditDetail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border-2 border-hogwarts-300 text-xs text-hogwarts-950 font-medium focus:outline-none focus:border-tiffany-600 resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-hogwarts-300">
              <button
                onClick={() => setEditingIndex(null)}
                className="px-4 py-2 rounded-xl bg-[#faf6ee] text-hogwarts-900 font-bold text-xs border border-hogwarts-300 hover:bg-hogwarts-200 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSaveEdit}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-tiffany-600 hover:bg-tiffany-700 text-white font-serif font-bold text-xs shadow-sm transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Perubahan</span>
              </button>
            </div>
          </div>
        )}
      </ModalPortal>
    </div>
  );
};
