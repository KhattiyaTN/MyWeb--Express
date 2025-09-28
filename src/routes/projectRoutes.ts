import { Router } from 'express';
import { getAllProject, createProject, updateProject, deleteProject } from '../controllers/projectController';

const router = Router();

router.get('/:id', getAllProject);
router.post('/', createProject);
router.patch('/:id', updateProject);
router.delete('/:id', deleteProject);

export default router;
