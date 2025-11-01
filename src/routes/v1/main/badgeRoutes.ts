import { Router } from 'express';
import { getBadges, createBadge, updateBadge, deleteBadge } from '@controllers/badgeController';

import { authenticate } from '@middleware/authMiddleware';
import { upload } from '@middleware/uploadMiddleware';
import { validateMiddleware } from '@middleware/validateMiddleware';
import { createBadgeSchema, updateBadgeSchema, badgeIdParamSchema } from '@schemas/badgeSchema';

const router = Router();

// GET
router.get(
    '/', 
    getBadges
);

// POST
router.post(
    '/',
    authenticate,
    upload.array('images', 1), 
    validateMiddleware(createBadgeSchema), 
    createBadge
);

// PATCH
router.patch(
    '/:id',
    authenticate,
    upload.array('images', 1), 
    validateMiddleware(updateBadgeSchema), 
    updateBadge
);

// DELETE
router.delete(
    '/:id',
    authenticate,
    validateMiddleware(badgeIdParamSchema), 
    deleteBadge
);

export default router;