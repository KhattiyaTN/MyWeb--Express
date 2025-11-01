import { Router } from 'express';
import authRoutes from '@routes/v1/auth/authRoutes';
import badgeRoutes from '@routes/v1/main/badgeRoutes';
import certRoutes from '@routes/v1/main/certRoutes';
import contractRoutes from '@routes/v1/main/contractRoutes';
import profileRoutes from '@routes/v1/main/profileRoutes';
import projectRoutes from '@routes/v1/main/projectRoutes';
import userRoutes from '@routes/v1/main/userRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/badges', badgeRoutes);
router.use('/certs', certRoutes);
router.use('/contracts', contractRoutes);
router.use('/profiles', profileRoutes);
router.use('/projects', projectRoutes);
router.use('/users', userRoutes);

export default router;