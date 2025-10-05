import { Router } from 'express';
import { upload } from '../middleware/uploadMiddleware';
import { getCerts, createCert, updateCert, deleteCert } from '../controllers/certController';

const router = Router();

router.get('/', getCerts);
router.post('/', upload.array('images', 10), createCert);
router.patch('/:id', upload.array('images', 10), updateCert);
router.delete('/:id', deleteCert);

export default router;