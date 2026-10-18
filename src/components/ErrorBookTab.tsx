import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ErrorBookItem, ErrorType } from '../types';
import {
  BookOpen,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Clock,
  Trash2,
  Edit3,
  Search,
  Filter,
  X,
  Save,
  Sparkles,
  HelpCircle,
  Scroll,
  RefreshCw
} from 'lucide-react';
import { addDaysToDateStr, formatDateIndo } from '../utils/dateHelper';
import { ModalPortal } from './ModalPortal';

export const ErrorBookTab: React.FC = () => {
  const { state, addErrorEntry, updateErrorEntry, deleteErrorEntry } = useApp();

  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [filterReviewDue, setFilterReviewDue] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<ErrorBookItem | null>(null);

  const todayStr = new Date().toISOString().slice(0, 10);

  // New entry form state
  const [formDate, setFormDate] = useState(todayStr);
  const [formSource, setFormSource] = useState('Tryout #1');
  const [formSystem, setFormSystem] = useState(state.skdiSystems[0]?.systemName || 'Kardiovaskuler');
  const [formTopic, setFormTopic] = useState('');
  const [formCase, setFormCase] = useState('');
  const [formMyAnswer, setFormMyAnswer] = useState('');
  const [formCorrectAnswer, setFormCorrectAnswer] = useState('');
  const [formErrorType, setFormErrorType] = useState<ErrorType>('Salah baca');
  const [formReason, setFormReason] = useState('');

  const errorTypes: { type: ErrorType; emoji: string }[] = [
    { type: 'Salah baca', emoji: '👀' },
    { type: 'Lupa / hafalan', emoji: '💤' },
    { type: 'Gegabah', emoji: '⚡' },
    { type: 'Tidak tahu', emoji: '❓' },
    { type: 'Overthinking', emoji: '🌀' }
  ];

  const typeCounts: Record<string, number> = {};
  errorTypes.forEach(t => { typeCounts[t.type] = 0; });
  state.errorEntries.forEach(e => {
    typeCounts[e.errorType] = (typeCounts[e.errorType] || 0) + 1;
  });
  const totalEntries = state.errorEntries.length || 1;

  const handleCreate = () => {
    if (!formTopic.trim() || !formCase.trim()) {
      alert('Mohon isi topik dan inti kasus soal!');
      return;
    }

    addErrorEntry({
      date: formDate,
      source: formSource,
      system: formSystem,
      topic: formTopic,
      caseSummary: formCase,
      myAnswer: formMyAnswer,
      correctAnswer: formCorrectAnswer,
      errorType: formErrorType,
      reasonWhy: formReason,
      review1Date: addDaysToDateStr(formDate, 1),
      review7Date: addDaysToDateStr(formDate, 7),
      review30Date: addDaysToDateStr(formDate, 30)
    });

    setFormTopic('');
    setFormCase('');
    setFormMyAnswer('');
    setFormCorrectAnswer('');
    setFormReason('');
    setIsAddModalOpen(false);
  };

  const handleSaveEdit = () => {
    if (editingEntry) {
      updateErrorEntry(editingEntry.id, editingEntry);
      setEditingEntry(null);
    }
  };

  const filteredEntries = state.errorEntries.filter(e => {
    if (selectedType !== 'ALL' && e.errorType !== selectedType) return false;
    if (filterReviewDue) {
      const r1Due = e.review1Date <= todayStr && !e.review1Done;
      const r7Due = e.review7Date <= todayStr && !e.review7Done;
      const r30Due = e.review30Date <= todayStr && !e.review30Done;
      if (!r1Due && !r7Due && !r30Due) return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      const match =
        e.topic.toLowerCase().includes(q) ||
        e.caseSummary.toLowerCase().includes(q) ||
        e.system.toLowerCase().includes(q) ||
        e.source.toLowerCase().includes(q) ||
        e.reasonWhy.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-br from-[#f8f3ea] via-[#faf5ec] to-[#f0e7d5] dark:from-[#1c1713] dark:via-[#181410] dark:to-[#120f0d] border border-hogwarts-300/80 dark:border-[#382f25] rounded-3xl p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-xl font-bold text-hogwarts-950 dark:text-hogwarts-50 flex items-center gap-2">
              <Scroll className="w-5 h-5 text-tiffany-700 dark:text-tiffany-400" />
              Grimoire Error (Buku Bedah Soal Salah)
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-tiffany-100 dark:bg-tiffany-950/50 text-tiffany-950 dark:text-tiffany-300 border border-tiffany-300 dark:border-tiffany-800">
              Evaluasi Berulang 📜
            </span>
          </div>
          <p className="text-xs text-hogwarts-700 dark:text-hogwarts-300 mt-1 font-medium">
            Ubah soal salah jadi mutiara pemahaman! Maksimal 15 menit per telaah soal. Tulis evaluasi dengan <span className="font-bold text-tiffany-900 dark:text-tiffany-300">kata-katamu sendiri</span>.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl bg-tiffany-200 hover:bg-tiffany-300 text-tiffany-950 border-2 border-tiffany-700 shadow-sm transition active:scale-95 self-start md:self-center"
        >
          <Plus className="w-4 h-4" />
          Catat Soal Salah (+5 XP)
        </button>
      </div>

      {/* Error Monster Distribution */}
      <div className="bg-[#fdfcf9] dark:bg-[#1c1814] border-2 border-hogwarts-300 dark:border-[#382f25] rounded-3xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-hogwarts-900 dark:text-hogwarts-200 uppercase tracking-wider flex items-center gap-1.5 font-serif">
            <span>🔍</span> Klasifikasi Pola Kesalahan ({state.errorEntries.length} Total Soal)
          </h2>
          <span className="text-[11px] text-hogwarts-700 dark:text-hogwarts-400 font-medium">
            Koreksi tipe kesalahan dengan porsi terbanyak
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1">
          {errorTypes.map(({ type, emoji }) => {
            const count = typeCounts[type] || 0;
            const pct = Math.round((count / totalEntries) * 100);

            return (
              <div
                key={type}
                onClick={() => setSelectedType(selectedType === type ? 'ALL' : type)}
                className={`p-3 rounded-2xl border-2 text-center transition cursor-pointer ${
                  selectedType === type
                    ? 'border-tiffany-600 bg-tiffany-100 dark:bg-tiffany-950/40 text-tiffany-950 dark:text-tiffany-200 shadow-sm ring-2 ring-tiffany-400/40'
                    : 'border-hogwarts-300 dark:border-[#382f25] bg-[#faf6ee] dark:bg-[#201a15] hover:border-tiffany-500'
                }`}
              >
                <div className="text-2xl mb-0.5">{emoji}</div>
                <div className="text-xs font-serif font-bold text-hogwarts-950 dark:text-hogwarts-100">
                  {type}
                </div>
                <div className="font-serif text-xl font-bold text-hogwarts-950 dark:text-hogwarts-100 my-0.5">
                  {count}
                </div>
                <div className="text-[10px] text-hogwarts-700 dark:text-hogwarts-400 font-bold">
                  {pct}% dari total
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-[#fdfcf9] dark:bg-[#1c1814] border-2 border-hogwarts-300 dark:border-[#382f25] rounded-2xl p-4 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-hogwarts-500" />
          <input
            type="text"
            placeholder="Cari kasus, topik, atau alasan error..."
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
            <option value="ALL">Semua Pola Error</option>
            {errorTypes.map(t => (
              <option key={t.type} value={t.type}>{t.emoji} {t.type}</option>
            ))}
          </select>

          <button
            onClick={() => setFilterReviewDue(!filterReviewDue)}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl border-2 transition flex items-center gap-1.5 active:scale-95 ${
              filterReviewDue
                ? 'bg-tiffany-200 text-tiffany-950 border-tiffany-700 shadow-sm'
                : 'border-hogwarts-300 dark:border-[#382f25] bg-hogwarts-50 dark:bg-[#25201b] text-hogwarts-900 dark:text-hogwarts-200 hover:bg-hogwarts-100 dark:hover:bg-[#2e2620]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Jatuh Tempo Review ⏳
          </button>
        </div>
      </div>

      {/* Entries List Cards */}
      <div className="space-y-4">
        {filteredEntries.length === 0 ? (
          <div className="p-12 text-center bg-[#fdfcf9] dark:bg-[#1c1814] rounded-3xl border-2 border-hogwarts-300 dark:border-[#382f25] text-hogwarts-600 dark:text-hogwarts-400 shadow-sm">
            <span className="text-4xl block mb-2">📜</span>
            <p className="font-serif text-sm font-bold text-hogwarts-950 dark:text-hogwarts-100">
              {search || selectedType !== 'ALL' || filterReviewDue
                ? 'Tidak ada entri catatan yang cocok dengan filter.'
                : 'Belum ada entri catatan soal salah.'}
            </p>
            <p className="text-xs text-hogwarts-700 dark:text-hogwarts-400 mt-1 max-w-md mx-auto">
              {search || selectedType !== 'ALL' || filterReviewDue
                ? 'Coba ubah kata kunci atau bersihkan filter untuk melihat semua catatan soal.'
                : 'Gunakan tombol "Catat Soal Salah" di atas untuk menambahkan catatan pertamamu.'}
            </p>
            {(search || selectedType !== 'ALL' || filterReviewDue) && (
              <button
                onClick={() => {
                  setSearch('');
                  setSelectedType('ALL');
                  setFilterReviewDue(false);
                }}
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-hogwarts-800 dark:text-hogwarts-200 bg-hogwarts-100 dark:bg-[#28211b] hover:bg-hogwarts-200 dark:hover:bg-[#342b23] border border-hogwarts-300 dark:border-[#382f25] rounded-xl transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reset Semua Filter & Pencarian
              </button>
            )}
          </div>
        ) : (
          filteredEntries.map((err) => (
            <div
              key={err.id}
              className="p-5 rounded-2xl border-2 border-hogwarts-300 dark:border-[#382f25] bg-[#fdfcf9] dark:bg-[#1c1814] shadow-sm space-y-4 hover:border-tiffany-600 dark:hover:border-tiffany-500 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-hogwarts-200 dark:border-[#2e261f] pb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-serif font-bold text-xs text-tiffany-800 dark:text-tiffany-400">#{err.no}</span>
                  <span className="font-serif font-bold text-base text-hogwarts-950 dark:text-hogwarts-50">{err.topic}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-hogwarts-100 dark:bg-[#25201b] text-hogwarts-900 dark:text-hogwarts-200 border border-hogwarts-300 dark:border-[#382f25]">
                    {err.system}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/40 text-amber-950 dark:text-amber-300 border border-amber-400 dark:border-amber-700">
                    {err.errorType}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-hogwarts-700 dark:text-hogwarts-400 font-medium">
                  <span>{err.source} · {formatDateIndo(err.date)}</span>
                  <button
                    onClick={() => setEditingEntry({ ...err })}
                    className="p-1 text-hogwarts-600 dark:text-hogwarts-400 hover:text-tiffany-700 dark:hover:text-tiffany-400 rounded-lg hover:bg-hogwarts-100 dark:hover:bg-[#28211b]"
                    title="Edit entri"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Hapus entri soal "${err.topic}"?`)) {
                        deleteErrorEntry(err.id);
                      }
                    }}
                    className="p-1 text-hogwarts-600 dark:text-hogwarts-400 hover:text-rose-700 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30"
                    title="Hapus entri"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Case vignette & Answers */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="md:col-span-1 p-3.5 rounded-xl bg-hogwarts-50 dark:bg-[#231d17] border-2 border-hogwarts-200 dark:border-[#352c22] space-y-1.5">
                  <div className="text-[10px] font-bold text-hogwarts-700 dark:text-hogwarts-400 uppercase font-serif">Inti Kasus (1 Baris)</div>
                  <p className="font-semibold text-hogwarts-950 dark:text-hogwarts-100 leading-relaxed">
                    {err.caseSummary}
                  </p>
                  <div className="pt-2 border-t border-hogwarts-200 dark:border-[#352c22] flex flex-col gap-1">
                    <div>
                      <span className="text-hogwarts-700 dark:text-hogwarts-400 text-[10px] font-bold">Jawabanku: </span>
                      <span className="font-bold text-rose-700 dark:text-rose-400 line-through">{err.myAnswer}</span>
                    </div>
                    <div>
                      <span className="text-hogwarts-700 dark:text-hogwarts-400 text-[10px] font-bold">Kunci Benar: </span>
                      <span className="font-bold text-emerald-900 dark:text-emerald-400">{err.correctAnswer}</span>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 p-3.5 rounded-xl bg-tiffany-50/60 dark:bg-tiffany-950/20 border-2 border-tiffany-200 dark:border-tiffany-900/40 space-y-1">
                  <div className="text-[10px] font-bold text-tiffany-950 dark:text-tiffany-300 uppercase flex items-center gap-1 font-serif">
                    <Sparkles className="w-3 h-3 text-tiffany-700 dark:text-tiffany-400" />
                    Kenapa Benar & Kenapa Distraktor Salah? (Bahasamu Sendiri)
                  </div>
                  <p className="text-hogwarts-950 dark:text-hogwarts-100 leading-relaxed whitespace-pre-wrap font-medium">
                    {err.reasonWhy}
                  </p>
                </div>
              </div>

              {/* Spaced Repetition Stepper */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs border-t-2 border-hogwarts-200 dark:border-[#2e261f]">
                <span className="text-[11px] font-serif font-bold text-hogwarts-800 dark:text-hogwarts-200 uppercase">Spaced Repetition Review:</span>

                <div className="flex items-center gap-2.5">
                  {/* Review +1 */}
                  <button
                    onClick={() => updateErrorEntry(err.id, { review1Done: !err.review1Done })}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-xl border-2 text-[11px] font-bold transition active:scale-95 ${
                      err.review1Done
                        ? 'border-emerald-500 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-950 dark:text-emerald-300'
                        : 'border-hogwarts-300 dark:border-[#382f25] bg-hogwarts-50 dark:bg-[#25201b] text-hogwarts-800 dark:text-hogwarts-300 hover:bg-hogwarts-100 dark:hover:bg-[#2e2620]'
                    }`}
                  >
                    <CheckCircle2 className={`w-3.5 h-3.5 ${err.review1Done ? 'text-emerald-800 dark:text-emerald-400' : 'text-hogwarts-400'}`} />
                    <span>+1 Hari ({formatDateIndo(err.review1Date)})</span>
                  </button>

                  {/* Review +7 */}
                  <button
                    onClick={() => updateErrorEntry(err.id, { review7Done: !err.review7Done })}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-xl border-2 text-[11px] font-bold transition active:scale-95 ${
                      err.review7Done
                        ? 'border-emerald-500 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-950 dark:text-emerald-300'
                        : 'border-hogwarts-300 dark:border-[#382f25] bg-hogwarts-50 dark:bg-[#25201b] text-hogwarts-800 dark:text-hogwarts-300 hover:bg-hogwarts-100 dark:hover:bg-[#2e2620]'
                    }`}
                  >
                    <CheckCircle2 className={`w-3.5 h-3.5 ${err.review7Done ? 'text-emerald-800 dark:text-emerald-400' : 'text-hogwarts-400'}`} />
                    <span>+7 Hari ({formatDateIndo(err.review7Date)})</span>
                  </button>

                  {/* Review +30 */}
                  <button
                    onClick={() => updateErrorEntry(err.id, { review30Done: !err.review30Done })}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-xl border-2 text-[11px] font-bold transition active:scale-95 ${
                      err.review30Done
                        ? 'border-emerald-500 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-950 dark:text-emerald-300'
                        : 'border-hogwarts-300 dark:border-[#382f25] bg-hogwarts-50 dark:bg-[#25201b] text-hogwarts-800 dark:text-hogwarts-300 hover:bg-hogwarts-100 dark:hover:bg-[#2e2620]'
                    }`}
                  >
                    <CheckCircle2 className={`w-3.5 h-3.5 ${err.review30Done ? 'text-emerald-800 dark:text-emerald-400' : 'text-hogwarts-400'}`} />
                    <span>+30 Hari ({formatDateIndo(err.review30Date)})</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Modal */}
      <ModalPortal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <div className="bg-[#fdfcf9] dark:bg-[#1c1814] border-2 border-hogwarts-300 dark:border-[#382f25] rounded-3xl w-full max-w-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b-2 border-hogwarts-200 dark:border-[#2e261f] pb-3">
              <h3 className="font-serif text-base font-bold text-hogwarts-950 dark:text-hogwarts-50 flex items-center gap-2">
                <Scroll className="w-4 h-4 text-tiffany-700 dark:text-tiffany-400" />
                Catat Soal Salah Baru
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-hogwarts-600 dark:text-hogwarts-400 hover:text-hogwarts-900 dark:hover:text-hogwarts-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-hogwarts-900 dark:text-hogwarts-200 mb-1 font-bold">Tanggal</label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border-2 border-hogwarts-300 dark:border-[#382f25] bg-white dark:bg-[#25201b] text-hogwarts-950 dark:text-hogwarts-100 font-medium focus:outline-none focus:ring-2 focus:ring-tiffany-600"
                  />
                </div>
                <div>
                  <label className="block text-hogwarts-900 dark:text-hogwarts-200 mb-1 font-bold">Sumber Soal</label>
                  <input
                    type="text"
                    value={formSource}
                    onChange={(e) => setFormSource(e.target.value)}
                    placeholder="Contoh: Tryout #1"
                    className="w-full px-3 py-1.5 rounded-xl border-2 border-hogwarts-300 dark:border-[#382f25] bg-white dark:bg-[#25201b] text-hogwarts-950 dark:text-hogwarts-100 font-medium focus:outline-none focus:ring-2 focus:ring-tiffany-600"
                  />
                </div>
                <div>
                  <label className="block text-hogwarts-900 dark:text-hogwarts-200 mb-1 font-bold">Tipe Kesalahan</label>
                  <select
                    value={formErrorType}
                    onChange={(e) => setFormErrorType(e.target.value as ErrorType)}
                    className="w-full px-3 py-1.5 rounded-xl border-2 border-hogwarts-300 dark:border-[#382f25] bg-white dark:bg-[#25201b] text-hogwarts-950 dark:text-hogwarts-100 font-bold focus:outline-none focus:ring-2 focus:ring-tiffany-600"
                  >
                    {errorTypes.map(t => (
                      <option key={t.type} value={t.type}>{t.emoji} {t.type}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-hogwarts-900 dark:text-hogwarts-200 mb-1 font-bold">Sistem SKDI</label>
                  <select
                    value={formSystem}
                    onChange={(e) => setFormSystem(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border-2 border-hogwarts-300 dark:border-[#382f25] bg-white dark:bg-[#25201b] text-hogwarts-950 dark:text-hogwarts-100 font-bold focus:outline-none focus:ring-2 focus:ring-tiffany-600"
                  >
                    {state.skdiSystems.map(s => (
                      <option key={s.no} value={s.systemName}>{s.systemName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-hogwarts-900 dark:text-hogwarts-200 mb-1 font-bold">Topik / Diagnosis</label>
                  <input
                    type="text"
                    value={formTopic}
                    onChange={(e) => setFormTopic(e.target.value)}
                    placeholder="Contoh: HT Emergensi"
                    className="w-full px-3 py-1.5 rounded-xl border-2 border-hogwarts-300 dark:border-[#382f25] bg-white dark:bg-[#25201b] text-hogwarts-950 dark:text-hogwarts-100 font-medium focus:outline-none focus:ring-2 focus:ring-tiffany-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-hogwarts-900 dark:text-hogwarts-200 mb-1 font-bold">Inti Kasus (1 Baris Ringkas)</label>
                <input
                  type="text"
                  value={formCase}
                  onChange={(e) => setFormCase(e.target.value)}
                  placeholder="Contoh: Pria 60 th, TD 220/130 + nyeri dada hebat"
                  className="w-full px-3 py-1.5 rounded-xl border-2 border-hogwarts-300 dark:border-[#382f25] bg-white dark:bg-[#25201b] text-hogwarts-950 dark:text-hogwarts-100 font-medium focus:outline-none focus:ring-2 focus:ring-tiffany-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-rose-700 dark:text-rose-400 mb-1 font-bold">Jawabanku (Salah)</label>
                  <input
                    type="text"
                    value={formMyAnswer}
                    onChange={(e) => setFormMyAnswer(e.target.value)}
                    placeholder="Contoh: Captopril"
                    className="w-full px-3 py-1.5 rounded-xl border-2 border-rose-300 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/30 text-rose-950 dark:text-rose-200 font-bold focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-emerald-900 dark:text-emerald-400 mb-1 font-bold">Kunci Benar</label>
                  <input
                    type="text"
                    value={formCorrectAnswer}
                    onChange={(e) => setFormCorrectAnswer(e.target.value)}
                    placeholder="Contoh: Labetalol IV"
                    className="w-full px-3 py-1.5 rounded-xl border-2 border-emerald-300 dark:border-emerald-900/60 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-200 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-hogwarts-900 dark:text-hogwarts-200 mb-1 font-bold">
                  Kenapa Jawaban Benar & Kenapa Distraktor Salah? (Bahasamu Sendiri)
                </label>
                <textarea
                  rows={3}
                  value={formReason}
                  onChange={(e) => setFormReason(e.target.value)}
                  placeholder="Tuliskan evaluasi klinis seolah sedang menerangkan ke rekan sesama dokter..."
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
                onClick={handleCreate}
                className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-tiffany-950 bg-tiffany-200 hover:bg-tiffany-300 border-2 border-tiffany-700 rounded-xl shadow-sm transition active:scale-95"
              >
                <Save className="w-3.5 h-3.5" />
                Simpan ke Grimoire (+5 XP)
              </button>
            </div>
          </div>
      </ModalPortal>

      {/* Edit Entry Modal */}
      <ModalPortal isOpen={!!editingEntry} onClose={() => setEditingEntry(null)}>
        {editingEntry && (
          <div className="bg-[#fdfcf9] dark:bg-[#1c1814] border-2 border-hogwarts-300 dark:border-[#382f25] rounded-3xl w-full max-w-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b-2 border-hogwarts-200 dark:border-[#2e261f] pb-3">
              <h3 className="font-serif text-base font-bold text-hogwarts-950 dark:text-hogwarts-50 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-tiffany-700 dark:text-tiffany-400" />
                Edit Catatan Soal #{editingEntry.no}
              </h3>
              <button
                onClick={() => setEditingEntry(null)}
                className="p-1 text-hogwarts-600 dark:text-hogwarts-400 hover:text-hogwarts-900 dark:hover:text-hogwarts-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-hogwarts-900 dark:text-hogwarts-200 mb-1 font-bold">Tanggal</label>
                  <input
                    type="date"
                    value={editingEntry.date}
                    onChange={(e) => setEditingEntry({ ...editingEntry, date: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl border-2 border-hogwarts-300 dark:border-[#382f25] bg-white dark:bg-[#25201b] text-hogwarts-950 dark:text-hogwarts-100 font-medium focus:outline-none focus:ring-2 focus:ring-tiffany-600"
                  />
                </div>
                <div>
                  <label className="block text-hogwarts-900 dark:text-hogwarts-200 mb-1 font-bold">Sumber Soal</label>
                  <input
                    type="text"
                    value={editingEntry.source}
                    onChange={(e) => setEditingEntry({ ...editingEntry, source: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl border-2 border-hogwarts-300 dark:border-[#382f25] bg-white dark:bg-[#25201b] text-hogwarts-950 dark:text-hogwarts-100 font-medium focus:outline-none focus:ring-2 focus:ring-tiffany-600"
                  />
                </div>
                <div>
                  <label className="block text-hogwarts-900 dark:text-hogwarts-200 mb-1 font-bold">Tipe Kesalahan</label>
                  <select
                    value={editingEntry.errorType}
                    onChange={(e) => setEditingEntry({ ...editingEntry, errorType: e.target.value as ErrorType })}
                    className="w-full px-3 py-1.5 rounded-xl border-2 border-hogwarts-300 dark:border-[#382f25] bg-white dark:bg-[#25201b] text-hogwarts-950 dark:text-hogwarts-100 font-bold focus:outline-none focus:ring-2 focus:ring-tiffany-600"
                  >
                    {errorTypes.map(t => (
                      <option key={t.type} value={t.type}>{t.emoji} {t.type}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-hogwarts-900 dark:text-hogwarts-200 mb-1 font-bold">Sistem SKDI</label>
                  <select
                    value={editingEntry.system}
                    onChange={(e) => setEditingEntry({ ...editingEntry, system: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl border-2 border-hogwarts-300 dark:border-[#382f25] bg-white dark:bg-[#25201b] text-hogwarts-950 dark:text-hogwarts-100 font-bold focus:outline-none focus:ring-2 focus:ring-tiffany-600"
                  >
                    {state.skdiSystems.map(s => (
                      <option key={s.no} value={s.systemName}>{s.systemName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-hogwarts-900 dark:text-hogwarts-200 mb-1 font-bold">Topik / Diagnosis</label>
                  <input
                    type="text"
                    value={editingEntry.topic}
                    onChange={(e) => setEditingEntry({ ...editingEntry, topic: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl border-2 border-hogwarts-300 dark:border-[#382f25] bg-white dark:bg-[#25201b] text-hogwarts-950 dark:text-hogwarts-100 font-medium focus:outline-none focus:ring-2 focus:ring-tiffany-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-hogwarts-900 dark:text-hogwarts-200 mb-1 font-bold">Inti Kasus (1 Baris Ringkas)</label>
                <input
                  type="text"
                  value={editingEntry.caseSummary}
                  onChange={(e) => setEditingEntry({ ...editingEntry, caseSummary: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-xl border-2 border-hogwarts-300 dark:border-[#382f25] bg-white dark:bg-[#25201b] text-hogwarts-950 dark:text-hogwarts-100 font-medium focus:outline-none focus:ring-2 focus:ring-tiffany-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-rose-700 dark:text-rose-400 mb-1 font-bold">Jawabanku (Salah)</label>
                  <input
                    type="text"
                    value={editingEntry.myAnswer}
                    onChange={(e) => setEditingEntry({ ...editingEntry, myAnswer: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl border-2 border-rose-300 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/30 text-rose-950 dark:text-rose-200 font-bold focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-emerald-900 dark:text-emerald-400 mb-1 font-bold">Kunci Benar</label>
                  <input
                    type="text"
                    value={editingEntry.correctAnswer}
                    onChange={(e) => setEditingEntry({ ...editingEntry, correctAnswer: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl border-2 border-emerald-300 dark:border-emerald-900/60 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-200 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-hogwarts-900 dark:text-hogwarts-200 mb-1 font-bold">
                  Kenapa Jawaban Benar & Kenapa Distraktor Salah?
                </label>
                <textarea
                  rows={3}
                  value={editingEntry.reasonWhy}
                  onChange={(e) => setEditingEntry({ ...editingEntry, reasonWhy: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-xl border-2 border-hogwarts-300 dark:border-[#382f25] bg-white dark:bg-[#25201b] text-hogwarts-950 dark:text-hogwarts-100 font-medium focus:outline-none focus:ring-2 focus:ring-tiffany-600"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t-2 border-hogwarts-200 dark:border-[#2e261f]">
              <button
                onClick={() => setEditingEntry(null)}
                className="px-4 py-1.5 text-xs font-bold text-hogwarts-800 dark:text-hogwarts-300 hover:bg-hogwarts-100 dark:hover:bg-[#28211b] border border-hogwarts-300 dark:border-[#382f25] rounded-xl transition"
              >
                Batal
              </button>
              <button
                onClick={handleSaveEdit}
                className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-tiffany-950 bg-tiffany-200 hover:bg-tiffany-300 border-2 border-tiffany-700 rounded-xl shadow-sm transition active:scale-95"
              >
                <Save className="w-3.5 h-3.5" />
                Simpan Perubahan
              </button>
            </div>
          </div>
        )}
      </ModalPortal>
    </div>
  );
};
