import { Router } from 'express';
import { getUser, createUser, updateUser } from '../../controllers/auth/authController.ts';

const router = Router();

router.get('/:id', getUser);
router.post('/', createUser);
router.patch('/:id', updateUser);

export default router;