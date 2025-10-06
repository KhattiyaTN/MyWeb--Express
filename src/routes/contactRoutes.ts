import { Router } from 'express';
import { upload } from '../middleware/uploadMiddleware';
import { getContract, createContract, updateContract, deleteContract } from '../controllers/contractController';

const router = Router();

router.get('/:id', getContract);
router.post('/', upload.array('images', 1), createContract);
router.patch('/:id', upload.array('images', 1), updateContract);
router.delete('/:id', deleteContract);

export default router;