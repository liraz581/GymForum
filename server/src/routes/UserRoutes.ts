import express, { Router, RequestHandler } from 'express';
import { authenticateToken } from '../middleware/AuthMiddleware';
import User from '../models/User';
import upload from '../middleware/Multer'
import path from "path";
import sharp from "sharp";
import * as fs from "node:fs";

const router = Router();

const userImagesDirectory = path.join(__dirname, '../uploads/users');

const updateUsername: RequestHandler = async (req, res) => {
    try {
        const { username } = req.body;

        if (!username) {
            res.status(400).json({ message: 'Username is required' });
            return;
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { username },
            { new: true }
        );

        if (!updatedUser) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const { password, ...userWithoutPassword } = updatedUser.toObject();
        res.json(userWithoutPassword);
    } catch (error) {
        res.status(500).json({ message: 'Error updating username' });
    }
};

const updateImage: RequestHandler = async (req, res) => {
    try {
        if (!req.file) {
            res.status(400).json({ message: 'Image is required' });
            return;
        }

        const imagePath = path.join(userImagesDirectory, `${Date.now()}-${req.file.originalname}`);
        await sharp(req.file.buffer)
            .resize(800, 800, { fit: 'inside' })
            .toFile(imagePath);

        const imageUrl = `${path.basename(imagePath)}`;

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { imageUrl },
            { new: true }
        );

        if (!updatedUser) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const { password, ...userWithoutPassword } = updatedUser.toObject();
        res.json(userWithoutPassword);
    } catch (error) {
        console.error('Error updating image:', error);
        res.status(500).json({ message: 'Error updating image' });
    }
};

router.patch('/username', authenticateToken, express.json(), updateUsername);
router.patch('/image', authenticateToken, upload.single('image'), updateImage);

export default router;