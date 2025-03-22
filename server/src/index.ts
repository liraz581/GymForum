import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/Auth';
import userRoutes from './routes/UserRoutes';
import { authenticateToken } from './middleware/AuthMiddleware';

const app: Express = express();
const PORT: number = 5000;

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.get('/protected', authenticateToken, (req: Request, res: Response) => {
    res.json({ message: 'Protected route accessed successfully', user: req.user });
});

const MONGO_URI = 'mongodb://localhost:27017/gymforum';

mongoose.connect(MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('MongoDB connection error:', error));

app.use('/auth', authRoutes);
app.use('/user', userRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});