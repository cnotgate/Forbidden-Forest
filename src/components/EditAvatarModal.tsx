import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, X, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ModalPortal } from './ModalPortal';
import { AVATAR_OPTIONS, MOOD_OPTIONS, isMascotSelected, isMoodSelected } from '../utils/companionQuotes';
import { sounds } from '../utils/soundHelper';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const EditAvatarModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { state, updateDashboardSettings } = useApp();

  const [avatar, setAvatar] = useState(state.dashboard.doctorAvatar || '🦉 Hedwig');
  const [nickname, setNickname] = useState(state.dashboard.doctorNickname || 'Dokter Healer ✨');
  const [mood, setMood] = useState(state.dashboard.companionMood || '🟢 Online');

  if (!isOpen) return null;

  const handleSave = () => {
    sounds.playLevelUp();
    updateDashboardSettings({
      doctorAvatar: avatar,
      doctorNickname: nickname,
      companionMood: mood
    });
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.7 }
    });
    onClose();
  };

  return (
    <ModalPortal isOpen={isOpen} onClose={onClose}>
      <div className="bg-[#fdfcf9] dark:bg-[#1c1814] border-2 border-hogwarts-300 dark:border-[#3d3328] rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 text-hogwarts-950 dark:text-hogwarts-100">
        <div className="flex items-center justify-between border-b-2 border-hogwarts-200 dark:border-[#382e24] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-tiffany-100 dark:bg-tiffany-950/80 text-tiffany-950 dark:text-tiffany-300 rounded-xl text-xl border border-tiffany-300 dark:border-tiffany-700">
              🦉
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-hogwarts-950 dark:text-hogwarts-100">
                Identitas Healer & Maskot Akademi
              </h3>
              <p className="text-xs text-hogwarts-700 dark:text-hogwarts-400">
                Pilih maskot pendamping dan nama panggilan doktermu.
              </p>
            </div>
          </div>
          <button
            onClick={() => { sounds.playClick(); onClose(); }}
            className="p-1.5 text-hogwarts-600 dark:text-hogwarts-400 hover:text-hogwarts-950 dark:hover:text-hogwarts-100 rounded-lg transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nickname */}
        <div>
          <label className="block text-xs font-bold text-hogwarts-900 dark:text-hogwarts-200 mb-1.5">
            Nama Panggilan Dokter:
          </label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Contoh: Dokter Healer ✨ / Dr. Aisyah 🌿"
            className="w-full px-3.5 py-2 text-sm rounded-xl border-2 border-hogwarts-300 dark:border-[#382e24] bg-white dark:bg-[#251f19] text-hogwarts-950 dark:text-hogwarts-100 focus:outline-none focus:border-tiffany-600 font-semibold"
          />
        </div>

        {/* Status / Mood Dokter (Discord-style) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-hogwarts-900 dark:text-hogwarts-200">
              Status / Mood Dokter:
            </label>
            {mood && (
              <span className="text-[10px] text-hogwarts-600 dark:text-hogwarts-400 font-medium">
                {mood.length}/60 karakter
              </span>
            )}
          </div>

          {/* Custom Status Input */}
          <div className="relative flex items-center">
            <span className="absolute left-3.5 text-sm select-none pointer-events-none">💬</span>
            <input
              type="text"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              placeholder="Atur status kustom (contoh: Lagi drill 50 soal bedah 🩺)..."
              maxLength={60}
              className="w-full pl-9 pr-9 py-2 text-xs rounded-xl border-2 border-hogwarts-300 dark:border-[#382e24] bg-white dark:bg-[#251f19] text-hogwarts-950 dark:text-hogwarts-100 font-semibold focus:outline-none focus:border-tiffany-600 transition"
            />
            {mood ? (
              <button
                type="button"
                onClick={() => { sounds.playClick(); setMood(''); }}
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
              {MOOD_OPTIONS.map(m => {
                const isSelected = isMoodSelected(mood, m);
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => { sounds.playClick(); setMood(m); }}
                    className={`px-2.5 py-1 text-[11px] rounded-lg border-2 transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-tiffany-200 dark:bg-tiffany-900/90 text-tiffany-950 dark:text-tiffany-100 border-tiffany-700 dark:border-tiffany-400 font-extrabold shadow-xs'
                        : 'bg-[#faf6ee] dark:bg-[#221c17] text-hogwarts-800 dark:text-hogwarts-300 border-hogwarts-300 dark:border-[#382e24] hover:border-tiffany-500 dark:hover:border-tiffany-400 font-medium'
                    }`}
                  >
                    {m}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Avatar choices */}
        <div>
          <label className="block text-xs font-bold text-hogwarts-900 dark:text-hogwarts-200 mb-2">
            Pilih Maskot Pendamping:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {AVATAR_OPTIONS.map(opt => {
              const isSelected = isMascotSelected(avatar, opt);
              return (
                <div
                  key={opt.id}
                  onClick={() => { sounds.playClick(); setAvatar(opt.id); }}
                  className={`relative p-3 rounded-xl border-2 text-center transition-colors cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                    isSelected
                      ? 'border-tiffany-700 dark:border-tiffany-400 bg-tiffany-200/90 dark:bg-tiffany-900/80 text-tiffany-950 dark:text-tiffany-100 shadow-md ring-2 ring-tiffany-500/40'
                      : 'border-hogwarts-300 dark:border-[#382e24] bg-[#faf6ee] dark:bg-[#221c17] text-hogwarts-800 dark:text-hogwarts-300 hover:border-tiffany-400 dark:hover:border-tiffany-500 hover:bg-white dark:hover:bg-[#29221c]'
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
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t-2 border-hogwarts-200 dark:border-[#382e24]">
          <button
            onClick={() => { sounds.playClick(); onClose(); }}
            className="px-4 py-2 text-xs font-bold text-hogwarts-700 dark:text-hogwarts-400 hover:text-hogwarts-950 dark:hover:text-hogwarts-100 rounded-lg cursor-pointer transition"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-hogwarts-950 dark:text-hogwarts-100 bg-[#fdfcf9] dark:bg-[#2a221b] hover:bg-[#f5efe4] dark:hover:bg-[#342b22] border-2 border-hogwarts-400 dark:border-[#4d3f32] rounded-xl shadow-xs transition active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            Simpan Identitas
          </button>
        </div>
      </div>
    </ModalPortal>
  );
};

