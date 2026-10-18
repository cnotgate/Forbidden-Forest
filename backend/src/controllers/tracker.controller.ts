import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { getUserFullState, importFullUserState } from '../services/template.service';
import { prisma } from '../lib/prisma';

export async function handleGetTrackerState(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.userId!;
    const state = await getUserFullState(userId);

    return res.status(200).json({
      success: true,
      data: { state }
    });
  } catch (err) {
    next(err);
  }
}

export async function handleSyncTrackerState(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.userId!;
    const state = req.body;

    if (!state || typeof state !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Payload sync tidak valid.'
      });
    }

    await importFullUserState(userId, state);
    const updatedState = await getUserFullState(userId);

    return res.status(200).json({
      success: true,
      message: 'State berhasil disinkronisasi ke server.',
      data: { state: updatedState }
    });
  } catch (err) {
    next(err);
  }
}

export async function handleUpdateDashboard(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.userId!;
    const { settings, phases } = req.body;

    if (settings) {
      await prisma.dashboardSettings.update({
        where: { userId },
        data: {
          ...(settings.startPlanner ? { startPlanner: settings.startPlanner } : {}),
          ...(settings.ddayUKMPPD ? { ddayUKMPPD: settings.ddayUKMPPD } : {}),
          ...(settings.targetCBT !== undefined ? { targetCBT: settings.targetCBT } : {}),
          ...(settings.batasAman !== undefined ? { batasAman: settings.batasAman } : {}),
          ...(settings.doctorAvatar ? { doctorAvatar: settings.doctorAvatar } : {}),
          ...(settings.doctorNickname ? { doctorNickname: settings.doctorNickname } : {}),
          ...(settings.companionMood ? { companionMood: settings.companionMood } : {}),
          ...(settings.modes ? { modes: settings.modes } : {})
        }
      });
    }

    if (Array.isArray(phases)) {
      const sortedPhases = [...phases].sort((a: any, b: any) => {
        if (a.startDate && b.startDate) return a.startDate.localeCompare(b.startDate);
        return 0;
      });
      await prisma.clerkshipPhase.deleteMany({ where: { userId } });
      await prisma.clerkshipPhase.createMany({
        data: sortedPhases.map((p: any) => ({
          userId,
          name: p.name,
          type: p.type,
          startDate: p.startDate,
          endDate: p.endDate,
          durationWeeks: p.durationWeeks,
          status: p.status,
          mode: p.mode,
          notes: p.notes || ''
        }))
      });
    }

    const updatedState = await getUserFullState(userId);
    return res.status(200).json({
      success: true,
      data: { dashboard: updatedState.dashboard }
    });
  } catch (err) {
    next(err);
  }
}

export async function handleLogDailyHabit(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.userId!;
    const { date, level, habitsDone, note } = req.body;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Tanggal log harian wajib diisi.'
      });
    }

    await prisma.dailyHabitLog.upsert({
      where: {
        userId_date: { userId, date }
      },
      update: {
        level: level !== undefined ? level : 1,
        habitsDone: habitsDone || [],
        note: note !== undefined ? note : null
      },
      create: {
        userId,
        date,
        level: level !== undefined ? level : 1,
        habitsDone: habitsDone || [],
        note: note !== undefined ? note : null
      }
    });

    const updatedState = await getUserFullState(userId);
    return res.status(200).json({
      success: true,
      data: { dailyHabitLogs: updatedState.dailyHabitLogs }
    });
  } catch (err) {
    next(err);
  }
}

// ==========================================
// GRANULAR CONTROLLERS FOR FAST INCREMENTAL SYNC
// ==========================================

