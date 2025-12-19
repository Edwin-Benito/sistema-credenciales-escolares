import { Router } from 'express';
import { getAllCiclos, createCiclo, activarCiclo } from '../controllers/cicloController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.get('/', protect, getAllCiclos);
router.post('/', protect, createCiclo);
router.put('/:id/activar', protect, activarCiclo);

export default router;
