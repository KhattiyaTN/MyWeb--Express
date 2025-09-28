import { Router } from 'express';
import { getCerts, createCert, updateCert, deleteCert } from '../controllers/certController';

const router = Router();

router.get('/', getCerts);
router.post('/', createCert);
router.patch('/:id', updateCert);
router.delete('/:id', deleteCert);

export default router;