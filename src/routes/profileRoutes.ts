import { Router } from 'express';
import { upload } from '../middleware/uploadMiddleware';
import { getProfile, createProfile, updateProfile, deleteProfile } from '../controllers/profileController';

const router = Router();

router.get('/:id', getProfile);
router.post('/', upload.array('images', 1), createProfile);
router.patch('/:id', upload.array('images', 1), updateProfile);
router.delete('/:id', deleteProfile);

export default router;