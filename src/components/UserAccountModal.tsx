import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { trackerApi } from '../services/api';
import { ModalPortal } from './ModalPortal';
import {
  User,
  Mail,
  Cloud,
  LogOut,
  RefreshCw,
  CheckCircle2,
  X,
  Database,
  AlertTriangle,
  Trash2,
  Calendar,
  ShieldCheck,
  Edit2,
  Check,
  Settings
} from 'lucide-react';
import { sounds } from '../utils/soundHelper';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOpenBackup: () => void;
}

export const UserAccountModal: React.FC<Props> = ({ isOpen, onClose, onOpenBackup }) => {
  const { user, logout, updateProfile, deleteAccount } = useAuth();
  const { state } = useApp();

  const [activeTab, setActiveTab] = useState<'profile' | 'danger'>('profile');

  // Edit name state
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [isSavingName, setIsSavingName] = useState(false);
  const [nameSuccess, setNameSuccess] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);

  // Cloud sync state
  const [syncing, setSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  // Danger zone state
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Synchronize nameInput when modal opens or user updates
  useEffect(() => {
    if (user) {
      setNameInput(user.fullName || '');
    }
    // Reset tab and danger zone input on reopen
    if (isOpen) {
      setActiveTab('profile');
      setIsEditingName(false);
      setNameError(null);
      setNameSuccess(false);
      setDeleteConfirmText('');
      setDeleteError(null);
    }
  }, [isOpen, user]);

  if (!isOpen || !user) return null;

  const handleSync = async () => {
    setSyncing(true);
    setSyncSuccess(false);
    sounds.playClick();

    const res = await trackerApi.syncState(state);
    setSyncing(false);
    if (res.success) {
      setSyncSuccess(true);
      sounds.playQuestComplete();
      setTimeout(() => setSyncSuccess(false), 3500);
    }
  };

  const handleSaveName = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!nameInput.trim() || nameInput.trim().length < 2) {
      setNameError('Nama lengkap minimal 2 karakter.');
      return;
    }

    setIsSavingName(true);
    setNameError(null);
    sounds.playClick();

    const res = await updateProfile(nameInput.trim());
    setIsSavingName(false);

    if (res.success) {
      setIsEditingName(false);
      setNameSuccess(true);
      sounds.playLevelUp();
      setTimeout(() => setNameSuccess(false), 3000);
    } else {
      setNameError(res.message || 'Gagal menyimpan nama');
    }
  };

  const handleLogout = async () => {
    sounds.playClick();
    await logout();
    onClose();
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText.trim().toUpperCase() !== 'HAPUS AKUN SAYA') {
      setDeleteError('Teks konfirmasi tidak sesuai. Ketik persis "HAPUS AKUN SAYA".');
      return;
    }

    setIsDeleting(true);
    setDeleteError(null);
    sounds.playClick();

    const res = await deleteAccount();
    setIsDeleting(false);

    if (res.success) {
      onClose();
      // Optional browser alert or notification
    } else {
      setDeleteError(res.message || 'Gagal menghapus akun. Silakan coba lagi.');
    }
  };

  const formattedJoinDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    : 'Anggota Aktif';

  const isGoogleUser = Boolean(user.googleId);

  return (
    <ModalPortal isOpen={isOpen} onClose={onClose}>
      <div className="relative w-full max-w-lg rounded-3xl bg-[#faf6ee] dark:bg-[#1c1814] border-2 border-hogwarts-300 dark:border-[#3d3328] shadow-2xl p-6 sm:p-7 space-y-5 text-hogwarts-950 dark:text-hogwarts-100 animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={() => { sounds.playClick(); onClose(); }}
          className="absolute top-5 right-5 p-2 rounded-xl text-hogwarts-600 dark:text-hogwarts-400 hover:bg-hogwarts-200 dark:hover:bg-[#2c241c] transition cursor-pointer"
          aria-label="Tutup pengaturan akun"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-tiffany-100 dark:bg-tiffany-950/80 border-2 border-tiffany-400 text-tiffany-900 dark:text-tiffany-200">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-serif text-2xl font-bold text-hogwarts-950 dark:text-white leading-tight">
              Pengaturan Akun
            </h2>
            <p className="text-xs text-hogwarts-700 dark:text-hogwarts-400 font-medium">
              Kelola profil, sinkronisasi cloud, dan keamanan akun belajarmu
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 bg-hogwarts-200 dark:bg-[#26201a] rounded-2xl border border-hogwarts-300 dark:border-[#382e24]">
          <button
            onClick={() => { sounds.playClick(); setActiveTab('profile'); }}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-[#fdfcf9] dark:bg-[#1a1612] text-tiffany-950 dark:text-tiffany-300 shadow-sm border border-hogwarts-300 dark:border-[#3f3429]'
                : 'text-hogwarts-700 dark:text-hogwarts-400 hover:text-hogwarts-950 dark:hover:text-white'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profil & Cloud</span>
          </button>
          <button
            onClick={() => { sounds.playClick(); setActiveTab('danger'); }}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'danger'
                ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200 shadow-sm border border-rose-300 dark:border-rose-800'
                : 'text-rose-700 dark:text-rose-400 hover:text-rose-900 dark:hover:text-rose-200'
            }`}
          >
            <Trash2 className="w-4 h-4" />
            <span>Zona Berbahaya</span>
          </button>
        </div>

        {/* TAB 1: PROFIL & CLOUD */}
        {activeTab === 'profile' && (
          <div className="space-y-4">
            {/* User Profile Card */}
            <div className="p-4 rounded-2xl bg-[#fdfcf9] dark:bg-[#211c17] border-2 border-hogwarts-300 dark:border-[#382e24] space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.fullName}
                      className="w-13 h-13 rounded-2xl object-cover border-2 border-tiffany-500 shadow-xs"
                    />
                  ) : (
                    <div className="w-13 h-13 rounded-2xl bg-tiffany-200 dark:bg-tiffany-900 border-2 border-tiffany-500 flex items-center justify-center text-xl font-bold font-serif text-tiffany-950 dark:text-tiffany-200 shadow-xs">
                      {user.fullName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    {!isEditingName ? (
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-base text-hogwarts-950 dark:text-white">
                          {user.fullName}
                        </span>
                        <button
                          onClick={() => {
                            sounds.playClick();
                            setIsEditingName(true);
                            setNameInput(user.fullName);
                          }}
                          title="Ubah nama tampilan"
                          className="p-1 rounded-lg hover:bg-hogwarts-200 dark:hover:bg-[#2c241c] text-hogwarts-600 dark:text-hogwarts-400 transition cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleSaveName} className="flex items-center gap-1.5 mt-0.5">
                        <input
                          type="text"
                          value={nameInput}
                          onChange={(e) => setNameInput(e.target.value)}
                          placeholder="Nama Lengkap"
                          autoFocus
                          className="px-2.5 py-1 text-xs rounded-xl bg-white dark:bg-[#161310] border-2 border-tiffany-500 text-hogwarts-950 dark:text-white focus:outline-hidden font-medium"
                        />
                        <button
                          type="submit"
                          disabled={isSavingName}
                          className="p-1.5 rounded-xl bg-tiffany-500 hover:bg-tiffany-600 text-white font-bold text-xs transition cursor-pointer disabled:opacity-50"
                        >
                          {isSavingName ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditingName(false)}
                          className="p-1.5 rounded-xl bg-hogwarts-200 dark:bg-[#2c241c] text-hogwarts-700 dark:text-hogwarts-400 text-xs transition cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </form>
                    )}

                    <div className="text-xs text-hogwarts-700 dark:text-hogwarts-400 font-medium flex items-center gap-1.5 mt-0.5">
                      <Mail className="w-3.5 h-3.5" />
                      <span>{user.email}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  {isGoogleUser ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-900 dark:text-blue-300 text-[10px] font-bold border border-blue-300 dark:border-blue-800">
                      <span>G</span> Google
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-hogwarts-200 dark:bg-[#2a241e] text-hogwarts-800 dark:text-hogwarts-300 text-[10px] font-bold border border-hogwarts-300 dark:border-[#3d3328]">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" /> Sandi
                    </span>
                  )}
                </div>
              </div>

              {nameSuccess && (
                <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-400 text-emerald-900 dark:text-emerald-200 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Nama berhasil diperbarui!
                </div>
              )}

              {nameError && (
                <div className="p-2 rounded-xl bg-rose-100 dark:bg-rose-950/80 border border-rose-400 text-rose-900 dark:text-rose-200 text-xs font-bold flex items-center gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  {nameError}
                </div>
              )}

              <div className="pt-2 border-t border-hogwarts-200 dark:border-[#2e261e] flex items-center justify-between text-[11px] text-hogwarts-600 dark:text-hogwarts-400 font-medium">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Terdaftar: {formattedJoinDate}</span>
                </div>
                <div className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-bold">
                  <Cloud className="w-3.5 h-3.5" />
                  <span>Cloud Sync Aktif</span>
                </div>
              </div>
            </div>

            {/* Cloud Sync & Action Buttons */}
            <div className="space-y-2.5">
              <button
                onClick={handleSync}
                disabled={syncing}
                className="w-full py-3 rounded-2xl bg-tiffany-200 hover:bg-tiffany-300 dark:bg-tiffany-800 dark:hover:bg-tiffany-700 text-tiffany-950 dark:text-white border-2 border-tiffany-700 font-serif font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition active:scale-98 disabled:opacity-50 cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
                {syncing ? 'Menyinkronkan Progres...' : 'Sinkronkan Progres ke Cloud Sekarang ☁️'}
              </button>

              {syncSuccess && (
                <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-400 text-emerald-950 dark:text-emerald-200 text-xs font-bold flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Semua data terbaru berhasil disinkronkan ke cloud!
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => { sounds.playClick(); onOpenBackup(); onClose(); }}
                  className="py-2.5 px-3 rounded-xl bg-[#fdfcf9] dark:bg-[#211c17] hover:bg-hogwarts-100 dark:hover:bg-[#2b251f] text-hogwarts-900 dark:text-hogwarts-200 border-2 border-hogwarts-300 dark:border-[#382e24] font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Database className="w-3.5 h-3.5 text-hogwarts-600 dark:text-hogwarts-400" />
                  <span>Cadangan JSON</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="py-2.5 px-3 rounded-xl bg-hogwarts-100 dark:bg-[#241e19] hover:bg-hogwarts-200 dark:hover:bg-[#2d261f] text-hogwarts-900 dark:text-hogwarts-200 border-2 border-hogwarts-300 dark:border-[#382e24] font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5 text-hogwarts-700 dark:text-hogwarts-400" />
                  <span>Keluar Akun</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ZONA BERBAHAYA (DELETE ACCOUNT) */}
        {activeTab === 'danger' && (
          <div className="space-y-4">
            {/* Warning Card */}
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-300 dark:border-rose-900 space-y-3">
              <div className="flex items-center gap-2.5 text-rose-950 dark:text-rose-200">
                <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
                <h3 className="font-serif font-bold text-sm">
                  Peringatan: Penghapusan Akun Bersifat Permanen!
                </h3>
              </div>
              <p className="text-xs text-rose-900 dark:text-rose-300/90 leading-relaxed font-medium">
                Jika kamu menghapus akun, seluruh data dan catatan belajarmu di Doctor Tracker akan dihapus secara permanen dari server dan tidak dapat dipulihkan kembali.
              </p>
            </div>

            {/* List of Data to be Deleted */}
            <div className="p-3.5 rounded-2xl bg-[#fdfcf9] dark:bg-[#211c17] border border-hogwarts-300 dark:border-[#382e24] space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-hogwarts-700 dark:text-hogwarts-400 font-serif">
                Data yang akan dihapus selamanya:
              </div>
              <ul className="text-xs text-hogwarts-800 dark:text-hogwarts-300 space-y-1.5 font-medium">
                <li className="flex items-center gap-2">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>Target UKMPPD CBT, batas aman, dan data kelulusan</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>Progres 14 Sistem SKDI & Buku Catatan Kesalahan</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>Seluruh riwayat Tryout CBT & skor latihan</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>Rencana Roadmap Mingguan & Program Intensif Harian</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>Daftar stase klinik & checklist keahlian OSCE</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>Rutinitas kebiasaan harian, streak, dan leveling XP</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>Kredensial login, sesi cloud, dan akun pengguna</span>
                </li>
              </ul>
            </div>

            {/* Confirmation Challenge Input */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-hogwarts-900 dark:text-hogwarts-200">
                Ketik <span className="font-mono text-rose-700 dark:text-rose-400 bg-rose-100 dark:bg-rose-950 px-1.5 py-0.5 rounded border border-rose-300 dark:border-rose-800">HAPUS AKUN SAYA</span> untuk mengonfirmasi:
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => {
                  setDeleteConfirmText(e.target.value);
                  setDeleteError(null);
                }}
                placeholder='Ketik "HAPUS AKUN SAYA"'
                disabled={isDeleting}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#161310] border-2 border-rose-300 dark:border-rose-800 focus:border-rose-500 text-hogwarts-950 dark:text-white placeholder:text-hogwarts-400 text-xs font-mono font-bold tracking-wide focus:outline-hidden transition disabled:opacity-50"
              />
            </div>

            {deleteError && (
              <div className="p-2.5 rounded-xl bg-rose-100 dark:bg-rose-950 border border-rose-400 text-rose-950 dark:text-rose-200 text-xs font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{deleteError}</span>
              </div>
            )}

            {/* Permanent Delete Action Button */}
            <button
              onClick={handleDeleteAccount}
              disabled={isDeleting || deleteConfirmText.trim().toUpperCase() !== 'HAPUS AKUN SAYA'}
              className="w-full py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 disabled:bg-rose-300 dark:disabled:bg-rose-950/40 text-white font-serif font-bold text-xs flex items-center justify-center gap-2 shadow-md transition active:scale-98 disabled:cursor-not-allowed cursor-pointer"
            >
              {isDeleting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Menghapus Akun & Data Belajar...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  <span>Hapus Akun & Seluruh Data Secara Permanen</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </ModalPortal>
  );
};
