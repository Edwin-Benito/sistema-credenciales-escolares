import express from 'express';
import { protect } from '../middleware/authMiddleware';
import { generatePdf } from '../controllers/pdfController';

const router = express.Router();

router.get('/generar-pdf', protect, generatePdf);

export default router;
