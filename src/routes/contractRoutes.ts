import { Router } from 'express';
import { upload } from '@middleware/uploadMiddleware';
import { getContract, createContract, updateContract, deleteContract } from '@controllers/contractController';

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
    upload.array('images', 1), 
    validateMiddleware(createContractSchema), 
    createContract
);

// PATCH
router.patch(
    '/:id', 
    upload.array('images', 1), 
    validateMiddleware(updateContractSchema), 
    updateContract
);

// DELETE
router.delete(
    '/:id', 
    validateMiddleware(contractIdParamSchema), 
    deleteContract
);

export default router;