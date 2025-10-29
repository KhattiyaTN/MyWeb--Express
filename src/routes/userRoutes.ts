import { Router } from 'express';
import { getUser, createUser, updateUser } from '@controllers/userController';

import { authenticate } from '@middleware/authMiddleware';
import { validateMiddleware } from '@middleware/validateMiddleware';
import { createUserSchema, updateUserSchema } from '@schemas/userSchema';

const router = Router();

// GET
router.get(
    '/', 
    getUser
);

// POST
router.post(
    '/',
    authenticate,
    validateMiddleware(createUserSchema), 
    createUser
);

// PATCH
router.patch(
    '/:id', 
    authenticate,
    validateMiddleware(updateUserSchema), 
    updateUser
);

export default router;