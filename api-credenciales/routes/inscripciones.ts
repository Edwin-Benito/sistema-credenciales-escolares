import { Router } from 'express';
import { uploadFotoInscripcion, cambiarGrupo, crearInscripcion, getInscripcionesPorCiclo, eliminarInscripcion } from '../controllers/inscripcionController';
import { protect } from '../middleware/authMiddleware';
import { uploadFoto } from '../middleware/uploadMiddleware';

const router = Router();

router.post('/:id/foto', protect, uploadFoto.single('foto'), uploadFotoInscripcion);
router.put('/cambiar-grupo', protect, cambiarGrupo);
router.post('/', protect, crearInscripcion);
router.get('/por-ciclo', protect, getInscripcionesPorCiclo);
router.delete('/:id', protect, eliminarInscripcion);

export default router;
