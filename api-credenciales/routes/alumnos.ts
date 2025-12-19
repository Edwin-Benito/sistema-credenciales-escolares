import { Router } from 'express';
import { getAllAlumnos, createAlumno, getAlumnoById, getInscripcionesByAlumnoId } from '../controllers/alumnoController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);

// Tabla 4: Alumnos
router.get('/', getAllAlumnos);
router.post('/', createAlumno);
router.get('/:id', getAlumnoById);

// Tabla 5: Inscripciones (historial del alumno)
router.get('/:id/inscripciones', getInscripcionesByAlumnoId);

export default router;
