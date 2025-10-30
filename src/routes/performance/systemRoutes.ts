import { Router } from 'express';
import { healthz, readyz } from '@controllers/performance/systemController';

const router = Router();

router.get('/healthz', healthz);
router.get('/readyz', readyz);

export default router;