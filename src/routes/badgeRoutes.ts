import { Router } from 'express';
import { getBadges, createBadge, updateBadge, deleteBadge } from '../controllers/badgeController';

const router = Router();

router.get('/:id', getBadges);
router.post('/', createBadge);
router.put('/:id', updateBadge);
router.delete('/:id', deleteBadge);

export default router;