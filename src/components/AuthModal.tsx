import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Lock, Mail, Sparkles, X, LogIn, UserPlus } from 'lucide-react';
import { sounds } from '../utils/soundHelper';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<Props> = ({ isOpen, onClose, onSuccess, initialMode = 'login' }) => {
  const { login, register, loginWithGoogle } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasGoogleBtn, setHasGoogleBtn] = useState(false);

  const handleGoogleResponse = async (response: any) => {
    if (response?.credential) {
      setLoading(true);
      setErrorMsg('');
      sounds.playClick();
      const res = await loginWithGoogle(response.credential);
      setLoading(false);
      if (res.success) {
        sounds.playLevelUp();
        onClose();
        if (onSuccess) onSuccess();
      } else {
        setErrorMsg(res.message || 'Login dengan Google gagal.');
      }
    }
  };

  React.useEffect(() => {
    if (initialMode) {
      setMode(initialMode);
    }
  }, [initialMode, isOpen]);

  React.useEffect(() => {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!isOpen) {
      setHasGoogleBtn(false);
      return;
    }

    const renderGoogleBtn = () => {
      if (googleClientId && (window as any).google?.accounts?.id) {
        try {
          const google = (window as any).google;
          google.accounts.id.initialize({
            client_id: googleClientId,
            callback: handleGoogleResponse
          });

          const btnContainer = document.getElementById('google-btn-slot');
          if (btnContainer) {
            btnContainer.innerHTML = '';
            const isDark = document.documentElement.classList.contains('dark');
            google.accounts.id.renderButton(btnContainer, {
              theme: isDark ? 'filled_black' : 'outline',
              size: 'large',
              width: 360,
              text: mode === 'login' ? 'signin_with' : 'signup_with',
              shape: 'pill'
            });
            setHasGoogleBtn(true);
            return true;
          }
        } catch {
          setHasGoogleBtn(false);
        }
      }
      return false;
    };

    if (!renderGoogleBtn()) {
      const timer = setTimeout(() => {
        renderGoogleBtn();
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [isOpen, mode]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    sounds.playClick();

    if (mode === 'login') {
      const res = await login(email, password);
      setLoading(false);
      if (res.success) {
        sounds.playLevelUp();
        onClose();
        if (onSuccess) onSuccess();
      } else {
        setErrorMsg(res.message || 'Login gagal.');
      }
    } else {
      if (!fullName.trim()) {
        setErrorMsg('Nama lengkap harus diisi.');
        setLoading(false);
        return;
      }
      const res = await register(email, password, fullName);
      setLoading(false);
      if (res.success) {
        sounds.playLevelUp();
        onClose();
        if (onSuccess) onSuccess();
      } else {
        setErrorMsg(res.message || 'Pendaftaran gagal.');
      }
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
        className="relative w-full max-w-md my-auto rounded-3xl bg-[#faf6ee] dark:bg-[#1c1814] border-2 border-hogwarts-300 dark:border-[#3d3328] shadow-2xl p-6 sm:p-8 space-y-6 cursor-default"
      >
        {/* Close Button */}
        <button
          onClick={() => { sounds.playClick(); onClose(); }}
          className="absolute top-5 right-5 p-2 rounded-xl text-hogwarts-600 dark:text-hogwarts-400 hover:bg-hogwarts-200 dark:hover:bg-[#2c241c] transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tiffany-100 dark:bg-tiffany-950/80 text-tiffany-950 dark:text-tiffany-300 text-xs font-bold border border-tiffany-300 dark:border-tiffany-700 font-serif">
            <Sparkles className="w-3.5 h-3.5 text-tiffany-700" />
            <span>Forbidden Forest Cloud 🌲</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-hogwarts-950 dark:text-hogwarts-100">
            {mode === 'login' ? 'Masuk ke Forbidden Forest' : 'Daftar Penjelajah Baru'}
          </h2>
          <p className="text-xs text-hogwarts-700 dark:text-hogwarts-400">
            {mode === 'login'
              ? 'Sinkronkan seluruh target, tryout, dan ritual belajarmu ke semua perangkat!'
              : 'Mulai petualangan belajarmu dengan backup cloud otomatis dan aman.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 rounded-2xl bg-hogwarts-200/70 dark:bg-[#251f19] border border-hogwarts-300 dark:border-[#382e24]">
          <button
            type="button"
            onClick={() => { setMode('login'); setErrorMsg(''); }}
            className={`py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
              mode === 'login'
                ? 'bg-[#fdfcf9] dark:bg-[#1a1612] text-hogwarts-950 dark:text-hogwarts-100 shadow-xs'
                : 'text-hogwarts-700 dark:text-hogwarts-400 hover:text-hogwarts-950'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" /> Masuk
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setErrorMsg(''); }}
            className={`py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
              mode === 'register'
                ? 'bg-[#fdfcf9] dark:bg-[#1a1612] text-hogwarts-950 dark:text-hogwarts-100 shadow-xs'
                : 'text-hogwarts-700 dark:text-hogwarts-400 hover:text-hogwarts-950'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" /> Daftar
          </button>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-100/90 dark:bg-rose-950/80 border border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200 text-xs font-medium">
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Google Sign-in Section */}
        <div className="flex flex-col items-center justify-center w-full min-h-[44px]">
          <div
            id="google-btn-slot"
            className={`flex justify-center w-full ${!hasGoogleBtn ? 'hidden' : ''}`}
          ></div>

          {!hasGoogleBtn && (
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
                if (!googleClientId) {
                  setErrorMsg('Google Client ID belum diatur. Masukkan VITE_GOOGLE_CLIENT_ID di file .env untuk mengaktifkannya.');
                  return;
                }
                if ((window as any).google?.accounts?.id) {
                  (window as any).google.accounts.id.prompt();
                } else {
                  setErrorMsg('Layanan Google Sign-in sedang memuat atau terblokir ad-blocker.');
                }
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-white dark:bg-[#251f19] hover:bg-stone-50 dark:hover:bg-[#2e261f] text-stone-800 dark:text-stone-200 border-2 border-stone-300 dark:border-[#42382e] font-bold text-xs flex items-center justify-center gap-2.5 shadow-xs transition active:scale-95 cursor-pointer"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>{mode === 'login' ? 'Lanjutkan dengan Akun Google' : 'Daftar dengan Akun Google'}</span>
            </button>
          )}
        </div>

        {/* Divider */}
        <div className="relative flex items-center">
          <div className="flex-grow border-t border-hogwarts-300 dark:border-[#382e24]"></div>
          <span className="shrink-0 mx-3 text-[11px] text-hogwarts-600 dark:text-hogwarts-400 font-medium">
            atau gunakan email & sandi
          </span>
          <div className="flex-grow border-t border-hogwarts-300 dark:border-[#382e24]"></div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-hogwarts-800 dark:text-hogwarts-300 mb-1">
                Nama Lengkap & Gelar
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-hogwarts-500" />
                <input
                  type="text"
                  required
                  placeholder="e.g. dr. Sarah Wijaya"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#fdfcf9] dark:bg-[#211c17] border-2 border-hogwarts-300 dark:border-[#382e24] text-xs text-hogwarts-950 dark:text-hogwarts-100 font-medium focus:border-tiffany-500 outline-hidden transition"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-hogwarts-800 dark:text-hogwarts-300 mb-1">
              Alamat Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-hogwarts-500" />
              <input
                type="email"
                required
                placeholder="dokter@akademik.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#fdfcf9] dark:bg-[#211c17] border-2 border-hogwarts-300 dark:border-[#382e24] text-xs text-hogwarts-950 dark:text-hogwarts-100 font-medium focus:border-tiffany-500 outline-hidden transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-hogwarts-800 dark:text-hogwarts-300 mb-1">
              Kata Sandi
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-hogwarts-500" />
              <input
                type="password"
                required
                placeholder="Minimal 6 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#fdfcf9] dark:bg-[#211c17] border-2 border-hogwarts-300 dark:border-[#382e24] text-xs text-hogwarts-950 dark:text-hogwarts-100 font-medium focus:border-tiffany-500 outline-hidden transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-tiffany-200 hover:bg-tiffany-300 dark:bg-tiffany-800 dark:hover:bg-tiffany-700 text-tiffany-950 dark:text-white border-2 border-tiffany-700 dark:border-tiffany-500 font-serif font-bold text-sm shadow-md transition active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Menghubungkan...' : mode === 'login' ? 'Masuk ke Forbidden Forest 🌲' : 'Daftar & Taklukkan Hutan 📜'}
          </button>
        </form>
      </div>
    </div>
  );
};

