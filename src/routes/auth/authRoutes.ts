import { Router } from 'express';
import { loginUser } from '../../controllers/auth/loginController';
import { registerUser } from '../../controllers/auth/registerController';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

export default router;
