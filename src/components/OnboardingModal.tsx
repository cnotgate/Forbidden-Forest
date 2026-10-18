import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  Crown,
  Calendar,
  Target,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Database,
  CloudUpload,
  Check,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/soundHelper';
import { AVATAR_OPTIONS, MOOD_OPTIONS, isMascotSelected, isMoodSelected } from '../utils/companionQuotes';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { user, completeOnboarding } = useAuth();
  const { state, updateDashboardSettings, setCloudState } = useApp();

  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  // Form state - default to authenticated user name, avoiding cross-user local residual data
  const [doctorNickname, setDoctorNickname] = useState(
    user?.fullName?.split(' ')[0] || user?.fullName || state.dashboard.doctorNickname || 'Dokter Muda'
  );
  const [doctorAvatar, setDoctorAvatar] = useState(state.dashboard.doctorAvatar || '🦉 Hedwig');
  const [companionMood, setCompanionMood] = useState(state.dashboard.companionMood || '🟢 Online');
  const [ddayUKMPPD, setDdayUKMPPD] = useState(state.dashboard.ddayUKMPPD || '2026-08-15');
  const [targetCBT, setTargetCBT] = useState(state.dashboard.targetCBT || 85);
  const [batasAman, setBatasAman] = useState(state.dashboard.batasAman || 70);

  if (!isOpen) return null;

  const handleNext = () => {
    sounds.playClick();
    setStep(prev => prev + 1);
  };

  const handlePrev = () => {
    sounds.playClick();
    setStep(prev => prev - 1);
  };

  const handleFinish = async () => {
    setLoading(true);
    sounds.playClick();

    const res = await completeOnboarding({
      doctorNickname,
      doctorAvatar,
      companionMood,
      ddayUKMPPD,
      targetCBT: Number(targetCBT),
      batasAman: Number(batasAman)
    });

    setLoading(false);
    if (res.success) {
      if (res.state) {
        setCloudState(res.state);
      } else {
        updateDashboardSettings({
          doctorNickname,
          doctorAvatar,
          companionMood,
          ddayUKMPPD,
          targetCBT: Number(targetCBT),
          batasAman: Number(batasAman)
        });
      }

      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.5 }
      });
      sounds.playLevelUp();
      onClose();
    }
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          sounds.playClick();
          onClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl my-auto rounded-3xl bg-[#faf6ee] dark:bg-[#1c1814] border-2 border-hogwarts-300 dark:border-[#3d3328] shadow-2xl p-6 sm:p-8 space-y-6 cursor-default"
      >
        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between items-center text-xs font-bold text-hogwarts-700 dark:text-hogwarts-400">
            <span>Inisiasi Sanctum Healer</span>
            <span>Langkah {step} dari 3</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-hogwarts-200 dark:bg-[#2c241c] border border-hogwarts-400/80 dark:border-[#4a3e30] overflow-hidden relative shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-tiffany-600 via-tiffany-500 to-tiffany-400 rounded-full transition-all duration-300 shadow-xs"
              style={{
                width: `${(step / 3) * 100}%`,
                backgroundColor: '#0d9488',
                height: '100%'
              }}
            />
          </div>
        </div>

        {/* STEP 1: Persona Dokter */}
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tiffany-100 dark:bg-tiffany-950/80 text-tiffany-950 dark:text-tiffany-300 text-xs font-bold border border-tiffany-300 dark:border-tiffany-700 font-serif">
                <Crown className="w-3.5 h-3.5 text-amber-600" /> Langkah 1: Persona Healer
              </span>
              <h2 className="font-serif text-2xl font-bold text-hogwarts-950 dark:text-hogwarts-100 mt-2">
                Bagaimana Kami Memanggilmu? 📜
              </h2>
              <p className="text-xs text-hogwarts-700 dark:text-hogwarts-400">
                Tentukan nama panggilan santai dan avatar maskot yang akan mendampingimu belajar setiap hari.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-hogwarts-800 dark:text-hogwarts-300 mb-1">
                  Panggilan Dokter / Nickname
                </label>
                <input
                  type="text"
                  value={doctorNickname}
                  onChange={(e) => setDoctorNickname(e.target.value)}
                  placeholder="e.g. Dr. Aisyah, Dokter Cantik, dll."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#fdfcf9] dark:bg-[#211c17] border-2 border-hogwarts-300 dark:border-[#382e24] text-xs text-hogwarts-950 dark:text-hogwarts-100 font-bold focus:border-tiffany-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-hogwarts-800 dark:text-hogwarts-300 mb-2">
                  Pilih Maskot Pendamping
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {AVATAR_OPTIONS.map((opt) => {
                    const isSelected = isMascotSelected(doctorAvatar, opt);
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => { sounds.playClick(); setDoctorAvatar(opt.id); }}
                        className={`relative p-3 rounded-xl border-2 text-center transition-colors cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                          isSelected
                            ? 'border-tiffany-700 dark:border-tiffany-400 bg-tiffany-200/90 dark:bg-tiffany-900/80 text-tiffany-950 dark:text-tiffany-100 shadow-md ring-2 ring-tiffany-500/40'
                            : 'border-hogwarts-300 dark:border-[#332a22] bg-[#fdfcf9] dark:bg-[#211c17] text-hogwarts-800 dark:text-hogwarts-300 hover:border-tiffany-400 dark:hover:border-tiffany-500 hover:bg-white dark:hover:bg-[#29221c]'
                        }`}
                      >
                        <span className="text-3xl filter drop-shadow-xs">{opt.icon}</span>
                        <span className={`text-xs font-serif font-bold text-center leading-tight ${isSelected ? 'text-tiffany-950 dark:text-tiffany-100' : 'text-hogwarts-950 dark:text-hogwarts-100'}`}>
                          {opt.label}
                        </span>
                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-tiffany-700 dark:bg-tiffany-400 text-white dark:text-stone-950 flex items-center justify-center text-[10px] font-bold shadow-xs">
                            ✓
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Status / Mood Dokter (Discord-style) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-hogwarts-800 dark:text-hogwarts-300">
                    Status / Mood Pendamping
                  </label>
                  {companionMood && (
                    <span className="text-[10px] text-hogwarts-600 dark:text-hogwarts-400 font-medium">
                      {companionMood.length}/60 karakter
                    </span>
                  )}
                </div>

                {/* Custom Status Input */}
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-sm select-none pointer-events-none">💬</span>
                  <input
                    type="text"
                    value={companionMood}
                    onChange={(e) => setCompanionMood(e.target.value)}
                    placeholder="Atur status kustom (contoh: Lagi drill 50 soal bedah 🩺)..."
                    maxLength={60}
                    className="w-full pl-9 pr-9 py-2 text-xs rounded-xl border-2 border-hogwarts-300 dark:border-[#382e24] bg-[#fdfcf9] dark:bg-[#211c17] text-hogwarts-950 dark:text-hogwarts-100 font-semibold focus:outline-none focus:border-tiffany-600 transition"
                  />
                  {companionMood ? (
                    <button
                      type="button"
                      onClick={() => { sounds.playClick(); setCompanionMood(''); }}
                      title="Hapus status"
                      className="absolute right-2.5 p-1 rounded-md text-hogwarts-500 hover:text-hogwarts-900 dark:text-hogwarts-400 dark:hover:text-hogwarts-100 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  ) : null}
                </div>

                {/* Quick Preset Pills */}
                <div>
                  <div className="text-[10px] font-bold text-hogwarts-700 dark:text-hogwarts-400 mb-1.5 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    <span>Atau pilih preset cepat:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                  {MOOD_OPTIONS.map((m) => {
                    const isSelected = isMoodSelected(companionMood, m);
                    return (
                      <button
                        key={m}
                        type="button"
                        onClick={() => { sounds.playClick(); setCompanionMood(m); }}
                        className={`px-2.5 py-1 text-[11px] rounded-lg border-2 transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-tiffany-200 dark:bg-tiffany-900/90 text-tiffany-950 dark:text-tiffany-100 border-tiffany-700 dark:border-tiffany-400 font-extrabold shadow-xs'
                            : 'bg-[#faf6ee] dark:bg-[#211c17] border-hogwarts-300 dark:border-[#332a22] text-hogwarts-800 dark:text-hogwarts-300 hover:border-tiffany-500 dark:hover:border-tiffany-400 font-medium'
                        }`}
                      >
                        {m}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* STEP 2: Target Ujian & D-Day */}
        {step === 2 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tiffany-100 dark:bg-tiffany-950/80 text-tiffany-950 dark:text-tiffany-300 text-xs font-bold border border-tiffany-300 dark:border-tiffany-700 font-serif">
                <Target className="w-3.5 h-3.5 text-amber-600" /> Langkah 2: Target Kelulusan
              </span>
              <h2 className="font-serif text-2xl font-bold text-hogwarts-950 dark:text-hogwarts-100 mt-2">
                Kapan Hari Ujian UKMPPD? 🎯
              </h2>
              <p className="text-xs text-hogwarts-700 dark:text-hogwarts-400">
                Hitungan mundur otomatis dan jadwal intensif 70 hari akan diselaraskan dengan tanggal ini.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-hogwarts-800 dark:text-hogwarts-300 mb-1">
                  Tanggal D-Day UKMPPD CBT
                </label>
                <input
                  type="date"
                  value={ddayUKMPPD}
                  onChange={(e) => setDdayUKMPPD(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#fdfcf9] dark:bg-[#211c17] border-2 border-hogwarts-300 dark:border-[#382e24] text-xs text-hogwarts-950 dark:text-hogwarts-100 font-bold focus:border-tiffany-500 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-hogwarts-800 dark:text-hogwarts-300 mb-1">
                    Target Skor CBT
                  </label>
                  <input
                    type="number"
                    min={60}
                    max={100}
                    value={targetCBT}
                    onChange={(e) => setTargetCBT(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#fdfcf9] dark:bg-[#211c17] border-2 border-hogwarts-300 dark:border-[#382e24] text-xs text-hogwarts-950 dark:text-hogwarts-100 font-bold focus:border-tiffany-500 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-hogwarts-800 dark:text-hogwarts-300 mb-1">
                    Batas Aman (Passing)
                  </label>
                  <input
                    type="number"
                    min={50}
                    max={90}
                    value={batasAman}
                    onChange={(e) => setBatasAman(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#fdfcf9] dark:bg-[#211c17] border-2 border-hogwarts-300 dark:border-[#382e24] text-xs text-hogwarts-950 dark:text-hogwarts-100 font-bold focus:border-tiffany-500 outline-hidden"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Konfirmasi Cloud & Siap Berangkat */}
        {step === 3 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tiffany-100 dark:bg-tiffany-950/80 text-tiffany-950 dark:text-tiffany-300 text-xs font-bold border border-tiffany-300 dark:border-tiffany-700 font-serif">
                <Sparkles className="w-3.5 h-3.5 text-tiffany-700" /> Langkah 3: Konfirmasi & Siap Berangkat
              </span>
              <h2 className="font-serif text-2xl font-bold text-hogwarts-950 dark:text-hogwarts-100 mt-2">
                Sanctum Siap Dibuka! ✨
              </h2>
              <p className="text-xs text-hogwarts-700 dark:text-hogwarts-400">
                Semua template sistem (11 Level RPG, 10 Badges, SKDI Spiral, dan Tryout) telah disiapkan untukmu di cloud.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-tiffany-50 dark:bg-[#1a2b27] border-2 border-tiffany-300 dark:border-tiffany-800 space-y-2">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-tiffany-100 dark:bg-tiffany-900/60 text-tiffany-700 dark:text-tiffany-300 shrink-0">
                  <CloudUpload className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-xs text-tiffany-950 dark:text-tiffany-100">
                    Penyimpanan Cloud Otomatis Aktif ☁️
                  </h4>
                  <p className="text-[11px] text-tiffany-800 dark:text-tiffany-300 mt-0.5 leading-relaxed">
                    Akun barumu sepenuhnya terisolasi dan langsung tersimpan ke cloud server. Data progress, habit harian, dan tryout tersimpan aman tanpa tercampur data akun lain.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-3 border-t-2 border-hogwarts-200 dark:border-[#382e24]">
          {step > 1 ? (
            <button
              type="button"
              onClick={handlePrev}
              className="px-4 py-2 rounded-xl text-xs font-bold text-hogwarts-800 dark:text-hogwarts-300 hover:bg-hogwarts-200 dark:hover:bg-[#2c241c] flex items-center gap-1.5 transition"
            >
              <ArrowLeft className="w-4 h-4" /> Kembali
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl bg-tiffany-200 hover:bg-tiffany-300 dark:bg-tiffany-800 text-tiffany-950 dark:text-white border-2 border-tiffany-700 font-bold text-xs flex items-center gap-1.5 shadow-sm transition active:scale-95"
            >
              Lanjut <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={loading}
              onClick={handleFinish}
              className="px-6 py-2.5 rounded-xl bg-tiffany-200 hover:bg-tiffany-300 dark:bg-tiffany-800 text-tiffany-950 dark:text-white border-2 border-tiffany-700 font-serif font-bold text-xs flex items-center gap-2 shadow-md transition active:scale-95"
            >
              {loading ? 'Menyimpan...' : 'Mulai Petualangan Sanctum ✨'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

