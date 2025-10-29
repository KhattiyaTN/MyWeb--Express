import { Router } from 'express';
import { upload } from '@middleware/uploadMiddleware';
import { getProjects, createProject, updateProject, deleteProject } from '@controllers/projectController';

import {validateMiddleware} from '@middleware/validateMiddleware';
import { createProjectSchema, updateProjectSchema, projectIdParamSchema } from '@schemas/projectSchema';

const router = Router();

// GET
router.get(
    '/',
    getProjects
);

// POST
router.post(
    '/',
    upload.array('images', 10),
    validateMiddleware(createProjectSchema),
    createProject
);

// PATCH
router.patch(
    '/:id',
    upload.array('images', 10),
    validateMiddleware(updateProjectSchema),
    updateProject
);

// DELETE
router.delete(
    '/:id',
    validateMiddleware(projectIdParamSchema),
    deleteProject
);

export default router;
