import { Router } from 'express';
import {
  handleGetTrackerState,
  handleSyncTrackerState,
  handleUpdateDashboard,
  handleLogDailyHabit,
  handleToggleRoadmapWeek,
  handleUpdateRoadmapWeek,
  handleAddRoadmapWeek,
  handleDeleteRoadmapWeek,
  handleBatchSyncRoadmap,
  handleToggleIntensifDay,
  handleUpdateIntensifDay,
  handleAddIntensifDay,
  handleDeleteIntensifDay,
  handleShiftIntensif,
  handleToggleSKDIPass,
  handleUpdateSKDISystem,
  handleAddSKDISystem,
  handleDeleteSKDISystem,
  handleAddHabit,
  handleUpdateHabit,
  handleDeleteHabit,
  handleAddErrorEntry,
  handleUpdateErrorEntry,
  handleDeleteErrorEntry,
  handleAddTryout,
  handleUpdateTryout,
  handleDeleteTryout,
  handleToggleOSCETask,
  handleUpdateOSCESkill,
  handleAddOSCESkill,
  handleDeleteOSCESkill,
  handleUpdateLeveling
} from '../controllers/tracker.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// 1. Snapshot State & Full Backup Sync
router.get('/state', authMiddleware, handleGetTrackerState);
router.post('/sync', authMiddleware, handleSyncTrackerState);

// 2. Dashboard Settings & Phases
router.put('/dashboard', authMiddleware, handleUpdateDashboard);

// 3. Roadmap 56 Minggu (Granular)
router.patch('/roadmap/:weekNum/toggle', authMiddleware, handleToggleRoadmapWeek);
router.put('/roadmap/:weekNum', authMiddleware, handleUpdateRoadmapWeek);
router.post('/roadmap', authMiddleware, handleAddRoadmapWeek);
router.delete('/roadmap/:weekNum', authMiddleware, handleDeleteRoadmapWeek);
router.put('/roadmap', authMiddleware, handleBatchSyncRoadmap);

// 4. Intensif 70 Hari (Granular)
router.patch('/intensif/:dayNum/toggle', authMiddleware, handleToggleIntensifDay);
router.put('/intensif/:dayNum', authMiddleware, handleUpdateIntensifDay);
router.post('/intensif', authMiddleware, handleAddIntensifDay);
router.delete('/intensif/:dayNum', authMiddleware, handleDeleteIntensifDay);
router.post('/intensif/shift', authMiddleware, handleShiftIntensif);

// 5. Habits & Daily Logs (Granular)
router.post('/habits/log', authMiddleware, handleLogDailyHabit);
router.post('/habits', authMiddleware, handleAddHabit);
router.put('/habits/:id', authMiddleware, handleUpdateHabit);
router.delete('/habits/:id', authMiddleware, handleDeleteHabit);

// 6. SKDI Map (Granular)
router.patch('/skdi/:no/pass', authMiddleware, handleToggleSKDIPass);
router.put('/skdi/:no', authMiddleware, handleUpdateSKDISystem);
router.post('/skdi', authMiddleware, handleAddSKDISystem);
router.delete('/skdi/:no', authMiddleware, handleDeleteSKDISystem);

// 7. Error Book (Granular)
router.post('/error-book', authMiddleware, handleAddErrorEntry);
router.put('/error-book/:id', authMiddleware, handleUpdateErrorEntry);
router.delete('/error-book/:id', authMiddleware, handleDeleteErrorEntry);

// 8. Tryouts (Granular)
router.post('/tryouts', authMiddleware, handleAddTryout);
router.put('/tryouts/:no', authMiddleware, handleUpdateTryout);
router.delete('/tryouts/:no', authMiddleware, handleDeleteTryout);

// 9. OSCE Skills (Granular)
router.patch('/osce/:no/toggle', authMiddleware, handleToggleOSCETask);
router.put('/osce/:no', authMiddleware, handleUpdateOSCESkill);
router.post('/osce', authMiddleware, handleAddOSCESkill);
router.delete('/osce/:no', authMiddleware, handleDeleteOSCESkill);

// 10. Leveling & XP Rules (Granular)
router.put('/leveling', authMiddleware, handleUpdateLeveling);

export default router;

