import { Router } from 'express';
import { loginUser } from '@controllers/auth/loginController';
import { registerUser } from '@controllers/auth/registerController';
import { logoutUser } from '@controllers/auth/logoutController';
import { refreshToken } from '@controllers/auth/refreshTokenController';
import { loginLimiter, refreshLimiter } from '@config/rateLimit';

import { validateMiddleware } from '@middleware/validateMiddleware';
import { loginSchema, registerSchema, logoutSchema, refreshSchema } from '@schemas/auth/authSchema';

const router = Router();

router.post(
    '/register', 
    validateMiddleware(registerSchema), 
    registerUser
);
router.post(
    '/login', 
    loginLimiter, 
    validateMiddleware(loginSchema), 
    loginUser
);
router.post(
    '/logout', 
    validateMiddleware(logoutSchema), 
    logoutUser
);
router.post(
    '/refresh', 
    refreshLimiter, 
    validateMiddleware(refreshSchema), 
    refreshToken
);

export default router;