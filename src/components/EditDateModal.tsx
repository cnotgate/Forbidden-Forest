import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ClerkshipPhase } from '../types';
import { Calendar, Save, RotateCcw, X, Clock, Sparkles, Plus, Trash2, Check } from 'lucide-react';
import { getDaysRemaining, sortPhasesChronologically } from '../utils/dateHelper';
import confetti from 'canvas-confetti';
import { ModalPortal } from './ModalPortal';
import { sounds } from '../utils/soundHelper';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const EditDateModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { state, updateDashboardSettings, autoShiftIntensifFromDDay, syncRoadmapWithPhases } = useApp();

  const [startPlanner, setStartPlanner] = useState(state.dashboard.startPlanner);
  const [ddayUKMPPD, setDdayUKMPPD] = useState(state.dashboard.ddayUKMPPD);
  const [targetCBT, setTargetCBT] = useState(state.dashboard.targetCBT);
  const [batasAman, setBatasAman] = useState(state.dashboard.batasAman);
  const [autoShiftIntensif, setAutoShiftIntensif] = useState(true);
  const [phases, setPhases] = useState<ClerkshipPhase[]>(() => sortPhasesChronologically(state.dashboard.phases));

  if (!isOpen) return null;

  const handlePhaseChange = (index: number, field: keyof ClerkshipPhase, value: any) => {
    const updated = [...phases];
    updated[index] = { ...updated[index], [field]: value };
    setPhases(updated);
  };

  const handleAddPhase = () => {
    const newPhase: ClerkshipPhase = {
      id: `phase-${Date.now()}`,
      name: 'Stase Baru',
      type: 'Minor',
      startDate: new Date().toISOString().slice(0, 10),
      endDate: new Date().toISOString().slice(0, 10),
      durationWeeks: '4',
      status: 'Belum mulai',
      mode: 'Steady',
      notes: ''
    };
    setPhases([...phases, newPhase]);
  };

  const handleDeletePhase = (index: number) => {
    setPhases(phases.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const sortedPhases = sortPhasesChronologically(phases);
    updateDashboardSettings({
      startPlanner,
      ddayUKMPPD,
      targetCBT: Number(targetCBT),
      batasAman: Number(batasAman),
      phases: sortedPhases
    });

    if (autoShiftIntensif && ddayUKMPPD !== state.dashboard.ddayUKMPPD) {
      autoShiftIntensifFromDDay(ddayUKMPPD);
    }

    syncRoadmapWithPhases();

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });

    onClose();
  };

  const daysLeft = getDaysRemaining(ddayUKMPPD);

  return (
    <ModalPortal isOpen={isOpen} onClose={onClose}>
      <div className="bg-[#fdfcf9] dark:bg-[#1c1814] border-2 border-hogwarts-300 dark:border-[#3d3328] rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200 text-hogwarts-950 dark:text-hogwarts-100">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-2 border-hogwarts-200 dark:border-[#382e24]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-tiffany-100 dark:bg-tiffany-950/80 text-tiffany-950 dark:text-tiffany-300 rounded-2xl text-xl border border-tiffany-300 dark:border-tiffany-700">
              📅
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-hogwarts-950 dark:text-hogwarts-100">
                Atur Tanggal D-Day & Putaran Stase
              </h2>
              <p className="text-xs text-hogwarts-700 dark:text-hogwarts-400">
                Sesuaikan tanggal D-Day ujian, target CBT, dan jadwal mulai/selesai stase koas sesukamu.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-hogwarts-600 dark:text-hogwarts-400 hover:text-hogwarts-950 dark:hover:text-hogwarts-100 rounded-xl"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Main dates card */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-3xl bg-[#faf6ee] dark:bg-[#251f19] border-2 border-hogwarts-300 dark:border-[#382e24]">
            <div>
              <label className="block text-xs font-bold text-hogwarts-900 dark:text-hogwarts-200 mb-1">
                Start Planner (Senin Mulai)
              </label>
              <input
                type="date"
                value={startPlanner}
                onChange={(e) => setStartPlanner(e.target.value)}
                className="w-full px-3 py-2 text-xs font-semibold rounded-xl border-2 border-hogwarts-300 dark:border-[#382e24] bg-white dark:bg-[#1c1814] text-hogwarts-950 dark:text-hogwarts-100 focus:outline-none focus:ring-2 focus:ring-tiffany-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-hogwarts-900 dark:text-hogwarts-200 mb-1">
                D-Day UKMPPD (Estimasi)
              </label>
              <input
                type="date"
                value={ddayUKMPPD}
                onChange={(e) => setDdayUKMPPD(e.target.value)}
                className="w-full px-3 py-2 text-xs font-bold text-tiffany-950 dark:text-tiffany-300 rounded-xl border-2 border-tiffany-600 dark:border-tiffany-500 bg-white dark:bg-[#1c1814] focus:outline-none focus:ring-2 focus:ring-tiffany-600"
              />
              <div className="flex items-center gap-1 mt-1 text-[11px] text-tiffany-900 dark:text-tiffany-300 font-bold">
                <Clock className="w-3 h-3" />
                <span>{daysLeft} hari lagi menuju ujian 📜</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-hogwarts-900 dark:text-hogwarts-200 mb-1">
                Target CBT (Ideal)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={targetCBT}
                onChange={(e) => setTargetCBT(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs font-semibold rounded-xl border-2 border-hogwarts-300 dark:border-[#382e24] bg-white dark:bg-[#1c1814] text-hogwarts-950 dark:text-hogwarts-100 focus:outline-none focus:ring-2 focus:ring-tiffany-600"
              />
              <span className="text-[11px] text-hogwarts-600 dark:text-hogwarts-400 font-medium">Default: 100</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-hogwarts-900 dark:text-hogwarts-200 mb-1">
                Batas Aman (Rencana)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={batasAman}
                onChange={(e) => setBatasAman(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs font-semibold rounded-xl border-2 border-hogwarts-300 dark:border-[#382e24] bg-white dark:bg-[#1c1814] text-hogwarts-950 dark:text-hogwarts-100 focus:outline-none focus:ring-2 focus:ring-tiffany-600"
              />
              <span className="text-[11px] text-hogwarts-600 dark:text-hogwarts-400 font-medium">Default: 90</span>
            </div>
          </div>

          {/* Auto shift toggle */}
          <label
            htmlFor="autoShift"
            className={`group flex items-start sm:items-center gap-3.5 p-3.5 sm:p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer select-none ${
              autoShiftIntensif
                ? 'bg-tiffany-50/90 dark:bg-[#0c2420] border-tiffany-400 dark:border-tiffany-600/80 shadow-xs'
                : 'bg-[#faf6ee] dark:bg-[#1a1612] border-hogwarts-300 dark:border-[#382f25] opacity-75 hover:opacity-100'
            }`}
          >
            <div className="relative flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
              <input
                type="checkbox"
                id="autoShift"
                checked={autoShiftIntensif}
                onChange={(e) => {
                  sounds.playClick();
                  setAutoShiftIntensif(e.target.checked);
                }}
                className="sr-only"
              />
              <div
                className={`w-5 h-5 rounded-lg flex items-center justify-center border-2 transition-all duration-150 ${
                  autoShiftIntensif
                    ? 'bg-tiffany-600 dark:bg-tiffany-500 border-tiffany-700 dark:border-tiffany-300 text-white shadow-xs scale-105'
                    : 'bg-white dark:bg-[#211c17] border-hogwarts-400 dark:border-hogwarts-600 group-hover:border-tiffany-500'
                }`}
              >
                {autoShiftIntensif && <Check className="w-3.5 h-3.5 stroke-[3] text-white" />}
              </div>
            </div>

            <div className="flex-1 text-xs leading-relaxed">
              <span
                className={`font-bold ${
                  autoShiftIntensif
                    ? 'text-tiffany-950 dark:text-tiffany-100'
                    : 'text-hogwarts-900 dark:text-hogwarts-200'
                }`}
              >
                Otomatis sinkronkan 70 hari Intensif (H-70 s/d H-1)
              </span>
              <span
                className={` ${
                  autoShiftIntensif
                    ? 'text-tiffany-900 dark:text-tiffany-200 font-medium'
                    : 'text-hogwarts-700 dark:text-hogwarts-400 font-medium'
                }`}
              >
                {' '}sesuai D-Day baru. Jadwal harian topik intensif akan langsung bergeser otomatis!
              </span>
            </div>
          </label>

          {/* Stase & Fase table */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-serif text-sm font-bold text-hogwarts-950 dark:text-hogwarts-100">
                Jadwal & Tanggal Setiap Stase Koas
              </h3>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAddPhase}
                  className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-xl bg-tiffany-200 dark:bg-tiffany-900/60 text-tiffany-950 dark:text-tiffany-200 border-2 border-tiffany-600 dark:border-tiffany-500 hover:bg-tiffany-300 transition shadow-xs active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Tambah Stase
                </button>
                <span className="text-xs text-hogwarts-700 dark:text-hogwarts-400 font-bold">
                  {phases.length} stase
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[360px] overflow-y-auto pr-1">
              {phases.map((p, idx) => (
                <div key={p.id} className="p-3.5 rounded-2xl border-2 border-hogwarts-300 dark:border-[#382e24] bg-white dark:bg-[#251f19] space-y-2.5 shadow-xs">
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={p.name}
                      onChange={(e) => handlePhaseChange(idx, 'name', e.target.value)}
                      placeholder="Nama Stase"
                      className="font-serif font-bold text-xs px-2.5 py-1 rounded-xl border border-hogwarts-300 dark:border-[#382e24] bg-[#faf6ee] dark:bg-[#1c1814] text-hogwarts-950 dark:text-hogwarts-100 flex-1 focus:outline-none focus:ring-1 focus:ring-tiffany-600"
                    />
                    <input
                      type="text"
                      value={p.type}
                      onChange={(e) => handlePhaseChange(idx, 'type', e.target.value)}
                      placeholder="Jenis"
                      className="w-20 text-[10px] font-bold px-2 py-1 rounded-xl border border-hogwarts-300 dark:border-[#382e24] bg-hogwarts-100 dark:bg-stone-800 text-hogwarts-950 dark:text-hogwarts-200 focus:outline-none focus:ring-1 focus:ring-tiffany-600"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeletePhase(idx)}
                      className="p-1 text-hogwarts-500 dark:text-hogwarts-400 hover:text-rose-700 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                      title="Hapus Stase"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-[10px] text-hogwarts-700 dark:text-hogwarts-400 font-bold block mb-0.5">Mulai</span>
                      <input
                        type="date"
                        value={p.startDate}
                        onChange={(e) => handlePhaseChange(idx, 'startDate', e.target.value)}
                        className="w-full px-2 py-1 rounded-xl border border-hogwarts-300 dark:border-[#382e24] bg-[#faf6ee] dark:bg-[#1c1814] text-hogwarts-950 dark:text-hogwarts-100 font-medium focus:outline-none focus:ring-1 focus:ring-tiffany-600"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-hogwarts-700 dark:text-hogwarts-400 font-bold block mb-0.5">Selesai</span>
                      <input
                        type="date"
                        value={p.endDate}
                        onChange={(e) => handlePhaseChange(idx, 'endDate', e.target.value)}
                        className="w-full px-2 py-1 rounded-xl border border-hogwarts-300 dark:border-[#382e24] bg-[#faf6ee] dark:bg-[#1c1814] text-hogwarts-950 dark:text-hogwarts-100 font-medium focus:outline-none focus:ring-1 focus:ring-tiffany-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-[10px] text-hogwarts-700 dark:text-hogwarts-400 font-bold block mb-0.5">Status</span>
                      <select
                        value={p.status}
                        onChange={(e) => handlePhaseChange(idx, 'status', e.target.value)}
                        className="w-full px-2 py-1 rounded-xl border border-hogwarts-300 dark:border-[#382e24] bg-[#faf6ee] dark:bg-[#1c1814] text-hogwarts-950 dark:text-hogwarts-100 font-medium focus:outline-none focus:ring-1 focus:ring-tiffany-600"
                      >
                        <option value="Sedang berjalan">⚡ Sedang berjalan</option>
                        <option value="Belum mulai">🔒 Belum mulai</option>
                        <option value="ESTIMASI">ESTIMASI</option>
                        <option value="Rencana">Rencana</option>
                        <option value="Selesai">✓ Selesai</option>
                        <option value="Target">Target</option>
                      </select>
                    </div>
                    <div>
                      <span className="text-[10px] text-hogwarts-700 dark:text-hogwarts-400 font-bold block mb-0.5">Mode Energi</span>
                      <input
                        type="text"
                        value={p.mode}
                        onChange={(e) => handlePhaseChange(idx, 'mode', e.target.value)}
                        placeholder="Normal / Ringan"
                        className="w-full px-2 py-1 rounded-xl border border-hogwarts-300 dark:border-[#382e24] bg-[#faf6ee] dark:bg-[#1c1814] text-hogwarts-950 dark:text-hogwarts-100 font-medium focus:outline-none focus:ring-1 focus:ring-tiffany-600"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t-2 border-hogwarts-200 dark:border-[#382e24] bg-[#faf6ee] dark:bg-[#251f19]">
          <button
            onClick={() => {
              setStartPlanner(state.dashboard.startPlanner);
              setDdayUKMPPD(state.dashboard.ddayUKMPPD);
              setTargetCBT(state.dashboard.targetCBT);
              setBatasAman(state.dashboard.batasAman);
              setPhases(state.dashboard.phases);
            }}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-hogwarts-700 dark:text-hogwarts-400 hover:text-hogwarts-950 dark:hover:text-hogwarts-100 rounded-xl"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Form
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-hogwarts-700 dark:text-hogwarts-400 hover:text-hogwarts-950 dark:hover:text-hogwarts-100 rounded-xl"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-tiffany-950 bg-tiffany-200 hover:bg-tiffany-300 border-2 border-tiffany-700 rounded-xl shadow-sm transition active:scale-95"
            >
              <Save className="w-4 h-4" />
              Simpan Semua Tanggal ✨
            </button>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
};
