import { Router } from 'express';
import { upload } from '../middleware/uploadMiddleware';
import { getUser, createUser, updateUser } from '../controllers/userController.ts';

const router = Router();

router.get('/:id', getUser);
router.post('/', upload.array('images', 1), createUser);
router.patch('/:id', upload.array('images', 1), updateUser);

export default router;