import express from 'express';
import userRoutes from './routes/userRoutes';
import certRoutes from './routes/certRoutes';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again after 15 minutes'
})

app.use(helmet());
app.use(limiter);
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/certs', certRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => { console.log(`Server is running on port ${PORT}`)});
