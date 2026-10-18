import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../services/auth.service';

export interface AuthenticatedRequest extends Request {
	userId?: string;
	userEmail?: string;
}

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
	try {
		let token: string | undefined;

		// Check Authorization header
		const authHeader = req.headers.authorization;
		if (authHeader && authHeader.startsWith('Bearer ')) {
			token = authHeader.substring(7);
		} else if (req.cookies && req.cookies.access_token) {
			token = req.cookies.access_token;
		}

		if (!token) {
			return res.status(401).json({
				success: false,
				message: 'Akses ditolak. Sesi tidak ditemukan atau kedaluwarsa.',
			});
		}

		const decoded = verifyAccessToken(token);
		req.userId = decoded.userId;
		req.userEmail = decoded.email;
		next();
	} catch (error) {
		return res.status(401).json({
			success: false,
			message: 'Token otentikasi tidak valid atau telah kedaluwarsa.',
		});
	}
}
