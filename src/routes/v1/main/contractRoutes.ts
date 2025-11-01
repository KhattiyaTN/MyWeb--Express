import { Router } from 'express';
import { getContract, createContract, updateContract, deleteContract } from '@controllers/contractController';

import { upload } from '@middleware/uploadMiddleware';
import { authenticate } from '@middleware/authMiddleware';
import { validateMiddleware } from '@middleware/validateMiddleware';
import { contractIdParamSchema, createContractSchema, updateContractSchema } from '@schemas/contractSchema';

const router = Router();

// GET
router.get(
    '/', 
    getContract
);

// POST
router.post(
    '/', 
    authenticate,
    upload.array('images', 1), 
    validateMiddleware(createContractSchema), 
    createContract
);

// PATCH
router.patch(
    '/:id',
    authenticate,
    upload.array('images', 1),
    validateMiddleware(updateContractSchema),
    updateContract
);

// DELETE
router.delete(
    '/:id',
    authenticate,
    validateMiddleware(contractIdParamSchema),
    deleteContract
);

export default router;