import { Router } from 'express';
import { loginUser } from '../../controllers/auth/loginController';
import { registerUser } from '../../controllers/auth/registerController';
import { logoutUser } from '../../controllers/auth/logoutController';
import { refreshToken } from '../../controllers/auth/refreshTokenController';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/refresh', refreshToken);

export default router;