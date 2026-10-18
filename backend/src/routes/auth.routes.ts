import { Router } from 'express';
import {
	handleRegister,
	handleLogin,
	handleGoogleLogin,
	handleRefreshToken,
	handleLogout,
	handleGetMe,
	handleUpdateProfile,
	handleDeleteAccount,
} from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.post('/register', handleRegister);
router.post('/login', handleLogin);
router.post('/google', handleGoogleLogin);
router.post('/refresh', handleRefreshToken);
router.post('/logout', handleLogout);
router.get('/me', authMiddleware, handleGetMe);
router.put('/profile', authMiddleware, handleUpdateProfile);
router.delete('/account', authMiddleware, handleDeleteAccount);

export default router;
