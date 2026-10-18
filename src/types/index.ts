export type DayMode = 'Lite' | 'Steady' | 'Boost' | 'Sprint' | 'Tajam' | 'Intensif' | 'Taper' | 'UJIAN' | string;

export interface StudyModeSetting {
  mode: string;
  hoursPerDay: number;
  questionsPerDay: number;
  description: string;
}

export interface ClerkshipPhase {
  id: string;
  name: string;
  type: string; // Minor, MAYOR, Fase, dll
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  durationWeeks: string;
  status: string; // Sedang berjalan, Belum mulai, ESTIMASI, Rencana, dll
  mode: string;
  notes: string;
}

export interface DashboardSettings {
  startPlanner: string;
  ddayUKMPPD: string;
  targetCBT: number;
  batasAman: number;
  modes: StudyModeSetting[];
  phases: ClerkshipPhase[];
  doctorAvatar?: string; // Cute avatar: 🐰 Dr. Bunny, 🩺 Chibi Doc, etc.
  doctorNickname?: string; // e.g. "Dokter Cantik", "Dr. Aisyah", etc.
  companionMood?: string; // "Semangat 💖", "Butuh Kopi ☕", "Sleepy Koas 🌙", "Mode Juara 👑"
}

export interface LevelItem {
  level: number;
  title: string;
  minXP: number;
  meaning: string;
  selfReward: string;
  rewardClaimed?: boolean;
  cuteIcon?: string; // 🎀, 🧸, 🍰, 🌸, 👑, etc.
}

export interface BadgeItem {
  id: string;
  name: string;
  condition: string;
  isUnlocked: boolean;
  unlockedAt?: string | null;
  stickerIcon?: string; // 🌸, 💖, ⭐, ☕, 🩺, etc.
}

export interface XPRule {
  id: string;
  activity: string;
  xpPerUnit: number;
  source: string;
}

export interface LevelingState {
  levels: LevelItem[];
  badges: BadgeItem[];
  xpRules: XPRule[];
}

export interface RoadmapWeek {
  weekNum: number;
  startDate: string;
  endDate: string;
  rotation: string;
  mode: string;
  hoursPerDay: number;
  questionsPerDay: number;
  weeklyHours: number;
  weeklyQuestions: number;
  focusA: string;
  focusB: string;
  milestone: string;
  isDone: boolean;
}

export interface IntensifDay {
  dayNum: number;
  date: string;
  dayName: string;
  type: string; // Materi, Recall, REST, OSCE, Tryout, Taper, Ujian
  focus: string;
  coreActivity: string;
  targetQuestions: number;
  targetHours: number;
  isDone: boolean;
  notes: string;
}

export interface SKDISystem {
  no: number;
  systemName: string;
  clerkshipSource: string;
  status: string;
  pass1Desc: string;
  pass2Desc: string;
  pass3Desc: string;
  skdiNotes: string;
  p1Done: boolean;
  p2Done: boolean;
  p3Done: boolean;
}

export interface TryoutItem {
  no: number;
  plannedDate: string;
  context: string;
  source: string;
  questionsCount: number;
  targetScore: number;
  actualScore?: number | null;
  weakTopics: string;
  notes: string;
}

export type ErrorType = 'Lupa / hafalan' | 'Salah baca' | 'Gegabah' | 'Tidak tahu' | 'Overthinking' | string;

export interface ErrorBookItem {
  id: string;
  no: number;
  date: string;
  source: string;
  system: string;
  topic: string;
  caseSummary: string;
  myAnswer: string;
  correctAnswer: string;
  errorType: ErrorType;
  reasonWhy: string;
  review1Date: string;
  review7Date: string;
  review30Date: string;
  review1Done: boolean;
  review7Done: boolean;
  review30Done: boolean;
  status: string;
}

export interface OSCESkill {
  no: number;
  category: string;
  skillName: string;
  practiceLocation: string;
  pahamiDone: boolean;
  soloDone: boolean;
  partnerDone: boolean;
  dinilaiDone: boolean;
  notes: string;
}

export interface HabitItem {
  id: string;
  name: string;
  priority: 'High' | 'Medium' | 'Low' | string;
}

export interface DailyHabitLog {
  date: string;
  level: number; // 0 (Survival), 1 (Normal), 2 (Boost)
  habitsDone: string[]; // habit IDs
  note?: string;
}

export interface GuidelineItem {
  topic: string;
  detail: string;
}

export interface AppState {
  dashboard: DashboardSettings;
  leveling: LevelingState;
  roadmapWeeks: RoadmapWeek[];
  intensifDays: IntensifDay[];
  skdiSystems: SKDISystem[];
  tryouts: TryoutItem[];
  errorEntries: ErrorBookItem[];
  osceSkills: OSCESkill[];
  habits: HabitItem[];
  dailyHabitLogs: Record<string, DailyHabitLog>;
  guidelines: GuidelineItem[];
}
