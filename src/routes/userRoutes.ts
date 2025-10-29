import { Router } from 'express';
import { getUser, createUser, updateUser } from '@controllers/userController.ts';

import { validateMiddleware } from '@middleware/validateMiddleware';
import { createUserSchema, updateUserSchema } from '@schemas/userSchema';

const router = Router();

router.get('/', getUser);
router.post('/', validateMiddleware(createUserSchema), createUser);
router.patch('/:id', validateMiddleware(updateUserSchema), updateUser);

export default router;