// --- ROADMAP ---
export async function handleToggleRoadmapWeek(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.userId!;
    const weekNum = parseInt(req.params.weekNum, 10);
    const { isDone, phaseUpdates } = req.body;

    if (isNaN(weekNum)) {
      return res.status(400).json({ success: false, message: 'weekNum tidak valid' });
    }

    await prisma.roadmapWeek.updateMany({
      where: { userId, weekNum },
      data: { isDone: Boolean(isDone) }
    });

    if (Array.isArray(phaseUpdates) && phaseUpdates.length > 0) {
      for (const pu of phaseUpdates) {
        if (pu.id && pu.status) {
          await prisma.clerkshipPhase.updateMany({
            where: { userId, id: pu.id },
            data: { status: pu.status }
          });
        }
      }
    }

    return res.status(200).json({ success: true, weekNum, isDone });
  } catch (err) {
    next(err);
  }
}

export async function handleUpdateRoadmapWeek(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.userId!;
    const weekNum = parseInt(req.params.weekNum, 10);
    const updated = req.body;

    if (isNaN(weekNum)) {
      return res.status(400).json({ success: false, message: 'weekNum tidak valid' });
    }

    await prisma.roadmapWeek.updateMany({
      where: { userId, weekNum },
      data: {
        ...(updated.focusA !== undefined ? { focusA: updated.focusA } : {}),
        ...(updated.focusB !== undefined ? { focusB: updated.focusB } : {}),
        ...(updated.milestone !== undefined ? { milestone: updated.milestone } : {}),
        ...(updated.mode !== undefined ? { mode: updated.mode } : {}),
        ...(updated.rotation !== undefined ? { rotation: updated.rotation } : {}),
        ...(updated.startDate !== undefined ? { startDate: updated.startDate } : {}),
        ...(updated.endDate !== undefined ? { endDate: updated.endDate } : {}),
        ...(updated.hoursPerDay !== undefined ? { hoursPerDay: updated.hoursPerDay } : {}),
        ...(updated.questionsPerDay !== undefined ? { questionsPerDay: updated.questionsPerDay } : {}),
        ...(updated.weeklyHours !== undefined ? { weeklyHours: updated.weeklyHours } : {}),
        ...(updated.weeklyQuestions !== undefined ? { weeklyQuestions: updated.weeklyQuestions } : {}),
        ...(updated.isDone !== undefined ? { isDone: updated.isDone } : {})
      }
    });

    return res.status(200).json({ success: true, weekNum });
  } catch (err) {
    next(err);
  }
}

export async function handleAddRoadmapWeek(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.userId!;
    const rw = req.body;
    const weekNum = parseInt(rw.weekNum, 10);

    if (isNaN(weekNum)) {
      return res.status(400).json({ success: false, message: 'weekNum tidak valid' });
    }

    const payload = {
      startDate: rw.startDate || '',
      endDate: rw.endDate || '',
      rotation: rw.rotation || '',
      mode: rw.mode || 'Lite',
      hoursPerDay: Number(rw.hoursPerDay) || 2,
      questionsPerDay: Number(rw.questionsPerDay) || 20,
      weeklyHours: Number(rw.weeklyHours) || 12,
      weeklyQuestions: Number(rw.weeklyQuestions) || 120,
      focusA: rw.focusA || '',
      focusB: rw.focusB || '',
      milestone: rw.milestone || '',
      isDone: Boolean(rw.isDone)
    };

    const created = await prisma.roadmapWeek.upsert({
      where: {
        userId_weekNum: { userId, weekNum }
      },
      create: {
        userId,
        weekNum,
        ...payload
      },
      update: payload
    });

    return res.status(200).json({ success: true, data: created });
  } catch (err) {
    next(err);
  }
}

export async function handleDeleteRoadmapWeek(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.userId!;
    const weekNum = parseInt(req.params.weekNum, 10);

    if (isNaN(weekNum)) {
      return res.status(400).json({ success: false, message: 'weekNum tidak valid' });
    }

    await prisma.roadmapWeek.deleteMany({
      where: { userId, weekNum }
    });

    return res.status(200).json({ success: true, weekNum });
  } catch (err) {
    next(err);
  }
}

