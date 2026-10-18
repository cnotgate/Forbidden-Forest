import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { trackerApi } from '../services/api';
import {
  AppState,
  DashboardSettings,
  ClerkshipPhase,
  LevelItem,
  XPRule,
  RoadmapWeek,
  IntensifDay,
  SKDISystem,
  TryoutItem,
  ErrorBookItem,
  OSCESkill,
  HabitItem,
  DailyHabitLog,
  GuidelineItem
} from '../types';
import { defaultAppState } from '../data/defaultData';
import { calculateUserProgress, UserLevelProgress } from '../utils/xpCalculator';
import { addDaysToDateStr, getDayNameIndo, isPhaseMatchingRotation, sortPhasesChronologically } from '../utils/dateHelper';

export const DEFAULT_LEVEL_TITLES: Record<number, string> = {
  1: 'Koas Baru',
  2: 'Penjaga Ruang Jaga',
  3: 'Pemburu Visum',
  4: 'Pembaca EKG',
  5: 'Neonatus Warrior',
  6: 'Biostat Breaker',
  7: 'Pejuang Pass 2',
  8: 'Mata Elang',
  9: 'Intensif Warrior',
  10: 'Clinical Reasoner',
  11: 'dr. Siap UKMPPD'
};

export const CANONICAL_HABIT_NAMES: Record<string, string> = {
  "Blank-page recall 15' (tulis/ucapkan topik tanpa lihat)": "habit-1",
  "Soal harian sesuai Mode (lihat Roadmap)": "habit-2",
  "Review Error Book (jatuh tempo +1/+7/+30)": "habit-3",
  "3 pertanyaan Socratic ke diri sendiri": "habit-4",
  "Tatalaksana & farmakologi (obat pilihan, dosis, KI)": "habit-5",
  "Tidur ≥ 7 jam / gerak badan ringan": "habit-6",
  "Anki / flashcard due": "habit-7",
  "Teach-back suara (voice note 3' jelasin topik)": "habit-8",
  "Latihan OSCE / skill fisik 1 item": "habit-9",
  "Clinical reasoning: 1 kasus, bicara keras": "habit-10",
  "Algoritma & rujukan (4A: mandiri vs rujuk)": "habit-11",
  "Baca textbook / ringkasan topik": "habit-12",
  "Video / podcast materi": "habit-13",
  "Ringkas 1 halaman": "habit-14",
  "Evaluasi 2 menit: \"pola apa yang kutangkap hari ini?\" (catat, jangan menghukum)": "habit-15",
  // Variants / fallbacks
  "Anatomi & fisiologi klinis 1 sistem": "habit-6",
  "Bedah 5 soal paling menipu (analisis distraktor)": "habit-11",
  "Review kuis / flashcard kilat 10 menit": "habit-12"
};

export const normalizeHabitsAndLogs = (stateToNormalize: AppState): AppState => {
  if (!stateToNormalize || !Array.isArray(stateToNormalize.habits)) return stateToNormalize;

  const legacyToCanonicalMap: Record<string, string> = {};
  const normalizedHabits = stateToNormalize.habits.map((h: any) => {
    const canonicalId = CANONICAL_HABIT_NAMES[h.name];
    if (canonicalId) {
      if (h.id !== canonicalId) {
        legacyToCanonicalMap[h.id] = canonicalId;
      }
      return { ...h, id: canonicalId };
    }
    return h;
  });

  // Reconcile dailyHabitLogs if any IDs were mapped
  let normalizedLogs = stateToNormalize.dailyHabitLogs;
  if (normalizedLogs && typeof normalizedLogs === 'object') {
    normalizedLogs = { ...normalizedLogs };
    for (const date in normalizedLogs) {
      const log = normalizedLogs[date];
      if (log && Array.isArray(log.habitsDone)) {
        const reconciled = log.habitsDone.map((id: string) => legacyToCanonicalMap[id] || id);
        normalizedLogs[date] = {
          ...log,
          habitsDone: Array.from(new Set(reconciled))
        };
      }
    }
  }

  let normalizedPhases = stateToNormalize.dashboard?.phases;
  if (Array.isArray(normalizedPhases)) {
    normalizedPhases = sortPhasesChronologically(normalizedPhases);
  }

  return {
    ...stateToNormalize,
    dashboard: stateToNormalize.dashboard
      ? { ...stateToNormalize.dashboard, phases: normalizedPhases }
      : stateToNormalize.dashboard,
    habits: normalizedHabits,
    dailyHabitLogs: normalizedLogs
  };
};

const LEGACY_LEVEL_TITLES = new Set([
  'Pembaca EKGong',
  'Pemburu Viagra',
  'Residen Penjelajah',
  'Neonatus Waria',
  'Magister Stase',
  'Koas Keren'
]);

