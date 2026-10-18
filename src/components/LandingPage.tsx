import React from 'react';
import {
  Sparkles,
  Crown,
  Compass,
  BookOpen,
  Target,
  Coffee,
  CheckCircle2,
  Shield,
  ArrowRight,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Award,
  Scroll,
  Zap,
  Users
} from 'lucide-react';
import { sounds } from '../utils/soundHelper';

interface Props {
  onOpenAuth: (mode: 'login' | 'register') => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export const LandingPage: React.FC<Props> = ({ onOpenAuth, darkMode, setDarkMode }) => {
  const [isMuted, setIsMuted] = React.useState(sounds.getMuted());

  const handleToggleSound = () => {
    const muted = sounds.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      sounds.playQuestComplete();
    }
  };

  return (
    <div className="min-h-screen bg-[#f5efe4] dark:bg-[#12100e] text-hogwarts-900 dark:text-hogwarts-100 transition-colors font-sans flex flex-col selection:bg-[#99f6e4] selection:text-[#042f2e]">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#faf6ee]/90 dark:bg-[#191613]/90 backdrop-blur-md border-b-2 border-hogwarts-300 dark:border-[#383028] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-tiffany-200 dark:bg-tiffany-950 border-2 border-tiffany-500 text-xl shadow-xs">
              🌲
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-lg text-hogwarts-950 dark:text-white tracking-tight">
                  Forbidden Forest
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-lg bg-tiffany-200 dark:bg-tiffany-900 text-tiffany-950 dark:text-tiffany-200 border border-tiffany-400 font-bold uppercase tracking-wider">
                  Ordo Medicus
                </span>
              </div>
              <p className="text-[11px] text-hogwarts-700 dark:text-hogwarts-400 font-medium">
                The Dark Woods of Medical Mastery
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => {
                sounds.playClick();
                setDarkMode(!darkMode);
              }}
              title={darkMode ? 'Mode Siang ☀️' : 'Mode Malam 🌙'}
              className="p-2 rounded-xl text-hogwarts-800 dark:text-hogwarts-300 hover:bg-hogwarts-200 dark:hover:bg-[#2b251f] border border-transparent hover:border-hogwarts-300 dark:hover:border-[#42382e] transition"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-teal-700" />}
            </button>

            <button
              onClick={handleToggleSound}
              title={isMuted ? 'Nyalakan Suara' : 'Matikan Suara'}
              className="p-2 rounded-xl text-hogwarts-800 dark:text-hogwarts-300 hover:bg-hogwarts-200 dark:hover:bg-[#2b251f] border border-transparent hover:border-hogwarts-300 dark:hover:border-[#42382e] transition"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-hogwarts-500" /> : <Volume2 className="w-4 h-4 text-tiffany-800 dark:text-tiffany-300" />}
            </button>

            <button
              onClick={() => { sounds.playClick(); onOpenAuth('login'); }}
              className="px-3.5 py-2 text-xs font-bold rounded-xl text-hogwarts-900 dark:text-hogwarts-200 hover:bg-hogwarts-200 dark:hover:bg-[#2b251f] border-2 border-hogwarts-300 dark:border-[#42382e] transition active:scale-95 cursor-pointer"
            >
              Masuk
            </button>

