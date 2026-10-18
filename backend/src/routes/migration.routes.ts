import { Router } from 'express';
import { handleImportLocalStorage } from '../controllers/migration.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.post('/import-local', authMiddleware, handleImportLocalStorage);

export default router;
