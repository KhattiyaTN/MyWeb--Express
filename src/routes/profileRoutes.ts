import { Router } from 'express';
import { getProfile, createProfile, updateProfile, deleteProfile } from '../controllers/profileController';

const router = Router();

router.get('/:id', getProfile);
router.post('/', createProfile);
router.patch('/:id', updateProfile);
router.delete('/:id', deleteProfile);

export default router;