export async function handleBatchSyncRoadmap(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.userId!;
    const { roadmapWeeks, phases } = req.body;

    await prisma.$transaction(async tx => {
      if (Array.isArray(roadmapWeeks)) {
        await tx.roadmapWeek.deleteMany({ where: { userId } });
        await tx.roadmapWeek.createMany({
          data: roadmapWeeks.map((rw: any) => ({
            userId,
            weekNum: rw.weekNum,
            startDate: rw.startDate,
            endDate: rw.endDate,
            rotation: rw.rotation,
            mode: rw.mode,
            hoursPerDay: rw.hoursPerDay,
            questionsPerDay: rw.questionsPerDay,
            weeklyHours: rw.weeklyHours,
            weeklyQuestions: rw.weeklyQuestions,
            focusA: rw.focusA,
            focusB: rw.focusB,
            milestone: rw.milestone,
            isDone: rw.isDone || false
          }))
        });
      }

      if (Array.isArray(phases)) {
        const sortedPhases = [...phases].sort((a: any, b: any) => {
          if (a.startDate && b.startDate) return a.startDate.localeCompare(b.startDate);
          return 0;
        });
        await tx.clerkshipPhase.deleteMany({ where: { userId } });
        await tx.clerkshipPhase.createMany({
          data: sortedPhases.map((p: any) => ({
            userId,
            name: p.name,
            type: p.type,
            startDate: p.startDate,
            endDate: p.endDate,
            durationWeeks: p.durationWeeks,
            status: p.status,
            mode: p.mode,
            notes: p.notes || ''
          }))
        });
      }
    });

    return res.status(200).json({ success: true, message: 'Roadmap and phases synced' });
  } catch (err) {
    next(err);
  }
}

// --- INTENSIF ---
export async function handleToggleIntensifDay(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.userId!;
    const dayNum = parseInt(req.params.dayNum, 10);
    const { isDone, phaseUpdates } = req.body;

    if (isNaN(dayNum)) {
      return res.status(400).json({ success: false, message: 'dayNum tidak valid' });
    }

    await prisma.intensifDay.updateMany({
      where: { userId, dayNum },
      data: { isDone: Boolean(isDone) }
    });

    if (Array.isArray(phaseUpdates) && phaseUpdates.length > 0) {
      for (const pu of phaseUpdates) {
        if (pu.id && pu.status) {
          await prisma.clerkshipPhase.updateMany({
            where: { userId, id: pu.id },
            data: { status: pu.status }
          });
        }
      }
    }

    return res.status(200).json({ success: true, dayNum, isDone });
  } catch (err) {
    next(err);
  }
}

export async function handleUpdateIntensifDay(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.userId!;
    const dayNum = parseInt(req.params.dayNum, 10);
    const updated = req.body;

    if (isNaN(dayNum)) {
      return res.status(400).json({ success: false, message: 'dayNum tidak valid' });
    }

    await prisma.intensifDay.updateMany({
      where: { userId, dayNum },
      data: {
        ...(updated.focus !== undefined ? { focus: updated.focus } : {}),
        ...(updated.coreActivity !== undefined ? { coreActivity: updated.coreActivity } : {}),
        ...(updated.targetQuestions !== undefined ? { targetQuestions: updated.targetQuestions } : {}),
        ...(updated.targetHours !== undefined ? { targetHours: updated.targetHours } : {}),
        ...(updated.notes !== undefined ? { notes: updated.notes } : {}),
        ...(updated.isDone !== undefined ? { isDone: updated.isDone } : {})
      }
    });

    return res.status(200).json({ success: true, dayNum });
  } catch (err) {
    next(err);
  }
}

export async function handleAddIntensifDay(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.userId!;
    const item = req.body;
    const dayNum = parseInt(item.dayNum, 10);

    if (isNaN(dayNum)) {
      return res.status(400).json({ success: false, message: 'dayNum tidak valid' });
    }

    const payload = {
      date: item.date || '',
      dayName: item.dayName || '',
      type: item.type || '',
      focus: item.focus || '',
      coreActivity: item.coreActivity || '',
      targetQuestions: Number(item.targetQuestions) || 0,
      targetHours: Number(item.targetHours) || 0,
      isDone: Boolean(item.isDone),
      notes: item.notes || ''
    };

    const created = await prisma.intensifDay.upsert({
      where: {
        userId_dayNum: { userId, dayNum }
      },
      create: {
        userId,
        dayNum,
        ...payload
      },
      update: payload
    });

    return res.status(200).json({ success: true, data: created });
  } catch (err) {
    next(err);
  }
}

