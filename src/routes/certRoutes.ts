import { Router } from 'express';
import { getCerts, createCert, updateCert, deleteCert } from '@controllers/certController';

import { authenticate } from '@middleware/authMiddleware';
import { upload } from '@middleware/uploadMiddleware';
import { validateMiddleware } from '@middleware/validateMiddleware';
import { certIdParamSchema, createCertSchema, updateCertSchema } from '@schemas/certSchema';

const router = Router();

// GET
router.get(
    '/', 
    getCerts
);

// POST
router.post(
    '/',
    authenticate, 
    upload.array('images', 1), 
    validateMiddleware(createCertSchema), 
    createCert
);

// PATCH
router.patch(
    '/:id', 
    authenticate,
    upload.array('images', 1),
    validateMiddleware(updateCertSchema),
    updateCert
);

// DELETE
router.delete(
    '/:id', 
    authenticate,
    validateMiddleware(certIdParamSchema),
    deleteCert
);

export default router;