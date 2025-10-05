import { Router } from 'express';
import { upload } from '../middleware/uploadMiddleware';
import { getAllProject, createProject, updateProject, deleteProject } from '../controllers/projectController';

const router = Router();

router.get('/:id', getAllProject);
router.post('/', upload.array('images', 10), createProject);
router.patch('/:id', upload.array('images', 10), updateProject);
router.delete('/:id', deleteProject);

export default router;
