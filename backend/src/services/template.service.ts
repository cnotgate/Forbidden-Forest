import { prisma } from '../lib/prisma';
import templateData from '../data/initialData.json';

export async function seedUserTemplate(userId: string) {
  // 1. Dashboard Settings & Phases
  const dashboard: any = templateData.dashboard;
  await prisma.dashboardSettings.create({
    data: {
      userId,
      startPlanner: dashboard.startPlanner,
      ddayUKMPPD: dashboard.ddayUKMPPD,
      targetCBT: dashboard.targetCBT,
      batasAman: dashboard.batasAman,
      modes: dashboard.modes as any,
      doctorAvatar: dashboard.doctorAvatar || '🦉 Hedwig',
      doctorNickname: dashboard.doctorNickname || 'Dokter Healer ✨',
      companionMood: dashboard.companionMood || '🟢 Online'
    }
  });

  if (Array.isArray(dashboard.phases) && dashboard.phases.length > 0) {
    const sortedSeedPhases = [...dashboard.phases].sort((a: any, b: any) => {
      if (a.startDate && b.startDate) return a.startDate.localeCompare(b.startDate);
      return 0;
    });
    await prisma.clerkshipPhase.createMany({
      data: sortedSeedPhases.map((phase: any) => ({
        userId,
        name: phase.name,
        type: phase.type,
        startDate: phase.startDate,
        endDate: phase.endDate,
        durationWeeks: phase.durationWeeks,
        status: phase.status,
        mode: phase.mode,
        notes: phase.notes || ''
      }))
    });
  }

  // 2. Leveling State
  const leveling = templateData.leveling;
  await prisma.levelingState.create({
    data: {
      userId,
      levels: leveling.levels as any,
      badges: leveling.badges as any,
      xpRules: leveling.xpRules as any
    }
  });

  // 3. Roadmap Weeks
  if (Array.isArray(templateData.roadmapWeeks) && templateData.roadmapWeeks.length > 0) {
    await prisma.roadmapWeek.createMany({
      data: templateData.roadmapWeeks.map((rw: any) => ({
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

  // 4. Intensif Days
  if (Array.isArray(templateData.intensifDays) && templateData.intensifDays.length > 0) {
    await prisma.intensifDay.createMany({
      data: templateData.intensifDays.map((id: any) => ({
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
  }

  // 5. SKDI Systems
  if (Array.isArray(templateData.skdiSystems) && templateData.skdiSystems.length > 0) {
    await prisma.skdiSystem.createMany({
      data: templateData.skdiSystems.map((sys: any) => ({
        userId,
        no: sys.no,
        systemName: sys.systemName,
        clerkshipSource: sys.clerkshipSource,
        status: sys.status,
        pass1Desc: sys.pass1Desc || '',
        pass2Desc: sys.pass2Desc || '',
        pass3Desc: sys.pass3Desc || '',
        skdiNotes: sys.skdiNotes || '',
        p1Done: sys.p1Done || false,
        p2Done: sys.p2Done || false,
        p3Done: sys.p3Done || false
      }))
    });
  }

  // 6. Tryouts
  if (Array.isArray(templateData.tryouts) && templateData.tryouts.length > 0) {
    await prisma.tryoutItem.createMany({
      data: templateData.tryouts.map((to: any) => ({
        userId,
        no: to.no,
        plannedDate: to.plannedDate,
        context: to.context,
        source: to.source,
        questionsCount: to.questionsCount,
        targetScore: to.targetScore,
        actualScore: to.actualScore ?? null,
        weakTopics: to.weakTopics || '',
        notes: to.notes || ''
      }))
    });
  }

  // 7. Error Entries
  if (Array.isArray(templateData.errorEntries) && templateData.errorEntries.length > 0) {
    await prisma.errorBookItem.createMany({
      data: templateData.errorEntries.map((ee: any) => ({
        userId,
        no: ee.no,
        date: ee.date,
        source: ee.source,
        system: ee.system,
        topic: ee.topic,
        caseSummary: ee.caseSummary || '',
        myAnswer: ee.myAnswer || '',
        correctAnswer: ee.correctAnswer || '',
        errorType: ee.errorType || 'Lupa / hafalan',
        reasonWhy: ee.reasonWhy || '',
        review1Date: ee.review1Date || '',
        review7Date: ee.review7Date || '',
        review30Date: ee.review30Date || '',
        review1Done: ee.review1Done || false,
        review7Done: ee.review7Done || false,
        review30Done: ee.review30Done || false,
        status: ee.status || 'Perlu Review'
      }))
    });
  }

  // 8. OSCE Skills
  if (Array.isArray(templateData.osceSkills) && templateData.osceSkills.length > 0) {
    await prisma.osceSkill.createMany({
      data: templateData.osceSkills.map((osce: any) => ({
        userId,
        no: osce.no,
        category: osce.category,
        skillName: osce.skillName,
        practiceLocation: osce.practiceLocation || '',
        pahamiDone: osce.pahamiDone || false,
        soloDone: osce.soloDone || false,
        partnerDone: osce.partnerDone || false,
        dinilaiDone: osce.dinilaiDone || false,
        notes: osce.notes || ''
      }))
    });
  }

  // 9. Habits
  if (Array.isArray(templateData.habits) && templateData.habits.length > 0) {
    await prisma.habitItem.createMany({
      data: templateData.habits.map((h: any) => ({
        ...(h.id ? { id: h.id } : {}),
        userId,
        name: h.name,
        priority: h.priority
      }))
    });
  }

  // 10. Guidelines
  if (Array.isArray(templateData.guidelines) && templateData.guidelines.length > 0) {
    await prisma.guidelineItem.createMany({
      data: templateData.guidelines.map((g: any) => ({
        userId,
        topic: g.topic,
        detail: g.detail
      }))
    });
  }
}

export async function getUserFullState(userId: string) {
  const [
    dashboard,
    phases,
    leveling,
    roadmapWeeks,
    intensifDays,
    skdiSystems,
    tryouts,
    errorEntries,
    osceSkills,
    habits,
    dailyHabitLogs,
    guidelines
  ] = await Promise.all([
    prisma.dashboardSettings.findUnique({ where: { userId } }),
    prisma.clerkshipPhase.findMany({ where: { userId }, orderBy: { startDate: 'asc' } }),
    prisma.levelingState.findUnique({ where: { userId } }),
    prisma.roadmapWeek.findMany({ where: { userId }, orderBy: { weekNum: 'asc' } }),
    prisma.intensifDay.findMany({ where: { userId }, orderBy: { dayNum: 'asc' } }),
    prisma.skdiSystem.findMany({ where: { userId }, orderBy: { no: 'asc' } }),
    prisma.tryoutItem.findMany({ where: { userId }, orderBy: { no: 'asc' } }),
    prisma.errorBookItem.findMany({ where: { userId }, orderBy: { no: 'asc' } }),
    prisma.osceSkill.findMany({ where: { userId }, orderBy: { no: 'asc' } }),
    prisma.habitItem.findMany({ where: { userId } }),
    prisma.dailyHabitLog.findMany({ where: { userId } }),
    prisma.guidelineItem.findMany({ where: { userId } })
  ]);

  if (!dashboard || !leveling) {
    // If not seeded yet, seed now
    await seedUserTemplate(userId);
    return getUserFullState(userId);
  }

  // Canonical default habit names -> stable IDs 'habit-1' to 'habit-15'
  const canonicalHabitMap: Record<string, string> = {
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

  // Map any legacy UUIDs to canonical IDs and normalize habits
  const legacyToCanonicalHabitId: Record<string, string> = {};
  const normalizedHabits = habits.map(h => {
    const canonicalId = canonicalHabitMap[h.name];
    if (canonicalId) {
      if (h.id !== canonicalId) {
        legacyToCanonicalHabitId[h.id] = canonicalId;
      }
      return { ...h, id: canonicalId };
    }
    return h;
  });

  // Sort normalizedHabits so habit-1 to habit-15 stay in original order
  normalizedHabits.sort((a, b) => {
    const numA = parseInt(a.id.replace(/\D/g, ''), 10);
    const numB = parseInt(b.id.replace(/\D/g, ''), 10);
    if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
    return 0;
  });

  // Transform dailyHabitLogs into Record<string, DailyHabitLog> with legacy UUID reconciliation
  const dailyHabitLogsRecord: Record<string, any> = {};
  for (const log of dailyHabitLogs) {
    const rawList = Array.isArray(log.habitsDone) ? (log.habitsDone as string[]) : [];
    const reconciledList = rawList.map(id => legacyToCanonicalHabitId[id] || id);

    dailyHabitLogsRecord[log.date] = {
      date: log.date,
      level: log.level,
      habitsDone: Array.from(new Set(reconciledList)),
      note: log.note || undefined
    };
  }

  const defaultCanonicalTitles: Record<number, string> = {
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

  const legacyCorruptedTitles = new Set([
    'Koas Keren',
    'Pemburu Viagra',
    'Pembaca EKGong',
    'Neonatus Waria',
    'Biostat Beker',
    'Pejuang Passming 2',
    'Mata Juling',
    'Intensif Waria',
    'Silital Reasoner',
    'Residen Penjelajah',
    'Magister Stase'
  ]);

  const sanitizedLevels = Array.isArray(leveling.levels)
    ? (leveling.levels as any[]).map((lvl: any) => {
        if (legacyCorruptedTitles.has(lvl.title) && defaultCanonicalTitles[lvl.level]) {
          return { ...lvl, title: defaultCanonicalTitles[lvl.level] };
        }
        return lvl;
      })
    : leveling.levels;

  const sortedPhases = [...phases].sort((a: any, b: any) => {
    if (a.startDate && b.startDate) {
      const cmp = a.startDate.localeCompare(b.startDate);
      if (cmp !== 0) return cmp;
    }
    if (a.endDate && b.endDate) {
      return a.endDate.localeCompare(b.endDate);
    }
    return 0;
  });

  return {
    dashboard: {
      startPlanner: dashboard.startPlanner,
      ddayUKMPPD: dashboard.ddayUKMPPD,
      targetCBT: dashboard.targetCBT,
      batasAman: dashboard.batasAman,
      modes: dashboard.modes,
      phases: sortedPhases.map((p: any) => ({
        id: p.id,
        name: p.name,
        type: p.type,
        startDate: p.startDate,
        endDate: p.endDate,
        durationWeeks: p.durationWeeks,
        status: p.status,
        mode: p.mode,
        notes: p.notes
      })),
      doctorAvatar: dashboard.doctorAvatar || '🦉 Hedwig',
      doctorNickname: dashboard.doctorNickname || 'Dokter Healer ✨',
      companionMood: dashboard.companionMood || '🟢 Online'
    },
    leveling: {
      levels: sanitizedLevels,
      badges: leveling.badges,
      xpRules: leveling.xpRules
    },
    roadmapWeeks: roadmapWeeks.map((rw: any) => ({
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
      isDone: rw.isDone
    })),
    intensifDays: intensifDays.map((id: any) => ({
      dayNum: id.dayNum,
      date: id.date,
      dayName: id.dayName,
      type: id.type,
      focus: id.focus,
      coreActivity: id.coreActivity,
      targetQuestions: id.targetQuestions,
      targetHours: id.targetHours,
      isDone: id.isDone,
      notes: id.notes
    })),
    skdiSystems: skdiSystems.map((sys: any) => ({
      no: sys.no,
      systemName: sys.systemName,
      clerkshipSource: sys.clerkshipSource,
      status: sys.status,
      pass1Desc: sys.pass1Desc,
      pass2Desc: sys.pass2Desc,
      pass3Desc: sys.pass3Desc,
      skdiNotes: sys.skdiNotes,
      p1Done: sys.p1Done,
      p2Done: sys.p2Done,
      p3Done: sys.p3Done
    })),
    tryouts: tryouts.map((to: any) => ({
      no: to.no,
      plannedDate: to.plannedDate,
      context: to.context,
      source: to.source,
      questionsCount: to.questionsCount,
      targetScore: to.targetScore,
      actualScore: to.actualScore,
      weakTopics: to.weakTopics,
      notes: to.notes
    })),
    errorEntries: errorEntries.map((ee: any) => ({
      id: ee.id,
      no: ee.no,
      date: ee.date,
      source: ee.source,
      system: ee.system,
      topic: ee.topic,
      caseSummary: ee.caseSummary,
      myAnswer: ee.myAnswer,
      correctAnswer: ee.correctAnswer,
      errorType: ee.errorType,
      reasonWhy: ee.reasonWhy,
      review1Date: ee.review1Date,
      review7Date: ee.review7Date,
      review30Date: ee.review30Date,
      review1Done: ee.review1Done,
      review7Done: ee.review7Done,
      review30Done: ee.review30Done,
      status: ee.status
    })),
    osceSkills: osceSkills.map((o: any) => ({
      no: o.no,
      category: o.category,
      skillName: o.skillName,
      practiceLocation: o.practiceLocation,
      pahamiDone: o.pahamiDone,
      soloDone: o.soloDone,
      partnerDone: o.partnerDone,
      dinilaiDone: o.dinilaiDone,
      notes: o.notes
    })),
    habits: normalizedHabits.map((h: any) => ({
      id: h.id,
      name: h.name,
      priority: h.priority
    })),
    dailyHabitLogs: dailyHabitLogsRecord,
    guidelines: guidelines.map((g: any) => ({
      topic: g.topic,
      detail: g.detail
    }))
  };
}

export async function importFullUserState(userId: string, data: any) {
  // Use transaction to safely replace or upsert user's tracker data
  return prisma.$transaction(async (tx) => {
    // 1. Dashboard
    if (data.dashboard) {
      await tx.dashboardSettings.upsert({
        where: { userId },
        update: {
          startPlanner: data.dashboard.startPlanner,
          ddayUKMPPD: data.dashboard.ddayUKMPPD,
          targetCBT: data.dashboard.targetCBT,
          batasAman: data.dashboard.batasAman,
          modes: data.dashboard.modes || [],
          doctorAvatar: data.dashboard.doctorAvatar,
          doctorNickname: data.dashboard.doctorNickname,
          companionMood: data.dashboard.companionMood
        },
        create: {
          userId,
          startPlanner: data.dashboard.startPlanner,
          ddayUKMPPD: data.dashboard.ddayUKMPPD,
          targetCBT: data.dashboard.targetCBT,
          batasAman: data.dashboard.batasAman,
          modes: data.dashboard.modes || [],
          doctorAvatar: data.dashboard.doctorAvatar,
          doctorNickname: data.dashboard.doctorNickname,
          companionMood: data.dashboard.companionMood
        }
      });

      if (Array.isArray(data.dashboard.phases)) {
        const sortedImportPhases = [...data.dashboard.phases].sort((a: any, b: any) => {
          if (a.startDate && b.startDate) return a.startDate.localeCompare(b.startDate);
          return 0;
        });
        await tx.clerkshipPhase.deleteMany({ where: { userId } });
        await tx.clerkshipPhase.createMany({
          data: sortedImportPhases.map((p: any) => ({
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
    }

    // 2. Leveling
    if (data.leveling) {
      await tx.levelingState.upsert({
        where: { userId },
        update: {
          levels: data.leveling.levels || [],
          badges: data.leveling.badges || [],
          xpRules: data.leveling.xpRules || []
        },
        create: {
          userId,
          levels: data.leveling.levels || [],
          badges: data.leveling.badges || [],
          xpRules: data.leveling.xpRules || []
        }
      });
    }

    // 3. Roadmap
    if (Array.isArray(data.roadmapWeeks)) {
      await tx.roadmapWeek.deleteMany({ where: { userId } });
      await tx.roadmapWeek.createMany({
        data: data.roadmapWeeks.map((rw: any) => ({
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

    // 4. Intensif
    if (Array.isArray(data.intensifDays)) {
      await tx.intensifDay.deleteMany({ where: { userId } });
      await tx.intensifDay.createMany({
        data: data.intensifDays.map((id: any) => ({
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
    }

    // 5. SKDI
    if (Array.isArray(data.skdiSystems)) {
      await (tx as any).skdiSystem.deleteMany({ where: { userId } });
      await (tx as any).skdiSystem.createMany({
        data: data.skdiSystems.map((sys: any) => ({
          userId,
          no: sys.no,
          systemName: sys.systemName,
          clerkshipSource: sys.clerkshipSource,
          status: sys.status,
          pass1Desc: sys.pass1Desc || '',
          pass2Desc: sys.pass2Desc || '',
          pass3Desc: sys.pass3Desc || '',
          skdiNotes: sys.skdiNotes || '',
          p1Done: sys.p1Done || false,
          p2Done: sys.p2Done || false,
          p3Done: sys.p3Done || false
        }))
      });
    }

    // 6. Tryouts
    if (Array.isArray(data.tryouts)) {
      await tx.tryoutItem.deleteMany({ where: { userId } });
      await tx.tryoutItem.createMany({
        data: data.tryouts.map((to: any) => ({
          userId,
          no: to.no,
          plannedDate: to.plannedDate,
          context: to.context,
          source: to.source,
          questionsCount: to.questionsCount,
          targetScore: to.targetScore,
          actualScore: to.actualScore ?? null,
          weakTopics: to.weakTopics || '',
          notes: to.notes || ''
        }))
      });
    }

    // 7. Error Entries
    if (Array.isArray(data.errorEntries)) {
      await tx.errorBookItem.deleteMany({ where: { userId } });
      await tx.errorBookItem.createMany({
        data: data.errorEntries.map((ee: any) => ({
          userId,
          no: ee.no,
          date: ee.date,
          source: ee.source,
          system: ee.system,
          topic: ee.topic,
          caseSummary: ee.caseSummary || '',
          myAnswer: ee.myAnswer || '',
          correctAnswer: ee.correctAnswer || '',
          errorType: ee.errorType || 'Lupa / hafalan',
          reasonWhy: ee.reasonWhy || '',
          review1Date: ee.review1Date || '',
          review7Date: ee.review7Date || '',
          review30Date: ee.review30Date || '',
          review1Done: ee.review1Done || false,
          review7Done: ee.review7Done || false,
          review30Done: ee.review30Done || false,
          status: ee.status || 'Perlu Review'
        }))
      });
    }

    // 8. OSCE
    if (Array.isArray(data.osceSkills)) {
      await (tx as any).osceSkill.deleteMany({ where: { userId } });
      await (tx as any).osceSkill.createMany({
        data: data.osceSkills.map((osce: any) => ({
          userId,
          no: osce.no,
          category: osce.category,
          skillName: osce.skillName,
          practiceLocation: osce.practiceLocation || '',
          pahamiDone: osce.pahamiDone || false,
          soloDone: osce.soloDone || false,
          partnerDone: osce.partnerDone || false,
          dinilaiDone: osce.dinilaiDone || false,
          notes: osce.notes || ''
        }))
      });
    }

    // 9. Habits
    if (Array.isArray(data.habits)) {
      await tx.habitItem.deleteMany({ where: { userId } });
      await tx.habitItem.createMany({
        data: data.habits.map((h: any) => ({
          ...(h.id ? { id: h.id } : {}),
          userId,
          name: h.name,
          priority: h.priority
        }))
      });
    }

    // 10. Daily Habit Logs
    if (data.dailyHabitLogs && typeof data.dailyHabitLogs === 'object') {
      await tx.dailyHabitLog.deleteMany({ where: { userId } });
      const logs = Object.values(data.dailyHabitLogs) as any[];
      if (logs.length > 0) {
        await tx.dailyHabitLog.createMany({
          data: logs.map((log: any) => ({
            userId,
            date: log.date,
            level: log.level || 1,
            habitsDone: log.habitsDone || [],
            note: log.note || null
          }))
        });
      }
    }

    // Mark user as onboarded
    await tx.user.update({
      where: { id: userId },
      data: { isOnboarded: true }
    });
  });
}

