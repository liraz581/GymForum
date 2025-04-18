import express, { Express, Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import https from "https"
import fs from "fs";

import authRoutes from './routes/Auth';
import userRoutes from './routes/UserRoutes';
import postRoutes from './routes/PostRoutes';
import likeRoutes from "./routes/LikeRoutes";
import commentsRoutes from "./routes/CommentsRoutes";
import aiRoutes from "./routes/AiRoutes";

import { authenticateToken } from './middleware/AuthMiddleware';
import path from "path";

import { setupSwaggerDocs } from './swagger';
import './swaggerDocs';

const app: Express = express();
const PORT = process.env.PORT || 5000;

const allowedOrigin = (process.env.NODE_ENV !== 'production') ? 'http://localhost:3000' : `https://10.10.246.143:${PORT}`;

app.use(cors({
    origin: allowedOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.get('/protected', authenticateToken, (req: Request, res: Response) => {
    res.json({ message: 'Protected route accessed successfully', user: req.user });
});

const MONGO_URI = process.env.MONGO_URI ? process.env.MONGO_URI : 'mongodb://localhost:27017/gymforum';

mongoose.connect(MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('MongoDB connection error:', error));

app.use('/posts', postRoutes);
app.use('/user', userRoutes);

app.use(express.json());
app.use('/auth', authRoutes);
app.use('/likes', likeRoutes);
app.use('/api', commentsRoutes);
app.use('/ai', aiRoutes);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

if (process.env.NODE_ENV !== 'production') {
    setupSwaggerDocs(app);
}

export default app;