export async function handleDeleteIntensifDay(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.userId!;
    const dayNum = parseInt(req.params.dayNum, 10);

    if (isNaN(dayNum)) {
      return res.status(400).json({ success: false, message: 'dayNum tidak valid' });
    }

    await prisma.intensifDay.deleteMany({
      where: { userId, dayNum }
    });

    return res.status(200).json({ success: true, dayNum });
  } catch (err) {
    next(err);
  }
}

export async function handleShiftIntensif(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.userId!;
    const { intensifDays } = req.body;

    if (Array.isArray(intensifDays)) {
      await prisma.$transaction(async tx => {
        await tx.intensifDay.deleteMany({ where: { userId } });
        await tx.intensifDay.createMany({
          data: intensifDays.map((id: any) => ({
            userId,
            dayNum: id.dayNum,
            date: id.date,
            dayName: id.dayName,
            type: id.type,
            focus: id.focus,
            coreActivity: id.coreActivity,
            targetQuestions: id.targetQuestions,
            targetHours: id.targetHours,
            isDone: id.isDone || false,
            notes: id.notes || ''
          }))
        });
      });
    }

    return res.status(200).json({ success: true, message: 'Intensif days shifted' });
  } catch (err) {
    next(err);
  }
}

// --- SKDI ---
export async function handleToggleSKDIPass(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.userId!;
    const no = parseInt(req.params.no, 10);
    const { pass, done } = req.body;

    if (isNaN(no) || !pass) {
      return res.status(400).json({ success: false, message: 'Parameter tidak valid' });
    }

    const fieldMap: Record<string, string> = {
      p1: 'p1Done',
      p2: 'p2Done',
      p3: 'p3Done'
    };

    const field = fieldMap[pass];
    if (!field) {
      return res.status(400).json({ success: false, message: 'Pass tidak valid' });
    }

    await (prisma as any).skdiSystem.updateMany({
      where: { userId, no },
      data: { [field]: Boolean(done) }
    });

    return res.status(200).json({ success: true, no, pass, done });
  } catch (err) {
    next(err);
  }
}

export async function handleUpdateSKDISystem(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.userId!;
    const no = parseInt(req.params.no, 10);
    const updated = req.body;

    if (isNaN(no)) {
      return res.status(400).json({ success: false, message: 'no tidak valid' });
    }

    await (prisma as any).skdiSystem.updateMany({
      where: { userId, no },
      data: {
        ...(updated.status !== undefined ? { status: updated.status } : {}),
        ...(updated.pass1Desc !== undefined ? { pass1Desc: updated.pass1Desc } : {}),
        ...(updated.pass2Desc !== undefined ? { pass2Desc: updated.pass2Desc } : {}),
        ...(updated.pass3Desc !== undefined ? { pass3Desc: updated.pass3Desc } : {}),
        ...(updated.skdiNotes !== undefined ? { skdiNotes: updated.skdiNotes } : {}),
        ...(updated.p1Done !== undefined ? { p1Done: updated.p1Done } : {}),
        ...(updated.p2Done !== undefined ? { p2Done: updated.p2Done } : {}),
        ...(updated.p3Done !== undefined ? { p3Done: updated.p3Done } : {})
      }
    });

    return res.status(200).json({ success: true, no });
  } catch (err) {
    next(err);
  }
}

