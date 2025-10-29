import { Router } from 'express';
import { upload } from '@middleware/uploadMiddleware';
import { getProfile, createProfile, updateProfile, deleteProfile } from '@controllers/profileController';

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
    upload.array('images', 1), 
    validateMiddleware(createProfileSchema), 
    createProfile
);

// PATCH
router.patch(
    '/:id', 
    upload.array('images', 1), 
    validateMiddleware(updateProfileSchema), 
    updateProfile
);

// DELETE
router.delete(
    '/:id', 
    validateMiddleware(profileIdParamSchema), 
    deleteProfile
);

export default router;