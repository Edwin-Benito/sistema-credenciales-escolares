import { Router } from 'express';
import { getAllUsers, createUser, setUserStatus } from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.get('/', protect, getAllUsers);
router.post('/', protect, createUser);
router.put('/:id/estatus', protect, setUserStatus);

export default router;
