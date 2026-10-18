import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { getUserFullState } from '../services/template.service';

const onboardingSchema = z.object({
	doctorNickname: z.string().min(1, 'Panggilan dokter wajib diisi'),
	doctorAvatar: z.string().default('🦉 Hedwig'),
	companionMood: z.string().default('🟢 Online'),
	ddayUKMPPD: z.string().optional(),
	targetCBT: z.number().min(0).max(100).optional(),
	batasAman: z.number().min(0).max(100).optional(),
});

export async function handleCompleteOnboarding(req: AuthenticatedRequest, res: Response, next: NextFunction) {
	try {
		const userId = req.userId!;
		const validated = onboardingSchema.parse(req.body);

		// Update DashboardSettings
		await prisma.dashboardSettings.update({
			where: { userId },
			data: {
				doctorNickname: validated.doctorNickname,
				doctorAvatar: validated.doctorAvatar,
				companionMood: validated.companionMood,
				...(validated.ddayUKMPPD ? { ddayUKMPPD: validated.ddayUKMPPD } : {}),
				...(validated.targetCBT !== undefined ? { targetCBT: validated.targetCBT } : {}),
				...(validated.batasAman !== undefined ? { batasAman: validated.batasAman } : {}),
			},
		});

		// Mark user as onboarded
		await prisma.user.update({
			where: { id: userId },
			data: { isOnboarded: true },
		});

		const fullState = await getUserFullState(userId);

		return res.status(200).json({
			success: true,
			message: 'Selamat datang di Sanctum Dokter! Onboarding selesai ✨',
			data: {
				state: fullState,
			},
		});
	} catch (err: any) {
		if (err instanceof z.ZodError) {
			return res.status(400).json({
				success: false,
				message: err.errors[0]?.message || 'Validasi onboarding gagal',
			});
		}
		next(err);
	}
}
