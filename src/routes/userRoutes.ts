import { Router } from 'express';
import { getUsers, createUser, updateUser } from '../controllers/userController.ts';

const router = Router();

router.get('/', getUsers);
router.post('/', createUser);
router.patch('/:id', updateUser);

export default router;