interface AppContextType {
  state: AppState;
  progress: UserLevelProgress;
  // Cloud Sync
  setCloudState: (newState: AppState) => void;
  isCloudSyncing: boolean;
  lastCloudSyncedAt: Date | null;
  syncToCloudNow: () => Promise<boolean>;
  // Dashboard & Settings
  updateDashboardSettings: (newSettings: Partial<DashboardSettings>) => void;
  updatePhase: (phaseId: string, updated: Partial<ClerkshipPhase>) => void;
  addPhase: (phase: Omit<ClerkshipPhase, 'id'>) => void;
  deletePhase: (phaseId: string) => void;
  // Levels & XP
  updateLevels: (levels: LevelItem[]) => void;
  updateLevel: (levelNum: number, updated: Partial<LevelItem>) => void;
  claimLevelReward: (levelNum: number) => void;
  updateXPRules: (rules: XPRule[]) => void;
  // Roadmap
  roadmapFilter: string;
  setRoadmapFilter: (rot: string) => void;
  syncRoadmapWithPhases: () => { syncedWeeksCount: number; updatedPhasesCount: number };
  addRoadmapWeek: (week: Omit<RoadmapWeek, 'weekNum' | 'weeklyHours' | 'weeklyQuestions'>) => void;
  updateRoadmapWeek: (weekNum: number, updated: Partial<RoadmapWeek>) => void;
  deleteRoadmapWeek: (weekNum: number) => void;
  toggleRoadmapWeek: (weekNum: number) => void;
  // Intensif
  addIntensifDay: (day: Omit<IntensifDay, 'dayNum'>) => void;
  updateIntensifDay: (dayNum: number, updated: Partial<IntensifDay>) => void;
  deleteIntensifDay: (dayNum: number) => void;
  toggleIntensifDay: (dayNum: number) => void;
  autoShiftIntensifFromDDay: (newDDay: string) => void;
  // SKDI
  addSKDISystem: (sys: Omit<SKDISystem, 'no' | 'p1Done' | 'p2Done' | 'p3Done'>) => void;
  updateSKDISystem: (no: number, updated: Partial<SKDISystem>) => void;
  deleteSKDISystem: (no: number) => void;
  toggleSKDIPass: (no: number, pass: 'p1' | 'p2' | 'p3') => void;
  // Tryout
  addTryout: (item: Omit<TryoutItem, 'no'>) => void;
  updateTryout: (no: number, updated: Partial<TryoutItem>) => void;
  deleteTryout: (no: number) => void;
  // Error Book
  addErrorEntry: (entry: Omit<ErrorBookItem, 'id' | 'no' | 'review1Done' | 'review7Done' | 'review30Done' | 'status'>) => void;
  updateErrorEntry: (id: string, updated: Partial<ErrorBookItem>) => void;
  deleteErrorEntry: (id: string) => void;
  // OSCE
  updateOSCESkill: (no: number, updated: Partial<OSCESkill>) => void;
  toggleOSCETask: (no: number, stage: 'pahami' | 'solo' | 'partner' | 'dinilai') => void;
  addOSCESkill: (skill: Omit<OSCESkill, 'no'>) => void;
  deleteOSCESkill: (no: number) => void;
  // Habits
  addHabit: (name: string, priority: string) => void;
  updateHabit: (id: string, name: string, priority: string) => void;
  deleteHabit: (id: string) => void;
  logDailyHabit: (date: string, level: number, habitsDone: string[], note?: string) => void;
  // Guidelines
  addGuideline: (item: GuidelineItem) => void;
  updateGuideline: (index: number, updated: Partial<GuidelineItem>) => void;
  deleteGuideline: (index: number) => void;
  // Backup & Reset
  resetToDefaultData: () => void;
  exportDataJSON: () => string;
  importDataJSON: (jsonStr: string) => boolean;
}

const AppContext = createContext<AppContextType | null>(null);

export const getUserStorageKey = (userId?: string) =>
  userId ? `doctor_tracker_user_${userId}` : 'doctor_tracker_guest';