export async function handleAddSKDISystem(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.userId!;
    const item = req.body;
    const no = parseInt(item.no, 10);

    if (isNaN(no)) {
      return res.status(400).json({ success: false, message: 'no tidak valid' });
    }

    const payload = {
      systemName: item.systemName || '',
      clerkshipSource: item.clerkshipSource || '',
      status: item.status || 'Belum dibaca',
      pass1Desc: item.pass1Desc || '',
      pass2Desc: item.pass2Desc || '',
      pass3Desc: item.pass3Desc || '',
      skdiNotes: item.skdiNotes || '',
      p1Done: Boolean(item.p1Done),
      p2Done: Boolean(item.p2Done),
      p3Done: Boolean(item.p3Done)
    };

    const created = await prisma.skdiSystem.upsert({
      where: {
        userId_no: { userId, no }
      },
      create: {
        userId,
        no,
        ...payload
      },
      update: payload
    });

    return res.status(200).json({ success: true, data: created });
  } catch (err) {
    next(err);
  }
}

export async function handleDeleteSKDISystem(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.userId!;
    const no = parseInt(req.params.no, 10);

    if (isNaN(no)) {
      return res.status(400).json({ success: false, message: 'no tidak valid' });
    }

    await prisma.skdiSystem.deleteMany({
      where: { userId, no }
    });

    return res.status(200).json({ success: true, no });
  } catch (err) {
    next(err);
  }
}

// --- HABITS CRUD ---
export async function handleAddHabit(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.userId!;
    const { id, name, priority } = req.body;

    const created = id
      ? await prisma.habitItem.upsert({
          where: { id },
          create: {
            id,
            userId,
            name: name || '',
            priority: priority || 'High'
          },
          update: {
            name: name || '',
            priority: priority || 'High'
          }
        })
      : await prisma.habitItem.create({
          data: {
            userId,
            name: name || '',
            priority: priority || 'High'
          }
        });

    return res.status(200).json({ success: true, data: created });
  } catch (err) {
    next(err);
  }
}

export async function handleUpdateHabit(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.userId!;
    const { id } = req.params;
    const { name, priority } = req.body;

    await prisma.habitItem.updateMany({
      where: { userId, id },
      data: {
        ...(name !== undefined ? { name } : {}),
        ...(priority !== undefined ? { priority } : {})
      }
    });

    return res.status(200).json({ success: true, id });
  } catch (err) {
    next(err);
  }
}

export async function handleDeleteHabit(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    await prisma.habitItem.deleteMany({
      where: { userId, id }
    });

    return res.status(200).json({ success: true, id });
  } catch (err) {
    next(err);
  }
}

// --- ERROR BOOK ---
export async function handleAddErrorEntry(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.userId!;
    const entry = req.body;
    const id = entry.id || undefined;

    const payload = {
      no: Number(entry.no) || 1,
      date: entry.date || '',
      source: entry.source || '',
      topic: entry.topic || '',
      system: entry.system || '',
      caseSummary: entry.caseSummary || '',
      myAnswer: entry.myAnswer || '',
      correctAnswer: entry.correctAnswer || '',
      errorType: entry.errorType || '',
      reasonWhy: entry.reasonWhy || '',
      review1Date: entry.review1Date || '',
      review7Date: entry.review7Date || '',
      review30Date: entry.review30Date || '',
      review1Done: Boolean(entry.review1Done),
      review7Done: Boolean(entry.review7Done),
      review30Done: Boolean(entry.review30Done),
      status: entry.status || 'Perlu Review'
    };

    const created = id
      ? await prisma.errorBookItem.upsert({
          where: { id },
          create: {
            id,
            userId,
            ...payload
          },
          update: payload
        })
      : await prisma.errorBookItem.create({
          data: {
            userId,
            ...payload
          }
        });

    return res.status(200).json({ success: true, data: created });
  } catch (err) {
    next(err);
  }
}

