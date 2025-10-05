import { Router } from 'express';
import { upload } from '../middleware/uploadMiddleware';
import { getProfile, createProfile, updateProfile, deleteProfile } from '../controllers/profileController';

const router = Router();

router.get('/:id', getProfile);
router.post('/', upload.array('images', 10), createProfile);
router.patch('/:id', upload.array('images', 10), updateProfile);
router.delete('/:id', deleteProfile);

export default router;