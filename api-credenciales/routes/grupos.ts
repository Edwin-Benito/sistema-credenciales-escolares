import { Router } from 'express';
import { getAllGrupos, createGrupo, deleteGrupo } from '../controllers/grupoController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);

router.get('/', getAllGrupos);
router.post('/', createGrupo);
router.delete('/:id', deleteGrupo);

export default router;
