import { Router } from 'express';
import { upload } from '@middleware/uploadMiddleware';
import { getProjects, createProject, updateProject, deleteProject } from '@controllers/projectController';

const router = Router();

router.get('/', getProjects);
router.post('/', upload.array('images', 10), createProject);
router.patch('/:id', upload.array('images', 10), updateProject);
router.delete('/:id', deleteProject);

export default router;