export async function handleUpdateErrorEntry(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.userId!;
    const { id } = req.params;
    const updated = req.body;

    await prisma.errorBookItem.updateMany({
      where: { userId, id },
      data: {
        ...(updated.date !== undefined ? { date: updated.date } : {}),
        ...(updated.source !== undefined ? { source: updated.source } : {}),
        ...(updated.topic !== undefined ? { topic: updated.topic } : {}),
        ...(updated.system !== undefined ? { system: updated.system } : {}),
        ...(updated.caseSummary !== undefined ? { caseSummary: updated.caseSummary } : {}),
        ...(updated.myAnswer !== undefined ? { myAnswer: updated.myAnswer } : {}),
        ...(updated.correctAnswer !== undefined ? { correctAnswer: updated.correctAnswer } : {}),
        ...(updated.errorType !== undefined ? { errorType: updated.errorType } : {}),
        ...(updated.reasonWhy !== undefined ? { reasonWhy: updated.reasonWhy } : {}),
        ...(updated.review1Date !== undefined ? { review1Date: updated.review1Date } : {}),
        ...(updated.review7Date !== undefined ? { review7Date: updated.review7Date } : {}),
        ...(updated.review30Date !== undefined ? { review30Date: updated.review30Date } : {}),
        ...(updated.review1Done !== undefined ? { review1Done: updated.review1Done } : {}),
        ...(updated.review7Done !== undefined ? { review7Done: updated.review7Done } : {}),
        ...(updated.review30Done !== undefined ? { review30Done: updated.review30Done } : {}),
        ...(updated.status !== undefined ? { status: updated.status } : {})
      }
    });

    return res.status(200).json({ success: true, id });
  } catch (err) {
    next(err);
  }
}

export async function handleDeleteErrorEntry(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    await prisma.errorBookItem.deleteMany({
      where: { userId, id }
    });

    return res.status(200).json({ success: true, id });
  } catch (err) {
    next(err);
  }
}

// --- TRYOUTS ---
export async function handleAddTryout(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.userId!;
    const item = req.body;
    const no = parseInt(item.no, 10);

    if (isNaN(no)) {
      return res.status(400).json({ success: false, message: 'no tidak valid' });
    }

    const payload = {
      plannedDate: item.plannedDate || '',
      context: item.context || '',
      source: item.source || '',
      questionsCount: Number(item.questionsCount) || 150,
      targetScore: Number(item.targetScore) || 70,
      actualScore: item.actualScore !== undefined && item.actualScore !== null ? Number(item.actualScore) : null,
      weakTopics: item.weakTopics || '',
      notes: item.notes || ''
    };

    const created = await prisma.tryoutItem.upsert({
      where: {
        userId_no: { userId, no }
      },
      create: {
        userId,
        no,
        ...payload
      },
      update: payload
    });

    return res.status(200).json({ success: true, data: created });
  } catch (err) {
    next(err);
  }
}

export async function handleUpdateTryout(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.userId!;
    const no = parseInt(req.params.no, 10);
    const updated = req.body;

    if (isNaN(no)) {
      return res.status(400).json({ success: false, message: 'no tidak valid' });
    }

    await prisma.tryoutItem.updateMany({
      where: { userId, no },
      data: {
        ...(updated.plannedDate !== undefined ? { plannedDate: updated.plannedDate } : {}),
        ...(updated.context !== undefined ? { context: updated.context } : {}),
        ...(updated.source !== undefined ? { source: updated.source } : {}),
        ...(updated.questionsCount !== undefined ? { questionsCount: updated.questionsCount } : {}),
        ...(updated.targetScore !== undefined ? { targetScore: updated.targetScore } : {}),
        ...(updated.actualScore !== undefined ? { actualScore: updated.actualScore } : {}),
        ...(updated.weakTopics !== undefined ? { weakTopics: updated.weakTopics } : {}),
        ...(updated.notes !== undefined ? { notes: updated.notes } : {})
      }
    });

    return res.status(200).json({ success: true, no });
  } catch (err) {
    next(err);
  }
}

export async function handleDeleteTryout(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.userId!;
    const no = parseInt(req.params.no, 10);

    if (isNaN(no)) {
      return res.status(400).json({ success: false, message: 'no tidak valid' });
    }

    await prisma.tryoutItem.deleteMany({
      where: { userId, no }
    });

    return res.status(200).json({ success: true, no });
  } catch (err) {
    next(err);
  }
}

