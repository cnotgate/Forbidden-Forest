import { DailyHabitLog } from '../types';
import { addDaysToDateStr } from './dateHelper';

export interface StreakMilestone {
  days: number;
  title: string;
  badge: string;
  xpReward: number;
  description: string;
  unlocked: boolean;
}

export interface WeekDayActivity {
  dayName: string;
  dateStr: string;
  dayNumber: number;
  isCompleted: boolean;
  isToday: boolean;
  isFuture: boolean;
}

export interface StreakInfo {
  currentStreak: number;
  longestStreak: number;
  isTodayCompleted: boolean;
  status: 'completed_today' | 'at_risk' | 'broken';
  weekDays: WeekDayActivity[];
  milestones: StreakMilestone[];
  nextMilestone: StreakMilestone | null;
  daysToNextMilestone: number;
  hoursRemainingToday: number;
  minutesRemainingToday: number;
  motivationalMessage: string;
  flameLevel: number; // 0 (padam), 1 (bara), 2 (kobaran sedang), 3 (kobaran hebat 7+ hari), 4 (api abadi 30+ hari)
}

export function getTodayDateStr(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function isDateActive(dateStr: string, dailyHabitLogs: Record<string, DailyHabitLog>): boolean {
  const log = dailyHabitLogs[dateStr];
  if (!log) return false;
  // A day is active if user completed at least 1 habit, or marked habit level with activity
  return Array.isArray(log.habitsDone) && log.habitsDone.length > 0;
}

export function calculateStreak(
  dailyHabitLogs: Record<string, DailyHabitLog> = {},
  doctorAvatar?: string
): StreakInfo {
  const todayStr = getTodayDateStr();
  const yesterdayStr = addDaysToDateStr(todayStr, -1);

  const isTodayCompleted = isDateActive(todayStr, dailyHabitLogs);
  const isYesterdayCompleted = isDateActive(yesterdayStr, dailyHabitLogs);

  // 1. Calculate Current Streak
  let currentStreak = 0;
  let status: 'completed_today' | 'at_risk' | 'broken' = 'broken';

  if (isTodayCompleted) {
    status = 'completed_today';
    currentStreak = 1;
    let checkDate = yesterdayStr;
    while (isDateActive(checkDate, dailyHabitLogs)) {
      currentStreak++;
      checkDate = addDaysToDateStr(checkDate, -1);
    }
  } else if (isYesterdayCompleted) {
    status = 'at_risk';
    currentStreak = 1;
    let checkDate = addDaysToDateStr(yesterdayStr, -1);
    while (isDateActive(checkDate, dailyHabitLogs)) {
      currentStreak++;
      checkDate = addDaysToDateStr(checkDate, -1);
    }
  } else {
    status = 'broken';
    currentStreak = 0;
  }

  // 2. Calculate Longest Streak in history
  const activeDates = Object.keys(dailyHabitLogs)
    .filter(d => isDateActive(d, dailyHabitLogs))
    .sort();

  let longestStreak = currentStreak;
  let tempStreak = 0;
  let prevDate: string | null = null;

  for (const date of activeDates) {
    if (!prevDate) {
      tempStreak = 1;
    } else {
      const expectedNext = addDaysToDateStr(prevDate, 1);
      if (date === expectedNext) {
        tempStreak++;
      } else {
        tempStreak = 1;
      }
    }
    if (tempStreak > longestStreak) {
      longestStreak = tempStreak;
    }
    prevDate = date;
  }

  // 3. Flame Level
  let flameLevel = 0;
  if (currentStreak >= 30) flameLevel = 4;
  else if (currentStreak >= 7) flameLevel = 3;
  else if (currentStreak >= 3) flameLevel = 2;
  else if (currentStreak >= 1) flameLevel = 1;
  else flameLevel = 0;

  // 4. Week Days (Current Week Monday -> Sunday)
  const now = new Date();
  const currentDayOfWeek = now.getDay(); // 0 is Sunday, 1 is Monday...
  const distanceToMonday = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
  const mondayDate = new Date(now);
  mondayDate.setDate(now.getDate() + distanceToMonday);

  const dayLabels = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
  const weekDays: WeekDayActivity[] = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date(mondayDate);
    d.setDate(mondayDate.getDate() + i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateStr = `${y}-${m}-${day}`;

    const isToday = dateStr === todayStr;
    const isFuture = dateStr > todayStr;
    const isCompleted = isDateActive(dateStr, dailyHabitLogs);

    weekDays.push({
      dayName: dayLabels[i],
      dateStr,
      dayNumber: d.getDate(),
      isCompleted,
      isToday,
      isFuture
    });
  }

  // 5. Milestones definition
  const rawMilestones: Omit<StreakMilestone, 'unlocked'>[] = [
    {
      days: 3,
      title: 'Bara Permulaan',
      badge: '🕯️',
      xpReward: 50,
      description: 'Langkah awal membangun ritme belajar dokter yang disiplin.'
    },
    {
      days: 7,
      title: 'Api Healer Mingguan',
      badge: '🔥',
      xpReward: 150,
      description: 'Satu minggu penuh tanpa jeda menjaga api ritual kelulusan.'
    },
    {
      days: 14,
      title: 'Kobaran Stase Tangguh',
      badge: '⚡',
      xpReward: 300,
      description: 'Dua minggu konsisten menghadapi lelahnya rotasi stase.'
    },
    {
      days: 21,
      title: 'Pondasi Habit Emas',
      badge: '🌟',
      xpReward: 500,
      description: 'Hukum 21 hari: rutinitas belajar kini telah menjadi refleks bawah sadar.'
    },
    {
      days: 30,
      title: 'Master Api Abadi UKMPPD',
      badge: '👑',
      xpReward: 1000,
      description: 'Satu bulan penuh pantang menyerah mendekati sumpah dokter.'
    },
    {
      days: 60,
      title: 'Penyembuh Legendaris',
      badge: '🏆',
      xpReward: 2000,
      description: 'Konsistensi tingkat tinggi yang menginspirasi rekan sejawat.'
    },
    {
      days: 100,
      title: 'Centurion Sumpah Dokter',
      badge: '💎',
      xpReward: 5000,
      description: 'Puncak dedikasi klinis! Gelar dokter impian sudah di depan mata.'
    }
  ];

  const milestones: StreakMilestone[] = rawMilestones.map(m => ({
    ...m,
    unlocked: currentStreak >= m.days || longestStreak >= m.days
  }));

  const nextMilestone = milestones.find(m => currentStreak < m.days) || null;
  const daysToNextMilestone = nextMilestone ? nextMilestone.days - currentStreak : 0;

  // 6. Time remaining until midnight
  const midnight = new Date();
  midnight.setHours(23, 59, 59, 999);
  const diffMs = Math.max(0, midnight.getTime() - now.getTime());
  const hoursRemainingToday = Math.floor(diffMs / (1000 * 60 * 60));
  const minutesRemainingToday = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  // 7. Motivational message (Authentic Harry Potter Mascot Persona)
  const motivationalMessage = getCharacterStreakMessage(
    doctorAvatar,
    status,
    currentStreak,
    hoursRemainingToday,
    minutesRemainingToday
  );

  return {
    currentStreak,
    longestStreak,
    isTodayCompleted,
    status,
    weekDays,
    milestones,
    nextMilestone,
    daysToNextMilestone,
    hoursRemainingToday,
    minutesRemainingToday,
    motivationalMessage,
    flameLevel
  };
}

export function getCharacterStreakMessage(
  avatar: string | undefined,
  status: 'completed_today' | 'at_risk' | 'broken',
  currentStreak: number,
  hoursRemainingToday: number,
  minutesRemainingToday: number
): string {
  let charKey = '🦉';
  if (avatar) {
    if (avatar.includes('⚡') || avatar.includes('Harry')) charKey = '⚡';
    else if (avatar.includes('📚') || avatar.includes('Hermione')) charKey = '📚';
    else if (avatar.includes('♟️') || avatar.includes('Ron')) charKey = '♟️';
    else if (avatar.includes('🧙‍♂️') || avatar.includes('Dumbledore')) charKey = '🧙‍♂️';
    else if (avatar.includes('🧪') || avatar.includes('Snape')) charKey = '🧪';
    else if (avatar.includes('🐱') || avatar.includes('McGonagall')) charKey = '🐱';
    else if (avatar.includes('🧦') || avatar.includes('Dobby')) charKey = '🧦';
    else if (avatar.includes('🦉') || avatar.includes('Hedwig')) charKey = '🦉';
  }

  switch (charKey) {
    case '🧪': // Severus Snape
      if (status === 'completed_today') {
        if (currentStreak >= 30) {
          return '30 hari lebih tanpa cela. Hmph... harus kuakui, disiplinmu melampaui dugaanku. Pertahankan presisi ini sampai dewan penguji membungkuk hormat padamu. 🧪👑🔥';
        } else if (currentStreak >= 7) {
          return `Streak ${currentStreak} hari. Setidaknya kamu menunjukkan bahwa pikiranmu tidak dipenuhi kabut kemalasan. Jangan berpuas diri dulu. 🧪🔥`;
        }
        return 'Ritual hari ini tuntas. Ingat, kelalaian satu hari saja bisa merusak seluruh formula yang telah kamu bangun dengan susah payah. 🧪✨';
      } else if (status === 'at_risk') {
        return `Waktu tinggal ${hoursRemainingToday} jam ${minutesRemainingToday} menit, Dokter. Jangan berani-berani membiarkan streak ${currentStreak} hari padam karena rasa malas yang tak termaafkan! Buka bukumu sekarang! 🧪⚠️🔥`;
      }
      return 'Api belajarmu padam. Aku tidak menoleransi ketidakteraturan. Duduk tegak, buka catatanmu, dan tuntaskan satu ritual hari ini sebelum kemampuanmu dicap Troll! 🧪🌱';

    case '📚': // Hermione Granger
      if (status === 'completed_today') {
        if (currentStreak >= 30) {
          return 'Luar biasa menakjubkan, Dokter! 30+ hari konsisten! Menurut perhitungan silabus, retensi materimu sudah mencapai puncak prima untuk first-taker UKMPPD! 📚👑🔥';
        } else if (currentStreak >= 7) {
          return `Bagus sekali, Dokter! Streak ${currentStreak} hari terjaga sempurna. Disiplin terstruktur seperti ini adalah kunci predikat kelulusan cumlaude! 📚🔥`;
        }
        return 'Kerja bagus, Dokter! Target habit hari ini terpenuhi. Ingat, repetition is the mother of mastery! 📚✨';
      } else if (status === 'at_risk') {
        return `Dokter! Waktu tinggal ${hoursRemainingToday} jam ${minutesRemainingToday} menit lagi! Kita tidak boleh merusak streak ${currentStreak} hari ini hanya karena menunda! Buka bukumu sekarang! 📚⚠️🔥`;
      }
      return 'Streak-mu terputus, Dokter! Jangan buang waktu meratapi yang sudah lewat—buka halaman berikutnya dan tuntaskan 1 ritual sekarang juga untuk mulai lagi! 📚🌱';

    case '♟️': // Ron Weasley
      if (status === 'completed_today') {
        if (currentStreak >= 30) {
          return 'Bloody hell, Dok! 30 hari lebih gak putus-putus?! Kalau di catur sihir, kamu sudah skakmat ratu lawan berkali-kali! Layak dirayakan pakai ayam panggang! ♟️🍗👑';
        } else if (currentStreak >= 7) {
          return `Keren banget dok! Streak ${currentStreak} hari aman! Ritmemu lebih stabil daripada sapu terbang kuis Quidditch! ♟️🔥`;
        }
        return 'Mantap dok! Habit hari ini kelar. Yuk rehat sejenak sambil minum butterbeer manis! ♟️🍺✨';
      } else if (status === 'at_risk') {
        return `Bloody hell dok! Tinggal ${hoursRemainingToday} jam ${minutesRemainingToday} menit lagi sebelum apinya padam! Selesaikan satu habit dulu, baru kita santai! ♟️⚠️🔥`;
      }
      return 'Aduh, apinya padam dok... Tapi jangan sedih! Hermione bilang kita selalu bisa bangkit lagi. Yuk tuntaskan satu habit hari ini! ♟️🌱';

    case '🧙‍♂️': // Albus Dumbledore
      if (status === 'completed_today') {
        if (currentStreak >= 30) {
          return 'Sungguh pencapaian yang mengagumkan, Dokter. Lebih dari 30 hari keteguhan hati. Dedikasimu adalah bukti nyata panggilan jiwamu sebagai penyembuh sejati 🧙‍♂️👑🔥';
        } else if (currentStreak >= 7) {
          return `Nyala api tekadmu berkobar indah, Dokter. Konsistensi ${currentStreak} hari ini membawa ketenangan dan kepastian menuju hari kelulusanmu 🧙‍♂️🔥`;
        }
        return 'Langkah yang mulia hari ini, Dokter muda. Ingatlah bahwa keagungan dibangun dari kesetiaan pada ritual-ritual kecil yang sederhana 🧙‍♂️✨';
      } else if (status === 'at_risk') {
        return `Waktu bergerak tenang namun pasti, Dokter. Masih tersisa ${hoursRemainingToday} jam ${minutesRemainingToday} menit. Pilihanmulah yang menentukan keberlanjutan streak ${currentStreak} harimu 🧙‍♂️⚠️🔥`;
      }
      return 'Bahkan di malam tergelap sekalipun, kebahagiaan dan nyala api baru dapat dinyalakan kembali. Mulailah satu ritual kecil hari ini, Dokter 🧙‍♂️🌱';

    case '🐱': // Minerva McGonagall
      if (status === 'completed_today') {
        if (currentStreak >= 30) {
          return 'Tiga puluh hari lebih tanpa cela! Prestasi luar biasa yang mencerminkan keteguhan sejati asrama Gryffindor! Lima puluh poin untuk ketekunanmu, Dokter! 🐱👑🔥';
        } else if (currentStreak >= 7) {
          return `Bagus sekali, Dokter. Disiplin ${currentStreak} hari yang sangat membanggakan. Sepuluh poin dan sekotak biskuit jahe untuk konsistensimu! 🐱🍪🔥`;
        }
        return 'Ritual hari ini terselesaikan dengan baik. Pertahankan standar keunggulan dan martabat medismu setiap hari! 🐱✨';
      } else if (status === 'at_risk') {
        return `Dokter, saya tidak mentolerir kelalaian waktu! Tersisa ${hoursRemainingToday} jam ${minutesRemainingToday} menit! Tuntaskan ritualmu dengan martabat seorang dokter sejati! 🐱⚠️🔥`;
      }
      return 'Streak terputus bukanlah akhir, tapi jangan biarkan kebiasaan menunda ini menjadi pola. Tuntaskan satu ritual segera dan mulai lembaran baru! 🐱🌱';

    case '🧦': // Dobby
      if (status === 'completed_today') {
        if (currentStreak >= 30) {
          return 'Dobby sangat kagum sampai menangis bahagia! Dokter sudah konsisten 30+ hari! Dokter adalah orang paling hebat dan rajin di seluruh dunia! Dobby sudah siapkan pesta kecil! 🧦👑🔥';
        } else if (currentStreak >= 7) {
          return `Dobby sangat bangga pada Dokter! Streak ${currentStreak} hari! Dobby sudah menyetrika jas putih Dokter paling rapi untuk merayakannya! 🧦🔥`;
        }
        return 'Dobby senang sekali melihat Dokter menyelesaikan ritual hari ini! Dokter pasti lulus ujian dengan nilai tertinggi! 🧦✨';
      } else if (status === 'at_risk') {
        return `Dobby sangat cemas dok! Tinggal ${hoursRemainingToday} jam ${minutesRemainingToday} menit lagi! Dokter harus selesaikan 1 habit agar streak ${currentStreak} hari Dokter yang hebat tidak hilang! Dobby sudah siapkan pulpennya! 🧦⚠️🔥`;
      }
      return 'Dobby sedih streak Dokter sempat padam... tapi Dobby sangat percaya pada Dokter! Dokter pasti bisa mulai streak baru yang lebih hebat hari ini! Dobby selalu ada untuk Dokter! 🧦🌱';

    case '⚡': // Harry Potter
      if (status === 'completed_today') {
        if (currentStreak >= 30) {
          return 'Luar biasa, Dok! 30+ hari tanpa goyah! Kita hadapi ujian UKMPPD ini seperti Room of Requirement menghadapi pertempuran besar: kita pasti menang! *Expecto Patronum!* ⚡👑🔥';
        } else if (currentStreak >= 7) {
          return `Hebat sekali, Dok! Streak ${currentStreak} hari bertahan kuat! Tidak ada rintangan stase yang tak bisa kita lalui bersama! ⚡🔥`;
        }
        return 'Bagus, Dok! Hari ini aman! Terus pertahankan ritme ini besok, kita jemput sumpah dokter bersama! ⚡✨';
      } else if (status === 'at_risk') {
        return `Dok, kita tidak boleh menyerah sekarang! Waktu tersisa ${hoursRemainingToday} jam ${minutesRemainingToday} menit! Mari tuntaskan 1 ritual habit dan pertahankan streak ${currentStreak} hari kita! ⚡⚠️🔥`;
      }
      return 'Pernah jatuh bukan berarti kalah, Dok. Bangkit lagi dan tuntaskan 1 ritual hari ini. Aku ada di sampingmu, ayo mulai rekor barumu! ⚡🌱';

    case '🦉': // Hedwig
    default:
      if (status === 'completed_today') {
        if (currentStreak >= 30) {
          return '*Hoo-hoo!* Hedwig terbang melingkar dengan bangga! 30+ hari konsisten menjaga api ritual belajarmu dok! Gelar dokter tinggal selangkah lagi! 🦉👑🔥';
        } else if (currentStreak >= 7) {
          return `*Hoo-hoo!* Hedwig menepuk pundakmu sayang dengan sayap saljunya. Api streak ${currentStreak} hari aman terkendali! 🦉🔥`;
        }
        return '*Hoo-hoo!* Hedwig senang melihat ritual hari ini tuntas! Satu langkah kecil menjaga surat kelulusanmu tetap di jalur yang tepat! 🦉✨';
      } else if (status === 'at_risk') {
        return `*Hoo-hoo!* (Hedwig mengepakkan sayap gelisah) Tinggal ${hoursRemainingToday} jam ${minutesRemainingToday} menit tersisa dok! Tuntaskan minimal 1 habit agar streak ${currentStreak} hari kita tidak padam! 🦉⚠️🔥`;
      }
      return '*Hoo...* (Hedwig mengusap kepalamu lembut) Nyalakan kembali api belajarmu hari ini dok! Cukup selesaikan 1 ritual untuk memulai streak baru! 🦉🌿💫';
  }
}
