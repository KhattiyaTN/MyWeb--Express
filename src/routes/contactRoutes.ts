import { Router } from 'express';
import { getContract, createContract, updateContract, deleteContract } from '../controllers/contractController';

const router = Router();

router.get('/', getContract);
router.post('/', createContract);
router.patch('/:id', updateContract);
router.delete('/:id', deleteContract);

export default router;