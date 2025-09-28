import { Router } from 'express';
import { getCert, createCert, updateCert, deleteCert } from '../controllers/certController';

const router = Router();

router.get('/', getCert);
router.post('/', createCert);
router.patch('/:id', updateCert);
router.delete('/:id', deleteCert);

export default router;