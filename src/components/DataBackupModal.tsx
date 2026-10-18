import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Download, Upload, RotateCcw, X, CheckCircle2, AlertTriangle, Sparkles, Scroll } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ModalPortal } from './ModalPortal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const DataBackupModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { exportDataJSON, importDataJSON, resetToDefaultData } = useApp();
  const [importStatus, setImportStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDownloadBackup = () => {
    const jsonStr = exportDataJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dr-journey-ukmppd-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.7 }
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importDataJSON(content);
      if (success) {
        setImportStatus('success');
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.6 }
        });
        setTimeout(() => {
          setImportStatus(null);
          onClose();
        }, 1500);
      } else {
        setImportStatus('error');
      }
    };
    reader.readAsText(file);
  };

  return (
    <ModalPortal isOpen={isOpen} onClose={onClose}>
      <div className="bg-[#fdfcf9] dark:bg-[#1c1814] border-2 border-hogwarts-300 dark:border-[#3d3328] rounded-3xl w-full max-w-md shadow-2xl p-6 space-y-5 animate-in zoom-in-95 duration-200 text-hogwarts-950 dark:text-hogwarts-100">
        <div className="flex items-center justify-between border-b-2 border-hogwarts-200 dark:border-[#382e24] pb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">💾</span>
            <div>
              <h3 className="font-serif text-lg font-bold text-hogwarts-950 dark:text-hogwarts-100">
                Penyimpanan & Cadangan Data
              </h3>
              <p className="text-xs text-hogwarts-700 dark:text-hogwarts-400 font-medium">
                Amankan seluruh catatan perjalanan belajarmu ke dalam arsip JSON.
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

        {importStatus === 'success' && (
          <div className="flex items-center gap-2 p-3 bg-emerald-100 dark:bg-emerald-950/70 text-emerald-950 dark:text-emerald-200 text-xs rounded-xl border-2 border-emerald-400 dark:border-emerald-700/60 font-bold">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-800 dark:text-emerald-400" />
            <span>Data berhasil dipulihkan dari file backup! 📜</span>
          </div>
        )}

        {importStatus === 'error' && (
          <div className="flex items-center gap-2 p-3 bg-rose-100 dark:bg-rose-950/70 text-rose-950 dark:text-rose-200 text-xs rounded-xl border-2 border-rose-400 dark:border-rose-700/60 font-bold">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-800 dark:text-rose-400" />
            <span>Format file JSON tidak valid. Pastikan file backup sesuai.</span>
          </div>
        )}

        <div className="space-y-3">
          {/* Download */}
          <button
            onClick={handleDownloadBackup}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#faf6ee] dark:bg-[#251f19] hover:bg-parchment-100 dark:hover:bg-[#2e261f] border-2 border-hogwarts-300 dark:border-[#382e24] text-hogwarts-950 dark:text-hogwarts-100 transition active:scale-95"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">📜</span>
              <div className="text-left">
                <div className="font-serif text-sm font-bold text-hogwarts-950 dark:text-hogwarts-100">
                  Unduh Cadangan Data JSON
                </div>
                <div className="text-[11px] text-hogwarts-700 dark:text-hogwarts-400 font-medium">
                  Simpan jadwal stase, riwayat tryout, dan Grimoire Error
                </div>
              </div>
            </div>
            <Download className="w-4 h-4 text-tiffany-700 dark:text-tiffany-400" />
          </button>

          {/* Upload */}
          <label className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-tiffany-100/70 dark:bg-tiffany-950/60 hover:bg-tiffany-100 dark:hover:bg-tiffany-950/80 border-2 border-tiffany-300 dark:border-tiffany-700 text-tiffany-950 dark:text-tiffany-200 transition cursor-pointer active:scale-95">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📂</span>
              <div className="text-left">
                <div className="font-serif text-sm font-bold text-tiffany-950 dark:text-tiffany-200">
                  Pulihkan dari File Backup
                </div>
                <div className="text-[11px] text-tiffany-900 dark:text-tiffany-300 font-medium">
                  Pilih file .json cadangan dari perangkatmu
                </div>
              </div>
            </div>
            <Upload className="w-4 h-4 text-tiffany-700 dark:text-tiffany-400" />
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          {/* Reset */}
          <button
            onClick={() => {
              if (window.confirm('Apakah kamu yakin ingin memuat ulang data ke seed_data.xlsx? Semua perubahan kustom yang belum dicadangkan akan terganti.')) {
                resetToDefaultData();
                confetti({
                  particleCount: 50,
                  spread: 60,
                  origin: { y: 0.6 }
                });
                onClose();
              }
            }}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-rose-100/60 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-950/60 border-2 border-rose-300 dark:border-rose-800 text-rose-950 dark:text-rose-200 transition active:scale-95"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🌱</span>
              <div className="text-left">
                <div className="font-serif text-sm font-bold text-rose-950 dark:text-rose-200">
                  Muat Ulang Seed Data (seed_data.xlsx)
                </div>
                <div className="text-[11px] text-rose-800 dark:text-rose-300 font-medium">
                  Reset semua data kembali ke template resmi seed_data.xlsx
                </div>
              </div>
            </div>
            <RotateCcw className="w-4 h-4 text-rose-700 dark:text-rose-400" />
          </button>
        </div>

        <div className="pt-2 text-center">
          <button
            onClick={onClose}
            className="text-xs font-bold text-hogwarts-700 dark:text-hogwarts-400 hover:text-hogwarts-950 dark:hover:text-hogwarts-100"
          >
            Tutup
          </button>
        </div>
      </div>
    </ModalPortal>
  );
};
