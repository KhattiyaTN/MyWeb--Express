import { Router } from 'express';
import { upload } from '../middleware/uploadMiddleware';
import { getBadges, createBadge, updateBadge, deleteBadge } from '../controllers/badgeController';

const router = Router();

router.get('/:id', getBadges);
router.post('/', upload.array('images', 10), createBadge);
router.put('/:id', upload.array('images', 10), updateBadge);
router.delete('/:id', deleteBadge);

export default router;