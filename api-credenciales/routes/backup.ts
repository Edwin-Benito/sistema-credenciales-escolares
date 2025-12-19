import express from 'express';
import { protect } from '../middleware/authMiddleware';
import { getBackup } from '../controllers/backupController';

const router = express.Router();

router.get('/db', protect, getBackup);

export default router;
