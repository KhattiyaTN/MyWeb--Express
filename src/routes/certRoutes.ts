import { Router } from 'express';
import { upload } from '@middleware/uploadMiddleware';
import { getCerts, createCert, updateCert, deleteCert } from '@controllers/certController';

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
    upload.array('images', 1), 
    validateMiddleware(createCertSchema), 
    createCert
);

// PATCH
router.patch(
    '/:id', 
    upload.array('images', 1), 
    validateMiddleware(updateCertSchema), 
    updateCert
);

// DELETE
router.delete(
    '/:id', 
    validateMiddleware(certIdParamSchema), 
    deleteCert
);

export default router;