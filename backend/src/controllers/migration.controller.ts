import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { importFullUserState, getUserFullState } from '../services/template.service';

export async function handleImportLocalStorage(req: AuthenticatedRequest, res: Response, next: NextFunction) {
	try {
		const userId = req.userId!;
		const localState = req.body;

		if (!localState || typeof localState !== 'object') {
			return res.status(400).json({
				success: false,
				message: 'Payload data lokal tidak valid.',
			});
		}

		await importFullUserState(userId, localState);
		const updatedState = await getUserFullState(userId);

		return res.status(200).json({
			success: true,
			message: 'Seluruh riwayat latihan dan pengaturan berhasil dipindahkan ke cloud! ☁️✨',
			data: {
				state: updatedState,
			},
		});
	} catch (err) {
		next(err);
	}
}
