import { Router } from 'express';
import { upload } from '@middleware/uploadMiddleware';
import { getBadges, createBadge, updateBadge, deleteBadge } from '@controllers/badgeController';

import { validateMiddleware } from '@middleware/validateMiddleware';
import { createBadgeSchema, updateBadgeSchema } from '@schemas/badgeSchema';

const router = Router();

// GET
router.get(
    '/', 
    getBadges
);

// POST
router.post(
    '/', 
    upload.array('images', 1), 
    validateMiddleware(createBadgeSchema), 
    createBadge
);

// PATCH
router.patch(
    '/:id', 
    upload.array('images', 1), 
    validateMiddleware(updateBadgeSchema), 
    updateBadge
);

// DELETE
router.delete(
    '/:id', 
    deleteBadge
);

export default router;