            <button
              onClick={() => { sounds.playClick(); onOpenAuth('register'); }}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-tiffany-200 hover:bg-tiffany-300 dark:bg-tiffany-800 dark:hover:bg-tiffany-700 text-tiffany-950 dark:text-white border-2 border-tiffany-700 dark:border-tiffany-500 shadow-sm transition active:scale-95 cursor-pointer font-serif"
            >
              Mulai Petualangan ⚔️
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24 border-b-2 border-hogwarts-300 dark:border-[#383028]">
        {/* Mystic ambient background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-tiffany-400/15 dark:bg-tiffany-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-tiffany-100 dark:bg-tiffany-950/80 text-tiffany-950 dark:text-tiffany-300 text-xs font-bold border-2 border-tiffany-300 dark:border-tiffany-700 font-serif shadow-xs">
            <Sparkles className="w-4 h-4 text-tiffany-700 dark:text-tiffany-400" />
            <span>Ekspedisi Menembus Hutan Terlarang Menuju Sumpah Dokter 🌲📜</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold text-hogwarts-950 dark:text-white tracking-tight leading-tight">
            Taklukkan UKMPPD & Stase Koas di <span className="text-tiffany-800 dark:text-tiffany-400 underline decoration-tiffany-400/40">Forbidden Forest</span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-hogwarts-700 dark:text-hogwarts-300 leading-relaxed font-medium">
            Belajar kedokteran itu berat dan penuh rintangan seperti menembus Hutan Terlarang.
            Satukan <strong>56 minggu rotasi stase</strong>, <strong>20 sistem SKDI spiral</strong>, <strong>10 Boss CBT Tryout</strong>, dan <strong>ritual energi anti-burnout</strong> dalam satu sanctum petualangan RPG magis.
          </p>

          {/* Primary Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => { sounds.playClick(); onOpenAuth('register'); }}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-tiffany-200 hover:bg-tiffany-300 dark:bg-tiffany-700 dark:hover:bg-tiffany-600 text-tiffany-950 dark:text-white border-2 border-tiffany-700 dark:border-tiffany-400 font-serif font-bold text-sm shadow-md transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>⚔️ Mulai Petualangan Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => { sounds.playClick(); onOpenAuth('login'); }}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#faf6ee] dark:bg-[#1a1612] hover:bg-hogwarts-200 dark:hover:bg-[#251f19] text-hogwarts-950 dark:text-hogwarts-100 border-2 border-hogwarts-400 dark:border-[#42382e] font-serif font-bold text-sm shadow-xs transition active:scale-95 cursor-pointer"
            >
              🏛️ Masuk ke Sanctum Dokter
            </button>
          </div>

          {/* Highlight Stats Ribbon */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-3 text-left">
            <div className="p-4 rounded-2xl bg-[#faf6ee] dark:bg-[#191613] border-2 border-hogwarts-300 dark:border-[#383028] shadow-xs">
              <div className="text-2xl mb-1">👑</div>
              <div className="font-serif font-bold text-sm text-hogwarts-950 dark:text-white">11 Tingkat Healer</div>
              <div className="text-[11px] text-hogwarts-700 dark:text-hogwarts-400 mt-0.5">RPG Level & Self-Reward buatanmu sendiri</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#faf6ee] dark:bg-[#191613] border-2 border-hogwarts-300 dark:border-[#383028] shadow-xs">
              <div className="text-2xl mb-1">📜</div>
              <div className="font-serif font-bold text-sm text-hogwarts-950 dark:text-white">56 Mgg & 70 Hari</div>
              <div className="text-[11px] text-hogwarts-700 dark:text-hogwarts-400 mt-0.5">Peta stase terpadu s/d D-Day UKMPPD</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#faf6ee] dark:bg-[#191613] border-2 border-hogwarts-300 dark:border-[#383028] shadow-xs">
              <div className="text-2xl mb-1">🔮</div>
              <div className="font-serif font-bold text-sm text-hogwarts-950 dark:text-white">20 Sistem SKDI</div>
              <div className="text-[11px] text-hogwarts-700 dark:text-hogwarts-400 mt-0.5">3-Pass spaced learning & bedah soal salah</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#faf6ee] dark:bg-[#191613] border-2 border-hogwarts-300 dark:border-[#383028] shadow-xs">
              <div className="text-2xl mb-1">☕</div>
              <div className="font-serif font-bold text-sm text-hogwarts-950 dark:text-white">3 Level Energi</div>
              <div className="text-[11px] text-hogwarts-700 dark:text-hogwarts-400 mt-0.5">Ritual dinas berat anti-burnout & konsisten</div>
            </div>
          </div>
        </div>
      </section>

      {/* 5 Core Realms Section */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-hogwarts-200 dark:bg-[#251f19] text-hogwarts-950 dark:text-hogwarts-200 text-xs font-bold border border-hogwarts-400 dark:border-[#383028] font-serif">
            <Compass className="w-3.5 h-3.5 text-amber-700" />
            <span>Peta 5 Wilayah Belajar</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-hogwarts-950 dark:text-white">
            Fitur Lengkap Menuju Kelulusan UKMPPD
          </h2>
          <p className="text-xs sm:text-sm text-hogwarts-700 dark:text-hogwarts-400">
            Didesain khusus untuk ritme kehidupan dokter muda dan koas yang dinamis, padat dinas, namun butuh target presisi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Sanctum Dokter */}
          <div className="p-6 rounded-3xl bg-[#faf6ee] dark:bg-[#191613] border-2 border-hogwarts-300 dark:border-[#383028] shadow-sm hover:border-tiffany-500 transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-tiffany-100 dark:bg-tiffany-950 border-2 border-tiffany-400 flex items-center justify-center text-2xl">
              🏛️
            </div>
            <h3 className="font-serif font-bold text-lg text-hogwarts-950 dark:text-white flex items-center gap-2">
              Sanctum Dokter <span className="text-xs text-tiffany-800 dark:text-tiffany-400 font-sans font-extrabold">Markas & Level</span>
            </h3>
            <p className="text-xs text-hogwarts-700 dark:text-hogwarts-400 leading-relaxed font-medium">
              Sistem 11 hierarki tingkat healer dengan poin XP murni dari kedisiplinan belajar. Tetapkan hadiah diri (*Self-Reward*) yang otomatis bisa kamu klaim setiap naik level.
            </p>
            <ul className="text-xs text-hogwarts-800 dark:text-hogwarts-300 space-y-1.5 pt-2">
              <li className="flex items-center gap-2">✓ 10 Lambang Kehormatan (Badges)</li>
              <li className="flex items-center gap-2">✓ Maskot dokter interaktif & mood pendamping</li>
              <li className="flex items-center gap-2">✓ Rincian perolehan EXP harian</li>
            </ul>
          </div>

          {/* Card 2: Peta Petualangan */}
          <div className="p-6 rounded-3xl bg-[#faf6ee] dark:bg-[#191613] border-2 border-hogwarts-300 dark:border-[#383028] shadow-sm hover:border-tiffany-500 transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950 border-2 border-amber-400 flex items-center justify-center text-2xl">
              🗺️
            </div>
            <h3 className="font-serif font-bold text-lg text-hogwarts-950 dark:text-white flex items-center gap-2">
              Peta Petualangan <span className="text-xs text-amber-800 dark:text-amber-400 font-sans font-extrabold">56 Mgg & 70 Hari</span>
            </h3>
            <p className="text-xs text-hogwarts-700 dark:text-hogwarts-400 leading-relaxed font-medium">
              Quest mingguan seluruh stase koas (Mayor, Minor, Paraklinis) diselaraskan dengan ekspedisi 70 hari persiapan intensif menjelang hari ujian UKMPPD.
            </p>
            <ul className="text-xs text-hogwarts-800 dark:text-hogwarts-300 space-y-1.5 pt-2">
              <li className="flex items-center gap-2">✓ Peta 56 minggu rotasi stase koas</li>
              <li className="flex items-center gap-2">✓ Jadwal intensif 70 hari otomatis tersinkron D-Day</li>
              <li className="flex items-center gap-2">✓ Mode belajar fleksibel: Lite, Steady, Sprint, UJIAN</li>
            </ul>
          </div>

          {/* Card 3: Grimoire Medis */}
          <div className="p-6 rounded-3xl bg-[#faf6ee] dark:bg-[#191613] border-2 border-hogwarts-300 dark:border-[#383028] shadow-sm hover:border-tiffany-500 transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950 border-2 border-purple-400 flex items-center justify-center text-2xl">
              🔮
            </div>
            <h3 className="font-serif font-bold text-lg text-hogwarts-950 dark:text-white flex items-center gap-2">
              Grimoire Medis <span className="text-xs text-purple-800 dark:text-purple-400 font-sans font-extrabold">20 SKDI & Error Book</span>
            </h3>
            <p className="text-xs text-hogwarts-700 dark:text-hogwarts-400 leading-relaxed font-medium">
              Metode spiral 3-pass spaced learning untuk 20 sistem organ SKDI, dilengkapi Grimoire Error untuk membedah akar kesalahan soal (lupa hafalan, gegabah, overthinking).
            </p>
            <ul className="text-xs text-hogwarts-800 dark:text-hogwarts-300 space-y-1.5 pt-2">
              <li className="flex items-center gap-2">✓ 20 Sistem SKDI dengan bintang progres</li>
              <li className="flex items-center gap-2">✓ Bedah soal salah dengan spaced repetition review (H+1, H+7, H+30)</li>
              <li className="flex items-center gap-2">✓ Kategori penyebab kesalahan kognitif</li>
            </ul>
          </div>

          {/* Card 4: Arena Ujian */}
          <div className="p-6 rounded-3xl bg-[#faf6ee] dark:bg-[#191613] border-2 border-hogwarts-300 dark:border-[#383028] shadow-sm hover:border-tiffany-500 transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950 border-2 border-rose-400 flex items-center justify-center text-2xl">
              🎯
            </div>
            <h3 className="font-serif font-bold text-lg text-hogwarts-950 dark:text-white flex items-center gap-2">
              Arena Ujian <span className="text-xs text-rose-800 dark:text-rose-400 font-sans font-extrabold">10 Boss CBT & OSCE</span>
            </h3>
            <p className="text-xs text-hogwarts-700 dark:text-hogwarts-400 leading-relaxed font-medium">
              Pertarungan 10 Boss Tryout CBT dengan kurva skor target vs aktual, serta Skill Tree 35 stasiun keterampilan klinis OSCE yang dapat dicentang bertahap.
            </p>
            <ul className="text-xs text-hogwarts-800 dark:text-hogwarts-300 space-y-1.5 pt-2">
              <li className="flex items-center gap-2">✓ Grafik perkembangan skor CBT menuju 100</li>
              <li className="flex items-center gap-2">✓ Analisis topik lemah per tryout</li>
              <li className="flex items-center gap-2">✓ 35 Checklist stasiun OSCE (Pahami, Solo, Partner, Dinilai)</li>
            </ul>
          </div>

          {/* Card 5: Ruang Ritual */}
          <div className="p-6 rounded-3xl bg-[#faf6ee] dark:bg-[#191613] border-2 border-hogwarts-300 dark:border-[#383028] shadow-sm hover:border-tiffany-500 transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 border-2 border-emerald-400 flex items-center justify-center text-2xl">
              ☕
            </div>
            <h3 className="font-serif font-bold text-lg text-hogwarts-950 dark:text-white flex items-center gap-2">
              Ruang Ritual <span className="text-xs text-emerald-800 dark:text-emerald-400 font-sans font-extrabold">Energi Anti-Burnout</span>
            </h3>
            <p className="text-xs text-hogwarts-700 dark:text-hogwarts-400 leading-relaxed font-medium">
              Pelacak ritual harian dengan 3 tingkat energi fleksibel (Level 0 Dinas Berat/Survival, Level 1 Normal, Level 2 Boost) agar kamu tetap konsisten tanpa pernah merasa bersalah.
            </p>
            <ul className="text-xs text-hogwarts-800 dark:text-hogwarts-300 space-y-1.5 pt-2">
              <li className="flex items-center gap-2">✓ Progress bar completion rate harian</li>
              <li className="flex items-center gap-2">✓ Grafik tren konsistensi yang bisa diset rentang waktunya</li>
              <li className="flex items-center gap-2">✓ Doktrin Healer Sokrates & strategi nalar soal</li>
            </ul>
          </div>

          {/* Card 6: Cloud Sync & Zero Lost Data */}
          <div className="p-6 rounded-3xl bg-[#faf6ee] dark:bg-[#191613] border-2 border-hogwarts-300 dark:border-[#383028] shadow-sm hover:border-tiffany-500 transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950 border-2 border-teal-400 flex items-center justify-center text-2xl">
              ☁️
            </div>
            <h3 className="font-serif font-bold text-lg text-hogwarts-950 dark:text-white flex items-center gap-2">
              Akses Cloud <span className="text-xs text-teal-800 dark:text-teal-400 font-sans font-extrabold">Multi-Device</span>
            </h3>
            <p className="text-xs text-hogwarts-700 dark:text-hogwarts-400 leading-relaxed font-medium">
              Sinkronkan riwayat belajarmu di laptop, tablet, dan smartphone melalui server tersentralisasi yang cepat dan terenkripsi aman.
            </p>
            <ul className="text-xs text-hogwarts-800 dark:text-hogwarts-300 space-y-1.5 pt-2">
              <li className="flex items-center gap-2">✓ Otomatis simpan ke basis data cloud</li>
              <li className="flex items-center gap-2">✓ Fitur impor/migrasi data browser lama 1-klik</li>
              <li className="flex items-center gap-2">✓ Cadangan manual via file JSON kapan saja</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Gamification Philosophy */}
      <section className="py-16 bg-[#faf6ee] dark:bg-[#161310] border-y-2 border-hogwarts-300 dark:border-[#383028]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-950 dark:text-amber-200 text-xs font-bold border border-amber-300 dark:border-amber-700 font-serif">
            <Shield className="w-3.5 h-3.5 text-amber-700" />
            <span>Filosofi Ordo Medicus</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-hogwarts-950 dark:text-white">
            "Bukan Berapa Jam Kamu Belajar, Tapi Berapa Konsisten Kamu Bertahan"
          </h2>

          <p className="text-xs sm:text-sm text-hogwarts-700 dark:text-hogwarts-300 leading-relaxed font-medium">
            Di Forbidden Forest, kamu tidak dipaksa untuk selalu belajar 10 jam setiap hari.
            Hari jaga malam IGD yang melelahkan diakui sebagai <strong>Level 0 (Survival)</strong> yang tetap memberimu EXP untuk menjaga api semangat.
            Saat stase santai, kamu bisa mengaktifkan <strong>Level 2 (Boost)</strong> untuk melipatgandakan bank soal.
          </p>

          <div className="pt-4">
            <button
              onClick={() => { sounds.playClick(); onOpenAuth('register'); }}
              className="px-8 py-3.5 rounded-2xl bg-tiffany-200 hover:bg-tiffany-300 dark:bg-tiffany-700 dark:hover:bg-tiffany-600 text-tiffany-950 dark:text-white border-2 border-tiffany-700 dark:border-tiffany-400 font-serif font-bold text-sm shadow-md transition active:scale-95 inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Bergabung dengan Ordo Medicus 🌿</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-xs text-hogwarts-800 dark:text-hogwarts-400 bg-[#f5efe4] dark:bg-[#12100e] font-medium">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-hogwarts-950 dark:text-white">Forbidden Forest 🌲</span>
            <span>·</span>
            <span>Ordo Medicus Healer Sanctum for Dokter Muda UKMPPD</span>
          </div>
          <div className="text-[11px] text-tiffany-900 dark:text-tiffany-400 font-bold">
            Semangat berjuang! Setiap lembar hafalan membawamu mendekati sumpah dokter 🩺✨
          </div>
        </div>
      </footer>
    </div>
  );
};

