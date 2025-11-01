import { Router } from 'express';
import { getProfile, createProfile, updateProfile, deleteProfile } from '@controllers/profileController';

import { authenticate } from '@middleware/authMiddleware';
import { upload } from '@middleware/uploadMiddleware';
import { validateMiddleware } from '@middleware/validateMiddleware';
import { profileIdParamSchema, createProfileSchema, updateProfileSchema } from '@schemas/profileSchema';

const router = Router();

// GET
router.get(
    '/', 
    getProfile
);

// POST
router.post(
    '/',
    authenticate,
    upload.array('images', 1), 
    validateMiddleware(createProfileSchema), 
    createProfile
);

// PATCH
router.patch(
    '/:id', 
    authenticate,
    upload.array('images', 1),
    validateMiddleware(updateProfileSchema),
    updateProfile
);

// DELETE
router.delete(
    '/:id', 
    authenticate,
    validateMiddleware(profileIdParamSchema),
    deleteProfile
);

export default router;