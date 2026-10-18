import { AppState, LevelItem, BadgeItem } from '../types';
import { calculateStreak, StreakInfo } from './streakHelper';

export interface XPBreakdownItem {
  id: string;
  activity: string;
  count: number;
  xpPerUnit: number;
  totalXP: number;
  source: string;
  cuteIcon?: string;
}

export interface UserLevelProgress {
  totalXP: number;
  currentLevel: LevelItem;
  nextLevel: LevelItem | null;
  progressPercent: number;
  xpNeededForNext: number;
  breakdown: XPBreakdownItem[];
  unlockedBadges: BadgeItem[];
  streak: StreakInfo;
}

const levelIcons = ['🐣', '🌸', '⚡', '💓', '🍼', '🧪', '🗡️', '👓', '🔥', '🧠', '👑'];
const badgeIcons: Record<string, string> = {
  'badge-1': '🗡️',
  'badge-2': '🌙',
  'badge-3': '☕',
  'badge-4': '📖',
  'badge-5': '👯',
  'badge-6': '🗺️',
  'badge-7': '🎯',
  'badge-8': '💖',
  'badge-9': '💯',
  'badge-10': '🏆',
};

export function calculateUserProgress(state: AppState): UserLevelProgress {
  const rules = state.leveling.xpRules || [];
  const ruleMap = new Map(rules.map(r => [r.id, r]));

  // 1. Roadmap weeks completed
  const roadmapDoneCount = state.roadmapWeeks.filter(w => w.isDone).length;
  const roadmapRule = ruleMap.get('rule-roadmap') || { xpPerUnit: 50, activity: 'Minggu roadmap selesai', source: 'Roadmap' };

  // 2. Intensif non-rest completed
  const intensifDoneCount = state.intensifDays.filter(
    d => d.isDone && d.type !== 'REST' && d.type !== 'Tryout' && d.type !== 'UJIAN'
  ).length;
  const intensifRule = ruleMap.get('rule-intensif') || { xpPerUnit: 20, activity: 'Hari Intensif selesai', source: 'Intensif' };

  // 3. Tryout scored
  const tryoutScoredCount = state.tryouts.filter(t => t.actualScore !== null && t.actualScore !== undefined).length;
  const tryoutRule = ruleMap.get('rule-tryout') || { xpPerUnit: 40, activity: 'Tryout dinilai', source: 'Tryout' };

  // 4. REST days completed
  const restDoneCount = state.intensifDays.filter(d => d.isDone && d.type === 'REST').length;
  const restRule = ruleMap.get('rule-rest') || { xpPerUnit: 10, activity: 'Hari istirahat (REST)', source: 'Intensif REST' };

  // 5. Survival days (Level 0)
  const survivalCount = Object.values(state.dailyHabitLogs || {}).filter(log => log.level === 0).length;
  const survivalRule = ruleMap.get('rule-survival') || { xpPerUnit: 15, activity: 'Hari survival (Level 0)', source: 'Habit Level 0' };

  // 6. Error book entries
  const errorEntriesCount = state.errorEntries.length;
  const errorRule = ruleMap.get('rule-error') || { xpPerUnit: 5, activity: 'Entri Error Book', source: 'Error Book' };

  // 7. OSCE stages completed
  let osceStagesCount = 0;
  state.osceSkills.forEach(s => {
    if (s.pahamiDone) osceStagesCount++;
    if (s.soloDone) osceStagesCount++;
    if (s.partnerDone) osceStagesCount++;
    if (s.dinilaiDone) osceStagesCount++;
  });
  const osceRule = ruleMap.get('rule-osce') || { xpPerUnit: 5, activity: 'Tahap OSCE selesai', source: 'OSCE Skills' };

  // 8. SKDI Pass completed
  let skdiPassCount = 0;
  state.skdiSystems.forEach(sys => {
    if (sys.p1Done) skdiPassCount++;
    if (sys.p2Done) skdiPassCount++;
    if (sys.p3Done) skdiPassCount++;
  });
  const skdiRule = ruleMap.get('rule-skdi') || { xpPerUnit: 30, activity: 'Pass SKDI selesai', source: 'SKDI Map' };

  // 9. Habit checks count
  let habitChecksCount = 0;
  Object.values(state.dailyHabitLogs || {}).forEach(log => {
    habitChecksCount += (log.habitsDone || []).length;
  });
  const habitRule = ruleMap.get('rule-habit') || { xpPerUnit: 2, activity: 'Habit harian tercentang', source: 'Habit Tracker' };

  // 10. Streak consistency XP
  const streakInfo = calculateStreak(state.dailyHabitLogs || {}, state.dashboard?.doctorAvatar);
  const streakRule = ruleMap.get('rule-streak') || { xpPerUnit: 15, activity: 'Hari streak api konsisten', source: 'Ritual Streak' };
  const streakTotalXP = streakInfo.currentStreak * streakRule.xpPerUnit;

  const breakdown: XPBreakdownItem[] = [
    {
      id: 'rule-roadmap',
      activity: roadmapRule.activity,
      count: roadmapDoneCount,
      xpPerUnit: roadmapRule.xpPerUnit,
      totalXP: roadmapDoneCount * roadmapRule.xpPerUnit,
      source: roadmapRule.source,
      cuteIcon: '🗺️'
    },
    {
      id: 'rule-intensif',
      activity: intensifRule.activity,
      count: intensifDoneCount,
      xpPerUnit: intensifRule.xpPerUnit,
      totalXP: intensifDoneCount * intensifRule.xpPerUnit,
      source: intensifRule.source,
      cuteIcon: '🔥'
    },
    {
      id: 'rule-tryout',
      activity: tryoutRule.activity,
      count: tryoutScoredCount,
      xpPerUnit: tryoutRule.xpPerUnit,
      totalXP: tryoutScoredCount * tryoutRule.xpPerUnit,
      source: tryoutRule.source,
      cuteIcon: '🎯'
    },
    {
      id: 'rule-rest',
      activity: restRule.activity,
      count: restDoneCount,
      xpPerUnit: restRule.xpPerUnit,
      totalXP: restDoneCount * restRule.xpPerUnit,
      source: restRule.source,
      cuteIcon: '☕'
    },
    {
      id: 'rule-survival',
      activity: survivalRule.activity,
      count: survivalCount,
      xpPerUnit: survivalRule.xpPerUnit,
      totalXP: survivalCount * survivalRule.xpPerUnit,
      source: survivalRule.source,
      cuteIcon: '🌙'
    },
    {
      id: 'rule-error',
      activity: errorRule.activity,
      count: errorEntriesCount,
      xpPerUnit: errorRule.xpPerUnit,
      totalXP: errorEntriesCount * errorRule.xpPerUnit,
      source: errorRule.source,
      cuteIcon: '📖'
    },
    {
      id: 'rule-osce',
      activity: osceRule.activity,
      count: osceStagesCount,
      xpPerUnit: osceRule.xpPerUnit,
      totalXP: osceStagesCount * osceRule.xpPerUnit,
      source: osceRule.source,
      cuteIcon: '🩺'
    },
    {
      id: 'rule-skdi',
      activity: skdiRule.activity,
      count: skdiPassCount,
      xpPerUnit: skdiRule.xpPerUnit,
      totalXP: skdiPassCount * skdiRule.xpPerUnit,
      source: skdiRule.source,
      cuteIcon: '🔮'
    },
    {
      id: 'rule-habit',
      activity: habitRule.activity,
      count: habitChecksCount,
      xpPerUnit: habitRule.xpPerUnit,
      totalXP: habitChecksCount * habitRule.xpPerUnit,
      source: habitRule.source,
      cuteIcon: '✨'
    },
    {
      id: 'rule-streak',
      activity: streakRule.activity,
      count: streakInfo.currentStreak,
      xpPerUnit: streakRule.xpPerUnit,
      totalXP: streakTotalXP,
      source: streakRule.source,
      cuteIcon: '🔥'
    }
  ];

  const totalXP = breakdown.reduce((sum, item) => sum + item.totalXP, 0);

  // Determine current level
  const rawLevels = (state.leveling && state.leveling.levels) ? state.leveling.levels : [];
  const sortedLevels = [...rawLevels]
    .map((l, idx) => ({
      ...l,
      level: Number(l.level) || (idx + 1),
      minXP: Number(l.minXP) || 0,
      cuteIcon: l.cuteIcon || levelIcons[idx % levelIcons.length]
    }))
    .sort((a, b) => a.minXP - b.minXP);

  let currentLevel = sortedLevels[0] || { level: 1, title: 'Koas Baru', minXP: 0, meaning: '', selfReward: '', cuteIcon: '🐣' };
  let nextLevel: LevelItem | null = null;

  for (let i = 0; i < sortedLevels.length; i++) {
    const lvl = sortedLevels[i];
    if (totalXP >= lvl.minXP) {
      currentLevel = lvl;
      nextLevel = sortedLevels[i + 1] || null;
    } else {
      break;
    }
  }

  let progressPercent = 100;
  let xpNeededForNext = 0;

  if (nextLevel) {
    const minCurrent = Number(currentLevel.minXP) || 0;
    const minNext = Number(nextLevel.minXP) || 0;
    const range = Math.max(1, minNext - minCurrent);
    const gainedInLevel = Math.max(0, totalXP - minCurrent);
    const rawPct = (gainedInLevel / range) * 100;
    progressPercent = isNaN(rawPct) ? 0 : Math.min(100, Math.max(0, rawPct));
    xpNeededForNext = Math.max(0, minNext - totalXP);
  }

  // Badges update with cute sticker icons
  const updatedBadges = (state.leveling.badges || []).map(b => {
    let unlocked = false;
    switch (b.id) {
      case 'badge-1':
        unlocked = roadmapDoneCount >= 1;
        break;
      case 'badge-2':
        unlocked = survivalCount >= 3;
        break;
      case 'badge-3':
        unlocked = restDoneCount >= 5;
        break;
      case 'badge-4':
        unlocked = errorEntriesCount >= 10;
        break;
      case 'badge-5':
        const partnerCount = state.osceSkills.filter(s => s.partnerDone).length;
        unlocked = partnerCount >= 5;
        break;
      case 'badge-6':
        const p1Count = state.skdiSystems.filter(s => s.p1Done).length;
        unlocked = p1Count >= 16;
        break;
      case 'badge-7':
        unlocked = tryoutScoredCount >= 1;
        break;
      case 'badge-8':
        unlocked = state.tryouts.some(t => (t.actualScore || 0) >= 90);
        break;
      case 'badge-9':
        unlocked = state.tryouts.some(t => (t.actualScore || 0) >= 100);
        break;
      case 'badge-10':
        const totalIntensifDone = state.intensifDays.filter(d => d.isDone).length;
        unlocked = totalIntensifDone >= 35;
        break;
      default:
        unlocked = b.isUnlocked;
    }
    return {
      ...b,
      isUnlocked: unlocked,
      stickerIcon: b.stickerIcon || badgeIcons[b.id] || '🎀'
    };
  });

  return {
    totalXP,
    currentLevel,
    nextLevel,
    progressPercent: Math.round(progressPercent),
    xpNeededForNext,
    breakdown,
    unlockedBadges: updatedBadges,
    streak: streakInfo
  };
}
