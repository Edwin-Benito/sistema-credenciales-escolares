import { Router } from 'express';
import { importAlumnos } from '../controllers/importController';
import { protect } from '../middleware/authMiddleware';
import { uploadExcel } from '../middleware/uploadExcel';

const router = Router();

router.post('/', protect, uploadExcel.single('excelFile'), importAlumnos);

export default router;
