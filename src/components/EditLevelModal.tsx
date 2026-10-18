import React, { useState } from 'react';
import { useApp, DEFAULT_LEVEL_TITLES } from '../context/AppContext';
import { LevelItem, XPRule } from '../types';
import { X, Trophy, Save, RotateCcw, Sparkles, Gift, Crown, Scroll } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ModalPortal } from './ModalPortal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const defaultIcons = ['📜', '🌿', '⚡', '💓', '🍼', '🧪', '🗡️', '👓', '🔥', '🧠', '👑'];

export const EditLevelModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { state, updateLevels, updateXPRules } = useApp();
  const [levels, setLevels] = useState<LevelItem[]>(state.leveling.levels);
  const [rules, setRules] = useState<XPRule[]>(state.leveling.xpRules);
  const [activeTab, setActiveTab] = useState<'levels' | 'rules'>('levels');

  if (!isOpen) return null;

  const handleLevelChange = (index: number, field: keyof LevelItem, value: any) => {
    const updated = [...levels];
    updated[index] = { ...updated[index], [field]: value };
    setLevels(updated);
  };

  const handleRuleChange = (index: number, value: number) => {
    const updated = [...rules];
    updated[index] = { ...updated[index], xpPerUnit: value };
    setRules(updated);
  };

  const handleSave = () => {
    updateLevels(levels);
    updateXPRules(rules);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });
    onClose();
  };

  return (
    <ModalPortal isOpen={isOpen} onClose={onClose}>
      <div className="bg-[#fdfcf9] dark:bg-[#1c1814] border-2 border-hogwarts-300 dark:border-[#3d3328] rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200 text-hogwarts-950 dark:text-hogwarts-100">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-2 border-hogwarts-200 dark:border-[#382e24]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-100 dark:bg-amber-950/80 text-amber-950 dark:text-amber-300 rounded-2xl text-xl border border-amber-300 dark:border-amber-700">
              👑
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-hogwarts-950 dark:text-hogwarts-100">
                Kustomisasi Nama Level & Kotak Hadiah 🎁
              </h2>
              <p className="text-xs text-hogwarts-700 dark:text-hogwarts-400">
                Ubah gelar level, target XP, hadiah diri (<em>Self-Reward</em>), dan aturan perolehan EXP.
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

        {/* Tab switch */}
        <div className="flex border-b-2 border-hogwarts-200 dark:border-[#382e24] px-6 pt-3 gap-4 bg-[#faf6ee] dark:bg-[#251f19]">
          <button
            onClick={() => setActiveTab('levels')}
            className={`pb-3 font-serif font-bold text-xs transition border-b-2 flex items-center gap-2 ${
              activeTab === 'levels'
                ? 'border-tiffany-700 dark:border-tiffany-400 text-tiffany-950 dark:text-tiffany-200'
                : 'border-transparent text-hogwarts-600 dark:text-hogwarts-400 hover:text-hogwarts-950 dark:hover:text-hogwarts-100'
            }`}
          >
            <span>👑</span>
            Nama Level & Gelar (1-11)
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`pb-3 font-serif font-bold text-xs transition border-b-2 flex items-center gap-2 ${
              activeTab === 'rules'
                ? 'border-tiffany-700 dark:border-tiffany-400 text-tiffany-950 dark:text-tiffany-200'
                : 'border-transparent text-hogwarts-600 dark:text-hogwarts-400 hover:text-hogwarts-950 dark:hover:text-hogwarts-100'
            }`}
          >
            <span>✨</span>
            Aturan Perolehan EXP
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {activeTab === 'levels' ? (
            <div className="space-y-3">
              <div className="grid grid-cols-12 gap-3 text-xs font-serif font-bold text-hogwarts-900 dark:text-hogwarts-300 uppercase px-2 text-[11px]">
                <div className="col-span-1 text-center">Lvl</div>
                <div className="col-span-3">Gelar / Nama Level</div>
                <div className="col-span-2">Min XP</div>
                <div className="col-span-3">Makna Milestone</div>
                <div className="col-span-3">Self-Reward (Hadiah Diri) 🎁</div>
              </div>

              {levels.map((lvl, idx) => (
                <div
                  key={lvl.level}
                  className="grid grid-cols-12 gap-3 items-center p-3 rounded-2xl bg-[#faf6ee] dark:bg-[#251f19] border-2 border-hogwarts-300 dark:border-[#382e24] hover:border-tiffany-600 dark:hover:border-tiffany-500 transition"
                >
                  <div className="col-span-1 text-center font-serif font-bold text-hogwarts-950 dark:text-hogwarts-100 text-sm flex items-center justify-center gap-1">
                    <span>{lvl.cuteIcon || defaultIcons[idx % defaultIcons.length]}</span>
                    <span>{lvl.level}</span>
                  </div>
                  <div className="col-span-3">
                    <input
                      type="text"
                      value={lvl.title}
                      onChange={(e) => handleLevelChange(idx, 'title', e.target.value)}
                      className="w-full px-3 py-1.5 text-xs font-bold rounded-xl border-2 border-hogwarts-300 dark:border-[#382e24] bg-white dark:bg-[#1c1814] text-hogwarts-950 dark:text-hogwarts-100 focus:outline-none focus:ring-2 focus:ring-tiffany-600"
                      placeholder="Nama gelar level..."
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      value={lvl.minXP}
                      onChange={(e) => handleLevelChange(idx, 'minXP', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-1.5 text-xs font-bold rounded-xl border-2 border-hogwarts-300 dark:border-[#382e24] bg-white dark:bg-[#1c1814] text-hogwarts-950 dark:text-hogwarts-100 focus:outline-none focus:ring-2 focus:ring-tiffany-600"
                    />
                  </div>
                  <div className="col-span-3">
                    <input
                      type="text"
                      value={lvl.meaning}
                      onChange={(e) => handleLevelChange(idx, 'meaning', e.target.value)}
                      className="w-full px-3 py-1.5 text-xs font-medium rounded-xl border-2 border-hogwarts-300 dark:border-[#382e24] bg-white dark:bg-[#1c1814] text-hogwarts-950 dark:text-hogwarts-100 focus:outline-none focus:ring-2 focus:ring-tiffany-600"
                      placeholder="Makna milestone..."
                    />
                  </div>
                  <div className="col-span-3">
                    <input
                      type="text"
                      value={lvl.selfReward}
                      onChange={(e) => handleLevelChange(idx, 'selfReward', e.target.value)}
                      className="w-full px-3 py-1.5 text-xs font-bold rounded-xl border-2 border-amber-400 dark:border-amber-700/70 bg-amber-50 dark:bg-amber-950/40 text-amber-950 dark:text-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="Hadiah untuk dirimu..."
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-hogwarts-800 dark:text-hogwarts-300 mb-2 font-medium">
                Sesuaikan berapa EXP yang kamu dapatkan saat menyelesaikan tiap aksi belajar:
              </p>
              {rules.map((rule, idx) => (
                <div
                  key={rule.id}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-[#faf6ee] dark:bg-[#251f19] border-2 border-hogwarts-300 dark:border-[#382e24]"
                >
                  <div className="space-y-0.5">
                    <div className="text-xs font-serif font-bold text-hogwarts-950 dark:text-hogwarts-100">
                      {rule.activity}
                    </div>
                    <div className="text-[10px] text-hogwarts-700 dark:text-hogwarts-400 font-medium">
                      Sumber: {rule.source}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={rule.xpPerUnit}
                      onChange={(e) => handleRuleChange(idx, parseInt(e.target.value) || 0)}
                      className="w-20 px-3 py-1.5 text-xs font-bold text-tiffany-950 dark:text-tiffany-300 text-right rounded-xl border-2 border-hogwarts-300 dark:border-[#382e24] bg-white dark:bg-[#1c1814] focus:outline-none focus:ring-2 focus:ring-tiffany-600"
                    />
                    <span className="text-xs text-hogwarts-800 dark:text-hogwarts-300 font-bold">EXP / unit</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-6 border-t-2 border-hogwarts-200 dark:border-[#382e24] bg-[#faf6ee] dark:bg-[#251f19]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setLevels(state.leveling.levels);
                setRules(state.leveling.xpRules);
              }}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-hogwarts-700 dark:text-hogwarts-400 hover:text-hogwarts-950 dark:hover:text-hogwarts-100 rounded-xl"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Form
            </button>
            <button
              type="button"
              onClick={() => {
                const restored = levels.map(lvl => ({
                  ...lvl,
                  title: DEFAULT_LEVEL_TITLES[lvl.level] || lvl.title
                }));
                setLevels(restored);
              }}
              title="Kembalikan semua nama gelar ke standar resmi UKMPPD RPG (Level 1-11)"
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-tiffany-900 dark:text-tiffany-200 hover:text-tiffany-950 dark:hover:text-tiffany-100 bg-tiffany-100 dark:bg-tiffany-950/60 hover:bg-tiffany-200 dark:hover:bg-tiffany-900/80 border border-tiffany-300 dark:border-tiffany-700 rounded-xl transition"
            >
              <span>📜</span>
              Gelar Standar (1-11)
            </button>
          </div>
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
              Simpan Level & Hadiah ✨
            </button>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
};
