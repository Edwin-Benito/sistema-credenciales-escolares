import { Router } from 'express';
import { getAllGrados, createGrado, deleteGrado } from '../controllers/gradoController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);

router.get('/', getAllGrados);
router.post('/', createGrado);
router.delete('/:id', deleteGrado);

export default router;
