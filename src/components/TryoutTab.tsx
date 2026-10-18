import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TryoutItem } from '../types';
import {
  Target,
  Trophy,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  Edit3,
  X,
  Save,
  Sparkles,
  Crown,
  Scroll,
  Calendar,
  Sword,
  ShieldAlert,
  Flame,
  Award,
  Plus,
  Trash2
} from 'lucide-react';
import { formatDateIndo } from '../utils/dateHelper';
import { sounds } from '../utils/soundHelper';
import confetti from 'canvas-confetti';
import { ModalPortal } from './ModalPortal';

const BOSS_MONSTERS: Record<number, { name: string; avatar: string }> = {
  1: { name: 'Pra-Stase Guardian', avatar: '🐺' },
  2: { name: 'Basilisk Interna', avatar: '🐍' },
  3: { name: 'Chimera Paediatrica', avatar: '🦁' },
  4: { name: 'Gryphon Chirurgica', avatar: '🦅' },
  5: { name: 'Wyvern Minor Realm', avatar: '🐉' },
  6: { name: 'Golem Komprehensif', avatar: '🧌' },
  7: { name: 'Lich Mid-Intensif', avatar: '💀' },
  8: { name: 'Vampire Overlord H-30', avatar: '🧛' },
  9: { name: 'Archmage Trial H-14', avatar: '🔮' },
  10: { name: 'The Grand UKMPPD Dragon', avatar: '👑' },
};