// --- OSCE ---
export async function handleToggleOSCETask(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.userId!;
    const no = parseInt(req.params.no, 10);
    const { stage, done } = req.body;

    if (isNaN(no) || !stage) {
      return res.status(400).json({ success: false, message: 'Parameter tidak valid' });
    }

    const fieldMap: Record<string, string> = {
      pahami: 'pahamiDone',
      solo: 'soloDone',
      partner: 'partnerDone',
      dinilai: 'dinilaiDone'
    };

    const field = fieldMap[stage];
    if (!field) {
      return res.status(400).json({ success: false, message: 'Stage tidak valid' });
    }

    await (prisma as any).osceSkill.updateMany({
      where: { userId, no },
      data: { [field]: Boolean(done) }
    });

    return res.status(200).json({ success: true, no, stage, done });
  } catch (err) {
    next(err);
  }
}

export async function handleUpdateOSCESkill(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.userId!;
    const no = parseInt(req.params.no, 10);
    const updated = req.body;

    if (isNaN(no)) {
      return res.status(400).json({ success: false, message: 'no tidak valid' });
    }

    await (prisma as any).osceSkill.updateMany({
      where: { userId, no },
      data: {
        ...(updated.practiceLocation !== undefined ? { practiceLocation: updated.practiceLocation } : {}),
        ...(updated.notes !== undefined ? { notes: updated.notes } : {}),
        ...(updated.pahamiDone !== undefined ? { pahamiDone: updated.pahamiDone } : {}),
        ...(updated.soloDone !== undefined ? { soloDone: updated.soloDone } : {}),
        ...(updated.partnerDone !== undefined ? { partnerDone: updated.partnerDone } : {}),
        ...(updated.dinilaiDone !== undefined ? { dinilaiDone: updated.dinilaiDone } : {})
      }
    });

    return res.status(200).json({ success: true, no });
  } catch (err) {
    next(err);
  }
}

export async function handleAddOSCESkill(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.userId!;
    const item = req.body;
    const no = parseInt(item.no, 10);

    if (isNaN(no)) {
      return res.status(400).json({ success: false, message: 'no tidak valid' });
    }

    const payload = {
      category: item.category || '',
      skillName: item.skillName || '',
      practiceLocation: item.practiceLocation || '',
      pahamiDone: Boolean(item.pahamiDone),
      soloDone: Boolean(item.soloDone),
      partnerDone: Boolean(item.partnerDone),
      dinilaiDone: Boolean(item.dinilaiDone),
      notes: item.notes || ''
    };

    const created = await (prisma as any).osceSkill.upsert({
      where: {
        userId_no: { userId, no }
      },
      create: {
        userId,
        no,
        ...payload
      },
      update: payload
    });

    return res.status(200).json({ success: true, data: created });
  } catch (err) {
    next(err);
  }
}

export async function handleDeleteOSCESkill(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.userId!;
    const no = parseInt(req.params.no, 10);

    if (isNaN(no)) {
      return res.status(400).json({ success: false, message: 'no tidak valid' });
    }

    await (prisma as any).osceSkill.deleteMany({
      where: { userId, no }
    });

    return res.status(200).json({ success: true, no });
  } catch (err) {
    next(err);
  }
}

// --- LEVELING ---
export async function handleUpdateLeveling(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.userId!;
    const { levels, badges, xpRules } = req.body;

    await prisma.levelingState.upsert({
      where: { userId },
      update: {
        ...(levels ? { levels } : {}),
        ...(badges ? { badges } : {}),
        ...(xpRules ? { xpRules } : {})
      },
      create: {
        userId,
        levels: levels || [],
        badges: badges || [],
        xpRules: xpRules || []
      }
    });

    return res.status(200).json({ success: true, message: 'Leveling updated' });
  } catch (err) {
    next(err);
  }
}

