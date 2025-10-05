import { Router } from 'express';
import { upload } from '../middleware/uploadMiddleware';
import { getBadges, createBadge, updateBadge, deleteBadge } from '../controllers/badgeController';

const router = Router();

router.get('/:id', getBadges);
router.post('/', upload.array('images', 1), createBadge);
router.put('/:id', upload.array('images', 1), updateBadge);
router.delete('/:id', deleteBadge);

export default router;