export const TryoutTab: React.FC = () => {
  const { state, updateTryout, addTryout, deleteTryout } = useApp();
  const [editingTryout, setEditingTryout] = useState<TryoutItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New TO form state
  const [newDate, setNewDate] = useState('');
  const [newContext, setNewContext] = useState('');
  const [newSource, setNewSource] = useState('Mandiri');
  const [newQuestions, setNewQuestions] = useState(150);
  const [newTarget, setNewTarget] = useState(75);
  const [newActual, setNewActual] = useState<number | null>(null);
  const [newWeakTopics, setNewWeakTopics] = useState('');
  const [newNotes, setNewNotes] = useState('');

  const scoredTryouts = state.tryouts.filter(t => t.actualScore !== null && t.actualScore !== undefined);
  const bestScore = scoredTryouts.length > 0 ? Math.max(...scoredTryouts.map(t => t.actualScore!)) : null;
  const totalBosses = state.tryouts.length;

  const handleSaveTryoutEdit = () => {
    if (editingTryout) {
      updateTryout(editingTryout.no, editingTryout);
      sounds.playClick();
      if (editingTryout.actualScore !== null && editingTryout.actualScore !== undefined) {
        if (editingTryout.actualScore >= editingTryout.targetScore) {
          sounds.playLevelUp();
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        } else {
          sounds.playQuestComplete();
        }
      }
      setEditingTryout(null);
    }
  };

  const handleCreateTryout = () => {
    if (!newContext.trim()) {
      alert('Mohon isi nama konteks / judul tryout!');
      return;
    }

    addTryout({
      plannedDate: newDate || new Date().toISOString().slice(0, 10),
      context: newContext,
      source: newSource || 'Mandiri',
      questionsCount: newQuestions,
      targetScore: newTarget,
      actualScore: newActual,
      weakTopics: newWeakTopics,
      notes: newNotes
    });

    sounds.playLevelUp();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });

    setNewContext('');
    setNewWeakTopics('');
    setNewNotes('');
    setNewActual(null);
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-br from-[#f8f3ea] via-[#faf5ec] to-[#f0e7d5] dark:from-[#1c1713] dark:via-[#181410] dark:to-[#120f0d] border border-hogwarts-300/80 dark:border-[#382f25] rounded-3xl p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-xl font-bold text-hogwarts-950 dark:text-hogwarts-50 flex items-center gap-2">
              <Target className="w-5 h-5 text-tiffany-700 dark:text-tiffany-400" />
              Arena {totalBosses} Boss Raids: Tryout UKMPPD
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-tiffany-100 dark:bg-tiffany-950/50 text-tiffany-950 dark:text-tiffany-300 border border-tiffany-300 dark:border-tiffany-800">
              Skala 0 – 100 ⚔️
            </span>
          </div>
          <p className="text-xs text-hogwarts-800 dark:text-hogwarts-300 mt-1 font-medium">
            Taklukkan monster bos bertahap dari target <span className="font-bold text-hogwarts-950 dark:text-hogwarts-100">60 hingga 96+</span>.
            Target Ideal CBT: <span className="font-bold text-tiffany-900 dark:text-tiffany-400">{state.dashboard.targetCBT}</span> (Batas aman kelulusan: <span className="font-bold text-hogwarts-900 dark:text-hogwarts-200">{state.dashboard.batasAman}</span>).
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => { sounds.playClick(); setIsAddModalOpen(true); }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-tiffany-200 hover:bg-tiffany-300 text-tiffany-950 border-2 border-tiffany-700 shadow-xs transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Tambah Boss Raid
          </button>

          <div className="p-3 rounded-2xl bg-[#fdfcf9] dark:bg-[#1c1814] border-2 border-hogwarts-300 dark:border-[#383028] text-center min-w-[100px] shadow-xs">
            <div className="text-[10px] text-hogwarts-700 dark:text-hogwarts-400 font-bold uppercase font-serif">Boss Ditaklukkan</div>
            <div className="font-serif text-sm font-bold text-hogwarts-950 dark:text-hogwarts-100">
              {scoredTryouts.length} / {totalBosses} Raid
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-[#fdfcf9] dark:bg-[#1c1814] border-2 border-hogwarts-300 dark:border-[#383028] text-center min-w-[100px] shadow-xs">
            <div className="text-[10px] text-amber-800 dark:text-amber-400 font-bold uppercase font-serif">Skor Tertinggi</div>
            <div className="font-serif text-sm font-bold text-amber-900 dark:text-amber-300 flex items-center justify-center gap-1">
              <span>👑</span> {bestScore !== null ? bestScore : '-'}
            </div>
          </div>
        </div>
      </div>

      {/* Visual Arena Boss Mini Bar */}
      <div className="bg-[#fdfcf9] dark:bg-[#1c1814] border-2 border-hogwarts-300 dark:border-[#383028] rounded-3xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-sm font-bold text-hogwarts-950 dark:text-hogwarts-100 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-tiffany-700 dark:text-tiffany-400" />
            Milestone Lintas {totalBosses} Boss Tryout
          </h2>
          <span className="text-xs text-hogwarts-700 dark:text-hogwarts-400 font-medium">
            Klik monster untuk input skor
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2.5 pt-1">
          {state.tryouts.map((t) => {
            const hasScore = t.actualScore !== null && t.actualScore !== undefined;
            const diff = hasScore ? t.actualScore! - t.targetScore : null;
            const boss = BOSS_MONSTERS[t.no] || { name: 'Boss', avatar: '🐉' };

            return (
              <div
                key={t.no}
                onClick={() => { sounds.playClick(); setEditingTryout({ ...t }); }}
                className={`p-2.5 rounded-2xl border-2 text-center transition cursor-pointer active:scale-95 ${
                  hasScore
                    ? t.actualScore! >= 90
                      ? 'border-emerald-500 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-950 dark:text-emerald-200 shadow-xs'
                      : t.actualScore! >= t.targetScore
                      ? 'border-tiffany-500 bg-tiffany-100 dark:bg-tiffany-950/80 text-tiffany-950 dark:text-tiffany-200 shadow-xs'
                      : 'border-rose-400 dark:border-rose-600/80 bg-rose-50 dark:bg-rose-950/80 text-rose-950 dark:text-rose-200 shadow-xs'
                    : 'border-hogwarts-300 dark:border-[#383028] bg-[#faf6ee] dark:bg-[#1a1612] hover:border-tiffany-500'
                }`}
              >
                <div className="text-lg mb-0.5">{boss.avatar}</div>
                <div className="text-[10px] font-bold text-hogwarts-800 dark:text-hogwarts-300 font-serif">
                  #{t.no}
                </div>
                <div className="font-serif text-base font-bold text-hogwarts-950 my-0.5">
                  {hasScore ? t.actualScore : '—'}
                </div>
                <div className="text-[9px] text-hogwarts-700 dark:text-hogwarts-300 font-semibold">
                  Tgt: {t.targetScore}
                </div>
                {hasScore && diff !== null && (
                  <div className={`text-[9px] font-extrabold mt-0.5 ${
                    diff >= 0 ? 'text-emerald-900 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'
                  }`}>
                    {diff >= 0 ? `+${diff.toFixed(1)}` : diff.toFixed(1)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Boss Raid Encounter Cards */}
      {state.tryouts.length === 0 ? (
        <div className="p-12 text-center bg-[#fdfcf9] dark:bg-[#1c1814] rounded-3xl border-2 border-hogwarts-300 dark:border-[#383028] text-hogwarts-600 dark:text-hogwarts-400 shadow-sm">
          <span className="text-4xl block mb-2">⚔️</span>
          <p className="font-serif text-sm font-bold text-hogwarts-950 dark:text-hogwarts-100">Belum ada Boss Raid Tryout.</p>
          <p className="text-xs text-hogwarts-700 dark:text-hogwarts-400 mt-1">Klik tombol "Tambah Boss Raid" di atas untuk menambahkan sesi tryout baru.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {state.tryouts.map((t) => {
          const hasScore = t.actualScore !== null && t.actualScore !== undefined;
          const deltaTarget = hasScore ? t.actualScore! - t.targetScore : null;
          const deltaIdeal = hasScore ? 100 - t.actualScore! : null;
          const boss = BOSS_MONSTERS[t.no] || { name: 'Boss Trial', avatar: '🐉' };

          const isVictorious = hasScore && t.actualScore! >= t.targetScore;
          const isHighVictory = hasScore && t.actualScore! >= 90;

          return (
            <div
              key={t.no}
              className={`rounded-3xl p-5 border-2 transition-all flex flex-col justify-between shadow-xs hover:shadow-md ${
                isHighVictory
                  ? 'bg-gradient-to-br from-[#f0fbf5] to-[#e2f7ec] dark:from-[#09261a] dark:to-[#0e3827] border-emerald-400 dark:border-emerald-600/70'
                  : isVictorious
                  ? 'bg-gradient-to-br from-[#f2fbf9] to-[#e4f6f3] dark:from-[#092b26] dark:to-[#0f3d36] border-tiffany-400 dark:border-tiffany-600/70'
                  : hasScore
                  ? 'bg-gradient-to-br from-[#fff7f7] to-[#ffeef0] dark:from-[#380c16] dark:to-[#4c111e] border-rose-300 dark:border-rose-700/60'
                  : 'bg-[#fdfcf9] dark:bg-[#211c17] border-hogwarts-300 dark:border-[#383028] hover:border-tiffany-500'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl p-2.5 rounded-2xl bg-white dark:bg-[#1a1612] border border-hogwarts-200 dark:border-[#383028] shadow-xs">
                      {boss.avatar}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-hogwarts-100 text-hogwarts-950 font-serif border border-hogwarts-300">
                          Raid #{t.no}
                        </span>
                        <span className="text-xs font-serif font-bold text-hogwarts-700">
                          {boss.name}
                        </span>
                      </div>
                      <h3 className="font-serif font-bold text-sm text-hogwarts-950 mt-0.5">
                        {t.context}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => { sounds.playClick(); setEditingTryout({ ...t }); }}
                      className="p-1.5 text-hogwarts-600 hover:text-tiffany-700 rounded-lg hover:bg-white transition"
                      title="Input / Koreksi Nilai"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        sounds.playClick();
                        if (window.confirm(`Hapus Boss Raid #${t.no} (${t.context})?`)) {
                          deleteTryout(t.no);
                        }
                      }}
                      className="p-1.5 text-hogwarts-600 hover:text-rose-700 rounded-lg hover:bg-rose-50 transition"
                      title="Hapus Boss Raid"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Date, Source, and Question Count */}
                <div className="flex items-center justify-between text-[11px] text-hogwarts-700 dark:text-hogwarts-300 bg-white/80 dark:bg-[#15120f] rounded-xl p-2.5 border border-hogwarts-200 dark:border-[#383028] mb-3">
                  <div className="flex items-center gap-1.5 font-medium text-hogwarts-800 dark:text-hogwarts-200">
                    <Calendar className="w-3.5 h-3.5 text-tiffany-700 dark:text-tiffany-400" />
                    <span>{formatDateIndo(t.plannedDate)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-hogwarts-800 dark:text-hogwarts-300">{t.source || 'Mandiri'}</span>
                    <span className="font-bold text-hogwarts-950 dark:text-hogwarts-100 px-2 py-0.5 rounded-md bg-hogwarts-100 dark:bg-[#2b251f]">
                      {t.questionsCount} Soal
                    </span>
                  </div>
                </div>

                {/* Score vs Target Battle Display */}
                <div className="p-3.5 rounded-2xl bg-white dark:bg-[#181410] border border-hogwarts-200/90 dark:border-[#383028] space-y-2 mb-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold text-hogwarts-700 uppercase font-serif">
                      Hasil Pertempuran
                    </span>
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="text-hogwarts-700 font-medium">Target:</span>
                      <span className="font-extrabold text-hogwarts-950">{t.targetScore}</span>
                    </div>
                  </div>

                  {hasScore ? (
                    <div>
                      <div className="flex items-baseline justify-between mb-1.5">
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-serif text-3xl font-extrabold text-hogwarts-950">
                            {t.actualScore}
                          </span>
                          <span className="text-xs text-hogwarts-700 font-bold">/ 100</span>
                        </div>

                        <div className="text-right">
                          <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full border ${
                            deltaTarget !== null && deltaTarget >= 0
                              ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-950 dark:text-emerald-200 border-emerald-400 dark:border-emerald-600/70'
                              : 'bg-rose-100 dark:bg-rose-950/80 text-rose-950 dark:text-rose-200 border-rose-300 dark:border-rose-600/70'
                          }`}>
                            {deltaTarget !== null && deltaTarget >= 0 ? `+${deltaTarget.toFixed(1)} di atas target ✨` : `${deltaTarget?.toFixed(1)} dari target`}
                          </span>
                        </div>
                      </div>

                      {/* HP Gauge Bar */}
                      <div className="w-full bg-hogwarts-200 dark:bg-[#2c241c] border border-hogwarts-400/80 dark:border-[#4a3e30] h-2.5 rounded-full overflow-hidden relative shadow-inner">
                        <div
                          className={`h-full transition-all duration-500 rounded-full shadow-xs ${
                            t.actualScore! >= 90
                              ? 'bg-emerald-500'
                              : t.actualScore! >= t.targetScore
                              ? 'bg-tiffany-600'
                              : 'bg-amber-500'
                          }`}
                          style={{
                            width: `${Math.min(t.actualScore!, 100)}%`,
                            backgroundColor: t.actualScore! >= 90 ? '#10b981' : t.actualScore! >= t.targetScore ? '#0d9488' : '#f59e0b',
                            minWidth: t.actualScore! > 0 ? '6px' : '0px',
                            height: '100%'
                          }}
                        />
                      </div>

                      {deltaIdeal !== null && (
                        <div className="text-[10px] text-hogwarts-700 font-medium mt-1 text-right">
                          Sisa {deltaIdeal.toFixed(1)} poin menuju skor mutlak 100
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-2 space-y-1">
                      <div className="text-xs text-hogwarts-700 font-medium italic">
                        Monster belum dihadapi. Siapkan pedang pengetahuanmu!
                      </div>
                      <button
                        onClick={() => { sounds.playClick(); setEditingTryout({ ...t }); }}
                        className="mt-1 px-4 py-1.5 text-xs font-bold rounded-xl bg-tiffany-100 hover:bg-tiffany-200 text-tiffany-950 border border-tiffany-300 transition"
                      >
                        ⚔️ Hadapi Boss & Catat Skor
                      </button>
                    </div>
                  )}
                </div>

                {/* Weak Topics / Loot Review */}
                {t.weakTopics && (
                  <div className="p-2.5 rounded-xl bg-[#faf6ee] border border-hogwarts-200/90 text-xs space-y-1 mb-2">
                    <span className="text-[10px] font-bold text-amber-900 uppercase font-serif flex items-center gap-1">
                      <ShieldAlert className="w-3 h-3 text-amber-700" /> Materi Perlu Evaluasi (Error Log):
                    </span>
                    <p className="text-hogwarts-800 text-[11px] font-medium leading-relaxed">
                      {t.weakTopics}
                    </p>
                  </div>
                )}
              </div>

              {/* Footer Action */}
              <div className="pt-2 border-t border-hogwarts-200 flex items-center justify-between">
                <span className={`text-xs font-bold ${
                  hasScore ? 'text-tiffany-900' : 'text-hogwarts-600'
                }`}>
                  {hasScore ? '✓ Nilai Tercatat (+40 EXP)' : 'Belum Ujian'}
                </span>

                <button
                  onClick={() => { sounds.playClick(); setEditingTryout({ ...t }); }}
                  className="px-3 py-1 text-xs font-bold text-hogwarts-900 hover:text-tiffany-700 rounded-lg hover:bg-white transition flex items-center gap-1"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>{hasScore ? 'Koreksi Nilai' : 'Input Nilai'}</span>
                </button>
              </div>
            </div>
          );
        })}
        </div>
      )}

      {/* Add New Boss Raid Modal */}
      <ModalPortal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <div className="bg-[#fdfcf9] dark:bg-[#1c1814] border-2 border-hogwarts-300 dark:border-[#383028] rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b-2 border-hogwarts-200 dark:border-[#383028] pb-3">
              <h3 className="font-serif text-base font-bold text-hogwarts-950 dark:text-hogwarts-100 flex items-center gap-2">
                <Plus className="w-5 h-5 text-tiffany-700 dark:text-tiffany-400" />
                Tambah Boss Raid Tryout Baru (#{totalBosses + 1})
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
                <label className="block text-hogwarts-900 dark:text-hogwarts-200 mb-1 font-bold">Judul / Konteks Tryout</label>
                <input
                  type="text"
                  value={newContext}
                  onChange={(e) => setNewContext(e.target.value)}
                  placeholder="Contoh: Tryout Nasional AIPKI / TO Bimbel Akbar"
                  className="w-full px-3 py-1.5 rounded-xl border-2 border-hogwarts-300 dark:border-[#42372d] bg-white dark:bg-[#25201b] text-hogwarts-950 dark:text-hogwarts-100 placeholder-hogwarts-400 dark:placeholder-hogwarts-600 font-medium focus:outline-none focus:ring-2 focus:ring-tiffany-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-hogwarts-900 dark:text-hogwarts-200 mb-1 font-bold">Rencana Tanggal</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border-2 border-hogwarts-300 dark:border-[#42372d] bg-white dark:bg-[#25201b] text-hogwarts-950 dark:text-hogwarts-100 font-medium focus:outline-none focus:ring-2 focus:ring-tiffany-600"
                  />
                </div>
                <div>
                  <label className="block text-hogwarts-900 dark:text-hogwarts-200 mb-1 font-bold">Sumber / Penyelenggara</label>
                  <input
                    type="text"
                    value={newSource}
                    onChange={(e) => setNewSource(e.target.value)}
                    placeholder="Contoh: AIPKI / Optimus / Mediko"
                    className="w-full px-3 py-1.5 rounded-xl border-2 border-hogwarts-300 dark:border-[#42372d] bg-white dark:bg-[#25201b] text-hogwarts-950 dark:text-hogwarts-100 placeholder-hogwarts-400 dark:placeholder-hogwarts-600 font-medium focus:outline-none focus:ring-2 focus:ring-tiffany-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-hogwarts-900 dark:text-hogwarts-200 mb-1 font-bold">Jumlah Soal</label>
                  <input
                    type="number"
                    value={newQuestions}
                    onChange={(e) => setNewQuestions(parseInt(e.target.value) || 150)}
                    className="w-full px-3 py-1.5 rounded-xl border-2 border-hogwarts-300 dark:border-[#42372d] bg-white dark:bg-[#25201b] text-hogwarts-950 dark:text-hogwarts-100 font-medium focus:outline-none focus:ring-2 focus:ring-tiffany-600"
                  />
                </div>
                <div>
                  <label className="block text-hogwarts-900 dark:text-hogwarts-200 mb-1 font-bold">Target Skor</label>
                  <input
                    type="number"
                    value={newTarget}
                    onChange={(e) => setNewTarget(parseFloat(e.target.value) || 75)}
                    className="w-full px-3 py-1.5 rounded-xl border-2 border-hogwarts-300 dark:border-[#42372d] bg-white dark:bg-[#25201b] text-hogwarts-950 dark:text-hogwarts-100 font-medium focus:outline-none focus:ring-2 focus:ring-tiffany-600"
                  />
                </div>
                <div>
                  <label className="block text-tiffany-900 dark:text-tiffany-300 mb-1 font-bold">Skor Nyata (Opsional)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={newActual !== null ? newActual : ''}
                    onChange={(e) => setNewActual(e.target.value === '' ? null : parseFloat(e.target.value))}
                    placeholder="Jika sudah..."
                    className="w-full px-3 py-1.5 font-serif font-bold text-sm rounded-xl border-2 border-tiffany-600 bg-tiffany-50 dark:bg-[#0c2e28] text-tiffany-950 dark:text-tiffany-100 focus:outline-none focus:ring-2 focus:ring-tiffany-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-hogwarts-900 dark:text-hogwarts-200 mb-1 font-bold">Materi Kurang Paham (Loot Review)</label>
                <textarea
                  rows={2}
                  value={newWeakTopics}
                  onChange={(e) => setNewWeakTopics(e.target.value)}
                  placeholder="Contoh: EKG aritmia, biostatistik, sindrom nefrotik..."
                  className="w-full px-3 py-1.5 rounded-xl border-2 border-hogwarts-300 dark:border-[#42372d] bg-white dark:bg-[#25201b] text-hogwarts-950 dark:text-hogwarts-100 placeholder-hogwarts-400 dark:placeholder-hogwarts-600 font-medium focus:outline-none focus:ring-2 focus:ring-tiffany-600"
                />
              </div>

              <div>
                <label className="block text-hogwarts-900 dark:text-hogwarts-200 mb-1 font-bold">Catatan Evaluasi</label>
                <input
                  type="text"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Evaluasi manajemen waktu atau trik soal..."
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
                onClick={handleCreateTryout}
                className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-tiffany-950 dark:text-tiffany-100 bg-tiffany-200 dark:bg-tiffany-900/60 hover:bg-tiffany-300 dark:hover:bg-tiffany-800 border-2 border-tiffany-700 dark:border-tiffany-600 rounded-xl shadow-sm transition active:scale-95"
              >
                <Save className="w-3.5 h-3.5" />
                Simpan & Tambah Boss Raid ✨
              </button>
            </div>
          </div>
      </ModalPortal>

      {/* Edit Tryout Modal */}
      <ModalPortal isOpen={!!editingTryout} onClose={() => setEditingTryout(null)}>
        {editingTryout && (
          <div className="bg-[#fdfcf9] dark:bg-[#1c1814] border-2 border-hogwarts-300 dark:border-[#383028] rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b-2 border-hogwarts-200 dark:border-[#383028] pb-3">
              <h3 className="font-serif text-base font-bold text-hogwarts-950 dark:text-hogwarts-100">
                Input Skor Boss Raid #{editingTryout.no}: {editingTryout.context}
              </h3>
              <button
                onClick={() => setEditingTryout(null)}
                className="p-1 text-hogwarts-600 dark:text-hogwarts-400 hover:text-hogwarts-900 dark:hover:text-hogwarts-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-hogwarts-900 dark:text-hogwarts-200 mb-1 font-bold">Rencana Tanggal</label>
                  <input
                    type="date"
                    value={editingTryout.plannedDate}
                    onChange={(e) => setEditingTryout({ ...editingTryout, plannedDate: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl border-2 border-hogwarts-300 dark:border-[#42372d] bg-white dark:bg-[#25201b] text-hogwarts-950 dark:text-hogwarts-100 font-medium focus:outline-none focus:ring-2 focus:ring-tiffany-600"
                  />
                </div>
                <div>
                  <label className="block text-hogwarts-900 dark:text-hogwarts-200 mb-1 font-bold">Sumber / Bimbel</label>
                  <input
                    type="text"
                    value={editingTryout.source}
                    onChange={(e) => setEditingTryout({ ...editingTryout, source: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl border-2 border-hogwarts-300 dark:border-[#42372d] bg-white dark:bg-[#25201b] text-hogwarts-950 dark:text-hogwarts-100 font-medium focus:outline-none focus:ring-2 focus:ring-tiffany-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-hogwarts-900 dark:text-hogwarts-200 mb-1 font-bold">Jumlah Soal</label>
                  <input
                    type="number"
                    value={editingTryout.questionsCount}
                    onChange={(e) => setEditingTryout({ ...editingTryout, questionsCount: parseInt(e.target.value) || 150 })}
                    className="w-full px-3 py-1.5 rounded-xl border-2 border-hogwarts-300 dark:border-[#42372d] bg-white dark:bg-[#25201b] text-hogwarts-950 dark:text-hogwarts-100 font-medium focus:outline-none focus:ring-2 focus:ring-tiffany-600"
                  />
                </div>
                <div>
                  <label className="block text-hogwarts-900 dark:text-hogwarts-200 mb-1 font-bold">Target</label>
                  <input
                    type="number"
                    value={editingTryout.targetScore}
                    onChange={(e) => setEditingTryout({ ...editingTryout, targetScore: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 rounded-xl border-2 border-hogwarts-300 dark:border-[#42372d] bg-white dark:bg-[#25201b] text-hogwarts-950 dark:text-hogwarts-100 font-medium focus:outline-none focus:ring-2 focus:ring-tiffany-600"
                  />
                </div>
                <div>
                  <label className="block text-tiffany-900 dark:text-tiffany-300 mb-1 font-bold">SKOR NYATA (0-100)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={editingTryout.actualScore !== null && editingTryout.actualScore !== undefined ? editingTryout.actualScore : ''}
                    onChange={(e) => setEditingTryout({ ...editingTryout, actualScore: e.target.value === '' ? null : parseFloat(e.target.value) })}
                    placeholder="Nilai TO..."
                    className="w-full px-3 py-1.5 font-serif font-bold text-sm rounded-xl border-2 border-tiffany-600 bg-tiffany-50 dark:bg-[#0c2e28] text-tiffany-950 dark:text-tiffany-100 focus:outline-none focus:ring-2 focus:ring-tiffany-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-hogwarts-900 dark:text-hogwarts-200 mb-1 font-bold">Materi Kurang Paham (Loot Review)</label>
                <textarea
                  rows={2}
                  value={editingTryout.weakTopics}
                  onChange={(e) => setEditingTryout({ ...editingTryout, weakTopics: e.target.value })}
                  placeholder="Contoh: EKG aritmia, biostatistik..."
                  className="w-full px-3 py-1.5 rounded-xl border-2 border-hogwarts-300 dark:border-[#42372d] bg-white dark:bg-[#25201b] text-hogwarts-950 dark:text-hogwarts-100 placeholder-hogwarts-400 dark:placeholder-hogwarts-600 font-medium focus:outline-none focus:ring-2 focus:ring-tiffany-600"
                />
              </div>

              <div>
                <label className="block text-hogwarts-900 dark:text-hogwarts-200 mb-1 font-bold">Catatan Evaluasi</label>
                <input
                  type="text"
                  value={editingTryout.notes}
                  onChange={(e) => setEditingTryout({ ...editingTryout, notes: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-xl border-2 border-hogwarts-300 dark:border-[#42372d] bg-white dark:bg-[#25201b] text-hogwarts-950 dark:text-hogwarts-100 placeholder-hogwarts-400 dark:placeholder-hogwarts-600 font-medium focus:outline-none focus:ring-2 focus:ring-tiffany-600"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t-2 border-hogwarts-200 dark:border-[#383028]">
              <button
                onClick={() => {
                  sounds.playClick();
                  if (window.confirm(`Yakin ingin menghapus Boss Raid #${editingTryout.no}?`)) {
                    deleteTryout(editingTryout.no);
                    setEditingTryout(null);
                  }
                }}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-rose-700 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-950/50 rounded-xl transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Hapus Boss Raid
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditingTryout(null)}
                  className="px-4 py-1.5 text-xs font-bold text-hogwarts-800 dark:text-hogwarts-200 hover:bg-hogwarts-100 dark:hover:bg-[#25201b] border border-hogwarts-300 dark:border-[#42372d] rounded-xl transition"
                >
                  Batal
                </button>
                <button
                  onClick={handleSaveTryoutEdit}
                  className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-tiffany-950 dark:text-tiffany-100 bg-tiffany-200 dark:bg-tiffany-900/60 hover:bg-tiffany-300 dark:hover:bg-tiffany-800 border-2 border-tiffany-700 dark:border-tiffany-600 rounded-xl shadow-sm transition active:scale-95"
                >
                  <Save className="w-3.5 h-3.5" />
                  Simpan Skor (+40 EXP ✨)
                </button>
              </div>
            </div>
          </div>
        )}
      </ModalPortal>
    </div>
  );
};
