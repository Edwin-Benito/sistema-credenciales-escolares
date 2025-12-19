import { Router } from 'express';
import { getEscuelaInfo, updateEscuelaInfo } from '../controllers/escuelaController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);

router.get('/', getEscuelaInfo);
router.put('/', updateEscuelaInfo);

export default router;
