import { Router } from 'express';
import { handleCompleteOnboarding } from '../controllers/onboarding.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.post('/complete', authMiddleware, handleCompleteOnboarding);

export default router;