export const getPendingSyncKey = (userId?: string) =>
  userId ? `doctor_tracker_pending_sync_${userId}` : 'doctor_tracker_pending_sync_guest';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const userId = user?.id;

  const [state, setState] = useState<AppState>(() => {
    try {
      if (userId) {
        const userSaved = localStorage.getItem(getUserStorageKey(userId));
        if (userSaved) {
          const parsed = JSON.parse(userSaved);
          if (!parsed.dashboard.doctorAvatar) {
            parsed.dashboard.doctorAvatar = '🦉 Hedwig';
            parsed.dashboard.doctorNickname = user?.fullName || 'Dokter Healer ✨';
            parsed.dashboard.companionMood = '🟢 Online';
          }
          // Auto-fix any legacy corrupted or typo titles in leveling
          if (parsed.leveling?.levels) {
            parsed.leveling.levels = parsed.leveling.levels.map((l: any) => {
              if (LEGACY_LEVEL_TITLES.has(l.title) && DEFAULT_LEVEL_TITLES[l.level]) {
                return { ...l, title: DEFAULT_LEVEL_TITLES[l.level] };
              }
              return l;
            });
          }
          return normalizeHabitsAndLogs(parsed);
        }
      }
    } catch (e) {
      console.error('Failed to load saved state from localStorage:', e);
    }

    // Default clean state for brand new registration or fallback
    const def = { ...defaultAppState };
    if (!def.dashboard.doctorAvatar) {
      def.dashboard.doctorAvatar = '🦉 Hedwig';
      def.dashboard.companionMood = '🟢 Online';
    }
    if (user?.fullName) {
      def.dashboard.doctorNickname = user.fullName.split(' ')[0] || user.fullName;
    } else {
      def.dashboard.doctorNickname = 'Dokter Healer ✨';
    }
    return normalizeHabitsAndLogs(def);
  });

  const [roadmapFilter, setRoadmapFilter] = useState<string>('ALL');
  const [isCloudSyncing, setIsCloudSyncing] = useState<boolean>(false);
  const [lastCloudSyncedAt, setLastCloudSyncedAt] = useState<Date | null>(null);
  const cloudFetchedRef = React.useRef(false);
  const isSyncingFromServerRef = React.useRef(false);
  const isFirstRender = React.useRef(true);

  // Initial cloud fetch / pending sync resolution on mount
  useEffect(() => {
    let isMounted = true;
    if (!userId) {
      cloudFetchedRef.current = true;
      return;
    }

    const hasPendingSync = localStorage.getItem(getPendingSyncKey(userId)) === 'true';
    const localSaved = localStorage.getItem(getUserStorageKey(userId));

    // If user made changes locally that didn't finish syncing before reload, push them immediately!
    if (hasPendingSync && localSaved) {
      setIsCloudSyncing(true);
      try {
        const parsedLocal = JSON.parse(localSaved);
        const normalizedLocal = normalizeHabitsAndLogs(parsedLocal);
        trackerApi.syncState(normalizedLocal)
          .then(res => {
            if (!isMounted) return;
            if (res.success) {
              setLastCloudSyncedAt(new Date());
              try {
                localStorage.setItem(getPendingSyncKey(userId), 'false');
              } catch {}
              if (res.data?.state) {
                const reconciled = normalizeHabitsAndLogs(res.data.state);
                isSyncingFromServerRef.current = true;
                setState(reconciled);
                try {
                  localStorage.setItem(getUserStorageKey(userId), JSON.stringify(reconciled));
                } catch {}
              }
            }
          })
          .catch(err => {
            console.error('Failed to sync pending local changes on mount:', err);
          })
          .finally(() => {
            if (isMounted) {
              setIsCloudSyncing(false);
              cloudFetchedRef.current = true;
            }
          });
      } catch (err) {
        console.error('Failed to parse local state for pending sync:', err);
        cloudFetchedRef.current = true;
      }

      return () => {
        isMounted = false;
      };
    }

    // Normal path: no pending un-synced edits, load canonical state from cloud
    trackerApi.getState()
      .then(res => {
        if (!isMounted) return;
        if (res.success && res.data?.state) {
          let cloudState = res.data.state;
          if (cloudState.leveling?.levels) {
            cloudState.leveling.levels = cloudState.leveling.levels.map((l: any) => {
              if (LEGACY_LEVEL_TITLES.has(l.title) && DEFAULT_LEVEL_TITLES[l.level]) {
                return { ...l, title: DEFAULT_LEVEL_TITLES[l.level] };
              }
              return l;
            });
          }
          cloudState = normalizeHabitsAndLogs(cloudState);
          isSyncingFromServerRef.current = true;
          setState(cloudState);
          setLastCloudSyncedAt(new Date());
          try {
            localStorage.setItem(getPendingSyncKey(userId), 'false');
            localStorage.setItem(getUserStorageKey(userId), JSON.stringify(cloudState));
          } catch {}
        }
      })
      .catch(err => {
        console.error('Failed to fetch cloud state on mount:', err);
      })
      .finally(() => {
        if (isMounted) {
          cloudFetchedRef.current = true;
        }
      });

    return () => {
      isMounted = false;
    };
  }, [userId]);

  // Save to user-scoped localStorage and debounced auto-sync to cloud
  useEffect(() => {
    if (!userId) return;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (isSyncingFromServerRef.current) {
      isSyncingFromServerRef.current = false;
      return;
    }

    // Save immediately to local storage and flag as pending cloud sync
    try {
      localStorage.setItem(getUserStorageKey(userId), JSON.stringify(state));
      localStorage.setItem(getPendingSyncKey(userId), 'true');
    } catch (e) {
      console.error('Failed to save state to user-scoped localStorage:', e);
    }

    if (!cloudFetchedRef.current) return;

    setIsCloudSyncing(true);
    const timer = setTimeout(async () => {
      try {
        const res = await trackerApi.syncState(state);
        if (res.success) {
          setLastCloudSyncedAt(new Date());
          try {
            localStorage.setItem(getPendingSyncKey(userId), 'false');
          } catch {}
        }
      } catch (e) {
        console.error('Failed to auto-sync state to cloud:', e);
      } finally {
        setIsCloudSyncing(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [state, userId]);

  const setCloudState = (newState: AppState) => {
    const normalized = normalizeHabitsAndLogs(newState);
    isSyncingFromServerRef.current = true;
    setState(normalized);
    if (userId) {
      try {
        localStorage.setItem(getUserStorageKey(userId), JSON.stringify(normalized));
        localStorage.setItem(getPendingSyncKey(userId), 'false');
      } catch {}
    }
  };

  const syncToCloudNow = async (): Promise<boolean> => {
    if (!userId) return false;
    setIsCloudSyncing(true);
    try {
      const res = await trackerApi.syncState(state);
      if (res.success) {
        setLastCloudSyncedAt(new Date());
        return true;
      }
      return false;
    } catch (e) {
      console.error('Manual sync failed:', e);
      return false;
    } finally {
      setIsCloudSyncing(false);
    }
  };

  const progress = calculateUserProgress(state);

  const onGranularSyncSuccess = () => {
    setLastCloudSyncedAt(new Date());
    if (userId) {
      try {
        localStorage.setItem(getPendingSyncKey(userId), 'false');
      } catch {}
    }
  };

  // 1. Dashboard updates with date propagation to roadmapWeeks
  const syncRoadmapWithPhases = () => {
    let syncedWeeksCount = 0;
    let updatedPhasesCount = 0;

    setState(prev => {
      const updatedWeeks = [...prev.roadmapWeeks];
      const today = new Date().toISOString().slice(0, 10);

      const updatedPhases = prev.dashboard.phases.map(phase => {
        const isIntensifPhase = phase.name.toLowerCase().includes('intensif');

        if (isIntensifPhase) {
          const totalDays = prev.intensifDays.length;
          const doneDays = prev.intensifDays.filter(d => d.isDone).length;
          let newStatus = phase.status;

          if (totalDays > 0 && doneDays === totalDays) {
            newStatus = 'Selesai';
          } else if (doneDays > 0 || (phase.startDate && phase.endDate && today >= phase.startDate && today <= phase.endDate)) {
            newStatus = 'Sedang berjalan';
          } else {
            newStatus = 'Belum mulai';
          }

          if (newStatus !== phase.status) {
            updatedPhasesCount++;
          }
          return { ...phase, status: newStatus };
        }

        const matchingIndices = updatedWeeks
          .map((w, idx) => ({ w, idx }))
          .filter(({ w }) => isPhaseMatchingRotation(phase.name, w.rotation));

        if (matchingIndices.length > 0) {
          matchingIndices.forEach(({ idx }, weekIndexInPhase) => {
            const currentWeek = updatedWeeks[idx];
            const newStart = addDaysToDateStr(phase.startDate, weekIndexInPhase * 7);
            const isLastWeek = weekIndexInPhase === matchingIndices.length - 1;
            const newEnd = isLastWeek ? phase.endDate : addDaysToDateStr(newStart, 6);

            if (
              currentWeek.startDate !== newStart ||
              currentWeek.endDate !== newEnd ||
              (phase.mode && currentWeek.mode !== phase.mode)
            ) {
              syncedWeeksCount++;
              updatedWeeks[idx] = {
                ...currentWeek,
                startDate: newStart,
                endDate: newEnd,
                mode: phase.mode || currentWeek.mode
              };
            }
          });

          const doneCount = matchingIndices.filter(({ idx }) => updatedWeeks[idx].isDone).length;
          let newStatus = phase.status;

          if (doneCount === matchingIndices.length) {
            newStatus = 'Selesai';
          } else if (doneCount > 0 || (phase.startDate && phase.endDate && today >= phase.startDate && today <= phase.endDate)) {
            newStatus = 'Sedang berjalan';
          } else {
            newStatus = 'Belum mulai';
          }

          if (newStatus !== phase.status) {
            updatedPhasesCount++;
          }

          return { ...phase, status: newStatus };
        }

        return phase;
      });

      const sortedPhases = sortPhasesChronologically(updatedPhases);

      if (userId) {
        trackerApi.batchSyncRoadmap(updatedWeeks, sortedPhases)
          .then(res => { if (res.success) onGranularSyncSuccess(); })
          .catch(console.error);
      }

      return {
        ...prev,
        dashboard: {
          ...prev.dashboard,
          phases: sortedPhases
        },
        roadmapWeeks: updatedWeeks
      };
    });

    return { syncedWeeksCount, updatedPhasesCount };
  };

  const updateDashboardSettings = (newSettings: Partial<DashboardSettings>) => {
    setState(prev => {
      let updatedWeeks = prev.roadmapWeeks;
      let nextPhases = newSettings.phases || prev.dashboard.phases;
      const today = new Date().toISOString().slice(0, 10);

      // If phases dates or modes are updated, propagate to corresponding weeks in roadmapWeeks
      if (newSettings.phases) {
        updatedWeeks = [...prev.roadmapWeeks];
        nextPhases = newSettings.phases.map(phase => {
          const isIntensifPhase = phase.name.toLowerCase().includes('intensif');
          if (isIntensifPhase) {
            const totalDays = prev.intensifDays.length;
            const doneDays = prev.intensifDays.filter(d => d.isDone).length;
            let newStatus = phase.status;
            if (totalDays > 0 && doneDays === totalDays) {
              newStatus = 'Selesai';
            } else if (doneDays > 0 || (phase.startDate && phase.endDate && today >= phase.startDate && today <= phase.endDate)) {
              newStatus = 'Sedang berjalan';
            } else {
              newStatus = 'Belum mulai';
            }
            return { ...phase, status: newStatus };
          }

          const matchingIndices = updatedWeeks
            .map((w, idx) => ({ w, idx }))
            .filter(({ w }) => isPhaseMatchingRotation(phase.name, w.rotation));

          if (matchingIndices.length > 0) {
            matchingIndices.forEach(({ idx }, weekIndexInPhase) => {
              const currentWeek = updatedWeeks[idx];
              const newStart = addDaysToDateStr(phase.startDate, weekIndexInPhase * 7);
              const isLastWeek = weekIndexInPhase === matchingIndices.length - 1;
              const newEnd = isLastWeek ? phase.endDate : addDaysToDateStr(newStart, 6);

              updatedWeeks[idx] = {
                ...currentWeek,
                startDate: newStart,
                endDate: newEnd,
                mode: phase.mode || currentWeek.mode
              };
            });

            const doneCount = matchingIndices.filter(({ idx }) => updatedWeeks[idx].isDone).length;
            let newStatus = phase.status;
            if (doneCount === matchingIndices.length) {
              newStatus = 'Selesai';
            } else if (doneCount > 0 || (phase.startDate && phase.endDate && today >= phase.startDate && today <= phase.endDate)) {
              newStatus = 'Sedang berjalan';
            } else {
              newStatus = 'Belum mulai';
            }

            return { ...phase, status: newStatus };
          }

          return phase;
        });
      }

      const sortedNextPhases = sortPhasesChronologically(nextPhases);

      const nextDashboard = {
        ...prev.dashboard,
        ...newSettings,
        phases: sortedNextPhases
      };

      if (userId) {
        trackerApi.updateDashboard(nextDashboard, sortedNextPhases)
          .then(res => { if (res.success) onGranularSyncSuccess(); })
          .catch(console.error);
      }

      return {
        ...prev,
        dashboard: nextDashboard,
        roadmapWeeks: updatedWeeks
      };
    });
  };

  const updatePhase = (phaseId: string, updated: Partial<ClerkshipPhase>) => {
    setState(prev => {
      const nextPhases = sortPhasesChronologically(
        prev.dashboard.phases.map(p => (p.id === phaseId ? { ...p, ...updated } : p))
      );
      const targetPhase = nextPhases.find(p => p.id === phaseId);
      let updatedWeeks = prev.roadmapWeeks;

      if (targetPhase && (updated.startDate || updated.endDate || updated.mode || updated.name)) {
        updatedWeeks = [...prev.roadmapWeeks];
        const matchingIndices = updatedWeeks
          .map((w, idx) => ({ w, idx }))
          .filter(({ w }) => isPhaseMatchingRotation(targetPhase.name, w.rotation));

        if (matchingIndices.length > 0) {
          matchingIndices.forEach(({ idx }, weekIndexInPhase) => {
            const currentWeek = updatedWeeks[idx];
            const newStart = addDaysToDateStr(targetPhase.startDate, weekIndexInPhase * 7);
            const isLastWeek = weekIndexInPhase === matchingIndices.length - 1;
            const newEnd = isLastWeek ? targetPhase.endDate : addDaysToDateStr(newStart, 6);

            updatedWeeks[idx] = {
              ...currentWeek,
              startDate: newStart,
              endDate: newEnd,
              mode: targetPhase.mode || currentWeek.mode
            };
          });
        }
      }

      if (userId) {
        trackerApi.updateDashboard(prev.dashboard, nextPhases)
          .then(res => { if (res.success) onGranularSyncSuccess(); })
          .catch(console.error);
      }

      return {
        ...prev,
        dashboard: {
          ...prev.dashboard,
          phases: nextPhases
        },
        roadmapWeeks: updatedWeeks
      };
    });
  };

  const addPhase = (phase: Omit<ClerkshipPhase, 'id'>) => {
    setState(prev => {
      const nextPhases = sortPhasesChronologically([
        ...prev.dashboard.phases,
        { ...phase, id: `phase-${Date.now()}` }
      ]);
      if (userId) {
        trackerApi.updateDashboard(prev.dashboard, nextPhases)
          .then(res => { if (res.success) onGranularSyncSuccess(); })
          .catch(console.error);
      }
      return {
        ...prev,
        dashboard: {
          ...prev.dashboard,
          phases: nextPhases
        }
      };
    });
  };

  const deletePhase = (phaseId: string) => {
    setState(prev => {
      const nextPhases = sortPhasesChronologically(
        prev.dashboard.phases.filter(p => p.id !== phaseId)
      );
      if (userId) {
        trackerApi.updateDashboard(prev.dashboard, nextPhases)
          .then(res => { if (res.success) onGranularSyncSuccess(); })
          .catch(console.error);
      }
      return {
        ...prev,
        dashboard: {
          ...prev.dashboard,
          phases: nextPhases
        }
      };
    });
  };

  // 2. Levels & Gamification
  const updateLevels = (levels: LevelItem[]) => {
    setState(prev => ({
      ...prev,
      leveling: {
        ...prev.leveling,
        levels
      }
    }));
    if (userId) {
      trackerApi.updateLeveling({ levels })
        .then(res => { if (res.success) onGranularSyncSuccess(); })
        .catch(console.error);
    }
  };

  const updateLevel = (levelNum: number, updated: Partial<LevelItem>) => {
    setState(prev => {
      const updatedLevels = prev.leveling.levels.map(l => (l.level === levelNum ? { ...l, ...updated } : l));
      if (userId) {
        trackerApi.updateLeveling({ levels: updatedLevels })
          .then(res => { if (res.success) onGranularSyncSuccess(); })
          .catch(console.error);
      }
      return {
        ...prev,
        leveling: {
          ...prev.leveling,
          levels: updatedLevels
        }
      };
    });
  };

  const claimLevelReward = (levelNum: number) => {
    setState(prev => {
      const updatedLevels = prev.leveling.levels.map(l =>
        l.level === levelNum ? { ...l, rewardClaimed: !l.rewardClaimed } : l
      );
      if (userId) {
        trackerApi.updateLeveling({ levels: updatedLevels })
          .then(res => { if (res.success) onGranularSyncSuccess(); })
          .catch(console.error);
      }
      return {
        ...prev,
        leveling: {
          ...prev.leveling,
          levels: updatedLevels
        }
      };
    });
  };

  const updateXPRules = (rules: XPRule[]) => {
    setState(prev => ({
      ...prev,
      leveling: {
        ...prev.leveling,
        xpRules: rules
      }
    }));
    if (userId) {
      trackerApi.updateLeveling({ xpRules: rules })
        .then(res => { if (res.success) onGranularSyncSuccess(); })
        .catch(console.error);
    }
  };

  // 3. Roadmap
  const addRoadmapWeek = (week: Omit<RoadmapWeek, 'weekNum' | 'weeklyHours' | 'weeklyQuestions'>) => {
    setState(prev => {
      const nextNum = prev.roadmapWeeks.length > 0 ? Math.max(...prev.roadmapWeeks.map(w => w.weekNum)) + 1 : 1;
      const weeklyHours = week.hoursPerDay * 6;
      const weeklyQuestions = week.questionsPerDay * 6;
      const newWeek: RoadmapWeek = {
        ...week,
        weekNum: nextNum,
        weeklyHours,
        weeklyQuestions
      };
      if (userId) {
        trackerApi.addRoadmapWeek(newWeek)
          .then(res => { if (res.success) onGranularSyncSuccess(); })
          .catch(console.error);
      }
      return {
        ...prev,
        roadmapWeeks: [...prev.roadmapWeeks, newWeek]
      };
    });
  };

  const updateRoadmapWeek = (weekNum: number, updated: Partial<RoadmapWeek>) => {
    setState(prev => ({
      ...prev,
      roadmapWeeks: prev.roadmapWeeks.map(w => (w.weekNum === weekNum ? { ...w, ...updated } : w))
    }));
    if (userId) {
      trackerApi.updateRoadmapWeek(weekNum, updated)
        .then(res => { if (res.success) onGranularSyncSuccess(); })
        .catch(console.error);
    }
  };

  const deleteRoadmapWeek = (weekNum: number) => {
    setState(prev => ({
      ...prev,
      roadmapWeeks: prev.roadmapWeeks.filter(w => w.weekNum !== weekNum)
    }));
    if (userId) {
      trackerApi.deleteRoadmapWeek(weekNum)
        .then(res => { if (res.success) onGranularSyncSuccess(); })
        .catch(console.error);
    }
  };

  const toggleRoadmapWeek = (weekNum: number) => {
    setState(prev => {
      const targetWeek = prev.roadmapWeeks.find(w => w.weekNum === weekNum);
      if (!targetWeek) return prev;

      const newIsDone = !targetWeek.isDone;
      const updatedWeeks = prev.roadmapWeeks.map(w =>
        w.weekNum === weekNum ? { ...w, isDone: newIsDone } : w
      );

      const today = new Date().toISOString().slice(0, 10);
      const phaseUpdates: { id: string; status: string }[] = [];

      const updatedPhases = prev.dashboard.phases.map(phase => {
        if (!isPhaseMatchingRotation(phase.name, targetWeek.rotation)) {
          return phase;
        }

        const matchingWeeks = updatedWeeks.filter(w => isPhaseMatchingRotation(phase.name, w.rotation));
        if (matchingWeeks.length === 0) return phase;

        const doneCount = matchingWeeks.filter(w => w.isDone).length;
        let newStatus = phase.status;
        if (doneCount === matchingWeeks.length) {
          newStatus = 'Selesai';
        } else if (doneCount > 0 || (phase.startDate && phase.endDate && today >= phase.startDate && today <= phase.endDate)) {
          newStatus = 'Sedang berjalan';
        } else {
          newStatus = 'Belum mulai';
        }

        if (newStatus !== phase.status) {
          phaseUpdates.push({ id: phase.id, status: newStatus });
        }

        return { ...phase, status: newStatus };
      });

      if (userId) {
        trackerApi.toggleRoadmapWeek(weekNum, newIsDone, phaseUpdates)
          .then(res => { if (res.success) onGranularSyncSuccess(); })
          .catch(console.error);
      }

      return {
        ...prev,
        dashboard: {
          ...prev.dashboard,
          phases: updatedPhases
        },
        roadmapWeeks: updatedWeeks
      };
    });
  };

  // 4. Intensif 70 Hari
  const addIntensifDay = (day: Omit<IntensifDay, 'dayNum'>) => {
    setState(prev => {
      const nextNum = prev.intensifDays.length > 0 ? Math.max(...prev.intensifDays.map(d => d.dayNum)) + 1 : 1;
      const newDay: IntensifDay = {
        ...day,
        dayNum: nextNum
      };
      if (userId) {
        trackerApi.addIntensifDay(newDay)
          .then(res => { if (res.success) onGranularSyncSuccess(); })
          .catch(console.error);
      }
      return {
        ...prev,
        intensifDays: [...prev.intensifDays, newDay]
      };
    });
  };

  const updateIntensifDay = (dayNum: number, updated: Partial<IntensifDay>) => {
    setState(prev => ({
      ...prev,
      intensifDays: prev.intensifDays.map(d => (d.dayNum === dayNum ? { ...d, ...updated } : d))
    }));
    if (userId) {
      trackerApi.updateIntensifDay(dayNum, updated)
        .then(res => { if (res.success) onGranularSyncSuccess(); })
        .catch(console.error);
    }
  };

  const deleteIntensifDay = (dayNum: number) => {
    setState(prev => ({
      ...prev,
      intensifDays: prev.intensifDays.filter(d => d.dayNum !== dayNum)
    }));
    if (userId) {
      trackerApi.deleteIntensifDay(dayNum)
        .then(res => { if (res.success) onGranularSyncSuccess(); })
        .catch(console.error);
    }
  };

  const toggleIntensifDay = (dayNum: number) => {
    setState(prev => {
      const targetDay = prev.intensifDays.find(d => d.dayNum === dayNum);
      if (!targetDay) return prev;

      const newIsDone = !targetDay.isDone;
      const updatedDays = prev.intensifDays.map(d =>
        d.dayNum === dayNum ? { ...d, isDone: newIsDone } : d
      );

      const today = new Date().toISOString().slice(0, 10);
      const totalDays = updatedDays.length;
      const doneDays = updatedDays.filter(d => d.isDone).length;
      const phaseUpdates: { id: string; status: string }[] = [];

      const updatedPhases = prev.dashboard.phases.map(phase => {
        if (!phase.name.toLowerCase().includes('intensif')) return phase;

        let newStatus = phase.status;
        if (totalDays > 0 && doneDays === totalDays) {
          newStatus = 'Selesai';
        } else if (doneDays > 0 || (phase.startDate && phase.endDate && today >= phase.startDate && today <= phase.endDate)) {
          newStatus = 'Sedang berjalan';
        } else {
          newStatus = 'Belum mulai';
        }

        if (newStatus !== phase.status) {
          phaseUpdates.push({ id: phase.id, status: newStatus });
        }

        return { ...phase, status: newStatus };
      });

      if (userId) {
        trackerApi.toggleIntensifDay(dayNum, newIsDone, phaseUpdates)
          .then(res => { if (res.success) onGranularSyncSuccess(); })
          .catch(console.error);
      }

      return {
        ...prev,
        dashboard: {
          ...prev.dashboard,
          phases: updatedPhases
        },
        intensifDays: updatedDays
      };
    });
  };

  const autoShiftIntensifFromDDay = (newDDay: string) => {
    // H-70 is 70 days before D-Day.
    // Day 1 = D-Day - 70 days.
    // Day 70 = D-Day - 1 day.
    setState(prev => {
      const updatedDays = prev.intensifDays.map(d => {
        const offset = -(70 - (d.dayNum - 1));
        const newDate = addDaysToDateStr(newDDay, offset);
        return {
          ...d,
          date: newDate,
          dayName: getDayNameIndo(newDate)
        };
      });

      if (userId) {
        trackerApi.shiftIntensif(updatedDays)
          .then(res => { if (res.success) onGranularSyncSuccess(); })
          .catch(console.error);
        trackerApi.updateDashboard({ ddayUKMPPD: newDDay })
          .catch(console.error);
      }

      return {
        ...prev,
        dashboard: {
          ...prev.dashboard,
          ddayUKMPPD: newDDay
        },
        intensifDays: updatedDays
      };
    });
  };

  // 5. SKDI Map
  const addSKDISystem = (sys: Omit<SKDISystem, 'no' | 'p1Done' | 'p2Done' | 'p3Done'>) => {
    setState(prev => {
      const nextNo = prev.skdiSystems.length > 0 ? Math.max(...prev.skdiSystems.map(s => s.no)) + 1 : 1;
      const newSys: SKDISystem = {
        ...sys,
        no: nextNo,
        p1Done: false,
        p2Done: false,
        p3Done: false
      };
      if (userId) {
        trackerApi.addSKDISystem(newSys)
          .then(res => { if (res.success) onGranularSyncSuccess(); })
          .catch(console.error);
      }
      return {
        ...prev,
        skdiSystems: [...prev.skdiSystems, newSys]
      };
    });
  };

  const updateSKDISystem = (no: number, updated: Partial<SKDISystem>) => {
    setState(prev => ({
      ...prev,
      skdiSystems: prev.skdiSystems.map(s => (s.no === no ? { ...s, ...updated } : s))
    }));
    if (userId) {
      trackerApi.updateSKDISystem(no, updated)
        .then(res => { if (res.success) onGranularSyncSuccess(); })
        .catch(console.error);
    }
  };

  const deleteSKDISystem = (no: number) => {
    setState(prev => ({
      ...prev,
      skdiSystems: prev.skdiSystems.filter(s => s.no !== no)
    }));
    if (userId) {
      trackerApi.deleteSKDISystem(no)
        .then(res => { if (res.success) onGranularSyncSuccess(); })
        .catch(console.error);
    }
  };

  const toggleSKDIPass = (no: number, pass: 'p1' | 'p2' | 'p3') => {
    setState(prev => {
      let targetDone = false;
      const updatedSystems = prev.skdiSystems.map(s => {
        if (s.no === no) {
          if (pass === 'p1') { targetDone = !s.p1Done; return { ...s, p1Done: targetDone }; }
          if (pass === 'p2') { targetDone = !s.p2Done; return { ...s, p2Done: targetDone }; }
          if (pass === 'p3') { targetDone = !s.p3Done; return { ...s, p3Done: targetDone }; }
        }
        return s;
      });

      if (userId) {
        trackerApi.toggleSKDIPass(no, pass, targetDone)
          .then(res => { if (res.success) onGranularSyncSuccess(); })
          .catch(console.error);
      }

      return {
        ...prev,
        skdiSystems: updatedSystems
      };
    });
  };

  // 6. Tryout
  const addTryout = (item: Omit<TryoutItem, 'no'>) => {
    setState(prev => {
      const nextNo = prev.tryouts.length > 0 ? Math.max(...prev.tryouts.map(t => t.no)) + 1 : 1;
      const newTO: TryoutItem = {
        ...item,
        no: nextNo
      };
      if (userId) {
        trackerApi.addTryout(newTO)
          .then(res => { if (res.success) onGranularSyncSuccess(); })
          .catch(console.error);
      }
      return {
        ...prev,
        tryouts: [...prev.tryouts, newTO]
      };
    });
  };

  const updateTryout = (no: number, updated: Partial<TryoutItem>) => {
    setState(prev => ({
      ...prev,
      tryouts: prev.tryouts.map(t => (t.no === no ? { ...t, ...updated } : t))
    }));
    if (userId) {
      trackerApi.updateTryout(no, updated)
        .then(res => { if (res.success) onGranularSyncSuccess(); })
        .catch(console.error);
    }
  };

  const deleteTryout = (no: number) => {
    setState(prev => ({
      ...prev,
      tryouts: prev.tryouts.filter(t => t.no !== no)
    }));
    if (userId) {
      trackerApi.deleteTryout(no)
        .then(res => { if (res.success) onGranularSyncSuccess(); })
        .catch(console.error);
    }
  };

  // 7. Error Book
  const addErrorEntry = (entry: Omit<ErrorBookItem, 'id' | 'no' | 'review1Done' | 'review7Done' | 'review30Done' | 'status'>) => {
    setState(prev => {
      const nextNo = prev.errorEntries.length > 0 ? Math.max(...prev.errorEntries.map(e => e.no)) + 1 : 1;
      const newEntry: ErrorBookItem = {
        ...entry,
        id: `err-${Date.now()}`,
        no: nextNo,
        review1Done: false,
        review7Done: false,
        review30Done: false,
        status: 'Aktif'
      };
      if (userId) {
        trackerApi.addErrorEntry(newEntry)
          .then(res => { if (res.success) onGranularSyncSuccess(); })
          .catch(console.error);
      }
      return {
        ...prev,
        errorEntries: [newEntry, ...prev.errorEntries]
      };
    });
  };

  const updateErrorEntry = (id: string, updated: Partial<ErrorBookItem>) => {
    setState(prev => ({
      ...prev,
      errorEntries: prev.errorEntries.map(e => (e.id === id ? { ...e, ...updated } : e))
    }));
    if (userId) {
      trackerApi.updateErrorEntry(id, updated)
        .then(res => { if (res.success) onGranularSyncSuccess(); })
        .catch(console.error);
    }
  };

  const deleteErrorEntry = (id: string) => {
    setState(prev => ({
      ...prev,
      errorEntries: prev.errorEntries.filter(e => e.id !== id)
    }));
    if (userId) {
      trackerApi.deleteErrorEntry(id)
        .then(res => { if (res.success) onGranularSyncSuccess(); })
        .catch(console.error);
    }
  };

  // 8. OSCE Skills
  const updateOSCESkill = (no: number, updated: Partial<OSCESkill>) => {
    setState(prev => ({
      ...prev,
      osceSkills: prev.osceSkills.map(s => (s.no === no ? { ...s, ...updated } : s))
    }));
    if (userId) {
      trackerApi.updateOSCESkill(no, updated)
        .then(res => { if (res.success) onGranularSyncSuccess(); })
        .catch(console.error);
    }
  };

  const toggleOSCETask = (no: number, stage: 'pahami' | 'solo' | 'partner' | 'dinilai') => {
    setState(prev => {
      let targetDone = false;
      const updatedSkills = prev.osceSkills.map(s => {
        if (s.no === no) {
          if (stage === 'pahami') { targetDone = !s.pahamiDone; return { ...s, pahamiDone: targetDone }; }
          if (stage === 'solo') { targetDone = !s.soloDone; return { ...s, soloDone: targetDone }; }
          if (stage === 'partner') { targetDone = !s.partnerDone; return { ...s, partnerDone: targetDone }; }
          if (stage === 'dinilai') { targetDone = !s.dinilaiDone; return { ...s, dinilaiDone: targetDone }; }
        }
        return s;
      });

      if (userId) {
        trackerApi.toggleOSCETask(no, stage, targetDone)
          .then(res => { if (res.success) onGranularSyncSuccess(); })
          .catch(console.error);
      }

      return {
        ...prev,
        osceSkills: updatedSkills
      };
    });
  };

  const addOSCESkill = (skill: Omit<OSCESkill, 'no'>) => {
    setState(prev => {
      const nextNo = prev.osceSkills.length > 0 ? Math.max(...prev.osceSkills.map(s => s.no)) + 1 : 1;
      const newSkill: OSCESkill = { ...skill, no: nextNo };
      if (userId) {
        trackerApi.addOSCESkill(newSkill)
          .then(res => { if (res.success) onGranularSyncSuccess(); })
          .catch(console.error);
      }
      return {
        ...prev,
        osceSkills: [...prev.osceSkills, newSkill]
      };
    });
  };

  const deleteOSCESkill = (no: number) => {
    setState(prev => ({
      ...prev,
      osceSkills: prev.osceSkills.filter(s => s.no !== no)
    }));
    if (userId) {
      trackerApi.deleteOSCESkill(no)
        .then(res => { if (res.success) onGranularSyncSuccess(); })
        .catch(console.error);
    }
  };

  // 9. Habits
  const addHabit = (name: string, priority: string) => {
    const id = `habit-${Date.now()}`;
    const newHabit = { id, name, priority };
    setState(prev => ({
      ...prev,
      habits: [
        ...prev.habits,
        newHabit
      ]
    }));
    if (userId) {
      trackerApi.addHabit(newHabit)
        .then(res => { if (res.success) onGranularSyncSuccess(); })
        .catch(console.error);
    }
  };

  const updateHabit = (id: string, name: string, priority: string) => {
    setState(prev => ({
      ...prev,
      habits: prev.habits.map(h => (h.id === id ? { ...h, name, priority } : h))
    }));
    if (userId) {
      trackerApi.updateHabit(id, name, priority)
        .then(res => { if (res.success) onGranularSyncSuccess(); })
        .catch(console.error);
    }
  };

  const deleteHabit = (id: string) => {
    setState(prev => ({
      ...prev,
      habits: prev.habits.filter(h => h.id !== id)
    }));
    if (userId) {
      trackerApi.deleteHabit(id)
        .then(res => { if (res.success) onGranularSyncSuccess(); })
        .catch(console.error);
    }
  };

  const logDailyHabit = (date: string, level: number, habitsDone: string[], note?: string) => {
    setState(prev => ({
      ...prev,
      dailyHabitLogs: {
        ...prev.dailyHabitLogs,
        [date]: {
          date,
          level,
          habitsDone,
          note
        }
      }
    }));
    if (userId) {
      trackerApi.logHabit({ date, level, habitsDone, note })
        .then(res => { if (res.success) onGranularSyncSuccess(); })
        .catch(console.error);
    }
  };

  // Backup & Reset
  const resetToDefaultData = () => {
    if (userId) {
      try {
        localStorage.removeItem(getUserStorageKey(userId));
        localStorage.removeItem(getPendingSyncKey(userId));
      } catch {}
    }
    try {
      localStorage.removeItem('doctor_tracker_ukmppd_state_v2');
      localStorage.removeItem('doctor_tracker_ukmppd_state_v1');
    } catch {}

    const def = { ...defaultAppState };
    if (user?.fullName) {
      def.dashboard.doctorNickname = user.fullName.split(' ')[0] || user.fullName;
    }
    setState(def);
    if (userId) {
      trackerApi.syncState(def).catch(console.error);
    }
  };

  const exportDataJSON = () => {
    return JSON.stringify(state, null, 2);
  };

  const importDataJSON = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr) as AppState;
      if (parsed.dashboard && parsed.leveling && parsed.roadmapWeeks) {
        setState(parsed);
        if (userId) {
          try {
            localStorage.setItem(getUserStorageKey(userId), JSON.stringify(parsed));
            localStorage.setItem(getPendingSyncKey(userId), 'false');
          } catch {}
          trackerApi.syncState(parsed).catch(console.error);
        }
        return true;
      }
      return false;
    } catch (e) {
      console.error('Failed to import JSON data:', e);
      return false;
    }
  };

  // 10. Guidelines
  const addGuideline = (item: GuidelineItem) => {
    setState(prev => ({
      ...prev,
      guidelines: [...(prev.guidelines || []), item]
    }));
  };

  const updateGuideline = (index: number, updated: Partial<GuidelineItem>) => {
    setState(prev => ({
      ...prev,
      guidelines: (prev.guidelines || []).map((g, i) => (i === index ? { ...g, ...updated } : g))
    }));
  };

  const deleteGuideline = (index: number) => {
    setState(prev => ({
      ...prev,
      guidelines: (prev.guidelines || []).filter((_, i) => i !== index)
    }));
  };

  return (
    <AppContext.Provider
      value={{
        state,
        progress,
        setCloudState,
        isCloudSyncing,
        lastCloudSyncedAt,
        syncToCloudNow,
        updateDashboardSettings,
        updatePhase,
        addPhase,
        deletePhase,
        updateLevels,
        updateLevel,
        claimLevelReward,
        updateXPRules,
        roadmapFilter,
        setRoadmapFilter,
        syncRoadmapWithPhases,
        addRoadmapWeek,
        updateRoadmapWeek,
        deleteRoadmapWeek,
        toggleRoadmapWeek,
        addIntensifDay,
        updateIntensifDay,
        deleteIntensifDay,
        toggleIntensifDay,
        autoShiftIntensifFromDDay,
        addSKDISystem,
        updateSKDISystem,
        deleteSKDISystem,
        toggleSKDIPass,
        addTryout,
        updateTryout,
        deleteTryout,
        addErrorEntry,
        updateErrorEntry,
        deleteErrorEntry,
        updateOSCESkill,
        toggleOSCETask,
        addOSCESkill,
        deleteOSCESkill,
        addHabit,
        updateHabit,
        deleteHabit,
        logDailyHabit,
        addGuideline,
        updateGuideline,
        deleteGuideline,
        resetToDefaultData,
        exportDataJSON,
        importDataJSON
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

